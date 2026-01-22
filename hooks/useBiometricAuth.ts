"use client";

import { useState, useCallback } from "react";
import { authenticateWebAuthn } from "@/lib/security/webauthn";

export interface UseBiometricAuthResult {
  /** Estado de la autenticación */
  isAuthenticating: boolean;
  /** Función para iniciar autenticación biométrica */
  authenticate: (email?: string) => Promise<boolean>;
  /** Mensaje de error (si hay) */
  error: string | null;
  /** Limpiar error */
  clearError: () => void;
}

/**
 * Hook para usar autenticación biométrica en modales de pago/autorización
 * 
 * @example
 * ```tsx
 * const { authenticate, isAuthenticating, error } = useBiometricAuth();
 * 
 * const handlePayment = async () => {
 *   const success = await authenticate(userEmail);
 *   if (success) {
 *     // Proceder con el pago
 *   }
 * };
 * ```
 */
export function useBiometricAuth(): UseBiometricAuthResult {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const authenticate = useCallback(
    async (email?: string): Promise<boolean> => {
      setIsAuthenticating(true);
      setError(null);

      try {
        const result = await authenticateWebAuthn(undefined, email);

        if (result.success) {
          setIsAuthenticating(false);
          return true;
        } else {
          setError(result.error || "Error al autenticar");
          setIsAuthenticating(false);
          return false;
        }
      } catch (err: any) {
        const errorMessage = err.message || "Error inesperado al autenticar";
        setError(errorMessage);
        setIsAuthenticating(false);
        return false;
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isAuthenticating,
    authenticate,
    error,
    clearError,
  };
}
