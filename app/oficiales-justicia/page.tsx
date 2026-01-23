"use client";

import { useState } from "react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import { mockOficialesJusticia } from "@/lib/mock-data";

interface OficialJusticia {
  id: string;
  nombre: string;
  ciudad: string;
  rating: number;
  servicios: string[];
  precio: string;
  disponibilidad: "Disponible" | "Ocupado" | "Fuera de servicio";
  zona: string[];
  evidencia: ("acuse" | "foto" | "geotag")[];
}

interface Diligencia {
  id: string;
  tipo: string;
  domicilio: string;
  fecha: string;
  estado: "Pendiente" | "En camino" | "Entregado" | "Evidencia";
  oficialJusticiaId?: string;
}

const tiposDiligencia = [
  "Notificación judicial",
  "Diligenciamiento",
  "Constancia",
  "Embargo",
  "Medida cautelar",
  "Citación",
];

const oficialesExtendidos: OficialJusticia[] = [
  {
    id: "1",
    nombre: "Oficialía Legal Express",
    ciudad: "Asunción",
    rating: 4.8,
    servicios: ["Notificaciones", "Diligencias", "Constancias"],
    precio: "desde Gs. 80.000",
    disponibilidad: "Disponible",
    zona: ["Asunción", "San Lorenzo", "Fernando de la Mora"],
    evidencia: ["acuse", "foto", "geotag"],
  },
  {
    id: "2",
    nombre: "Servicios Judiciales PY",
    ciudad: "Luque",
    rating: 4.7,
    servicios: ["Notificaciones", "Embargos", "Medidas Cautelares"],
    precio: "desde Gs. 90.000",
    disponibilidad: "Disponible",
    zona: ["Luque", "Mariano Roque Alonso", "Areguá"],
    evidencia: ["acuse", "geotag"],
  },
  {
    id: "3",
    nombre: "Notificaciones Express",
    ciudad: "CDE",
    rating: 4.9,
    servicios: ["Notificaciones", "Diligencias"],
    precio: "desde Gs. 85.000",
    disponibilidad: "Ocupado",
    zona: ["Ciudad del Este", "Presidente Franco"],
    evidencia: ["acuse", "foto", "geotag"],
  },
  {
    id: "4",
    nombre: "Oficialía Central",
    ciudad: "Asunción",
    rating: 4.6,
    servicios: ["Notificaciones", "Constancias"],
    precio: "desde Gs. 75.000",
    disponibilidad: "Disponible",
    zona: ["Asunción Centro", "Villa Morra", "Sajonia"],
    evidencia: ["acuse", "foto"],
  },
];

const mockDiligencias: Diligencia[] = [
  {
    id: "1",
    tipo: "Notificación judicial",
    domicilio: "Av. Mariscal López 1234, Asunción",
    fecha: "2024-05-15",
    estado: "Evidencia",
    oficialJusticiaId: "1",
  },
  {
    id: "2",
    tipo: "Diligenciamiento",
    domicilio: "Calle Palma 567, San Lorenzo",
    fecha: "2024-05-16",
    estado: "En camino",
    oficialJusticiaId: "2",
  },
  {
    id: "3",
    tipo: "Constancia",
    domicilio: "Av. España 890, Fernando de la Mora",
    fecha: "2024-05-17",
    estado: "Pendiente",
  },
];

export default function OficialesJusticia() {
  const [showForm, setShowForm] = useState(false);
  const [showCourier, setShowCourier] = useState(false);
  const [formData, setFormData] = useState({
    tipo: "",
    domicilio: "",
    fecha: "",
    notas: "",
  });
  const [diligencias, setDiligencias] = useState<Diligencia[]>(mockDiligencias);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nuevaDiligencia: Diligencia = {
      id: Date.now().toString(),
      tipo: formData.tipo,
      domicilio: formData.domicilio,
      fecha: formData.fecha,
      estado: "Pendiente",
    };
    setDiligencias([...diligencias, nuevaDiligencia]);
    setFormData({ tipo: "", domicilio: "", fecha: "", notas: "" });
    setShowForm(false);
    alert("Solicitud de diligencia creada (demo)");
  };

  const getEstadoColor = (estado: Diligencia["estado"]) => {
    switch (estado) {
      case "Pendiente":
        return "outline";
      case "En camino":
        return "terracota";
      case "Entregado":
        return "accent";
      case "Evidencia":
        return "accent";
      default:
        return "outline";
    }
  };

  const getDisponibilidadColor = (disponibilidad: OficialJusticia["disponibilidad"]) => {
    switch (disponibilidad) {
      case "Disponible":
        return "accent";
      case "Ocupado":
        return "terracota";
      case "Fuera de servicio":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white">Oficiales de Justicia / Notificadores</h1>
        <p className="mt-2 text-white/70">
          Envío y diligenciamiento con evidencia: acuse de recibo, geolocalización y registro de
          entrega.
        </p>
      </div>

      {/* Formulario de Solicitud */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Solicitar Diligencia</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Ocultar" : "Nueva Solicitud"}
          </Button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-white/10">
            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">
                Tipo de diligencia
              </label>
              <select
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                required
                className="w-full rounded-lg bg-white/10 px-4 py-2 text-white outline-none ring-1 ring-white/10 focus:ring-[#C9A24D]/60"
              >
                <option value="">Seleccionar tipo</option>
                {tiposDiligencia.map((tipo) => (
                  <option key={tipo} value={tipo} className="bg-[#13253A]">
                    {tipo}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">Domicilio</label>
              <input
                type="text"
                value={formData.domicilio}
                onChange={(e) => setFormData({ ...formData, domicilio: e.target.value })}
                required
                placeholder="Dirección completa"
                className="w-full rounded-lg bg-white/10 px-4 py-2 text-white placeholder-white/50 outline-none ring-1 ring-white/10 focus:ring-[#C9A24D]/60"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">Fecha</label>
              <input
                type="date"
                value={formData.fecha}
                onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                required
                min={new Date().toISOString().split("T")[0]}
                className="w-full rounded-lg bg-white/10 px-4 py-2 text-white outline-none ring-1 ring-white/10 focus:ring-[#C9A24D]/60"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">Notas adicionales</label>
              <textarea
                value={formData.notas}
                onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                placeholder="Información adicional sobre la diligencia..."
                rows={3}
                className="w-full rounded-lg bg-white/10 px-4 py-2 text-white placeholder-white/50 outline-none ring-1 ring-white/10 focus:ring-[#C9A24D]/60 resize-none"
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" variant="primary" size="md" className="flex-1">
                Crear Solicitud
              </Button>
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => {
                  setShowForm(false);
                  setFormData({ tipo: "", domicilio: "", fecha: "", notas: "" });
                }}
              >
                Cancelar
              </Button>
            </div>
          </form>
        )}
      </Card>

      {/* Estado de Diligencias */}
      {diligencias.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Estado de Diligencias</h2>
          <div className="space-y-3">
            {diligencias.map((diligencia) => (
              <Card key={diligencia.id}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-white">{diligencia.tipo}</h3>
                      <Badge variant={getEstadoColor(diligencia.estado)}>{diligencia.estado}</Badge>
                    </div>
                    <p className="text-sm text-white/70">
                      <strong>Domicilio:</strong> {diligencia.domicilio}
                    </p>
                    <p className="text-sm text-white/60">
                      <strong>Fecha:</strong> {diligencia.fecha}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {/* Timeline visual simplificado */}
                    <div className="flex items-center gap-1">
                      <div
                        className={`h-3 w-3 rounded-full ${
                          diligencia.estado === "Pendiente" ||
                          diligencia.estado === "En camino" ||
                          diligencia.estado === "Entregado" ||
                          diligencia.estado === "Evidencia"
                            ? "bg-[#C9A24D]"
                            : "bg-white/20"
                        }`}
                      />
                      <div
                        className={`h-0.5 w-4 ${
                          diligencia.estado === "En camino" ||
                          diligencia.estado === "Entregado" ||
                          diligencia.estado === "Evidencia"
                            ? "bg-[#C9A24D]"
                            : "bg-white/20"
                        }`}
                      />
                      <div
                        className={`h-3 w-3 rounded-full ${
                          diligencia.estado === "En camino" ||
                          diligencia.estado === "Entregado" ||
                          diligencia.estado === "Evidencia"
                            ? "bg-[#C08457]"
                            : "bg-white/20"
                        }`}
                      />
                      <div
                        className={`h-0.5 w-4 ${
                          diligencia.estado === "Entregado" || diligencia.estado === "Evidencia"
                            ? "bg-[#C9A24D]"
                            : "bg-white/20"
                        }`}
                      />
                      <div
                        className={`h-3 w-3 rounded-full ${
                          diligencia.estado === "Entregado" || diligencia.estado === "Evidencia"
                            ? "bg-[#C9A24D]"
                            : "bg-white/20"
                        }`}
                      />
                      <div
                        className={`h-0.5 w-4 ${
                          diligencia.estado === "Evidencia" ? "bg-[#C9A24D]" : "bg-white/20"
                        }`}
                      />
                      <div
                        className={`h-3 w-3 rounded-full ${
                          diligencia.estado === "Evidencia" ? "bg-[#C9A24D]" : "bg-white/20"
                        }`}
                      />
                    </div>
                    {diligencia.estado === "Evidencia" && (
                      <Button variant="outline" size="sm">
                        Ver evidencia
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Listado de Oficiales de Justicia */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Oficiales de Justicia Disponibles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {oficialesExtendidos.map((oficial) => (
            <Card key={oficial.id} hover>
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#C9A24D] text-lg">{oficial.nombre}</h3>
                    <p className="text-sm text-white/70">{oficial.ciudad}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-sm text-[#C9A24D]">⭐ {oficial.rating}</span>
                    </div>
                    <Badge variant={getDisponibilidadColor(oficial.disponibilidad)}>
                      {oficial.disponibilidad}
                    </Badge>
                  </div>
                </div>

                {/* Servicios */}
                <div>
                  <p className="text-xs text-white/60 mb-2">Servicios:</p>
                  <div className="flex flex-wrap gap-2">
                    {oficial.servicios.map((servicio) => (
                      <Badge key={servicio} variant="outline">
                        {servicio}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Zona */}
                <div>
                  <p className="text-xs text-white/60 mb-1">Zona de cobertura:</p>
                  <p className="text-sm text-white/80">{oficial.zona.join(", ")}</p>
                </div>

                {/* Evidencia soportada */}
                <div>
                  <p className="text-xs text-white/60 mb-2">Evidencia soportada:</p>
                  <div className="flex flex-wrap gap-2">
                    {oficial.evidencia.includes("acuse") && (
                      <Badge variant="accent" className="text-xs">
                        📄 Acuse
                      </Badge>
                    )}
                    {oficial.evidencia.includes("foto") && (
                      <Badge variant="accent" className="text-xs">
                        📷 Foto
                      </Badge>
                    )}
                    {oficial.evidencia.includes("geotag") && (
                      <Badge variant="accent" className="text-xs">
                        📍 Geotag
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Precio */}
                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <span className="text-sm text-white/80">
                    <strong>Precio:</strong>{" "}
                    <span className="text-[#C9A24D] font-semibold">{oficial.precio}</span>
                  </span>
                </div>

                {/* CTAs */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <Button variant="primary" size="sm" className="flex-1 md:flex-none">
                    Solicitar notificación
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCourier(!showCourier)}
                  >
                    Integrar courier
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Integración con Courier */}
      {showCourier && (
        <Card className="bg-gradient-to-br from-[#13253A] to-[#0E1B2A]">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Integración con Courier</h2>
                <p className="text-sm text-white/70 mt-1">
                  Conecta el servicio de oficialía de justicia con courier para envío/retiro de documentos
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowCourier(false)}>
                ✕
              </Button>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/10">
              {/* Guía conceptual */}
              <div className="space-y-3">
                <h3 className="font-semibold text-white">¿Cómo funciona?</h3>
                <div className="space-y-2 text-sm text-white/80">
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#C9A24D] text-xs font-bold text-black">
                      1
                    </div>
                    <p>
                      El oficial de justicia realiza la diligencia y genera evidencia (acuse, foto, geotag)
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#C9A24D] text-xs font-bold text-black">
                      2
                    </div>
                    <p>
                      El sistema crea automáticamente un enlace con el servicio de courier
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#C9A24D] text-xs font-bold text-black">
                      3
                    </div>
                    <p>
                      El courier retira los documentos del oficial de justicia y los entrega al destinatario
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#C9A24D] text-xs font-bold text-black">
                      4
                    </div>
                    <p>
                      Seguimiento unificado: diligencia + envío en una sola plataforma
                    </p>
                  </div>
                </div>
              </div>

              {/* Opciones de integración */}
              <div className="rounded-lg bg-white/5 p-4 space-y-3">
                <h4 className="font-semibold text-white">Opciones de integración</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm text-white/80">
                      Crear enlace automático después de diligencia completada
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm text-white/80">
                      Notificar al courier cuando la evidencia esté lista
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm text-white/80">
                      Compartir geolocalización con courier para retiro
                    </span>
                  </label>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex gap-2">
                <Button variant="primary" size="md" className="flex-1">
                  Configurar Integración (Demo)
                </Button>
                <Button variant="outline" size="md">
                  Ver Documentación
                </Button>
              </div>

              {/* Nota */}
              <div className="rounded-lg border border-[#C9A24D]/40 bg-[#C9A24D]/10 p-3">
                <p className="text-xs text-white/70">
                  <strong>Nota:</strong> Esta es una integración conceptual. En producción, se
                  requeriría una API real para conectar con servicios de courier externos.
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
