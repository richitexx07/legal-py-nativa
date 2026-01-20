"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/auth";
import { calculateCasePriority } from "@/lib/dpt-engine";
import { LegalCase } from "@/lib/types";
import Card from "@/components/Card";
import Button from "@/components/Button";
import FormField from "@/components/FormField";

export default function PostCasePage() {
  const router = useRouter();
  const [session, setSession] = useState(getSession());
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [dptResult, setDptResult] = useState<{
    classification: "ALTA" | "MEDIA" | "BAJA";
    status: string;
    isExclusiveGEP: boolean;
  } | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    practiceArea: "CIVIL" as LegalCase["practiceArea"],
    complexity: "MEDIA" as LegalCase["complexity"],
    estimatedBudget: "",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentSession = getSession();
      setSession(currentSession);

      if (!currentSession) {
        router.push("/login");
      }
    }
  }, [router]);

  if (!session) {
    return null;
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.title.trim() || !formData.description.trim()) {
        alert("Por favor completa todos los campos del Paso 1");
        return;
      }
    }
    if (step === 2) {
      if (!formData.practiceArea || !formData.complexity) {
        alert("Por favor selecciona el área de práctica y la complejidad");
        return;
      }
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.estimatedBudget || parseFloat(formData.estimatedBudget) <= 0) {
      alert("Por favor ingresa un presupuesto válido");
      return;
    }

    setLoading(true);

    // Simular delay de procesamiento
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Calcular prioridad DPT
    const budget = parseFloat(formData.estimatedBudget);
    const priority = calculateCasePriority({
      title: formData.title,
      description: formData.description,
      complexity: formData.complexity,
      practiceArea: formData.practiceArea,
      estimatedBudget: budget,
      status: "OPEN",
    });

    // Determinar clasificación DPT
    const isHighTicket = formData.complexity === "ALTA" || budget > 5000000;
    const classification = formData.complexity;
    const status = priority.exclusiveForGepUntil
      ? "Exclusivo GEP 24h"
      : "Abierto a Todos";

    setDptResult({
      classification,
      status,
      isExclusiveGEP: !!priority.exclusiveForGepUntil,
    });

    // Guardar caso (simulación - en producción se guardaría en BD)
    const newCase: LegalCase = {
      id: `case_${Date.now()}`,
      title: formData.title,
      description: formData.description,
      complexity: formData.complexity,
      practiceArea: formData.practiceArea,
      estimatedBudget: budget,
      status: "OPEN",
      exclusiveForGepUntil: priority.exclusiveForGepUntil,
      createdAt: new Date().toISOString(),
    };

    // Guardar en localStorage para simulación
    try {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/post-case/page.tsx:122',message:'Saving case to localStorage',data:{caseId:newCase.id,title:newCase.title,complexity:newCase.complexity,budget:newCase.estimatedBudget},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H5'})}).catch(()=>{});
      // #endregion
      const existingCases = JSON.parse(localStorage.getItem("legal-py-cases") || "[]");
      existingCases.push(newCase);
      localStorage.setItem("legal-py-cases", JSON.stringify(existingCases));
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/post-case/page.tsx:125',message:'Case saved successfully',data:{totalCases:existingCases.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H5'})}).catch(()=>{});
      // #endregion
    } catch (error) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/post-case/page.tsx:127',message:'ERROR saving case',data:{errorMessage:error instanceof Error?error.message:String(error)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H5'})}).catch(()=>{});
      // #endregion
      alert("Error al guardar el caso: " + (error instanceof Error ? error.message : String(error)));
      setLoading(false);
      return;
    }

    setLoading(false);
    setShowSuccessModal(true);

    // Redirigir después de 2 segundos
    setTimeout(() => {
      router.push("/panel");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E1B2A] via-[#13253A] to-[#0E1B2A] py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">⚖️ Publicar Caso Legal</h1>
          <p className="text-white/70">
            Completa el formulario para publicar tu caso. El sistema DPT determinará automáticamente la prioridad.
          </p>
        </div>

        {/* Indicador de pasos */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition ${
                    step >= s
                      ? "bg-[#C9A24D] border-[#C9A24D] text-black font-bold"
                      : "bg-white/5 border-white/20 text-white/50"
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={`flex-1 h-1 mx-2 transition ${
                      step > s ? "bg-[#C9A24D]" : "bg-white/10"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-white/60">
            <span>Información</span>
            <span>Clasificación</span>
            <span>Presupuesto</span>
          </div>
        </div>

        {/* Formulario */}
        <Card>
          <form onSubmit={handleSubmit} className="p-6">
            {/* Paso 1: Título y Descripción */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4">Paso 1: Información del Caso</h2>
                  <FormField label="Título del Caso" htmlFor="title" required>
                    <input
                      id="title"
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
                      placeholder="Ej: Demanda por incumplimiento contractual"
                      required
                    />
                  </FormField>
                </div>

                <FormField label="Descripción Detallada" htmlFor="description" required>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    rows={6}
                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D] resize-none"
                    placeholder="Describe los detalles del caso, situación actual, documentos relevantes, etc."
                    required
                  />
                </FormField>

                <div className="flex justify-end">
                  <Button type="button" variant="primary" onClick={handleNext}>
                    Siguiente →
                  </Button>
                </div>
              </div>
            )}

            {/* Paso 2: Área de Práctica y Complejidad */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4">Paso 2: Clasificación</h2>
                  <FormField label="Área de Práctica" htmlFor="practiceArea" required>
                    <select
                      id="practiceArea"
                      value={formData.practiceArea}
                      onChange={(e) => handleInputChange("practiceArea", e.target.value)}
                      className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
                      required
                    >
                      <option value="CIVIL">Civil</option>
                      <option value="PENAL">Penal</option>
                      <option value="CORPORATIVO">Corporativo</option>
                      <option value="LABORAL">Laboral</option>
                      <option value="FAMILIA">Familia</option>
                    </select>
                  </FormField>
                </div>

                <FormField label="Complejidad Estimada" htmlFor="complexity" required>
                  <select
                    id="complexity"
                    value={formData.complexity}
                    onChange={(e) => handleInputChange("complexity", e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
                    required
                  >
                    <option value="BAJA">Baja</option>
                    <option value="MEDIA">Media</option>
                    <option value="ALTA">Alta</option>
                  </select>
                  <p className="text-xs text-white/60 mt-1">
                    La complejidad ALTA o presupuesto mayor a 5,000,000 Gs otorga prioridad exclusiva GEP por 24h
                  </p>
                </FormField>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={handleBack}>
                    ← Anterior
                  </Button>
                  <Button type="button" variant="primary" onClick={handleNext}>
                    Siguiente →
                  </Button>
                </div>
              </div>
            )}

            {/* Paso 3: Presupuesto */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4">Paso 3: Presupuesto</h2>
                  <FormField label="Presupuesto Estimado (Guaraníes)" htmlFor="estimatedBudget" required>
                    <input
                      id="estimatedBudget"
                      type="number"
                      value={formData.estimatedBudget}
                      onChange={(e) => handleInputChange("estimatedBudget", e.target.value)}
                      className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
                      placeholder="5000000"
                      min="0"
                      step="100000"
                      required
                    />
                    <p className="text-xs text-white/60 mt-1">
                      Presupuesto en Guaraníes. Si es mayor a 5,000,000 Gs, tendrá prioridad exclusiva GEP.
                    </p>
                </FormField>
                </div>

                {/* Resumen */}
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <h3 className="text-sm font-semibold text-white mb-2">Resumen del Caso</h3>
                  <div className="space-y-1 text-sm text-white/70">
                    <p>
                      <span className="text-white/50">Título:</span> {formData.title || "No especificado"}
                    </p>
                    <p>
                      <span className="text-white/50">Área:</span> {formData.practiceArea}
                    </p>
                    <p>
                      <span className="text-white/50">Complejidad:</span> {formData.complexity}
                    </p>
                    <p>
                      <span className="text-white/50">Presupuesto:</span>{" "}
                      {formData.estimatedBudget
                        ? new Intl.NumberFormat("es-PY", {
                            style: "currency",
                            currency: "PYG",
                            minimumFractionDigits: 0,
                          }).format(parseFloat(formData.estimatedBudget))
                        : "No especificado"}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={handleBack}>
                    ← Anterior
                  </Button>
                  <Button type="submit" variant="primary" disabled={loading}>
                    {loading ? "Publicando..." : "Publicar Caso"}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </Card>

        {/* Modal de éxito */}
        {showSuccessModal && dptResult && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <Card className="max-w-md w-full mx-4">
              <div className="p-6 text-center">
                <div className="text-6xl mb-4">✅</div>
                <h2 className="text-2xl font-bold text-white mb-4">¡Caso Publicado!</h2>
                <div className="space-y-3 mb-6">
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-sm text-white/60 mb-1">Clasificación DPT</p>
                    <p className="text-lg font-semibold text-white">{dptResult.classification}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-sm text-white/60 mb-1">Estado</p>
                    <p className="text-lg font-semibold text-[#C9A24D]">{dptResult.status}</p>
                  </div>
                  {dptResult.isExclusiveGEP && (
                    <div className="p-3 rounded-lg bg-[#C9A24D]/10 border border-[#C9A24D]/30">
                      <p className="text-sm text-[#C9A24D]">
                        👑 Este caso tiene prioridad exclusiva para socios GEP durante 24 horas
                      </p>
                    </div>
                  )}
                </div>
                <p className="text-sm text-white/70 mb-4">Redirigiendo al panel...</p>
                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                  <div className="h-full bg-[#C9A24D] animate-pulse" style={{ width: "100%" }} />
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
