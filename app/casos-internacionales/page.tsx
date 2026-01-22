"use client";

import { useState, useEffect } from "react";
import { getSession } from "@/lib/auth";
import Link from "next/link";
import {
  getInternationalCases,
  InternationalCase,
  InternationalCaseStatus,
} from "@/lib/international";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Tabs from "@/components/Tabs";
import InternationalCaseCard from "@/components/International/InternationalCaseCard";
import FunnelView from "@/components/International/FunnelView";

export default function CasosInternacionalesPage() {
  const session = typeof window !== "undefined" ? getSession() : null;
  const [cases, setCases] = useState<InternationalCase[]>([]);
  const [selectedCase, setSelectedCase] = useState<InternationalCase | null>(null);
  const [view, setView] = useState<"list" | "funnel">("list");
  const [filters] = useState<{
    status?: InternationalCaseStatus;
    minAmount?: number;
    countries?: string[];
    complexity?: string;
  }>({});

  useEffect(() => {
    if (typeof window === "undefined") return;
    const loaded = getInternationalCases(filters);
    queueMicrotask(() => setCases(loaded));
  }, [filters]);

  const handleViewFunnel = (caseData: InternationalCase) => {
    setSelectedCase(caseData);
    setView("funnel");
  };

  const handleBackToList = () => {
    setSelectedCase(null);
    setView("list");
    setCases(getInternationalCases(filters));
  };

  const isGEPGold = session?.user?.role === "profesional";

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
        <FunnelView caseData={selectedCase} onUpdate={() => setCases(getInternationalCases(filters))} isGEPGold={isGEPGold} />
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
                c.internationalStatus === "asignado_consorcio_tier_standard"
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

  const totalCases = cases.length;
  const assignedGEP = cases.filter((c) => c.internationalStatus === "asignado_gep").length;
  const assignedConsortium = cases.filter((c) => 
    c.internationalStatus === "asignado_consorcio_tier_premium" ||
    c.internationalStatus === "asignado_consorcio_tier_standard"
  ).length;
  const evaluatingGEP = cases.filter((c) => c.internationalStatus === "en_evaluacion_gep").length;
  const totalAmount = cases.reduce((sum, c) => sum + (c.estimatedAmount || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E1B2A] via-[#13253A] to-[#0E1B2A] py-8">
      <div className="max-w-7xl mx-auto px-4 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C9A24D] to-[#C08457] flex items-center justify-center">
                <span className="text-2xl">🌍</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white">Dashboard de Casos Internacionales</h1>
            </div>
            <p className="text-white/70 text-lg mt-2">
              Casos con monto mínimo de USD 5,000 procesados a través del sistema ético de Derivación Priorizada por Perfil Técnico (DPT)
            </p>
          </div>
          {!session && (
            <Link href="/login">
              <Button variant="primary" className="rounded-xl">
                Iniciar Sesión
              </Button>
            </Link>
          )}
        </div>

        {!session && (
          <Card className="bg-[#C9A24D]/10 border-[#C9A24D]/30">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-white/90 text-sm">
                Visitante: podés ver casos y gráficas. Iniciá sesión para acceder a acciones y detalles completos.
              </p>
              <Link href="/login">
                <Button variant="primary" size="sm" className="rounded-xl">
                  Iniciar Sesión
                </Button>
              </Link>
            </div>
          </Card>
        )}

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="bg-gradient-to-br from-[#C9A24D]/20 to-[#C08457]/10 border-[#C9A24D]/40">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-[#C9A24D]/20 flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
              <p className="text-3xl font-extrabold text-[#C9A24D] mb-1">{totalCases}</p>
              <p className="text-sm text-white/70 font-medium">Total Casos</p>
            </div>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-blue-500/40">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <span className="text-2xl">⭐</span>
              </div>
              <p className="text-3xl font-extrabold text-blue-400 mb-1">{assignedGEP}</p>
              <p className="text-sm text-white/70 font-medium">Asignados GEP</p>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border-purple-500/40">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <span className="text-2xl">🏢</span>
              </div>
              <p className="text-3xl font-extrabold text-purple-400 mb-1">{assignedConsortium}</p>
              <p className="text-sm text-white/70 font-medium">Asignados Consorcio</p>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border-yellow-500/40">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                <span className="text-2xl">🔍</span>
              </div>
              <p className="text-3xl font-extrabold text-yellow-400 mb-1">{evaluatingGEP}</p>
              <p className="text-sm text-white/70 font-medium">En Evaluación GEP</p>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border-emerald-500/40">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
              <p className="text-2xl font-extrabold text-emerald-400 mb-1">
                ${(totalAmount / 1000).toFixed(0)}K
              </p>
              <p className="text-sm text-white/70 font-medium">Monto Total</p>
            </div>
          </Card>
        </div>

        {/* Gráfica de distribución */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 border border-white/10 bg-gradient-to-br from-white/5 to-white/0">
            <h3 className="text-lg font-bold text-white mb-4">Distribución por Estado</h3>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white/70">Asignados GEP</span>
                  <span className="text-sm font-semibold text-white">
                    {totalCases > 0 ? Math.round((assignedGEP / totalCases) * 100) : 0}%
                  </span>
                </div>
                <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="absolute inset-y-0 left-0 bg-blue-500 rounded-full"
                    style={{ width: `${totalCases > 0 ? (assignedGEP / totalCases) * 100 : 0}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white/70">Asignados Consorcio</span>
                  <span className="text-sm font-semibold text-white">
                    {totalCases > 0 ? Math.round((assignedConsortium / totalCases) * 100) : 0}%
                  </span>
                </div>
                <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="absolute inset-y-0 left-0 bg-purple-500 rounded-full"
                    style={{ width: `${totalCases > 0 ? (assignedConsortium / totalCases) * 100 : 0}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white/70">En Evaluación GEP</span>
                  <span className="text-sm font-semibold text-white">
                    {totalCases > 0 ? Math.round((evaluatingGEP / totalCases) * 100) : 0}%
                  </span>
                </div>
                <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="absolute inset-y-0 left-0 bg-yellow-500 rounded-full"
                    style={{ width: `${totalCases > 0 ? (evaluatingGEP / totalCases) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 border border-white/10 bg-gradient-to-br from-white/5 to-white/0">
            <h3 className="text-lg font-bold text-white mb-4">Sistema DPT</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#C9A24D]/20 flex items-center justify-center shrink-0">
                  <span className="text-lg">⚖️</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white mb-1">Derivación Priorizada</p>
                  <p className="text-xs text-white/60">Basada en perfil técnico y competencias profesionales</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#C9A24D]/20 flex items-center justify-center shrink-0">
                  <span className="text-lg">🎯</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white mb-1">Matching Ético</p>
                  <p className="text-xs text-white/60">Sin subastas ni competencia económica</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#C9A24D]/20 flex items-center justify-center shrink-0">
                  <span className="text-lg">📈</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white mb-1">Seguimiento en Tiempo Real</p>
                  <p className="text-xs text-white/60">Hitos, alertas y documentos centralizados</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Lista de Casos */}
        <Card className="p-6 border border-white/10 bg-gradient-to-br from-white/5 to-white/0">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Casos Internacionales</h2>
            <p className="text-white/70 text-sm">
              Casos high-ticket con monto mínimo de USD 5,000. Sistema ético de derivación sin subastas.
            </p>
          </div>
          <Tabs tabs={tabs} defaultTab="all" />
        </Card>
      </div>
    </div>
  );
}
