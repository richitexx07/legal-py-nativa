"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/auth";
import { calculateCasePriority } from "@/lib/dpt-engine";
import { LegalCase } from "@/lib/types";
import Card from "@/components/Card";
import Button from "@/components/Button";
import SmartAssistant from "@/components/SmartAssistant";
import { useBiometricCheck } from "@/hooks/useBiometricCheck";
import BiometricVerificationModal from "@/components/Security/BiometricVerificationModal";
import Snackbar from "@/components/Snackbar";
import { mockProfesionales } from "@/lib/mock-data";
import Image from "next/image";

type FlowStep = "input" | "processing" | "professionals" | "success";

interface AnonymizedProfessional {
  id: string;
  expertise: string;
  successRate: number;
  availability: "Disponible Ahora" | "Disponible en 2h" | "Disponible mañana";
  responseTime: string;
  verified: boolean;
}

export default function PostCasePage() {
  const router = useRouter();
  const [session, setSession] = useState<ReturnType<typeof getSession>>(null);
  const [mounted, setMounted] = useState(false);
  const [flowStep, setFlowStep] = useState<FlowStep>("input");
  const [userInput, setUserInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [anonymizedProfessionals, setAnonymizedProfessionals] = useState<AnonymizedProfessional[]>([]);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [notification, setNotification] = useState<{ message: string; type: "info" | "success" } | null>(null);
  
  // Hook para verificación biométrica en acciones críticas
  const { showModal, setShowModal, isVerifying, handleVerify, userId } = useBiometricCheck();

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const currentSession = getSession();
      setSession(currentSession);

      if (!currentSession) {
        router.push("/login");
      }
    }
  }, [router]);

  // Simular notificaciones cuando un profesional ve el caso
  useEffect(() => {
    if (flowStep === "professionals") {
      const timer1 = setTimeout(() => {
        setNotification({
          message: "👁️ Un especialista está revisando tu caso ahora",
          type: "info",
        });
      }, 2000);

      const timer2 = setTimeout(() => {
        setNotification({
          message: "✅ 2 profesionales han visto tu caso",
          type: "success",
        });
      }, 5000);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [flowStep]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0E1B2A] via-[#13253A] to-[#0E1B2A] py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="h-96 bg-white/5 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const handleInputSubmit = async () => {
    if (!userInput.trim()) {
      return;
    }

    setIsProcessing(true);
    setFlowStep("processing");

    // Simular procesamiento con IA (1-2 segundos)
    await new Promise((resolve) => setTimeout(resolve, 1800));

    // Detectar área legal
    const normalized = userInput.toLowerCase();
    let expertise = "Civil";
    if (normalized.includes("penal") || normalized.includes("robo") || normalized.includes("delito")) {
      expertise = "Penal";
    } else if (normalized.includes("familia") || normalized.includes("divorcio") || normalized.includes("sucesión")) {
      expertise = "Familia";
    } else if (normalized.includes("corporativo") || normalized.includes("empresa") || normalized.includes("sociedad")) {
      expertise = "Corporativo";
    } else if (normalized.includes("laboral") || normalized.includes("trabajo")) {
      expertise = "Laboral";
    }

    // Generar profesionales anonimizados
    const professionals = mockProfesionales
      .filter((p) => p.categoria === "Abogados")
      .slice(0, 3)
      .map((p, index) => ({
        id: `anon_${p.id}`,
        expertise,
        successRate: 95 + Math.floor(Math.random() * 4), // 95-98%
        availability: index === 0 ? "Disponible Ahora" : index === 1 ? "Disponible en 2h" : "Disponible mañana",
        responseTime: index === 0 ? "< 5 min" : index === 1 ? "< 30 min" : "< 2h",
        verified: true,
      } as AnonymizedProfessional));

    setAnonymizedProfessionals(professionals);

    // Crear caso
    const priority = calculateCasePriority({
      title: userInput.substring(0, 50),
      description: userInput,
      complexity: "MEDIA",
      practiceArea: "CIVIL" as LegalCase["practiceArea"],
      estimatedBudget: 3000000,
      status: "OPEN",
    });

    const newCase: LegalCase = {
      id: `case_${Date.now()}`,
      title: userInput.substring(0, 50) || "Caso Legal",
      description: userInput,
      complexity: "MEDIA",
      practiceArea: "CIVIL" as LegalCase["practiceArea"],
      estimatedBudget: 3000000,
      status: "OPEN",
      exclusiveForGepUntil: priority.exclusiveForGepUntil,
      createdAt: new Date().toISOString(),
    };

    // Guardar en localStorage
    try {
      const existingCases = JSON.parse(localStorage.getItem("legal-py-cases") || "[]");
      existingCases.push(newCase);
      localStorage.setItem("legal-py-cases", JSON.stringify(existingCases));
    } catch (error) {
      console.error("Error saving case:", error);
    }

    setIsProcessing(false);
    setFlowStep("professionals");
  };

  const handleRequestContact = () => {
    setNotification({
      message: "✅ Solicitud enviada. El profesional te contactará pronto.",
      type: "success",
    });

    setTimeout(() => {
      setFlowStep("success");
      setTimeout(() => {
        router.push("/panel");
      }, 2000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E1B2A] via-[#13253A] to-[#0E1B2A] py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Paso 1: Input Mágico (Cero Fricción) */}
        {flowStep === "input" && (
          <div className="relative">
            <Card className="p-12 shadow-xl border border-[#C9A24D]/30">
              <div className="relative">
                <label className="block text-white font-semibold mb-6 text-2xl text-center">
                  Cuéntanos tu situación...
                </label>
                <div className="relative">
                  <textarea
                    ref={inputRef}
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Ejemplo: Necesito ayuda con un caso de divorcio y división de bienes..."
                    className="w-full min-h-[280px] px-6 py-5 text-lg rounded-2xl bg-white/5 border-2 border-white/20 text-white placeholder-white/40 focus:border-[#C9A24D] focus:ring-4 focus:ring-[#C9A24D]/20 outline-none resize-none transition-all"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                        handleInputSubmit();
                      }
                    }}
                    autoFocus
                  />
                  <div className="absolute bottom-6 right-6 text-xs text-white/40">
                    {userInput.length > 0 && `${userInput.length} caracteres`}
                  </div>
                </div>
              </div>

              {/* Avatar de IA al lado del input (Hook Neuro) */}
              {userInput.length > 0 && (
                <div className="mt-8 p-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/40 rounded-2xl animate-fade-in">
                  <div className="flex items-start gap-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-blue-400/60 bg-white/10 shrink-0">
                      <Image 
                        src="/avatars/icono_abogada_avatar.jpeg" 
                        alt="Victoria" 
                        fill 
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-base text-white leading-relaxed font-medium">
                        <span className="font-semibold text-blue-300">Victoria:</span> No te preocupes por los términos legales. Solo dime qué pasó y yo encontraré al experto.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Animación de "Cerebro Procesando..." mientras escribe */}
              {userInput.length > 20 && flowStep === "input" && (
                <div className="mt-6 flex items-center gap-3 text-white/60">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-[#C9A24D] rounded-full animate-pulse" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-2 h-2 bg-[#C9A24D] rounded-full animate-pulse" style={{ animationDelay: "150ms" }}></div>
                    <div className="w-2 h-2 bg-[#C9A24D] rounded-full animate-pulse" style={{ animationDelay: "300ms" }}></div>
                  </div>
                  <span className="text-sm">Analizando tu situación...</span>
                </div>
              )}

              <div className="mt-8 flex flex-col items-center gap-4">
                <Button
                  variant="primary"
                  onClick={handleInputSubmit}
                  disabled={!userInput.trim()}
                  className="px-12 py-4 text-lg rounded-xl font-semibold"
                >
                  Buscar Profesional →
                </Button>
                {/* Disclaimer en el Flujo */}
                <p className="text-xs text-white/40 text-center max-w-md">
                  Servicio de intermediación tecnológica. No constituye asesoría legal.
                </p>
              </div>
            </Card>
          </div>
        )}

        {/* Paso 2: Animación de Procesamiento */}
        {flowStep === "processing" && (
          <Card className="p-16 shadow-xl text-center">
            <div className="space-y-8">
              <div className="relative w-32 h-32 mx-auto">
                {/* Animación de cerebro procesando */}
                <div className="absolute inset-0 rounded-full border-4 border-[#C9A24D]/20"></div>
                <div className="absolute inset-0 rounded-full border-4 border-[#C9A24D] border-t-transparent animate-spin"></div>
                <div className="absolute inset-6 rounded-full bg-[#C9A24D]/10 flex items-center justify-center">
                  <span className="text-5xl">🧠</span>
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-3">Cerebro Procesando...</h2>
                <p className="text-white/70 text-lg">Analizando tu caso y encontrando los mejores expertos</p>
              </div>
              <div className="flex justify-center gap-2 mt-6">
                <div className="w-2 h-2 bg-[#C9A24D] rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                <div className="w-2 h-2 bg-[#C9A24D] rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                <div className="w-2 h-2 bg-[#C9A24D] rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
              </div>
            </div>
          </Card>
        )}

        {/* Paso 3: Resultado Instantáneo - Profesionales Anonimizados */}
        {flowStep === "professionals" && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-white mb-3">
                Encontramos {anonymizedProfessionals.length} {anonymizedProfessionals[0]?.expertise} Expertos disponibles ahora
              </h2>
              <p className="text-white/70 text-lg">
                Estos profesionales coinciden con tu caso y están listos para ayudarte
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {anonymizedProfessionals.map((prof) => (
                <Card key={prof.id} className="p-6 hover:shadow-xl transition-all hover:scale-[1.02] border border-white/10">
                  <div className="space-y-5">
                    {/* Avatar anonimizado */}
                    <div className="relative mx-auto w-20 h-20">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#C9A24D] to-[#C08457] flex items-center justify-center text-white text-3xl font-bold">
                        {prof.expertise.charAt(0)}
                      </div>
                      {prof.verified && (
                        <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-green-500 border-2 border-[#13253A] flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>

                    <div className="text-center space-y-3">
                      <div>
                        <h3 className="font-bold text-white text-lg mb-1">Experto en {prof.expertise}</h3>
                        <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-500/20 rounded-full">
                          <span className="text-sm font-semibold text-green-400">{prof.successRate}% Éxito</span>
                        </div>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-white/10">
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-xs text-white/60">Disponibilidad:</span>
                          <span className={`text-xs font-semibold ${
                            prof.availability === "Disponible Ahora" ? "text-green-400" : 
                            prof.availability === "Disponible en 2h" ? "text-yellow-400" : 
                            "text-white/70"
                          }`}>
                            {prof.availability}
                          </span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-xs text-white/60">Respuesta:</span>
                          <span className="text-xs font-semibold text-white/80">{prof.responseTime}</span>
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="primary"
                      onClick={handleRequestContact}
                      className="w-full rounded-xl py-3 font-semibold"
                    >
                      Solicitar Contacto con Ellos
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Paso 4: Éxito */}
        {flowStep === "success" && (
          <Card className="p-16 shadow-xl text-center">
            <div className="space-y-6">
              <div className="w-24 h-24 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
                <svg className="w-16 h-16 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-4xl font-bold text-white">¡Solicitud Enviada!</h2>
              <p className="text-white/70 text-lg">
                El profesional recibió tu solicitud y te contactará pronto
              </p>
            </div>
          </Card>
        )}
      </div>

      {/* SmartAssistant flotante */}
      <SmartAssistant />

      {/* Notificaciones Dopamínicas */}
      {notification && (
        <Snackbar
          message={notification.message}
          type={notification.type}
          isOpen={true}
          onClose={() => setNotification(null)}
          duration={4000}
        />
      )}

      {/* Modal biométrico para acciones críticas */}
      {showModal && (
        <BiometricVerificationModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onVerify={handleVerify}
          isMandatory={false}
          isVerifying={isVerifying}
          userId={userId}
        />
      )}
    </div>
  );
}
