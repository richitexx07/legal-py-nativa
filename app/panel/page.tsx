"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import Tabs from "@/components/Tabs";
import { InscripcionCurso, PostulacionPasantia, SolicitudCapacitacion } from "@/lib/educacion-data";
import { mockCursos, mockPasantias } from "@/lib/educacion-data";
import { getSession } from "@/lib/auth";
import { LegalCase } from "@/lib/types";

export default function PanelAdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("gestiones");
  const [inscripciones, setInscripciones] = useState<InscripcionCurso[]>([]);
  const [postulaciones, setPostulaciones] = useState<PostulacionPasantia[]>([]);
  const [solicitudes, setSolicitudes] = useState<SolicitudCapacitacion[]>([]);
  const [myCases, setMyCases] = useState<LegalCase[]>([]);
  const [session, setSession] = useState(getSession());

  useEffect(() => {
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
        return { label: "En revisión DPT", variant: "terracota" as const };
      }
    }
    if (caseData.status === "ASSIGNED") {
      return { label: "Asignado", variant: "accent" as const };
    }
    return { label: "Abierto", variant: "outline" as const };
  };

  const getComplexityBadge = (complexity: LegalCase["complexity"]) => {
    const colors: Record<LegalCase["complexity"], { bg: string; text: string }> = {
      BAJA: { bg: "bg-gray-500/20", text: "text-gray-400" },
      MEDIA: { bg: "bg-yellow-500/20", text: "text-yellow-400" },
      ALTA: { bg: "bg-orange-500/20", text: "text-orange-400" },
    };
    return colors[complexity];
  };

  const tabs = [
    { id: "gestiones", label: `Mis Gestiones Activas (${myCases.length})` },
    { id: "inscripciones", label: `Inscripciones (${inscripciones.length})` },
    { id: "postulaciones", label: `Postulaciones (${postulaciones.length})` },
    { id: "solicitudes", label: `Solicitudes (${solicitudes.length})` },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
          Panel de Administración
        </h1>
        <p className="text-white/70">
          Gestión de inscripciones, postulaciones y solicitudes de capacitación.
        </p>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Mis Gestiones Activas */}
      {activeTab === "gestiones" && (
        <div className="space-y-4">
          {myCases.length === 0 ? (
            <Card>
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-xl font-semibold text-white mb-2">No tienes gestiones activas</h3>
                <p className="text-white/70 mb-6">
                  Publica tu primer caso legal y comienza a recibir propuestas de profesionales.
                </p>
                <Button variant="primary" onClick={() => router.push("/post-case")}>
                  ⚖️ Publicar Mi Primer Caso
                </Button>
              </div>
            </Card>
          ) : (
            myCases.map((caseData) => {
              const statusBadge = getCaseStatusBadge(caseData);
              const complexityStyle = getComplexityBadge(caseData.complexity);
              return (
                <Card key={caseData.id}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="font-semibold text-[#C9A24D]">{caseData.title}</h3>
                        <Badge variant={statusBadge.variant} className="text-xs">
                          {statusBadge.label}
                        </Badge>
                        <Badge variant="outline" className={`text-xs ${complexityStyle.bg} ${complexityStyle.text} border-current`}>
                          Prioridad: {caseData.complexity}
                        </Badge>
                      </div>
                      <p className="text-sm text-white/70 mb-3 line-clamp-2">{caseData.description}</p>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div>
                          <span className="text-white/50">Área:</span>{" "}
                          <span className="text-white/80">{caseData.practiceArea}</span>
                        </div>
                        <div>
                          <span className="text-white/50">Presupuesto:</span>{" "}
                          <span className="text-[#C9A24D] font-semibold">
                            {new Intl.NumberFormat("es-PY", {
                              style: "currency",
                              currency: "PYG",
                              minimumFractionDigits: 0,
                            }).format(caseData.estimatedBudget)}
                          </span>
                        </div>
                        <div>
                          <span className="text-white/50">Publicado:</span>{" "}
                          <span className="text-white/80">
                            {new Date(caseData.createdAt).toLocaleDateString("es-PY")}
                          </span>
                        </div>
                      </div>
                      {caseData.exclusiveForGepUntil && (
                        <div className="mt-3 p-2 rounded-lg bg-[#C9A24D]/10 border border-[#C9A24D]/30">
                          <p className="text-xs text-[#C9A24D]">
                            👑 Caso con prioridad exclusiva GEP hasta{" "}
                            {new Date(caseData.exclusiveForGepUntil).toLocaleString("es-PY")}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      )}

      {/* Inscripciones */}
      {activeTab === "inscripciones" && (
        <div className="space-y-4">
          {inscripciones.length === 0 ? (
            <Card>
              <div className="text-center py-8">
                <p className="text-white/70">No hay inscripciones registradas.</p>
              </div>
            </Card>
          ) : (
            inscripciones.map((insc) => (
              <Card key={insc.id}>
                <div className="flex items-start justify-between gap-4">
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
              </Card>
            ))
          )}
        </div>
      )}

      {/* Postulaciones */}
      {activeTab === "postulaciones" && (
        <div className="space-y-4">
          {postulaciones.length === 0 ? (
            <Card>
              <div className="text-center py-8">
                <p className="text-white/70">No hay postulaciones registradas.</p>
              </div>
            </Card>
          ) : (
            postulaciones.map((post) => (
              <Card key={post.id}>
                <div className="flex items-start justify-between gap-4">
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
              </Card>
            ))
          )}
        </div>
      )}

      {/* Solicitudes */}
      {activeTab === "solicitudes" && (
        <div className="space-y-4">
          {solicitudes.length === 0 ? (
            <Card>
              <div className="text-center py-8">
                <p className="text-white/70">No hay solicitudes registradas.</p>
              </div>
            </Card>
          ) : (
            solicitudes.map((sol) => (
              <Card key={sol.id}>
                <div className="flex items-start justify-between gap-4">
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
              </Card>
            ))
          )}
        </div>
      )}

      {/* Botón Flotante "Publicar Caso" */}
      {session && (
        <Link
          href="/post-case"
          className="fixed bottom-24 right-4 z-40 md:bottom-6 md:right-6 flex items-center gap-2 px-6 py-4 rounded-full bg-[#C9A24D] hover:bg-[#b8943f] text-black font-semibold shadow-lg transition hover:scale-105"
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
    </div>
  );
}
