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
import { LegalCase } from "@/lib/types";
import { generateCaseHash, truncateHash, copyToClipboard } from "@/lib/security";
import MetricsWidget from "@/components/Dashboard/MetricsWidget";

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

      // Cargar casos del usuario actual desde localStorage
      if (currentSession) {
        try {
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/panel/page.tsx:39',message:'Loading cases from localStorage',data:{hasSession:!!currentSession,userId:currentSession.user.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H2'})}).catch(()=>{});
          // #endregion
          const storedCases = localStorage.getItem("legal-py-cases");
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/panel/page.tsx:43',message:'localStorage read result',data:{hasStoredCases:!!storedCases,storedLength:storedCases?.length||0},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H2'})}).catch(()=>{});
          // #endregion
          if (storedCases) {
            const allCases: LegalCase[] = JSON.parse(storedCases);
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/panel/page.tsx:47',message:'Parsed cases from localStorage',data:{totalCases:allCases.length,caseIds:allCases.map(c=>c.id)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H2'})}).catch(()=>{});
            // #endregion
            // Filtrar casos del usuario actual (por ahora, todos los casos son del usuario actual)
            // En producción, se filtraría por userId
            const userCases = allCases.filter((c) => c.status === "OPEN" || c.status === "ASSIGNED");
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/panel/page.tsx:50',message:'Filtered user cases',data:{filteredCount:userCases.length,statuses:userCases.map(c=>c.status)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H2'})}).catch(()=>{});
            // #endregion
            // Ordenar por fecha (más nuevos primero)
            userCases.sort((a, b) => {
              const dateA = new Date(a.createdAt).getTime();
              const dateB = new Date(b.createdAt).getTime();
              return dateB - dateA;
            });
            setMyCases(userCases);
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/panel/page.tsx:57',message:'Cases set successfully',data:{finalCount:userCases.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H2'})}).catch(()=>{});
            // #endregion
          }
        } catch (error) {
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/panel/page.tsx:60',message:'ERROR loading cases',data:{errorMessage:error instanceof Error?error.message:String(error),errorStack:error instanceof Error?error.stack:undefined},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H2'})}).catch(()=>{});
          // #endregion
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

    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: "debug-session",
        runId: "run-panel-2",
        hypothesisId: "H-REVERIFY",
        location: "app/panel/page.tsx:reverifyInit",
        message: "Reverify gating evaluated",
        data: { isVerified, storedFlag: stored ?? null },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
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
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/panel/page.tsx:notifications',message:'Notifications should render',data:{viewMode,myCasesCount:myCases.length,shouldShow:true},timestamp:Date.now(),sessionId:'debug-session',runId:'run-verify',hypothesisId:'H4'})}).catch(()=>{});
      // #endregion
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
                    // #region agent log
                    fetch("http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        sessionId: "debug-session",
                        runId: "run-panel-2",
                        hypothesisId: "H-REVERIFY",
                        location: "app/panel/page.tsx:reverifyCTA",
                        message: "User clicked reverify CTA",
                        data: {},
                        timestamp: Date.now(),
                      }),
                    }).catch(() => {});
                    // #endregion
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

            {/* Mis Gestiones Activas / Panel Profesional */}
        {(activeTab === "gestiones" || activeTab === "mis-casos") && (
          <div className="space-y-6">
            {/* Widget de Métricas para Plan Empresarial/GEP */}
            {viewMode === "profesional" && (() => {
              const demoPlan = typeof window !== "undefined" ? localStorage.getItem("legal-py-demo-plan") : null;
              const userPlan = demoPlan || (session?.user.kycTier === 3 ? "gep" : null);
              if (userPlan === "empresarial" || userPlan === "gep") {
                return <MetricsWidget plan={userPlan as "empresarial" | "gep"} />;
              }
              return null;
            })()}
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

      {/* DASHBOARD ESTUDIANTE */}
      {viewMode === "estudiante" && (
        <div className="space-y-6 mt-6">
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

          {/* Estado de Aprendizaje */}
          <div className="relative backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 p-8 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">{t("student_panel.active_learning")}</h3>
            <p className="text-sm text-white/70 mb-4">
              Este es un panel de demostración. Simulamos tu avance general en la ruta de aprendizaje.
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm text-white/70">
                <span>Carga horaria completada</span>
                <span className="font-semibold text-emerald-300">65%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full w-[65%] bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.6)] transition-all" />
              </div>
              <div className="flex items-center justify-between text-xs text-white/50 mt-1">
                <span>3 cursos activos</span>
                <span>1 pasantía en proceso</span>
              </div>
            </div>
          </div>
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
          // #region agent log
          fetch("http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sessionId: "debug-session",
              runId: "run3",
              hypothesisId: "H-MODE",
              location: "app/panel/page.tsx:onSelectMode",
              message: "View mode changed via modal (panel)",
              data: { mode },
              timestamp: Date.now(),
            }),
          }).catch(() => {});
          // #endregion
        }}
      />
        </div>
    </div>
  );
}
