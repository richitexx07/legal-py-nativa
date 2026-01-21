"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import { getSession } from "@/lib/auth";
import { mockProfesionales } from "@/lib/mock-data";
import { AssistantId, useElevenLabs } from "@/hooks/useElevenLabs";
import { useLanguage } from "@/context/LanguageContext";

type MessageRole = "user" | "assistant";

interface ChatMessage {
  id: string;
  role: MessageRole;
  text: string;
}

function uid() {
  return `m_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function normalize(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").trim();
}

function getAssistantCopy(a: AssistantId) {
  if (a === "justo") {
    return {
      name: "Justo",
      tagline: "Autoridad, claro y pausado",
      persona: "Voz grave y pausada (Autoridad).",
      avatarSrc: "/avatars/icono_abogado_avatar.jpeg",
      accent: "from-[#C9A24D]/20 to-[#C08457]/20",
    };
  }
  return {
    name: "Victoria",
    tagline: "Empatía, calma y precisión",
    persona: "Voz empática y clara (Confianza).",
    avatarSrc: "/avatars/icono_abogada_avatar.jpeg",
    accent: "from-blue-500/20 to-purple-500/20",
  };
}

function recommendProfessionalsForTopic(topic: "cheques" | "penal" | "default") {
  const candidates = mockProfesionales.filter((p) => p.categoria === "Abogados");
  if (topic === "cheques") {
    // Heurística demo: Civil/Comercial/Laboral suelen manejar cobros
    const scored = candidates
      .map((p) => {
        const spec = normalize(`${p.especialidad} ${p.titulo} ${(p.especialidades || []).join(" ")}`);
        const score =
          (spec.includes("civil") ? 3 : 0) +
          (spec.includes("comercial") ? 3 : 0) +
          (spec.includes("laboral") ? 1 : 0) +
          (p.rating >= 4.8 ? 2 : 0);
        return { p, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((x) => x.p);
    return scored;
  }
  if (topic === "penal") {
    return candidates
      .filter((p) => normalize(p.especialidad).includes("penal"))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3);
  }
  return candidates.sort((a, b) => b.rating - a.rating).slice(0, 3);
}

export default function SmartAssistant() {
  const { t } = useLanguage();
  const session = getSession();
  const role = session?.user.role ?? "cliente";

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [assistant, setAssistant] = useState<AssistantId>("victoria");
  const [input, setInput] = useState("");
  const [recommendedTopic, setRecommendedTopic] = useState<null | "cheques" | "penal" | "default">(null);

  const { isSpeaking, isRecording, speak, startRecording, stopRecording } = useElevenLabs();

  const assistantMeta = useMemo(() => getAssistantCopy(assistant), [assistant]);
  const professionals = useMemo(() => {
    if (!recommendedTopic) return [];
    return recommendProfessionalsForTopic(recommendedTopic);
  }, [recommendedTopic]);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: uid(),
      role: "assistant",
      text: t("assistant.welcome_default") || "Soy tu asistente inteligente de Legal PY. Puedo orientarte y recomendarte profesionales verificados según tu caso.",
    },
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: "debug-session",
        runId: "run2",
        hypothesisId: "H-SA-MOUNT",
        location: "components/SmartAssistant.tsx:mount",
        message: "SmartAssistant mounted",
        data: { hasSession: !!session, userRole: role },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length, isOpen]);

  useEffect(() => {
    if (isOpen) {
      // #region agent log
      fetch("http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: "debug-session",
          runId: "run3",
          hypothesisId: "H-SA",
          location: "components/SmartAssistant.tsx:open",
          message: "SmartAssistant opened",
          data: { userRole: role, assistant },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
      const welcomeText = assistant === "justo" 
        ? t("assistant.welcome_justo")
        : t("assistant.welcome_victoria");
      speak({ assistant, text: welcomeText });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const closeWidget = (reason: "x" | "outside") => {
    setIsOpen(false);
    setIsMinimized(false);
    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: "debug-session",
        runId: "run3",
        hypothesisId: "H-SA-CLOSE",
        location: "components/SmartAssistant.tsx:closeWidget",
        message: "SmartAssistant closed",
        data: { reason },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
  };

  const minimizeWidget = () => {
    setIsMinimized(true);
    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: "debug-session",
        runId: "run3",
        hypothesisId: "H-SA-MIN",
        location: "components/SmartAssistant.tsx:minimize",
        message: "SmartAssistant minimized",
        data: {},
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
  };

  const restoreWidget = () => {
    setIsOpen(true);
    setIsMinimized(false);
    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: "debug-session",
        runId: "run3",
        hypothesisId: "H-SA-MIN",
        location: "components/SmartAssistant.tsx:restore",
        message: "SmartAssistant restored",
        data: {},
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
  };

  const handleSelectAssistant = (next: AssistantId) => {
    setAssistant(next);
    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: "debug-session",
        runId: "run1",
        hypothesisId: "H-SA",
        location: "components/SmartAssistant.tsx:selectAssistant",
        message: "Assistant selected",
        data: { next },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    const welcomeText = next === "justo" 
      ? t("assistant.welcome_justo")
      : t("assistant.welcome_victoria");
    speak({ assistant: next, text: welcomeText });
  };

  const generateAssistantResponse = (userText: string) => {
    const q = normalize(userText);
    if (q.includes("cheque") && (q.includes("rebot") || q.includes("rechaz"))) {
      setRecommendedTopic("cheques");
      return (
        "Si tu cheque fue rechazado (\"cheque rebotado\"), lo primero es conservar el cheque y el comprobante del rechazo. " +
        "Luego, evaluá intimación de pago y la vía de cobro (según el banco, fechas y endosos). " +
        "Si hay urgencia o riesgo de insolvencia, conviene actuar rápido con un abogado para elegir la estrategia correcta."
      );
    }
    if (q.includes("penal") || q.includes("fiscalia") || q.includes("denuncia")) {
      setRecommendedTopic("penal");
      return (
        "Si tu situación es penal, evitá exponer detalles sensibles por chat. " +
        "Podemos avanzar con una orientación general y, si corresponde, derivarte a un penalista verificado. " +
        "Decime tu ciudad y si se trata de denuncia, citación o detención."
      );
    }
    setRecommendedTopic("default");
    return (
      "Puedo ayudarte a ordenar tu caso y recomendarte profesionales verificados. " +
      "Contame en 1 frase: materia (penal/civil/laboral) y tu ciudad."
    );
  };

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setMessages((prev) => [...prev, { id: uid(), role: "user", text: trimmed }]);
    setInput("");

    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: "debug-session",
        runId: "run3",
        hypothesisId: "H-SA",
        location: "components/SmartAssistant.tsx:sendMessage",
        message: "User message sent",
        data: { userRole: role, assistant, textLen: trimmed.length },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion

    const response = generateAssistantResponse(trimmed);
    setMessages((prev) => [...prev, { id: uid(), role: "assistant", text: response }]);
    speak({ assistant, text: response });
  };

  const holdToSpeakHint = async () => {
    // Demo: al soltar, inyecta un ejemplo útil para mostrar recomendación + voz
    const demo = "¿Qué hago con un cheque rebotado?";
    setInput(demo);
  };

  return (
    <>
      {/* CTA Cerrado - Premium Widget */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="fixed bottom-24 right-4 z-40 rounded-2xl px-4 py-3 bg-gradient-to-r from-[#C9A24D] to-[#C08457] text-black shadow-2xl hover:shadow-[#C9A24D]/30 transition-all hover:scale-[1.02] flex items-center gap-3"
          aria-label="Abrir asistente inteligente"
        >
          <div className="h-10 w-10 rounded-2xl bg-black/10 flex items-center justify-center">
            <span className="text-lg">💡</span>
          </div>
          <div className="text-left">
            <p className="text-sm font-extrabold leading-tight">{t("assistant.cta_title") || "¿Necesitas Consejo Legal?"}</p>
            <p className="text-xs font-medium opacity-80">{t("assistant.cta_subtitle") || "Habla con un Asistente"}</p>
          </div>
          <div className="ml-2 h-2 w-2 rounded-full bg-green-600 animate-pulse" />
        </button>
      )}

      {/* Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-40">
          {/* Click outside handler */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={() => closeWidget("outside")}
            aria-hidden="true"
          />

          {/* Minimized state (no pierde conversación) */}
          {isMinimized ? (
            <button
              onClick={restoreWidget}
              className="absolute bottom-24 right-4 rounded-2xl px-4 py-3 bg-gradient-to-r from-[#C9A24D] to-[#C08457] text-black shadow-2xl hover:shadow-[#C9A24D]/30 transition-all hover:scale-[1.02] flex items-center gap-3"
              aria-label="Restaurar asistente"
            >
              <div className="h-10 w-10 rounded-2xl bg-black/10 flex items-center justify-center">
                <span className="text-lg">💡</span>
              </div>
              <div className="text-left">
                <p className="text-sm font-extrabold leading-tight">{assistantMeta.name}</p>
                <p className="text-xs font-medium opacity-80">{t("common.continue") || "Continuar"}</p>
              </div>
              <div className="ml-2 h-2 w-2 rounded-full bg-green-600 animate-pulse" />
            </button>
          ) : (
            <div
              className="absolute bottom-24 right-4 w-[360px] max-w-[92vw]"
              onClick={(e) => e.stopPropagation()}
            >
          <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/5 backdrop-blur-2xl shadow-2xl">
            {/* Header */}
            <div className={`p-5 border-b border-white/10 bg-gradient-to-r ${assistantMeta.accent}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative h-12 w-12 rounded-2xl overflow-hidden border border-white/20 bg-white/5 shrink-0">
                    <Image src={assistantMeta.avatarSrc} alt={assistantMeta.name} fill className="object-cover" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-white font-extrabold truncate">{assistantMeta.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {role === "profesional" ? t("roles.pro_mode") : t("roles.client_mode")}
                      </Badge>
                    </div>
                    <p className="text-xs text-white/70 truncate">{assistantMeta.tagline}</p>
                  </div>
                </div>

                <button
                  onClick={() => closeWidget("x")}
                  className="rounded-2xl p-2 hover:bg-white/10 transition"
                  aria-label={t("assistant.close_label")}
                >
                  <svg className="h-5 w-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Acciones: Minimizar */}
              <div className="mt-3 flex justify-end">
                <button
                  onClick={minimizeWidget}
                  className="text-xs text-white/80 hover:text-white transition rounded-xl px-3 py-1 bg-white/5 border border-white/10 hover:bg-white/10"
                  aria-label={t("assistant.minimize_label")}
                >
                  {t("common.minimize") || "Minimizar"}
                </button>
              </div>

              {/* Selector de Asistente */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                {(["justo", "victoria"] as AssistantId[]).map((a) => {
                  const meta = getAssistantCopy(a);
                  const active = assistant === a;
                  return (
                    <button
                      key={a}
                      onClick={() => handleSelectAssistant(a)}
                      className={`rounded-2xl p-3 border transition-all text-left ${
                        active
                          ? "bg-white/15 border-white/30 shadow-lg"
                          : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                      }`}
                      aria-label={`Seleccionar asistente ${meta.name}`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="relative h-9 w-9 rounded-xl overflow-hidden border border-white/20 bg-white/5">
                          <Image src={meta.avatarSrc} alt={meta.name} fill className="object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-white truncate">
                            {a === "justo" ? "👨‍⚖️" : "👩‍⚖️"} {meta.name}
                          </p>
                          <p className="text-[11px] text-white/70 truncate">{meta.persona}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mensajes */}
            <div ref={scrollRef} className="max-h-[360px] overflow-y-auto p-5 space-y-4">
              {messages.map((m) => (
                <div key={m.id} className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  {m.role === "assistant" && (
                    <div className="h-9 w-9 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                      <span className="text-sm">{assistant === "justo" ? "👨‍⚖️" : "👩‍⚖️"}</span>
                    </div>
                  )}
                  <div
                    className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed border ${
                      m.role === "user"
                        ? "bg-[#C9A24D]/20 border-[#C9A24D]/30 text-white"
                        : "bg-white/5 border-white/10 text-white/90"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              {/* Recomendaciones */}
              {professionals.length > 0 && (
                <Card className="bg-white/5 border-white/10 p-4">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <p className="text-sm font-bold text-white">
                      Te recomiendo estos 3 abogados expertos en{" "}
                      {recommendedTopic === "cheques" ? "Cobro de Cheques" : recommendedTopic === "penal" ? "Penal" : "tu tema"}
                    </p>
                    <Badge variant="accent" className="bg-[#C9A24D] text-black text-xs">
                      Verificados
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    {professionals.map((p) => (
                      <div key={p.id} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                        <div className="relative h-10 w-10 rounded-xl overflow-hidden border border-white/10 bg-white/5">
                          <Image src={p.avatar || "/avatars/icono_abogado_avatar.jpeg"} alt={p.nombre} fill className="object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-white truncate">{p.nombre}</p>
                          <p className="text-xs text-white/70 truncate">
                            {p.titulo} • {p.ciudad}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-white/70">⭐ {p.rating.toFixed(1)}</p>
                          <p className="text-xs text-[#C9A24D] font-semibold">{p.precio}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>

            {/* Barra de voz + input */}
            <div className="p-5 border-t border-white/10 bg-white/5">
              {/* Onda de voz */}
              {isSpeaking && (
                <div className="mb-3 flex items-center gap-3">
                  <div className="assistant-wave" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>
                  <p className="text-xs text-white/70">Asistente hablando…</p>
                </div>
              )}

              <div className="flex gap-2 items-end">
                {/* Mic: Hold to Speak */}
                <button
                  onMouseDown={() => startRecording()}
                  onMouseUp={async () => {
                    stopRecording();
                    await holdToSpeakHint();
                  }}
                  onMouseLeave={() => {
                    if (isRecording) stopRecording();
                  }}
                  onTouchStart={() => startRecording()}
                  onTouchEnd={async () => {
                    stopRecording();
                    await holdToSpeakHint();
                  }}
                  className={`h-11 w-11 rounded-2xl border transition flex items-center justify-center ${
                    isRecording
                      ? "bg-red-500/20 border-red-500/40"
                      : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                  }`}
                  aria-label="Mantener para hablar"
                  title="Mantener para hablar (demo)"
                >
                  <span className="text-lg">{isRecording ? "🎙️" : "🎤"}</span>
                </button>

                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t("assistant.input_placeholder")}
                  className="flex-1 h-11 rounded-2xl bg-white/10 px-4 text-sm text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-[#C9A24D]/60"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      sendMessage(input);
                    }
                  }}
                />

                <Button
                  variant="primary"
                  className="rounded-2xl h-11 px-4"
                  onClick={() => sendMessage(input)}
                >
                  Enviar
                </Button>
              </div>

              <p className="mt-3 text-[11px] text-white/50 leading-relaxed">
                Demo: orientación general. No compartas datos sensibles. Para asesoramiento, conectamos con profesionales verificados.
              </p>
            </div>
          </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

