"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { isWebAuthnAvailable } from "@/lib/security/webauthn";

export type BiometricLoginState = "idle" | "active" | "success" | "error";

export interface BiometricLoginProps {
  /** Email del usuario para buscar credenciales */
  email?: string;
  /** Callback cuando la autenticación es exitosa */
  onSuccess: () => void;
  /** Callback cuando hay un error */
  onError?: (error: string) => void;
  /** Texto personalizado debajo del icono */
  label?: string;
  /** Tamaño del componente (sm, md, lg) */
  size?: "sm" | "md" | "lg";
  /** Modo: 'login' para iniciar sesión, 'authorize' para autorizar transacciones */
  mode?: "login" | "authorize";
  /** Deshabilitar el componente */
  disabled?: boolean;
}

/**
 * Componente de Login Biométrico estilo Banco Digital (Nubank/Binance)
 * Usa WebAuthn (Passkeys) para autenticación rápida y segura
 */
export default function BiometricLogin({
  email,
  onSuccess,
  onError,
  label,
  size = "lg",
  mode = "login",
  disabled = false,
}: BiometricLoginProps) {
  const [state, setState] = useState<BiometricLoginState>("idle");
  const [isAvailable, setIsAvailable] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Verificar disponibilidad de WebAuthn
  useEffect(() => {
    if (typeof window !== "undefined") {
      const available = isWebAuthnAvailable();
      setIsAvailable(available);
      if (!available) {
        setState("error");
      }
    }
  }, []);

  // Vibración al tocar
  const vibrate = useCallback((pattern: number | number[]) => {
    if (typeof window !== "undefined" && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  }, []);

  // Función principal de autenticación WebAuthn
  const handleBiometricAuth = useCallback(async () => {
    if (!isAvailable || disabled || state === "active" || state === "success") {
      return;
    }

    setState("active");
    setErrorMessage(null);
    vibrate(50); // Vibración al iniciar

    try {
      // Generar challenge aleatorio
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);

      // Buscar credenciales guardadas del usuario
      // En producción, esto vendría del servidor
      const storedCredentialId = email
        ? localStorage.getItem(`legal-py-webauthn-${email}`)
        : null;

      // Opciones de autenticación WebAuthn
      const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
        challenge,
        ...(storedCredentialId
          ? {
              allowCredentials: [
                {
                  id: Uint8Array.from(
                    atob(storedCredentialId),
                    (c) => c.charCodeAt(0)
                  ),
                  type: "public-key",
                  transports: ["internal", "hybrid"], // FaceID, TouchID, USB, NFC
                },
              ],
            }
          : {
              // Si no hay credencial guardada, permitir cualquier autenticador
              userVerification: "required",
            }),
        timeout: 60000,
      };

      // Llamar a la API WebAuthn
      const assertion = await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions,
      }) as PublicKeyCredential;

      if (!assertion) {
        throw new Error("Autenticación cancelada");
      }

      // Éxito: vibración doble y animación
      vibrate([50, 30, 50]);
      setState("success");

      // En producción, aquí se verificaría la firma con el servidor
      // Por ahora, simulamos un pequeño delay para la animación
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Llamar callback de éxito
      onSuccess();

      // Resetear después de 1.5s
      setTimeout(() => {
        setState("idle");
      }, 1500);
    } catch (error: any) {
      // Manejo de errores amigables
      let friendlyError = "Error al autenticar. Intenta nuevamente.";

      if (error.name === "NotAllowedError" || error.name === "NotSupportedError") {
        friendlyError = "Biometría no disponible en este dispositivo.";
      } else if (error.name === "InvalidStateError") {
        friendlyError = "No tienes biometría registrada. Regístrate primero.";
      } else if (error.name === "UnknownError") {
        friendlyError = "Error desconocido. Verifica tu dispositivo.";
      } else if (error.message?.includes("cancelado") || error.name === "AbortError") {
        friendlyError = "Autenticación cancelada.";
        setState("idle");
        return; // No mostrar error si el usuario canceló
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
  }, [isAvailable, disabled, state, email, vibrate, onSuccess, onError]);

  // Si no está disponible, no renderizar
  if (!isAvailable) {
    return null;
  }

  // Tamaños
  const sizes = {
    sm: { container: "w-20 h-20", icon: "w-10 h-10" },
    md: { container: "w-32 h-32", icon: "w-16 h-16" },
    lg: { container: "w-40 h-40", icon: "w-24 h-24" },
  };

  const currentSize = sizes[size];

  // Labels por defecto
  const defaultLabel =
    label ||
    (mode === "authorize"
      ? "Toca para autorizar"
      : "Toca para iniciar sesión");

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Contenedor del icono biométrico */}
      <motion.button
        onClick={handleBiometricAuth}
        disabled={disabled || state === "active" || state === "success"}
        className={`relative ${currentSize.container} flex items-center justify-center rounded-full bg-gradient-to-br from-[#C9A24D]/20 to-[#C08457]/20 border-2 border-[#C9A24D]/40 cursor-pointer transition-all hover:border-[#C9A24D]/60 focus:outline-none focus:ring-2 focus:ring-[#C9A24D]/50 disabled:opacity-50 disabled:cursor-not-allowed ${
          state === "error" ? "border-red-500/40" : ""
        }`}
        whileTap={{ scale: 0.95 }}
      >
        {/* Ripples de onda (solo en estado active) */}
        <AnimatePresence>
          {state === "active" && (
            <>
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={`ripple-${i}`}
                  className="absolute inset-0 rounded-full border-2 border-[#C9A24D]"
                  initial={{ scale: 0.8, opacity: 0.8 }}
                  animate={{
                    scale: 2.5,
                    opacity: 0,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: "easeOut",
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>

        {/* Glow effect en estado active */}
        {state === "active" && (
          <motion.div
            className="absolute inset-0 rounded-full bg-[#C9A24D]/20 blur-xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}

        {/* Icono: Huella o Check */}
        <AnimatePresence mode="wait">
          {state === "success" ? (
            // Check verde (morph desde huella)
            <motion.div
              key="check"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="flex items-center justify-center"
            >
              <svg
                className={`${currentSize.icon} text-green-400`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <motion.path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5 }}
                />
              </svg>
            </motion.div>
          ) : state === "error" ? (
            // Icono de error
            <motion.div
              key="error"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center justify-center"
            >
              <svg
                className={`${currentSize.icon} text-red-400`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </motion.div>
          ) : (
            // Huella dactilar (estado idle/active)
            <motion.div
              key="fingerprint"
              animate={
                state === "idle"
                  ? {
                      scale: [1, 1.05, 1],
                      opacity: [0.7, 1, 0.7],
                    }
                  : {
                      scale: 1.1,
                      opacity: 1,
                    }
              }
              transition={
                state === "idle"
                  ? {
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }
                  : { duration: 0.2 }
              }
              className="flex items-center justify-center"
            >
              <svg
                className={`${currentSize.icon} text-[#C9A24D]`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
              >
                {/* Huella dactilar vectorizada */}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.213 1.213A1.5 1.5 0 0121.5 18.5v-2.25a.75.75 0 00-.75-.75h-2.25a.75.75 0 00-.75.75v2.25a1.5 1.5 0 01-.75 1.298l-1.213-1.213M5 14.5l-1.213-1.213A1.5 1.5 0 010 13.25v-2.25a.75.75 0 01.75-.75h2.25a.75.75 0 01.75.75v2.25a1.5 1.5 0 01-.75 1.298L5 14.5z"
                />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Spinner de carga (estado active) */}
        {state === "active" && (
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#C9A24D]"
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        )}
      </motion.button>

      {/* Label y mensaje de error */}
      <div className="text-center min-h-[3rem]">
        <AnimatePresence mode="wait">
          {errorMessage ? (
            <motion.p
              key="error"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="text-sm text-red-400 font-medium"
            >
              {errorMessage}
            </motion.p>
          ) : state === "success" ? (
            <motion.p
              key="success"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="text-sm text-green-400 font-medium"
            >
              {mode === "authorize" ? "Autorizado" : "Autenticado"}
            </motion.p>
          ) : (
            <motion.p
              key="label"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm text-white/70 font-medium"
            >
              {defaultLabel}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
