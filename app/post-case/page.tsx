"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/auth";
import { calculateCasePriority } from "@/lib/dpt-engine";
import { LegalCase } from "@/lib/types";
import { PRACTICE_AREAS, PracticeArea, getPracticeAreasByCategory } from "@/lib/practice-areas";
import Card from "@/components/Card";
import Button from "@/components/Button";
import confetti from "canvas-confetti";
import Image from "next/image";
import { mockProfesionales } from "@/lib/mock-data";

type FlowStep = "input" | "selectArea" | "scanning" | "professionals" | "success";

export default function PostCasePage() {
  const router = useRouter();
  const [session, setSession] = useState<ReturnType<typeof getSession>>(null);
  const [mounted, setMounted] = useState(false);
  const [flowStep, setFlowStep] = useState<FlowStep>("input");
  const [userInput, setUserInput] = useState("");
  const [selectedPracticeArea, setSelectedPracticeArea] = useState<PracticeArea | null>(null);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [showAiAssistant, setShowAiAssistant] = useState(false);
  const [selectedProfessionals, setSelectedProfessionals] = useState<any[]>([]);
  const [caseData, setCaseData] = useState<LegalCase | null>(null);
  const [hoveredArea, setHoveredArea] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

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

  // Detectar cuando el usuario escribe para mostrar sugerencia de IA
  useEffect(() => {
    if (userInput.length > 20) {
      setShowAiAssistant(true);
      const normalized = userInput.toLowerCase();
      
      // Sugerencias mejoradas basadas en las nuevas categorías
      if (normalized.includes("pagaré") || normalized.includes("cheque") || normalized.includes("cobro") || normalized.includes("ejecutivo")) {
        setAiSuggestion("Parece un caso de Cobro Ejecutivo. Te sugerimos la categoría 'Cobro de Pagarés y Cheques'.");
      } else if (normalized.includes("marca") || normalized.includes("registro") || normalized.includes("dinapi")) {
        setAiSuggestion("Parece un caso de Propiedad Intelectual. Te sugerimos 'Registro de Marcas (DINAPI)'.");
      } else if (normalized.includes("empresa") || normalized.includes("eas") || normalized.includes("constitución") || normalized.includes("sociedad")) {
        setAiSuggestion("Parece un caso Corporativo. Te sugerimos 'Constitución de EAS' o 'Due Diligence'.");
      } else if (normalized.includes("inversor") || normalized.includes("residencia") || normalized.includes("radicación") || normalized.includes("migración")) {
        setAiSuggestion("Parece un caso de Migraciones para Inversionistas. Te sugerimos 'Radicación y Residencia para Inversionistas'.");
      } else if (normalized.includes("aduana") || normalized.includes("sumario") || normalized.includes("importación")) {
        setAiSuggestion("Parece un caso de Comercio Exterior. Te sugerimos 'Sumarios Aduaneros'.");
      } else if (normalized.includes("divorcio") || normalized.includes("sucesión") || normalized.includes("familia")) {
        setAiSuggestion("Parece un caso de Familia. Te sugerimos 'Sucesiones y Divorcios'.");
      } else {
        setAiSuggestion("Estoy analizando tu caso. En el siguiente paso podrás seleccionar el área de práctica más adecuada.");
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

  const handleInputSubmit = () => {
    if (!userInput.trim()) {
      alert("Por favor, describe tu caso");
      return;
    }
    setFlowStep("selectArea");
  };

  const handleAreaSelect = (area: PracticeArea) => {
    setSelectedPracticeArea(area);
    setFlowStep("scanning");
    processCase(area);
  };

  const processCase = async (area: PracticeArea) => {
    // Simular análisis DPT
    await new Promise((resolve) => setTimeout(resolve, 2500));

    // Determinar complejidad basada en la categoría
    let complexity: LegalCase["complexity"] = "MEDIA";
    if (area.category === "HIGH_TICKET") {
      complexity = "ALTA";
    } else if (area.category === "CASH_FLOW") {
      complexity = "MEDIA";
    } else if (area.category === "VOLUME") {
      complexity = "BAJA";
    }

    // Presupuesto estimado basado en categoría
    let budget = 3000000; // Default
    if (area.category === "HIGH_TICKET") {
      budget = 8000000;
    } else if (area.category === "CASH_FLOW") {
      budget = 5000000;
    } else if (area.category === "VOLUME") {
      budget = 2000000;
    } else if (area.category === "NICHE") {
      budget = 4000000;
    }

    // Seleccionar profesionales sugeridos
    const filtered = mockProfesionales
      .filter((p) => p.categoria === "Abogados")
      .slice(0, 3);
    setSelectedProfessionals(filtered);

    // Crear caso
    const priority = calculateCasePriority({
      title: userInput.substring(0, 50),
      description: userInput,
      complexity,
      practiceArea: area.id as LegalCase["practiceArea"],
      estimatedBudget: budget,
      status: "OPEN",
    });

    const newCase: LegalCase = {
      id: `case_${Date.now()}`,
      title: userInput.substring(0, 50) || "Caso Legal",
      description: userInput,
      complexity,
      practiceArea: area.id as LegalCase["practiceArea"],
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

  const getCategoryLabel = (category: PracticeArea["category"]) => {
    switch (category) {
      case "HIGH_TICKET":
        return "High Ticket";
      case "VOLUME":
        return "Volumen";
      case "NICHE":
        return "Nicho";
      case "CASH_FLOW":
        return "Cash Flow";
      default:
        return "";
    }
  };

  const getCategoryColor = (category: PracticeArea["category"]) => {
    switch (category) {
      case "HIGH_TICKET":
        return "bg-gradient-to-r from-yellow-500 to-orange-500";
      case "VOLUME":
        return "bg-gradient-to-r from-blue-500 to-cyan-500";
      case "NICHE":
        return "bg-gradient-to-r from-purple-500 to-pink-500";
      case "CASH_FLOW":
        return "bg-gradient-to-r from-green-500 to-emerald-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
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
                      handleInputSubmit();
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
                  onClick={handleInputSubmit}
                  disabled={!userInput.trim()}
                  className="px-8 py-3 text-lg rounded-xl"
                >
                  Continuar → Seleccionar Área
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Selección de Área de Práctica - Paso 2 */}
        {flowStep === "selectArea" && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Selecciona el Área de Práctica
              </h2>
              <p className="text-gray-600">
                Elige la categoría que mejor describe tu necesidad legal
              </p>
            </div>

            {/* Categorías agrupadas */}
            {(["HIGH_TICKET", "VOLUME", "NICHE", "CASH_FLOW"] as const).map((category) => {
              const areas = getPracticeAreasByCategory(category);
              if (areas.length === 0) return null;

              return (
                <div key={category} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={`h-1 w-12 ${getCategoryColor(category)} rounded-full`}></div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {category === "HIGH_TICKET" && "🏢 Corporativo & Inversiones (High Ticket)"}
                      {category === "VOLUME" && "📊 Propiedad Intelectual (Volumen)"}
                      {category === "NICHE" && "🌐 Comercio Exterior (Nicho Aduanas)"}
                      {category === "CASH_FLOW" && "💰 Litigios & Recuperación (Cash Flow)"}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {areas.map((area) => (
                      <div
                        key={area.id}
                        className="relative"
                        onMouseEnter={() => setHoveredArea(area.id)}
                        onMouseLeave={() => setHoveredArea(null)}
                      >
                        <button
                          onClick={() => handleAreaSelect(area)}
                          className={`w-full p-6 rounded-2xl border-2 transition-all text-left ${
                            hoveredArea === area.id
                              ? "border-blue-500 bg-blue-50 shadow-lg scale-[1.02]"
                              : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <div className="text-4xl shrink-0">{area.icon}</div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-gray-900 text-lg mb-1">{area.name}</h4>
                              <p className="text-sm text-gray-600 mb-2">{area.description}</p>
                              <div className="flex items-center gap-2 mt-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${getCategoryColor(area.category)}`}>
                                  {getCategoryLabel(area.category)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </button>

                        {/* Tooltip */}
                        {hoveredArea === area.id && (
                          <div className="absolute z-10 left-0 right-0 top-full mt-2 p-4 bg-gray-900 text-white rounded-xl shadow-2xl animate-fade-in">
                            <div className="flex items-start gap-2">
                              <span className="text-yellow-400">💡</span>
                              <div>
                                <p className="font-semibold mb-1">{area.tooltip}</p>
                                {area.examples.length > 0 && (
                                  <div className="mt-2 pt-2 border-t border-gray-700">
                                    <p className="text-xs text-gray-400 mb-1">Ejemplos:</p>
                                    <div className="flex flex-wrap gap-1">
                                      {area.examples.slice(0, 3).map((ex, idx) => (
                                        <span key={idx} className="text-xs bg-gray-800 px-2 py-1 rounded">
                                          {ex}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

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

        {/* Animación de Escaneo - Paso 3 */}
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

        {/* Profesionales Sugeridos - Paso 4 */}
        {flowStep === "professionals" && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Profesionales Sugeridos para tu Caso
              </h2>
              <p className="text-gray-600">
                Hemos encontrado {selectedProfessionals.length} especialistas que pueden ayudarte
              </p>
              {selectedPracticeArea && (
                <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full">
                  <span className="text-2xl">{selectedPracticeArea.icon}</span>
                  <span className="font-semibold text-gray-900">{selectedPracticeArea.name}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {selectedProfessionals.map((prof) => (
                <Card key={prof.id} className="p-6 hover:shadow-xl transition-shadow">
                  <div className="space-y-4">
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

                    <div className="text-center">
                      <h3 className="font-bold text-gray-900 text-lg">{prof.nombre}</h3>
                      <p className="text-sm text-gray-600">{prof.especialidad}</p>
                      <div className="flex items-center justify-center gap-1 mt-2">
                        <span className="text-yellow-400">⭐</span>
                        <span className="text-sm font-semibold text-gray-700">{prof.rating}</span>
                        <span className="text-xs text-gray-500">({prof.reviews || 0} reseñas)</span>
                      </div>
                    </div>

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
                onClick={() => setFlowStep("selectArea")}
                className="px-6 py-2"
              >
                ← Cambiar Área
              </Button>
            </div>
          </div>
        )}

        {/* Éxito - Paso 5 */}
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
