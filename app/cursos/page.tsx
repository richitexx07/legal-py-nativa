"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Card from "@/components/Card";
import CourseCard from "@/components/CourseCard";
import Button from "@/components/Button";
import { mockCursos } from "@/lib/educacion-data";

export default function CursosPage() {
  const [busqueda, setBusqueda] = useState("");
  const [areaFiltro, setAreaFiltro] = useState("");
  const [nivelFiltro, setNivelFiltro] = useState("");
  const [modalidadFiltro, setModalidadFiltro] = useState("");

  const areas = Array.from(new Set(mockCursos.map((c) => c.area))).sort();
  const niveles = ["Básico", "Intermedio", "Avanzado"];
  const modalidades = ["Online", "Presencial", "Híbrido"];

  const cursosFiltrados = useMemo(() => {
    return mockCursos.filter((curso) => {
      if (busqueda && !curso.titulo.toLowerCase().includes(busqueda.toLowerCase()) &&
          !curso.descripcion.toLowerCase().includes(busqueda.toLowerCase())) {
        return false;
      }
      if (areaFiltro && curso.area !== areaFiltro) return false;
      if (nivelFiltro && curso.nivel !== nivelFiltro) return false;
      if (modalidadFiltro && curso.modalidad !== modalidadFiltro) return false;
      return true;
    });
  }, [busqueda, areaFiltro, nivelFiltro, modalidadFiltro]);

  const limpiarFiltros = () => {
    setBusqueda("");
    setAreaFiltro("");
    setNivelFiltro("");
    setModalidadFiltro("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
          Cursos y Capacitación
        </h1>
        <p className="text-white/70 max-w-3xl">
          Capacitación especializada para profesionales del derecho. Cursos prácticos, actualizados
          y con certificación.
        </p>
      </div>

      {/* Buscador y Filtros */}
      <Card>
        <div className="space-y-4">
          <div>
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar cursos por nombre o descripción..."
              className="w-full px-4 py-2 rounded-xl bg-[#13253A] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <select
              value={areaFiltro}
              onChange={(e) => setAreaFiltro(e.target.value)}
              className="px-4 py-2 rounded-xl bg-[#13253A] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
              style={{ colorScheme: 'dark' }}
            >
              <option value="" className="bg-[#13253A] text-white">Todas las áreas</option>
              {areas.map((area) => (
                <option key={area} value={area} className="bg-[#13253A] text-white">
                  {area}
                </option>
              ))}
            </select>

            <select
              value={nivelFiltro}
              onChange={(e) => setNivelFiltro(e.target.value)}
              className="px-4 py-2 rounded-xl bg-[#13253A] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
              style={{ colorScheme: 'dark' }}
            >
              <option value="" className="bg-[#13253A] text-white">Todos los niveles</option>
              {niveles.map((nivel) => (
                <option key={nivel} value={nivel} className="bg-[#13253A] text-white">
                  {nivel}
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
              {modalidades.map((modalidad) => (
                <option key={modalidad} value={modalidad} className="bg-[#13253A] text-white">
                  {modalidad}
                </option>
              ))}
            </select>
          </div>

          {(busqueda || areaFiltro || nivelFiltro || modalidadFiltro) && (
            <div className="pt-2">
              <Button variant="outline" size="sm" onClick={limpiarFiltros}>
                Limpiar filtros
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Listado de Cursos */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-white">
            Catálogo de Cursos
          </h2>
          <span className="text-sm text-white/60">
            {cursosFiltrados.length} curso{cursosFiltrados.length !== 1 ? "s" : ""}
          </span>
        </div>

        {cursosFiltrados.length === 0 ? (
          <Card>
            <div className="text-center py-8">
              <p className="text-white/70 mb-4">No se encontraron cursos con estos filtros.</p>
              <Button variant="outline" onClick={limpiarFiltros}>
                Limpiar filtros
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cursosFiltrados.map((curso) => (
              <CourseCard key={curso.id} curso={curso} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
