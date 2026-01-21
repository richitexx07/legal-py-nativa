"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import Button from "@/components/Button";

interface BiometricVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (selfieDataUrl: string) => void;
}

type ScanStatus = "idle" | "scanning" | "done" | "error";

const videoConstraints: MediaTrackConstraints = {
  facingMode: "user",
};

export default function BiometricVerificationModal({
  isOpen,
  onClose,
  onVerify,
}: BiometricVerificationModalProps) {
  const webcamRef = useRef<Webcam | null>(null);
  const [status, setStatus] = useState<ScanStatus>("idle");
  const [message, setMessage] = useState<string>("");
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Reset state when se abre/cierra
  useEffect(() => {
    if (!isOpen) {
      setStatus("idle");
      setMessage("");
      setCameraError(null);
    }
  }, [isOpen]);

  const handleUserMediaError = useCallback(() => {
    setCameraError("Por favor, permite el acceso a la cámara para verificar tu identidad.");
    setStatus("error");
  }, []);

  const handleStartScan = () => {
    if (cameraError) return;
    setStatus("scanning");
    setMessage("Verificando Liveness... Parpadee y mantenga el rostro dentro del marco.");

    const start = performance.now();

    const loop = (now: number) => {
      const elapsed = now - start;
      if (elapsed >= 3000) {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (!imageSrc) {
          setStatus("error");
          setMessage("No se pudo capturar la imagen. Intente nuevamente.");
          return;
        }
        setStatus("done");
        setMessage("Liveness verificado correctamente.");
        onVerify(imageSrc);
        onClose();
        return;
      }
      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Fondo oscuro + blur */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Contenedor del modal */}
      <div
        className="relative z-50 w-full max-w-md rounded-3xl border border-emerald-400/40 bg-gradient-to-br from-slate-900/80 via-slate-900/95 to-slate-900/90 p-6 shadow-[0_0_40px_rgba(16,185,129,0.45)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-white">Validación Biométrica</h2>
          <button
            onClick={onClose}
            className="rounded-2xl p-1.5 hover:bg-white/10 transition"
            aria-label="Cerrar"
          >
            <span className="text-white/70">✕</span>
          </button>
        </div>

        <p className="text-xs text-emerald-200/90 mb-3">
          Solo usamos esta captura para verificar que eres una persona real. No compartas este
          dispositivo con terceros mientras operas.
        </p>

        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-black/60 border border-emerald-400/40 flex items-center justify-center">
          {/* Webcam o mensaje de error */}
          {!cameraError ? (
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              className="h-full w-full object-cover"
              onUserMediaError={handleUserMediaError}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center px-4 text-center">
              <p className="text-sm text-red-200">{cameraError}</p>
            </div>
          )}

          {/* Marco ovalado neuro-seguridad */}
          <div className="pointer-events-none absolute inset-6 flex items-center justify-center">
            <div className="h-52 w-40 rounded-full border-2 border-emerald-400/80 shadow-[0_0_25px_rgba(16,185,129,0.8)]" />
          </div>

          {/* Línea de “escaneo” simulada */}
          {status === "scanning" && (
            <div className="pointer-events-none absolute inset-x-10 h-full overflow-hidden">
              <div className="relative h-full w-full">
                <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-80 animate-pulse" />
              </div>
            </div>
          )}
        </div>

        {/* Mensaje de estado */}
        {message && (
          <p className="mt-3 text-xs text-emerald-100">
            {message}
          </p>
        )}

        {/* Botones */}
        <div className="mt-4 flex justify-end gap-2">
          <Button
            variant="secondary"
            className="rounded-2xl"
            onClick={onClose}
            disabled={status === "scanning"}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            className="rounded-2xl"
            onClick={handleStartScan}
            disabled={!!cameraError || status === "scanning"}
          >
            {status === "scanning" ? "Escaneando..." : "Iniciar Escaneo Facial"}
          </Button>
        </div>
      </div>
    </div>
  );
}

