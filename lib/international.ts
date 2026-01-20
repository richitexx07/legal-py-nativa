// Sistema de filtrado y gestión de casos internacionales para Legal PY

import { Case } from "./cases";

/**
 * Tipo de caso según jurisdicción
 */
export type CaseJurisdiction = "nacional" | "internacional";

/**
 * Estado del caso en el embudo internacional
 */
export type InternationalCaseStatus =
  | "pendiente_revision"
  | "en_embudo"
  | "asignado_gep"
  | "asignado_consorcio"
  | "en_subasta"
  | "asignado_subasta"
  | "rechazado"
  | "completado";

/**
 * Tipo de asignación
 */
export type AssignmentType = "gep_gold" | "consorcio" | "subasta";

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
}

/**
 * Oferta en subasta
 */
export interface AuctionBid {
  id: string;
  consortiumId: string;
  consortiumName: string;
  amount: number; // Monto en USD
  currency: "USD";
  proposedFee: number; // Honorarios propuestos (% del monto del caso)
  estimatedTime: string; // Tiempo estimado (ej: "3-6 meses")
  notes?: string; // Notas adicionales
  submittedAt: string; // ISO 8601
  status: "pendiente" | "aceptada" | "rechazada";
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
  
  // Embudo internacional
  internationalStatus: InternationalCaseStatus;
  assignmentType?: AssignmentType;
  
  // GEP Gold
  gepGoldEligible: boolean;
  gepGoldAssigned?: boolean;
  gepGoldResponse?: "aceptado" | "declinado" | "pendiente";
  gepGoldResponseDate?: string;
  gepGoldResponseNotes?: string;
  
  // Top 5 Consorcios
  top5ConsortiaEligible: boolean;
  top5ConsortiaAssigned?: string[]; // IDs de consorcios asignados
  top5ConsortiaResponses?: Record<string, "aceptado" | "declinado" | "pendiente">;
  
  // Subasta
  auctionEligible: boolean;
  auctionActive: boolean;
  auctionStartDate?: string;
  auctionEndDate?: string;
  auctionBids?: AuctionBid[];
  auctionWinner?: string; // ID del consorcio ganador
  
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

/**
 * Oferta en subasta
 */
export interface SubmitAuctionBid {
  caseId: string;
  consortiumId: string;
  amount: number;
  proposedFee: number;
  estimatedTime: string;
  notes?: string;
}

// --- Constantes ---

const MINIMUM_AMOUNT_USD = 5000;
const TOP_5_CONSORTIA_COUNT = 5;

// --- Mock Data: Top 5 Consorcios Legales ---

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
  
  const internationalCase: InternationalCase = {
    ...caseData,
    jurisdiction: "internacional",
    isInternational: true,
    estimatedAmount: data.estimatedAmount,
    currency: "USD",
    minimumAmount: MINIMUM_AMOUNT_USD,
    internationalStatus: "pendiente_revision",
    gepGoldEligible: true, // Todos los casos internacionales son elegibles para GEP Gold
    top5ConsortiaEligible: true, // Todos son elegibles para Top 5
    auctionEligible: true, // Todos son elegibles para subasta
    auctionActive: false,
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
 * Inicia el embudo: Envía a GEP Gold
 */
export function sendToGEPGold(caseId: string): { success: boolean; error?: string } {
  const caseData = getInternationalCaseById(caseId);
  if (!caseData) {
    return { success: false, error: "Caso internacional no encontrado" };
  }
  
  caseData.internationalStatus = "asignado_gep";
  caseData.assignmentType = "gep_gold";
  caseData.gepGoldAssigned = true;
  caseData.gepGoldResponse = "pendiente";
  
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
  } else {
    // Si GEP Gold declina, enviar a Top 5 Consorcios
    caseData.internationalStatus = "asignado_consorcio";
    caseData.assignmentType = "consorcio";
    sendToTop5Consortia(response.caseId);
  }
  
  saveInternationalCase(caseData);
  
  return { success: true };
}

/**
 * Envía caso a Top 5 Consorcios
 */
export function sendToTop5Consortia(caseId: string): { success: boolean; error?: string } {
  const caseData = getInternationalCaseById(caseId);
  if (!caseData) {
    return { success: false, error: "Caso internacional no encontrado" };
  }
  
  caseData.internationalStatus = "asignado_consorcio";
  caseData.assignmentType = "consorcio";
  caseData.top5ConsortiaAssigned = TOP_5_CONSORTIA.map((c) => c.id);
  caseData.top5ConsortiaResponses = {};
  
  // Inicializar respuestas como pendientes
  TOP_5_CONSORTIA.forEach((consortium) => {
    caseData.top5ConsortiaResponses![consortium.id] = "pendiente";
  });
  
  saveInternationalCase(caseData);
  
  return { success: true };
}

/**
 * Procesa respuesta de consorcio
 */
export function processConsortiumResponse(
  response: ConsortiumResponse
): { success: boolean; error?: string } {
  const caseData = getInternationalCaseById(response.caseId);
  if (!caseData) {
    return { success: false, error: "Caso internacional no encontrado" };
  }
  
  if (!caseData.top5ConsortiaResponses) {
    caseData.top5ConsortiaResponses = {};
  }
  
  caseData.top5ConsortiaResponses[response.consortiumId] = response.response;
  
  // Verificar si todos respondieron
  const allResponded = Object.values(caseData.top5ConsortiaResponses).every(
    (r) => r !== "pendiente"
  );
  
  if (allResponded) {
    // Si todos declinaron o no hay aceptaciones, ir a subasta
    const hasAcceptance = Object.values(caseData.top5ConsortiaResponses).some(
      (r) => r === "aceptado"
    );
    
    if (!hasAcceptance) {
      startAuction(response.caseId);
    } else {
      // Asignar al primer consorcio que aceptó
      const acceptedConsortium = Object.entries(caseData.top5ConsortiaResponses).find(
        ([_, r]) => r === "aceptado"
      );
      if (acceptedConsortium) {
        caseData.internationalStatus = "asignado_consorcio";
        caseData.professionalId = acceptedConsortium[0]; // Usar ID del consorcio
      }
    }
  }
  
  saveInternationalCase(caseData);
  
  return { success: true };
}

/**
 * Inicia subasta de caso
 */
export function startAuction(caseId: string, durationDays: number = 7): { success: boolean; error?: string } {
  const caseData = getInternationalCaseById(caseId);
  if (!caseData) {
    return { success: false, error: "Caso internacional no encontrado" };
  }
  
  const now = new Date();
  const endDate = new Date(now);
  endDate.setDate(endDate.getDate() + durationDays);
  
  caseData.internationalStatus = "en_subasta";
  caseData.assignmentType = "subasta";
  caseData.auctionActive = true;
  caseData.auctionStartDate = now.toISOString();
  caseData.auctionEndDate = endDate.toISOString();
  caseData.auctionBids = [];
  
  saveInternationalCase(caseData);
  
  return { success: true };
}

/**
 * Envía oferta en subasta
 */
export function submitAuctionBid(bid: SubmitAuctionBid): { success: boolean; error?: string } {
  const caseData = getInternationalCaseById(bid.caseId);
  if (!caseData) {
    return { success: false, error: "Caso internacional no encontrado" };
  }
  
  if (!caseData.auctionActive) {
    return { success: false, error: "La subasta no está activa" };
  }
  
  const endDate = caseData.auctionEndDate ? new Date(caseData.auctionEndDate) : null;
  if (endDate && new Date() > endDate) {
    return { success: false, error: "La subasta ha finalizado" };
  }
  
  const consortium = TOP_5_CONSORTIA.find((c) => c.id === bid.consortiumId);
  if (!consortium) {
    return { success: false, error: "Consorcio no encontrado" };
  }
  
  if (!caseData.auctionBids) {
    caseData.auctionBids = [];
  }
  
  const newBid: AuctionBid = {
    id: `bid_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    consortiumId: bid.consortiumId,
    consortiumName: consortium.name,
    amount: bid.amount,
    currency: "USD",
    proposedFee: bid.proposedFee,
    estimatedTime: bid.estimatedTime,
    notes: bid.notes,
    submittedAt: new Date().toISOString(),
    status: "pendiente",
  };
  
  caseData.auctionBids.push(newBid);
  
  saveInternationalCase(caseData);
  
  return { success: true };
}

/**
 * Selecciona ganador de subasta
 */
export function selectAuctionWinner(
  caseId: string,
  bidId: string
): { success: boolean; error?: string } {
  const caseData = getInternationalCaseById(caseId);
  if (!caseData) {
    return { success: false, error: "Caso internacional no encontrado" };
  }
  
  if (!caseData.auctionBids) {
    return { success: false, error: "No hay ofertas en la subasta" };
  }
  
  const bid = caseData.auctionBids.find((b) => b.id === bidId);
  if (!bid) {
    return { success: false, error: "Oferta no encontrada" };
  }
  
  // Marcar todas las ofertas como rechazadas
  caseData.auctionBids.forEach((b) => {
    b.status = b.id === bidId ? "aceptada" : "rechazada";
  });
  
  caseData.auctionWinner = bid.consortiumId;
  caseData.internationalStatus = "asignado_subasta";
  caseData.auctionActive = false;
  caseData.professionalId = bid.consortiumId;
  
  saveInternationalCase(caseData);
  
  return { success: true };
}

/**
 * Obtiene Top 5 Consorcios
 */
export function getTop5Consortia(): LegalConsortium[] {
  return TOP_5_CONSORTIA;
}

/**
 * Obtiene un consorcio por ID
 */
export function getConsortiumById(consortiumId: string): LegalConsortium | null {
  return TOP_5_CONSORTIA.find((c) => c.id === consortiumId) || null;
}
