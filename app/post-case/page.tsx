"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/auth";
import { calculateCasePriority } from "@/lib/dpt-engine";
import { LegalCase } from "@/lib/types";
import Card from "@/components/Card";
import Button from "@/components/Button";
import confetti from "canvas-confetti";
import Image from "next/image";
import { mockProfesionales } from "@/lib/mock-data";

type FlowStep = "input" | "scanning" | "professionals" | "success";

export default function PostCasePage() {
  const router = useRouter();
  const [session, setSession] = useState<ReturnType<typeof getSession>>(null);
  const [mounted, setMounted] = useState(false);
  const [flowStep, setFlowStep] = useState<FlowStep>("input");
  const [userInput, setUserInput] = useState("");
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [showAiAssistant, setShowAiAssistant] = useState(false);
  const [selectedProfessionals, setSelectedProfessionals] = useState<any[]>([]);
  const [caseData, setCaseData] = useState<LegalCase | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const currentSession = getSession();
      setSession(currentSession);
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/post-case/page.tsx:mount',message:'PostCasePage mounted',data:{hasSession:!!currentSession,hasMockProfesionales:typeof mockProfesionales !== 'undefined',mockProfesionalesLength:mockProfesionales?.length || 0},timestamp:Date.now(),sessionId:'debug-session',runId:'run-verify',hypothesisId:'H3'})}).catch(()=>{});
      // #endregion

      if (!currentSession) {
        router.push("/login");
      }
    }
  }, [router]);

  // Detectar cuando el usuario escribe para mostrar sugerencia de IA
  useEffect(() => {
    if (userInput.length > 20) {
      setShowAiAssistant(true);
      // Simular análisis de IA
      const normalized = userInput.toLowerCase();
      if (normalized.includes("pagaré") || normalized.includes("cheque") || normalized.includes("cobro")) {
        setAiSuggestion("Parece un caso de Cobro de Guaraníes (Civil). ¿Te ayudo a buscar un especialista en Títulos Ejecutivos?");
      } else if (normalized.includes("robo") || normalized.includes("asalto") || normalized.includes("penal")) {
        setAiSuggestion("Parece un caso Penal. ¿Te ayudo a encontrar un penalista verificado?");
      } else if (normalized.includes("trabajo") || normalized.includes("despido") || normalized.includes("laboral")) {
        setAiSuggestion("Parece un caso Laboral. ¿Te ayudo a buscar un especialista en Derecho del Trabajo?");
      } else {
        setAiSuggestion("Estoy analizando tu caso. ¿Te ayudo a encontrar el profesional adecuado?");
      }
    } else {
      setShowAiAssistant(false);
      setAiSuggestion(null);
    }
  }, [userInput]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="h-96 bg-white rounded-2xl shadow-lg animate-pulse" />
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const handleSubmit = async () => {
    if (!userInput.trim()) {
      alert("Por favor, describe tu caso");
      return;
    }

    // Paso 1: Animación de escaneo
    setFlowStep("scanning");

    // Simular análisis DPT
    await new Promise((resolve) => setTimeout(resolve, 2500));

    // Clasificar automáticamente basado en el texto
    const normalized = userInput.toLowerCase();
    let practiceArea: LegalCase["practiceArea"] = "CIVIL";
    let complexity: LegalCase["complexity"] = "MEDIA";

    if (normalized.includes("penal") || normalized.includes("robo") || normalized.includes("asalto")) {
      practiceArea = "PENAL";
      complexity = "ALTA";
    } else if (normalized.includes("laboral") || normalized.includes("trabajo") || normalized.includes("despido")) {
      practiceArea = "LABORAL";
      complexity = "MEDIA";
    } else if (normalized.includes("empresa") || normalized.includes("corporativo") || normalized.includes("sociedad")) {
      practiceArea = "CORPORATIVO";
      complexity = "ALTA";
    }

    // Seleccionar profesionales sugeridos (mocks)
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/post-case/page.tsx:handleSubmit',message:'Filtering professionals',data:{totalProfesionales:mockProfesionales?.length || 0,practiceArea,complexity},timestamp:Date.now(),sessionId:'debug-session',runId:'run-verify',hypothesisId:'H3'})}).catch(()=>{});
    // #endregion
    const filtered = mockProfesionales
      .filter((p) => p.categoria === "Abogados")
      .slice(0, 3);
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/post-case/page.tsx:handleSubmit',message:'Professionals filtered',data:{filteredCount:filtered.length,professionalIds:filtered.map(p=>p.id)},timestamp:Date.now(),sessionId:'debug-session',runId:'run-verify',hypothesisId:'H3'})}).catch(()=>{});
    // #endregion
    setSelectedProfessionals(filtered);

    // Crear caso
    const budget = 3000000; // Presupuesto estimado por defecto
    const priority = calculateCasePriority({
      title: userInput.substring(0, 50),
      description: userInput,
      complexity,
      practiceArea,
      estimatedBudget: budget,
      status: "OPEN",
    });

    const newCase: LegalCase = {
      id: `case_${Date.now()}`,
      title: userInput.substring(0, 50) || "Caso Legal",
      description: userInput,
      complexity,
      practiceArea,
      estimatedBudget: budget,
      status: "OPEN",
      exclusiveForGepUntil: priority.exclusiveForGepUntil,
      createdAt: new Date().toISOString(),
    };

    setCaseData(newCase);

    // Guardar en localStorage
    try {
      const existingCases = JSON.parse(localStorage.getItem("legal-py-cases") || "[]");
      existingCases.push(newCase);
      localStorage.setItem("legal-py-cases", JSON.stringify(existingCases));
    } catch (error) {
      console.error("Error saving case:", error);
    }

    // Mostrar profesionales
    setFlowStep("professionals");
  };

  const handleRequestQuote = (professionalId: string) => {
    // Simular solicitud de presupuesto
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#C9A24D", "#C08457", "#ffffff"],
    });

    setFlowStep("success");

    setTimeout(() => {
      router.push("/panel");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            ¿Qué necesitas resolver hoy?
          </h1>
          <p className="text-lg text-gray-600">
            Cuéntanos tu caso y nuestro sistema encontrará al profesional perfecto para ti
          </p>
        </div>

        {/* Magic Input - Paso 1 */}
        {flowStep === "input" && (
          <div className="relative">
            <Card className="p-8 shadow-xl border-2 border-gray-200">
              <div className="relative">
                <textarea
                  ref={inputRef}
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Cuéntanos qué necesitas resolver hoy..."
                  className="w-full min-h-[200px] px-6 py-4 text-lg rounded-2xl border-2 border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none resize-none transition-all"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                      handleSubmit();
                    }
                  }}
                />
                <div className="absolute bottom-4 right-4 text-xs text-gray-400">
                  {userInput.length > 0 && `${userInput.length} caracteres`}
                </div>
              </div>

              {/* Asistente IA apareciendo sutilmente */}
              {showAiAssistant && aiSuggestion && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl animate-fade-in">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center shrink-0">
                      <span className="text-white text-lg">🤖</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 leading-relaxed">{aiSuggestion}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <Button
                  variant="primary"
                  onClick={handleSubmit}
                  disabled={!userInput.trim()}
                  className="px-8 py-3 text-lg rounded-xl"
                >
                  Buscar Profesionales →
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Animación de Escaneo - Paso 2 */}
        {flowStep === "scanning" && (
          <Card className="p-12 shadow-xl text-center">
            <div className="space-y-6">
              <div className="relative w-24 h-24 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>
                <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
                <div className="absolute inset-4 rounded-full bg-blue-50 flex items-center justify-center">
                  <span className="text-3xl">🔍</span>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Escaneando Red de Profesionales...</h2>
              <p className="text-gray-600">Estamos analizando tu caso y buscando los mejores especialistas</p>
            </div>
          </Card>
        )}

        {/* Profesionales Sugeridos - Paso 3 */}
        {flowStep === "professionals" && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Profesionales Sugeridos para tu Caso
              </h2>
              <p className="text-gray-600">
                Hemos encontrado {selectedProfessionals.length} especialistas que pueden ayudarte
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {selectedProfessionals.map((prof) => (
                <Card key={prof.id} className="p-6 hover:shadow-xl transition-shadow">
                  <div className="space-y-4">
                    {/* Foto y Badge */}
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 mx-auto flex items-center justify-center text-white text-2xl font-bold">
                        {prof.nombre.charAt(0)}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="text-center">
                      <h3 className="font-bold text-gray-900 text-lg">{prof.nombre}</h3>
                      <p className="text-sm text-gray-600">{prof.especialidad}</p>
                      <div className="flex items-center justify-center gap-1 mt-2">
                        <span className="text-yellow-400">⭐</span>
                        <span className="text-sm font-semibold text-gray-700">{prof.rating}</span>
                        <span className="text-xs text-gray-500">({prof.reviews} reseñas)</span>
                      </div>
                    </div>

                    {/* CTA */}
                    <Button
                      variant="primary"
                      onClick={() => handleRequestQuote(prof.id)}
                      className="w-full rounded-xl py-3"
                    >
                      Solicitar Presupuesto
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            <div className="text-center mt-8">
              <Button
                variant="outline"
                onClick={() => setFlowStep("input")}
                className="px-6 py-2"
              >
                ← Volver a escribir
              </Button>
            </div>
          </div>
        )}

        {/* Éxito - Paso 4 */}
        {flowStep === "success" && (
          <Card className="p-12 shadow-xl text-center">
            <div className="space-y-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">¡Solicitud Enviada!</h2>
              <p className="text-gray-600">
                El profesional recibió tu solicitud y te contactará pronto
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
