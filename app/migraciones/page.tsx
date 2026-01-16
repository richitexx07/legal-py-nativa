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
    id: "asesoramiento-residencia-temporaria",
    titulo: "Asesoramiento para Residencia Temporal",
    descripcion: "Orientación y acompañamiento para obtener residencia temporal",
    icono: "📅",
  },
  {
    id: "asesoramiento-residencia-permanente",
    titulo: "Asesoramiento para Residencia Permanente",
    descripcion: "Orientación y acompañamiento para residencia permanente",
    icono: "🏠",
  },
  {
    id: "renovacion-actualizacion-residencia",
    titulo: "Renovación / Actualización de Residencia",
    descripcion: "Gestión para renovar o actualizar tu residencia vigente",
    icono: "🔄",
  },
  {
    id: "cedula-extranjeros",
    titulo: "Cédula de Identidad para Extranjeros",
    descripcion: "Tramitación y acompañamiento para obtener cédula paraguaya",
    icono: "🆔",
  },
  {
    id: "cambio-categoria-migratoria",
    titulo: "Cambios de Categoría Migratoria",
    descripcion: "Orientación y gestión para cambios de categoría migratoria",
    icono: "🔄",
  },
  {
    id: "regularizacion-migratoria",
    titulo: "Regularización Migratoria",
    descripcion: "Orientación, preparación y acompañamiento para regularizar tu situación",
    icono: "✅",
  },
  {
    id: "reagrupacion-familiar",
    titulo: "Reagrupación Familiar",
    descripcion: "Orientación y preparación de documentos para reagrupación familiar",
    icono: "👨‍👩‍👧‍👦",
  },
  {
    id: "preparacion-revision-carpeta",
    titulo: "Preparación y Revisión de Carpeta",
    descripcion: "Checklist, validación y armado completo de documentación",
    icono: "📁",
  },
  {
    id: "gestion-antecedentes-apostillas",
    titulo: "Gestión de Antecedentes, Legalizaciones y Apostillas",
    descripcion: "Orientación y coordinación para obtener y legalizar documentos",
    icono: "📄",
  },
  {
    id: "turnos-acompanamiento",
    titulo: "Turnos y Acompañamiento en Trámites",
    descripcion: "Gestión de turnos y acompañamiento presencial u online",
    icono: "📋",
  },
  {
    id: "seguimiento-expediente",
    titulo: "Seguimiento de Expediente / Estado de Trámite",
    descripcion: "Actualizaciones dentro del sitio sobre el estado de tu trámite",
    icono: "📊",
  },
  {
    id: "atencion-soporte",
    titulo: "Atención y Soporte durante el Proceso",
    descripcion: "Chat, recordatorios y guía sobre próximos pasos",
    icono: "💬",
  },
  {
    id: "actualizacion-datos",
    titulo: "Actualización de Datos del Solicitante",
    descripcion: "Gestión para actualizar datos según requisitos del trámite",
    icono: "✏️",
  },
  {
    id: "orientacion-ingreso-permanencia",
    titulo: "Orientación para Ingreso y Permanencia Legal",
    descripcion: "Información completa y pasos para ingreso y permanencia legal en Paraguay",
    icono: "🗺️",
  },
];

export default function GestionesMigratorias() {
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const gestionSeleccionadaParam = searchParams.get("gestion");

  // Estados para filtros
  const [ciudadFiltro, setCiudadFiltro] = useState<string>("");
  const [idiomaFiltro, setIdiomaFiltro] = useState<string>("");
  const [precioFiltro, setPrecioFiltro] = useState<string>("");
  const [ratingFiltro, setRatingFiltro] = useState<string>("");
  const [modalidadFiltro, setModalidadFiltro] = useState<string>("");
  const [tipoGestionFiltro, setTipoGestionFiltro] = useState<string>("");
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

      // Filtro por idioma
      if (idiomaFiltro && esp.idiomas && !esp.idiomas.includes(idiomaFiltro)) {
        return false;
      }

      // Filtro por rating
      if (ratingFiltro) {
        const minRating = parseFloat(ratingFiltro);
        if (esp.rating < minRating) return false;
      }

      // Filtro por precio
      if (precioFiltro) {
        const precioNumero = parseInt(esp.precio.replace(/\D/g, ""));
        const precioMin = parseInt(precioFiltro.replace(/\D/g, ""));
        if (precioNumero < precioMin) return false;
      }

      // Filtro por tipo de gestión
      if (tipoGestionFiltro) {
        const gestion = gestionesCompletas.find((g) => g.id === tipoGestionFiltro);
        if (gestion) {
          const tieneGestion =
            esp.especialidades?.some((e) =>
              e.toLowerCase().includes(gestion.titulo.toLowerCase().split(" ")[0])
            ) || false;
          if (!tieneGestion) return false;
        }
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
      if (gestionSeleccionadaParam && !tipoGestionFiltro) {
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
    idiomaFiltro,
    precioFiltro,
    ratingFiltro,
    tipoGestionFiltro,
    busqueda,
    gestionSeleccionadaParam,
  ]);

  const ciudades = Array.from(
    new Set(especialistas.map((e) => e.ciudad))
  ).sort();

  const idiomasDisponibles = Array.from(
    new Set(especialistas.flatMap((e) => e.idiomas || []))
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
                pertenecemos a la Dirección General de Migraciones. La aprobación final y decisiones
                dependen de las autoridades competentes.
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <select
              value={ciudadFiltro}
              onChange={(e) => setCiudadFiltro(e.target.value)}
              className="px-4 py-2 rounded-xl bg-[#13253A] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
              style={{ colorScheme: 'dark' }}
            >
              <option value="" className="bg-[#13253A] text-white">Todas las ciudades</option>
              {ciudades.map((ciudad) => (
                <option key={ciudad} value={ciudad} className="bg-[#13253A] text-white">
                  {ciudad}
                </option>
              ))}
            </select>

            <select
              value={idiomaFiltro}
              onChange={(e) => setIdiomaFiltro(e.target.value)}
              className="px-4 py-2 rounded-xl bg-[#13253A] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
              style={{ colorScheme: 'dark' }}
            >
              <option value="" className="bg-[#13253A] text-white">Todos los idiomas</option>
              {idiomasDisponibles.map((idioma) => (
                <option key={idioma} value={idioma} className="bg-[#13253A] text-white">
                  {idioma}
                </option>
              ))}
            </select>

            <select
              value={modalidadFiltro}
              onChange={(e) => setModalidadFiltro(e.target.value)}
              className="px-4 py-2 rounded-xl bg-[#13253A] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
              style={{ colorScheme: 'dark' }}
            >
              <option value="" className="bg-[#13253A] text-white">Todas las modalidades</option>
              <option value="presencial" className="bg-[#13253A] text-white">Presencial</option>
              <option value="online" className="bg-[#13253A] text-white">Online</option>
              <option value="ambas" className="bg-[#13253A] text-white">Ambas</option>
            </select>

            <select
              value={tipoGestionFiltro}
              onChange={(e) => setTipoGestionFiltro(e.target.value)}
              className="px-4 py-2 rounded-xl bg-[#13253A] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
              style={{ colorScheme: 'dark' }}
            >
              <option value="" className="bg-[#13253A] text-white">Todos los tipos de gestión</option>
              {gestionesCompletas.map((gestion) => (
                <option key={gestion.id} value={gestion.id} className="bg-[#13253A] text-white">
                  {gestion.titulo}
                </option>
              ))}
            </select>

            <select
              value={precioFiltro}
              onChange={(e) => setPrecioFiltro(e.target.value)}
              className="px-4 py-2 rounded-xl bg-[#13253A] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
              style={{ colorScheme: 'dark' }}
            >
              <option value="" className="bg-[#13253A] text-white">Cualquier precio</option>
              <option value="100000" className="bg-[#13253A] text-white">Desde Gs. 100.000</option>
              <option value="150000" className="bg-[#13253A] text-white">Desde Gs. 150.000</option>
              <option value="200000" className="bg-[#13253A] text-white">Desde Gs. 200.000</option>
              <option value="300000" className="bg-[#13253A] text-white">Desde Gs. 300.000</option>
            </select>

            <select
              value={ratingFiltro}
              onChange={(e) => setRatingFiltro(e.target.value)}
              className="px-4 py-2 rounded-xl bg-[#13253A] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
              style={{ colorScheme: 'dark' }}
            >
              <option value="" className="bg-[#13253A] text-white">Todas las calificaciones</option>
              <option value="4.5" className="bg-[#13253A] text-white">⭐ 4.5+</option>
              <option value="4.7" className="bg-[#13253A] text-white">⭐ 4.7+</option>
              <option value="4.8" className="bg-[#13253A] text-white">⭐ 4.8+</option>
            </select>
          </div>

          {/* Botón limpiar filtros */}
          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setCiudadFiltro("");
                setIdiomaFiltro("");
                setPrecioFiltro("");
                setRatingFiltro("");
                setModalidadFiltro("");
                setTipoGestionFiltro("");
                setBusqueda("");
              }}
            >
              Limpiar Todos los Filtros
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
          <p className="text-white/80 leading-relaxed">
            Desde Legal PY podés cargar tus documentos, ver el checklist, recibir recordatorios,
            chatear con tu especialista y hacer seguimiento del estado del trámite. El especialista
            te informa avances, observaciones y próximos pasos.
          </p>
          <div className="pt-4">
            <Link href="/profesional/alta">
              <Button variant="primary">Contratar Servicio</Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* Disclaimer al pie */}
      <Card className="bg-[#C08457]/10 border-[#C08457]/30">
        <div className="flex items-start gap-3">
          <div className="text-xl">ℹ️</div>
          <div>
            <p className="text-xs text-white/70 leading-relaxed">
              <strong>Servicio privado de gestoría y acompañamiento.</strong> No somos un organismo
              público ni pertenecemos a la Dirección General de Migraciones. La aprobación final y
              decisiones dependen de las autoridades competentes.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
