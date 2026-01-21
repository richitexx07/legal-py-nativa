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
  
  // Costos operativos reales
  costosOperativos: {
    marketingMensual: number;
    marketingAnual: number;
    desarrolloMensual: number;
    desarrollo6Meses: number;
    operacionesMensual: number;
    operacionesAnual: number;
    softwareHardware: number;
    manoObraMensual: number;
    manoObraAnual: number;
    totalPrimerAno: number;
  };
  
  // Inversión realista necesaria
  inversionRealista: {
    minimo6Meses: number;
    recomendada12Meses: number;
    optima18Meses: number;
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
  
  // Costos operativos reales de la startup
  costosOperativos: {
    // Marketing/Publicidad (empresa tercerizada)
    marketingMensual: 6000000, // G. 6.000.000/mes
    marketingAnual: 6000000 * 12, // G. 72.000.000/año
    
    // Desarrollo (desarrolladores)
    desarrolloMensual: 20000000, // G. 20.000.000/mes (equipo de 2-3 devs)
    desarrollo6Meses: 20000000 * 6, // G. 120.000.000 (primeros 6 meses críticos)
    
    // Operaciones y logística
    operacionesMensual: 8000000, // G. 8.000.000/mes
    operacionesAnual: 8000000 * 12, // G. 96.000.000/año
    
    // Software y hardware
    softwareHardware: 25000000, // G. 25.000.000 inicial + mantenimiento
    
    // Mano de obra general (soporte, administración, etc.)
    manoObraMensual: 12000000, // G. 12.000.000/mes
    manoObraAnual: 12000000 * 12, // G. 144.000.000/año
    
    // Total primer año (operaciones completas)
    totalPrimerAno: (6000000 * 12) + (20000000 * 6) + (8000000 * 12) + 25000000 + (12000000 * 12),
  },
  
  // Inversión realista necesaria para operar 12 meses y escalar
  inversionRealista: {
    // Inversión mínima para 6 meses de operación
    minimo6Meses: (6000000 * 6) + (20000000 * 6) + (8000000 * 6) + 25000000 + (12000000 * 6),
    
    // Inversión recomendada para 12 meses (operaciones completas + buffer)
    recomendada12Meses: (6000000 * 12) + (20000000 * 6) + (8000000 * 12) + 25000000 + (12000000 * 12) + 50000000, // +50M buffer
    
    // Inversión óptima para escalar (18 meses)
    optima18Meses: (6000000 * 18) + (20000000 * 9) + (8000000 * 18) + 30000000 + (12000000 * 18) + 80000000, // +80M para escalabilidad
  },
  
  roiInversor: {
    // Ajustado a inversión realista
    inversionInicial: 457000000, // G. 457.000.000 (inversión recomendada 12 meses)
    valorEsperado3Anos: {
      min: 2362500000,
      max: 3150000000,
    },
    porcentaje: {
      min: 417, // ROI ajustado: (2.362.500.000 - 457.000.000) / 457.000.000 * 100
      max: 590, // ROI ajustado: (3.150.000.000 - 457.000.000) / 457.000.000 * 100
    },
  },
  
  roiGep: {
    // Inversión GEP ajustada (participación menor pero realista)
    inversionGep: 50000000, // G. 50.000.000 (realista para socio estratégico)
    valorEsperado3Anos: {
      min: 720000000, // Participación proporcional ajustada
      max: 1200000000, // Participación proporcional ajustada
    },
    porcentaje: {
      min: 1340, // ROI ajustado: (720.000.000 - 50.000.000) / 50.000.000 * 100
      max: 2300, // ROI ajustado: (1.200.000.000 - 50.000.000) / 50.000.000 * 100
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
