"use client";

import { useState } from "react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Link from "next/link";
import { valuationParaguay, formatGuaranies, formatUSD } from "@/lib/valuation-paraguay";

export default function InformePage() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloadingParaguay, setIsDownloadingParaguay] = useState(false);

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

  const handleDownloadParaguayPDF = () => {
    setIsDownloadingParaguay(true);
    // Generar PDF del informe ajustado a Paraguay
    const contenido = `
INFORME EJECUTIVO LEGAL PY - VALUACIÓN PARAGUAYA
Versión 2.2 - Ajustado al Mercado Paraguayo
Fecha: ${new Date().toLocaleDateString('es-PY')}

===============================================================================
1. VALUACIÓN AJUSTADA AL MERCADO PARAGUAYO
===============================================================================

Ingresos Proyectados Año 1:
- USD: ${formatUSD(valuationParaguay.ingresosAnualesAño1.usd)}
- Guaraníes: ${formatGuaranies(valuationParaguay.ingresosAnualesAño1.guaranies)}

Método 1: Múltiplo de Ingresos Reales
- Descripción: ${valuationParaguay.valuacionMetodo1.descripcion}
- Múltiplo aplicado: ${valuationParaguay.valuacionMetodo1.multiplicador}
- Valuación: ${formatGuaranies(valuationParaguay.valuacionMetodo1.valorMin)} - ${formatGuaranies(valuationParaguay.valuacionMetodo1.valorMax)}
- En USD: ${formatUSD(valuationParaguay.valuacionMetodo1.valorMinUSD)} - ${formatUSD(valuationParaguay.valuacionMetodo1.valorMaxUSD)}

Método 2: Scorecard Ajustado
- Descripción: ${valuationParaguay.valuacionMetodo2.descripcion}
- Descuento mercado PY: ${valuationParaguay.valuacionMetodo2.descuento}
- Valuación ajustada: ${formatGuaranies(valuationParaguay.valuacionMetodo2.valor)}
- En USD: ${formatUSD(valuationParaguay.valuacionMetodo2.valorUSD)}

VALUACIÓN FINAL RECOMENDADA (Para Inversores Paraguayos):
${formatGuaranies(valuationParaguay.valuacionFinal.min)} - ${formatGuaranies(valuationParaguay.valuacionFinal.max)}
(${formatUSD(valuationParaguay.valuacionFinal.minUSD)} - ${formatUSD(valuationParaguay.valuacionFinal.maxUSD)})

Justificación:
${valuationParaguay.valuacionFinal.justificacion}

===============================================================================
2. ROI PARA INVERSORES
===============================================================================

Inversor Tradicional:
- Inversión inicial: ${formatGuaranies(valuationParaguay.roiInversor.inversionInicial)}
- Valor esperado (3 años): ${formatGuaranies(valuationParaguay.roiInversor.valorEsperado3Anos.min)} - ${formatGuaranies(valuationParaguay.roiInversor.valorEsperado3Anos.max)}
- ROI: ${valuationParaguay.roiInversor.porcentaje.min}% - ${valuationParaguay.roiInversor.porcentaje.max}%

Inversor GEP (Gold Enterprise Partner):
- Inversión inicial: ${formatGuaranies(valuationParaguay.roiGep.inversionGep)}
- Valor esperado (3 años): ${formatGuaranies(valuationParaguay.roiGep.valorEsperado3Anos.min)} - ${formatGuaranies(valuationParaguay.roiGep.valorEsperado3Anos.max)}
- ROI: ${valuationParaguay.roiGep.porcentaje.min}% - ${valuationParaguay.roiGep.porcentaje.max}%

===============================================================================
3. ¿POR QUÉ SER INVERSOR GEP?
===============================================================================

Para Inversores Paraguayos, convertirse en GEP representa una oportunidad única:

1. ACCESO PRIORITARIO A CASOS DE ALTO VALOR
   - Los casos complejos (complejidad ALTA o presupuesto > G. 37.500.000) tienen ventana exclusiva de 24-48 horas para socios GEP
   - Esto garantiza acceso preferencial a las oportunidades más rentables antes de que se liberen al mercado general

2. MULTIPLICADOR DE RETORNO EXCEPCIONAL
   - Con una inversión de solo ${formatGuaranies(valuationParaguay.roiGep.inversionGep)}, un inversor GEP puede obtener retornos de ${valuationParaguay.roiGep.porcentaje.min}% a ${valuationParaguay.roiGep.porcentaje.max}% en 3 años
   - Esto representa multiplicar la inversión inicial entre 288x y 480x

3. VENTAJAS COMPETITIVAS EN EL MERCADO LEGAL
   - Prioridad en la evaluación técnica de casos internacionales
   - Acceso a casos que nunca llegan al mercado abierto debido a su complejidad
   - Construcción de reputación como socio estratégico en el ecosistema legal paraguayo

4. MODELO ESCALABLE Y RENTABLE
   - El modelo SaaS de Legal PY garantiza ingresos recurrentes
   - Los socios GEP se benefician del crecimiento orgánico de la plataforma
   - Sin necesidad de gestionar operaciones diarias, solo inversión y retorno

5. PRIMER MOVER EN TECNOLOGÍA LEGAL
   - Paraguay aún no tiene una plataforma legal tecnológica consolidada
   - Ser GEP significa posicionarse como pionero en la transformación digital del sector legal
   - Oportunidad de construir una ventaja competitiva duradera

6. ACCESO A MERCADO INTERNACIONAL
   - Legal PY está diseñado para casos internacionales y cross-border
   - Los socios GEP pueden acceder a oportunidades fuera del mercado paraguayo
   - Expansión potencial a otros mercados sudamericanos

7. ALINEACIÓN CON PERFIL DE INVERSOR PARAGUAYO
   - Mínimo desembolso inicial (G. 10.000.000)
   - Retornos proyectados en 3 años (alineado con expectativas de Family Offices locales)
   - Modelo de negocio tangible con ingresos recurrentes demostrables

8. PROTECCIÓN Y GOBERNANZA
   - Sistema de Gobernanza Legal con políticas claras y transparentes
   - Cumplimiento con normativas paraguayas (Ley 7593/2025, GAFILAT, SEPRELAD)
   - Blindaje legal para inversores

===============================================================================
4. COMPARACIÓN: INVERSOR TRADICIONAL vs GEP
===============================================================================

Inversor Tradicional:
- Inversión: ${formatGuaranies(valuationParaguay.roiInversor.inversionInicial)}
- ROI esperado: ${valuationParaguay.roiInversor.porcentaje.min}% - ${valuationParaguay.roiInversor.porcentaje.max}%
- Acceso: Casos generales después de ventana GEP
- Tiempo de retorno: 3 años

Inversor GEP:
- Inversión: ${formatGuaranies(valuationParaguay.roiGep.inversionGep)} (75x menor que inversor tradicional)
- ROI esperado: ${valuationParaguay.roiGep.porcentaje.min}% - ${valuationParaguay.roiGep.porcentaje.max}% (91x mayor ROI porcentual)
- Acceso: Prioridad exclusiva 24-48h en casos de alto valor
- Tiempo de retorno: 3 años
- Ventajas adicionales: Prioridad en evaluación, acceso a casos internacionales, construcción de marca

===============================================================================
5. METODOLOGÍA DE VALUACIÓN PARAGUAYA
===============================================================================

Diferencia clave vs. Mercado Internacional:
- Múltiplos conservadores: 2x-4x ingresos (vs. 10x-20x en EE.UU.)
- Descuento de mercado local: 30%
- Enfoque en cash flow y rentabilidad temprana
- Ajuste por riesgo país y liquidez de mercado limitada

Tipo de cambio aplicado: 1 USD = 7.500 Gs (estimación conservadora 2026)

===============================================================================

Para más información, contactar:
Email: dpo@legalpy.com
Web: legalpy.com

Este informe contiene información confidencial y está destinado únicamente
para inversores y socios estratégicos.
    `;

    const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `INFORME_LEGAL_PY_VALUACION_PARAGUAYA_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setTimeout(() => setIsDownloadingParaguay(false), 1000);
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

        {/* Evaluación Legal PY Detallada en Guaraníes */}
        <Card className="p-6 mb-6 border-2 border-[#C9A24D]/30">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-[#C9A24D] mb-2">
                💰 Evaluación Detallada Legal PY en Guaraníes
              </h2>
              <p className="text-sm text-white/70 mb-4">
                Análisis exhaustivo de la valuación aplicando metodologías específicas del mercado paraguayo
              </p>
            </div>

            {/* Método 1 Expandido */}
            <div className="p-6 rounded-lg bg-gradient-to-r from-blue-500/10 to-blue-500/5 border border-blue-500/20">
              <h3 className="text-xl font-bold text-white mb-4">📊 Método 1: Múltiplo de Ingresos Reales</h3>
              <div className="space-y-4 text-sm text-white/90">
                <p className="leading-relaxed">
                  Este método es el más utilizado por inversores paraguayos y Family Offices locales. Se basa en aplicar 
                  múltiplos conservadores sobre los ingresos anuales proyectados, considerando el perfil de riesgo del país 
                  y la liquidez limitada del mercado de capitales en Paraguay.
                </p>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <h4 className="font-semibold text-blue-400 mb-2">Base de Cálculo</h4>
                    <ul className="space-y-1 text-xs">
                      <li>• Ingresos Año 1: <strong className="text-white">{formatGuaranies(valuationParaguay.ingresosAnualesAño1.guaranies)}</strong></li>
                      <li>• Múltiplo mínimo PY: <strong className="text-white">2.5x</strong></li>
                      <li>• Múltiplo máximo PY: <strong className="text-white">3.5x</strong></li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <h4 className="font-semibold text-blue-400 mb-2">Resultado</h4>
                    <ul className="space-y-1 text-xs">
                      <li>• Valuación mínima: <strong className="text-white">{formatGuaranies(valuationParaguay.valuacionMetodo1.valorMin)}</strong></li>
                      <li>• Valuación máxima: <strong className="text-white">{formatGuaranies(valuationParaguay.valuacionMetodo1.valorMax)}</strong></li>
                      <li>• Promedio: <strong className="text-[#C9A24D]">{formatGuaranies((valuationParaguay.valuacionMetodo1.valorMin + valuationParaguay.valuacionMetodo1.valorMax) / 2)}</strong></li>
                    </ul>
                  </div>
                </div>
                <p className="text-xs text-white/70 mt-4 italic">
                  Justificación: En Paraguay, las startups SaaS suelen valuarse entre 2x-4x ingresos anuales, 
                  significativamente menor que los 10x-20x de mercados más desarrollados. Este enfoque refleja 
                  la necesidad de demostrar rentabilidad temprana y el menor apetito de riesgo de los inversores locales.
                </p>
              </div>
            </div>

            {/* Método 2 Expandido */}
            <div className="p-6 rounded-lg bg-gradient-to-r from-green-500/10 to-green-500/5 border border-green-500/20">
              <h3 className="text-xl font-bold text-white mb-4">📈 Método 2: Scorecard Ajustado</h3>
              <div className="space-y-4 text-sm text-white/90">
                <p className="leading-relaxed">
                  El método Scorecard compara Legal PY con startups similares en mercados comparables (Uruguay, Chile) 
                  y aplica ajustes por factores específicos del mercado paraguayo: tamaño del mercado, liquidez, 
                  disponibilidad de capital de riesgo, y condiciones macroeconómicas.
                </p>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <h4 className="font-semibold text-green-400 mb-2">Factores de Ajuste</h4>
                    <ul className="space-y-1 text-xs">
                      <li>• Valuación base (Uruguay/Chile): <strong className="text-white">{formatGuaranies(40500000000)}</strong></li>
                      <li>• Descuento mercado PY: <strong className="text-white">-30%</strong></li>
                      <li>• Ajuste por tamaño mercado: <strong className="text-white">-5%</strong></li>
                      <li>• Ajuste por liquidez: <strong className="text-white">-3%</strong></li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <h4 className="font-semibold text-green-400 mb-2">Valuación Final</h4>
                    <ul className="space-y-1 text-xs">
                      <li>• Descuento total aplicado: <strong className="text-white">38%</strong></li>
                      <li>• Valuación ajustada: <strong className="text-white">{formatGuaranies(valuationParaguay.valuacionMetodo2.valor)}</strong></li>
                      <li>• Equivalente USD: <strong className="text-[#C9A24D]">{formatUSD(valuationParaguay.valuacionMetodo2.valorUSD)}</strong></li>
                    </ul>
                  </div>
                </div>
                <p className="text-xs text-white/70 mt-4 italic">
                  Justificación: Este método reconoce que aunque Legal PY tiene potencial comparable a startups 
                  en mercados más desarrollados, el entorno de inversión paraguayo requiere descuentos sustanciales 
                  por riesgo país, menor liquidez, y expectativas diferentes de los inversores locales.
                </p>
              </div>
            </div>

            {/* Botón para descargar informe Paraguay */}
            <div className="p-4 rounded-lg bg-[#C9A24D]/20 border-2 border-[#C9A24D]/40">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white mb-1">📥 Descargar Informe Ajustado a Paraguay</h4>
                  <p className="text-xs text-white/70">
                    Obtén el informe completo con valuación en Guaraníes en formato texto para compartir con inversores locales
                  </p>
                </div>
                <Button
                  variant="primary"
                  onClick={handleDownloadParaguayPDF}
                  disabled={isDownloadingParaguay}
                >
                  {isDownloadingParaguay ? "Generando..." : "📄 Descargar TXT"}
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Sección: ¿Por qué ser Inversor GEP? */}
        <Card className="p-6 mb-6 border-2 border-[#C9A24D]/50 bg-gradient-to-br from-[#C9A24D]/10 to-[#C9A24D]/5">
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-[#C9A24D] mb-2">
                👑 ¿Por qué ser Inversor GEP? (Para Inversores Paraguayos)
              </h2>
              <p className="text-lg text-white/80 mb-4">
                Convertirse en Gold Enterprise Partner representa una oportunidad única diseñada específicamente 
                para el perfil de inversor paraguayo
              </p>
            </div>

            {/* Ventajas GEP */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Ventaja 1 */}
              <div className="p-6 rounded-lg bg-white/10 border border-[#C9A24D]/30">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">🚀</div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">1. Acceso Prioritario a Casos de Alto Valor</h3>
                    <p className="text-sm text-white/90 leading-relaxed mb-3">
                      Los casos complejos (complejidad ALTA o presupuesto superior a <strong className="text-[#C9A24D]">G. 37.500.000</strong>) 
                      tienen una ventana exclusiva de <strong className="text-[#C9A24D]">24-48 horas</strong> para socios GEP. 
                      Esto garantiza acceso preferencial a las oportunidades más rentables antes de que se liberen al mercado general.
                    </p>
                    <p className="text-xs text-white/70 italic">
                      Ventaja: Los socios GEP ven y pueden aceptar casos que otros profesionales nunca llegan a conocer.
                    </p>
                  </div>
                </div>
              </div>

              {/* Ventaja 2 */}
              <div className="p-6 rounded-lg bg-white/10 border border-[#C9A24D]/30">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">💰</div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">2. Multiplicador de Retorno Excepcional</h3>
                    <p className="text-sm text-white/90 leading-relaxed mb-3">
                      Con una inversión de solo <strong className="text-[#C9A24D]">{formatGuaranies(valuationParaguay.roiGep.inversionGep)}</strong>, 
                      un inversor GEP puede obtener retornos de <strong className="text-[#C9A24D]">{valuationParaguay.roiGep.porcentaje.min}% - {valuationParaguay.roiGep.porcentaje.max}%</strong> en 3 años. 
                      Esto representa multiplicar la inversión inicial entre <strong>288x y 480x</strong>.
                    </p>
                    <p className="text-xs text-white/70 italic">
                      Comparación: Un inversor tradicional necesita G. 750M para obtener 315%-420%. Un GEP con solo G. 10M obtiene 28,800%-48,000%.
                    </p>
                  </div>
                </div>
              </div>

              {/* Ventaja 3 */}
              <div className="p-6 rounded-lg bg-white/10 border border-[#C9A24D]/30">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">⚖️</div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">3. Ventajas Competitivas en el Mercado Legal</h3>
                    <p className="text-sm text-white/90 leading-relaxed mb-3">
                      Los socios GEP tienen <strong className="text-[#C9A24D]">prioridad en la evaluación técnica</strong> de casos 
                      internacionales y acceso exclusivo a casos que nunca llegan al mercado abierto debido a su complejidad. 
                      Esto permite construir reputación como socio estratégico en el ecosistema legal paraguayo.
                    </p>
                    <p className="text-xs text-white/70 italic">
                      Beneficio de largo plazo: Posicionamiento como líder en transformación digital del sector legal paraguayo.
                    </p>
                  </div>
                </div>
              </div>

              {/* Ventaja 4 */}
              <div className="p-6 rounded-lg bg-white/10 border border-[#C9A24D]/30">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">📈</div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">4. Modelo Escalable y Rentable</h3>
                    <p className="text-sm text-white/90 leading-relaxed mb-3">
                      El modelo SaaS de Legal PY garantiza <strong className="text-[#C9A24D]">ingresos recurrentes</strong> mensuales. 
                      Los socios GEP se benefician del crecimiento orgánico de la plataforma sin necesidad de gestionar 
                      operaciones diarias, solo inversión y retorno.
                    </p>
                    <p className="text-xs text-white/70 italic">
                      Perfecto para: Family Offices que buscan inversiones pasivas con alto potencial de crecimiento.
                    </p>
                  </div>
                </div>
              </div>

              {/* Ventaja 5 */}
              <div className="p-6 rounded-lg bg-white/10 border border-[#C9A24D]/30">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">🎯</div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">5. Primer Mover en Tecnología Legal</h3>
                    <p className="text-sm text-white/90 leading-relaxed mb-3">
                      Paraguay aún <strong className="text-[#C9A24D]">no tiene una plataforma legal tecnológica consolidada</strong>. 
                      Ser GEP significa posicionarse como pionero en la transformación digital del sector legal y construir 
                      una ventaja competitiva duradera antes de que lleguen competidores internacionales.
                    </p>
                    <p className="text-xs text-white/70 italic">
                      Oportunidad: Primeros movers típicamente capturan 60-70% del mercado antes de la saturación.
                    </p>
                  </div>
                </div>
              </div>

              {/* Ventaja 6 */}
              <div className="p-6 rounded-lg bg-white/10 border border-[#C9A24D]/30">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">🌎</div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">6. Acceso a Mercado Internacional</h3>
                    <p className="text-sm text-white/90 leading-relaxed mb-3">
                      Legal PY está diseñado para <strong className="text-[#C9A24D]">casos internacionales y cross-border</strong>. 
                      Los socios GEP pueden acceder a oportunidades fuera del mercado paraguayo, con expansión potencial 
                      a otros mercados sudamericanos (Argentina, Brasil, Uruguay, Chile).
                    </p>
                    <p className="text-xs text-white/70 italic">
                      Escalabilidad: El mismo modelo puede replicarse en mercados de 10-20x el tamaño de Paraguay.
                    </p>
                  </div>
                </div>
              </div>

              {/* Ventaja 7 */}
              <div className="p-6 rounded-lg bg-white/10 border border-[#C9A24D]/30">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">🇵🇾</div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">7. Alineación con Perfil de Inversor Paraguayo</h3>
                    <p className="text-sm text-white/90 leading-relaxed mb-3">
                      El modelo GEP está diseñado específicamente para inversores paraguayos: <strong className="text-[#C9A24D]">mínimo desembolso inicial</strong> 
                      ({formatGuaranies(valuationParaguay.roiGep.inversionGep)}), retornos proyectados en <strong>3 años</strong> 
                      (alineado con expectativas de Family Offices locales), y modelo de negocio <strong>tangible</strong> con ingresos recurrentes demostrables.
                    </p>
                    <p className="text-xs text-white/70 italic">
                      Adaptado a la realidad local: Inversores paraguayos prefieren modelos con retorno claro y horizonte temporal definido.
                    </p>
                  </div>
                </div>
              </div>

              {/* Ventaja 8 */}
              <div className="p-6 rounded-lg bg-white/10 border border-[#C9A24D]/30">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">🛡️</div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">8. Protección y Gobernanza</h3>
                    <p className="text-sm text-white/90 leading-relaxed mb-3">
                      Sistema de <strong className="text-[#C9A24D]">Gobernanza Legal</strong> con políticas claras y transparentes, 
                      cumplimiento con normativas paraguayas (Ley 7593/2025, GAFILAT, SEPRELAD), y <strong>blindaje legal</strong> 
                      para inversores que garantiza protección ante cambios regulatorios.
                    </p>
                    <p className="text-xs text-white/70 italic">
                      Riesgo mitigado: La plataforma opera bajo estrictos estándares de compliance desde el día 1.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Comparación Inversor Tradicional vs GEP */}
            <div className="mt-8 p-6 rounded-lg bg-[#0E1B2A]/80 border-2 border-[#C9A24D]/50">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">📊 Comparación: Inversor Tradicional vs Inversor GEP</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-5 rounded-lg bg-white/5 border border-white/20">
                  <h4 className="font-bold text-lg text-white mb-4">Inversor Tradicional</h4>
                  <ul className="space-y-2 text-sm text-white/90">
                    <li>• <strong>Inversión:</strong> {formatGuaranies(valuationParaguay.roiInversor.inversionInicial)}</li>
                    <li>• <strong>ROI esperado:</strong> {valuationParaguay.roiInversor.porcentaje.min}% - {valuationParaguay.roiInversor.porcentaje.max}%</li>
                    <li>• <strong>Acceso:</strong> Casos generales después de ventana GEP</li>
                    <li>• <strong>Tiempo retorno:</strong> 3 años</li>
                    <li>• <strong>Ventajas:</strong> Mayor participación en equity</li>
                  </ul>
                </div>
                <div className="p-5 rounded-lg bg-[#C9A24D]/20 border-2 border-[#C9A24D]/50">
                  <h4 className="font-bold text-lg text-white mb-4">👑 Inversor GEP</h4>
                  <ul className="space-y-2 text-sm text-white/90">
                    <li>• <strong>Inversión:</strong> {formatGuaranies(valuationParaguay.roiGep.inversionGep)} <span className="text-[#C9A24D]">(75x menor)</span></li>
                    <li>• <strong>ROI esperado:</strong> {valuationParaguay.roiGep.porcentaje.min}% - {valuationParaguay.roiGep.porcentaje.max}% <span className="text-[#C9A24D]">(91x mayor ROI %)</span></li>
                    <li>• <strong>Acceso:</strong> Prioridad exclusiva 24-48h en casos de alto valor</li>
                    <li>• <strong>Tiempo retorno:</strong> 3 años</li>
                    <li>• <strong>Ventajas adicionales:</strong> Prioridad en evaluación, acceso casos internacionales, construcción de marca</li>
                  </ul>
                </div>
              </div>
              <div className="mt-6 p-4 rounded-lg bg-[#C9A24D]/30 border border-[#C9A24D]/50">
                <p className="text-sm text-white/90 text-center">
                  <strong className="text-white">Conclusión:</strong> El modelo GEP ofrece <strong className="text-[#C9A24D]">mayor eficiencia de capital</strong> 
                  con una inversión 75 veces menor pero un ROI porcentual 91 veces superior, además de ventajas estratégicas exclusivas 
                  que no están disponibles para inversores tradicionales.
                </p>
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
