"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/auth";
import { LegalCase } from "@/lib/types";
import { calculateCasePriority, getAvailableCasesForUser } from "@/lib/dpt-engine";
import CaseCard from "@/components/Opportunities/CaseCard";
import Card from "@/components/Card";
import Button from "@/components/Button";

export default function OpportunitiesPage() {
  const router = useRouter();
  const [session, setSession] = useState(getSession());
  const [cases, setCases] = useState<LegalCase[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentSession = getSession();
      setSession(currentSession);

      if (!currentSession) {
        router.push("/login");
        return;
      }

      // 1. Datos mock de casos para pruebas (mantener como base)
      const mockCases: Omit<LegalCase, "exclusiveForGepUntil" | "id" | "createdAt">[] = [
        // 2 Casos "High Ticket" (deben salir bloqueados para usuarios normales)
        {
          title: "Fusión Corporativa Multinacional",
          description: "Asesoramiento legal completo para fusión entre dos empresas multinacionales con presencia en 5 países. Requiere expertise en derecho corporativo internacional, regulaciones financieras y compliance.",
          complexity: "ALTA",
          practiceArea: "CORPORATIVO",
          estimatedBudget: 15000000, // 15 millones Gs
          status: "OPEN",
        },
        {
          title: "Defensa Penal de Alto Perfil",
          description: "Caso penal complejo que involucra múltiples jurisdicciones y requiere conocimiento especializado en derecho penal internacional y extradición.",
          complexity: "ALTA",
          practiceArea: "PENAL",
          estimatedBudget: 8000000, // 8 millones Gs
          status: "OPEN",
        },
        // 3 Casos "Standard" (deben salir libres para todos)
        {
          title: "Demanda Laboral por Despido Injustificado",
          description: "Cliente busca representación legal para demanda por despido injustificado. Caso estándar de derecho laboral.",
          complexity: "MEDIA",
          practiceArea: "LABORAL",
          estimatedBudget: 3000000, // 3 millones Gs
          status: "OPEN",
        },
        {
          title: "Divorcio Contencioso con Bienes",
          description: "Proceso de divorcio contencioso con división de bienes gananciales. Requiere experiencia en derecho de familia.",
          complexity: "MEDIA",
          practiceArea: "FAMILIA",
          estimatedBudget: 2500000, // 2.5 millones Gs
          status: "OPEN",
        },
        {
          title: "Contrato de Arrendamiento Comercial",
          description: "Asesoramiento para redacción y revisión de contrato de arrendamiento comercial. Caso de complejidad baja.",
          complexity: "BAJA",
          practiceArea: "CIVIL",
          estimatedBudget: 1500000, // 1.5 millones Gs
          status: "OPEN",
        },
      ];

      // 2. Calcular prioridad y crear casos mock completos
      const now = new Date().toISOString();
      const processedMockCases: LegalCase[] = mockCases.map((mockCase, index) => {
        const priority = calculateCasePriority(mockCase);
        return {
          id: `mock_case_${Date.now()}_${index}`,
          ...mockCase,
          ...priority,
          createdAt: now,
        };
      });

      // 3. Leer casos del localStorage (casos publicados por usuarios)
      let localStorageCases: LegalCase[] = [];
      try {
        const stored = localStorage.getItem("legal-py-cases");
        if (stored) {
          const parsed = JSON.parse(stored);
          // Validar que sean casos válidos
          localStorageCases = Array.isArray(parsed)
            ? parsed.filter(
                (c: any): c is LegalCase =>
                  c &&
                  typeof c === "object" &&
                  c.id &&
                  c.title &&
                  c.description &&
                  c.complexity &&
                  c.practiceArea &&
                  typeof c.estimatedBudget === "number" &&
                  c.status &&
                  c.createdAt
              )
            : [];
        }
      } catch (error) {
        console.error("Error reading cases from localStorage:", error);
      }

      // 4. Combinar casos: localStorage primero (más nuevos), luego mocks
      const allCases = [...localStorageCases, ...processedMockCases];

      // 5. Ordenar por fecha de creación (más nuevos primero)
      allCases.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA; // Orden descendente (más reciente primero)
      });

      // 6. Filtrar casos disponibles según el tier del usuario
      const userTier = currentSession.user.kycTier;
      const availableCases = getAvailableCasesForUser(userTier, allCases);
      setCases(availableCases);
    }
  }, [router]);

  if (!session) {
    return null;
  }

  const userTier = session.user.kycTier;

  const handleApply = (caseId: string) => {
    const selectedCase = cases.find((c) => c.id === caseId);
    if (selectedCase) {
      alert(
        `Aplicación enviada para: ${selectedCase.title}\n\n` +
          `En producción, esto enviaría una notificación al cliente y registraría tu interés en el caso.`
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E1B2A] via-[#13253A] to-[#0E1B2A] py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">💼 Oportunidades de Casos</h1>
          <p className="text-white/70">
            Sistema DPT: Derivación Priorizada por Perfil Técnico. Los casos de alta complejidad o alto presupuesto
            tienen prioridad exclusiva para socios GEP durante 24 horas.
          </p>
        </div>

        {/* Info Card para GEP */}
        {userTier === 3 && (
          <Card className="mb-6 bg-[#C9A24D]/10 border-[#C9A24D]/30">
            <div className="p-4 flex items-start gap-3">
              <span className="text-2xl">👑</span>
              <div>
                <h3 className="font-semibold text-[#C9A24D] mb-1">Socio GEP - Acceso Prioritario</h3>
                <p className="text-sm text-white/80">
                  Tienes acceso prioritario a todos los casos, incluyendo aquellos marcados como exclusivos GEP.
                  Puedes aceptar casos de alta complejidad o alto presupuesto inmediatamente.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Info Card para usuarios no-GEP */}
        {userTier < 3 && (
          <Card className="mb-6 bg-blue-500/10 border-blue-500/30">
            <div className="p-4 flex items-start gap-3">
              <span className="text-2xl">ℹ️</span>
              <div>
                <h3 className="font-semibold text-blue-400 mb-1">Sistema de Prioridad DPT</h3>
                <p className="text-sm text-white/80">
                  Los casos de alta complejidad o alto presupuesto (más de 5,000,000 Gs) están reservados
                  exclusivamente para socios GEP durante 24 horas. Después de ese período, estarán disponibles
                  para todos los profesionales.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Grilla de casos */}
        {cases.length === 0 ? (
          <Card>
            <div className="p-8 text-center">
              <p className="text-white/70">No hay casos disponibles en este momento.</p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cases.map((legalCase) => (
              <CaseCard
                key={legalCase.id}
                legalCase={legalCase}
                userTier={userTier}
                onApply={handleApply}
              />
            ))}
          </div>
        )}

        {/* Footer con información adicional */}
        <div className="mt-8 text-center">
          <p className="text-sm text-white/60">
            ¿Eres profesional y quieres acceso prioritario?{" "}
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/security-center")}
              className="ml-2"
            >
              Verifica tu identidad
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}
