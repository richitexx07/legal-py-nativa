"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import { mockEspecializaciones } from "@/lib/educacion-data";

export default function EspecializacionesPage() {
  const [busqueda, setBusqueda] = useState("");
  const [areaFiltro, setAreaFiltro] = useState("");
  const [nivelFiltro, setNivelFiltro] = useState("");
  const [modalidadFiltro, setModalidadFiltro] = useState("");

  const areas = Array.from(new Set(mockEspecializaciones.map((e) => e.area))).sort();
  const niveles = ["Básico", "Intermedio", "Avanzado", "Especializado"];
  const modalidades = ["Online", "Presencial", "Híbrido"];

  const especializacionesFiltradas = useMemo(() => {
    return mockEspecializaciones.filter((esp) => {
      if (busqueda && !esp.titulo.toLowerCase().includes(busqueda.toLowerCase()) &&
          !esp.descripcion.toLowerCase().includes(busqueda.toLowerCase())) {
        return false;
      }
      if (areaFiltro && esp.area !== areaFiltro) return false;
      if (nivelFiltro && esp.nivel !== nivelFiltro) return false;
      if (modalidadFiltro && esp.modalidad !== modalidadFiltro) return false;
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
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
          Especializaciones Jurídicas
        </h1>
        <p className="text-white/70 max-w-3xl">
          Programas de especialización avanzada en diversas áreas del derecho. Paraguay e
          internacional.
        </p>
      </div>

      <Card>
        <div className="space-y-4">
          <div>
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar especializaciones..."
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

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-white">Catálogo de Especializaciones</h2>
          <span className="text-sm text-white/60">
            {especializacionesFiltradas.length} especializacion{especializacionesFiltradas.length !== 1 ? "es" : ""}
          </span>
        </div>

        {especializacionesFiltradas.length === 0 ? (
          <Card>
            <div className="text-center py-8">
              <p className="text-white/70 mb-4">No se encontraron especializaciones con estos filtros.</p>
              <Button variant="outline" onClick={limpiarFiltros}>
                Limpiar filtros
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {especializacionesFiltradas.map((esp) => (
              <Card key={esp.id} hover className="h-full flex flex-col">
                <div className="flex-1">
                  <div className="text-4xl mb-3">{esp.icono}</div>
                  <h3 className="font-semibold text-[#C9A24D] text-lg mb-2">{esp.titulo}</h3>
                  <p className="text-sm text-white/70 mb-4 line-clamp-2">{esp.descripcion}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline" className="text-xs">
                      {esp.area}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {esp.nivel}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {esp.modalidad}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm text-white/60 mb-4">
                    <div className="flex items-center gap-2">
                      <span>⏱️</span>
                      <span>{esp.duracion}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>💰</span>
                      <span className="font-semibold text-white">{esp.precio}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-white/60 mb-2">Objetivos:</p>
                    <ul className="space-y-1">
                      {esp.objetivos.slice(0, 2).map((obj, idx) => (
                        <li key={idx} className="text-xs text-white/70 flex items-start gap-1">
                          <span className="text-[#C9A24D] mt-1">•</span>
                          <span>{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <Button variant="primary" className="w-full" size="sm">
                    Ver detalles
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
