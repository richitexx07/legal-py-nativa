"use client";

import { useState } from "react";
import Link from "next/link";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import Snackbar from "@/components/Snackbar";

interface CasoExtendido {
  id: string;
  titulo: string;
  numero: string;
  estado: "activo" | "cerrado" | "en-pausa";
  ultimaActualizacion: string;
  descripcion?: string;
  profesionalId?: string;
  alertas?: string[];
}

const casosExtendidos: CasoExtendido[] = [
  {
    id: "1",
    titulo: "López vs. Empresa X",
    numero: "LPY-1042",
    estado: "activo",
    ultimaActualizacion: "Audiencia programada para el 20 de mayo",
    descripcion: "Caso de demanda laboral",
    profesionalId: "1",
    alertas: ["Audiencia próxima", "Documentos pendientes"],
  },
  {
    id: "2",
    titulo: "Expediente Juan Pérez",
    numero: "LPY-2109",
    estado: "activo",
    ultimaActualizacion: "Documentos pendientes de revisión",
    descripcion: "Trámite de constitución de sociedad",
    alertas: ["Falta firma de poder"],
  },
  {
    id: "3",
    titulo: "Demanda Civil - Contrato",
    numero: "LPY-3056",
    estado: "en-pausa",
    ultimaActualizacion: "Esperando respuesta de la contraparte",
    descripcion: "Demanda por incumplimiento de contrato",
    alertas: [],
  },
  {
    id: "4",
    titulo: "Proceso Penal - Robo",
    numero: "LPY-4123",
    estado: "activo",
    ultimaActualizacion: "Nueva providencia registrada",
    descripcion: "Caso penal en investigación",
    profesionalId: "1",
    alertas: ["Plazo de respuesta vence en 3 días"],
  },
];

export default function Casos() {
  const [snackbar, setSnackbar] = useState<{
    isOpen: boolean;
    message: string;
    type: "success" | "error" | "info" | "warning";
  }>({
    isOpen: false,
    message: "",
    type: "info",
  });

  const handleActivarAlertas = (caso: CasoExtendido) => {
    setSnackbar({
      isOpen: true,
      message: `Alertas activadas para ${caso.titulo}`,
      type: "success",
    });
  };

  const getEstadoColor = (estado: CasoExtendido["estado"]) => {
    switch (estado) {
      case "activo":
        return "accent";
      case "en-pausa":
        return "terracota";
      case "cerrado":
        return "outline";
      default:
        return "outline";
    }
  };

  const getEstadoLabel = (estado: CasoExtendido["estado"]) => {
    switch (estado) {
      case "activo":
        return "En curso";
      case "en-pausa":
        return "En pausa";
      case "cerrado":
        return "Cerrado";
      default:
        return estado;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white">Casos y Seguimiento</h1>
        <p className="mt-2 text-white/70">
          Dashboard de casos: timeline, alertas y estado de expedientes (demo).
        </p>
      </div>

      {/* Stats rápidos */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-[#C9A24D]">
              {casosExtendidos.filter((c) => c.estado === "activo").length}
            </p>
            <p className="text-sm text-white/70 mt-1">Activos</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-[#C08457]">
              {casosExtendidos.filter((c) => c.estado === "en-pausa").length}
            </p>
            <p className="text-sm text-white/70 mt-1">En pausa</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-white/60">
              {casosExtendidos.filter((c) => c.estado === "cerrado").length}
            </p>
            <p className="text-sm text-white/70 mt-1">Cerrados</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">
              {casosExtendidos.reduce((acc, c) => acc + (c.alertas?.length || 0), 0)}
            </p>
            <p className="text-sm text-white/70 mt-1">Alertas</p>
          </div>
        </Card>
      </div>

      {/* Listado de Casos */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Mis Casos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {casosExtendidos.map((caso) => (
            <Card key={caso.id} hover>
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white/60 font-mono">{caso.numero}</p>
                    <h3 className="mt-1 font-semibold text-[#C9A24D] text-lg truncate">
                      {caso.titulo}
                    </h3>
                    {caso.descripcion && (
                      <p className="text-sm text-white/70 mt-1">{caso.descripcion}</p>
                    )}
                  </div>
                  <Badge variant={getEstadoColor(caso.estado)} className="shrink-0">
                    {getEstadoLabel(caso.estado)}
                  </Badge>
                </div>

                {/* Último movimiento */}
                <div className="rounded-lg bg-white/5 p-3">
                  <p className="text-xs text-white/60 mb-1">Último movimiento</p>
                  <p className="text-sm text-white/80">{caso.ultimaActualizacion}</p>
                </div>

                {/* Alertas */}
                {caso.alertas && caso.alertas.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs text-white/60">Alertas:</p>
                    <div className="flex flex-wrap gap-2">
                      {caso.alertas.map((alerta, idx) => (
                        <Badge key={idx} variant="terracota" className="text-xs">
                          ⚠️ {alerta}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTAs */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
                  <Link href={`/casos/${caso.id}`} className="flex-1 md:flex-none">
                    <Button variant="primary" size="sm" className="w-full">
                      Ver Detalle
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSnackbar({
                        isOpen: true,
                        message: "Funcionalidad de subida de documentos (demo)",
                        type: "info",
                      });
                    }}
                  >
                    Subir doc
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleActivarAlertas(caso)}
                  >
                    Alertas
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Snackbar */}
      <Snackbar
        message={snackbar.message}
        type={snackbar.type}
        isOpen={snackbar.isOpen}
        onClose={() => setSnackbar({ ...snackbar, isOpen: false })}
      />
    </div>
  );
}
