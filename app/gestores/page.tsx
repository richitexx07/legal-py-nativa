"use client";

import { useState } from "react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Badge from "@/components/Badge";

interface Gestor {
  id: string;
  nombre: string;
  rubro: string[];
  departamento: string;
  cobertura: string[];
  tiempoEstimado: string;
  precioBase: string;
  rating?: number;
}

const rubros = ["RUC", "Registros", "Municipal", "Migraciones", "Certificados"];

const departamentos = [
  "Todos",
  "Asunción",
  "Central",
  "Alto Paraná",
  "Itapúa",
  "Caaguazú",
  "San Pedro",
  "Paraguarí",
  "Cordillera",
  "Guairá",
];

const mockGestores: Gestor[] = [
  {
    id: "1",
    nombre: "Gestoría Central",
    rubro: ["RUC", "Registros", "Municipal"],
    departamento: "Asunción",
    cobertura: ["Asunción", "Gran Asunción"],
    tiempoEstimado: "24-48 horas",
    precioBase: "Gs. 100.000",
    rating: 4.7,
  },
  {
    id: "2",
    nombre: "Gestión Rápida",
    rubro: ["RUC", "Certificados"],
    departamento: "Central",
    cobertura: ["San Lorenzo", "Fernando de la Mora", "Luque"],
    tiempoEstimado: "24-72 horas",
    precioBase: "Gs. 120.000",
    rating: 4.6,
  },
  {
    id: "3",
    nombre: "Gestoría Legal Express",
    rubro: ["Migraciones", "Certificados"],
    departamento: "Asunción",
    cobertura: ["Asunción", "Central"],
    tiempoEstimado: "48-96 horas",
    precioBase: "Gs. 150.000",
    rating: 4.8,
  },
  {
    id: "4",
    nombre: "Servicios Municipales PY",
    rubro: ["Municipal", "Registros"],
    departamento: "Central",
    cobertura: ["San Lorenzo", "Lambaré", "Ñemby"],
    tiempoEstimado: "48-72 horas",
    precioBase: "Gs. 90.000",
    rating: 4.5,
  },
  {
    id: "5",
    nombre: "Gestoría Tributaria",
    rubro: ["RUC", "Registros"],
    departamento: "Alto Paraná",
    cobertura: ["Ciudad del Este", "Presidente Franco"],
    tiempoEstimado: "24-48 horas",
    precioBase: "Gs. 110.000",
    rating: 4.7,
  },
  {
    id: "6",
    nombre: "Trámites Migratorios Express",
    rubro: ["Migraciones"],
    departamento: "Asunción",
    cobertura: ["Asunción", "Nacional"],
    tiempoEstimado: "72-120 horas",
    precioBase: "Gs. 200.000",
    rating: 4.9,
  },
];

export default function Gestores() {
  const [rubroFiltro, setRubroFiltro] = useState<string>("Todos");
  const [departamentoFiltro, setDepartamentoFiltro] = useState<string>("Todos");
  const [showDelivery, setShowDelivery] = useState(false);

  const gestoresFiltrados = mockGestores.filter((gestor) => {
    const rubroMatch = rubroFiltro === "Todos" || gestor.rubro.includes(rubroFiltro);
    const deptoMatch =
      departamentoFiltro === "Todos" || gestor.departamento === departamentoFiltro;
    return rubroMatch && deptoMatch;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white">Gestores</h1>
        <p className="mt-2 text-white/70">
          Servicios de gestión documental por rubro y departamento. Incluye opción "delivery de
          documentos".
        </p>
      </div>

      {/* Filtros */}
      <div className="space-y-4">
        {/* Filtro por Rubro */}
        <div>
          <label className="mb-2 block text-sm font-medium text-white/80">Filtrar por rubro</label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setRubroFiltro("Todos")}
              className={`rounded-lg px-4 py-2 text-sm transition ${
                rubroFiltro === "Todos"
                  ? "bg-[#C9A24D] text-black font-semibold"
                  : "bg-white/10 text-white/80 hover:bg-white/15"
              }`}
            >
              Todos
            </button>
            {rubros.map((rubro) => (
              <button
                key={rubro}
                onClick={() => setRubroFiltro(rubro)}
                className={`rounded-lg px-4 py-2 text-sm transition ${
                  rubroFiltro === rubro
                    ? "bg-[#C9A24D] text-black font-semibold"
                    : "bg-white/10 text-white/80 hover:bg-white/15"
                }`}
              >
                {rubro}
              </button>
            ))}
          </div>
        </div>

        {/* Filtro por Departamento */}
        <div>
          <label className="mb-2 block text-sm font-medium text-white/80">
            Filtrar por departamento
          </label>
          <div className="flex flex-wrap gap-2">
            {departamentos.map((depto) => (
              <button
                key={depto}
                onClick={() => setDepartamentoFiltro(depto)}
                className={`rounded-lg px-4 py-2 text-sm transition ${
                  departamentoFiltro === depto
                    ? "bg-[#C08457] text-white font-semibold"
                    : "bg-white/10 text-white/80 hover:bg-white/15"
                }`}
              >
                {depto}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gestor Delivery */}
      <Card className="bg-gradient-to-br from-[#13253A] to-[#0E1B2A]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-xl font-bold text-white">Gestor Delivery</h2>
              <Badge variant="accent">Nuevo</Badge>
            </div>
            <p className="text-white/70 text-sm">
              Retiro y entrega de documentos con seguimiento en tiempo real. Servicio disponible en
              Asunción y Gran Asunción.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="primary"
              size="md"
              onClick={() => setShowDelivery(!showDelivery)}
            >
              {showDelivery ? "Ocultar" : "Ver Tracking"}
            </Button>
            <Button variant="outline" size="md">
              Solicitar Retiro
            </Button>
          </div>
        </div>

        {/* Tracking UI */}
        {showDelivery && (
          <div className="mt-6 space-y-4 pt-6 border-t border-white/10">
            <h3 className="font-semibold text-white">Seguimiento de Envío</h3>
            <div className="space-y-4">
              {/* Timeline de tracking */}
              <div className="relative space-y-4">
                {/* Estado 1: Completado */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C9A24D]">
                      <svg className="h-5 w-5 text-black" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="mt-2 h-12 w-0.5 bg-white/20"></div>
                  </div>
                  <div className="flex-1 pb-6">
                    <p className="text-sm font-medium text-white">Documento recibido</p>
                    <p className="text-xs text-white/60">13 de mayo, 10:30 AM</p>
                    <p className="text-xs text-white/50 mt-1">Asunción, Centro</p>
                  </div>
                </div>

                {/* Estado 2: En proceso */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C08457]">
                      <div className="h-4 w-4 rounded-full bg-white"></div>
                    </div>
                    <div className="mt-2 h-12 w-0.5 bg-white/20"></div>
                  </div>
                  <div className="flex-1 pb-6">
                    <p className="text-sm font-medium text-white">En trámite</p>
                    <p className="text-xs text-white/60">13 de mayo, 14:15 PM</p>
                    <p className="text-xs text-white/50 mt-1">Registro Público de Comercio</p>
                  </div>
                </div>

                {/* Estado 3: Pendiente */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#C9A24D] bg-transparent">
                      <div className="h-3 w-3 rounded-full bg-[#C9A24D]"></div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white/80">Entrega programada</p>
                    <p className="text-xs text-white/60">14 de mayo, 16:00 PM (estimado)</p>
                    <p className="text-xs text-white/50 mt-1">San Lorenzo, Oficina del cliente</p>
                  </div>
                </div>
              </div>

              {/* Info adicional */}
              <div className="rounded-lg bg-white/5 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">Código de seguimiento</span>
                  <span className="text-sm font-mono text-[#C9A24D]">GD-2024-001234</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/60">Estado actual</span>
                  <Badge variant="terracota">En trámite</Badge>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Listado de Gestores */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            Gestores disponibles ({gestoresFiltrados.length})
          </h2>
        </div>

        {gestoresFiltrados.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gestoresFiltrados.map((gestor) => (
              <Card key={gestor.id} hover>
                <div className="space-y-4">
                  {/* Header */}
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-[#C9A24D] text-lg">{gestor.nombre}</h3>
                      {gestor.rating && (
                        <div className="flex items-center gap-1">
                          <span className="text-sm text-[#C9A24D]">⭐ {gestor.rating}</span>
                        </div>
                      )}
                    </div>

                    {/* Rubros */}
                    <div className="flex flex-wrap gap-2 mb-2">
                      {gestor.rubro.map((r) => (
                        <Badge key={r} variant="outline">
                          {r}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
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
                      <span className="text-white/80">
                        <strong>Cobertura:</strong> {gestor.cobertura.join(", ")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
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
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-white/80">
                        <strong>Tiempo estimado:</strong> {gestor.tiempoEstimado}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
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
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-white/80">
                        <strong>Precio base:</strong>{" "}
                        <span className="text-[#C9A24D] font-semibold">{gestor.precioBase}</span>
                      </span>
                    </div>
                  </div>

                  {/* CTAs */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Button variant="primary" size="sm" className="flex-1 md:flex-none">
                      Solicitar gestor
                    </Button>
                    <Button variant="outline" size="sm">Cotizar</Button>
                    <Button variant="ghost" size="sm">Ver tracking</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <div className="text-center py-8">
              <p className="text-white/60">No se encontraron gestores con los filtros seleccionados.</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => {
                  setRubroFiltro("Todos");
                  setDepartamentoFiltro("Todos");
                }}
              >
                Limpiar filtros
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
