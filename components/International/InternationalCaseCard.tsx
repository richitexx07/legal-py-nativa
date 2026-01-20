"use client";

import Card from "@/components/Card";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import { InternationalCase } from "@/lib/international";
import Link from "next/link";

interface InternationalCaseCardProps {
  caseData: InternationalCase;
  onViewDetails?: () => void;
}

export default function InternationalCaseCard({
  caseData,
  onViewDetails,
}: InternationalCaseCardProps) {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "asignado_gep":
        return "accent";
      case "asignado_consorcio":
        return "outline";
      case "en_subasta":
        return "terracota";
      case "asignado_subasta":
        return "accent";
      case "rechazado":
        return "outline";
      default:
        return "outline";
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pendiente_revision: "Pendiente Revisión",
      en_embudo: "En Embudo",
      asignado_gep: "Asignado GEP Gold",
      asignado_consorcio: "Asignado Consorcio",
      en_subasta: "En Subasta",
      asignado_subasta: "Asignado por Subasta",
      rechazado: "Rechazado",
      completado: "Completado",
    };
    return labels[status] || status;
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "muy_alta":
        return "bg-red-500/20 text-red-400 border-red-500/50";
      case "alta":
        return "bg-orange-500/20 text-orange-400 border-orange-500/50";
      case "media":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      case "baja":
        return "bg-blue-500/20 text-blue-400 border-blue-500/50";
      default:
        return "";
    }
  };

  return (
    <Card hover>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <p className="text-xs text-white/60 font-mono">{caseData.caseNumber}</p>
              <Badge variant={getStatusColor(caseData.internationalStatus)} className="text-xs">
                {getStatusLabel(caseData.internationalStatus)}
              </Badge>
            </div>
            <h3 className="font-semibold text-[#C9A24D] text-lg">{caseData.title}</h3>
            {caseData.description && (
              <p className="text-sm text-white/70 mt-1 line-clamp-2">{caseData.description}</p>
            )}
          </div>
          <div className="text-right shrink-0">
            <p className="text-2xl font-bold text-[#C9A24D]">{formatAmount(caseData.estimatedAmount)}</p>
            <p className="text-xs text-white/60 mt-1">Monto estimado</p>
          </div>
        </div>

        {/* Info adicional */}
        <div className="grid grid-cols-2 gap-4 text-sm pt-3 border-t border-white/10">
          <div>
            <span className="text-white/60">Países:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {caseData.countriesInvolved.slice(0, 3).map((country) => (
                <Badge key={country} variant="outline" className="text-xs">
                  {country}
                </Badge>
              ))}
              {caseData.countriesInvolved.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{caseData.countriesInvolved.length - 3}
                </Badge>
              )}
            </div>
          </div>
          <div>
            <span className="text-white/60">Complejidad:</span>
            <Badge variant="outline" className={`mt-1 text-xs ${getComplexityColor(caseData.complexity)}`}>
              {caseData.complexity.replace("_", " ").toUpperCase()}
            </Badge>
          </div>
          {caseData.languagesRequired && caseData.languagesRequired.length > 0 && (
            <div>
              <span className="text-white/60">Idiomas:</span>
              <p className="text-white/80 mt-1">{caseData.languagesRequired.join(", ")}</p>
            </div>
          )}
          {caseData.urgency && caseData.urgency !== "normal" && (
            <div>
              <span className="text-white/60">Urgencia:</span>
              <Badge variant="terracota" className="mt-1 text-xs">
                {caseData.urgency.toUpperCase()}
              </Badge>
            </div>
          )}
        </div>

        {/* Estado del embudo */}
        {caseData.assignmentType && (
          <div className="pt-3 border-t border-white/10">
            <p className="text-xs text-white/60 mb-2">Estado del Embudo:</p>
            <div className="space-y-2">
              {caseData.assignmentType === "gep_gold" && (
                <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                  <span className="text-sm text-white/80">GEP Gold</span>
                  {caseData.gepGoldResponse && (
                    <Badge
                      variant={caseData.gepGoldResponse === "aceptado" ? "accent" : "outline"}
                      className="text-xs"
                    >
                      {caseData.gepGoldResponse === "aceptado" ? "✓ Aceptado" : "✗ Declinado"}
                    </Badge>
                  )}
                </div>
              )}
              {caseData.assignmentType === "consorcio" && (
                <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                  <span className="text-sm text-white/80">Top 5 Consorcios</span>
                  {caseData.top5ConsortiaResponses && (
                    <span className="text-xs text-white/60">
                      {Object.values(caseData.top5ConsortiaResponses).filter((r) => r === "aceptado").length} / 5
                    </span>
                  )}
                </div>
              )}
              {caseData.assignmentType === "subasta" && caseData.auctionActive && (
                <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                  <span className="text-sm text-white/80">Subasta Activa</span>
                  {caseData.auctionBids && (
                    <span className="text-xs text-white/60">
                      {caseData.auctionBids.length} ofertas
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Acciones */}
        <div className="flex gap-2 pt-2 border-t border-white/10">
          <Link href={`/casos/${caseData.id}`} className="flex-1">
            <Button variant="primary" size="sm" className="w-full">
              Ver Detalle
            </Button>
          </Link>
          {onViewDetails && (
            <Button variant="outline" size="sm" onClick={onViewDetails}>
              Embudo
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
