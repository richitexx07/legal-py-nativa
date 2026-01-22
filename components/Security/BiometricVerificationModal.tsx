"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/Button";
import confetti from "canvas-confetti";

interface BiometricVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (selfieDataUrl: string) => void;
  isMandatory?: boolean;
  isVerifying?: boolean;
  userId?: string;
  /** Si se permite saltar/cerrar el modal (solo en rutas no críticas) */
  allowSkip?: boolean;
  /** Modo demo: nunca bloquea, siempre permite cerrar */
  isDemoMode?: boolean;
}

type VerificationState = "UPLOAD_FRONT" | "UPLOAD_BACK" | "LIVENESS_CHECK";
type ScanStatus = "idle" | "scanning" | "done" | "error";
type LivenessState = "waiting" | "analyzing" | "success";

const instructions = [
  "Encuadra tu rostro en el círculo",
  "Mira directamente a la cámara",
  "Mantén una expresión neutra",
  "Asegúrate de tener buena iluminación",
];

export default function BiometricVerificationModal({
  isOpen,
  onClose,
  onVerify,
  isMandatory = false,
  isVerifying = false,
  userId,
  allowSkip = true, // Por defecto permite skip (solo bloquea si isMandatory=true)
  isDemoMode = false, // Modo demo: nunca bloquea
}: BiometricVerificationModalProps) {
  // En modo demo: NUNCA es obligatorio, siempre se puede cerrar
  const effectiveIsMandatory = isDemoMode ? false : isMandatory;
  const effectiveAllowSkip = isDemoMode ? true : allowSkip;
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [currentState, setCurrentState] = useState<VerificationState>("UPLOAD_FRONT");
  const [status, setStatus] = useState<ScanStatus>("idle");
  const [livenessState, setLivenessState] = useState<LivenessState>("waiting");
  const [message, setMessage] = useState<string>("");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [currentInstruction, setCurrentInstruction] = useState(0);
  const [showFlash, setShowFlash] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  
  // Estado de documentos subidos
  const [idFront, setIdFront] = useState<string | null>(null);
  const [idBack, setIdBack] = useState<string | null>(null);

  // Inicializar cámara cuando se entra al estado LIVENESS_CHECK
  useEffect(() => {
    if (currentState === "LIVENESS_CHECK" && isOpen && !cameraError) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [currentState, isOpen, cameraError]);

  // Verificar documentos al montar
  useEffect(() => {
    if (!isOpen || !userId) return;

    const checkDocuments = () => {
      if (typeof window === "undefined") return;

      const frontKey = `legal-py-cedula-front-${userId}`;
      const backKey = `legal-py-cedula-back-${userId}`;
      
      const hasFront = localStorage.getItem(frontKey) === "uploaded";
      const hasBack = localStorage.getItem(backKey) === "uploaded";

      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'components/Security/BiometricVerificationModal.tsx:checkDocuments',message:'Checking documents',data:{hasFront,hasBack,userId,isOpen},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H1'})}).catch(()=>{});
      // #endregion

      if (hasFront) {
        setIdFront("uploaded");
      }
      if (hasBack) {
        setIdBack("uploaded");
      }

      if (!hasFront) {
        setCurrentState("UPLOAD_FRONT");
      } else if (!hasBack) {
        setCurrentState("UPLOAD_BACK");
      } else {
        setCurrentState("LIVENESS_CHECK");
      }
    };

    checkDocuments();
  }, [isOpen, userId]);

  // Reset state cuando se abre/cierra
  useEffect(() => {
    if (!isOpen) {
      setStatus("idle");
      setLivenessState("waiting");
      setMessage("");
      setCameraError(null);
      setCurrentState("UPLOAD_FRONT");
      setIdFront(null);
      setIdBack(null);
      setCurrentInstruction(0);
      setShowFlash(false);
      stopCamera();
    }
  }, [isOpen]);

  // Rotar instrucciones cuando está en estado waiting
  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'components/Security/BiometricVerificationModal.tsx:instructionsEffect',message:'Instructions rotation effect',data:{currentState,livenessState,status,shouldRotate:currentState === "LIVENESS_CHECK" && livenessState === "waiting" && status === "idle"},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H4'})}).catch(()=>{});
    // #endregion
    if (currentState === "LIVENESS_CHECK" && livenessState === "waiting" && status === "idle") {
      const interval = setInterval(() => {
        setCurrentInstruction((prev) => {
          const next = (prev + 1) % instructions.length;
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'components/Security/BiometricVerificationModal.tsx:instructionsInterval',message:'Instruction rotated',data:{prev,next,instruction:instructions[next]},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H4'})}).catch(()=>{});
          // #endregion
          return next;
        });
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [currentState, livenessState, status]);

  // Inicializar cámara con HTML5 nativo
  const startCamera = useCallback(async () => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'BiometricVerificationModal.tsx:startCamera-entry',message:'startCamera called',data:{hasVideoRef:!!videoRef.current,hasMediaDevices:!!navigator.mediaDevices,hasGetUserMedia:!!(navigator.mediaDevices?.getUserMedia)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H5'})}).catch(()=>{});
    // #endregion

    if (!videoRef.current) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'BiometricVerificationModal.tsx:startCamera-no-video-ref',message:'No video ref - early return',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H5'})}).catch(()=>{});
      // #endregion
      return;
    }

    // Verificar si el navegador soporta getUserMedia
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'BiometricVerificationModal.tsx:startCamera-no-support',message:'Browser does not support getUserMedia',data:{hasMediaDevices:!!navigator.mediaDevices,hasGetUserMedia:!!(navigator.mediaDevices?.getUserMedia)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H5'})}).catch(()=>{});
      // #endregion
      setCameraError("Tu navegador no soporta la verificación biométrica por cámara.");
      setStatus("error");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      setIsCameraActive(true);

      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'components/Security/BiometricVerificationModal.tsx:startCamera',message:'Camera started',data:{hasStream:!!stream,active:stream.active},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H3'})}).catch(()=>{});
      // #endregion
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido";
      const errorName = error instanceof Error ? error.name : "Unknown";
      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'BiometricVerificationModal.tsx:startCamera-error-caught',message:'Camera error caught',data:{errorMessage,errorName,errorType:error?.constructor?.name},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H3'})}).catch(()=>{});
      // #endregion

      // Mensaje más específico según el tipo de error
      let userMessage = "Por favor, permite el acceso a la cámara para verificar tu identidad.";
      if (errorMessage.includes("NotFoundError") || errorMessage.includes("DevicesNotFoundError") || errorName === "NotFoundError") {
        userMessage = "No se encontró ninguna cámara en tu dispositivo.";
      } else if (errorMessage.includes("NotAllowedError") || errorMessage.includes("PermissionDeniedError") || errorName === "NotAllowedError") {
        userMessage = "Se denegó el acceso a la cámara. Por favor, permite el acceso en la configuración de tu navegador.";
      } else if (errorMessage.includes("NotReadableError") || errorMessage.includes("TrackStartError") || errorName === "NotReadableError") {
        userMessage = "La cámara está siendo usada por otra aplicación. Por favor, ciérrala e intenta nuevamente.";
      }
      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'BiometricVerificationModal.tsx:startCamera-error-handled',message:'Error message determined',data:{errorMessage,errorName,userMessage},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H3'})}).catch(()=>{});
      // #endregion

      setCameraError(userMessage);
      setStatus("error");
      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'BiometricVerificationModal.tsx:startCamera-error-state-set',message:'Error state set',data:{cameraError:userMessage,status:'error'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H6'})}).catch(()=>{});
      // #endregion
    }
  }, []);

  // Detener cámara
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  }, []);

  // Capturar screenshot desde el video
  const captureScreenshot = useCallback((): string | null => {
    if (!videoRef.current || !canvasRef.current) return null;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return null;

    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL("image/jpeg", 0.92);
  }, []);

  const handleFileUpload = (type: "front" | "back", file: File | null) => {
    if (!file || !userId) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const key = type === "front" ? `legal-py-cedula-front-${userId}` : `legal-py-cedula-back-${userId}`;
      localStorage.setItem(key, "uploaded");

      if (type === "front") {
        setIdFront("uploaded");
        setCurrentState("UPLOAD_BACK");
      } else {
        setIdBack("uploaded");
        setCurrentState("LIVENESS_CHECK");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleStartScan = () => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'components/Security/BiometricVerificationModal.tsx:handleStartScan',message:'handleStartScan called',data:{idFront:!!idFront,idBack:!!idBack,cameraError:!!cameraError,isVerifying,isCameraActive},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H5'})}).catch(()=>{});
    // #endregion
    if (!idFront || !idBack) {
      alert("⚠️ Debes subir primero la foto del frente y dorso de tu cédula antes de realizar el liveness check.");
      router.push("/security-center?step=docs");
      return;
    }

    if (cameraError || isVerifying || !isCameraActive) return;
    
    setStatus("scanning");
    setLivenessState("analyzing");
    setMessage("Analizando biometría... No te muevas");

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'components/Security/BiometricVerificationModal.tsx:handleStartScan',message:'State updated to scanning/analyzing',data:{status:'scanning',livenessState:'analyzing'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H2'})}).catch(()=>{});
    // #endregion

    // Después de 3 segundos, capturar y mostrar éxito
    setTimeout(() => {
      const imageSrc = captureScreenshot();
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'components/Security/BiometricVerificationModal.tsx:handleStartScan:timeout',message:'Screenshot attempt',data:{hasImageSrc:!!imageSrc,imageSrcLength:imageSrc?.length||0,videoReady:videoRef.current?.readyState === 4},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H3'})}).catch(()=>{});
      // #endregion
      if (!imageSrc) {
        setStatus("error");
        setLivenessState("waiting");
        setMessage("No se pudo capturar la imagen. Intente nuevamente.");
        return;
      }

      // Efecto flash
      setShowFlash(true);
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'components/Security/BiometricVerificationModal.tsx:handleStartScan:flash',message:'Flash triggered',data:{showFlash:true},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H6'})}).catch(()=>{});
      // #endregion
      setTimeout(() => setShowFlash(false), 200);

      // Confeti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#22c55e", "#16a34a", "#15803d"],
        });
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'components/Security/BiometricVerificationModal.tsx:handleStartScan:confetti',message:'Confetti triggered',data:{success:true},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H7'})}).catch(()=>{});
        // #endregion
      } catch (error) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'components/Security/BiometricVerificationModal.tsx:handleStartScan:confetti',message:'Confetti error',data:{error:error instanceof Error?error.message:String(error)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H7'})}).catch(()=>{});
        // #endregion
      }

      setStatus("done");
      setLivenessState("success");
      setMessage("Comparando con tu cédula de identidad...");
      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'components/Security/BiometricVerificationModal.tsx:handleStartScan:success',message:'State updated to done/success',data:{status:'done',livenessState:'success'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H8'})}).catch(()=>{});
      // #endregion
      
      // Llamar a onVerify después de un breve delay para mostrar el éxito
      setTimeout(() => {
        onVerify(imageSrc);
      }, 1500);
    }, 3000);
  };

  if (!isOpen) return null;

  const canStartLiveness = idFront && idBack && currentState === "LIVENESS_CHECK";

  // #region agent log
  useEffect(() => {
    if (isOpen) {
      fetch('http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'components/Security/BiometricVerificationModal.tsx:render',message:'Component render state',data:{isOpen,currentState,status,livenessState,canStartLiveness,idFront:!!idFront,idBack:!!idBack,currentInstruction,showFlash,isCameraActive},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H1'})}).catch(()=>{});
    }
  }, [isOpen, currentState, status, livenessState, canStartLiveness, idFront, idBack, currentInstruction, showFlash, isCameraActive]);
  // #endregion

  // Colores según el estado de liveness
  const getBorderColor = () => {
    switch (livenessState) {
      case "waiting":
        return "border-blue-400/60";
      case "analyzing":
        return "border-yellow-400/80";
      case "success":
        return "border-green-500";
      default:
        return "border-gray-400/60";
    }
  };

  const getBorderGlow = () => {
    switch (livenessState) {
      case "waiting":
        return "shadow-[0_0_30px_rgba(59,130,246,0.5)]";
      case "analyzing":
        return "shadow-[0_0_40px_rgba(250,204,21,0.7)]";
      case "success":
        return "shadow-[0_0_50px_rgba(34,197,94,0.8)]";
      default:
        return "shadow-[0_0_20px_rgba(156,163,175,0.3)]";
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Fondo oscuro con blur - no cerrar si es obligatorio (AUDIT FIX) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-xl"
        onClick={() => {
          if (effectiveIsMandatory) return;
          if (typeof window !== "undefined") {
            sessionStorage.setItem("biometric_skipped", "true");
            window.dispatchEvent(new Event('biometric-skip-changed'));
          }
          stopCamera();
          onClose();
        }}
        aria-hidden="true"
      />

      {/* Contenedor del modal - Glassmorphism */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative z-50 w-full max-w-lg rounded-3xl border border-white/10 bg-slate-900/90 backdrop-blur-xl p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {isDemoMode ? (
              "🎯 Verificación Biométrica (Demo)"
            ) : effectiveIsMandatory ? (
              "⚠️ Verificación de Identidad"
            ) : (
              "Validación Biométrica"
            )}
          </h2>
          {/* Botón X - ocultar o no cerrar si es obligatorio (AUDIT FIX) */}
          {!effectiveIsMandatory && (
          <button
            onClick={() => {
              if (typeof window !== "undefined") {
                sessionStorage.setItem("biometric_skipped", "true");
                window.dispatchEvent(new Event('biometric-skip-changed'));
              }
              stopCamera();
              onClose();
            }}
            className="rounded-xl p-2 hover:bg-red-500/20 hover:border-red-500/50 border border-transparent transition-all"
            aria-label="Cerrar"
            title="Cerrar"
          >
            <svg className="w-6 h-6 text-white/80 hover:text-red-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          )}
        </div>

        <p className="text-sm text-white/70 mb-6">
          {isDemoMode ? (
            <>
              <span className="block mb-2">🎯 <strong>Modo Demo:</strong> Esta es una demostración del sistema de verificación biométrica.</span>
              <span className="block">Puedes probar la funcionalidad o cerrar el modal en cualquier momento.</span>
            </>
          ) : effectiveIsMandatory ? (
            "Para acceder a la plataforma, debes verificar tu identidad. Sigue los pasos en orden."
          ) : (
            "Solo usamos esta captura para verificar que eres una persona real."
          )}
        </p>

        {/* Indicador de progreso */}
        <div className="mb-6 space-y-2">
          {[
            { step: 1, label: "Cédula Frente", completed: !!idFront, active: currentState === "UPLOAD_FRONT" },
            { step: 2, label: "Cédula Dorso", completed: !!idBack, active: currentState === "UPLOAD_BACK" },
            { step: 3, label: "Liveness Check", completed: status === "done", active: currentState === "LIVENESS_CHECK" },
          ].map((item) => (
            <div key={item.step} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                item.completed ? "bg-green-500 text-white" : item.active ? "bg-blue-500 text-white" : "bg-white/10 text-white/50"
              }`}>
                {item.completed ? "✓" : item.step}
              </div>
              <span className={`text-sm transition-colors ${
                item.completed ? "text-green-400" : item.active ? "text-blue-400" : "text-white/50"
              }`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Contenido según el estado actual */}
        {currentState === "UPLOAD_FRONT" && (
          <div className="mb-4 p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-sm text-white/90 mb-3">Paso 1: Sube la foto del frente de tu cédula</p>
            <input
              type="file"
              accept="image/*"
              id="idFront"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload("front", file);
              }}
            />
            <label
              htmlFor="idFront"
              className="inline-block px-4 py-2 rounded-lg bg-[#C9A24D]/20 border border-[#C9A24D]/50 text-[#C9A24D] hover:bg-[#C9A24D]/30 cursor-pointer transition"
            >
              {idFront ? "✓ Documento subido" : "Seleccionar archivo"}
            </label>
          </div>
        )}

        {currentState === "UPLOAD_BACK" && (
          <div className="mb-4 p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-sm text-white/90 mb-3">Paso 2: Sube la foto del dorso de tu cédula</p>
            <input
              type="file"
              accept="image/*"
              id="idBack"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload("back", file);
              }}
            />
            <label
              htmlFor="idBack"
              className="inline-block px-4 py-2 rounded-lg bg-[#C9A24D]/20 border border-[#C9A24D]/50 text-[#C9A24D] hover:bg-[#C9A24D]/30 cursor-pointer transition"
            >
              {idBack ? "✓ Documento subido" : "Seleccionar archivo"}
            </label>
          </div>
        )}

        {/* Live Selfie - Experiencia Inmersiva */}
        {currentState === "LIVENESS_CHECK" && (
          <div className="relative mb-6">
            {/* Contenedor de la cámara con forma circular/ovalada */}
            <div className={`relative aspect-[4/5] w-full overflow-hidden rounded-full ${getBorderColor()} ${getBorderGlow()} border-4 transition-all duration-500`}>
              {/* Video HTML5 nativo */}
              {!cameraError ? (
                <div className="relative h-full w-full">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="h-full w-full object-cover"
                    style={{ transform: "scaleX(-1)" }} // Espejo para mejor UX
                  />
                  
                  {/* Canvas oculto para captura */}
                  <canvas ref={canvasRef} className="hidden" />

                  {/* Overlay de Guía - Marco SVG que rota/pulsa */}
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <motion.svg
                      width="280"
                      height="350"
                      viewBox="0 0 280 350"
                      className="absolute"
                      animate={
                        livenessState === "analyzing"
                          ? { rotate: 360, scale: [1, 1.05, 1] }
                          : { rotate: 0, scale: [1, 1.02, 1] }
                      }
                      transition={
                        livenessState === "analyzing"
                          ? { rotate: { duration: 2, repeat: Infinity, ease: "linear" }, scale: { duration: 2, repeat: Infinity } }
                          : { scale: { duration: 3, repeat: Infinity, ease: "easeInOut" } }
                      }
                    >
                      <ellipse
                        cx="140"
                        cy="175"
                        rx="120"
                        ry="150"
                        fill="none"
                        stroke={livenessState === "waiting" ? "rgba(59,130,246,0.6)" : livenessState === "analyzing" ? "rgba(250,204,21,0.8)" : "rgba(34,197,94,0.8)"}
                        strokeWidth="3"
                        strokeDasharray="20 10"
                        strokeLinecap="round"
                      />
                    </motion.svg>
                  </div>

                  {/* Barra de Escáner Animada */}
                  {status === "scanning" && (
                    <motion.div
                      className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-90"
                      animate={{
                        top: ["0%", "100%", "0%"],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  )}

                  {/* Efecto Flash */}
                  <AnimatePresence>
                    {showFlash && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 bg-white"
                      />
                    )}
                  </AnimatePresence>

                  {/* Icono de Check cuando es éxito */}
                  <AnimatePresence>
                    {livenessState === "success" && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center bg-green-500/20 backdrop-blur-sm"
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 200, damping: 15 }}
                          className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.8)]"
                        >
                          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-4 px-4 text-center">
                  {/* #region agent log */}
                  {(() => {
                    fetch('http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'BiometricVerificationModal.tsx:render-camera-error',message:'Camera error UI rendered',data:{cameraError,allowSkip,status},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H2'})}).catch(()=>{});
                    return null;
                  })()}
                  {/* #endregion */}
                  <div className="space-y-2">
                    <svg className="mx-auto h-16 w-16 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="text-sm font-medium text-red-200">{cameraError}</p>
                    <p className="text-xs text-white/60">Tu dispositivo no es compatible con la verificación biométrica</p>
                  </div>
                  {/* Botón para continuar sin verificación cuando hay error de cámara - SIEMPRE VISIBLE */}
                  <Button
                    variant="secondary"
                    className="mt-4 w-full rounded-xl bg-gray-600/80 hover:bg-gray-600 text-white border-red-500/30"
                    onClick={() => {
                      if (typeof window !== "undefined") {
                        sessionStorage.setItem("biometric_skipped", "true");
                        window.dispatchEvent(new Event('biometric-skip-changed'));
                      }
                      stopCamera();
                      onClose();
                    }}
                  >
                    Continuar sin verificación (Dispositivo no compatible)
                  </Button>
                </div>
              )}
            </div>

            {/* Instrucciones Inteligentes con Fade-in/out */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentInstruction}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="mt-4 text-center"
              >
                {status === "scanning" ? (
                  <p className="text-base font-semibold text-yellow-400">
                    {message}
                  </p>
                ) : status === "done" ? (
                  <p className="text-base font-semibold text-green-400">
                    {message}
                  </p>
                ) : (
                  <p className="text-sm text-white/80">
                    {instructions[currentInstruction]}
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {/* Botones */}
        <div className="mt-6 flex justify-end gap-3">
          {/* Botón Cancelar - ocultar o deshabilitar si es obligatorio (AUDIT FIX) */}
          {!effectiveIsMandatory && (
          <Button
            variant="secondary"
            className="rounded-xl"
            onClick={() => {
              if (typeof window !== "undefined") {
                sessionStorage.setItem("biometric_skipped", "true");
                window.dispatchEvent(new Event('biometric-skip-changed'));
              }
              stopCamera();
              onClose();
            }}
            disabled={status === "scanning" || isVerifying}
          >
            Hacerlo más tarde
          </Button>
          )}
          
          {currentState === "UPLOAD_FRONT" && (
            <Button
              variant="primary"
              className="rounded-xl"
              onClick={() => {
                if (!idFront) {
                  document.getElementById("idFront")?.click();
                }
              }}
              disabled={!!idFront}
            >
              {idFront ? "✓ Completado" : "Subir Cédula Frente"}
            </Button>
          )}

          {currentState === "UPLOAD_BACK" && (
            <Button
              variant="primary"
              className="rounded-xl"
              onClick={() => {
                if (!idBack) {
                  document.getElementById("idBack")?.click();
                }
              }}
              disabled={!!idBack}
            >
              {idBack ? "✓ Completado" : "Subir Cédula Dorso"}
            </Button>
          )}

          {currentState === "LIVENESS_CHECK" && (
            <>
              <Button
                variant="primary"
                className={`rounded-xl ${
                  !canStartLiveness ? "grayscale cursor-not-allowed opacity-50" : ""
                }`}
                onClick={handleStartScan}
                disabled={!canStartLiveness || !!cameraError || status === "scanning" || isVerifying || livenessState === "success" || !isCameraActive}
              >
                {isVerifying
                  ? "Comparando con tu cédula..."
                  : status === "scanning"
                  ? "Escaneando..."
                  : livenessState === "success"
                  ? "✓ Verificado"
                  : !isCameraActive
                  ? "Iniciando cámara..."
                  : "📸 Escanear Rostro"}
              </Button>
            </>
          )}
        </div>

        {/* Botón "Saltar por ahora" - SIEMPRE VISIBLE en LIVENESS_CHECK (nunca bloquear) */}
        {currentState === "LIVENESS_CHECK" && !cameraError && (
          <div className="mt-4 text-center">
            <button
              onClick={() => {
                if (typeof window !== "undefined") {
                  sessionStorage.setItem("biometric_skipped", "true");
                  window.dispatchEvent(new Event('biometric-skip-changed'));
                }
                stopCamera();
                onClose();
              }}
              className="text-xs text-white/50 hover:text-white/70 underline transition-colors"
              disabled={status === "scanning" || isVerifying}
            >
              Omitir verificación por ahora (Modo Demo)
            </button>
          </div>
        )}

        {/* Mensaje de ayuda */}
        {currentState === "LIVENESS_CHECK" && !canStartLiveness && (
          <p className="mt-3 text-xs text-yellow-400 text-center">
            ⚠️ Debes completar los pasos 1 y 2 antes de continuar
          </p>
        )}

        {/* BOTÓN DE ESCAPE - Visible en demo o cuando no es obligatorio (según manual) */}
        {(!effectiveIsMandatory || isDemoMode) && (
          <div className="mt-6 pt-4 border-t border-white/10 z-50">
            <button
              onClick={() => {
                if (typeof window !== "undefined") {
                  sessionStorage.setItem("biometric_skipped", "true");
                  window.dispatchEvent(new Event('biometric-skip-changed'));
                }
                stopCamera();
                onClose();
              }}
              className="w-full text-sm text-white/60 hover:text-white/90 underline cursor-pointer transition-colors text-center"
              disabled={status === "scanning" || isVerifying}
            >
              {isDemoMode 
                ? "Omitir Verificación (Modo Demo / Incógnito)"
                : "Omitir Verificación"}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
