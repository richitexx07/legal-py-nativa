"use client";

import { useState, useEffect } from "react";
import { getSession } from "@/lib/auth";
import {
  getAllInternationalCases,
  getInternationalCases,
  InternationalCase,
} from "@/lib/international";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Tabs from "@/components/Tabs";
import InternationalCaseCard from "@/components/International/InternationalCaseCard";
import FunnelView from "@/components/International/FunnelView";

export default function CasosInternacionalesPage() {
  const session = getSession();
  const [cases, setCases] = useState<InternationalCase[]>([]);
  const [selectedCase, setSelectedCase] = useState<InternationalCase | null>(null);
  const [view, setView] = useState<"list" | "funnel">("list");
  const [filters, setFilters] = useState<{
    status?: string;
    minAmount?: number;
  }>({});

  useEffect(() => {
    if (!session) {
      window.location.href = "/login";
      return;
    }

    loadCases();
  }, [session, filters]);

  const loadCases = () => {
    const allCases = getInternationalCases(filters);
    setCases(allCases);
  };

  const handleViewFunnel = (caseData: InternationalCase) => {
    setSelectedCase(caseData);
    setView("funnel");
  };

  const handleBackToList = () => {
    setSelectedCase(null);
    setView("list");
    loadCases();
  };

  if (!session) {
    return null;
  }

  const isAdmin = session.user.role === "profesional"; // En producción, verificar si es admin
  const isGEPGold = false; // En producción, verificar si es GEP Gold

  if (view === "funnel" && selectedCase) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">Derivación Priorizada por Perfil Técnico</h1>
            <p className="mt-2 text-white/70">Caso: {selectedCase.title}</p>
          </div>
          <Button variant="outline" onClick={handleBackToList}>
            ← Volver a Lista
          </Button>
        </div>
        <FunnelView caseData={selectedCase} onUpdate={loadCases} isGEPGold={isGEPGold} />
      </div>
    );
  }

  const tabs = [
    {
      id: "all",
      label: "Todos",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cases.map((caseData) => (
            <InternationalCaseCard
              key={caseData.id}
              caseData={caseData}
              onViewDetails={() => handleViewFunnel(caseData)}
            />
          ))}
        </div>
      ),
    },
    {
      id: "funnel",
      label: "En Derivación",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cases
            .filter(
              (c) =>
                c.internationalStatus === "asignado_gep" ||
                c.internationalStatus === "en_evaluacion_gep" ||
                c.internationalStatus === "asignado_consorcio_tier_premium" ||
                c.internationalStatus === "asignado_consorcio_tier_standard" ||
                c.internationalStatus === "asignado_consorcio" // Legacy
            )
            .map((caseData) => (
              <InternationalCaseCard
                key={caseData.id}
                caseData={caseData}
                onViewDetails={() => handleViewFunnel(caseData)}
              />
            ))}
        </div>
      ),
    },
    {
      id: "derivation",
      label: "En Derivación Técnica",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cases
            .filter((c) => 
              c.internationalStatus === "en_evaluacion_gep" ||
              c.derivationStatus?.estado === "derivado_tier_premium" ||
              c.derivationStatus?.estado === "derivado_tier_standard" ||
              c.derivationStatus?.estado === "en_evaluacion_gep"
            )
            .map((caseData) => (
              <InternationalCaseCard
                key={caseData.id}
                caseData={caseData}
                onViewDetails={() => handleViewFunnel(caseData)}
              />
            ))}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white">Casos Internacionales</h1>
        <p className="mt-2 text-white/70">
          Casos con monto mínimo de USD 5,000 procesados a través del sistema ético de Derivación Priorizada por Perfil Técnico (DPT)
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-[#C9A24D]">{cases.length}</p>
            <p className="text-sm text-white/70 mt-1">Total Casos</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-[#C9A24D]">
              {cases.filter((c) => c.internationalStatus === "asignado_gep").length}
            </p>
            <p className="text-sm text-white/70 mt-1">Asignados GEP</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-[#C9A24D]">
              {cases.filter((c) => 
                c.internationalStatus === "asignado_consorcio_tier_premium" ||
                c.internationalStatus === "asignado_consorcio_tier_standard" ||
                c.internationalStatus === "asignado_consorcio" // Legacy
              ).length}
            </p>
            <p className="text-sm text-white/70 mt-1">Asignados Consorcio</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-[#C9A24D]">
              {cases.filter((c) => c.internationalStatus === "en_evaluacion_gep").length}
            </p>
            <p className="text-sm text-white/70 mt-1">En Evaluación GEP</p>
          </div>
        </Card>
      </div>

      {/* Lista */}
      <Card>
        <Tabs tabs={tabs} defaultTab="all" />
      </Card>
    </div>
  );
}
