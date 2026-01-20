"use client";

import Badge from "@/components/Badge";
import Button from "@/components/Button";
import { Case, CaseStatus, CasePriority } from "@/lib/cases";
import CaseStatusBadge from "./CaseStatusBadge";

interface CaseHeaderProps {
  caseData: Case;
  onStatusChange?: (status: CaseStatus) => void;
  showActions?: boolean;
}

export default function CaseHeader({ caseData, onStatusChange, showActions = true }: CaseHeaderProps) {
  const getPriorityColor = (priority: CasePriority) => {
    switch (priority) {
      case "urgente":
        return "bg-red-500/20 text-red-400 border-red-500/50";
      case "alta":
        return "bg-orange-500/20 text-orange-400 border-orange-500/50";
      case "media":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      case "baja":
        return "bg-blue-500/20 text-blue-400 border-blue-500/50";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-PY", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-4">
      {/* Número y badges */}
      <div className="flex items-center gap-3 flex-wrap">
        <p className="text-sm text-white/60 font-mono">{caseData.caseNumber}</p>
        <CaseStatusBadge status={caseData.status} />
        <Badge variant="outline" className={getPriorityColor(caseData.priority)}>
          {caseData.priority === "urgente" && "🔴"}
          {caseData.priority === "alta" && "🟠"}
          {caseData.priority === "media" && "🟡"}
          {caseData.priority === "baja" && "🔵"}
          {caseData.priority.toUpperCase()}
        </Badge>
      </div>

      {/* Título y descripción */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white">{caseData.title}</h1>
        {caseData.description && (
          <p className="mt-2 text-white/70 leading-relaxed">{caseData.description}</p>
        )}
      </div>

      {/* Tags */}
      {caseData.tags && caseData.tags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          {caseData.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Información adicional */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div>
          <span className="text-white/60">Creado:</span>
          <p className="text-white/80 mt-1">{formatDate(caseData.createdAt)}</p>
        </div>
        <div>
          <span className="text-white/60">Última actualización:</span>
          <p className="text-white/80 mt-1">{formatDate(caseData.updatedAt)}</p>
        </div>
        {caseData.closedAt && (
          <div>
            <span className="text-white/60">Cerrado:</span>
            <p className="text-white/80 mt-1">{formatDate(caseData.closedAt)}</p>
          </div>
        )}
      </div>

      {/* Alertas */}
      {caseData.alerts && caseData.alerts.length > 0 && (
        <div className="rounded-lg bg-yellow-500/10 border border-yellow-500/30 p-4">
          <p className="text-sm font-semibold text-yellow-400 mb-2">⚠️ Alertas Activas</p>
          <ul className="space-y-1">
            {caseData.alerts.map((alerta, index) => (
              <li key={index} className="text-sm text-white/80">
                • {alerta}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Acciones */}
      {showActions && onStatusChange && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
          {caseData.status !== "cerrado" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onStatusChange("cerrado")}
            >
              Cerrar Caso
            </Button>
          )}
          {caseData.status === "en-pausa" && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onStatusChange("activo")}
            >
              Reanudar
            </Button>
          )}
          {caseData.status === "activo" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onStatusChange("en-pausa")}
            >
              Pausar
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
