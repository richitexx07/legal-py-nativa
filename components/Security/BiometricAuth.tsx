"use client";

/**
 * BiometricAuth - Smart Fingerprint Login (Banking Grade)
 * 
 * Componente de autenticación biométrica estilo Nubank/Binance/Stripe
 * Implementación profesional de WebAuthn/Passkeys para Legal PY
 * 
 * CARACTERÍSTICAS:
 * - WebAuthn nativo (NO hacks, NO mocks)
 * - Compatible con: TouchID, FaceID, Windows Hello, Android Biometrics
 * - UI/UX premium banking grade
 * - Animaciones fluidas con Framer Motion
 * - Feedback háptico (vibración)
 * - Manejo profesional de errores
 * - Preparado para producción con backend
 * 
 * ARQUITECTURA BACKEND:
 * - Login: POST /api/webauthn/login/options → POST /api/webauthn/login/verify
 * - Payment: POST /api/webauthn/payment/options → POST /api/webauthn/payment/verify
 * 
 * CONTEXT BINDING (Pagos):
 * - Challenge ligado a: userId, amount, currency, transactionId
 * - Backend valida contexto antes de aceptar firma
 * - Previene modificación de monto (replay attacks)
 * 
 * SEGURIDAD:
 * - Challenge único por request (generado en backend)
 * - Expiración: 60s
 * - Validación: origin, rpId, signCount, credentialID
 * - Protección contra replay attacks
 * - HTTPS obligatorio
 * - Verificación de autenticador de plataforma
 * 
 * @author Legal PY Security Team
 * @version 4.0.0 - Banking Grade Premium
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ============================================================================
// TYPES
// ============================================================================

export type BiometricAuthState = "idle" | "active" | "success" | "error";

export interface BiometricAuthProps {
  /** Callback cuando la autenticación es exitosa */
  onSuccess: () => void;
  /** Callback opcional cuando hay un error */
  onError?: (error: string) => void;
  /** Modo de uso: 'login' para inicio de sesión, 'payment' para autorización de pagos */
  mode?: "login" | "payment";
  /** Deshabilitar el componente */
  disabled?: boolean;
  /** Email del usuario (opcional, para buscar credenciales guardadas) */
  email?: string;
  /** Tamaño del componente */
  size?: "sm" | "md" | "lg";
  /** Contexto de pago (solo para mode="payment") - Se enviará al backend para context binding */
  paymentContext?: {
    userId: string;
    amount: number;
    currency: string;
    transactionId: string;
  };
  /** Modo demo: true = simula sin backend, false = usa backend real */
  isDemoMode?: boolean;
}

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Verifica si WebAuthn está disponible en el navegador
 * Esta es la verificación MÍNIMA que deben hacer todos los bancos
 */
function isWebAuthnAvailable(): boolean {
  if (typeof window === "undefined") return false;
  return typeof window.PublicKeyCredential !== "undefined";
}

/**
 * Verifica si hay un autenticador de plataforma disponible (TouchID, FaceID, etc.)
 * Esta es la verificación REAL que usan los bancos digitales
 * 
 * IMPORTANTE: Esta verificación es ASÍNCRONA porque consulta el hardware
 */
async function isPlatformAuthenticatorAvailable(): Promise<boolean> {
  if (typeof window === "undefined" || !window.PublicKeyCredential) {
    return false;
  }

  try {
    // Esta es la API REAL que usan Nubank, Binance, Stripe
    const available = await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    return available;
  } catch {
    return false;
  }
}

/**
 * Vibración háptica (solo si está disponible)
 * Banking grade: feedback físico inmediato
 */
function vibrate(pattern: number | number[]): void {
  if (typeof window !== "undefined" && navigator.vibrate) {
    try {
      navigator.vibrate(pattern);
    } catch {
      // Silenciar errores de vibración (algunos navegadores no soportan)
    }
  }
}

/**
 * Genera un challenge aleatorio seguro (32 bytes)
 * En producción, esto debe venir del backend
 */
function generateChallenge(): Uint8Array {
  const challenge = new Uint8Array(32);
  if (typeof window !== "undefined" && window.crypto) {
    window.crypto.getRandomValues(challenge);
  }
  return challenge;
}

/**
 * Convierte ArrayBuffer a base64 (para enviar al backend)
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Convierte base64 a ArrayBuffer (para recibir del backend)
 */
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function BiometricAuth({
  onSuccess,
  onError,
  mode = "login",
  disabled = false,
  email,
  size = "lg",
  paymentContext,
  isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true",
}: BiometricAuthProps) {
  const [state, setState] = useState<BiometricAuthState>("idle");
  const [isAvailable, setIsAvailable] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // ========================================================================
  // VERIFICACIÓN DE DISPONIBILIDAD (al montar)
  // ========================================================================
  
  useEffect(() => {
    const checkAvailability = async () => {
      // 1. Verificar que WebAuthn existe
      if (!isWebAuthnAvailable()) {
        setIsAvailable(false);
        return;
      }

      // 2. Verificar que hay un autenticador de plataforma REAL
      // Esta es la verificación que hacen Nubank, Binance, Stripe
      const platformAvailable = await isPlatformAuthenticatorAvailable();
      setIsAvailable(platformAvailable);
    };

    checkAvailability();
  }, []);

  // Limpiar abort controller al desmontar
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // ========================================================================
  // FUNCIÓN PRINCIPAL DE AUTENTICACIÓN
  // ========================================================================
  
  /**
   * Implementa el flujo challenge-response estándar de WebAuthn
   * 
   * FLUJO PRODUCCIÓN:
   * 1. POST /api/webauthn/{mode}/options → recibe challenge del servidor
   * 2. navigator.credentials.get() → usuario autentica con biometría
   * 3. POST /api/webauthn/{mode}/verify → backend valida firma
   * 
   * FLUJO DEMO:
   * - Simula el flujo sin backend real
   * - Challenge generado localmente
   * - Verificación simulada
   */
  const handleAuthenticate = useCallback(async () => {
    // Validaciones previas
    if (!isAvailable || disabled || state === "active" || state === "success") {
      return;
    }

    // Validar contexto de pago si es necesario
    if (mode === "payment" && !isDemoMode && !paymentContext) {
      const error = "Contexto de pago requerido para autorización biométrica";
      setErrorMessage(error);
      setState("error");
      if (onError) onError(error);
      return;
    }

    // Cancelar cualquier autenticación previa
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Crear nuevo AbortController para esta autenticación
    abortControllerRef.current = new AbortController();

    // Cambiar a estado activo
    setState("active");
    setErrorMessage(null);
    
    // Vibración háptica fuerte al iniciar (banking grade)
    vibrate(50);

    try {
      let challenge: Uint8Array;
      let publicKeyOptions: PublicKeyCredentialRequestOptions;

      if (isDemoMode) {
        // ====================================================================
        // MODO DEMO: Generar challenge localmente (simulación)
        // ====================================================================
        challenge = generateChallenge();
      } else {
        // ====================================================================
        // MODO PRODUCCIÓN: Obtener challenge del backend
        // ====================================================================
        const endpoint = mode === "payment" 
          ? "/api/webauthn/payment/options"
          : "/api/webauthn/login/options";
        
        const optionsResponse = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            ...(mode === "payment" && paymentContext ? {
              userId: paymentContext.userId,
              amount: paymentContext.amount,
              currency: paymentContext.currency,
              transactionId: paymentContext.transactionId,
            } : {}),
          }),
        });

        if (!optionsResponse.ok) {
          throw new Error(`Error obteniendo opciones: ${optionsResponse.statusText}`);
        }

        const options = await optionsResponse.json();
        
        // El backend devuelve el challenge en base64
        challenge = new Uint8Array(
          Uint8Array.from(atob(options.challenge), (c) => c.charCodeAt(0))
        );
        
        // Construir opciones desde la respuesta del backend
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

      // Si estamos en demo, construir opciones localmente
      if (isDemoMode) {
        // Buscar credenciales guardadas (si hay email) - Solo en demo
        let allowCredentials: PublicKeyCredentialDescriptor[] | undefined;
        if (email) {
          const storedCredentialId = localStorage.getItem(`legal-py-webauthn-${email}`);
          if (storedCredentialId) {
            allowCredentials = [
              {
                id: base64ToArrayBuffer(storedCredentialId),
                type: "public-key",
                transports: ["internal", "hybrid"], // FaceID, TouchID, USB, NFC
              },
            ];
          }
        }

        // Configurar opciones de autenticación WebAuthn (demo)
        publicKeyOptions = {
          challenge: challenge.buffer as ArrayBuffer,
          ...(allowCredentials
            ? { allowCredentials }
            : {
                // Si no hay credencial específica, permitir cualquier autenticador de plataforma
                userVerification: "required",
              }),
          timeout: 60000, // 60 segundos
          rpId: window.location.hostname, // Relying Party ID
        };
      }

      // ====================================================================
      // LLAMAR A LA API WEBAUTHN NATIVA
      // Esta es la única forma correcta de hacerlo (NO hacks)
      // ====================================================================
      const assertion = (await navigator.credentials.get({
        publicKey: publicKeyOptions,
        signal: abortControllerRef.current.signal,
      })) as PublicKeyCredential | null;

      if (!assertion) {
        throw new Error("Autenticación cancelada");
      }

      // Extraer datos de la respuesta
      const response = assertion.response as AuthenticatorAssertionResponse;
      const authenticatorData = response.authenticatorData;
      const clientDataJSON = response.clientDataJSON;
      const signature = response.signature;
      const userHandle = response.userHandle;

      // Verificar con el backend (producción) o simular (demo)
      if (isDemoMode) {
        // MODO DEMO: Simular verificación exitosa
        await new Promise((resolve) => setTimeout(resolve, 500));
      } else {
        // MODO PRODUCCIÓN: Enviar al backend para verificación real
        const verifyEndpoint = mode === "payment"
          ? "/api/webauthn/payment/verify"
          : "/api/webauthn/login/verify";

        const verifyResponse = await fetch(verifyEndpoint, {
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
            ...(mode === "payment" && paymentContext ? {
              // Context binding: backend valida que el contexto coincida
              userId: paymentContext.userId,
              amount: paymentContext.amount,
              currency: paymentContext.currency,
              transactionId: paymentContext.transactionId,
            } : {}),
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
      }

      // Éxito: vibración doble premium (banking grade)
      vibrate([50, 30, 50]);
      setState("success");

      // Pequeño delay para la animación de éxito
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Llamar callback de éxito
      onSuccess();

      // Resetear después de 1.5s
      setTimeout(() => {
        setState("idle");
      }, 1500);
    } catch (error: any) {
      // ====================================================================
      // MANEJO PROFESIONAL DE ERRORES WEBAUTHN
      // ====================================================================
      let friendlyError = "Error al autenticar. Intenta nuevamente.";

      if (error.name === "AbortError" || error.name === "NotAllowedError") {
        // Usuario canceló - no mostrar error (comportamiento estándar de bancos)
        setState("idle");
        return;
      } else if (error.name === "NotSupportedError") {
        friendlyError = "Biometría no soportada en este dispositivo.";
      } else if (error.name === "InvalidStateError") {
        friendlyError = "No tienes biometría registrada. Regístrate primero.";
      } else if (error.name === "SecurityError") {
        friendlyError = "Error de seguridad. Verifica que estés en HTTPS.";
      } else if (error.name === "UnknownError") {
        friendlyError = "Error desconocido. Verifica tu dispositivo.";
      } else if (error.message?.includes("cancelado")) {
        setState("idle");
        return;
      } else if (error.message) {
        // Errores del backend
        friendlyError = error.message;
      }

      setErrorMessage(friendlyError);
      setState("error");
      if (onError) {
        onError(friendlyError);
      }

      // Resetear después de 2s
      setTimeout(() => {
        setState("idle");
        setErrorMessage(null);
      }, 2000);
    }
  }, [isAvailable, disabled, state, email, mode, paymentContext, isDemoMode, onSuccess, onError]);

  // ========================================================================
  // RENDER: Si no está disponible, NO renderizar (como los bancos reales)
  // ========================================================================
  
  if (!isAvailable) {
    return null;
  }

  // Tamaños del componente (más grandes para mejor UX móvil)
  const sizes = {
    sm: { container: "w-24 h-24", icon: "w-12 h-12", ripple: "w-24 h-24" },
    md: { container: "w-36 h-36", icon: "w-20 h-20", ripple: "w-36 h-36" },
    lg: { container: "w-48 h-48", icon: "w-28 h-28", ripple: "w-48 h-48" },
  };

  const currentSize = sizes[size];

  // Textos dinámicos según el modo
  const labels = {
    idle: mode === "payment" 
      ? (isDemoMode ? "🎯 Demo: Toca para autorizar pago" : "Toca para autorizar el pago")
      : (isDemoMode ? "🎯 Demo: Toca para iniciar sesión" : "Toca para iniciar sesión"),
    active: mode === "payment" ? "Autorizando..." : "Verificando...",
    success: mode === "payment" ? "✓ Pago autorizado" : "✓ Autenticado",
    error: errorMessage || "Error al autenticar",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      {/* Contenedor del icono biométrico - Banking Grade Design */}
      <motion.button
        onClick={handleAuthenticate}
        disabled={disabled || state === "active" || state === "success"}
        className={`relative ${currentSize.container} flex items-center justify-center rounded-full bg-gradient-to-br from-[#0E1B2A] via-[#13253A] to-[#0E1B2A] border-2 ${
          state === "error"
            ? "border-red-500/50"
            : state === "success"
            ? "border-green-500/50"
            : "border-[#C9A24D]/40"
        } cursor-pointer transition-all hover:border-[#C9A24D]/60 focus:outline-none focus:ring-4 focus:ring-[#C9A24D]/20 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl`}
        whileTap={{ scale: 0.96 }}
        whileHover={state === "idle" ? { scale: 1.02 } : {}}
        initial={false}
      >
        {/* Fondo con efecto de profundidad */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#C9A24D]/5 to-transparent" />

        {/* Ripples de onda premium (solo en estado active) - Estilo Nubank */}
        <AnimatePresence>
          {state === "active" && (
            <>
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={`ripple-${i}`}
                  className={`absolute ${currentSize.ripple} rounded-full border-2 border-[#C9A24D]`}
                  initial={{ scale: 0.9, opacity: 0.9 }}
                  animate={{
                    scale: [0.9, 3.5],
                    opacity: [0.9, 0],
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.25,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                  style={{
                    left: "50%",
                    top: "50%",
                    x: "-50%",
                    y: "-50%",
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>

        {/* Glow effect pulsante en estado active - Premium Banking */}
        {state === "active" && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full bg-[#C9A24D]/30 blur-2xl"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.4, 0.7, 0.4],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute inset-0 rounded-full bg-[#C9A24D]/20 blur-xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.3,
              }}
            />
          </>
        )}

        {/* Icono: Huella o Check con animaciones premium */}
        <AnimatePresence mode="wait">
          {state === "success" ? (
            // Check verde brillante con morphing suave
            <motion.div
              key="check"
              initial={{ scale: 0, rotate: -180, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0, rotate: 180, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
              className="flex items-center justify-center relative z-10"
            >
              {/* Glow verde alrededor del check */}
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
            // Icono de error con shake premium
            <motion.div
              key="error"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                x: [0, -8, 8, -8, 8, 0],
                rotate: [0, -5, 5, -5, 5, 0],
              }}
              transition={{
                scale: { duration: 0.2 },
                x: { duration: 0.6, ease: "easeInOut" },
                rotate: { duration: 0.6, ease: "easeInOut" },
              }}
              className="flex items-center justify-center relative z-10"
            >
              <svg
                className={`${currentSize.icon} text-red-400 drop-shadow-lg`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </motion.div>
          ) : (
            // Huella dactilar con animación de respiración suave
            <motion.div
              key="fingerprint"
              animate={
                state === "idle"
                  ? {
                      scale: [1, 1.08, 1],
                      opacity: [0.85, 1, 0.85],
                    }
                  : {
                      scale: 1.15,
                      opacity: 1,
                    }
              }
              transition={
                state === "idle"
                  ? {
                      duration: 2.5,
                      repeat: Infinity,
                      ease: [0.4, 0, 0.6, 1],
                    }
                  : { duration: 0.3, ease: "easeOut" }
              }
              className="flex items-center justify-center relative z-10"
            >
              {/* SVG de huella dactilar vectorizada premium - Estilo Banking Grade */}
              <svg
                className={`${currentSize.icon} text-[#C9A24D] drop-shadow-lg`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Huella dactilar reconocible - estilo Nubank/Binance */}
                <path d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.213 1.213A1.5 1.5 0 0121.5 18.5v-2.25a.75.75 0 00-.75-.75h-2.25a.75.75 0 00-.75.75v2.25a1.5 1.5 0 01-.75 1.298l-1.213-1.213M5 14.5l-1.213-1.213A1.5 1.5 0 010 13.25v-2.25a.75.75 0 01.75-.75h2.25a.75.75 0 01.75.75v2.25a1.5 1.5 0 01-.75 1.298L5 14.5z" />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Spinner de carga premium (estado active) */}
        {state === "active" && (
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#C9A24D] border-r-[#C9A24D]/50"
            animate={{ rotate: 360 }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{ filter: "drop-shadow(0 0 8px rgba(201, 162, 77, 0.5))" }}
          />
        )}

        {/* Partículas de éxito (solo en success) */}
        {state === "success" && (
          <AnimatePresence>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`particle-${i}`}
                className="absolute w-2 h-2 rounded-full bg-green-400"
                initial={{
                  x: 0,
                  y: 0,
                  scale: 0,
                  opacity: 1,
                }}
                animate={{
                  x: Math.cos((i / 8) * Math.PI * 2) * 60,
                  y: Math.sin((i / 8) * Math.PI * 2) * 60,
                  scale: [0, 1, 0],
                  opacity: [1, 1, 0],
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.05,
                  ease: "easeOut",
                }}
                style={{
                  left: "50%",
                  top: "50%",
                  x: "-50%",
                  y: "-50%",
                }}
              />
            ))}
          </AnimatePresence>
        )}
      </motion.button>

      {/* Label y mensaje de estado - Banking Style */}
      <div className="text-center min-h-[3.5rem] flex items-center justify-center">
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
      </div>
    </div>
  );
}
