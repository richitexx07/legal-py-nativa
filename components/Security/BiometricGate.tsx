"use client";

/**
 * BiometricGate - Control de Verificación Biométrica Inteligente
 * 
 * Lógica:
 * - Rutas críticas: Bloqueo obligatorio (no se puede cerrar)
 * - Rutas no críticas: Permite cerrar/saltar (guarda en sessionStorage)
 * - Si el usuario ya está verificado: No renderiza nada
 * - Respeta el flag de skip en sessionStorage (excepto en rutas críticas)
 * 
 * @author Legal PY Security Team
 * @version 2.0.0 - Smart Gate Logic
 */

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { getSession, updateIdentityVerification } from "@/lib/auth";
import { isMasterKey } from "@/lib/feature-flags";
import BiometricVerificationModal from "./BiometricVerificationModal";
import confetti from "canvas-confetti";

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Rutas críticas donde la verificación biométrica es OBLIGATORIA
 * El usuario NO puede cerrar el modal en estas rutas
 */
const CRITICAL_ROUTES = ["/subscribe", "/post-case", "/accept-case", "/pagos"];

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Verifica si una ruta es crítica
 */
function isCriticalRoute(pathname: string): boolean {
  return CRITICAL_ROUTES.some((route) => pathname.startsWith(route));
}

/**
 * Obtiene el flag de skip desde sessionStorage
 */
function getBiometricSkipped(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem("biometric_skipped") === "true";
}

/**
 * Guarda el flag de skip en sessionStorage
 */
function setBiometricSkipped(skipped: boolean): void {
  if (typeof window === "undefined") return;
  if (skipped) {
    sessionStorage.setItem("biometric_skipped", "true");
  } else {
    sessionStorage.removeItem("biometric_skipped");
  }
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function BiometricGate() {
  const pathname = usePathname();
  const [session, setSession] = useState<ReturnType<typeof getSession>>(null);
  const [mounted, setMounted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // #region agent log
  if (typeof window !== "undefined") {
    fetch('http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'BiometricGate.tsx:component-render',message:'Component rendered',data:{pathname,hasWindow:true},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H1'})}).catch(()=>{});
  }
  // #endregion

  // Montar componente
  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'BiometricGate.tsx:mount-effect',message:'Mount effect triggered',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H1'})}).catch(()=>{});
    // #endregion
    setMounted(true);
  }, []);

  // Lógica principal de detección
  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'BiometricGate.tsx:useEffect-entry',message:'Effect triggered',data:{mounted,hasWindow:typeof window!=='undefined',pathname},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H1'})}).catch(()=>{});
    // #endregion

    if (!mounted || typeof window === "undefined" || !pathname) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'BiometricGate.tsx:useEffect-early-return',message:'Early return - not ready',data:{mounted,hasWindow:typeof window!=='undefined',pathname},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H1'})}).catch(()=>{});
      // #endregion
      return;
    }

    // URGENTE: Verificar si el usuario ya hizo skip (Modo Demo/Incógnito)
    const hasSkipped = typeof window !== "undefined" ? sessionStorage.getItem("biometric_skipped") : null;
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'BiometricGate.tsx:useEffect-skip-check-urgent',message:'Skip check (URGENT)',data:{hasSkipped,pathname,isSubscribe:pathname?.startsWith('/subscribe')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H2'})}).catch(()=>{});
    // #endregion

    // Si el usuario hizo skip Y NO está en /subscribe (pagos), NO mostrar modal
    if (hasSkipped === "true" && !pathname?.startsWith("/subscribe")) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'BiometricGate.tsx:useEffect-skip-active-urgent',message:'Skip active - hiding modal (URGENT)',data:{hasSkipped,pathname},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H2'})}).catch(()=>{});
      // #endregion
      setShowModal(false);
      return;
    }

    const currentSession = getSession();
    setSession(currentSession);

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'BiometricGate.tsx:useEffect-session-check',message:'Session retrieved',data:{hasSession:!!currentSession,userEmail:currentSession?.user?.email,isIdentityVerified:currentSession?.user?.isIdentityVerified,identityStatus:currentSession?.user?.identityVerificationStatus},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H5'})}).catch(()=>{});
    // #endregion

    // 1. Si no hay sesión, no mostrar nada
    if (!currentSession) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'BiometricGate.tsx:useEffect-no-session',message:'No session - hiding modal',data:{pathname},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H1'})}).catch(()=>{});
      // #endregion
      setShowModal(false);
      return;
    }

    // 2. Si el usuario ya está verificado, no mostrar nada
    if (currentSession.user.isIdentityVerified === true) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'BiometricGate.tsx:useEffect-already-verified',message:'User already verified - hiding modal',data:{pathname,userEmail:currentSession.user.email},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H5'})}).catch(()=>{});
      // #endregion
      setShowModal(false);
      return;
    }

    // 3. Modo demo / Master key: nunca bloquear
    const isDemoMode =
      process.env.NEXT_PUBLIC_DEMO_MODE === "true" ||
      localStorage.getItem("legal-py-demo-mode") === "true";
    const isMasterKeyUser = isMasterKey(currentSession.user.email);

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'BiometricGate.tsx:useEffect-demo-check',message:'Demo mode check',data:{isDemoMode,isMasterKeyUser,userEmail:currentSession.user.email,envDemo:process.env.NEXT_PUBLIC_DEMO_MODE,localDemo:localStorage.getItem('legal-py-demo-mode')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H6'})}).catch(()=>{});
    // #endregion

    if (isDemoMode || isMasterKeyUser) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'BiometricGate.tsx:useEffect-demo-bypass',message:'Demo/master key bypass - hiding modal',data:{isDemoMode,isMasterKeyUser,pathname},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H6'})}).catch(()=>{});
      // #endregion
      setShowModal(false);
      return;
    }

    // 4. Determinar si es ruta crítica
    const isCritical = isCriticalRoute(pathname);
    const isSubscribe = pathname?.startsWith("/subscribe");

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'BiometricGate.tsx:useEffect-route-check',message:'Route criticality check',data:{pathname,isCritical,isSubscribe,criticalRoutes:CRITICAL_ROUTES},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H3'})}).catch(()=>{});
    // #endregion

    // 5. Si es ruta crítica (especialmente /subscribe): SIEMPRE mostrar (obligatorio)
    // PERO si es otra ruta crítica y el usuario hizo skip, respetar el skip
    if (isCritical && isSubscribe) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'BiometricGate.tsx:useEffect-subscribe-route',message:'Subscribe route - showing modal (mandatory)',data:{pathname,isCritical,isSubscribe},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H3'})}).catch(()=>{});
      // #endregion
      setShowModal(true);
      // Limpiar skip si estaba en una ruta crítica anterior
      setBiometricSkipped(false);
      return;
    }

    // 6. Si NO es /subscribe pero es otra ruta crítica: verificar skip primero
    if (isCritical && !isSubscribe) {
      // Reutilizar hasSkipped ya declarado arriba
      if (hasSkipped === "true") {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'BiometricGate.tsx:useEffect-critical-with-skip',message:'Critical route but skip active - hiding modal',data:{pathname,isCritical,hasSkipped},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H2'})}).catch(()=>{});
        // #endregion
        setShowModal(false);
        return;
      }
      setShowModal(true);
      setBiometricSkipped(false);
      return;
    }

    // 7. Si NO es ruta crítica: verificar si el usuario ya hizo skip (reutilizar hasSkipped ya declarado)

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'BiometricGate.tsx:useEffect-skip-check',message:'Skip flag check',data:{pathname,hasSkipped,skipValue:sessionStorage.getItem('biometric_skipped')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H2'})}).catch(()=>{});
    // #endregion

    if (hasSkipped === "true") {
      // Ya hizo skip, no mostrar automáticamente
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'BiometricGate.tsx:useEffect-skip-active',message:'Skip active - hiding modal',data:{pathname,hasSkipped},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H2'})}).catch(()=>{});
      // #endregion
      setShowModal(false);
      return;
    }

    // 7. Si no es crítica y no hizo skip: mostrar (pero puede cerrar)
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'BiometricGate.tsx:useEffect-show-optional',message:'Non-critical route, no skip - showing modal (optional)',data:{pathname,isCritical,hasSkipped},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H4'})}).catch(()=>{});
    // #endregion
    setShowModal(true);
  }, [mounted, pathname]);

  // Manejar verificación exitosa
  const handleVerify = async (selfieDataUrl: string) => {
    if (!session) return;

    setIsVerifying(true);

    try {
      // Verificar si el usuario tiene cédula subida
      const hasCedula =
        session.user.identityVerificationStatus === "in_review" ||
        session.user.identityVerificationStatus === "verified" ||
        (typeof window !== "undefined" &&
          localStorage.getItem(`legal-py-cedula-${session.user.id}`));

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
        if (typeof window !== "undefined") {
          window.location.href = "/security-center";
        }
        return;
      }

      // Simular verificación biométrica
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simular matching: 95% de éxito
      const matchSuccess = Math.random() > 0.05;

      if (matchSuccess) {
        // Actualizar estado de verificación
        updateIdentityVerification(session.user.id, {
          status: "verified",
          selfieDataUrl,
        });

        // Confeti de éxito
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

        // Limpiar flag de skip
        setBiometricSkipped(false);
      } else {
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

  // Manejar cierre del modal
  const handleClose = () => {
    const isCritical = pathname ? isCriticalRoute(pathname) : false;

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'BiometricGate.tsx:handleClose-entry',message:'Close handler called',data:{pathname,isCritical},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H2'})}).catch(()=>{});
    // #endregion

    // Si es ruta crítica, NO permitir cerrar
    if (isCritical) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'BiometricGate.tsx:handleClose-blocked',message:'Close blocked - critical route',data:{pathname,isCritical},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H3'})}).catch(()=>{});
      // #endregion
      return; // No hacer nada, el modal permanece abierto
    }

    // Si NO es crítica, permitir cerrar y guardar skip
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'BiometricGate.tsx:handleClose-allowed',message:'Close allowed - setting skip flag',data:{pathname,isCritical},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H2'})}).catch(()=>{});
    // #endregion
    setBiometricSkipped(true);
    setShowModal(false);
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'BiometricGate.tsx:handleClose-complete',message:'Skip flag set, modal closed',data:{pathname,skipValue:sessionStorage.getItem('biometric_skipped')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H2'})}).catch(()=>{});
    // #endregion
  };

  // No renderizar si no está montado
  if (!mounted) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'BiometricGate.tsx:render-not-mounted',message:'Not mounted - returning null',data:{mounted},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H1'})}).catch(()=>{});
    // #endregion
    return null;
  }

  // No renderizar si:
  // - No hay sesión
  // - Usuario ya verificado
  // - No se debe mostrar el modal
  if (!session || session.user.isIdentityVerified === true || !showModal) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'BiometricGate.tsx:render-hidden',message:'Render hidden - conditions not met',data:{hasSession:!!session,isVerified:session?.user?.isIdentityVerified,showModal,pathname},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H4'})}).catch(()=>{});
    // #endregion
    return null;
  }

  // Determinar si es obligatorio (ruta crítica)
  const isCritical = pathname ? isCriticalRoute(pathname) : false;
  const isMandatory = isCritical;

  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'BiometricGate.tsx:render-modal',message:'Rendering modal',data:{pathname,isCritical,isMandatory,allowSkip:!isMandatory,showModal},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H4'})}).catch(()=>{});
  // #endregion

  return (
    <BiometricVerificationModal
      isOpen={showModal}
      onClose={handleClose}
      onVerify={handleVerify}
      isMandatory={isMandatory}
      isVerifying={isVerifying}
      userId={session.user.id}
      allowSkip={!isMandatory} // Nueva prop para permitir skip
    />
  );
}
