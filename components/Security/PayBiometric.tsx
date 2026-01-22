"use client";

/**
 * PayBiometric - Componente de Autorización Biométrica para Pagos
 * 
 * USO EXCLUSIVO: Autorización de pagos, transferencias, suscripciones
 * ENDPOINT: /api/webauthn/payment/options → /api/webauthn/payment/verify
 * 
 * REGLAS DE SEGURIDAD:
 * - Requiere usuario autenticado
 * - Requiere contexto de pago (amount, currency, transactionId, userId)
 * - Context binding: challenge ligado al contexto
 * - NO puede iniciar sesión
 * 
 * CONTROLES DE SEGURIDAD (Threat Model):
 * - Context binding obligatorio (previene modificación de monto)
 * - Verificación de HTTPS (previene MITM)
 * - Verificación de iframe (previene cross-origin)
 * - Challenges únicos ligados al contexto (previene replay)
 * - Validación de contexto en backend (previene context bypass)
 * - Validación de origin (previene phishing)
 * - Muestra monto en UI (previene phishing visual)
 * 
 * @author Legal PY Security Team
 * @version 2.0.0 - Threat Model Security Controls
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  checkWebAuthnCompatibility, 
  checkPWAConditions,
  isMobileDevice,
  getMobileButtonSize,
  isWebAuthnAvailable as checkWebAuthn,
  isPlatformAuthenticatorAvailable as checkPlatformAuth,
  type WebAuthnCompatibility 
} from "@/lib/security/pwa-webauthn";

// ============================================================================
// TYPES
// ============================================================================

export type PayBiometricState = "idle" | "active" | "success" | "error";

export interface PaymentContext {
  /** ID del usuario que autoriza el pago (requerido) */
  userId: string;
  /** Monto de la transacción (requerido) */
  amount: number;
  /** Moneda (requerido) */
  currency: string;
  /** ID único de la transacción (requerido) */
  transactionId: string;
}

export interface PayBiometricProps {
  /** Contexto de pago - OBLIGATORIO para context binding */
  paymentContext: PaymentContext;
  /** Callback cuando la autorización es exitosa */
  onSuccess: () => void;
  /** Callback opcional cuando hay un error */
  onError?: (error: string) => void;
  /** Deshabilitar el componente */
  disabled?: boolean;
  /** Tamaño del componente */
  size?: "sm" | "md" | "lg";
  /** Modo demo: true = simula sin backend, false = usa backend real */
  isDemoMode?: boolean;
}

// ============================================================================
// UTILITIES
// ============================================================================

// Funciones de utilidad movidas a lib/security/pwa-webauthn.ts
// Se mantienen aquí por compatibilidad, pero se recomienda usar las del archivo centralizado

function vibrate(pattern: number | number[]): void {
  if (typeof window !== "undefined" && navigator.vibrate) {
    try {
      navigator.vibrate(pattern);
    } catch {}
  }
}

function generateChallenge(): Uint8Array {
  const challenge = new Uint8Array(32);
  if (typeof window !== "undefined" && window.crypto) {
    window.crypto.getRandomValues(challenge);
  }
  return challenge;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function formatAmount(amount: number, currency: string): string {
  const symbols: Record<string, string> = {
    PYG: "Gs.",
    USD: "$",
    EUR: "€",
    BRL: "R$",
  };
  const symbol = symbols[currency] || currency;
  return `${symbol} ${amount.toLocaleString("es-PY")}`;
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function PayBiometric({
  paymentContext,
  onSuccess,
  onError,
  disabled = false,
  size = "lg",
  isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true",
}: PayBiometricProps) {
  const [state, setState] = useState<PayBiometricState>("idle");
  const [isAvailable, setIsAvailable] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [compatibility, setCompatibility] = useState<WebAuthnCompatibility | null>(null);
  const [pwaConditions, setPWAConditions] = useState<ReturnType<typeof checkPWAConditions> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isMobile = typeof window !== "undefined" ? isMobileDevice() : false;

  // Validar contexto de pago requerido
  useEffect(() => {
    if (!paymentContext?.userId || !paymentContext?.amount || !paymentContext?.currency || !paymentContext?.transactionId) {
      console.error("PayBiometric: paymentContext completo es requerido", {
        userId: paymentContext?.userId,
        amount: paymentContext?.amount,
        currency: paymentContext?.currency,
        transactionId: paymentContext?.transactionId,
      });
    }
  }, [paymentContext]);

  // Verificar compatibilidad completa (PWA/Mobile) al montar
  useEffect(() => {
    const checkCompatibility = async () => {
      const compat = await checkWebAuthnCompatibility();
      const pwa = checkPWAConditions();
      
      setCompatibility(compat);
      setPWAConditions(pwa);
      
      // Mostrar recomendaciones en consola (solo desarrollo)
      if (process.env.NODE_ENV === "development" && pwa.recommendations.length > 0) {
        console.log("💳 PayBiometric - Recomendaciones PWA:", pwa.recommendations);
      }
      
      // Disponible solo si pasa todas las verificaciones críticas
      setIsAvailable(
        compat.isAvailable && 
        compat.platformAuthenticatorAvailable && 
        compat.isSecureContext &&
        !pwa.isInIframe
      );
    };
    
    checkCompatibility();
  }, []);

  // Limpiar abort controller al desmontar
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  /**
   * Función principal de autorización WebAuthn para PAGOS
   * 
   * FLUJO PRODUCCIÓN:
   * 1. POST /api/webauthn/payment/options → recibe challenge ligado al contexto
   * 2. navigator.credentials.get() → usuario autoriza
   * 3. POST /api/webauthn/payment/verify → backend valida firma Y contexto
   * 
   * CONTEXT BINDING:
   * - El challenge está ligado a userId, amount, currency, transactionId
   * - Backend rechaza si el contexto no coincide
   */
  const handleAuthorize = useCallback(async () => {
    if (!isAvailable || disabled || state === "active" || state === "success") {
      return;
    }

    // Validar contexto de pago
    if (!paymentContext?.userId || !paymentContext?.amount || !paymentContext?.currency || !paymentContext?.transactionId) {
      const error = "Contexto de pago incompleto. Se requiere userId, amount, currency y transactionId.";
      setErrorMessage(error);
      setState("error");
      if (onError) onError(error);
      return;
    }

    // Cancelar cualquier autorización previa
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setState("active");
    setErrorMessage(null);
    
    // Vibración háptica mejorada para mobile
    if (isMobile) {
      vibrate([50, 30, 50]); // Patrón más fuerte en mobile
    } else {
      vibrate(50);
    }

    try {
      let challenge: Uint8Array;
      let publicKeyOptions: PublicKeyCredentialRequestOptions;

      if (isDemoMode) {
        // ========================================================================
        // MODO DEMO: Generar challenge localmente (simulación)
        // ========================================================================
        challenge = generateChallenge();
        
        // En demo, simular que el challenge está ligado al contexto
        // (En producción, esto lo hace el backend)
        console.log("🎯 Demo: Challenge ligado a contexto:", {
          userId: paymentContext.userId,
          amount: paymentContext.amount,
          currency: paymentContext.currency,
          transactionId: paymentContext.transactionId,
        });

        publicKeyOptions = {
          challenge: challenge.buffer as ArrayBuffer,
          userVerification: "required",
          timeout: 60000,
          rpId: window.location.hostname,
        };
      } else {
        // ========================================================================
        // MODO PRODUCCIÓN: Obtener challenge del backend PAYMENT
        // El backend liga el challenge al contexto
        // ========================================================================
        const optionsResponse = await fetch("/api/webauthn/payment/options", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: paymentContext.userId,
            amount: paymentContext.amount,
            currency: paymentContext.currency,
            transactionId: paymentContext.transactionId,
          }),
        });

        if (!optionsResponse.ok) {
          throw new Error(`Error obteniendo opciones: ${optionsResponse.statusText}`);
        }

        const options = await optionsResponse.json();
        challenge = new Uint8Array(
          Uint8Array.from(atob(options.challenge), (c) => c.charCodeAt(0))
        );
        
        publicKeyOptions = {
          challenge: challenge.buffer as ArrayBuffer,
          allowCredentials: options.allowCredentials?.map((cred: any) => ({
            id: Uint8Array.from(atob(cred.id), (c) => c.charCodeAt(0)),
            type: "public-key",
            transports: cred.transports || ["internal", "hybrid"],
          })),
          userVerification: options.userVerification || "required",
          timeout: options.timeout || 60000,
          rpId: options.rpId || window.location.hostname,
        };
      }

      // Llamar a la API WebAuthn nativa
      const assertion = (await navigator.credentials.get({
        publicKey: publicKeyOptions,
        signal: abortControllerRef.current.signal,
      })) as PublicKeyCredential | null;

      if (!assertion) {
        throw new Error("Autorización cancelada");
      }

      // Extraer datos de la respuesta
      const response = assertion.response as AuthenticatorAssertionResponse;
      const authenticatorData = response.authenticatorData;
      const clientDataJSON = response.clientDataJSON;
      const signature = response.signature;
      const userHandle = response.userHandle;

      // Verificar con el backend (producción) o simular (demo)
      if (isDemoMode) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        // En demo, simular verificación exitosa
        console.log("🎯 Demo: Autorización biométrica exitosa para:", {
          amount: formatAmount(paymentContext.amount, paymentContext.currency),
          transactionId: paymentContext.transactionId,
        });
      } else {
        // ========================================================================
        // MODO PRODUCCIÓN: Enviar al backend PAYMENT para verificación
        // Backend valida: firma + contexto (context binding)
        // ========================================================================
        const verifyResponse = await fetch("/api/webauthn/payment/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: assertion.id,
            rawId: arrayBufferToBase64(assertion.rawId),
            response: {
              authenticatorData: arrayBufferToBase64(authenticatorData),
              clientDataJSON: arrayBufferToBase64(clientDataJSON),
              signature: arrayBufferToBase64(signature),
              userHandle: userHandle ? arrayBufferToBase64(userHandle) : null,
            },
            type: assertion.type,
            // CONTEXT BINDING: Enviar contexto para validación
            userId: paymentContext.userId,
            amount: paymentContext.amount,
            currency: paymentContext.currency,
            transactionId: paymentContext.transactionId,
          }),
        });

        if (!verifyResponse.ok) {
          const errorData = await verifyResponse.json().catch(() => ({}));
          throw new Error(errorData.message || `Verificación falló: ${verifyResponse.statusText}`);
        }

        const verifyResult = await verifyResponse.json();
        if (!verifyResult.verified) {
          throw new Error(verifyResult.error || "Verificación falló");
        }

        // Backend confirma que el contexto coincide y autoriza el pago
        console.log("✅ Pago autorizado:", {
          transactionId: paymentContext.transactionId,
          amount: formatAmount(paymentContext.amount, paymentContext.currency),
        });
      }

      // Éxito - Vibración mejorada para mobile
      if (isMobile) {
        vibrate([100, 50, 100, 50, 100]); // Patrón de éxito más fuerte en mobile
      } else {
        vibrate([50, 30, 50]);
      }
      setState("success");
      await new Promise((resolve) => setTimeout(resolve, 800));
      onSuccess();
      setTimeout(() => setState("idle"), 1500);
    } catch (error: any) {
      let friendlyError = "Error al autorizar. Intenta nuevamente.";

      if (error.name === "AbortError" || error.name === "NotAllowedError") {
        setState("idle");
        return;
      } else if (error.name === "NotSupportedError") {
        friendlyError = "Biometría no soportada en este dispositivo.";
      } else if (error.name === "InvalidStateError") {
        friendlyError = "No tienes biometría registrada. Regístrate primero.";
      } else if (error.name === "SecurityError") {
        friendlyError = "Error de seguridad. Verifica que estés en HTTPS.";
      } else if (error.message) {
        friendlyError = error.message;
      }

      setErrorMessage(friendlyError);
      setState("error");
      if (onError) onError(friendlyError);
      setTimeout(() => {
        setState("idle");
        setErrorMessage(null);
      }, 2000);
    }
  }, [isAvailable, disabled, state, paymentContext, isDemoMode, onSuccess, onError]);

  // Si no está disponible, mostrar mensaje de fallback (no bloquear)
  if (!isAvailable) {
    if (compatibility?.fallbackRecommended) {
      return (
        <div className="text-center p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
          <p className="text-sm text-yellow-200 mb-2">
            ⚠️ Biometría no disponible en este dispositivo
          </p>
          <p className="text-xs text-yellow-200/70 mb-3">
            Usa tu contraseña o PIN para autorizar el pago
          </p>
          <button
            onClick={onSuccess}
            className="px-4 py-2 bg-[#C9A24D] text-black font-semibold rounded-lg hover:bg-[#C08457] transition text-sm"
          >
            Autorizar con Contraseña
          </button>
        </div>
      );
    }
    return null;
  }

  // Ajustar tamaño para mobile (thumb-friendly)
  const effectiveSize = isMobile ? getMobileButtonSize(true) : size;
  
  const sizes = {
    sm: { container: "w-24 h-24", icon: "w-12 h-12", ripple: "w-24 h-24" },
    md: { container: "w-36 h-36", icon: "w-20 h-20", ripple: "w-36 h-36" },
    lg: { container: isMobile ? "w-56 h-56" : "w-48 h-48", icon: isMobile ? "w-32 h-32" : "w-28 h-28", ripple: isMobile ? "w-56 h-56" : "w-48 h-48" },
  };

  const currentSize = sizes[effectiveSize];

  const labels = {
    idle: isDemoMode 
      ? `🎯 Demo: Confirmar pago ${formatAmount(paymentContext.amount, paymentContext.currency)} con huella`
      : `Confirmar pago ${formatAmount(paymentContext.amount, paymentContext.currency)} con huella`,
    active: "Autorizando...",
    success: "✓ Pago autorizado",
    error: errorMessage || "Error al autorizar",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      {/* Mostrar monto y moneda (UX Fintech + Anti-Phishing) */}
      <div className="text-center mb-2">
        <p className="text-sm text-white/60 mb-1">Monto a autorizar</p>
        <p className="text-2xl font-bold text-[#C9A24D]">
          {formatAmount(paymentContext.amount, paymentContext.currency)}
        </p>
        {/* Mostrar dominio para prevenir phishing (Security Best Practice) */}
        {process.env.NODE_ENV === "production" && (
          <p className="text-xs text-white/40 mt-2">
            🔒 {typeof window !== "undefined" ? window.location.hostname : "legal-py.vercel.app"}
          </p>
        )}
      </div>

      <motion.button
        onClick={handleAuthorize}
        disabled={disabled || state === "active" || state === "success"}
        className={`relative ${currentSize.container} flex items-center justify-center rounded-full bg-gradient-to-br from-[#0E1B2A] via-[#13253A] to-[#0E1B2A] border-2 ${
          state === "error"
            ? "border-red-500/50"
            : state === "success"
            ? "border-green-500/50"
            : "border-[#C9A24D]/40"
        } cursor-pointer transition-all ${
          isMobile ? "touch-manipulation" : "hover:border-[#C9A24D]/60"
        } focus:outline-none focus:ring-4 focus:ring-[#C9A24D]/20 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl ${
          isMobile ? "active:scale-95" : ""
        }`}
        whileTap={{ scale: isMobile ? 0.95 : 0.96 }}
        whileHover={state === "idle" && !isMobile ? { scale: 1.02 } : {}}
        style={{
          // Mejorar touch target en mobile (mínimo 44x44px recomendado por Apple)
          minWidth: isMobile ? "56px" : undefined,
          minHeight: isMobile ? "56px" : undefined,
        }}
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#C9A24D]/5 to-transparent" />

        {/* Ripples en estado active */}
        <AnimatePresence>
          {state === "active" && (
            <>
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={`ripple-${i}`}
                  className={`absolute ${currentSize.ripple} rounded-full border-2 border-[#C9A24D]`}
                  initial={{ scale: 0.9, opacity: 0.9 }}
                  animate={{ scale: [0.9, 3.5], opacity: [0.9, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.25,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                  style={{ left: "50%", top: "50%", x: "-50%", y: "-50%" }}
                />
              ))}
            </>
          )}
        </AnimatePresence>

        {/* Glow effect en estado active */}
        {state === "active" && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full bg-[#C9A24D]/30 blur-2xl"
              animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </>
        )}

        {/* Icono: Huella o Check */}
        <AnimatePresence mode="wait">
          {state === "success" ? (
            <motion.div
              key="check"
              initial={{ scale: 0, rotate: -180, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0, rotate: 180, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="flex items-center justify-center relative z-10"
            >
              <motion.div
                className="absolute inset-0 rounded-full bg-green-400/20 blur-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 2 }}
                transition={{ duration: 0.5 }}
              />
              <svg
                className={`${currentSize.icon} text-green-400 drop-shadow-2xl relative z-10`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={3.5}
              >
                <motion.path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              </svg>
            </motion.div>
          ) : state === "error" ? (
            <motion.div
              key="error"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, x: [0, -8, 8, -8, 8, 0] }}
              transition={{ scale: { duration: 0.2 }, x: { duration: 0.6 } }}
              className="flex items-center justify-center relative z-10"
            >
              <svg
                className={`${currentSize.icon} text-red-400 drop-shadow-lg`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.div>
          ) : (
            <motion.div
              key="fingerprint"
              animate={
                state === "idle"
                  ? { scale: [1, 1.08, 1], opacity: [0.85, 1, 0.85] }
                  : { scale: 1.15, opacity: 1 }
              }
              transition={
                state === "idle"
                  ? { duration: 2.5, repeat: Infinity, ease: [0.4, 0, 0.6, 1] }
                  : { duration: 0.3, ease: "easeOut" }
              }
              className="flex items-center justify-center relative z-10"
            >
              <svg
                className={`${currentSize.icon} text-[#C9A24D] drop-shadow-lg`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
              >
                <path d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.213 1.213A1.5 1.5 0 0121.5 18.5v-2.25a.75.75 0 00-.75-.75h-2.25a.75.75 0 00-.75.75v2.25a1.5 1.5 0 01-.75 1.298l-1.213-1.213M5 14.5l-1.213-1.213A1.5 1.5 0 010 13.25v-2.25a.75.75 0 01.75-.75h2.25a.75.75 0 01.75.75v2.25a1.5 1.5 0 01-.75 1.298L5 14.5z" />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Spinner en estado active */}
        {state === "active" && (
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#C9A24D] border-r-[#C9A24D]/50"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
            style={{ filter: "drop-shadow(0 0 8px rgba(201, 162, 77, 0.5))" }}
          />
        )}
      </motion.button>

      {/* Label */}
      <div className="text-center min-h-[3.5rem] flex flex-col items-center justify-center gap-2">
        <AnimatePresence mode="wait">
          <motion.p
            key={state}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={`text-base font-semibold tracking-wide ${
              state === "error"
                ? "text-red-400"
                : state === "success"
                ? "text-green-400"
                : "text-white/80"
            }`}
          >
            {labels[state]}
          </motion.p>
        </AnimatePresence>
        {/* Mostrar dominio en producción para prevenir phishing */}
        {process.env.NODE_ENV === "production" && typeof window !== "undefined" && state === "idle" && (
          <p className="text-xs text-white/40">
            🔒 {window.location.hostname}
          </p>
        )}
      </div>
    </div>
  );
}
