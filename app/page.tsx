"use client";

import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import Card from "@/components/Card";
import CardImage from "@/components/CardImage";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import Timeline, { TimelineEvent } from "@/components/Timeline";
import { mockProfesionales, mockCategorias, mockCasos } from "@/lib/mock-data";
import Image from "next/image";
import { useI18n } from "@/components/I18nProvider";

export default function Home() {
  const { t } = useI18n();
  // Filtrar solo las 6 categorías solicitadas
  const categoriasPrincipales = mockCategorias.filter(
    (cat) =>
      cat.titulo === "Abogados" ||
      cat.titulo === "Escribanos" ||
      cat.titulo === "Despachantes" ||
      cat.titulo === "Gestores" ||
      cat.titulo === "Oficial de Justicia" ||
      cat.titulo === "Gestiones Migratorias"
      
  );

  // Profesionales destacados (top 3)
  const destacados = mockProfesionales.slice(0, 3);

  // Casos para preview (2 casos con timeline mini)
  const casosPreview = mockCasos.slice(0, 2);

  // Crear eventos de timeline para los casos
  const timelineEvents1: TimelineEvent[] = [
    {
      id: "1",
      date: "13 de mayo",
      title: "Audiencia programada",
      description: "Audiencia programada para el 20 de mayo",
      status: "pending",
    },
    {
      id: "2",
      date: "10 de mayo",
      title: "Demanda presentada",
      description: "Demanda ingresada al sistema",
      status: "completed",
    },
  ];

  const timelineEvents2: TimelineEvent[] = [
    {
      id: "1",
      date: "12 de mayo",
      title: "Documentos pendientes",
      description: "Documentos pendientes de revisión",
      status: "in-progress",
    },
    {
      id: "2",
      date: "8 de mayo",
      title: "Inicio de trámite",
      description: "Trámite de constitución iniciado",
      status: "completed",
    },
  ];

  return (
    <div className="space-y-10">
      {/* HERO */}
      <section className="rounded-2xl border border-white/10 bg-gradient-to-b from-[#13253A] to-transparent p-6 md:p-10">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight text-white">
            {t.home.heroTitlePrefix}{" "}
            <span className="text-[#C9A24D]">{t.home.heroTitleHighlight}</span>
          </h1>
          <p className="mt-4 text-white/70 text-base md:text-lg max-w-2xl">
            {t.home.heroSubtitle}
          </p>

          {/* Search Bar */}
          <div className="mt-6">
            <SearchBar
              placeholder={t.home.searchPlaceholder}
              locationPlaceholder={t.home.locationPlaceholder}
            />
          </div>
        </div>
      </section>

      {/* CATEGORÍAS */}
      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-xl md:text-2xl font-bold text-white">{t.home.servicesTitle}</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categoriasPrincipales.map((cat) => (
            <Link
              key={cat.id}
              href={`/profesionales?categoria=${encodeURIComponent(cat.titulo)}`}
            >
              <Card hover className="h-full">
                <div className="flex flex-col items-center text-center">
                  {cat.icono ? (
                    <div className="mt-2 mb-1">
                      <CardImage
                        src={cat.icono}
                        alt={cat.titulo}
                        size="lg"
                        objectFit="cover"
                      />
                    </div>
                  ) : (
                    <div className="mt-2 mb-1 flex h-16 w-16 items-center justify-center rounded-lg bg-[#C9A24D]/20">
                      <svg
                        className="h-8 w-8 text-[#C9A24D]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  )}
                  <h3 className="font-semibold text-[#C9A24D]">{cat.titulo}</h3>
                  <p className="mt-2 text-xs text-white/70">{cat.descripcion}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* DESTACADOS */}
      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-xl md:text-2xl font-bold text-white">{t.home.featuredTitle}</h2>
          <Link
            href="/profesionales"
            className="text-sm text-white/60 hover:text-[#C9A24D] transition"
          >
            {t.home.featuredViewAll}
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {destacados.map((pro) => (
            <Card key={pro.id} hover>
              <div className="flex items-start gap-4">
                {pro.avatar ? (
                  <div className="relative h-40 w-40 shrink-0 overflow-hidden rounded-full">
                    <Image
                      src={pro.avatar}
                      alt={pro.nombre}
                      fill
                      className="object-cover object-[50%_65%]"
                      sizes="160px"
                      priority
                    />
                  </div>
                ) : (
                  <div className="flex h-40 w-40 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#C9A24D] to-[#C08457] text-lg font-bold text-black">
                    {pro.nombre
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white truncate">{pro.nombre}</h3>
                  <p className="text-sm text-white/70">{pro.titulo}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-sm text-[#C9A24D]">⭐ {pro.rating}</span>
                    <span className="text-xs text-white/50">•</span>
                    <span className="text-xs text-white/60">{pro.ciudad}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-white/60">{pro.precio}</span>
                    <Link href={`/profesionales/${pro.id}`}>
                      <Button variant="outline" size="sm">
                        {t.home.featuredViewProfile}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* SEGUIMIENTO DE CASOS */}
      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-xl md:text-2xl font-bold text-white">{t.home.casesTitle}</h2>
          <Link href="/casos" className="text-sm text-white/60 hover:text-[#C9A24D] transition">
            {t.home.casesViewAll}
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {casosPreview.map((caso, index) => (
            <Card key={caso.id} hover>
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">{caso.titulo}</h3>
                    <p className="text-sm text-white/60">{caso.numero}</p>
                  </div>
                  <Badge
                    variant={caso.estado === "activo" ? "accent" : "outline"}
                    className="shrink-0"
                  >
                    {caso.estado}
                  </Badge>
                </div>
                <p className="text-sm text-white/70">{caso.ultimaActualizacion}</p>

                {/* Timeline Mini */}
                <div className="border-t border-white/10 pt-4">
                  <Timeline
                    events={index === 0 ? timelineEvents1 : timelineEvents2}
                    className="scale-90 origin-top-left"
                  />
                </div>

                <Link href="/casos">
                  <Button variant="outline" size="sm" className="w-full">
                    {t.home.casesViewDetails}
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* EDUCACIÓN Y CAPACITACIÓN */}
      <section className="space-y-4" id="educacion">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white">Educación y Capacitación</h2>
            <p className="mt-1 text-sm text-white/60">
              Cursos, especializaciones y programas de desarrollo profesional
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Cursos */}
          <Link href="/cursos">
            <Card hover className="h-full">
              <div className="flex flex-col h-full">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#C9A24D]/20">
                  <svg
                    className="h-8 w-8 text-[#C9A24D]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-[#C9A24D] text-lg mb-2">Cursos y Capacitación</h3>
                <p className="text-sm text-white/70 mb-4 flex-1">
                  Cursos prácticos y actualizados para profesionales del derecho. Modalidad online, presencial o híbrida.
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <span className="text-xs text-white/60">Catálogo completo</span>
                  <Button variant="outline" size="sm">
                    Ver cursos
                  </Button>
                </div>
              </div>
            </Card>
          </Link>

          {/* Especializaciones */}
          <Link href="/especializaciones">
            <Card hover className="h-full">
              <div className="flex flex-col h-full">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#C08457]/20">
                  <svg
                    className="h-8 w-8 text-[#C08457]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-[#C08457] text-lg mb-2">Especializaciones</h3>
                <p className="text-sm text-white/70 mb-4 flex-1">
                  Programas de especialización avanzada en diversas áreas del derecho. Paraguay e internacional.
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <span className="text-xs text-white/60">Programas especializados</span>
                  <Button variant="outline" size="sm">
                    Ver especializaciones
                  </Button>
                </div>
              </div>
            </Card>
          </Link>

          {/* Pasantías */}
          <Link href="/pasantias">
            <Card hover className="h-full">
              <div className="flex flex-col h-full">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#C9A24D]/20">
                  <svg
                    className="h-8 w-8 text-[#C9A24D]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-[#C9A24D] text-lg mb-2">Pasantías Laborales</h3>
                <p className="text-sm text-white/70 mb-4 flex-1">
                  Oportunidades de pasantía para secretarios/as y asistentes estudiantes. Experiencia práctica en entorno legal.
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <span className="text-xs text-white/60">Programa de pasantías</span>
                  <Button variant="outline" size="sm">
                    Ver pasantías
                  </Button>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </section>

      {/* ACCESOS RÁPIDOS */}
      <section className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold text-white">{t.home.quickAccessTitle}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Consulta Rápida */}
          <Link href="/chat">
            <Card hover className="h-full">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#C9A24D]/20">
                  <svg
                    className="h-8 w-8 text-[#C9A24D]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-[#C9A24D]">{t.home.quickChatTitle}</h3>
                <p className="mt-2 text-sm text-white/70">{t.home.quickChatSubtitle}</p>
              </div>
            </Card>
          </Link>

          {/* Courier Legal */}
          <Link href="/migraciones">
            <Card hover className="h-full">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#C08457]/20">
                  <svg
                    className="h-8 w-8 text-[#C08457]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-[#C08457]">{t.home.quickCourierTitle}</h3>
                <p className="mt-2 text-sm text-white/70">{t.home.quickCourierSubtitle}</p>
              </div>
            </Card>
          </Link>

          {/* Subastas de Casos */}
          <Link href="/casos">
            <Card hover className="h-full">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#C9A24D]/20">
                  <svg
                    className="h-8 w-8 text-[#C9A24D]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-[#C9A24D]">{t.home.quickAuctionsTitle}</h3>
                <p className="mt-2 text-sm text-white/70">{t.home.quickAuctionsSubtitle}</p>
              </div>
            </Card>
          </Link>
        </div>
      </section>
    </div>
  );
}
