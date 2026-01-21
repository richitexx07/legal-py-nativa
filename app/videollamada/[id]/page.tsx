"use client";

import { use, useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { mockProfesionales } from "@/lib/mock-data";
import { notFound } from "next/navigation";
import Link from "next/link";

type CallStatus = "idle" | "connecting" | "in-call" | "ended";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function VideollamadaPage({ params }: PageProps) {
  const { id } = use(params);
  const { t } = useLanguage();
  const [callStatus, setCallStatus] = useState<CallStatus>("idle");

  const profesional = mockProfesionales.find((p) => p.id === id);

  if (!profesional) {
    notFound();
  }

  const handleStartCall = () => {
    setCallStatus("connecting");
    // Simular conexión
    setTimeout(() => {
      setCallStatus("in-call");
    }, 2000);
  };

  const handleEndCall = () => {
    setCallStatus("ended");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white">{t("video.page_title")}</h1>
        <p className="mt-2 text-white/70">{t("video.page_subtitle")}</p>
      </div>

      <Card>
        <div className="space-y-6">
          {/* Profesional Info */}
          <div className="flex items-center gap-4 pb-4 border-b border-white/10">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#C9A24D] to-[#C08457] text-xl font-bold text-black">
              {profesional.nombre
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </div>
            <div>
              <h3 className="font-semibold text-white">{profesional.nombre}</h3>
              <p className="text-sm text-white/60">{profesional.titulo}</p>
            </div>
          </div>

          {/* Call Status */}
          <div className="text-center py-8">
            {callStatus === "idle" && (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="flex h-32 w-32 items-center justify-center rounded-full bg-white/5 border-2 border-white/10">
                    <svg
                      className="h-16 w-16 text-white/40"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
                <p className="text-white/60">Listo para iniciar la videollamada</p>
                <Button onClick={handleStartCall} variant="primary" size="lg">
                  {t("video.start_call")}
                </Button>
              </div>
            )}

            {callStatus === "connecting" && (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="flex h-32 w-32 items-center justify-center rounded-full bg-[#C9A24D]/20 border-2 border-[#C9A24D]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A24D]"></div>
                  </div>
                </div>
                <p className="text-white/80 font-medium">{t("video.connecting")}</p>
              </div>
            )}

            {callStatus === "in-call" && (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="flex h-32 w-32 items-center justify-center rounded-full bg-green-500/20 border-2 border-green-500">
                    <svg
                      className="h-16 w-16 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
                <p className="text-white/80 font-medium">{t("video.in_call")}</p>
                <p className="text-sm text-white/60">
                  Conectado con {profesional.nombre}
                </p>
                <Button onClick={handleEndCall} variant="secondary" size="lg" className="bg-red-500/20 hover:bg-red-500/30 border-red-500/40">
                  {t("video.end_call")}
                </Button>
              </div>
            )}

            {callStatus === "ended" && (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="flex h-32 w-32 items-center justify-center rounded-full bg-white/5 border-2 border-white/10">
                    <svg
                      className="h-16 w-16 text-white/40"
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
                  </div>
                </div>
                <p className="text-white/80 font-medium">{t("video.call_ended")}</p>
                <div className="flex gap-3 justify-center">
                  <Button onClick={handleStartCall} variant="primary" size="lg">
                    {t("video.start_call")}
                  </Button>
                  <Link href={`/profesionales/${id}`}>
                    <Button variant="ghost" size="lg">
                      {t("common.back")}
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
