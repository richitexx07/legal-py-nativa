"use client";

import Card from "@/components/Card";
import Badge from "@/components/Badge";
import { DigitalInternship } from "@/lib/edu-types";

interface InternshipProgressProps {
  internship: DigitalInternship;
}

export default function InternshipProgress({ internship }: InternshipProgressProps) {
  const progressPercentage = (internship.completedHours / internship.requiredHours) * 100;
  const remainingHours = internship.requiredHours - internship.completedHours;

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-400/30">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">📊 Progreso de Pasantía</h3>
        <Badge variant="accent" className="text-xs">
          {internship.status === "active" ? "Activa" : internship.status === "completed" ? "Completada" : "Cancelada"}
        </Badge>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-white/80">Horas de Pasantía</span>
            <span className="text-sm font-bold text-white">
              {internship.completedHours} / {internship.requiredHours} completadas
            </span>
          </div>
          <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 flex items-center justify-end pr-2"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            >
              {progressPercentage >= 10 && (
                <span className="text-xs font-bold text-white">{Math.round(progressPercentage)}%</span>
              )}
            </div>
          </div>
          {remainingHours > 0 && (
            <p className="text-xs text-white/60 mt-1">
              {remainingHours} horas restantes para completar
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
          <div>
            <p className="text-xs text-white/60 mb-1">Check-ins</p>
            <p className="text-2xl font-bold text-white">{internship.checkIns.length}</p>
          </div>
          <div>
            <p className="text-xs text-white/60 mb-1">Entradas en Bitácora</p>
            <p className="text-2xl font-bold text-white">{internship.caseLogs.length}</p>
          </div>
        </div>

        {internship.location && (
          <div className="pt-4 border-t border-white/10">
            <p className="text-xs text-white/60 mb-1">Ubicación</p>
            <p className="text-sm text-white">{internship.location.name}</p>
            <p className="text-xs text-white/60">{internship.location.address}</p>
          </div>
        )}
      </div>
    </Card>
  );
}
