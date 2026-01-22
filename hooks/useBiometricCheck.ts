"use client";

import { useState, useCallback } from "react";
import { getSession } from "@/lib/auth";
import BiometricVerificationModal from "@/components/Security/BiometricVerificationModal";
import { updateIdentityVerification } from "@/lib/auth";
import confetti from "canvas-confetti";

/**
 * Hook para verificar biometría antes de acciones críticas
 * Retorna una función que debe llamarse antes de ejecutar la acción
 */
export function useBiometricCheck() {
  const [showModal, setShowModal] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [onVerifiedCallback, setOnVerifiedCallback] = useState<(() => void) | null>(null);

  const requireBiometric = useCallback((action: () => void) => {
    const session = getSession();
    
    // Si no hay sesión o el usuario está verificado, ejecutar acción directamente
    if (!session || session.user.isIdentityVerified || session.user.email === "demo@legalpy.com") {
      action();
      return;
    }

    // Si no está verificado, guardar callback y mostrar modal
    setOnVerifiedCallback(() => action);
    setShowModal(true);
  }, []);

  const handleVerify = async (selfieDataUrl: string) => {
    const session = getSession();
    if (!session) return;

    setIsVerifying(true);

    try {
      // Verificar si el usuario tiene cédula subida
      const hasCedula = session.user.identityVerificationStatus === "in_review" || 
                        session.user.identityVerificationStatus === "verified" ||
                        (typeof window !== "undefined" && 
                         (localStorage.getItem(`legal-py-cedula-front-${session.user.id}`) === "uploaded" &&
                          localStorage.getItem(`legal-py-cedula-back-${session.user.id}`) === "uploaded"));

      if (!hasCedula) {
        setIsVerifying(false);
        alert(
          "⚠️ Cédula de Identidad Requerida\n\n" +
            "Para realizar esta acción, primero debes subir una foto de tu cédula de identidad.\n\n" +
            "Por favor, ve al Centro de Seguridad (/security-center) y sube:\n" +
            "• Foto de Cédula (Frente)\n" +
            "• Foto de Cédula (Dorso)\n" +
            "• Selfie (Liveness check)"
        );
        setShowModal(false);
        return;
      }

      // Simular verificación biométrica
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const matchSuccess = Math.random() > 0.05;

      if (matchSuccess) {
        updateIdentityVerification(session.user.id, {
          status: "verified",
          selfieDataUrl,
        });

        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ["#10b981", "#34d399"],
        });

        setShowModal(false);
        setIsVerifying(false);

        // Ejecutar callback después de verificar
        if (onVerifiedCallback) {
          onVerifiedCallback();
          setOnVerifiedCallback(null);
        }
      } else {
        alert(
          "⚠️ La verificación biométrica falló.\n\n" +
            "La selfie no coincide con la foto de tu cédula de identidad.\n" +
            "Por favor, intenta nuevamente."
        );
        setIsVerifying(false);
      }
    } catch (error) {
      console.error("Error en verificación biométrica:", error);
      alert("Error al procesar la verificación. Por favor, intenta nuevamente.");
      setIsVerifying(false);
    }
  };

  return {
    requireBiometric,
    showModal,
    setShowModal,
    isVerifying,
    handleVerify,
    userId: getSession()?.user.id,
  };
}
