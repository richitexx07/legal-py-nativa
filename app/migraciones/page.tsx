"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import Link from "next/link";
import Image from "next/image";
import { mockProfesionales } from "@/lib/mock-data";
import { useI18n } from "@/components/I18nProvider";

interface Gestion {
  id: string;
  titulo: string;
  descripcion: string;
  icono: string;
}

const gestionesCompletas: Gestion[] = [
  {
    id: "residencia-temporaria",
    titulo: "Residencia Temporaria",
    descripcion: "Residencia temporal para extranjeros con estadía definida",
    icono: "📅",
  },
  {
    id: "residencia-permanente",
    titulo: "Residencia Permanente",
    descripcion: "Residencia permanente para establecerse en Paraguay",
    icono: "🏠",
  },
  {
    id: "cedula-extranjeros",
    titulo: "Cédula para Extranjeros",
    descripcion: "Documento de identidad para extranjeros con residencia",
    icono: "🆔",
  },
  {
    id: "regularizacion",
    titulo: "Regularización",
    descripcion: "Regularización de situación migratoria",
    icono: "✅",
  },
  {
    id: "renovacion",
    titulo: "Renovación de Documentos",
    descripcion: "Renovación de residencia, cédula y otros documentos",
    icono: "🔄",
  },
  {
    id: "turnos",
    titulo: "Gestión de Turnos",
    descripcion: "Agendamiento de turnos en instituciones oficiales",
    icono: "📋",
  },
  {
    id: "preparacion-carpetas",
    titulo: "Preparación de Carpetas",
    descripcion: "Asistencia en preparación y organización de documentación",
    icono: "📁",
  },
  {
    id: "seguimiento",
    titulo: "Seguimiento de Expedientes",
    descripcion: "Monitoreo y actualizaciones del estado de trámites",
    icono: "📊",
  },
  {
    id: "asesoramiento",
    titulo: "Asesoramiento Legal",
    descripcion: "Consulta y asesoría sobre requisitos y procedimientos",
    icono: "💼",
  },
];

export default function GestionesMigratorias() {
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const gestionSeleccionadaParam = searchParams.get("gestion");

  // Estados para filtros
  const [ciudadFiltro, setCiudadFiltro] = useState<string>("");
  const [precioFiltro, setPrecioFiltro] = useState<string>("");
  const [ratingFiltro, setRatingFiltro] = useState<string>("");
  const [modalidadFiltro, setModalidadFiltro] = useState<string>("");
  const [busqueda, setBusqueda] = useState<string>("");
  const [mostrarTodasGestiones, setMostrarTodasGestiones] = useState(false);

  // Filtrar profesionales de Gestiones Migratorias
  const especialistas = mockProfesionales.filter(
    (p) => p.categoria === "Gestiones Migratorias"
  );

  // Gestiones destacadas (primeras 3)
  const gestionesDestacadas = gestionesCompletas.slice(0, 3);
  const gestionesParaMostrar = mostrarTodasGestiones
    ? gestionesCompletas
    : gestionesDestacadas;

  // Filtrar especialistas según filtros
  const especialistasFiltrados = useMemo(() => {
    return especialistas.filter((esp) => {
      // Filtro por ciudad
      if (ciudadFiltro && esp.ciudad !== ciudadFiltro) return false;

      // Filtro por rating
      if (ratingFiltro) {
        const minRating = parseFloat(ratingFiltro);
        if (esp.rating < minRating) return false;
      }

      // Filtro por búsqueda
      if (busqueda) {
        const searchLower = busqueda.toLowerCase();
        if (
          !esp.nombre.toLowerCase().includes(searchLower) &&
          !esp.titulo.toLowerCase().includes(searchLower) &&
          !esp.especialidades?.some((e) =>
            e.toLowerCase().includes(searchLower)
          )
        ) {
          return false;
        }
      }

      // Filtro por gestión seleccionada (si viene de la URL)
      if (gestionSeleccionadaParam) {
        const gestion = gestionesCompletas.find(
          (g) => g.id === gestionSeleccionadaParam
        );
        if (gestion) {
          // Verificar si el especialista tiene esta especialidad
          const tieneGestion =
            esp.especialidades?.some((e) =>
              e.toLowerCase().includes(gestion.titulo.toLowerCase().split(" ")[0])
            ) || false;
          if (!tieneGestion) return false;
        }
      }

      return true;
    });
  }, [
    especialistas,
    ciudadFiltro,
    ratingFiltro,
    busqueda,
    gestionSeleccionadaParam,
  ]);

  const ciudades = Array.from(
    new Set(especialistas.map((e) => e.ciudad))
  ).sort();

  const handleSeleccionarGestion = (gestionId: string) => {
    window.location.href = `/migraciones?gestion=${gestionId}`;
  };

  return (
    <div className="space-y-6">
      {/* Header con Título, Subtítulo y Disclaimer */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">
            Gestiones Migratorias
          </h1>
          <p className="text-lg md:text-xl text-[#C9A24D] mt-2 font-semibold">
            Residencia · Documentos · Regularización
          </p>
          <p className="text-white/70 mt-3 max-w-3xl">
            Trámites para extranjeros en Paraguay: asesoramiento, gestión privada, turnos,
            preparación de carpetas y seguimiento de expedientes.
          </p>
        </div>

        {/* Disclaimer Legal */}
        <Card className="bg-[#C08457]/10 border-[#C08457]/30">
          <div className="flex items-start gap-3">
            <div className="text-2xl">⚠️</div>
            <div>
              <h3 className="font-semibold text-white mb-1">Aviso Importante</h3>
              <p className="text-sm text-white/80">
                Servicio privado de gestoría y acompañamiento. No somos un organismo público ni
                pertenecemos a la Dirección General de Migraciones.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Buscador y Filtros */}
      <Card>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Buscar Especialista</h2>

          {/* Barra de búsqueda */}
          <div>
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre, especialidad..."
              className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
            />
          </div>

          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <select
              value={ciudadFiltro}
              onChange={(e) => setCiudadFiltro(e.target.value)}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
            >
              <option value="">Todas las ciudades</option>
              {ciudades.map((ciudad) => (
                <option key={ciudad} value={ciudad}>
                  {ciudad}
                </option>
              ))}
            </select>

            <select
              value={ratingFiltro}
              onChange={(e) => setRatingFiltro(e.target.value)}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
            >
              <option value="">Todas las calificaciones</option>
              <option value="4.5">⭐ 4.5+</option>
              <option value="4.7">⭐ 4.7+</option>
              <option value="4.8">⭐ 4.8+</option>
            </select>

            <select
              value={modalidadFiltro}
              onChange={(e) => setModalidadFiltro(e.target.value)}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
            >
              <option value="">Todas las modalidades</option>
              <option value="presencial">Presencial</option>
              <option value="online">Online</option>
              <option value="ambas">Ambas</option>
            </select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setCiudadFiltro("");
                setPrecioFiltro("");
                setRatingFiltro("");
                setModalidadFiltro("");
                setBusqueda("");
              }}
              className="w-full"
            >
              Limpiar Filtros
            </Button>
          </div>

          {/* Indicador de gestión seleccionada */}
          {gestionSeleccionadaParam && (
            <div className="flex items-center gap-2 pt-2 border-t border-white/10">
              <Badge variant="accent">
                {
                  gestionesCompletas.find((g) => g.id === gestionSeleccionadaParam)
                    ?.titulo
                }
              </Badge>
              <Link href="/migraciones">
                <button className="text-xs text-white/60 hover:text-white">
                  ✕ Quitar filtro
                </button>
              </Link>
            </div>
          )}
        </div>
      </Card>

      {/* Listado de Especialistas */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-bold text-white">
            Especialistas en Gestiones Migratorias
          </h2>
          <span className="text-sm text-white/60">
            {especialistasFiltrados.length} especialista
            {especialistasFiltrados.length !== 1 ? "s" : ""}
          </span>
        </div>

        {especialistasFiltrados.length === 0 ? (
          <Card>
            <div className="text-center py-8">
              <p className="text-white/70">No se encontraron especialistas con estos filtros.</p>
              <Button
                variant="primary"
                className="mt-4"
                onClick={() => {
                  setCiudadFiltro("");
                  setRatingFiltro("");
                  setBusqueda("");
                }}
              >
                Limpiar Filtros
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {especialistasFiltrados.map((esp) => (
              <Card key={esp.id} hover>
                <div className="flex items-start gap-4">
                  {esp.avatar ? (
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full">
                      <Image
                        src={esp.avatar}
                        alt={esp.nombre}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                  ) : (
                    <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#C9A24D] to-[#C08457] text-lg font-bold text-black">
                      {esp.nombre
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#C9A24D] truncate">
                      {esp.nombre}
                    </h3>
                    <p className="text-sm text-white/70">{esp.titulo}</p>
                    <p className="text-xs text-white/60 mt-1">{esp.ciudad}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-sm text-[#C9A24D]">⭐ {esp.rating}</span>
                      <span className="text-xs text-white/50">•</span>
                      <span className="text-xs text-white/60">{esp.precio}</span>
                    </div>
                    {esp.especialidades && esp.especialidades.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {esp.especialidades.slice(0, 3).map((esp, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {esp}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Link href={`/profesionales/${esp.id}/chat`}>
                    <Button variant="primary" size="sm" className="flex-1 min-w-0">
                      {t.professionals.actionsChat}
                    </Button>
                  </Link>
                  <Link href={`/profesionales/${esp.id}`}>
                    <Button variant="outline" size="sm" className="flex-1 min-w-0">
                      {t.professionals.actionsViewProfile}
                    </Button>
                  </Link>
                  <Link href={`/profesionales/${esp.id}/reservar`}>
                    <Button variant="ghost" size="sm" className="flex-1 min-w-0">
                      {t.professionals.actionsBook}
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* ¿Qué podés gestionar? */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-bold text-white">
              ¿Qué podés gestionar?
            </h2>
            {!mostrarTodasGestiones && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMostrarTodasGestiones(true)}
              >
                Ver todas las gestiones →
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {gestionesParaMostrar.map((gestion) => (
              <button
                key={gestion.id}
                onClick={() => handleSeleccionarGestion(gestion.id)}
                className="text-left p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#C9A24D]/40 hover:bg-white/10 transition group"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{gestion.icono}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white group-hover:text-[#C9A24D] transition">
                      {gestion.titulo}
                    </h3>
                    <p className="text-xs text-white/60 mt-1">{gestion.descripcion}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {mostrarTodasGestiones && (
            <div className="pt-4 border-t border-white/10">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMostrarTodasGestiones(false)}
              >
                ← Ver menos
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Seguimiento y soporte */}
      <Card className="bg-gradient-to-r from-[#13253A] to-[#0E1B2A]">
        <div className="space-y-4">
          <h2 className="text-xl md:text-2xl font-bold text-white">
            Seguimiento y Soporte
          </h2>
          <div className="space-y-3 text-white/80">
            <div className="flex items-start gap-3">
              <span className="text-[#C9A24D] mt-1">✓</span>
              <p>
                Desde nuestra plataforma podés dar seguimiento a tus trámites migratorios en tiempo
                real.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#C9A24D] mt-1">✓</span>
              <p>
                Recibí actualizaciones automáticas sobre el estado de tu expediente y próximos
                pasos a seguir.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#C9A24D] mt-1">✓</span>
              <p>
                Comunicate directamente con tu especialista asignado a través del chat integrado.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#C9A24D] mt-1">✓</span>
              <p>
                Accedé a todos tus documentos y comprobantes desde tu panel de usuario.
              </p>
            </div>
          </div>
          <div className="pt-4">
            <Link href="/profesional/alta">
              <Button variant="primary">Contratar Servicio</Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
