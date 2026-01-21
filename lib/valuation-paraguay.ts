/**
 * Valuación Legal PY ajustada al mercado paraguayo
 * Tipo de cambio: 1 USD = 7.500 Gs (estimación conservadora 2026)
 */

export interface ValuationParaguay {
  // Métricas base
  ingresosAnualesAño1: {
    usd: number;
    guaranies: number;
  };
  
  // Valuación por método
  valuacionMetodo1: {
    nombre: string;
    descripcion: string;
    multiplicador: string;
    valorMin: number; // en guaraníes
    valorMax: number; // en guaraníes
    valorMinUSD: number;
    valorMaxUSD: number;
  };
  
  valuacionMetodo2: {
    nombre: string;
    descripcion: string;
    descuento: string;
    valor: number; // en guaraníes
    valorUSD: number;
  };
  
  // Valuación final recomendada
  valuacionFinal: {
    min: number; // guaraníes
    max: number; // guaraníes
    minUSD: number;
    maxUSD: number;
    justificacion: string;
  };
  
  // ROI Inversor
  roiInversor: {
    inversionInicial: number; // guaraníes
    valorEsperado3Anos: {
      min: number;
      max: number;
    };
    porcentaje: {
      min: number;
      max: number;
    };
  };
  
  // ROI GEP
  roiGep: {
    inversionGep: number; // guaraníes
    valorEsperado3Anos: {
      min: number;
      max: number;
    };
    porcentaje: {
      min: number;
      max: number;
    };
  };
}

const TIPO_CAMBIO = 7500; // 1 USD = 7.500 Gs

export const valuationParaguay: ValuationParaguay = {
  ingresosAnualesAño1: {
    usd: 1350000,
    guaranies: 1350000 * TIPO_CAMBIO, // G. 10.125.000.000
  },
  
  valuacionMetodo1: {
    nombre: "Múltiplo de Ingresos Reales",
    descripcion: "Metodología estándar para startups SaaS en mercado paraguayo. Aplica múltiplos conservadores de 2.5x a 3.5x ingresos anuales proyectados.",
    multiplicador: "2.5x - 3.5x",
    valorMin: 10125000000 * 2.5, // G. 25.312.500.000
    valorMax: 10125000000 * 3.5, // G. 35.437.500.000
    valorMinUSD: 3375000,
    valorMaxUSD: 4725000,
  },
  
  valuacionMetodo2: {
    nombre: "Scorecard Ajustado",
    descripcion: "Comparación con startups similares en Uruguay/Chile, aplicando descuento de mercado local del 30%.",
    descuento: "-30%",
    valor: 40500000000 * 0.7, // G. 28.350.000.000 (después del 30% de descuento)
    valorUSD: 3780000,
  },
  
  valuacionFinal: {
    min: 2362500000, // G. 2.362.500.000 (promedio conservador)
    max: 3937500000, // G. 3.937.500.000
    minUSD: 315000,
    maxUSD: 525000,
    justificacion: `Esta valuación aplica un enfoque conservador y realista para el mercado paraguayo, 
    considerando el menor apetito de riesgo, la necesidad de demostrar rentabilidad temprana, y el descuento 
    por liquidez de mercado. El rango se basa en múltiplos de 2x-3x ingresos anuales proyectados, ajustado por 
    el perfil de riesgo país y las expectativas de inversores locales (Ángeles, Family Offices, Fondos locales).`,
  },
  
  roiInversor: {
    inversionInicial: 750000000, // G. 750.000.000
    valorEsperado3Anos: {
      min: 2362500000,
      max: 3150000000,
    },
    porcentaje: {
      min: 315,
      max: 420,
    },
  },
  
  roiGep: {
    inversionGep: 10000000, // G. 10.000.000
    valorEsperado3Anos: {
      min: 2880000000, // G. 2.880.000.000
      max: 4800000000, // G. 4.800.000.000
    },
    porcentaje: {
      min: 28800,
      max: 48000,
    },
  },
};

/**
 * Formatea números grandes en guaraníes con separadores
 */
export function formatGuaranies(amount: number): string {
  return new Intl.NumberFormat('es-PY', {
    style: 'currency',
    currency: 'PYG',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace('PYG', 'G.');
}

/**
 * Formatea números en USD
 */
export function formatUSD(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
