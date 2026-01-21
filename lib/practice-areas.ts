/**
 * CATEGORÍAS DE SERVICIO - BASADAS EN INVESTIGACIÓN DE MERCADO
 * Alineadas con la demanda real y rentable del sector legal paraguayo
 * (Vouga, Ferrere, Escribanías)
 */

export interface PracticeArea {
  id: string;
  name: string;
  category: "HIGH_TICKET" | "VOLUME" | "NICHE" | "CASH_FLOW";
  description: string;
  tooltip: string;
  icon: string;
  examples: string[];
}

export const PRACTICE_AREAS: PracticeArea[] = [
  // ===== CORPORATIVO & INVERSIONES (High Ticket) =====
  {
    id: "CORPORATIVO_EAS",
    name: "Constitución de EAS",
    category: "HIGH_TICKET",
    description: "Empresas por Acciones Simplificadas para inversores",
    tooltip: "Ideal para: Abrir empresas, Inversión Extranjera, Startups",
    icon: "🏢",
    examples: ["Constitución de EAS", "Apertura de empresas", "Inversión extranjera"],
  },
  {
    id: "MIGRACIONES_INVERSIONISTAS",
    name: "Radicación y Residencia para Inversionistas",
    category: "HIGH_TICKET",
    description: "Trámites migratorios para inversores extranjeros",
    tooltip: "Ideal para: Inversores extranjeros, Residencia permanente, Visa de inversionista",
    icon: "🌎",
    examples: ["Residencia para inversionistas", "Radicación empresarial", "Visa de inversionista"],
  },
  {
    id: "DUE_DILIGENCE",
    name: "Due Diligence de Tierras/Inmuebles",
    category: "HIGH_TICKET",
    description: "Verificación legal de propiedades y tierras",
    tooltip: "Ideal para: Compra de tierras, Verificación de títulos, Inversión inmobiliaria",
    icon: "🏞️",
    examples: ["Due diligence inmobiliario", "Verificación de títulos", "Análisis de propiedades"],
  },

  // ===== PROPIEDAD INTELECTUAL (Volumen) =====
  {
    id: "MARCAS_DINAPI",
    name: "Registro de Marcas (DINAPI)",
    category: "VOLUME",
    description: "Registro y protección de marcas comerciales",
    tooltip: "Ideal para: Proteger tu marca, Registro comercial, Propiedad intelectual",
    icon: "™️",
    examples: ["Registro de marca", "Protección de marca", "DINAPI"],
  },
  {
    id: "SOFTWARE_DERECHOS",
    name: "Protección de Software y Derechos de Autor",
    category: "VOLUME",
    description: "Registro de software y protección de derechos de autor",
    tooltip: "Ideal para: Desarrolladores, Empresas tech, Protección de código",
    icon: "💻",
    examples: ["Registro de software", "Derechos de autor", "Protección de código"],
  },

  // ===== COMERCIO EXTERIOR (Nicho Aduanas) =====
  {
    id: "SUMARIOS_ADUANEROS",
    name: "Sumarios Aduaneros",
    category: "NICHE",
    description: "Defensa en procesos aduaneros y sumarios",
    tooltip: "Ideal para: Importadores, Exportadores, Defensa aduanera",
    icon: "📦",
    examples: ["Sumario aduanero", "Defensa aduanera", "Procesos de importación"],
  },
  {
    id: "LOGISTICA_FLUVIAL",
    name: "Contratos de Logística Fluvial",
    category: "NICHE",
    description: "Contratos y regulación de transporte fluvial",
    tooltip: "Ideal para: Empresas de transporte, Logística, Comercio fluvial",
    icon: "🚢",
    examples: ["Contratos fluviales", "Logística de transporte", "Comercio fluvial"],
  },

  // ===== LITIGIOS & RECUPERACIÓN (Cash Flow) =====
  {
    id: "COBRO_EJECUTIVO",
    name: "Cobro de Pagarés y Cheques (Ejecutivos)",
    category: "CASH_FLOW",
    description: "Recuperación de créditos mediante títulos ejecutivos",
    tooltip: "Ideal para: Cobro de deudas, Pagarés, Cheques rebotados, Recuperación de créditos",
    icon: "💰",
    examples: ["Cobro de pagaré", "Cheque rebotado", "Título ejecutivo", "Recuperación de crédito"],
  },
  {
    id: "FAMILIA_SUCESIONES",
    name: "Sucesiones y Divorcios (Familia)",
    category: "CASH_FLOW",
    description: "Procesos de familia, sucesiones y divorcios",
    tooltip: "Ideal para: Divorcios, Sucesiones, Alimentos, Custodia",
    icon: "👨‍👩‍👧‍👦",
    examples: ["Divorcio", "Sucesión", "Alimentos", "Custodia"],
  },
];

/**
 * Obtiene las áreas de práctica por categoría
 */
export function getPracticeAreasByCategory(category: PracticeArea["category"]): PracticeArea[] {
  return PRACTICE_AREAS.filter((area) => area.category === category);
}

/**
 * Obtiene un área de práctica por ID
 */
export function getPracticeAreaById(id: string): PracticeArea | undefined {
  return PRACTICE_AREAS.find((area) => area.id === id);
}

/**
 * Busca áreas de práctica por texto (para búsqueda/autocompletado)
 */
export function searchPracticeAreas(query: string): PracticeArea[] {
  const normalizedQuery = query.toLowerCase();
  return PRACTICE_AREAS.filter(
    (area) =>
      area.name.toLowerCase().includes(normalizedQuery) ||
      area.description.toLowerCase().includes(normalizedQuery) ||
      area.examples.some((ex) => ex.toLowerCase().includes(normalizedQuery))
  );
}
