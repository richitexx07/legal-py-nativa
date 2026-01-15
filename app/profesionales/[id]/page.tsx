"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import Tabs from "@/components/Tabs";
import DocumentList, { Document } from "@/components/DocumentList";
import { mockProfesionales } from "@/lib/mock-data";
import { useI18n } from "@/components/I18nProvider";

// Datos mock adicionales para servicios y reseñas
interface Servicio {
  id: string;
  nombre: string;
  descripcion: string;
  precio: string;
}

interface Resena {
  id: string;
  autor: string;
  rating: number;
  fecha: string;
  comentario: string;
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

const mockResenas: Resena[] = [
  {
    id: "1",
    autor: "Carlos M.",
    rating: 5,
    fecha: "Hace 2 semanas",
    comentario:
      "Excelente profesional, muy atento y detallado. Me ayudó mucho con mi caso y siempre estuvo disponible para responder mis dudas.",
  },
  {
    id: "2",
    autor: "María L.",
    rating: 5,
    fecha: "Hace 1 mes",
    comentario:
      "Muy profesional y conocedor de su área. El proceso fue claro desde el inicio y obtuve resultados favorables.",
  },
  {
    id: "3",
    autor: "Roberto S.",
    rating: 4,
    fecha: "Hace 2 meses",
    comentario:
      "Buen servicio, aunque la comunicación podría mejorar un poco. En general, satisfecho con el resultado.",
  },
  {
    id: "4",
    autor: "Ana P.",
    rating: 5,
    fecha: "Hace 3 meses",
    comentario:
      "Altamente recomendado. Profesional serio, puntual y con gran conocimiento. Definitivamente volvería a contratarlo.",
  },
];

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
  params: Promise<{ id: string }>;
}

export default function ProfesionalPage({ params }: PageProps) {
  const { id } = use(params);
  const { t } = useI18n();
  const profesional = mockProfesionales.find((p) => p.id === id);

  if (!profesional) {
    notFound();
  }

  const servicios = mockServicios[id] || [];
  const iniciales = profesional.nombre
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  const tabs = [
    {
      id: "sobre-mi",
      label: "Sobre Mí",
      content: (
        <div className="space-y-4">
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
        <div className="space-y-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-[#C9A24D]">{profesional.rating}</p>
              <div className="flex items-center gap-1 mt-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(profesional.rating)
                        ? "text-[#C9A24D]"
                        : "text-white/20"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm text-white/60 mt-2">{mockResenas.length} reseñas</p>
            </div>
          </div>
          <div className="space-y-4">
            {mockResenas.map((resena) => (
              <Card key={resena.id}>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white">{resena.autor}</p>
                      <p className="text-xs text-white/60">{resena.fecha}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`h-4 w-4 ${
                            i < resena.rating ? "text-[#C9A24D]" : "text-white/20"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-white/80 leading-relaxed">{resena.comentario}</p>
                </div>
              </Card>
            ))}
          </div>
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
              // Demo: solo UI
              alert("Funcionalidad de subida de documentos (demo)");
            }}
            showUpload={true}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="flex h-32 w-32 items-center justify-center rounded-2xl bg-gradient-to-br from-[#C9A24D] to-[#C08457] text-3xl font-bold text-black md:h-40 md:w-40">
            {iniciales}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 space-y-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">{profesional.nombre}</h1>
            <p className="text-lg text-white/70 mt-1">{profesional.titulo}</p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-[#C9A24D] font-semibold">⭐ {profesional.rating}</span>
              <span className="text-white/60">({mockResenas.length} reseñas)</span>
            </div>
            <span className="text-white/40">•</span>
            <span className="text-white/80">{profesional.experiencia} años de experiencia</span>
            <span className="text-white/40">•</span>
            <div className="flex items-center gap-1">
              <svg className="h-4 w-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

          {/* CTA Principal */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <Button variant="primary" size="lg" className="w-full md:w-auto">
              {t.professionals.bookConsultation} →
            </Button>
            <Link href={`/videollamada/${profesional.id}`}>
              <Button variant="secondary" size="lg" className="w-full md:w-auto">
                {t.professionals.videoCall} →
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Card>
        <Tabs tabs={tabs} defaultTab="sobre-mi" />
      </Card>

      {/* Volver */}
      <div className="pt-4">
        <Link href="/profesionales">
          <Button variant="ghost" size="sm">
            ← {t.common.volver} {t.nav.profesionales.toLowerCase()}
          </Button>
        </Link>
      </div>
    </div>
  );
}
