"use client";

import { useState } from "react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Link from "next/link";

export default function InformePage() {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = () => {
    setIsDownloading(true);
    const link = document.createElement("a");
    link.href = "/INFORME_EJECUTIVO_LEGAL_PY_2026.pdf";
    link.download = "INFORME_EJECUTIVO_LEGAL_PY_2026.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setIsDownloading(false), 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E1B2A] via-[#13253A] to-[#0E1B2A] py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            📊 Informe Ejecutivo Legal PY
          </h1>
          <p className="text-lg text-white/70 mb-2">
            Valuación, Proyecciones y Análisis de Mercado
          </p>
          <p className="text-sm text-white/60">
            Versión 2.1 | 20 de enero de 2026
          </p>
        </div>

        {/* Información del Informe */}
        <Card className="p-6 mb-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-semibold text-[#C9A24D] mb-4">
                Contenido del Informe
              </h2>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <h3 className="font-semibold text-white mb-2">📋 Secciones Incluidas</h3>
                  <ul className="text-sm text-white/80 space-y-1">
                    <li>• Resumen Ejecutivo</li>
                    <li>• Cambios Implementados</li>
                    <li>• Tasación del Trabajo</li>
                    <li>• Valuación Legal PY</li>
                    <li>• Modelo de Ingresos</li>
                    <li>• Proyecciones ROI</li>
                    <li>• ROI Socios GEP</li>
                    <li>• Marco Legal y Seguridad</li>
                    <li>• Sistema DPT</li>
                    <li>• Mercado Internacional</li>
                    <li>• Análisis de Dominio</li>
                  </ul>
                </div>
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <h3 className="font-semibold text-white mb-2">💎 Datos Clave (Mercado Paraguay)</h3>
                  <ul className="text-sm text-white/80 space-y-2">
                    <li>
                      <strong className="text-[#C9A24D]">Valuación:</strong> G. 2.362.500.000 - G. 3.937.500.000
                      <span className="text-white/60 text-xs ml-2">($315K - $525K USD)</span>
                    </li>
                    <li>
                      <strong className="text-[#C9A24D]">ROI Inversor:</strong> 315% - 420%
                      <span className="text-white/60 text-xs ml-2">(ajustado mercado PY)</span>
                    </li>
                    <li>
                      <strong className="text-[#C9A24D]">ROI GEP:</strong> 28,800% - 48,000%
                      <span className="text-white/60 text-xs ml-2">(ajustado mercado PY)</span>
                    </li>
                    <li>
                      <strong className="text-[#C9A24D]">Usuarios Año 1:</strong> 2,500 activos
                    </li>
                    <li>
                      <strong className="text-[#C9A24D]">Ingresos Año 1:</strong> G. 10.125.000.000
                      <span className="text-white/60 text-xs ml-2">($1.35M USD)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Visor de PDF */}
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">📄 Visualización del PDF</h3>
                <Button
                  variant="primary"
                  onClick={handleDownload}
                  disabled={isDownloading}
                >
                  {isDownloading ? "Descargando..." : "⬇️ Descargar PDF"}
                </Button>
              </div>

              {/* Visor de PDF embebido */}
              <div className="w-full h-[800px] rounded-lg overflow-hidden border border-white/20 bg-white/5">
                <iframe
                  src="/INFORME_EJECUTIVO_LEGAL_PY_2026.pdf"
                  className="w-full h-full"
                  title="Informe Ejecutivo Legal PY"
                />
              </div>

              {/* Enlace directo alternativo */}
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <p className="text-sm text-white/70 mb-2">
                  Si el visor no carga, puedes descargar directamente:
                </p>
                <Link
                  href="/INFORME_EJECUTIVO_LEGAL_PY_2026.pdf"
                  download
                  className="text-[#C9A24D] hover:underline font-medium"
                >
                  📥 Descargar Informe Ejecutivo Legal PY 2026.pdf
                </Link>
              </div>
            </div>
          </div>
        </Card>

        {/* Valuación Ajustada al Mercado Paraguayo */}
        <Card className="p-6 mb-6 border-2 border-[#C9A24D]/30">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-[#C9A24D] mb-2">
                🇵🇾 Valuación Ajustada al Mercado Paraguayo
              </h2>
              <p className="text-sm text-white/70 mb-4">
                Metodología específica para inversores paraguayos aplicando múltiplos y descuentos de mercado local
              </p>
            </div>

            {/* Comparación de Metodologías */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <h3 className="font-semibold text-white mb-2 text-sm">🇺🇸 EE.UU. / Silicon Valley</h3>
                <ul className="text-xs text-white/80 space-y-1">
                  <li>• Múltiplo: 10x - 20x ingresos</li>
                  <li>• Enfoque: Crecimiento exponencial</li>
                  <li>• Apetito de riesgo: Alto</li>
                  <li className="mt-2 pt-2 border-t border-white/10">
                    <strong className="text-blue-400">Ejemplo:</strong> G. 10.125M x 10 = G. 101.250M
                  </li>
                </ul>
              </div>
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <h3 className="font-semibold text-white mb-2 text-sm">🇪🇸 España / Europa</h3>
                <ul className="text-xs text-white/80 space-y-1">
                  <li>• Múltiplo: 5x - 8x ingresos</li>
                  <li>• Enfoque: Sostenibilidad y EBITDA</li>
                  <li>• Apetito de riesgo: Moderado</li>
                  <li className="mt-2 pt-2 border-t border-white/10">
                    <strong className="text-green-400">Ejemplo:</strong> G. 10.125M x 6 = G. 60.750M
                  </li>
                </ul>
              </div>
              <div className="p-4 rounded-lg bg-[#C9A24D]/20 border-2 border-[#C9A24D]/40">
                <h3 className="font-semibold text-white mb-2 text-sm">🇵🇾 Paraguay / Sudamérica</h3>
                <ul className="text-xs text-white/80 space-y-1">
                  <li>• Múltiplo: 2x - 4x ingresos</li>
                  <li>• Enfoque: Cash Flow y rentabilidad</li>
                  <li>• Descuento mercado: 30%</li>
                  <li className="mt-2 pt-2 border-t border-white/10">
                    <strong className="text-[#C9A24D]">Realista:</strong> G. 10.125M x 2.8 = G. 28.350M
                  </li>
                </ul>
              </div>
            </div>

            {/* Valuación Legal PY en Guaraníes */}
            <div className="p-6 rounded-lg bg-gradient-to-r from-[#C9A24D]/20 to-[#C9A24D]/10 border border-[#C9A24D]/40">
              <h3 className="text-xl font-bold text-white mb-4">💰 Valuación Legal PY en Guaraníes</h3>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* Método 1: Múltiplo de Ingresos (Ajustado PY) */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-[#C9A24D]">Método 1: Múltiplo de Ingresos Reales</h4>
                  <div className="text-sm text-white/90 space-y-2 pl-4 border-l-2 border-[#C9A24D]/40">
                    <p>Ingresos Año 1: <strong>G. 10.125.000.000</strong></p>
                    <p>Múltiplo mercado PY: <strong>2.5x - 3.5x</strong></p>
                    <p className="text-lg font-bold text-white pt-2">
                      Valuación: <span className="text-[#C9A24D]">G. 25.312.500.000 - G. 35.437.500.000</span>
                    </p>
                    <p className="text-xs text-white/60">
                      ($3.375M - $4.725M USD al tipo de cambio 7.500 Gs/USD)
                    </p>
                  </div>
                </div>

                {/* Método 2: Scorecard Ajustado */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-[#C9A24D]">Método 2: Scorecard Ajustado</h4>
                  <div className="text-sm text-white/90 space-y-2 pl-4 border-l-2 border-[#C9A24D]/40">
                    <p>Comparable región: <strong>Uruguay/Chile</strong></p>
                    <p>Valuación base: <strong>G. 40.500.000.000</strong></p>
                    <p>Descuento mercado PY: <strong>-30%</strong></p>
                    <p className="text-lg font-bold text-white pt-2">
                      Valuación ajustada: <span className="text-[#C9A24D]">G. 28.350.000.000</span>
                    </p>
                    <p className="text-xs text-white/60">
                      ($3.780M USD ajustado)
                    </p>
                  </div>
                </div>
              </div>

              {/* Valuación Final Recomendada */}
              <div className="p-4 rounded-lg bg-[#0E1B2A]/60 border-2 border-[#C9A24D]/50">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-bold text-lg text-white">Valuación Final Recomendada</h4>
                  <span className="px-3 py-1 rounded-full bg-[#C9A24D] text-[#0E1B2A] text-xs font-bold">
                    Para Inversores Paraguayos
                  </span>
                </div>
                <div className="mt-3 space-y-2">
                  <div className="text-3xl font-bold text-[#C9A24D]">
                    G. 2.362.500.000 - G. 3.937.500.000
                  </div>
                  <div className="text-sm text-white/70">
                    Equivalente: <strong>$315.000 - $525.000 USD</strong> (Tipo de cambio: 7.500 Gs/USD)
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-xs text-white/60 leading-relaxed">
                      <strong>Justificación:</strong> Esta valuación aplica un enfoque conservador y realista para el mercado paraguayo, 
                      considerando el menor apetito de riesgo, la necesidad de demostrar rentabilidad temprana, y el descuento 
                      por liquidez de mercado. El rango se basa en múltiplos de 2x-3x ingresos anuales proyectados, ajustado por 
                      el perfil de riesgo país y las expectativas de inversores locales (Ángeles, Family Offices, Fondos locales).
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ROI Ajustado */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <h4 className="font-semibold text-white mb-3">📈 ROI Inversor (Ajustado PY)</h4>
                <div className="space-y-2 text-sm">
                  <p className="text-white/80">Inversión inicial: <strong className="text-white">G. 750.000.000</strong></p>
                  <p className="text-white/80">Valor esperado (3 años): <strong className="text-white">G. 2.362.500.000 - G. 3.150.000.000</strong></p>
                  <p className="text-2xl font-bold text-[#C9A24D] pt-2">315% - 420%</p>
                  <p className="text-xs text-white/60">vs. 472%-630% en mercado internacional (ajustado por riesgo PY)</p>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <h4 className="font-semibold text-white mb-3">👑 ROI GEP (Ajustado PY)</h4>
                <div className="space-y-2 text-sm">
                  <p className="text-white/80">Inversión GEP: <strong className="text-white">G. 10.000.000</strong></p>
                  <p className="text-white/80">Valor esperado (3 años): <strong className="text-white">G. 2.880.000.000 - G. 4.800.000.000</strong></p>
                  <p className="text-2xl font-bold text-[#C9A24D] pt-2">28,800% - 48,000%</p>
                  <p className="text-xs text-white/60">vs. 43,200%-72,000% en mercado internacional</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Información adicional */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-white mb-4">📌 Notas Importantes</h3>
          <div className="space-y-3 text-sm text-white/80">
            <p>
              • <strong>Metodología paraguaya:</strong> Esta valuación aplica múltiplos conservadores (2x-4x ingresos) 
              y descuentos de mercado local (20-30%) típicos para inversiones en Paraguay y Sudamérica.
            </p>
            <p>
              • <strong>Tipo de cambio:</strong> 1 USD = 7.500 Gs (estimación conservadora para 2026).
            </p>
            <p>
              • Este informe contiene información confidencial y está destinado únicamente para inversores y socios estratégicos.
            </p>
            <p>
              • Todas las proyecciones son estimaciones basadas en modelos de mercado y pueden variar según condiciones locales.
            </p>
            <p>
              • La valuación está sujeta a negociación y ajustes según términos de inversión y estructura de capital.
            </p>
            <p>
              • Para consultas sobre el informe, contactar: <a href="mailto:dpo@legalpy.com" className="text-[#C9A24D] hover:underline">dpo@legalpy.com</a>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
