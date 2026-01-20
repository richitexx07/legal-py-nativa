"use client";

import { useState, useEffect } from "react";
import { LegalCase } from "@/lib/types";
import { isCaseAvailableForUser, getTimeUntilRelease } from "@/lib/dpt-engine";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Badge from "@/components/Badge";

interface CaseCardProps {
  legalCase: LegalCase;
  userTier: 0 | 1 | 2 | 3;
  onApply?: (caseId: string) => void;
}

export default function CaseCard({ legalCase, userTier, onApply }: CaseCardProps) {
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const isGEP = userTier === 3;
  const isAvailable = isCaseAvailableForUser(userTier, legalCase);
  const isExclusiveGEP = legalCase.exclusiveForGepUntil !== null;

  // Actualizar contador regresivo cada segundo
  useEffect(() => {
    if (!isGEP && isExclusiveGEP) {
      const updateTimer = () => {
        const remaining = getTimeUntilRelease(legalCase);
        setTimeRemaining(remaining);
      };

      updateTimer();
      const interval = setInterval(updateTimer, 1000);

      return () => clearInterval(interval);
    }
  }, [legalCase, isGEP, isExclusiveGEP]);

  // Formatear tiempo restante
  const formatTimeRemaining = (ms: number | null): string => {
    if (ms === null || ms <= 0) return "Disponible ahora";

    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);

    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    }
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  };

  // Colores por área de práctica
  const practiceAreaColors: Record<LegalCase["practiceArea"], string> = {
    CIVIL: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    PENAL: "bg-red-500/20 text-red-400 border-red-500/30",
    CORPORATIVO: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    LABORAL: "bg-green-500/20 text-green-400 border-green-500/30",
    FAMILIA: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  };

  // Colores por complejidad
  const complexityColors: Record<LegalCase["complexity"], string> = {
    BAJA: "bg-gray-500/20 text-gray-400",
    MEDIA: "bg-yellow-500/20 text-yellow-400",
    ALTA: "bg-orange-500/20 text-orange-400",
  };

  // Formatear presupuesto
  const formatBudget = (amount: number): string => {
    return new Intl.NumberFormat("es-PY", {
      style: "currency",
      currency: "PYG",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className={`relative overflow-hidden ${!isAvailable && !isGEP ? "opacity-75" : ""}`}>
      {/* Overlay borroso para casos exclusivos GEP (solo para no-GEP) */}
      {!isGEP && isExclusiveGEP && isAvailable === false && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-4">
          <div className="text-center">
            <div className="text-4xl mb-2">🔒</div>
            <p className="text-white font-semibold mb-2">Solo Socios GEP</p>
            <p className="text-sm text-white/80 mb-3">Este caso tiene prioridad exclusiva</p>
            <div className="inline-block px-3 py-1 rounded-lg bg-[#C9A24D]/20 border border-[#C9A24D]/50">
              <p className="text-xs text-[#C9A24D] font-medium">
                Se libera en: <span className="font-bold">{formatTimeRemaining(timeRemaining)}</span>
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="p-6 space-y-4">
        {/* Header con Badge GEP si aplica */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">{legalCase.title}</h3>
            {isGEP && isExclusiveGEP && (
              <Badge variant="accent" className="bg-[#C9A24D] text-black text-xs mb-2">
                👑 Prioridad GEP
              </Badge>
            )}
          </div>
        </div>

        {/* Área de práctica y complejidad */}
        <div className="flex flex-wrap gap-2">
          <Badge
            variant="outline"
            className={`text-xs ${practiceAreaColors[legalCase.practiceArea]}`}
          >
            {legalCase.practiceArea}
          </Badge>
          <Badge variant="outline" className={`text-xs ${complexityColors[legalCase.complexity]}`}>
            {legalCase.complexity}
          </Badge>
          {legalCase.status === "OPEN" && (
            <Badge variant="outline" className="text-xs bg-green-500/20 text-green-400 border-green-500/30">
              Abierto
            </Badge>
          )}
        </div>

        {/* Descripción */}
        <p className="text-sm text-white/70 line-clamp-3">{legalCase.description}</p>

        {/* Presupuesto */}
        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
          <p className="text-xs text-white/60 mb-1">Presupuesto Estimado</p>
          <p className="text-lg font-bold text-[#C9A24D]">{formatBudget(legalCase.estimatedBudget)}</p>
        </div>

        {/* Botón de acción */}
        <div className="pt-2">
          {isGEP && isExclusiveGEP ? (
            <Button
              variant="primary"
              className="w-full"
              onClick={() => onApply?.(legalCase.id)}
            >
              ⚡ Aceptar Caso Ahora
            </Button>
          ) : isAvailable ? (
            <Button
              variant="primary"
              className="w-full"
              onClick={() => onApply?.(legalCase.id)}
            >
              Aplicar
            </Button>
          ) : (
            <Button variant="outline" className="w-full" disabled>
              🔒 No Disponible
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
