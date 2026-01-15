import { notFound } from "next/navigation";
import Link from "next/link";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import Timeline, { TimelineEvent } from "@/components/Timeline";
import DocumentList, { Document } from "@/components/DocumentList";
import { mockCasos } from "@/lib/mock-data";

interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
}

interface Notificacion {
  id: string;
  tipo: string;
  estado: "pendiente" | "entregada" | "rechazada";
  fecha: string;
  evidencia?: {
    tipo: "acuse" | "foto" | "geotag";
    url?: string;
  };
}

const mockTimelineEvents: Record<string, TimelineEvent[]> = {
  "1": [
    {
      id: "1",
      date: "20 de mayo, 09:00",
      title: "Audiencia programada",
      description: "Audiencia programada para el 20 de mayo a las 09:00",
      status: "pending",
      metadata: {
        Lugar: "Juzgado de Primera Instancia en lo Civil y Comercial",
        Sala: "Sala 3",
      },
    },
    {
      id: "2",
      date: "13 de mayo, 14:30",
      title: "Demanda presentada",
      description: "Demanda ingresada al sistema judicial",
      status: "completed",
      metadata: {
        Número: "#34721",
        Juzgado: "Juzgado de Primera Instancia",
      },
    },
    {
      id: "3",
      date: "10 de mayo, 10:00",
      title: "Consulta inicial",
      description: "Primera consulta con el cliente",
      status: "completed",
    },
    {
      id: "4",
      date: "8 de mayo, 16:00",
      title: "Caso iniciado",
      description: "Caso creado en el sistema",
      status: "completed",
    },
  ],
  "2": [
    {
      id: "1",
      date: "12 de mayo, 11:00",
      title: "Documentos pendientes",
      description: "Documentos pendientes de revisión y firma",
      status: "in-progress",
      metadata: {
        Pendiente: "Firma de poder notarial",
      },
    },
    {
      id: "2",
      date: "8 de mayo, 09:00",
      title: "Inicio de trámite",
      description: "Trámite de constitución de sociedad iniciado",
      status: "completed",
      metadata: {
        Tipo: "Sociedad Anónima",
      },
    },
  ],
};

const mockChecklist: Record<string, ChecklistItem[]> = {
  "1": [
    { id: "1", label: "Demanda redactada y revisada", completed: true },
    { id: "2", label: "Documentos adjuntos verificados", completed: true },
    { id: "3", label: "Demanda presentada en juzgado", completed: true },
    { id: "4", label: "Preparación para audiencia", completed: false },
    { id: "5", label: "Revisión de pruebas", completed: false },
  ],
  "2": [
    { id: "1", label: "Estatutos redactados", completed: true },
    { id: "2", label: "Poder notarial obtenido", completed: false },
    { id: "3", label: "Registro de Comercio", completed: false },
    { id: "4", label: "RUC solicitado", completed: false },
  ],
};

const mockDocumentos: Record<string, Document[]> = {
  "1": [
    {
      id: "1",
      name: "Demanda Laboral - López vs Empresa X.pdf",
      type: "PDF",
      size: "2.4 MB",
      uploadedAt: "13 de mayo",
    },
    {
      id: "2",
      name: "Contrato de Trabajo.pdf",
      type: "PDF",
      size: "1.2 MB",
      uploadedAt: "10 de mayo",
    },
    {
      id: "3",
      name: "Pruebas - Recibos de sueldo.pdf",
      type: "PDF",
      size: "3.1 MB",
      uploadedAt: "10 de mayo",
    },
  ],
  "2": [
    {
      id: "1",
      name: "Estatutos Sociales.docx",
      type: "DOCX",
      size: "1.8 MB",
      uploadedAt: "8 de mayo",
    },
    {
      id: "2",
      name: "Acta de Asamblea.pdf",
      type: "PDF",
      size: "0.9 MB",
      uploadedAt: "8 de mayo",
    },
  ],
};

const mockNotificaciones: Record<string, Notificacion[]> = {
  "1": [
    {
      id: "1",
      tipo: "Notificación judicial",
      estado: "entregada",
      fecha: "15 de mayo, 10:30",
      evidencia: {
        tipo: "acuse",
      },
    },
    {
      id: "2",
      tipo: "Citación",
      estado: "pendiente",
      fecha: "20 de mayo, 09:00",
    },
  ],
  "2": [
    {
      id: "1",
      tipo: "Notificación de trámite",
      estado: "entregada",
      fecha: "12 de mayo, 14:00",
      evidencia: {
        tipo: "foto",
      },
    },
  ],
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CasoDetallePage({ params }: PageProps) {
  const { id } = await params;
  const caso = mockCasos.find((c) => c.id === id);

  if (!caso) {
    notFound();
  }

  const timelineEvents = mockTimelineEvents[id] || [];
  const checklist = mockChecklist[id] || [];
  const documentos = mockDocumentos[id] || [];
  const notificaciones = mockNotificaciones[id] || [];

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "activo":
        return "accent";
      case "en-pausa":
        return "terracota";
      case "cerrado":
        return "outline";
      default:
        return "outline";
    }
  };

  const getNotificacionEstadoColor = (estado: Notificacion["estado"]) => {
    switch (estado) {
      case "entregada":
        return "accent";
      case "pendiente":
        return "terracota";
      case "rechazada":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <p className="text-sm text-white/60 font-mono">LPY-{id.padStart(4, "0")}</p>
            <Badge variant={getEstadoColor(caso.estado)}>{caso.estado}</Badge>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">{caso.titulo}</h1>
          {caso.descripcion && <p className="mt-2 text-white/70">{caso.descripcion}</p>}
        </div>
        <Link href="/casos">
          <Button variant="ghost" size="sm">
            ← Volver
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Timeline */}
          <Card>
            <h2 className="text-xl font-bold text-white mb-4">Timeline del Caso</h2>
            <Timeline events={timelineEvents} />
          </Card>

          {/* Checklist */}
          <Card>
            <h2 className="text-xl font-bold text-white mb-4">Checklist</h2>
            <div className="space-y-3">
              {checklist.map((item) => (
                <label
                  key={item.id}
                  className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-white/5 transition"
                >
                  <input
                    type="checkbox"
                    checked={item.completed}
                    readOnly
                    className="h-5 w-5 rounded border-white/20 bg-white/10 text-[#C9A24D] focus:ring-[#C9A24D]"
                  />
                  <span
                    className={`flex-1 ${
                      item.completed ? "text-white/60 line-through" : "text-white"
                    }`}
                  >
                    {item.label}
                  </span>
                  {item.completed && (
                    <svg
                      className="h-5 w-5 text-[#C9A24D]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </label>
              ))}
            </div>
          </Card>

          {/* Documentos */}
          <Card>
            <h2 className="text-xl font-bold text-white mb-4">Documentos</h2>
            <DocumentList
              documents={documentos}
              onUpload={() => {
                // Demo: solo UI
                alert("Funcionalidad de subida de documentos (demo)");
              }}
              showUpload={true}
            />
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Mapa/Ubicación */}
          <Card>
            <h2 className="text-xl font-bold text-white mb-4">Mapa / Ubicación</h2>
            <div className="aspect-video rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
              <div className="text-center space-y-2">
                <svg
                  className="h-12 w-12 text-white/40 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
                <p className="text-sm text-white/60">Mapa no disponible</p>
                <p className="text-xs text-white/40">Integración con API de mapas pendiente</p>
              </div>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <p className="text-white/80">
                <strong>Juzgado:</strong> Juzgado de Primera Instancia
              </p>
              <p className="text-white/80">
                <strong>Dirección:</strong> Av. Mariscal López 1234, Asunción
              </p>
            </div>
          </Card>

          {/* Notificaciones */}
          <Card>
            <h2 className="text-xl font-bold text-white mb-4">Notificaciones</h2>
            <div className="space-y-3">
              {notificaciones.length > 0 ? (
                notificaciones.map((notif) => (
                  <div
                    key={notif.id}
                    className="rounded-lg border border-white/10 bg-white/5 p-3 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-white text-sm">{notif.tipo}</p>
                      <Badge variant={getNotificacionEstadoColor(notif.estado)} className="text-xs">
                        {notif.estado}
                      </Badge>
                    </div>
                    <p className="text-xs text-white/60">{notif.fecha}</p>
                    {notif.evidencia && (
                      <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                        <span className="text-xs text-white/60">Evidencia:</span>
                        <Badge variant="accent" className="text-xs">
                          {notif.evidencia.tipo === "acuse" && "📄 Acuse"}
                          {notif.evidencia.tipo === "foto" && "📷 Foto"}
                          {notif.evidencia.tipo === "geotag" && "📍 Geotag"}
                        </Badge>
                        {notif.evidencia.url && (
                          <Button variant="outline" size="sm" className="ml-auto">
                            Ver
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-white/60">No hay notificaciones registradas</p>
              )}
            </div>
          </Card>

          {/* Info adicional */}
          <Card>
            <h3 className="font-semibold text-white mb-3">Información del Caso</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/60">Última actualización:</span>
                <span className="text-white/80">{caso.ultimaActualizacion}</span>
              </div>
              {caso.profesionalId && (
                <div className="flex justify-between">
                  <span className="text-white/60">Profesional:</span>
                  <span className="text-white/80">Dr. Mario Gómez</span>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
