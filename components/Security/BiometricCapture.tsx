"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Button from "@/components/Button";

type CaptureStatus = "idle" | "camera_ready" | "captured" | "verifying" | "verified" | "error";

interface BiometricCaptureProps {
  onCancel: () => void;
  onVerified: (payload: { selfieDataUrl: string }) => void;
}

function safeNow() {
  return Date.now();
}

export default function BiometricCapture({ onCancel, onVerified }: BiometricCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [status, setStatus] = useState<CaptureStatus>("idle");
  const [selfieDataUrl, setSelfieDataUrl] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const canCapture = useMemo(() => status === "camera_ready", [status]);
  const canVerify = useMemo(() => status === "captured" && !!selfieDataUrl, [status, selfieDataUrl]);

  useEffect(() => {
    let mounted = true;
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
        if (!mounted) return;
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setStatus("camera_ready");
      } catch (e) {
        setError("No se pudo acceder a la cámara. Revisa permisos del navegador.");
        setStatus("error");
      }
    }

    startCamera();

    return () => {
      mounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, []);

  const capture = () => {
    const v = videoRef.current;
    const c = canvasRef.current;
    if (!v || !c) return;
    const w = 480;
    const h = 480;
    c.width = w;
    c.height = h;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(v, 0, 0, w, h);
    const dataUrl = c.toDataURL("image/jpeg", 0.85);
    setSelfieDataUrl(dataUrl);
    setStatus("captured");
  };

  const verify = () => {
    setStatus("verifying");
    const startedAt = safeNow();
    // Simulación sin setTimeout: usamos RAF para completar el “liveness”
    const tick = () => {
      if (safeNow() - startedAt >= 1200) {
        setStatus("verified");
        onVerified({ selfieDataUrl });
        return;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  return (
    <div className="space-y-4">
      {status === "error" && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
          {error || "Error biométrico"}
        </div>
      )}

      <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
        <div className="aspect-square w-full overflow-hidden rounded-2xl border border-white/10 bg-black/40">
          {selfieDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={selfieDataUrl} alt="Selfie capturada" className="h-full w-full object-cover" />
          ) : (
            <video ref={videoRef} autoPlay playsInline className="h-full w-full object-cover" />
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {status === "verifying" && (
          <div className="mt-4 rounded-2xl border border-yellow-400/30 bg-yellow-400/10 p-4 text-sm text-yellow-100">
            Verificando Liveness…
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 justify-end">
        <Button variant="secondary" className="rounded-2xl" onClick={onCancel}>
          Cancelar
        </Button>
        <Button
          variant="secondary"
          className="rounded-2xl"
          onClick={() => {
            setSelfieDataUrl("");
            setStatus("camera_ready");
          }}
          disabled={status === "verifying" || status === "idle"}
        >
          Repetir
        </Button>
        <Button variant="primary" className="rounded-2xl" onClick={capture} disabled={!canCapture}>
          Tomar Selfie
        </Button>
        <Button variant="primary" className="rounded-2xl" onClick={verify} disabled={!canVerify}>
          Verificar
        </Button>
      </div>
    </div>
  );
}

