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
      case "en_evaluacion_gep":
        return "terracota";
      case "asignado_consorcio_tier_premium":
        return "accent";
      case "asignado_consorcio_tier_standard":
        return "outline";
      case "asignado_consorcio":
        return "outline"; // Legacy
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
      en_evaluacion_gep: "⭐ Evaluación GEP",
      asignado_gep: "Asignado GEP Gold",
      asignado_consorcio_tier_premium: "🏆 Asignado Tier Premium",
      asignado_consorcio_tier_standard: "📋 Asignado Tier Standard",
      asignado_consorcio: "Asignado Consorcio", // Legacy
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

        {/* Estado de derivación técnica */}
        {caseData.derivationStatus && (
          <div className="pt-3 border-t border-white/10">
            <p className="text-xs text-white/60 mb-2">Estado de Derivación:</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                <span className="text-sm text-white/80">
                  {caseData.derivationStatus.estado === "en_evaluacion_gep" 
                    ? "⭐ Evaluación Prioritaria GEP"
                    : caseData.derivationStatus.estado === "derivado_gep"
                    ? "✓ Derivado a GEP Gold"
                    : caseData.derivationStatus.estado === "derivado_tier_premium"
                    ? "🏆 Derivado Tier Premium"
                    : caseData.derivationStatus.estado === "derivado_tier_standard"
                    ? "📋 Derivado Tier Standard"
                    : "Pendiente"}
                </span>
                {caseData.gepGoldResponse && caseData.assignmentType === "gep_gold" && (
                  <Badge
                    variant={caseData.gepGoldResponse === "aceptado" ? "accent" : "outline"}
                    className="text-xs"
                  >
                    {caseData.gepGoldResponse === "aceptado" ? "✓ Aceptado" : "✗ Declinado"}
                  </Badge>
                )}
              </div>
              {caseData.derivationStatus.razonDerivacion && (
                <p className="text-xs text-white/60 italic">
                  {caseData.derivationStatus.razonDerivacion}
                </p>
              )}
              {caseData.derivationStatus.perfilTecnicoCoincidente && 
               caseData.derivationStatus.perfilTecnicoCoincidente.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs text-white/60 mb-1">Coincidencias de perfil:</p>
                  <div className="flex flex-wrap gap-1">
                    {caseData.derivationStatus.perfilTecnicoCoincidente.map((coincidencia) => (
                      <Badge key={coincidencia} variant="outline" className="text-xs">
                        {coincidencia}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Perfil técnico */}
        {caseData.technicalProfile && (
          <div className="pt-3 border-t border-white/10">
            <p className="text-xs text-white/60 mb-2">Perfil Técnico:</p>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-white/60">Categoría:</span>
                <span className="text-white/80">{caseData.technicalProfile.categoria}</span>
              </div>
              {caseData.technicalProfile.especialidadesRequeridas && 
               caseData.technicalProfile.especialidadesRequeridas.length > 0 && (
                <div>
                  <span className="text-white/60">Especialidades:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {caseData.technicalProfile.especialidadesRequeridas.slice(0, 3).map((spec) => (
                      <Badge key={spec} variant="outline" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                    {caseData.technicalProfile.especialidadesRequeridas.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{caseData.technicalProfile.especialidadesRequeridas.length - 3}
                      </Badge>
                    )}
                  </div>
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
