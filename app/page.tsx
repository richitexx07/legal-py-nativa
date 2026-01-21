"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SearchBar from "@/components/SearchBar";
import Card from "@/components/Card";
import CardImage from "@/components/CardImage";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import Timeline, { TimelineEvent } from "@/components/Timeline";
import { mockProfesionales, mockCategorias, mockCasos } from "@/lib/mock-data";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { getSession } from "@/lib/auth";

export default function Home() {
  const { t } = useLanguage();
  const router = useRouter();
  const [session, setSession] = useState(getSession());

  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentSession = getSession();
      setSession(currentSession);
    }
  }, []);
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
      {/* HERO SECTION - Rediseñado para máxima conversión */}
      <section className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-[#0E1B2A] via-[#13253A] to-[#0E1B2A] p-6 md:p-12 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A24D] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-white mb-6">
            {t("hero.title").split("Blindada con Tecnología")[0] || "Tu Seguridad Jurídica"}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A24D] to-[#C08457]">
              {t("hero.title").includes("Blindada con Tecnología") ? "Blindada con Tecnología" : t("hero.title")}
            </span>
          </h1>
          <p className="mt-4 text-white/80 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-light">
            {t("hero.subtitle")}
          </p>

          {/* CTAs - Diseñados para máxima conversión */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Link href="/post-case">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-[#C9A24D] to-[#C08457] text-black font-bold text-lg rounded-xl shadow-2xl hover:shadow-[#C9A24D]/50 transition-all duration-300 hover:scale-105 transform">
                <span className="flex items-center gap-2">
                  {t("hero.cta_primary")}
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
            </Link>
            <Link href="/register?rol=profesional">
              <button className="px-8 py-4 border-2 border-blue-400 text-blue-400 font-semibold text-lg rounded-xl hover:bg-blue-400/10 transition-all duration-300 hover:scale-105 transform">
                <span className="flex items-center gap-2">
                  {t("hero.cta_secondary")}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* TRUST BAR - Barra de Autoridad */}
      <section className="bg-gray-800/40 backdrop-blur-sm border-y border-white/10 py-6">
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 px-4">
          {/* Encriptación AES-256 */}
          <div className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity cursor-pointer group">
            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-[#C9A24D]/20 transition-colors">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <span className="text-white/80 text-sm font-medium">Encriptación AES-256</span>
          </div>

          {/* Compliance GAFILAT */}
          <div className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity cursor-pointer group">
            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="text-white/80 text-sm font-medium">Compliance GAFILAT</span>
          </div>

          {/* Verificación Biométrica */}
          <div className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity cursor-pointer group">
            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
              </svg>
            </div>
            <span className="text-white/80 text-sm font-medium">Verificación Biométrica</span>
          </div>

          {/* Tecnología Blockchain */}
          <div className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity cursor-pointer group">
            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-white/80 text-sm font-medium">Tecnología Blockchain</span>
          </div>
        </div>
      </section>

      {/* SECCIÓN "CÓMO FUNCIONA" - Reducción de Carga Cognitiva */}
      <section className="space-y-8 py-12">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            {t("how_it_works.title") || "Cómo Funciona"}
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            {t("common.process_steps") || "Proceso simple y seguro en 3 pasos"}
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Paso 1 */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#C9A24D] to-[#C08457] rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
            <Card className="relative h-full p-8 text-center hover:scale-105 transition-transform duration-300">
              <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#C9A24D]/20 to-[#C08457]/20 flex items-center justify-center border-2 border-[#C9A24D]/30">
                  <svg className="w-10 h-10 text-[#C9A24D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#C9A24D] text-black font-bold text-sm flex items-center justify-center">
                1
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{t("how_it_works.step1_title") || "Publicas tu Caso"}</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                {t("how_it_works.step1_desc") || "Describe tu situación de forma segura. Encriptación nivel bancario."}
              </p>
            </Card>
          </div>

          {/* Paso 2 */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
            <Card className="relative h-full p-8 text-center hover:scale-105 transition-transform duration-300">
              <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border-2 border-blue-500/30">
                  <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
              </div>
              <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-blue-500 text-white font-bold text-sm flex items-center justify-center">
                2
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{t("how_it_works.step2_title") || "Nuestro Motor DPT Filtra"}</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                {t("how_it_works.step2_desc") || "Nuestro algoritmo de Derivación Priorizada por Perfil Técnico analiza complejidad y especialidad."}
              </p>
            </Card>
          </div>

          {/* Paso 3 */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
            <Card className="relative h-full p-8 text-center hover:scale-105 transition-transform duration-300">
              <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center border-2 border-green-500/30">
                  <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-green-500 text-white font-bold text-sm flex items-center justify-center">
                3
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{t("how_it_works.step3_title") || "Recibes Solución Experta"}</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                {t("how_it_works.step3_desc") || "Conexión directa con profesionales verificados. Sin comisiones ocultas."}
              </p>
            </Card>
          </div>
        </div>

        {/* Conector visual entre pasos */}
        <div className="hidden md:flex items-center justify-center gap-4 max-w-5xl mx-auto mt-8">
          <div className="flex-1 h-0.5 bg-gradient-to-r from-transparent via-[#C9A24D]/50 to-[#C9A24D]"></div>
          <div className="w-3 h-3 rounded-full bg-[#C9A24D]"></div>
          <div className="flex-1 h-0.5 bg-gradient-to-r from-[#C9A24D] via-blue-500/50 to-blue-500"></div>
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <div className="flex-1 h-0.5 bg-gradient-to-r from-blue-500 via-green-500/50 to-green-500"></div>
        </div>
      </section>

      {/* CATEGORÍAS */}
      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-xl md:text-2xl font-bold text-white">{t("home.services_title")}</h2>
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
          <h2 className="text-xl md:text-2xl font-bold text-white">{t("home.featured_title")}</h2>
          <Link
            href="/profesionales"
            className="text-sm text-white/60 hover:text-[#C9A24D] transition"
          >
            {t("home.featured_view_all")}
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
                        {t("home.featured_view_profile")}
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
          <h2 className="text-xl md:text-2xl font-bold text-white">{t("home.cases_title")}</h2>
          <Link href="/casos" className="text-sm text-white/60 hover:text-[#C9A24D] transition">
            {t("home.cases_view_all")}
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
                    {t("home.cases_view_details")}
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
        <h2 className="text-xl md:text-2xl font-bold text-white">{t("home.quick_access_title")}</h2>
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
                <h3 className="font-semibold text-[#C9A24D]">{t("home.quick_chat_title")}</h3>
                <p className="mt-2 text-sm text-white/70">{t("home.quick_chat_subtitle")}</p>
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
                <h3 className="font-semibold text-[#C08457]">{t("home.quick_courier_title")}</h3>
                <p className="mt-2 text-sm text-white/70">{t("home.quick_courier_subtitle")}</p>
              </div>
            </Card>
          </Link>

          {/* Casos Internacionales */}
          <Link href="/casos-internacionales">
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
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-[#C9A24D]">🌍 Casos Internacionales</h3>
                <p className="mt-2 text-sm text-white/70">Derivación ética por perfil técnico - Sistema DPT</p>
              </div>
            </Card>
          </Link>
        </div>
      </section>

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
