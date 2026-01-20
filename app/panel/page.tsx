"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import Tabs from "@/components/Tabs";
import { InscripcionCurso, PostulacionPasantia, SolicitudCapacitacion } from "@/lib/educacion-data";
import { mockCursos, mockPasantias } from "@/lib/educacion-data";
import { getSession } from "@/lib/auth";

export default function PanelAdminPage() {
  const [activeTab, setActiveTab] = useState("inscripciones");
  const [inscripciones, setInscripciones] = useState<InscripcionCurso[]>([]);
  const [postulaciones, setPostulaciones] = useState<PostulacionPasantia[]>([]);
  const [solicitudes, setSolicitudes] = useState<SolicitudCapacitacion[]>([]);
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

  const tabs = [
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
