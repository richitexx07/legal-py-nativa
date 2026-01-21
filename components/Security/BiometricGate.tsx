"use client";

import { useState, useEffect } from "react";
import { getSession, updateIdentityVerification } from "@/lib/auth";
import BiometricVerificationModal from "./BiometricVerificationModal";
import confetti from "canvas-confetti";

/**
 * Componente que bloquea la UI hasta que el usuario complete la verificación biométrica
 * Se muestra automáticamente si el usuario está logueado pero no tiene isIdentityVerified: true
 */
export default function BiometricGate() {
  const [session, setSession] = useState<ReturnType<typeof getSession>>(null);
  const [mounted, setMounted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const currentSession = getSession();
      setSession(currentSession);

      // Si el usuario está logueado pero no verificado, mostrar modal obligatorio
      if (currentSession && !currentSession.user.isIdentityVerified) {
        // Excepción: usuario demo siempre verificado
        if (currentSession.user.email === "demo@legalpy.com") {
          return;
        }
        setShowModal(true);
      }
    }
  }, []);

  // Escuchar cambios en la sesión (por si se actualiza desde otro componente)
  useEffect(() => {
    if (!mounted) return;

    const checkSession = () => {
      const currentSession = getSession();
      setSession(currentSession);
      if (currentSession && !currentSession.user.isIdentityVerified) {
        if (currentSession.user.email === "demo@legalpy.com") {
          return;
        }
        setShowModal(true);
      } else {
        setShowModal(false);
      }
    };

    // Verificar cada 2 segundos (por si se actualiza la sesión)
    const interval = setInterval(checkSession, 2000);
    return () => clearInterval(interval);
  }, [mounted]);

  const handleVerify = async (selfieDataUrl: string) => {
    if (!session) return;

    setIsVerifying(true);

    try {
      // Verificar si el usuario tiene cédula subida (simulado - en producción se leería de BD)
      const hasCedula = session.user.identityVerificationStatus === "in_review" || 
                        session.user.identityVerificationStatus === "verified" ||
                        (typeof window !== "undefined" && localStorage.getItem(`legal-py-cedula-${session.user.id}`));

      if (!hasCedula) {
        setIsVerifying(false);
        alert(
          "⚠️ Cédula de Identidad Requerida\n\n" +
            "Para completar la verificación biométrica, primero debes subir una foto de tu cédula de identidad.\n\n" +
            "Por favor, ve al Centro de Seguridad (/security-center) y sube:\n" +
            "• Foto de Cédula (Frente)\n" +
            "• Foto de Cédula (Dorso)\n" +
            "• Selfie (Liveness check)\n\n" +
            "Una vez subidos los documentos, podrás completar la verificación biométrica."
        );
        // Redirigir al security-center
        if (typeof window !== "undefined") {
          window.location.href = "/security-center";
        }
        return;
      }

      // Simular verificación biométrica (matching con cédula)
      // En producción, esto compararía la selfie con la foto de la cédula subida usando IA/ML
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simular matching: 95% de éxito (5% de fallo para casos edge)
      // En producción, esto usaría un servicio de reconocimiento facial (Face API, AWS Rekognition, etc.)
      const matchSuccess = Math.random() > 0.05;

      if (matchSuccess) {
        // Actualizar estado de verificación
        updateIdentityVerification(session.user.id, {
          status: "verified",
          selfieDataUrl, // Guardar selfie para referencia futura
        });

        // Disparar confeti de éxito
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#10b981", "#34d399", "#6ee7b7"],
        });

        // Actualizar sesión local
        const updatedSession = getSession();
        setSession(updatedSession);
        setShowModal(false);

        // Log de éxito
        fetch("http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            location: "components/Security/BiometricGate.tsx:handleVerify",
            message: "Biometric verification completed successfully",
            data: { userId: session.user.id, email: session.user.email },
            timestamp: Date.now(),
            sessionId: "debug-session",
            runId: "run-biometric",
            hypothesisId: "H-BIOMETRIC",
          }),
        }).catch(() => {});
      } else {
        // Matching fallido - mostrar error
        alert(
          "⚠️ La verificación biométrica falló.\n\n" +
            "La selfie no coincide con la foto de tu cédula de identidad.\n" +
            "Por favor, intenta nuevamente asegurándote de:\n" +
            "• Buena iluminación\n" +
            "• Rostro completamente visible\n" +
            "• Sin lentes oscuros ni gorros"
        );
        setIsVerifying(false);
      }
    } catch (error) {
      console.error("Error en verificación biométrica:", error);
      alert("Error al procesar la verificación. Por favor, intenta nuevamente.");
      setIsVerifying(false);
    }
  };

  if (!mounted) return null;

  // No mostrar nada si el usuario está verificado o no hay sesión
  if (!session || session.user.isIdentityVerified || session.user.email === "demo@legalpy.com") {
    return null;
  }

  // Modal obligatorio - no se puede cerrar hasta verificar
  return (
    <BiometricVerificationModal
      isOpen={showModal}
      onClose={() => {
        // En modo obligatorio, no se puede cerrar
        // Solo se cierra automáticamente después de verificar exitosamente
      }}
      onVerify={handleVerify}
      isMandatory={true}
      isVerifying={isVerifying}
    />
  );
}
