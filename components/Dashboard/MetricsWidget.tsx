"use client";

import Card from "@/components/Card";
import { useEffect, useState } from "react";

interface MetricsWidgetProps {
  plan: "empresarial" | "gep";
}

export default function MetricsWidget({ plan }: MetricsWidgetProps) {
  const [metrics, setMetrics] = useState({
    monthlyRevenue: 0,
    casesWon: 0,
    casesLost: 0,
    conversionRate: 0,
  });

  useEffect(() => {
    // Simular carga de métricas (en producción vendría de una API)
    const mockMetrics = {
      monthlyRevenue: 45000000, // Gs. 45 millones
      casesWon: 12,
      casesLost: 3,
      conversionRate: 78.5,
    };
    
    // Animación de carga
    setTimeout(() => {
      setMetrics(mockMetrics);
    }, 500);
  }, []);

  const winRate = metrics.casesWon + metrics.casesLost > 0
    ? ((metrics.casesWon / (metrics.casesWon + metrics.casesLost)) * 100).toFixed(1)
    : "0";

  return (
    <Card className="p-6 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">📊 Métricas de Despacho</h3>
          <p className="text-sm text-slate-400">Resumen del mes actual</p>
        </div>
        <div className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full text-xs font-bold text-white">
          {plan === "gep" ? "GEP" : "Empresarial"}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Facturación del Mes */}
        <div className="p-4 bg-slate-700/50 rounded-xl border border-slate-600">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">💰</span>
            <span className="text-xs text-slate-400 uppercase tracking-wide">Facturación del Mes</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {new Intl.NumberFormat("es-PY", {
              style: "currency",
              currency: "PYG",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(metrics.monthlyRevenue)}
          </p>
          <p className="text-xs text-green-400 mt-1">↑ 12% vs mes anterior</p>
        </div>

        {/* Casos Ganados vs Perdidos */}
        <div className="p-4 bg-slate-700/50 rounded-xl border border-slate-600">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">⚖️</span>
            <span className="text-xs text-slate-400 uppercase tracking-wide">Casos Resueltos</span>
          </div>
          <div className="flex items-baseline gap-3">
            <div>
              <p className="text-2xl font-bold text-green-400">{metrics.casesWon}</p>
              <p className="text-xs text-slate-400">Ganados</p>
            </div>
            <span className="text-slate-500">/</span>
            <div>
              <p className="text-2xl font-bold text-red-400">{metrics.casesLost}</p>
              <p className="text-xs text-slate-400">Perdidos</p>
            </div>
          </div>
          <p className="text-xs text-blue-400 mt-2">Tasa de éxito: {winRate}%</p>
        </div>

        {/* Tasa de Conversión */}
        <div className="p-4 bg-slate-700/50 rounded-xl border border-slate-600">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">📈</span>
            <span className="text-xs text-slate-400 uppercase tracking-wide">Conversión de Clientes</span>
          </div>
          <p className="text-2xl font-bold text-white">{metrics.conversionRate}%</p>
          <div className="mt-2 w-full bg-slate-600 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${metrics.conversionRate}%` }}
            ></div>
          </div>
          <p className="text-xs text-slate-400 mt-1">De consultas a casos activos</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-700">
        <p className="text-xs text-slate-500 text-center">
          💡 Estas métricas se actualizan en tiempo real. Los datos históricos están disponibles en el reporte mensual.
        </p>
      </div>
    </Card>
  );
}
