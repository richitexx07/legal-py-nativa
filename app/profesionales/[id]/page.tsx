"use client";

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import Tabs from "@/components/Tabs";
import DocumentList, { Document } from "@/components/DocumentList";
import { mockProfesionales } from "@/lib/mock-data";
import { useLanguage } from "@/context/LanguageContext";
import { getSession } from "@/lib/auth";
import {
  getProfessionalReputation,
  getReviews,
  isBlocked as checkIsBlocked,
} from "@/lib/reputation";
import type { ProfessionalReputation as ReputationType } from "@/lib/reputation";

// Componentes de perfil
import StatusBadge from "@/components/Profile/StatusBadge";
import RatingDisplay from "@/components/Profile/RatingDisplay";
import ReviewCard from "@/components/Profile/ReviewCard";
import ReviewForm from "@/components/Profile/ReviewForm";
import ReportModal from "@/components/Profile/ReportModal";
import BlockButton from "@/components/Profile/BlockButton";
import PerformanceHistory from "@/components/Profile/PerformanceHistory";

// Datos mock adicionales para servicios
interface Servicio {
  id: string;
  nombre: string;
  descripcion: string;
  precio: string;
}

const mockServicios: Record<string, Servicio[]> = {
  "1": [
    {
      id: "1",
      nombre: "Consulta Inicial",
      descripcion: "Consulta de 1 hora para evaluación del caso",
      precio: "Gs. 200.000",
    },
    {
      id: "2",
      nombre: "Asesoría Penal",
      descripcion: "Asesoría especializada en derecho penal",
      precio: "Gs. 350.000",
    },
    {
      id: "3",
      nombre: "Representación Legal",
      descripcion: "Representación en procesos penales",
      precio: "Gs. 500.000",
    },
  ],
  "2": [
    {
      id: "1",
      nombre: "Consulta Laboral",
      descripcion: "Consulta de 1 hora sobre temas laborales",
      precio: "Gs. 180.000",
    },
    {
      id: "2",
      nombre: "Revisión de Contrato",
      descripcion: "Revisión y redacción de contratos laborales",
      precio: "Gs. 300.000",
    },
  ],
  "3": [
    {
      id: "1",
      nombre: "Consulta Civil",
      descripcion: "Consulta de 1 hora sobre temas civiles",
      precio: "Gs. 150.000",
    },
    {
      id: "2",
      nombre: "Asesoría Comercial",
      descripcion: "Asesoría en derecho comercial",
      precio: "Gs. 280.000",
    },
  ],
  "4": [
    {
      id: "1",
      nombre: "Escritura Pública",
      descripcion: "Redacción y firma de escritura pública",
      precio: "Gs. 450.000",
    },
    {
      id: "2",
      nombre: "Acta Notarial",
      descripcion: "Elaboración de acta notarial",
      precio: "Gs. 250.000",
    },
  ],
};

const mockDocumentos: Document[] = [
  {
    id: "1",
    name: "Documento Legal de Gonzáles.pdf",
    type: "PDF",
    size: "2.4 MB",
    uploadedAt: "Hace 3 días",
    price: "Gs. 250.000",
  },
  {
    id: "2",
    name: "Escritura Pública de Compraventa.pdf",
    type: "PDF",
    size: "1.8 MB",
    uploadedAt: "Hace 1 semana",
    price: "Gs. 450.000",
  },
  {
    id: "3",
    name: "Factura Profesional.pdf",
    type: "PDF",
    size: "0.5 MB",
    uploadedAt: "Hace 2 semanas",
    price: "Gs. 150.000",
  },
];

interface PageProps {
  params: { id: string };
}

export default function ProfesionalPage({ params }: PageProps) {
  const { id } = params;

  // #region agent log
  fetch("http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId: "debug-session",
      runId: "run1",
      hypothesisId: "H1",
      location: "app/profesionales/[id]/page.tsx:ProfesionalPage",
      message: "ProfesionalPage render start",
      data: { id },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion
  const { t } = useLanguage();
  const profesional = mockProfesionales.find((p) => p.id === id);
  const session = getSession();

  // Estados
  const [reputation, setReputation] = useState<ReputationType | null>(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reviewSortBy, setReviewSortBy] = useState<"recent" | "rating" | "helpful">("recent");
  const [minRating, setMinRating] = useState<number | undefined>(undefined);

  // Cargar reputación y estado de bloqueo
  useEffect(() => {
    if (profesional) {
      const rep = getProfessionalReputation(id);
      setReputation(rep);
      
      if (session?.user.role === "cliente") {
        setIsBlocked(checkIsBlocked(id, session.user.id));
      }
    }
  }, [id, profesional, session]);

  if (!profesional) {
    notFound();
  }

  const servicios = mockServicios[id] || [];
  const iniciales = profesional.nombre
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  // Obtener reseñas filtradas
  const reviewsData = reputation
    ? getReviews(id, { sortBy: reviewSortBy, minRating })
    : { reviews: [], total: 0 };

  const isClient = session?.user.role === "cliente";
  const clientId = session?.user.id || "";

  const handleReviewSubmit = () => {
    setShowReviewForm(false);
    // Recargar reputación
    const rep = getProfessionalReputation(id);
    setReputation(rep);
  };

  const handleReportSubmit = () => {
    // Recargar reputación
    const rep = getProfessionalReputation(id);
    setReputation(rep);
  };

  const tabs = [
    {
      id: "sobre-mi",
      label: "Sobre Mí",
      content: (
        <div className="space-y-4">
          {reputation && reputation.status !== "activo" && (
            <div
              className={`rounded-lg border p-4 mb-4 ${
                reputation.status === "suspendido"
                  ? "bg-red-500/10 border-red-500/30"
                  : "bg-yellow-500/10 border-yellow-500/30"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">
                  {reputation.status === "suspendido" ? "⛔" : "⏳"}
                </span>
                <div className="flex-1">
                  <h4 className="font-semibold text-white mb-1">
                    {reputation.status === "suspendido" ? "Profesional Suspendido" : "En Revisión"}
                  </h4>
                  <p className="text-sm text-white/70">
                    {reputation.status === "suspendido"
                      ? reputation.suspensionReason ||
                        "Este profesional está temporalmente suspendido de la plataforma."
                      : "Este profesional está siendo revisado por nuestro equipo."}
                  </p>
                  {reputation.suspensionUntil && (
                    <p className="text-xs text-white/60 mt-1">
                      Suspensión hasta: {new Date(reputation.suspensionUntil).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <p className="text-white/80 leading-relaxed">{profesional.descripcion}</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-white/60">Experiencia:</span>
              <span className="text-sm font-medium text-white">{profesional.experiencia} años</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-white/60">Ubicación:</span>
              <span className="text-sm font-medium text-white">{profesional.ciudad}</span>
            </div>
            {profesional.idiomas && profesional.idiomas.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-white/60">Idiomas:</span>
                {profesional.idiomas.map((idioma) => (
                  <Badge key={idioma} variant="outline">
                    {idioma}
                  </Badge>
                ))}
              </div>
            )}
            {reputation && (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white/60">Estado:</span>
                  <StatusBadge status={reputation.status} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white/60">Casos completados:</span>
                  <span className="text-sm font-medium text-white">
                    {reputation.casesCompleted} de {reputation.totalCases}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white/60">Tasa de respuesta:</span>
                  <span className="text-sm font-medium text-white">
                    {reputation.responseRate.toFixed(0)}%
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      ),
    },
    {
      id: "especialidades",
      label: "Especialidades",
      content: (
        <div className="space-y-3">
          {profesional.especialidades?.map((esp) => (
            <Card key={esp}>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-white">{esp}</h4>
                  <p className="text-sm text-white/60 mt-1">
                    {profesional.experiencia} años de experiencia en esta área
                  </p>
                </div>
                <Badge variant="accent">{profesional.experiencia}%</Badge>
              </div>
            </Card>
          ))}
        </div>
      ),
    },
    {
      id: "servicios",
      label: "Servicios",
      content: (
        <div className="space-y-4">
          {servicios.length > 0 ? (
            servicios.map((servicio) => (
              <Card key={servicio.id} hover>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{servicio.nombre}</h4>
                    <p className="text-sm text-white/70 mt-1">{servicio.descripcion}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-[#C9A24D]">{servicio.precio}</p>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <p className="text-white/60">No hay servicios disponibles</p>
          )}
        </div>
      ),
    },
    {
      id: "resenas",
      label: "Reseñas",
      content: (
        <div className="space-y-6">
          {reputation && reputation.rating.total > 0 && (
            <>
              <RatingDisplay stats={reputation.rating} showDistribution={true} />

              {/* Filtros y ordenamiento */}
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-white/60">Ordenar por:</span>
                  <select
                    value={reviewSortBy}
                    onChange={(e) =>
                      setReviewSortBy(e.target.value as "recent" | "rating" | "helpful")
                    }
                    className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
                    style={{ colorScheme: "dark" }}
                  >
                    <option value="recent">Más recientes</option>
                    <option value="rating">Mejor calificadas</option>
                    <option value="helpful">Más útiles</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-white/60">Filtrar:</span>
                  <select
                    value={minRating || ""}
                    onChange={(e) =>
                      setMinRating(e.target.value ? parseInt(e.target.value) : undefined)
                    }
                    className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
                    style={{ colorScheme: "dark" }}
                  >
                    <option value="">Todas</option>
                    <option value="5">5 estrellas</option>
                    <option value="4">4+ estrellas</option>
                    <option value="3">3+ estrellas</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Botón para dejar reseña (solo clientes) */}
          {isClient && !isBlocked && (
            <div>
              {!showReviewForm ? (
                <Button
                  variant="primary"
                  onClick={() => setShowReviewForm(true)}
                  className="w-full md:w-auto"
                >
                  ✍️ Dejar Reseña
                </Button>
              ) : (
                <ReviewForm
                  professionalId={id}
                  clientId={clientId}
                  onSubmit={handleReviewSubmit}
                  onCancel={() => setShowReviewForm(false)}
                />
              )}
            </div>
          )}

          {/* Lista de reseñas */}
          <div className="space-y-4">
            {reviewsData.reviews.length > 0 ? (
              reviewsData.reviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  professionalId={id}
                  currentUserId={clientId}
                />
              ))
            ) : (
              <Card>
                <p className="text-white/60 text-center py-8">
                  {reputation && reputation.rating.total === 0
                    ? "Este profesional aún no tiene reseñas."
                    : "No hay reseñas que coincidan con los filtros seleccionados."}
                </p>
              </Card>
            )}
          </div>
        </div>
      ),
    },
    {
      id: "historial",
      label: "Historial",
      content: (
        <div className="space-y-4">
          {reputation && reputation.performanceHistory.length > 0 ? (
            <PerformanceHistory history={reputation.performanceHistory} />
          ) : (
            <Card>
              <p className="text-white/60 text-center py-8">
                No hay historial de desempeño disponible todavía.
              </p>
            </Card>
          )}
        </div>
      ),
    },
    {
      id: "documentos",
      label: "Documentos",
      content: (
        <div className="space-y-4">
          <DocumentList
            documents={mockDocumentos}
            onUpload={() => {
              alert("Funcionalidad de subida de documentos (demo)");
            }}
            showUpload={true}
          />
        </div>
      ),
    },
  ];

  // Si está bloqueado, mostrar mensaje
  if (isBlocked && isClient) {
    return (
      <div className="space-y-6">
        <Card>
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/20 mb-4">
              <span className="text-3xl">🚫</span>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">
              Has bloqueado a este profesional
            </h2>
            <p className="text-white/70 mb-6">
              No puedes ver el perfil ni contactar a este profesional porque lo has bloqueado.
            </p>
            <Link href="/profesionales">
              <Button variant="primary">Ver Otros Profesionales</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {profesional.avatar ? (
            <img
              src={profesional.avatar}
              alt={profesional.nombre}
              className="h-32 w-32 rounded-2xl object-cover md:h-40 md:w-40"
            />
          ) : (
            <div className="flex h-32 w-32 items-center justify-center rounded-2xl bg-gradient-to-br from-[#C9A24D] to-[#C08457] text-3xl font-bold text-black md:h-40 md:w-40">
              {iniciales}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white">
                {profesional.nombre}
              </h1>
              <p className="text-lg text-white/70 mt-1">{profesional.titulo}</p>
              {reputation && (
                <div className="mt-2">
                  <StatusBadge status={reputation.status} />
                </div>
              )}
            </div>

            {/* Acciones para clientes */}
            {isClient && !isBlocked && (
              <div className="flex flex-col gap-2 items-end">
                <BlockButton
                  professionalId={id}
                  clientId={clientId}
                  professionalName={profesional.nombre}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowReportModal(true)}
                  className="text-red-400 border-red-400/50 hover:bg-red-400/10"
                >
                  🚨 Denunciar
                </Button>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm">
            {reputation && reputation.rating.total > 0 ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-[#C9A24D] font-semibold">
                    ⭐ {reputation.rating.average.toFixed(1)}
                  </span>
                  <span className="text-white/60">({reputation.rating.total} reseñas)</span>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-white/60">Sin calificaciones aún</span>
              </div>
            )}
            <span className="text-white/40">•</span>
            <span className="text-white/80">{profesional.experiencia} años de experiencia</span>
            <span className="text-white/40">•</span>
            <div className="flex items-center gap-1">
              <svg
                className="h-4 w-4 text-white/60"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="text-white/80">{profesional.ciudad}</span>
            </div>
          </div>

          {profesional.idiomas && profesional.idiomas.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-white/60">Idiomas:</span>
              {profesional.idiomas.map((idioma) => (
                <Badge key={idioma} variant="outline">
                  {idioma}
                </Badge>
              ))}
            </div>
          )}

          {/* CTA Principal - Solo si está activo */}
          {(!reputation || reputation.status === "activo") && (
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Link href={`/profesionales/${id}/reservar`}>
                <Button variant="primary" size="lg" className="w-full md:w-auto">
                  {t("professionals.book_consultation")} →
                </Button>
              </Link>
              <Link href={`/videollamada/${profesional.id}`}>
                <Button variant="secondary" size="lg" className="w-full md:w-auto">
                  {t("professionals.video_call")} →
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Card>
        <Tabs tabs={tabs} defaultTab="sobre-mi" />
      </Card>

      {/* Modal de denuncia */}
      {isClient && showReportModal && (
        <ReportModal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          professionalId={id}
          clientId={clientId}
          professionalName={profesional.nombre}
        />
      )}

      {/* Volver */}
      <div className="pt-4">
        <Link href="/profesionales">
          <Button variant="ghost" size="sm">
            ← {t("common.back")} {t("navbar.professionals").toLowerCase()}
          </Button>
        </Link>
      </div>
    </div>
  );
}
