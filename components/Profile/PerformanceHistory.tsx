"use client";

import Card from "@/components/Card";
import { PerformanceHistory as PerformanceHistoryType } from "@/lib/reputation";

interface PerformanceHistoryProps {
  history: PerformanceHistoryType[];
}

export default function PerformanceHistory({ history }: PerformanceHistoryProps) {
  if (history.length === 0) {
    return (
      <Card>
        <p className="text-white/60 text-center py-8">
          No hay historial de desempeño disponible todavía.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Historial de Desempeño</h3>
      <div className="grid gap-4">
        {history.map((item) => (
          <Card key={item.period}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-white">{item.period}</h4>
                <div className="text-right">
                  <p className="text-sm text-white/60">Promedio</p>
                  <p className="text-2xl font-bold text-[#C9A24D]">
                    {item.averageRating > 0 ? item.averageRating.toFixed(1) : "—"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-white/10">
                <div>
                  <p className="text-xs text-white/60 mb-1">Casos Completados</p>
                  <p className="text-lg font-semibold text-white">{item.casesCompleted}</p>
                </div>
                <div>
                  <p className="text-xs text-white/60 mb-1">Satisfacción</p>
                  <p className="text-lg font-semibold text-white">{item.clientSatisfaction}%</p>
                </div>
                <div>
                  <p className="text-xs text-white/60 mb-1">Tiempo de Respuesta</p>
                  <p className="text-lg font-semibold text-white">{item.responseTime}h</p>
                </div>
                <div>
                  <p className="text-xs text-white/60 mb-1">Calificación</p>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(item.averageRating)
                            ? "text-[#C9A24D]"
                            : "text-white/20"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
