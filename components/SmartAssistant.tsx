"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import Modal from "@/components/Modal";
import { getSession } from "@/lib/auth";
import { mockProfesionales } from "@/lib/mock-data";
import { AssistantId, useElevenLabs } from "@/hooks/useElevenLabs";
import { useLanguage } from "@/context/LanguageContext";

type MessageRole = "user" | "assistant";

interface ChatMessage {
  id: string;
  role: MessageRole;
  text: string;
  structuredData?: Record<string, any>; // JSON extraído de la respuesta
}

interface StructuredData {
  classification?: string;
  data?: {
    monto?: number;
    ubicacion?: string;
    tipoCaso?: string;
    [key: string]: any;
  };
}

function uid() {
  return `m_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function normalize(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

function getAssistantCopy(a: AssistantId) {
  if (a === "justo") {
    return {
      name: "Justo",
      tagline: "Autoridad, claro y pausado",
      persona: "Voz grave y pausada (Autoridad). Ideal para casos corporativos/penales.",
      avatarSrc: "/avatars/icono_abogado_avatar.jpeg",
      accent: "from-[#C9A24D]/20 to-[#C08457]/20",
      emoji: "👨‍⚖️",
    };
  }
  return {
    name: "Victoria",
    tagline: "Empatía, calma y precisión",
    persona: "Voz empática y clara (Confianza). Ideal para familia/laboral/estudiantes.",
    avatarSrc: "/avatars/icono_abogada_avatar.jpeg",
    accent: "from-blue-500/20 to-purple-500/20",
    emoji: "👩‍⚖️",
  };
}

function recommendProfessionalsForTopic(topic: "cheques" | "penal" | "default") {
  const candidates = mockProfesionales.filter((p) => p.categoria === "Abogados");
  if (topic === "cheques") {
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
  const router = useRouter();
  const session = getSession();
  const role = session?.user.role ?? "cliente";
  const userTier = session?.user.kycTier ?? 0; // 0 = FREE, 1+ = Premium
  const isStudent = role === "estudiante";
  const isFreeUser = userTier === 0;

  const [isOpen, setIsOpen] = useState(false);
  const [showPersonalityModal, setShowPersonalityModal] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [assistant, setAssistant] = useState<AssistantId | null>(null); // null = no seleccionado aún
  const [input, setInput] = useState("");
  const [recommendedTopic, setRecommendedTopic] = useState<null | "cheques" | "penal" | "default">(null);
  const [showPostCaseCTA, setShowPostCaseCTA] = useState(false);
  const [showUpsellModal, setShowUpsellModal] = useState(false);
  const [autoFillData, setAutoFillData] = useState<StructuredData | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);

  // Web Speech API
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const finalTranscriptRef = useRef("");

  const { isSpeaking, isRecording, speak, startRecording, stopRecording, stopAudio } = useElevenLabs();

  const assistantMeta = useMemo(() => {
    if (!assistant) return null;
    return getAssistantCopy(assistant);
  }, [assistant]);

  const professionals = useMemo(() => {
    if (!recommendedTopic) return [];
    return recommendProfessionalsForTopic(recommendedTopic);
  }, [recommendedTopic]);

  // Mensaje inicial adaptado al rol
  const getInitialMessage = () => {
    if (isStudent) {
      return "Hola! 👋 Veo que sos estudiante. ¿Buscás pasantías, cursos de oratoria, o ayuda para filtrar la bolsa de trabajo?";
    }
    return "Hola, veo que necesitás ayuda legal. Para recomendarte al mejor experto, decime: ¿tu caso es Civil, Penal o Laboral?";
  };

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Inicializar Web Speech API
  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Web Speech API no disponible en este navegador");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "es-PY";

    recognition.onstart = () => {
      setIsListening(true);
      finalTranscriptRef.current = "";
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + " ";
        } else {
          interimTranscript += transcript;
        }
      }

      if (interimTranscript) {
        setInput(interimTranscript);
      }

      if (finalTranscript) {
        finalTranscriptRef.current += finalTranscript;
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      if (finalTranscriptRef.current.trim()) {
        setInput(finalTranscriptRef.current.trim());
        // Auto-enviar después de reconocimiento
        setTimeout(() => {
          sendMessage(finalTranscriptRef.current.trim());
        }, 300);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      if (event.error === "not-allowed") {
        setShowUpsellModal(true);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length, isOpen]);

  // Mostrar modal de personalidad al abrir por primera vez
  useEffect(() => {
    if (isOpen && !assistant && !showPersonalityModal) {
      setShowPersonalityModal(true);
    }
  }, [isOpen, assistant, showPersonalityModal]);

  // Inicializar mensajes cuando se selecciona el asistente
  useEffect(() => {
    if (assistant && messages.length === 0) {
      setMessages([
        {
          id: uid(),
          role: "assistant",
          text: getInitialMessage(),
        },
      ]);
    }
  }, [assistant, isStudent]);

  const closeWidget = (reason: "x" | "outside") => {
    setIsOpen(false);
    setIsMinimized(false);
    stopAudio();
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const minimizeWidget = () => {
    setIsMinimized(true);
    stopAudio();
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const restoreWidget = () => {
    setIsOpen(true);
    setIsMinimized(false);
  };

  const handleSelectAssistant = (next: AssistantId) => {
    setAssistant(next);
    setShowPersonalityModal(false);
    const welcomeText = next === "justo" 
      ? (isStudent ? "Hola, soy Justo. Te ayudo con estrategias legales y casos corporativos." : "Hola, soy Justo. Te ayudo con estrategias legales.")
      : (isStudent ? "Hola, soy Victoria. Te ayudo con pasantías, cursos y tu carrera legal." : "Hola, soy Victoria. Te ayudo con empatía y claridad.");
    speak({ assistant: next, text: welcomeText });
  };

  const handleStartVoiceInput = () => {
    if (isFreeUser) {
      setShowUpsellModal(true);
      return;
    }

    if (!recognitionRef.current) {
      alert("El reconocimiento de voz no está disponible en tu navegador.");
      return;
    }

    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error("Error starting recognition:", error);
      setShowUpsellModal(true);
    }
  };

  const handleStopVoiceInput = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const generateAssistantResponse = async (userText: string): Promise<{ text: string; structuredData?: StructuredData }> => {
    // Si es estudiante, adaptar contexto
    if (isStudent) {
      const q = normalize(userText);
      if (q.includes("pasantía") || q.includes("pasantia") || q.includes("internship")) {
        return {
          text: "Te recomiendo revisar la bolsa de trabajo en /career-center. Allí encontrarás pasantías en estudios jurídicos verificados. ¿Querés que te ayude a filtrar por especialidad?",
        };
      }
      if (q.includes("curso") || q.includes("capacitación") || q.includes("capacitacion")) {
        return {
          text: "Tenemos cursos de Oratoria, Redacción Legal y Ética Profesional. Podés verlos en /cursos. ¿Te interesa alguno en particular?",
        };
      }
    }

    // Llamar a la API de asistente
    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: isStudent
                ? "Eres un asistente de Legal PY especializado en ayudar estudiantes. Sugiere cursos, pasantías y oportunidades de carrera."
                : "Eres Justo/Victoria, un asistente operativo de Legal PY. Clasifica problemas y extrae datos en JSON.",
            },
            {
              role: "user",
              content: userText,
            },
          ],
          assistantName: assistant || "victoria",
          userId: session?.user.id,
        }),
      });

      if (!response.ok) {
        throw new Error("API error");
      }

      const data = await response.json();
      
      // Extraer datos estructurados si existen
      let structuredData: StructuredData | undefined;
      if (data.structuredData) {
        structuredData = data.structuredData;
        setAutoFillData(structuredData || null);
      }

      return {
        text: data.text || "No se pudo generar una respuesta.",
        structuredData,
      };
    } catch (error) {
      console.error("Error calling assistant API:", error);
      // Fallback a lógica local
      const q = normalize(userText);
      if (q.includes("me robaron") || (q.includes("robo") && q.includes("asalto"))) {
        setRecommendedTopic("penal");
        setShowPostCaseCTA(true);
        return {
          text: "Entiendo, es un caso Penal. Te recomiendo publicar el caso ahora para derivarte a un penalista verificado mediante el Motor DPT.",
        };
      }
      return {
        text: "Voy a actuar como IA de filtrado. No responderé con leyes específicas, pero sí voy a clasificar tu problema y recomendarte publicar un caso.",
      };
    }
  };

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setMessages((prev) => [...prev, { id: uid(), role: "user", text: trimmed }]);
    setInput("");
    setIsProcessingVoice(false);

    const response = await generateAssistantResponse(trimmed);
    
    const newMessage: ChatMessage = {
      id: uid(),
      role: "assistant",
      text: response.text,
      structuredData: response.structuredData,
    };

    setMessages((prev) => [...prev, newMessage]);
    
    // Si hay datos estructurados, mostrar CTA de auto-fill
    if (response.structuredData) {
      setShowPostCaseCTA(true);
    }

    // Reproducir voz con ElevenLabs
    if (assistant && !isFreeUser) {
      try {
        setIsProcessingVoice(true);
        const voiceResponse = await fetch("/api/voice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: response.text,
            voiceId: assistant,
            userId: session?.user.id,
            userTier: userTier > 0 ? "PROFESSIONAL" : "FREE",
          }),
        });

        if (voiceResponse.ok) {
          const audioBlob = await voiceResponse.blob();
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          audio.play();
          audio.onended = () => {
            setIsProcessingVoice(false);
            URL.revokeObjectURL(audioUrl);
          };
        } else {
          // Si falla, usar el mock
          speak({ assistant, text: response.text });
          setIsProcessingVoice(false);
        }
      } catch (error) {
        console.error("Error with voice API:", error);
        speak({ assistant, text: response.text });
        setIsProcessingVoice(false);
      }
    } else {
      // Usar mock para usuarios Free
      if (assistant) {
        speak({ assistant, text: response.text });
      }
    }
  };

  const handleAutoFill = () => {
    if (!autoFillData) return;

    // Construir URL con parámetros pre-llenados
    const params = new URLSearchParams();
    if (autoFillData.data?.monto) {
      params.set("budget", autoFillData.data.monto.toString());
    }
    if (autoFillData.data?.ubicacion) {
      params.set("location", autoFillData.data.ubicacion);
    }
    if (autoFillData.data?.tipoCaso) {
      params.set("type", autoFillData.data.tipoCaso);
    }
    if (autoFillData.classification) {
      params.set("category", autoFillData.classification);
    }

    router.push(`/post-case?${params.toString()}`);
  };

  if (!assistantMeta && !showPersonalityModal) {
    return null; // No mostrar nada hasta que se seleccione el asistente
  }

  return (
    <>
      {/* Modal de Selección de Personalidad */}
      <Modal
        isOpen={showPersonalityModal}
        onClose={() => {
          setShowPersonalityModal(false);
          setIsOpen(false);
        }}
        title="Elige tu Asistente Legal"
        zIndexClass="z-[9999]"
      >
        <div className="space-y-4 p-4">
          <p className="text-sm text-white/70 mb-6">
            Selecciona el asistente que mejor se adapte a tus necesidades:
          </p>
          <div className="grid grid-cols-1 gap-4">
            {(["justo", "victoria"] as AssistantId[]).map((a) => {
              const meta = getAssistantCopy(a);
              return (
                <button
                  key={a}
                  onClick={() => handleSelectAssistant(a)}
                  className="rounded-2xl p-4 border border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30 transition-all text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 rounded-2xl overflow-hidden border border-white/20 bg-white/5">
                      <Image src={meta.avatarSrc} alt={meta.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">{meta.emoji}</span>
                        <h3 className="text-lg font-bold text-white">{meta.name}</h3>
                      </div>
                      <p className="text-sm text-white/70">{meta.persona}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </Modal>

      {/* Modal de Upsell para usuarios Free */}
      <Modal
        isOpen={showUpsellModal}
        onClose={() => setShowUpsellModal(false)}
        title="💎 Función Premium"
        zIndexClass="z-[9999]"
      >
        <div className="space-y-4 p-4">
          <p className="text-white/90">
            La función de Voz es exclusiva para clientes Premium.
          </p>
          <p className="text-sm text-white/70">
            Habla con {assistantMeta?.name || "Victoria"} sin límites por solo Gs. 150.000/mes.
          </p>
          <div className="flex gap-3 pt-4">
            <Button
              variant="primary"
              className="flex-1"
              onClick={() => {
                router.push("/pricing");
                setShowUpsellModal(false);
              }}
            >
              Ver Planes
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowUpsellModal(false)}
            >
              Cerrar
            </Button>
          </div>
        </div>
      </Modal>

      {/* CTA Cerrado - Burbuja Neuroventas */}
      {!isOpen && assistantMeta && (
        <button
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="fixed bottom-32 right-6 z-[50] flex items-center gap-3 text-left pointer-events-auto"
          aria-label="Abrir asistente inteligente"
        >
          <div className="relative h-12 w-12">
            <span className="absolute inset-0 rounded-full bg-[#C9A24D]/40 animate-ping pointer-events-none" />
            <div className="relative h-12 w-12 rounded-full overflow-hidden border border-[#C9A24D]/80 bg-black/40 flex items-center justify-center shadow-lg">
              <Image src={assistantMeta.avatarSrc} alt={assistantMeta.name} fill className="object-cover" />
            </div>
          </div>
          <div className="max-w-xs rounded-2xl bg-gradient-to-r from-[#C9A24D] to-[#C08457] px-4 py-3 shadow-2xl hover:shadow-[#C9A24D]/40 transition-all hover:scale-[1.02]">
            <p className="text-sm font-extrabold text-black leading-snug">
              ¿No sabes a quién contratar? Te ayudamos a elegir al profesional exacto para tu caso 🎯
            </p>
          </div>
        </button>
      )}

      {/* Panel */}
      {isOpen && assistantMeta && (
        <div className="fixed inset-0 z-[50] pointer-events-none">
          {/* Click outside handler */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px] pointer-events-auto"
            onClick={() => closeWidget("outside")}
            aria-hidden="true"
          />

          {/* Minimized state */}
          {isMinimized ? (
            <button
              onClick={restoreWidget}
              className="absolute bottom-32 right-6 rounded-2xl px-4 py-3 bg-gradient-to-r from-[#C9A24D] to-[#C08457] text-black shadow-2xl hover:shadow-[#C9A24D]/30 transition-all hover:scale-[1.02] flex items-center gap-3 pointer-events-auto z-[51]"
              aria-label="Restaurar asistente"
            >
              <div className="h-10 w-10 rounded-2xl bg-black/10 flex items-center justify-center">
                <span className="text-lg">{assistantMeta.emoji}</span>
              </div>
              <div className="text-left">
                <p className="text-sm font-extrabold leading-tight">{assistantMeta.name}</p>
                <p className="text-xs font-medium opacity-80">Continuar</p>
              </div>
              <div className="ml-2 h-2 w-2 rounded-full bg-green-600 animate-pulse" />
            </button>
          ) : (
            <div
              className="absolute bottom-32 right-6 w-[360px] max-w-[92vw] pointer-events-auto z-[51]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative overflow-hidden rounded-3xl border border-[#C9A24D]/60 bg-white/10 backdrop-blur-2xl shadow-[0_0_35px_rgba(201,162,77,0.45)]">
                {/* Header */}
                <div className={`p-5 border-b border-white/10 bg-gradient-to-r ${assistantMeta.accent}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`relative h-12 w-12 rounded-2xl overflow-hidden border-2 ${
                        isSpeaking || isProcessingVoice ? "border-green-400 shadow-[0_0_20px_rgba(34,197,94,0.6)]" : "border-white/20"
                      } bg-white/5 shrink-0 transition-all`}>
                        <Image src={assistantMeta.avatarSrc} alt={assistantMeta.name} fill className="object-cover" />
                        {(isSpeaking || isProcessingVoice) && (
                          <div className="absolute inset-0 flex items-center justify-center bg-green-400/20">
                            <span className="text-xs text-green-300 font-bold">Hablando...</span>
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-white font-extrabold truncate">{assistantMeta.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            {isStudent ? "Estudiante" : role === "profesional" ? "Profesional" : "Cliente"}
                          </Badge>
                        </div>
                        <p className="text-xs text-white/70 truncate">{assistantMeta.tagline}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => closeWidget("x")}
                      className="rounded-2xl p-2 hover:bg-white/10 transition"
                      aria-label="Cerrar"
                    >
                      <svg className="h-5 w-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Disclaimer fijo */}
                  <div className="mt-3 rounded-2xl bg-yellow-400/15 border border-yellow-300/60 px-3 py-2 flex items-center gap-2">
                    <span className="text-xs">⚠️</span>
                    <p className="text-[11px] text-yellow-100 font-semibold leading-snug">
                      {t("ai_assistant.disclaimer") || "⚠️ IA de Filtrado - No es consejo legal"}
                    </p>
                  </div>

                  {/* Acciones: Minimizar */}
                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={minimizeWidget}
                      className="text-xs text-white/80 hover:text-white transition rounded-xl px-3 py-1 bg-white/5 border border-white/10 hover:bg-white/10"
                    >
                      Minimizar
                    </button>
                  </div>
                </div>

                {/* Mensajes */}
                <div ref={scrollRef} className="max-h-[360px] overflow-y-auto p-5 space-y-4">
                  {messages.map((m) => (
                    <div key={m.id} className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                      {m.role === "assistant" && (
                        <div className="h-9 w-9 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                          <span className="text-sm">{assistantMeta.emoji}</span>
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

                  {/* Botones rápidos de clasificación inicial */}
                  {messages.length === 1 && messages[0].role === "assistant" && !isStudent && (
                    <div className="mt-1 flex flex-wrap gap-2">
                      {[
                        { label: "Civil", value: "Mi caso es Civil" },
                        { label: "Penal", value: "Mi caso es Penal" },
                        { label: "Laboral", value: "Mi caso es Laboral" },
                        { label: "No sé", value: "No estoy seguro, necesito que me ayuden a clasificar mi caso" },
                      ].map((opt) => (
                        <button
                          key={opt.label}
                          type="button"
                          onClick={() => sendMessage(opt.value)}
                          className="px-3 py-1.5 rounded-full border border-white/20 bg-white/5 text-[11px] text-white/90 hover:bg-white/10 hover:border-white/40 transition"
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Botones rápidos para estudiantes */}
                  {messages.length === 1 && messages[0].role === "assistant" && isStudent && (
                    <div className="mt-1 flex flex-wrap gap-2">
                      {[
                        { label: "Pasantías", value: "Busco pasantías en estudios jurídicos" },
                        { label: "Cursos", value: "Quiero ver cursos de oratoria y redacción legal" },
                        { label: "Bolsa de Trabajo", value: "Ayúdame a filtrar la bolsa de trabajo" },
                      ].map((opt) => (
                        <button
                          key={opt.label}
                          type="button"
                          onClick={() => sendMessage(opt.value)}
                          className="px-3 py-1.5 rounded-full border border-white/20 bg-white/5 text-[11px] text-white/90 hover:bg-white/10 hover:border-white/40 transition"
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Tarjeta de Auto-Fill */}
                  {autoFillData && autoFillData.data && Object.keys(autoFillData.data).length > 0 && (
                    <Card className="bg-gradient-to-r from-[#C9A24D]/20 to-[#C08457]/20 border-[#C9A24D]/40 p-4 mt-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">✨</span>
                          <p className="text-sm font-bold text-white">
                            He detectado estos datos para tu caso. ¿Quieres que los cargue en el formulario?
                          </p>
                        </div>
                        <div className="space-y-2 text-xs text-white/80">
                          {autoFillData.data.monto && (
                            <p>💰 Monto: Gs. {autoFillData.data.monto.toLocaleString()}</p>
                          )}
                          {autoFillData.data.ubicacion && (
                            <p>📍 Ubicación: {autoFillData.data.ubicacion}</p>
                          )}
                          {autoFillData.data.tipoCaso && (
                            <p>📋 Tipo: {autoFillData.data.tipoCaso}</p>
                          )}
                          {autoFillData.classification && (
                            <p>🏷️ Categoría: {autoFillData.classification}</p>
                          )}
                        </div>
                        <Button
                          variant="primary"
                          className="w-full rounded-2xl bg-gradient-to-r from-[#C9A24D] to-[#C08457] text-black font-semibold"
                          onClick={handleAutoFill}
                        >
                          ✅ Sí, Crear Caso con estos datos
                        </Button>
                      </div>
                    </Card>
                  )}

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

                  {/* CTA de embudo: Publicar Caso */}
                  {showPostCaseCTA && !autoFillData && (
                    <div className="mt-4">
                      <Button
                        variant="primary"
                        className="w-full rounded-2xl bg-gradient-to-r from-[#C9A24D] to-[#C08457] text-black font-semibold shadow-lg hover:shadow-[#C9A24D]/40"
                        onClick={() => {
                          router.push("/post-case");
                        }}
                      >
                        ⚡ Publicar Caso
                      </Button>
                    </div>
                  )}
                </div>

                {/* Barra de voz + input */}
                <div className="p-5 border-t border-white/10 bg-white/5">
                  {/* Animación de ondas de sonido cuando está escuchando */}
                  {isListening && (
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-8 bg-[#C9A24D] rounded-full animate-pulse" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-12 bg-[#C9A24D] rounded-full animate-pulse" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-10 bg-[#C9A24D] rounded-full animate-pulse" style={{ animationDelay: "300ms" }} />
                        <span className="w-2 h-14 bg-[#C9A24D] rounded-full animate-pulse" style={{ animationDelay: "450ms" }} />
                        <span className="w-2 h-8 bg-[#C9A24D] rounded-full animate-pulse" style={{ animationDelay: "600ms" }} />
                      </div>
                      <p className="text-xs text-white/70">Escuchando...</p>
                    </div>
                  )}

                  {/* Onda de voz cuando está hablando */}
                  {(isSpeaking || isProcessingVoice) && (
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-6 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-8 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: "100ms" }} />
                        <span className="w-2 h-10 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: "200ms" }} />
                        <span className="w-2 h-8 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: "300ms" }} />
                        <span className="w-2 h-6 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: "400ms" }} />
                      </div>
                      <p className="text-xs text-green-300 font-semibold">Asistente hablando…</p>
                    </div>
                  )}

                  <div className="flex gap-2 items-end">
                    {/* Botón de micrófono grande y pulsante */}
                    <button
                      onMouseDown={handleStartVoiceInput}
                      onMouseUp={handleStopVoiceInput}
                      onTouchStart={handleStartVoiceInput}
                      onTouchEnd={handleStopVoiceInput}
                      className={`h-12 w-12 rounded-2xl border-2 transition-all flex items-center justify-center shrink-0 ${
                        isListening
                          ? "bg-red-500/30 border-red-500/60 shadow-[0_0_20px_rgba(239,68,68,0.5)] animate-pulse"
                          : "bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/40 hover:scale-105"
                      }`}
                      aria-label="Mantener para hablar"
                      title={isFreeUser ? "Función Premium - Actualiza tu plan" : "Mantener para hablar"}
                    >
                      <span className="text-xl">{isListening ? "🎙️" : "🎤"}</span>
                    </button>

                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={isStudent ? "Pregunta sobre pasantías, cursos..." : t("assistant.input_placeholder") || "Describe tu caso..."}
                      className="flex-1 h-12 rounded-2xl bg-white/10 px-4 text-sm text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-[#C9A24D]/60"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          sendMessage(input);
                        }
                      }}
                    />

                    <Button
                      variant="primary"
                      className="rounded-2xl h-12 px-4"
                      onClick={() => sendMessage(input)}
                    >
                      Enviar
                    </Button>
                  </div>

                  <p className="mt-3 text-[11px] text-white/50 leading-relaxed">
                    {isFreeUser ? "💎 Actualiza tu plan para usar voz sin límites" : "Demo: orientación general. No compartas datos sensibles."}
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
