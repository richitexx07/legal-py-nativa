"use client";

import { useState, useEffect } from "react";
import { getSession } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import { InstitutionProfile, InstitutionAgreement } from "@/lib/types";

export default function EduPanelPage() {
  const router = useRouter();
  const [session, setSession] = useState<ReturnType<typeof getSession>>(null);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"metrics" | "agreements" | "talent">("metrics");
  
  // Mock data - En producción vendría de una API
  const [metrics, setMetrics] = useState({
    activeStudents: 245,
    proBonoCasesResolved: 18,
    employabilityRate: 78.5,
  });

  const [agreements, setAgreements] = useState<InstitutionAgreement[]>([
    {
      id: "agr1",
      partnerName: "Embajada de Estados Unidos",
      partnerType: "embajada",
      agreementDate: "2024-01-15",
      pdfUrl: "/agreements/usa-embassy.pdf",
      status: "active",
      description: "Convenio para pasantías internacionales y programas de intercambio",
    },
    {
      id: "agr2",
      partnerName: "USAID Paraguay",
      partnerType: "ong",
      agreementDate: "2024-03-20",
      pdfUrl: "/agreements/usaid.pdf",
      status: "active",
      description: "Financiamiento para clínicas legales pro-bono",
    },
    {
      id: "agr3",
      partnerName: "Unión Europea",
      partnerType: "organizacion_internacional",
      agreementDate: "2024-02-10",
      pdfUrl: "/agreements/eu.pdf",
      status: "pending",
      description: "Programa de becas y pasantías en instituciones europeas",
    },
  ]);

  const [talentTable, setTalentTable] = useState([
    { id: "s1", name: "María González", score: 95, hours: 180, distinctions: 2, topTalent: true },
    { id: "s2", name: "Juan Pérez", score: 92, hours: 175, distinctions: 1, topTalent: true },
    { id: "s3", name: "Ana Martínez", score: 88, hours: 160, distinctions: 0, topTalent: false },
    { id: "s4", name: "Carlos Silva", score: 85, hours: 150, distinctions: 1, topTalent: false },
    { id: "s5", name: "Laura Fernández", score: 82, hours: 140, distinctions: 0, topTalent: false },
  ]);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const currentSession = getSession();
      setSession(currentSession);

      if (!currentSession || currentSession.user.role !== "institucion") {
        router.push("/login");
      }
    }
  }, [router]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0E1B2A] via-[#13253A] to-[#0E1B2A] py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="h-96 bg-white/5 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (!session || session.user.role !== "institucion") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E1B2A] via-[#13253A] to-[#0E1B2A] py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3">
            🎓 Panel Universitario
          </h1>
          <p className="text-lg text-white/70">
            Gestión integral de estudiantes, convenios y talento académico
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 border-b border-white/10">
          <button
            onClick={() => setActiveTab("metrics")}
            className={`px-6 py-3 font-medium transition-all ${
              activeTab === "metrics"
                ? "text-white border-b-2 border-blue-500"
                : "text-white/60 hover:text-white/80"
            }`}
          >
            📊 Métricas
          </button>
          <button
            onClick={() => setActiveTab("agreements")}
            className={`px-6 py-3 font-medium transition-all ${
              activeTab === "agreements"
                ? "text-white border-b-2 border-blue-500"
                : "text-white/60 hover:text-white/80"
            }`}
          >
            📄 Gestor de Convenios
          </button>
          <button
            onClick={() => setActiveTab("talent")}
            className={`px-6 py-3 font-medium transition-all ${
              activeTab === "talent"
                ? "text-white border-b-2 border-blue-500"
                : "text-white/60 hover:text-white/80"
            }`}
          >
            ⭐ Visor de Talento
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "metrics" && (
          <div className="space-y-6">
            {/* Métricas Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-400/30">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl">👥</span>
                  <Badge variant="accent">Activos</Badge>
                </div>
                <h3 className="text-3xl font-bold text-white mb-1">{metrics.activeStudents}</h3>
                <p className="text-sm text-white/70">Alumnos Activos</p>
                <p className="text-xs text-green-400 mt-2">↑ 12% vs mes anterior</p>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-400/30">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl">⚖️</span>
                  <Badge variant="accent">Pro-Bono</Badge>
                </div>
                <h3 className="text-3xl font-bold text-white mb-1">{metrics.proBonoCasesResolved}</h3>
                <p className="text-sm text-white/70">Casos Pro-Bono Resueltos</p>
                <p className="text-xs text-green-400 mt-2">Este mes</p>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border border-yellow-400/30">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl">📈</span>
                  <Badge variant="accent">Empleabilidad</Badge>
                </div>
                <h3 className="text-3xl font-bold text-white mb-1">{metrics.employabilityRate}%</h3>
                <p className="text-sm text-white/70">Tasa de Empleabilidad</p>
                <p className="text-xs text-green-400 mt-2">↑ 5.2% vs trimestre anterior</p>
              </Card>
            </div>

            {/* Gráfico simple (placeholder) */}
            <Card className="p-6 bg-white/5 border-white/10">
              <h3 className="text-xl font-bold text-white mb-4">Evolución de Métricas (Últimos 6 meses)</h3>
              <div className="h-64 flex items-end justify-between gap-2">
                {[65, 72, 68, 75, 78, 78.5].map((value, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all hover:opacity-80"
                      style={{ height: `${(value / 100) * 100}%` }}
                    />
                    <span className="text-xs text-white/60 mt-2">{value}%</span>
                    <span className="text-xs text-white/40 mt-1">M{index + 1}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === "agreements" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Convenios con Embajadas/ONGs</h2>
              <Button variant="primary" className="rounded-xl">
                + Subir Nuevo Convenio
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {agreements.map((agreement) => (
                <Card key={agreement.id} className="p-6 bg-white/5 border-white/10 hover:border-blue-400/30 transition">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{agreement.partnerName}</h3>
                      <Badge
                        variant={agreement.status === "active" ? "accent" : agreement.status === "pending" ? "outline" : "terracota"}
                        className="text-xs"
                      >
                        {agreement.status === "active" ? "Activo" : agreement.status === "pending" ? "Pendiente" : "Expirado"}
                      </Badge>
                    </div>
                    <span className="text-2xl">
                      {agreement.partnerType === "embajada" ? "🏛️" : agreement.partnerType === "ong" ? "🤝" : "🌍"}
                    </span>
                  </div>
                  <p className="text-sm text-white/70 mb-4">{agreement.description}</p>
                  <div className="flex items-center justify-between text-xs text-white/60 mb-4">
                    <span>Fecha: {new Date(agreement.agreementDate).toLocaleDateString("es-PY")}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" className="rounded-lg">
                      📄 Ver PDF
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-lg">
                      ✏️ Editar
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "talent" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Visor de Talento</h2>
              <p className="text-sm text-white/60">Ordenado por Puntaje de Práctica</p>
            </div>

            <Card className="p-6 bg-white/5 border-white/10">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-white/80">Estudiante</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-white/80">Puntaje</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-white/80">Horas</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-white/80">Distinciones</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-white/80">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {talentTable.map((student) => (
                      <tr key={student.id} className="border-b border-white/5 hover:bg-white/5 transition">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold">
                              {student.name.charAt(0)}
                            </div>
                            <span className="text-white font-medium">{student.name}</span>
                            {student.topTalent && (
                              <Badge variant="accent" className="text-xs">
                                🌟 Top Talent
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <span className="text-white font-bold">{student.score}</span>
                            <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                                style={{ width: `${student.score}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-white/80">{student.hours} hrs</td>
                        <td className="py-4 px-4">
                          <span className="text-white/80">{student.distinctions}</span>
                        </td>
                        <td className="py-4 px-4">
                          <Badge variant="accent" className="text-xs">
                            Activo
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
