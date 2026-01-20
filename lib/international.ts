// Sistema de Derivación Priorizada por Perfil Técnico (DPT) para casos internacionales - Legal PY

import { Case } from "./cases";

/**
 * Tipo de caso según jurisdicción
 */
export type CaseJurisdiction = "nacional" | "internacional";

/**
 * Estado del caso en el embudo de derivación ética
 */
export type InternationalCaseStatus =
  | "pendiente_revision"
  | "en_embudo"
  | "en_evaluacion_gep" // Caso en evaluación prioritaria GEP
  | "asignado_gep"
  | "asignado_consorcio_tier_premium"
  | "asignado_consorcio_tier_standard"
  | "rechazado"
  | "completado";

/**
 * Tipo de asignación (sin subastas)
 */
export type AssignmentType = "gep_gold" | "consorcio_tier_premium" | "consorcio_tier_standard";

/**
 * Consorcio legal
 */
export interface LegalConsortium {
  id: string;
  name: string;
  description: string;
  countries: string[]; // Países donde operan
  specialties: string[]; // Especialidades legales
  rating: number; // Rating del consorcio
  casesCompleted: number; // Casos completados
  successRate: number; // Tasa de éxito (%)
  logo?: string; // URL del logo
  contactEmail: string;
  website?: string;
  tier?: "premium" | "standard"; // Tier del consorcio
}

/**
 * Perfil técnico del caso (para derivación ética)
 */
export interface CaseTechnicalProfile {
  categoria: string; // Ej: "Derecho Corporativo", "Arbitraje Internacional"
  nivelComplejidad: "baja" | "media" | "alta" | "muy_alta";
  jurisdiccion: string[]; // Jurisdicciones involucradas
  especialidadesRequeridas: string[]; // Especialidades legales necesarias
  experienciaMinima?: number; // Años de experiencia mínima
}

/**
 * Estado de derivación ética
 */
export interface DerivationStatus {
  estado: "pendiente_gep" | "en_evaluacion_gep" | "derivado_gep" | "derivado_tier_premium" | "derivado_tier_standard";
  fechaDerivacion?: string;
  razonDerivacion?: string; // Por qué se derivó a este consorcio
  perfilTecnicoCoincidente?: string[]; // Qué aspectos del perfil coincidieron
}

/**
 * Configuración GEP Gold
 */
export interface GEPConfiguration {
  prioridad: boolean; // Tiene prioridad en asignación
  ventanaEvaluacion: number; // Horas para evaluar (ej: 48)
  perfilTecnicoRequerido?: CaseTechnicalProfile; // Perfil que debe coincidir
}

/**
 * Caso internacional extendido
 */
export interface InternationalCase extends Case {
  // Clasificación
  jurisdiction: CaseJurisdiction;
  isInternational: boolean;
  
  // Monto y valoración
  estimatedAmount: number; // Monto estimado en USD
  currency: "USD";
  minimumAmount: number; // Monto mínimo requerido (USD 5000)
  
  // Embudo de derivación ética
  internationalStatus: InternationalCaseStatus;
  assignmentType?: AssignmentType;
  
  // GEP Gold
  gepGoldEligible: boolean;
  gepGoldAssigned?: boolean;
  gepGoldResponse?: "aceptado" | "declinado" | "pendiente";
  gepGoldResponseDate?: string;
  gepGoldResponseNotes?: string;
  gepConfiguration?: GEPConfiguration;
  
  // Consorcios Tier Premium
  tierPremiumEligible: boolean;
  tierPremiumAssigned?: string[]; // IDs de consorcios Tier Premium asignados
  tierPremiumResponses?: Record<string, "aceptado" | "declinado" | "pendiente">;
  
  // Consorcios Tier Standard
  tierStandardEligible: boolean;
  tierStandardAssigned?: string[]; // IDs de consorcios Tier Standard asignados
  tierStandardResponses?: Record<string, "aceptado" | "declinado" | "pendiente">;
  
  // Perfil técnico y derivación
  technicalProfile: CaseTechnicalProfile;
  derivationStatus: DerivationStatus;
  
  // Información adicional
  countriesInvolved: string[]; // Países involucrados
  languagesRequired: string[]; // Idiomas requeridos
  complexity: "baja" | "media" | "alta" | "muy_alta";
  urgency: "normal" | "alta" | "urgente";
}

/**
 * Datos para crear un caso internacional
 */
export interface CreateInternationalCaseData {
  caseId: string; // ID del caso base
  estimatedAmount: number; // En USD
  countriesInvolved: string[];
  languagesRequired?: string[];
  complexity?: "baja" | "media" | "alta" | "muy_alta";
  urgency?: "normal" | "alta" | "urgente";
  categoria?: string; // Categoría legal del caso
  especialidadesRequeridas?: string[]; // Especialidades necesarias
}

/**
 * Respuesta de GEP Gold
 */
export interface GEPGoldResponse {
  caseId: string;
  response: "aceptado" | "declinado";
  notes?: string;
}

/**
 * Respuesta de consorcio
 */
export interface ConsortiumResponse {
  caseId: string;
  consortiumId: string;
  response: "aceptado" | "declinado";
  notes?: string;
}

// --- Constantes ---

const MINIMUM_AMOUNT_USD = 5000;
const GEP_EVALUATION_WINDOW_HOURS = 48; // Ventana de evaluación GEP: 48 horas

// --- Mock Data: Top 5 Consorcios Legales (con Tiers) ---

export const TOP_5_CONSORTIA: LegalConsortium[] = [
  {
    id: "cons_1",
    name: "Global Legal Alliance",
    description: "Consorcio internacional con presencia en 40+ países, especializado en derecho corporativo y transacciones internacionales.",
    countries: ["Paraguay", "Argentina", "Brasil", "Chile", "Uruguay", "Estados Unidos", "España", "Reino Unido"],
    specialties: ["Derecho Corporativo", "Fusiones y Adquisiciones", "Compliance", "Arbitraje Internacional"],
    rating: 4.9,
    casesCompleted: 1250,
    successRate: 94,
    tier: "premium",
    contactEmail: "contact@globallegalalliance.com",
    website: "https://globallegalalliance.com",
  },
  {
    id: "cons_2",
    name: "International Law Partners",
    description: "Red de bufetes independientes con expertise en derecho internacional, comercio exterior e inversiones.",
    countries: ["Paraguay", "Brasil", "México", "Colombia", "Perú", "Estados Unidos", "Canadá"],
    specialties: ["Comercio Internacional", "Inversiones Extranjeras", "Propiedad Intelectual", "Resolución de Disputas"],
    rating: 4.8,
    casesCompleted: 980,
    successRate: 91,
    tier: "premium",
    contactEmail: "info@ilpartners.com",
    website: "https://ilpartners.com",
  },
  {
    id: "cons_3",
    name: "Latin American Legal Network",
    description: "Consorcio especializado en derecho latinoamericano con fuerte presencia en mercados emergentes.",
    countries: ["Paraguay", "Argentina", "Brasil", "Chile", "Colombia", "México", "Perú"],
    specialties: ["Derecho Laboral Internacional", "Migraciones", "Constitución de Empresas", "Tributación Internacional"],
    rating: 4.7,
    casesCompleted: 750,
    successRate: 89,
    tier: "premium",
    contactEmail: "contact@laln.com",
    website: "https://laln.com",
  },
  {
    id: "cons_4",
    name: "Transatlantic Legal Group",
    description: "Bufete internacional con expertise en transacciones transatlánticas y derecho europeo-latinoamericano.",
    countries: ["Paraguay", "España", "Portugal", "Reino Unido", "Alemania", "Francia", "Estados Unidos"],
    specialties: ["Derecho Europeo", "Regulación Financiera", "Protección de Datos", "Derecho Marítimo"],
    rating: 4.8,
    casesCompleted: 650,
    successRate: 92,
    tier: "standard",
    contactEmail: "info@transatlanticlegal.com",
    website: "https://transatlanticlegal.com",
  },
  {
    id: "cons_5",
    name: "Pacific Rim Legal Consortium",
    description: "Red de bufetes con enfoque en comercio Asia-Pacífico y derecho empresarial internacional.",
    countries: ["Paraguay", "China", "Japón", "Corea del Sur", "Singapur", "Australia", "Nueva Zelanda"],
    specialties: ["Comercio Asia-Pacífico", "Derecho Contractual Internacional", "Arbitraje", "Propiedad Industrial"],
    rating: 4.6,
    casesCompleted: 520,
    successRate: 88,
    tier: "standard",
    contactEmail: "contact@pacificrimlegal.com",
    website: "https://pacificrimlegal.com",
  },
];

// --- Funciones de Gestión ---

/**
 * Determina si un caso es internacional
 */
export function isInternationalCase(caseData: Case, estimatedAmountUSD: number): boolean {
  // Criterios para caso internacional:
  // 1. Monto mínimo de USD 5000
  // 2. Múltiples países involucrados (se puede inferir de tags, descripción, etc.)
  // 3. O explícitamente marcado como internacional
  
  if (estimatedAmountUSD < MINIMUM_AMOUNT_USD) {
    return false;
  }
  
  // Verificar tags o descripción para indicadores internacionales
  const hasInternationalTags = caseData.tags?.some((tag) =>
    ["internacional", "international", "multijurisdiccional", "cross-border"].includes(
      tag.toLowerCase()
    )
  );
  
  return hasInternationalTags || estimatedAmountUSD >= MINIMUM_AMOUNT_USD;
}

/**
 * Crea un caso internacional a partir de un caso base
 */
export function createInternationalCase(
  caseData: Case,
  data: CreateInternationalCaseData
): { success: boolean; internationalCase?: InternationalCase; error?: string } {
  // Validaciones
  if (data.estimatedAmount < MINIMUM_AMOUNT_USD) {
    return {
      success: false,
      error: `El monto estimado debe ser al menos USD ${MINIMUM_AMOUNT_USD.toLocaleString()}`,
    };
  }
  
  if (!data.countriesInvolved || data.countriesInvolved.length === 0) {
    return {
      success: false,
      error: "Debe especificar al menos un país involucrado",
    };
  }
  
  const isInternational = isInternationalCase(caseData, data.estimatedAmount);
  
  if (!isInternational) {
    return {
      success: false,
      error: "El caso no cumple los criterios para ser clasificado como internacional",
    };
  }
  
  // Crear perfil técnico
  const technicalProfile: CaseTechnicalProfile = {
    categoria: data.categoria || "General",
    nivelComplejidad: data.complexity || "media",
    jurisdiccion: data.countriesInvolved,
    especialidadesRequeridas: data.especialidadesRequeridas || [],
  };
  
  // Configuración GEP
  const gepConfig: GEPConfiguration = {
    prioridad: true,
    ventanaEvaluacion: GEP_EVALUATION_WINDOW_HOURS,
  };
  
  const internationalCase: InternationalCase = {
    ...caseData,
    jurisdiction: "internacional",
    isInternational: true,
    estimatedAmount: data.estimatedAmount,
    currency: "USD",
    minimumAmount: MINIMUM_AMOUNT_USD,
    internationalStatus: "pendiente_revision",
    gepGoldEligible: true,
    tierPremiumEligible: true,
    tierStandardEligible: true,
    technicalProfile,
    derivationStatus: {
      estado: "pendiente_gep",
    },
    gepConfiguration: gepConfig,
    countriesInvolved: data.countriesInvolved,
    languagesRequired: data.languagesRequired || ["Español", "Inglés"],
    complexity: data.complexity || "media",
    urgency: data.urgency || "normal",
  };
  
  // Guardar en localStorage
  saveInternationalCase(internationalCase);
  
  return { success: true, internationalCase };
}

/**
 * Guarda un caso internacional
 */
function saveInternationalCase(caseData: InternationalCase): void {
  if (typeof window === "undefined") return;
  
  const key = "legal-py-international-cases";
  const stored = localStorage.getItem(key);
  let allCases: InternationalCase[] = [];
  
  if (stored) {
    try {
      allCases = JSON.parse(stored);
    } catch {
      allCases = [];
    }
  }
  
  const existingIndex = allCases.findIndex((c) => c.id === caseData.id);
  if (existingIndex >= 0) {
    allCases[existingIndex] = caseData;
  } else {
    allCases.push(caseData);
  }
  
  localStorage.setItem(key, JSON.stringify(allCases));
}

/**
 * Obtiene todos los casos internacionales
 */
export function getAllInternationalCases(): InternationalCase[] {
  if (typeof window === "undefined") return [];
  
  const key = "legal-py-international-cases";
  const stored = localStorage.getItem(key);
  
  if (!stored) return [];
  
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

/**
 * Obtiene un caso internacional por ID
 */
export function getInternationalCaseById(caseId: string): InternationalCase | null {
  const allCases = getAllInternationalCases();
  return allCases.find((c) => c.id === caseId) || null;
}

/**
 * Obtiene casos internacionales filtrados
 */
export function getInternationalCases(filters?: {
  status?: InternationalCaseStatus;
  minAmount?: number;
  countries?: string[];
  complexity?: string;
}): InternationalCase[] {
  let cases = getAllInternationalCases();
  
  if (filters) {
    if (filters.status) {
      cases = cases.filter((c) => c.internationalStatus === filters.status);
    }
    if (filters.minAmount) {
      cases = cases.filter((c) => c.estimatedAmount >= filters.minAmount!);
    }
    if (filters.countries && filters.countries.length > 0) {
      cases = cases.filter((c) =>
        c.countriesInvolved.some((country) => filters.countries!.includes(country))
      );
    }
    if (filters.complexity) {
      cases = cases.filter((c) => c.complexity === filters.complexity);
    }
  }
  
  return cases.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/**
 * Inicia el embudo: Envía a GEP Gold (Evaluación Prioritaria)
 */
export function sendToGEPGold(caseId: string): { success: boolean; error?: string } {
  const caseData = getInternationalCaseById(caseId);
  if (!caseData) {
    return { success: false, error: "Caso internacional no encontrado" };
  }
  
  caseData.internationalStatus = "en_evaluacion_gep";
  caseData.assignmentType = "gep_gold";
  caseData.gepGoldAssigned = true;
  caseData.gepGoldResponse = "pendiente";
  caseData.derivationStatus = {
    estado: "en_evaluacion_gep",
    fechaDerivacion: new Date().toISOString(),
    razonDerivacion: "Derivación prioritaria según perfil técnico del caso",
  };
  
  saveInternationalCase(caseData);
  
  return { success: true };
}

/**
 * Procesa respuesta de GEP Gold
 */
export function processGEPGoldResponse(
  response: GEPGoldResponse
): { success: boolean; error?: string } {
  const caseData = getInternationalCaseById(response.caseId);
  if (!caseData) {
    return { success: false, error: "Caso internacional no encontrado" };
  }
  
  caseData.gepGoldResponse = response.response;
  caseData.gepGoldResponseDate = new Date().toISOString();
  if (response.notes) {
    caseData.gepGoldResponseNotes = response.notes;
  }
  
  if (response.response === "aceptado") {
    caseData.internationalStatus = "asignado_gep";
    caseData.derivationStatus = {
      estado: "derivado_gep",
      fechaDerivacion: new Date().toISOString(),
      razonDerivacion: "GEP Gold aceptó el caso según perfil técnico",
    };
  } else {
    // Si GEP Gold declina, derivar a Tier Premium según perfil técnico
    caseData.internationalStatus = "asignado_consorcio_tier_premium";
    caseData.assignmentType = "consorcio_tier_premium";
    deriveToTierPremium(response.caseId);
  }
  
  saveInternationalCase(caseData);
  
  return { success: true };
}

/**
 * Deriva caso a Consorcios Tier Premium según perfil técnico
 */
export function deriveToTierPremium(caseId: string): { success: boolean; error?: string } {
  const caseData = getInternationalCaseById(caseId);
  if (!caseData) {
    return { success: false, error: "Caso internacional no encontrado" };
  }
  
  // Obtener consorcios Tier Premium
  const tierPremiumConsortia = TOP_5_CONSORTIA.filter((c) => c.tier === "premium");
  
  // Filtrar por coincidencia de perfil técnico
  const matchingConsortia = tierPremiumConsortia.filter((consortium) => {
    const caseSpecialties = caseData.technicalProfile.especialidadesRequeridas || [];
    return caseSpecialties.some((spec) => consortium.specialties.includes(spec));
  });
  
  // Si hay coincidencias, usar esos; si no, usar todos los Tier Premium
  const consortiaToAssign = matchingConsortia.length > 0 ? matchingConsortia : tierPremiumConsortia;
  
  caseData.internationalStatus = "asignado_consorcio_tier_premium";
  caseData.assignmentType = "consorcio_tier_premium";
  caseData.tierPremiumAssigned = consortiaToAssign.map((c) => c.id);
  caseData.tierPremiumResponses = {};
  
  // Inicializar respuestas como pendientes
  consortiaToAssign.forEach((consortium) => {
    caseData.tierPremiumResponses![consortium.id] = "pendiente";
  });
  
  // Actualizar estado de derivación
  const coincidencias = matchingConsortia.length > 0
    ? matchingConsortia.map((c) => c.name)
    : ["Derivación automática a Tier Premium"];
  
  caseData.derivationStatus = {
    estado: "derivado_tier_premium",
    fechaDerivacion: new Date().toISOString(),
    razonDerivacion: "Derivación ética a consorcios Tier Premium según perfil técnico",
    perfilTecnicoCoincidente: coincidencias,
  };
  
  saveInternationalCase(caseData);
  
  return { success: true };
}

/**
 * Deriva caso a Consorcios Tier Standard según perfil técnico
 */
export function deriveToTierStandard(caseId: string): { success: boolean; error?: string } {
  const caseData = getInternationalCaseById(caseId);
  if (!caseData) {
    return { success: false, error: "Caso internacional no encontrado" };
  }
  
  // Obtener consorcios Tier Standard
  const tierStandardConsortia = TOP_5_CONSORTIA.filter((c) => c.tier === "standard");
  
  // Filtrar por coincidencia de perfil técnico
  const matchingConsortia = tierStandardConsortia.filter((consortium) => {
    const caseSpecialties = caseData.technicalProfile.especialidadesRequeridas || [];
    return caseSpecialties.some((spec) => consortium.specialties.includes(spec));
  });
  
  // Si hay coincidencias, usar esos; si no, usar todos los Tier Standard
  const consortiaToAssign = matchingConsortia.length > 0 ? matchingConsortia : tierStandardConsortia;
  
  caseData.internationalStatus = "asignado_consorcio_tier_standard";
  caseData.assignmentType = "consorcio_tier_standard";
  caseData.tierStandardAssigned = consortiaToAssign.map((c) => c.id);
  caseData.tierStandardResponses = {};
  
  // Inicializar respuestas como pendientes
  consortiaToAssign.forEach((consortium) => {
    caseData.tierStandardResponses![consortium.id] = "pendiente";
  });
  
  // Actualizar estado de derivación
  const coincidencias = matchingConsortia.length > 0
    ? matchingConsortia.map((c) => c.name)
    : ["Derivación automática a Tier Standard"];
  
  caseData.derivationStatus = {
    estado: "derivado_tier_standard",
    fechaDerivacion: new Date().toISOString(),
    razonDerivacion: "Derivación ética a consorcios Tier Standard según perfil técnico",
    perfilTecnicoCoincidente: coincidencias,
  };
  
  saveInternationalCase(caseData);
  
  return { success: true };
}

/**
 * Procesa respuesta de consorcio (Tier Premium o Standard)
 */
export function processConsortiumResponse(
  response: ConsortiumResponse
): { success: boolean; error?: string } {
  const caseData = getInternationalCaseById(response.caseId);
  if (!caseData) {
    return { success: false, error: "Caso internacional no encontrado" };
  }
  
  // Determinar si es Tier Premium o Standard
  const isTierPremium = caseData.tierPremiumAssigned?.includes(response.consortiumId);
  const isTierStandard = caseData.tierStandardAssigned?.includes(response.consortiumId);
  
  if (isTierPremium) {
    if (!caseData.tierPremiumResponses) {
      caseData.tierPremiumResponses = {};
    }
    caseData.tierPremiumResponses[response.consortiumId] = response.response;
    
    // Verificar si todos respondieron
    const allResponded = caseData.tierPremiumAssigned!.every(
      (id) => caseData.tierPremiumResponses![id] !== "pendiente"
    );
    
    if (allResponded) {
      const hasAcceptance = Object.values(caseData.tierPremiumResponses).some(
        (r) => r === "aceptado"
      );
      
      if (hasAcceptance) {
        // Asignar al primer consorcio que aceptó
        const acceptedConsortium = Object.entries(caseData.tierPremiumResponses).find(
          ([_, r]) => r === "aceptado"
        );
        if (acceptedConsortium) {
          caseData.internationalStatus = "asignado_consorcio_tier_premium";
          caseData.professionalId = acceptedConsortium[0];
        }
      } else {
        // Si todos declinaron, derivar a Tier Standard
        deriveToTierStandard(response.caseId);
      }
    }
  } else if (isTierStandard) {
    if (!caseData.tierStandardResponses) {
      caseData.tierStandardResponses = {};
    }
    caseData.tierStandardResponses[response.consortiumId] = response.response;
    
    // Verificar si todos respondieron
    const allResponded = caseData.tierStandardAssigned!.every(
      (id) => caseData.tierStandardResponses![id] !== "pendiente"
    );
    
    if (allResponded) {
      const hasAcceptance = Object.values(caseData.tierStandardResponses).some(
        (r) => r === "aceptado"
      );
      
      if (hasAcceptance) {
        // Asignar al primer consorcio que aceptó
        const acceptedConsortium = Object.entries(caseData.tierStandardResponses).find(
          ([_, r]) => r === "aceptado"
        );
        if (acceptedConsortium) {
          caseData.internationalStatus = "asignado_consorcio_tier_standard";
          caseData.professionalId = acceptedConsortium[0];
        }
      } else {
        // Si todos declinaron, marcar como rechazado
        caseData.internationalStatus = "rechazado";
        caseData.derivationStatus = {
          estado: "derivado_tier_standard",
          fechaDerivacion: new Date().toISOString(),
          razonDerivacion: "Todos los consorcios declinaron. Caso marcado como rechazado.",
        };
      }
    }
  }
  
  saveInternationalCase(caseData);
  
  return { success: true };
}

/**
 * Función legacy: Envía caso a Top 5 Consorcios (ahora usa Tier Premium)
 * Mantenida para compatibilidad, pero internamente usa deriveToTierPremium
 */
export function sendToTop5Consortia(caseId: string): { success: boolean; error?: string } {
  return deriveToTierPremium(caseId);
}

/**
 * Obtiene Top 5 Consorcios
 */
export function getTop5Consortia(): LegalConsortium[] {
  return TOP_5_CONSORTIA;
}

/**
 * Obtiene consorcios Tier Premium
 */
export function getTierPremiumConsortia(): LegalConsortium[] {
  return TOP_5_CONSORTIA.filter((c) => c.tier === "premium");
}

/**
 * Obtiene consorcios Tier Standard
 */
export function getTierStandardConsortia(): LegalConsortium[] {
  return TOP_5_CONSORTIA.filter((c) => c.tier === "standard");
}

/**
 * Obtiene un consorcio por ID
 */
export function getConsortiumById(consortiumId: string): LegalConsortium | null {
  return TOP_5_CONSORTIA.find((c) => c.id === consortiumId) || null;
}
