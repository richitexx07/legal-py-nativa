"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import RoleModeModal, { ViewMode } from "@/components/RoleModeModal";
import { InscripcionCurso, PostulacionPasantia, SolicitudCapacitacion } from "@/lib/educacion-data";
import { mockCursos, mockPasantias } from "@/lib/educacion-data";
import { getSession } from "@/lib/auth";
import { useUserState } from "@/hooks/useUserState";
import { LegalCase } from "@/lib/types";
import { generateCaseHash, truncateHash, copyToClipboard } from "@/lib/security";
import MetricsWidget from "@/components/Dashboard/MetricsWidget";
import InternshipCheckIn from "@/components/Internship/InternshipCheckIn";
import CaseLogForm from "@/components/Internship/CaseLogForm";
import InternshipProgress from "@/components/Internship/InternshipProgress";
import BitacoraBiometrica from "@/components/EdTech/BitacoraBiometrica";
import CheckInJuzgado from "@/components/EdTech/CheckInJuzgado";
import BilleteraAcademica from "@/components/EdTech/BilleteraAcademica";
import { DigitalInternship } from "@/lib/edu-types";

export default function PanelAdminPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("gestiones");
  const [viewMode, setViewMode] = useState<ViewMode>("cliente");
  const [isModeModalOpen, setIsModeModalOpen] = useState(false);
  const [reverifyRequired, setReverifyRequired] = useState(false);
  const [inscripciones, setInscripciones] = useState<InscripcionCurso[]>([]);
  const [postulaciones, setPostulaciones] = useState<PostulacionPasantia[]>([]);
  const [solicitudes, setSolicitudes] = useState<SolicitudCapacitacion[]>([]);
  const [myCases, setMyCases] = useState<LegalCase[]>([]);
  const [session, setSession] = useState<ReturnType<typeof getSession>>(null);
  const [mounted, setMounted] = useState(false);
  const [currentInternship, setCurrentInternship] = useState<DigitalInternship | null>(null);
  const userState = useUserState();

  useEffect(() => {
    setMounted(true);
    // Cargar modo de visualización
    if (typeof window !== "undefined") {
      const savedMode = localStorage.getItem("legal-py-view-mode") as ViewMode | null;
      if (savedMode && (savedMode === "cliente" || savedMode === "profesional" || savedMode === "estudiante")) {
        setViewMode(savedMode);
      } else if (session?.user.role === "profesional") {
        setViewMode("profesional");
      }
    }

    // Cargar datos del localStorage
    const insc = JSON.parse(localStorage.getItem("inscripcionesCursos") || "[]");
    const post = JSON.parse(localStorage.getItem("postulacionesPasantias") || "[]");
    const sol = JSON.parse(localStorage.getItem("solicitudesCapacitacion") || "[]");
    
    setInscripciones(insc);
    setPostulaciones(post);
    setSolicitudes(sol);

    // Verificar sesión
    if (typeof window !== "undefined") {
      const currentSession = getSession();
      setSession(currentSession);

      // Cargar pasantía activa del estudiante
      if (currentSession && currentSession.user.role === "estudiante") {
        try {
          const storedInternship = localStorage.getItem("legal-py-current-internship");
          if (storedInternship) {
            const internship: DigitalInternship = JSON.parse(storedInternship);
            setCurrentInternship(internship);
          } else {
            // Crear pasantía mock si no existe
            const mockInternship: DigitalInternship = {
              id: "internship_1",
              studentId: currentSession.user.id,
              tutorId: "tutor_1",
              institutionId: "inst_1",
              startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
              endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
              requiredHours: 200,
              completedHours: 120,
              status: "active",
              checkIns: [],
              caseLogs: [],
              location: {
                name: "Juzgado de Primera Instancia en lo Civil y Comercial",
                address: "Asunción, Paraguay",
              },
            };
            setCurrentInternship(mockInternship);
            localStorage.setItem("legal-py-current-internship", JSON.stringify(mockInternship));
          }
        } catch (error) {
          console.error("Error loading internship:", error);
        }
      }

      // Cargar casos del usuario actual desde localStorage
      if (currentSession) {
        try {
          const storedCases = localStorage.getItem("legal-py-cases");
          if (storedCases) {
            const allCases: LegalCase[] = JSON.parse(storedCases);
            // Filtrar casos del usuario actual (por ahora, todos los casos son del usuario actual)
            // En producción, se filtraría por userId
            const userCases = allCases.filter((c) => c.status === "OPEN" || c.status === "ASSIGNED");
            // Ordenar por fecha (más nuevos primero)
            userCases.sort((a, b) => {
              const dateA = new Date(a.createdAt).getTime();
              const dateB = new Date(b.createdAt).getTime();
              return dateB - dateA;
            });
            setMyCases(userCases);
          }
        } catch (error) {
          console.error("Error loading cases:", error);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const s = getSession();
    const isVerified = !!s?.user.isIdentityVerified || (s?.user.kycTier ?? 0) >= 2;

    const stored = localStorage.getItem("legal-py-reverify-required");
    if (stored === "true") {
      setReverifyRequired(!isVerified);
    } else if (stored === "false") {
      setReverifyRequired(false);
    } else {
      const today = new Date().toISOString().slice(0, 10);
      const stamp = localStorage.getItem("legal-py-reverify-day");
      if (stamp !== today) {
        const should = Math.random() < 0.25 && !isVerified;
        localStorage.setItem("legal-py-reverify-day", today);
        localStorage.setItem("legal-py-reverify-required", should ? "true" : "false");
        setReverifyRequired(should);
      } else {
        setReverifyRequired(false);
      }
    }

  }, []);

  useEffect(() => {
    const handler = () => {
      const savedMode = localStorage.getItem("legal-py-view-mode") as ViewMode | null;
      if (savedMode && (savedMode === "cliente" || savedMode === "profesional" || savedMode === "estudiante")) {
        setViewMode(savedMode);
      }
    };
    window.addEventListener("legal-py-view-mode-changed", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("legal-py-view-mode-changed", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  // Log de notificaciones
  useEffect(() => {
    if (typeof window !== "undefined" && viewMode === "cliente" && myCases.length > 0) {
    }
  }, [viewMode, myCases.length]);

  const getCursoNombre = (cursoId: string) => {
    const curso = mockCursos.find((c) => c.id === cursoId);
    return curso?.titulo || "Curso no encontrado";
  };

  const getPasantiaNombre = (pasantiaId: string) => {
    const pasantia = mockPasantias.find((p) => p.id === pasantiaId);
    return pasantia?.titulo || "Pasantía no encontrada";
  };

  const getEstadoBadge = (estado: string) => {
    const estados: Record<string, "accent" | "outline" | "terracota"> = {
      "Pendiente": "outline",
      "Confirmado": "accent",
      "Recibido": "outline",
      "En revisión": "terracota",
      "Entrevista": "terracota",
      "Finalista": "accent",
      "Aceptado": "accent",
      "Rechazado": "outline",
      "En evaluación": "terracota",
      "Propuesta enviada": "accent",
    };
    return estados[estado] || "outline";
  };

  const getCaseStatusBadge = (caseData: LegalCase) => {
    if (caseData.exclusiveForGepUntil) {
      const exclusiveUntil = new Date(caseData.exclusiveForGepUntil);
      const now = new Date();
      if (exclusiveUntil > now) {
        return { label: t("dashboard.status_review"), variant: "terracota" as const };
      }
    }
    if (caseData.status === "ASSIGNED") {
      return { label: t("dashboard.status_assigned"), variant: "accent" as const };
    }
    return { label: t("dashboard.status_open"), variant: "outline" as const };
  };

  const getComplexityBadge = (complexity: LegalCase["complexity"]) => {
    const colors: Record<LegalCase["complexity"], { bg: string; text: string }> = {
      BAJA: { bg: "bg-gray-500/20", text: "text-gray-400" },
      MEDIA: { bg: "bg-yellow-500/20", text: "text-yellow-400" },
      ALTA: { bg: "bg-orange-500/20", text: "text-orange-400" },
    };
    return colors[complexity];
  };

  // Tabs adaptados según el modo
  const getTabs = () => {
    if (viewMode === "profesional") {
      return [
        { id: "oportunidades", label: `Panel de Oportunidades`, icon: "💼" },
        { id: "mis-casos", label: `Mis Casos (${myCases.length})`, icon: "⚖️" },
        { id: "inscripciones", label: `Inscripciones (${inscripciones.length})`, icon: "📚" },
        { id: "postulaciones", label: `Postulaciones (${postulaciones.length})`, icon: "📝" },
      ];
    }
    if (viewMode === "estudiante") {
      return [
        { id: "gestiones", label: `Mis Gestiones Activas (${myCases.length})`, icon: "📋" },
        { id: "pasantia", label: `Mi Pasantía`, icon: "💼" },
        { id: "bitacora", label: `Bitácora Biométrica`, icon: "📝" },
        { id: "checkin", label: `Check-in Juzgados`, icon: "📍" },
        { id: "billetera", label: `Billetera Académica`, icon: "🎓" },
        { id: "inscripciones", label: `Inscripciones (${inscripciones.length})`, icon: "📚" },
        { id: "postulaciones", label: `Postulaciones (${postulaciones.length})`, icon: "📝" },
      ];
    }
    return [
      { id: "gestiones", label: `Mis Gestiones Activas (${myCases.length})`, icon: "📋" },
      { id: "inscripciones", label: `Inscripciones (${inscripciones.length})`, icon: "📚" },
      { id: "postulaciones", label: `Postulaciones (${postulaciones.length})`, icon: "📝" },
      { id: "solicitudes", label: `Solicitudes (${solicitudes.length})`, icon: "🎓" },
    ];
  };

  const tabs = getTabs();

  // Durante SSR o antes del mount, mostrar placeholder para evitar hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0E1B2A] via-[#13253A] to-[#0E1B2A] py-8 px-4">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="mb-8">
            <div className="h-10 w-64 bg-white/5 rounded-lg animate-pulse mb-2" />
            <div className="h-5 w-96 bg-white/5 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E1B2A] via-[#13253A] to-[#0E1B2A] py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Banner de Re-VERIFICACIÓN */}
        {reverifyRequired && (
          <div className="rounded-3xl border border-yellow-400/30 bg-yellow-400/10 p-5 backdrop-blur-xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="text-white">
                <p className="font-extrabold">⚠️ Por seguridad, verifica tu identidad para seguir operando.</p>
                <p className="text-sm text-white/70">
                  Algunas acciones quedan bloqueadas hasta completar la validación biométrica.
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="primary"
                  className="rounded-2xl"
                  onClick={() => {
                    router.push("/profile?verify=1");
                  }}
                >
                  Verificar ahora
                </Button>
              </div>
            </div>
          </div>
        )}
        {/* Header con modo de visualización */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 tracking-tight">
              {viewMode === "profesional"
                ? t("dashboard.panel_title_pro")
                : viewMode === "estudiante"
                ? t("student_panel.active_learning")
                : t("dashboard.panel_title_client")}
            </h1>
            <p className="text-lg text-white/70 max-w-2xl leading-relaxed">
              {viewMode === "profesional"
                ? t("dashboard.panel_desc_pro")
                : viewMode === "estudiante"
                ? t("roles.student_desc")
                : t("dashboard.panel_desc_client")}
            </p>
          </div>
          {/* Botón rápido según modo */}
          {viewMode === "cliente" && (
            <Link href="/post-case">
              <Button variant="primary" className="rounded-2xl px-6 py-3 text-base font-semibold shadow-xl hover:shadow-2xl transition-all">
                ⚖️ {t("dashboard.publish_case_btn")}
              </Button>
            </Link>
          )}
          {viewMode === "profesional" && (
            <Link href="/opportunities">
              <Button variant="primary" className="rounded-2xl px-6 py-3 text-base font-semibold shadow-xl hover:shadow-2xl transition-all">
                💼 {t("dashboard.view_opportunities_btn")}
              </Button>
            </Link>
          )}
        </div>

        {/* Cambiar Modo en el Panel (Modal) */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setIsModeModalOpen(true)}
            className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/90 hover:bg-white/10 transition"
            aria-label={t("navbar.switch_role")}
          >
            <span className="text-base">{viewMode === "cliente" ? "👤" : "💼"}</span>
            <span className="font-semibold">{t("navbar.switch_role")}</span>
          </button>
        </div>

        {/* Notificaciones Dopamínicas */}
        {viewMode === "cliente" && myCases.length > 0 && (
          <div className="mb-6 space-y-3">
            <div className="backdrop-blur-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl border border-blue-400/30 p-4 shadow-lg animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-xl shrink-0 animate-pulse">
                  🔔
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold">El Dr. Juan vio tu caso</p>
                  <p className="text-sm text-white/80">Está revisando los detalles y te contactará pronto</p>
                </div>
              </div>
            </div>
            <div className="backdrop-blur-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl border border-green-400/30 p-4 shadow-lg animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white text-xl shrink-0 animate-pulse">
                  📄
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold">Tienes un documento para firmar</p>
                  <p className="text-sm text-white/80">Revisa y firma el contrato de servicios</p>
                </div>
                <Button variant="primary" className="rounded-xl px-4 py-2 text-sm shrink-0">
                  Ver Documento
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* DASHBOARD CLIENTE / PROFESIONAL */}
        {viewMode !== "estudiante" && (
          <div className="relative">
            {reverifyRequired && (
              <div className="absolute inset-0 z-20 rounded-3xl bg-black/35 backdrop-blur-[2px] flex items-center justify-center p-6">
                <div className="max-w-lg rounded-3xl border border-yellow-400/30 bg-white/10 p-6 text-center">
                  <p className="text-white font-extrabold mb-2">Acciones bloqueadas por seguridad</p>
                  <p className="text-sm text-white/70 mb-4">Completa la validación biométrica para continuar.</p>
                  <Button
                    variant="primary"
                    className="rounded-2xl"
                    onClick={() => router.push("/profile?verify=1")}
                  >
                    Ir a Verificación
                  </Button>
                </div>
              </div>
            )}

            <>
            {/* Tabs con diseño mejorado */}
            <div className="flex flex-wrap gap-3 pb-2 border-b border-white/10">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  disabled={reverifyRequired}
                  className={`
                relative px-6 py-3 rounded-2xl font-medium text-sm transition-all duration-300
                ${activeTab === tab.id
                  ? "bg-white/20 text-white shadow-lg backdrop-blur-sm border border-white/20"
                  : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80 border border-transparent"}
              `}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                  {activeTab === tab.id && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-[#C9A24D] rounded-full"></span>
                  )}
                </button>
              ))}
            </div>

            {/* Contenido de Tabs con Glassmorphism */}

            {/* VISTA CLIENTE: Seguimiento y Paz Mental */}
            {viewMode === "cliente" && (activeTab === "gestiones" || activeTab === "mis-casos") && (
              <div className="space-y-6 mt-6">
                {/* Widget Principal: Línea de Tiempo del Caso */}
                {myCases.length > 0 && myCases[0] && (
                  <Card className="p-8 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-400/30">
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">📊</span>
                        <h3 className="text-2xl font-bold text-white">Línea de Tiempo del Caso</h3>
                      </div>
                      <div className="relative">
                        {/* Barra de progreso visual */}
                        <div className="flex items-center gap-4">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between text-sm text-white/80 mb-2">
                              <span>Progreso del Caso</span>
                              <span className="font-semibold text-[#C9A24D]">
                                {myCases[0].status === "ASSIGNED" ? "75%" : myCases[0].status === "OPEN" ? "25%" : "50%"}
                              </span>
                            </div>
                            <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-[#C9A24D] to-[#C08457] rounded-full transition-all duration-1000"
                                style={{ 
                                  width: myCases[0].status === "ASSIGNED" ? "75%" : myCases[0].status === "OPEN" ? "25%" : "50%" 
                                }}
                              />
                            </div>
                            <div className="flex items-center justify-between text-xs text-white/60 mt-2">
                              <span className={myCases[0].status === "OPEN" ? "text-[#C9A24D] font-semibold" : ""}>
                                ✓ Publicado
                              </span>
                              <span className={myCases[0].status === "ASSIGNED" ? "text-[#C9A24D] font-semibold" : ""}>
                                ✓ Asignado
                              </span>
                              <span className="text-white/40">En Proceso</span>
                              <span className="text-white/40">Completado</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Widget Secundario: Mensajes de tu Abogado (Chat Directo) */}
                <Card className="p-6 bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">💬</span>
                      <h3 className="text-xl font-bold text-white">Mensajes de tu Abogado</h3>
                    </div>
                    {myCases.length > 0 && myCases[0].status === "ASSIGNED" && (
                      <Link href="/chat">
                        <Button variant="outline" className="rounded-xl text-sm">
                          Ir al Chat
                        </Button>
                      </Link>
                    )}
                  </div>
                  {myCases.length > 0 && myCases[0].status === "ASSIGNED" ? (
                    <div className="space-y-4">
                      {/* Último mensaje destacado */}
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-[#C9A24D]/40 transition-all cursor-pointer">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#C9A24D] to-[#C08457] flex items-center justify-center text-white font-bold shrink-0">
                            Dr.
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-semibold text-white">Dr. Juan Pérez</p>
                              <span className="text-xs text-white/50">Hace 2 horas</span>
                            </div>
                            <p className="text-sm text-white/90 mb-2 line-clamp-2">
                              &ldquo;Hola, he revisado tu caso. Necesito algunos documentos adicionales para proceder.&rdquo;
                            </p>
                            <div className="flex items-center gap-2">
                              <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">
                                ✓ Leído
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Botón para ver conversación completa */}
                      <Link href="/chat">
                        <Button variant="primary" className="w-full rounded-xl">
                          Ver Conversación Completa →
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-5xl mb-4">💬</div>
                      <p className="text-white/70 mb-2">Aún no hay mensajes.</p>
                      <p className="text-sm text-white/50">Tu abogado te contactará cuando el caso sea asignado.</p>
                    </div>
                  )}
                </Card>

                {/* Lista de Casos (mantener existente) */}
                {myCases.length === 0 ? (
                  <div className="relative backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 p-12 shadow-2xl">
                    <div className="text-center">
                      <div className="text-7xl mb-6 animate-bounce">📋</div>
                      <h3 className="text-2xl font-bold text-white mb-3">{t("dashboard.no_cases")}</h3>
                      <p className="text-lg text-white/70 mb-8 max-w-md mx-auto leading-relaxed">
                        {t("dashboard.no_cases_client_desc") || "Publica tu primer caso legal y comienza a recibir propuestas de profesionales verificados."}
                      </p>
                      <Button 
                        variant="primary" 
                        onClick={() => router.push("/post-case")}
                        className="rounded-2xl px-8 py-4 text-base font-semibold"
                      >
                        ⚖️ {t("dashboard.publish_first")}
                      </Button>
                    </div>
                  </div>
                ) : (
                  myCases.map((caseData) => {
                    const statusBadge = getCaseStatusBadge(caseData);
                    const complexityStyle = getComplexityBadge(caseData.complexity);
                    return (
                      <div
                        key={caseData.id}
                        className="relative backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 p-8 shadow-2xl hover:shadow-[#C9A24D]/20 hover:border-[#C9A24D]/30 transition-all duration-300 group"
                      >
                        <div className="flex items-start justify-between gap-6">
                          <div className="flex-1 space-y-4">
                            <div className="flex items-start justify-between gap-4 flex-wrap">
                              <div className="flex-1 min-w-0">
                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#C9A24D] transition-colors">{caseData.title}</h3>
                                <p className="text-base text-white/70 leading-relaxed line-clamp-2">{caseData.description}</p>
                              </div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge variant={statusBadge.variant} className="text-xs px-3 py-1.5 rounded-xl relative">
                                  {statusBadge.label === "En revisión DPT" && (
                                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                    </span>
                                  )}
                                  {statusBadge.label}
                                </Badge>
                                <Badge variant="outline" className={`text-xs px-3 py-1.5 rounded-xl ${complexityStyle.bg} ${complexityStyle.text} border-current`}>
                                  Prioridad: {caseData.complexity}
                                </Badge>
                              </div>
                            </div>
                            
                            {/* Grid de información */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/10">
                              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                <p className="text-xs text-white/50 mb-1 font-medium uppercase tracking-wide">Área</p>
                                <p className="text-base text-white font-semibold">{caseData.practiceArea}</p>
                              </div>
                              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                <p className="text-xs text-white/50 mb-1 font-medium uppercase tracking-wide">Presupuesto</p>
                                <p className="text-base text-[#C9A24D] font-bold">
                                  {new Intl.NumberFormat("es-PY", {
                                    style: "currency",
                                    currency: "PYG",
                                    minimumFractionDigits: 0,
                                  }).format(caseData.estimatedBudget)}
                                </p>
                              </div>
                              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                <p className="text-xs text-white/50 mb-1 font-medium uppercase tracking-wide">Publicado</p>
                                <p className="text-base text-white/80 font-semibold">
                                  {new Date(caseData.createdAt).toLocaleDateString("es-PY", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric"
                                  })}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* VISTA PROFESIONAL: Captación y Gestión (Estilo CRM Legal) */}
            {viewMode === "profesional" && (activeTab === "gestiones" || activeTab === "mis-casos") && (
              <div className="space-y-6 mt-6">
                {/* Widget Principal: Oportunidades Nuevas (Motor DPT) */}
                <Card className="p-8 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-400/30">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">💼</span>
                        <h3 className="text-2xl font-bold text-white">Oportunidades Nuevas</h3>
                      </div>
                      <Link href="/opportunities">
                        <Button variant="primary" className="rounded-xl">
                          Ver Todas →
                        </Button>
                      </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                        <p className="text-xs text-white/60 mb-1">Casos Disponibles</p>
                        <p className="text-2xl font-bold text-emerald-400">12</p>
                        <p className="text-xs text-white/50 mt-1">En tu área</p>
                      </div>
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                        <p className="text-xs text-white/60 mb-1">Prioridad Alta</p>
                        <p className="text-2xl font-bold text-[#C9A24D]">3</p>
                        <p className="text-xs text-white/50 mt-1">GEP exclusivos</p>
                      </div>
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                        <p className="text-xs text-white/60 mb-1">Valor Total</p>
                        <p className="text-2xl font-bold text-white">Gs. 45M</p>
                        <p className="text-xs text-white/50 mt-1">Estimado</p>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Herramientas: Accesos directos */}
                <Card className="p-6 bg-white/5 border border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">🛠️</span>
                    <h3 className="text-xl font-bold text-white">Herramientas Rápidas</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <a 
                      href="https://www.pj.gov.py" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-[#C9A24D]/40 hover:bg-white/10 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">⚖️</span>
                        <div>
                          <p className="font-semibold text-white">CSJ</p>
                          <p className="text-xs text-white/60">Corte Suprema</p>
                        </div>
                      </div>
                    </a>
                    <a 
                      href="https://www.dinapi.gov.py" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-[#C9A24D]/40 hover:bg-white/10 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">📋</span>
                        <div>
                          <p className="font-semibold text-white">DINAPI</p>
                          <p className="text-xs text-white/60">Propiedad Intelectual</p>
                        </div>
                      </div>
                    </a>
                    <button
                      onClick={() => router.push("/modelos")}
                      className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-[#C9A24D]/40 hover:bg-white/10 transition-all cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">📄</span>
                        <div>
                          <p className="font-semibold text-white">Modelos</p>
                          <p className="text-xs text-white/60">Escritos Legales</p>
                        </div>
                      </div>
                    </button>
                  </div>
                </Card>

                {/* Widget: Mis Clientes Activos (Estilo CRM Legal) */}
                <Card className="p-6 bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">👥</span>
                      <h3 className="text-xl font-bold text-white">Mis Clientes Activos</h3>
                    </div>
                    <Badge variant="accent" className="bg-emerald-500 text-white">
                      {myCases.length} {myCases.length === 1 ? "Cliente" : "Clientes"}
                    </Badge>
                  </div>
                  {myCases.length > 0 ? (
                    <div className="space-y-3">
                      {myCases.slice(0, 3).map((caseData) => (
                        <div 
                          key={caseData.id}
                          className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-[#C9A24D]/40 transition-all cursor-pointer"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-white mb-1 truncate">{caseData.title}</h4>
                              <p className="text-xs text-white/60 mb-2">{caseData.practiceArea}</p>
                              <div className="flex items-center gap-2">
                                <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full">
                                  {caseData.status === "ASSIGNED" ? "En Proceso" : "Abierto"}
                                </span>
                                <span className="text-xs text-white/50">
                                  {new Date(caseData.createdAt).toLocaleDateString("es-PY", {
                                    day: "numeric",
                                    month: "short"
                                  })}
                                </span>
                              </div>
                            </div>
                            <div className="text-right ml-4">
                              <p className="text-sm font-bold text-[#C9A24D]">
                                {new Intl.NumberFormat("es-PY", {
                                  style: "currency",
                                  currency: "PYG",
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 0,
                                }).format(caseData.estimatedBudget).replace(/\s/g, "")}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                      {myCases.length > 3 && (
                        <Button variant="outline" className="w-full rounded-xl text-sm">
                          Ver todos los clientes ({myCases.length})
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-white/70">Aún no tienes clientes asignados.</p>
                    </div>
                  )}
                </Card>

                {/* Widget de Métricas para Plan Empresarial/GEP */}
                {(() => {
                  const demoPlan = typeof window !== "undefined" ? localStorage.getItem("legal-py-demo-plan") : null;
                  const userPlan = demoPlan || (session?.user.kycTier === 3 ? "gep" : null);
                  if (userPlan === "empresarial" || userPlan === "gep") {
                    return <MetricsWidget plan={userPlan as "empresarial" | "gep"} />;
                  }
                  return null;
                })()}

                {/* Lista de Casos del Profesional */}
                {myCases.length === 0 ? (
                  <div className="relative backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 p-12 shadow-2xl">
                    <div className="text-center">
                      <div className="text-7xl mb-6 animate-bounce">📋</div>
                      <h3 className="text-2xl font-bold text-white mb-3">{t("dashboard.no_cases")}</h3>
                      <p className="text-lg text-white/70 mb-8 max-w-md mx-auto leading-relaxed">
                        {t("dashboard.no_cases_pro_desc") || "Aún no tienes casos asignados. Explora las oportunidades disponibles y aplica a casos que coincidan con tu perfil."}
                      </p>
                      <Button 
                        variant="primary" 
                        onClick={() => router.push("/opportunities")}
                        className="rounded-2xl px-8 py-4 text-base font-semibold"
                      >
                        💼 {t("dashboard.explore_opportunities") || "Explorar Oportunidades"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white">Mis Casos Asignados</h3>
                    {myCases.map((caseData) => {
                      const statusBadge = getCaseStatusBadge(caseData);
                      const complexityStyle = getComplexityBadge(caseData.complexity);
                      return (
                        <div
                          key={caseData.id}
                          className="relative backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 p-8 shadow-2xl hover:shadow-[#C9A24D]/20 hover:border-[#C9A24D]/30 transition-all duration-300 group"
                        >
                          <div className="flex items-start justify-between gap-6">
                            <div className="flex-1 space-y-4">
                              <div className="flex items-start justify-between gap-4 flex-wrap">
                                <div className="flex-1 min-w-0">
                                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#C9A24D] transition-colors">{caseData.title}</h3>
                                  <p className="text-base text-white/70 leading-relaxed line-clamp-2">{caseData.description}</p>
                                </div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <Badge variant={statusBadge.variant} className="text-xs px-3 py-1.5 rounded-xl relative">
                                    {statusBadge.label === "En revisión DPT" && (
                                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                      </span>
                                    )}
                                    {statusBadge.label}
                                  </Badge>
                                  <Badge variant="outline" className={`text-xs px-3 py-1.5 rounded-xl ${complexityStyle.bg} ${complexityStyle.text} border-current`}>
                                    Prioridad: {caseData.complexity}
                                  </Badge>
                                </div>
                              </div>
                              
                              {/* Grid de información */}
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/10">
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                  <p className="text-xs text-white/50 mb-1 font-medium uppercase tracking-wide">Área</p>
                                  <p className="text-base text-white font-semibold">{caseData.practiceArea}</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                  <p className="text-xs text-white/50 mb-1 font-medium uppercase tracking-wide">Presupuesto</p>
                                  <p className="text-base text-[#C9A24D] font-bold">
                                    {new Intl.NumberFormat("es-PY", {
                                      style: "currency",
                                      currency: "PYG",
                                      minimumFractionDigits: 0,
                                    }).format(caseData.estimatedBudget)}
                                  </p>
                                </div>
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                  <p className="text-xs text-white/50 mb-1 font-medium uppercase tracking-wide">Publicado</p>
                                  <p className="text-base text-white/80 font-semibold">
                                    {new Date(caseData.createdAt).toLocaleDateString("es-PY", {
                                      day: "numeric",
                                      month: "long",
                                      year: "numeric"
                                    })}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
            {myCases.length === 0 ? (
              <div className="relative backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 p-12 shadow-2xl">
                <div className="text-center">
                  <div className="text-7xl mb-6 animate-bounce">📋</div>
                  <h3 className="text-2xl font-bold text-white mb-3">{t("dashboard.no_cases")}</h3>
                  <p className="text-lg text-white/70 mb-8 max-w-md mx-auto leading-relaxed">
                    {viewMode === "profesional"
                      ? t("dashboard.no_cases_pro_desc") || "Aún no tienes casos asignados. Explora las oportunidades disponibles y aplica a casos que coincidan con tu perfil."
                      : t("dashboard.no_cases_client_desc") || "Publica tu primer caso legal y comienza a recibir propuestas de profesionales verificados."}
                  </p>
                  <Button 
                    variant="primary" 
                    onClick={() => router.push(viewMode === "profesional" ? "/opportunities" : "/post-case")}
                    className="rounded-2xl px-8 py-4 text-base font-semibold"
                  >
                    {viewMode === "profesional" ? `💼 ${t("dashboard.explore_opportunities") || "Explorar Oportunidades"}` : `⚖️ ${t("dashboard.publish_first")}`}
                  </Button>
                </div>
              </div>
          ) : (
            myCases.map((caseData) => {
              const statusBadge = getCaseStatusBadge(caseData);
              const complexityStyle = getComplexityBadge(caseData.complexity);
              return (
                <div
                  key={caseData.id}
                  className="relative backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 p-8 shadow-2xl hover:shadow-[#C9A24D]/20 hover:border-[#C9A24D]/30 transition-all duration-300 group"
                >
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#C9A24D] transition-colors">{caseData.title}</h3>
                          <p className="text-base text-white/70 leading-relaxed line-clamp-2">{caseData.description}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant={statusBadge.variant} className="text-xs px-3 py-1.5 rounded-xl relative">
                            {statusBadge.label === "En revisión DPT" && (
                              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                              </span>
                            )}
                            {statusBadge.label}
                          </Badge>
                          <Badge variant="outline" className={`text-xs px-3 py-1.5 rounded-xl ${complexityStyle.bg} ${complexityStyle.text} border-current`}>
                            Prioridad: {caseData.complexity}
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Grid de información */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/10">
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                          <p className="text-xs text-white/50 mb-1 font-medium uppercase tracking-wide">Área</p>
                          <p className="text-base text-white font-semibold">{caseData.practiceArea}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                          <p className="text-xs text-white/50 mb-1 font-medium uppercase tracking-wide">Presupuesto</p>
                          <p className="text-base text-[#C9A24D] font-bold">
                            {new Intl.NumberFormat("es-PY", {
                              style: "currency",
                              currency: "PYG",
                              minimumFractionDigits: 0,
                            }).format(caseData.estimatedBudget)}
                          </p>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                          <p className="text-xs text-white/50 mb-1 font-medium uppercase tracking-wide">Publicado</p>
                          <p className="text-base text-white/80 font-semibold">
                            {new Date(caseData.createdAt).toLocaleDateString("es-PY", {
                              day: "numeric",
                              month: "long",
                              year: "numeric"
                            })}
                          </p>
                        </div>
                      </div>
                      {/* Huella Digital del Caso (Hash) */}
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <span className="text-xs text-white/60 font-mono shrink-0">Huella Digital del Caso (Hash):</span>
                            <code className="text-xs text-[#C9A24D] font-mono truncate">
                              {truncateHash(generateCaseHash(caseData.id, caseData.title, caseData.createdAt))}
                            </code>
                          </div>
                          <button
                            onClick={async () => {
                              const fullHash = generateCaseHash(caseData.id, caseData.title, caseData.createdAt);
                              const success = await copyToClipboard(fullHash);
                              if (success) {
                                alert("Hash copiado al portapapeles");
                              }
                            }}
                            className="shrink-0 p-1.5 rounded hover:bg-white/10 transition group"
                            title="Copiar hash completo"
                          >
                            <svg className="w-4 h-4 text-white/60 group-hover:text-[#C9A24D] transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      {caseData.exclusiveForGepUntil && (
                        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#C9A24D]/20 to-[#C08457]/20 border border-[#C9A24D]/30 backdrop-blur-sm">
                          <p className="text-sm text-[#C9A24D] font-medium flex items-center gap-2">
                            <span className="text-lg">👑</span>
                            Caso con prioridad exclusiva GEP hasta{" "}
                            {new Date(caseData.exclusiveForGepUntil).toLocaleString("es-PY", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
          )}

      {/* Panel de Oportunidades (Modo Profesional) */}
      {activeTab === "oportunidades" && viewMode === "profesional" && (
        <div className="space-y-6">
          <div className="relative backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 p-12 shadow-2xl">
            <div className="text-center">
              <div className="text-7xl mb-6">💼</div>
              <h3 className="text-2xl font-bold text-white mb-3">Explora Oportunidades</h3>
              <p className="text-lg text-white/70 mb-8 max-w-md mx-auto leading-relaxed">
                Descubre casos legales que coinciden con tu perfil y especialidad.
              </p>
              <Link href="/opportunities">
                <Button variant="primary" className="rounded-2xl px-8 py-4 text-base font-semibold">
                  💼 Ver Panel de Oportunidades
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

            </>
          </div>
        )}

      {/* DASHBOARD ESTUDIANTE: Aprendizaje y Carrera */}
      {viewMode === "estudiante" && (
        <div className="space-y-6 mt-6">
          {/* Widget Principal: Mis Pasantías Activas */}
          <Card className="p-8 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-400/30">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl">💼</span>
                <h3 className="text-2xl font-bold text-white">Mis Pasantías Activas</h3>
              </div>
              {currentInternship ? (
                <div className="space-y-4">
                  <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-bold text-white mb-1">{currentInternship.location?.name || "Pasantía Activa"}</h4>
                        <p className="text-sm text-white/70">{currentInternship.location?.address || "Ubicación no especificada"}</p>
                      </div>
                      <Badge variant="accent" className="bg-emerald-500 text-white">
                        Activa
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-white/60 mb-1">Horas Completadas</p>
                        <p className="text-xl font-bold text-emerald-400">
                          {currentInternship.completedHours} / {currentInternship.requiredHours}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-white/60 mb-1">Progreso</p>
                        <p className="text-xl font-bold text-white">
                          {Math.round((currentInternship.completedHours / currentInternship.requiredHours) * 100)}%
                        </p>
                      </div>
                    </div>
                    <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all"
                        style={{ width: `${(currentInternship.completedHours / currentInternship.requiredHours) * 100}%` }}
                      />
                    </div>
                  </div>
                  <Button 
                    variant="primary" 
                    onClick={() => setActiveTab("pasantia")}
                    className="w-full rounded-xl"
                  >
                    Ver Detalles de la Pasantía
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-white/70 mb-4">Aún no tienes una pasantía activa.</p>
                  <Link href="/pasantias">
                    <Button variant="primary" className="rounded-xl">
                      Explorar Pasantías Disponibles
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </Card>

          {/* Widget Secundario: Cursos Recomendados para ti */}
          <Card className="p-6 bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📚</span>
                <h3 className="text-xl font-bold text-white">Cursos Recomendados para ti</h3>
              </div>
              <Link href="/cursos">
                <Button variant="outline" className="rounded-xl text-sm">
                  Ver Todos
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: "Oratoria Legal", level: "Intermedio", progress: 0 },
                { title: "Redacción de Escritos", level: "Básico", progress: 0 },
                { title: "Ética Profesional", level: "Avanzado", progress: 0 },
              ].map((curso, idx) => (
                <div key={idx} className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-emerald-400/40 transition-all cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-white">{curso.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {curso.level}
                    </Badge>
                  </div>
                  <p className="text-xs text-white/60 mb-3">Recomendado según tu perfil</p>
                  <Button variant="outline" className="w-full rounded-xl text-sm">
                    Inscribirse
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          {/* Accesos Rápidos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/cursos">
              <div className="relative backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 p-6 shadow-2xl hover:border-emerald-400/60 hover:shadow-emerald-400/30 transition-all cursor-pointer">
                <div className="text-3xl mb-4">📚</div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {t("student_panel.courses") || "Cursos y Capacitación"}
                </h3>
                <p className="text-sm text-white/70">
                  Explora cursos, talleres y capacitaciones legales seleccionadas.
                </p>
              </div>
            </Link>

            <Link href="/especializaciones">
              <div className="relative backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 p-6 shadow-2xl hover:border-emerald-400/60 hover:shadow-emerald-400/30 transition-all cursor-pointer">
                <div className="text-3xl mb-4">🎓</div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {t("student_panel.specializations") || "Especializaciones"}
                </h3>
                <p className="text-sm text-white/70">
                  Accede a rutas de especialización en áreas clave del derecho.
                </p>
              </div>
            </Link>

            <Link href="/pasantias">
              <div className="relative backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 p-6 shadow-2xl hover:border-emerald-400/60 hover:shadow-emerald-400/30 transition-all cursor-pointer">
                <div className="text-3xl mb-4">💼</div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {t("student_panel.internships") || "Bolsa de Pasantías"}
                </h3>
                <p className="text-sm text-white/70">
                  Descubre oportunidades de pasantías y primeras experiencias profesionales.
                </p>
              </div>
            </Link>
          </div>
        </div>
      )}

      {/* Mi Pasantía - Tab para estudiantes (incluye funcionalidades EdTech) */}
      {(activeTab === "pasantia" || activeTab === "bitacora" || activeTab === "checkin" || activeTab === "billetera") && viewMode === "estudiante" && (
        <div className="space-y-6">
          {currentInternship ? (
            <>
              <InternshipProgress internship={currentInternship} />
              {/* Tabs para funcionalidades EdTech */}
              <div className="flex gap-2 border-b border-white/10 mb-6">
                <button
                  onClick={() => setActiveTab("bitacora" as any)}
                  className={`px-4 py-2 font-medium transition-all ${
                    activeTab === "bitacora"
                      ? "text-white border-b-2 border-[#C9A24D]"
                      : "text-white/60 hover:text-white/80"
                  }`}
                >
                  📝 Bitácora Biométrica
                </button>
                <button
                  onClick={() => setActiveTab("checkin" as any)}
                  className={`px-4 py-2 font-medium transition-all ${
                    activeTab === "checkin"
                      ? "text-white border-b-2 border-[#C9A24D]"
                      : "text-white/60 hover:text-white/80"
                  }`}
                >
                  📍 Check-in Juzgados
                </button>
                <button
                  onClick={() => setActiveTab("billetera" as any)}
                  className={`px-4 py-2 font-medium transition-all ${
                    activeTab === "billetera"
                      ? "text-white border-b-2 border-[#C9A24D]"
                      : "text-white/60 hover:text-white/80"
                  }`}
                >
                  🎓 Billetera Académica
                </button>
              </div>

              {/* Contenido de tabs EdTech */}
              {activeTab === "bitacora" && (
                <BitacoraBiometrica
                  pasantiaId={currentInternship.id}
                  onEntrySaved={(entry) => {
                    // Actualizar pasantía con nueva entrada de bitácora
                    const updated = {
                      ...currentInternship,
                      completedHours: currentInternship.completedHours + (entry.horaSalida ? 4 : 0),
                    };
                    setCurrentInternship(updated);
                    localStorage.setItem("legal-py-current-internship", JSON.stringify(updated));
                  }}
                />
              )}

              {activeTab === "checkin" && (
                <CheckInJuzgado />
              )}

              {activeTab === "billetera" && (
                <BilleteraAcademica />
              )}

              {/* Funcionalidades existentes (mantener compatibilidad) */}
              {activeTab === "pasantia" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InternshipCheckIn
                    internshipId={currentInternship.id}
                    onCheckIn={(checkIn) => {
                      // Actualizar pasantía con nuevo check-in
                      const updated = {
                        ...currentInternship,
                        checkIns: [...currentInternship.checkIns, checkIn],
                        completedHours: currentInternship.completedHours + 4, // 4 horas por check-in
                      };
                      setCurrentInternship(updated);
                      localStorage.setItem("legal-py-current-internship", JSON.stringify(updated));
                    }}
                  />
                  <CaseLogForm
                    internshipId={currentInternship.id}
                    onLogSubmit={(entry) => {
                      // Actualizar pasantía con nueva entrada
                      const updated = {
                        ...currentInternship,
                        caseLogs: [...currentInternship.caseLogs, entry],
                      };
                      setCurrentInternship(updated);
                      localStorage.setItem("legal-py-current-internship", JSON.stringify(updated));
                    }}
                  />
                </div>
              )}
              {/* Historial de Check-ins */}
              {currentInternship.checkIns.length > 0 && (
                <Card className="p-6 bg-white/5 border-white/10">
                  <h3 className="text-xl font-bold text-white mb-4">📅 Historial de Asistencias</h3>
                  <div className="space-y-3">
                    {currentInternship.checkIns.map((checkIn) => (
                      <div key={checkIn.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div>
                          <p className="text-white font-medium">
                            {new Date(checkIn.checkInDate).toLocaleDateString("es-PY")} a las {checkIn.checkInTime}
                          </p>
                          <p className="text-xs text-white/60">{checkIn.location.address || "Ubicación verificada"}</p>
                        </div>
                        <Badge variant={checkIn.verified ? "accent" : "outline"} className="text-xs">
                          {checkIn.verified ? "✓ Verificado" : "Pendiente"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
              {/* Historial de Bitácora */}
              {currentInternship.caseLogs.length > 0 && (
                <Card className="p-6 bg-white/5 border-white/10">
                  <h3 className="text-xl font-bold text-white mb-4">📝 Bitácora de Casos</h3>
                  <div className="space-y-3">
                    {currentInternship.caseLogs.map((log) => (
                      <div key={log.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex items-start justify-between mb-2">
                          <p className="text-white font-medium">{log.description}</p>
                          <Badge variant={log.validated ? "accent" : "outline"} className="text-xs">
                            {log.validated ? "✓ Validado" : "Pendiente"}
                          </Badge>
                        </div>
                        <p className="text-xs text-white/60">
                          {new Date(log.entryDate).toLocaleDateString("es-PY")}
                          {log.caseId && ` • Caso: ${log.caseId}`}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </>
          ) : (
            <Card className="p-12 bg-white/5 border-white/10 text-center">
              <div className="text-6xl mb-4">💼</div>
              <h3 className="text-2xl font-bold text-white mb-3">No tienes una pasantía activa</h3>
              <p className="text-white/70 mb-6">
                Postúlate a una pasantía para comenzar a registrar tu actividad y horas de práctica.
              </p>
              <Button variant="primary" onClick={() => router.push("/pasantias")} className="rounded-xl">
                Explorar Pasantías Disponibles
              </Button>
            </Card>
          )}
        </div>
      )}

      {/* Inscripciones */}
      {activeTab === "inscripciones" && (
        <div className="space-y-6">
          {inscripciones.length === 0 ? (
            <div className="relative backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 p-12 shadow-2xl">
              <div className="text-center">
                <p className="text-lg text-white/70">No hay inscripciones registradas.</p>
              </div>
            </div>
          ) : (
            inscripciones.map((insc) => (
              <div
                key={insc.id}
                className="relative backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 p-8 shadow-2xl hover:shadow-[#C9A24D]/20 hover:border-[#C9A24D]/30 transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-[#C9A24D]">{getCursoNombre(insc.cursoId)}</h3>
                      <Badge variant={getEstadoBadge(insc.estado)} className="text-xs">
                        {insc.estado}
                      </Badge>
                    </div>
                    <p className="text-sm text-white/70 mb-2">
                      <strong>Número:</strong> {insc.numeroInscripcion}
                    </p>
                    <p className="text-sm text-white/70 mb-1">
                      <strong>Participante:</strong> {insc.nombre} {insc.apellido}
                    </p>
                    <p className="text-sm text-white/70 mb-1">
                      <strong>Email:</strong> {insc.email}
                    </p>
                    <p className="text-sm text-white/70 mb-1">
                      <strong>Teléfono:</strong> {insc.telefono}
                    </p>
                    {insc.empresa && (
                      <p className="text-sm text-white/70 mb-1">
                        <strong>Empresa:</strong> {insc.empresa}
                      </p>
                    )}
                    <p className="text-sm text-white/70">
                      <strong>Fecha:</strong>{" "}
                      {new Date(insc.fechaInscripcion).toLocaleDateString("es-PY")}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Postulaciones */}
      {activeTab === "postulaciones" && (
        <div className="space-y-6">
          {postulaciones.length === 0 ? (
            <div className="relative backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 p-12 shadow-2xl">
              <div className="text-center">
                <p className="text-lg text-white/70">No hay postulaciones registradas.</p>
              </div>
            </div>
          ) : (
            postulaciones.map((post) => (
              <div
                key={post.id}
                className="relative backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 p-8 shadow-2xl hover:shadow-[#C9A24D]/20 hover:border-[#C9A24D]/30 transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-[#C9A24D]">{getPasantiaNombre(post.pasantiaId)}</h3>
                      <Badge variant={getEstadoBadge(post.estado)} className="text-xs">
                        {post.estado}
                      </Badge>
                    </div>
                    <p className="text-sm text-white/70 mb-2">
                      <strong>Número:</strong> {post.numeroSolicitud}
                    </p>
                    <p className="text-sm text-white/70 mb-1">
                      <strong>Postulante:</strong> {post.nombre} {post.apellido}
                    </p>
                    <p className="text-sm text-white/70 mb-1">
                      <strong>Email:</strong> {post.email}
                    </p>
                    <p className="text-sm text-white/70 mb-1">
                      <strong>Universidad:</strong> {post.universidad} - {post.carrera} (Semestre {post.semestre})
                    </p>
                    <p className="text-sm text-white/70 mb-1">
                      <strong>Disponibilidad:</strong> {post.disponibilidadHoraria}
                    </p>
                    <p className="text-sm text-white/70">
                      <strong>Fecha:</strong>{" "}
                      {new Date(post.fechaPostulacion).toLocaleDateString("es-PY")}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Solicitudes */}
      {activeTab === "solicitudes" && (
        <div className="space-y-6">
          {solicitudes.length === 0 ? (
            <div className="relative backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 p-12 shadow-2xl">
              <div className="text-center">
                <p className="text-lg text-white/70">No hay solicitudes registradas.</p>
              </div>
            </div>
          ) : (
            solicitudes.map((sol) => (
              <div
                key={sol.id}
                className="relative backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 p-8 shadow-2xl hover:shadow-[#C9A24D]/20 hover:border-[#C9A24D]/30 transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-[#C9A24D]">
                        Solicitud de Capacitación - {sol.tipo}
                      </h3>
                      <Badge variant={getEstadoBadge(sol.estado)} className="text-xs">
                        {sol.estado}
                      </Badge>
                    </div>
                    <p className="text-sm text-white/70 mb-2">
                      <strong>Número:</strong> {sol.numeroSolicitud}
                    </p>
                    <p className="text-sm text-white/70 mb-1">
                      <strong>Contacto:</strong> {sol.nombre} ({sol.email})
                    </p>
                    {sol.empresa && (
                      <p className="text-sm text-white/70 mb-1">
                        <strong>Empresa:</strong> {sol.empresa}
                      </p>
                    )}
                    <p className="text-sm text-white/70 mb-1">
                      <strong>Área:</strong> {sol.areaInteres}
                    </p>
                    <p className="text-sm text-white/70 mb-1">
                      <strong>Modalidad:</strong> {sol.modalidad}
                    </p>
                    {sol.cantidadParticipantes && (
                      <p className="text-sm text-white/70 mb-1">
                        <strong>Participantes:</strong> {sol.cantidadParticipantes}
                      </p>
                    )}
                    <p className="text-sm text-white/70">
                      <strong>Fecha:</strong>{" "}
                      {new Date(sol.fechaSolicitud).toLocaleDateString("es-PY")}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Botón Flotante "Publicar Caso" - Solo visible en modo Cliente */}
      {session && viewMode === "cliente" && (
        <Link
          href="/post-case"
          className="fixed bottom-24 right-4 z-40 md:bottom-6 md:right-6 flex items-center gap-2 px-6 py-4 rounded-2xl bg-[#C9A24D] hover:bg-[#b8943f] text-black font-semibold shadow-xl hover:shadow-2xl transition-all hover:scale-105"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <span className="hidden sm:inline">⚖️ Publicar Caso</span>
          <span className="sm:hidden">⚖️</span>
        </Link>
      )}

      <RoleModeModal
        isOpen={isModeModalOpen}
        onClose={() => setIsModeModalOpen(false)}
        currentMode={viewMode}
        onSelectMode={(mode) => {
          setViewMode(mode);
          localStorage.setItem("legal-py-view-mode", mode);
          window.dispatchEvent(new Event("legal-py-view-mode-changed"));
          setIsModeModalOpen(false);
        }}
      />
        </div>
    </div>
  );
}
