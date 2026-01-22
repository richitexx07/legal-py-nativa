"use client";

/**
 * PaymentAuthorizationModal - Modal de Autorización de Pago con Biometría
 * 
 * Modal estilo banco digital para autorizar pagos de suscripciones
 * Usa WebAuthn (Passkeys) para autorización rápida y segura
 * 
 * @author Legal PY Security Team
 * @version 1.0.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import PayBiometric from "@/components/Security/PayBiometric";
import { getSession } from "@/lib/auth";
import { isWebAuthnAvailable } from "@/lib/security/webauthn";

export interface PaymentAuthorizationModalProps {
  /** Si el modal está abierto */
  isOpen: boolean;
  /** Callback para cerrar el modal */
  onClose: () => void;
  /** Callback cuando la autorización es exitosa */
  onAuthorize: () => void;
  /** Monto del pago */
  amount: number;
  /** Moneda del pago */
  currency?: string;
  /** Descripción del pago */
  description?: string;
  /** Email del usuario */
  email?: string;
}

export default function PaymentAuthorizationModal({
  isOpen,
  onClose,
  onAuthorize,
  amount,
  currency = "PYG",
  description = "Suscripción Legal PY",
  email,
}: PaymentAuthorizationModalProps) {
  const [supportsWebAuthn, setSupportsWebAuthn] = useState(false);
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);

  // Verificar disponibilidad de WebAuthn y obtener userId
  useEffect(() => {
    if (typeof window !== "undefined") {
      setSupportsWebAuthn(isWebAuthnAvailable());
      
      // Obtener userId de la sesión (requerido para PayBiometric)
      const session = getSession();
      if (session?.user?.id) {
        setUserId(session.user.id);
      } else {
        console.warn("PaymentAuthorizationModal: Usuario no autenticado. PayBiometric requiere usuario autenticado.");
      }
      
      // Generar transactionId único
      setTransactionId(`txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
    }
  }, []);

  const formatAmount = (amount: number, currency: string) => {
    const symbols: Record<string, string> = {
      PYG: "Gs.",
      USD: "$",
      EUR: "€",
      BRL: "R$",
    };
    const symbol = symbols[currency] || currency;
    return `${symbol} ${amount.toLocaleString("es-PY")}`;
  };

  const handleBiometricSuccess = () => {
    setIsAuthorizing(true);
    // En producción, el backend ya autorizó el pago después de verificar la firma
    // Aquí solo confirmamos y procesamos
    setTimeout(() => {
      setIsAuthorizing(false);
      onAuthorize();
      onClose();
    }, 800);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md bg-gradient-to-br from-[#0E1B2A] via-[#13253A] to-[#0E1B2A] rounded-2xl border border-[#C9A24D]/30 shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="relative p-6 border-b border-white/10">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition text-white/60 hover:text-white"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="pr-10">
              <h2 className="text-2xl font-bold text-white mb-2">
                Autorizar Pago
              </h2>
              <p className="text-sm text-white/70">
                Confirma tu identidad para completar la transacción
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Detalles del pago */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white/70 text-sm">Descripción:</span>
                  <span className="text-white font-medium">{description}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70 text-sm">Monto:</span>
                  <span className="text-2xl font-bold text-[#C9A24D]">
                    {formatAmount(amount, currency)}
                  </span>
                </div>
              </div>
            </div>

            {/* Biometric Auth - PayBiometric (solo para pagos) */}
            {supportsWebAuthn && userId && transactionId ? (
              <div className="py-6">
                <PayBiometric
                  paymentContext={{
                    userId,
                    amount,
                    currency,
                    transactionId,
                  }}
                  size="lg"
                  onSuccess={handleBiometricSuccess}
                  onError={(error) => {
                    console.error("Error de autorización biométrica:", error);
                  }}
                  disabled={isAuthorizing}
                />
              </div>
            ) : supportsWebAuthn ? (
              <div className="py-6 text-center">
                <p className="text-white/70 mb-4">
                  ⚠️ Usuario no autenticado. Debes iniciar sesión primero.
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-[#C9A24D] text-black font-semibold rounded-xl hover:bg-[#C08457] transition"
                >
                  Cerrar
                </button>
              </div>
            ) : (
              <div className="py-6 text-center">
                <p className="text-white/70 mb-4">
                  La biometría no está disponible en este dispositivo
                </p>
                <button
                  onClick={onAuthorize}
                  className="px-6 py-3 bg-[#C9A24D] text-black font-semibold rounded-xl hover:bg-[#C08457] transition"
                >
                  Autorizar con Contraseña
                </button>
              </div>
            )}

            {/* Seguridad */}
            <div className="flex items-start gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <svg
                className="w-5 h-5 text-green-400 mt-0.5 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <div className="text-sm text-green-200/90">
                <p className="font-medium mb-1">Pago Seguro</p>
                <p className="text-green-200/70">
                  Tu información está protegida con encriptación de nivel bancario
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
