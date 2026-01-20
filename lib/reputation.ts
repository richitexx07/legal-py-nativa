// Sistema de reputación y antecedentes para profesionales

/**
 * Estados del profesional en la plataforma
 */
export type ProfessionalStatus = "activo" | "suspendido" | "en-revision";

/**
 * Tipo de denuncia
 */
export type ReportType = 
  | "conducta-inapropiada"
  | "servicio-deficiente"
  | "fraude"
  | "comunicacion-inadecuada"
  | "incumplimiento"
  | "otro";

/**
 * Estado de una denuncia
 */
export type ReportStatus = "pendiente" | "en-revision" | "resuelta" | "desestimada";

/**
 * Reseña de un cliente
 */
export interface Review {
  id: string;
  professionalId: string;
  clientId: string; // ID del cliente que hizo la reseña
  clientName: string; // Nombre público (puede ser anónimo)
  rating: number; // 1-5
  comment: string;
  createdAt: string; // ISO 8601 date string
  verified: boolean; // Si el cliente realmente contrató al profesional
  helpful: number; // Contador de "útil"
  response?: {
    // Respuesta del profesional
    text: string;
    createdAt: string;
  };
  tags?: string[]; // Tags como "puntual", "comunicativo", etc.
}

/**
 * Estadísticas de calificación
 */
export interface RatingStats {
  average: number; // Promedio de calificaciones
  total: number; // Total de reseñas
  distribution: {
    // Distribución de calificaciones
    "5": number;
    "4": number;
    "3": number;
    "2": number;
    "1": number;
  };
}

/**
 * Historial de desempeño
 */
export interface PerformanceHistory {
  period: string; // "2024-Q1", "2024", etc.
  casesCompleted: number;
  averageRating: number;
  clientSatisfaction: number; // 0-100
  responseTime: number; // En horas promedio
}

/**
 * Denuncia de un cliente
 */
export interface Report {
  id: string;
  professionalId: string;
  clientId: string;
  type: ReportType;
  title: string;
  description: string;
  status: ReportStatus;
  createdAt: string;
  resolvedAt?: string;
  resolution?: string; // Mensaje de resolución del administrador
  attachments?: string[]; // URLs de archivos adjuntos
}

/**
 * Bloqueo de un profesional por un cliente
 */
export interface Block {
  id: string;
  professionalId: string;
  clientId: string;
  reason?: string;
  createdAt: string;
}

/**
 * Información de reputación del profesional
 */
export interface ProfessionalReputation {
  professionalId: string;
  status: ProfessionalStatus;
  rating: RatingStats;
  reviews: Review[];
  performanceHistory: PerformanceHistory[];
  totalCases: number;
  casesCompleted: number;
  responseRate: number; // Porcentaje de respuesta
  averageResponseTime: number; // En horas
  reports: Report[]; // Solo visibles para administradores
  blockedBy: string[]; // IDs de clientes que bloquearon
  suspensionReason?: string;
  suspensionUntil?: string; // ISO 8601 date string
  lastStatusChange?: string;
}

/**
 * Datos para crear una reseña
 */
export interface CreateReviewData {
  professionalId: string;
  clientId: string;
  rating: number;
  comment: string;
  tags?: string[];
}

/**
 * Datos para crear una denuncia
 */
export interface CreateReportData {
  professionalId: string;
  clientId: string;
  type: ReportType;
  title: string;
  description: string;
  attachments?: File[];
}

/**
 * Obtiene la reputación de un profesional
 */
export function getProfessionalReputation(professionalId: string): ProfessionalReputation | null {
  if (typeof window === "undefined") return null;
  
  const key = `legal-py-reputation-${professionalId}`;
  const stored = localStorage.getItem(key);
  
  if (!stored) {
    // Crear reputación inicial
    const initialReputation: ProfessionalReputation = {
      professionalId,
      status: "activo",
      rating: {
        average: 0,
        total: 0,
        distribution: { "5": 0, "4": 0, "3": 0, "2": 0, "1": 0 },
      },
      reviews: [],
      performanceHistory: [],
      totalCases: 0,
      casesCompleted: 0,
      responseRate: 0,
      averageResponseTime: 0,
      reports: [],
      blockedBy: [],
    };
    saveProfessionalReputation(initialReputation);
    return initialReputation;
  }
  
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

/**
 * Guarda la reputación de un profesional
 */
function saveProfessionalReputation(reputation: ProfessionalReputation): void {
  const key = `legal-py-reputation-${reputation.professionalId}`;
  localStorage.setItem(key, JSON.stringify(reputation));
}

/**
 * Agrega una reseña
 */
export function addReview(data: CreateReviewData): { success: boolean; review?: Review; error?: string } {
  if (data.rating < 1 || data.rating > 5) {
    return { success: false, error: "La calificación debe estar entre 1 y 5" };
  }
  
  if (!data.comment || data.comment.trim().length < 10) {
    return { success: false, error: "El comentario debe tener al menos 10 caracteres" };
  }
  
  const reputation = getProfessionalReputation(data.professionalId);
  if (!reputation) {
    return { success: false, error: "Profesional no encontrado" };
  }
  
  // Verificar si el cliente ya hizo una reseña
  const existingReview = reputation.reviews.find((r) => r.clientId === data.clientId);
  if (existingReview) {
    return { success: false, error: "Ya has dejado una reseña para este profesional" };
  }
  
  const newReview: Review = {
    id: `rev_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    professionalId: data.professionalId,
    clientId: data.clientId,
    clientName: "Cliente", // En producción, obtener del perfil
    rating: data.rating,
    comment: data.comment.trim(),
    createdAt: new Date().toISOString(),
    verified: false, // En producción, verificar que realmente contrató
    helpful: 0,
    tags: data.tags || [],
  };
  
  reputation.reviews.push(newReview);
  
  // Recalcular estadísticas
  reputation.rating.total = reputation.reviews.length;
  reputation.rating.average = 
    reputation.reviews.reduce((sum, r) => sum + r.rating, 0) / reputation.reviews.length;
  
  // Actualizar distribución
  const distribution = { "5": 0, "4": 0, "3": 0, "2": 0, "1": 0 };
  reputation.reviews.forEach((r) => {
    distribution[r.rating.toString() as keyof typeof distribution]++;
  });
  reputation.rating.distribution = distribution;
  
  saveProfessionalReputation(reputation);
  
  return { success: true, review: newReview };
}

/**
 * Marca una reseña como útil
 */
export function markReviewHelpful(reviewId: string, professionalId: string): void {
  const reputation = getProfessionalReputation(professionalId);
  if (!reputation) return;
  
  const review = reputation.reviews.find((r) => r.id === reviewId);
  if (review) {
    review.helpful = (review.helpful || 0) + 1;
    saveProfessionalReputation(reputation);
  }
}

/**
 * El profesional responde a una reseña
 */
export function respondToReview(
  reviewId: string,
  professionalId: string,
  response: string
): { success: boolean; error?: string } {
  const reputation = getProfessionalReputation(professionalId);
  if (!reputation) {
    return { success: false, error: "Reputación no encontrada" };
  }
  
  const review = reputation.reviews.find((r) => r.id === reviewId);
  if (!review) {
    return { success: false, error: "Reseña no encontrada" };
  }
  
  if (review.response) {
    return { success: false, error: "Ya has respondido a esta reseña" };
  }
  
  review.response = {
    text: response.trim(),
    createdAt: new Date().toISOString(),
  };
  
  saveProfessionalReputation(reputation);
  
  return { success: true };
}

/**
 * Crea una denuncia
 */
export function createReport(data: CreateReportData): { success: boolean; report?: Report; error?: string } {
  if (!data.title || data.title.trim().length < 5) {
    return { success: false, error: "El título debe tener al menos 5 caracteres" };
  }
  
  if (!data.description || data.description.trim().length < 20) {
    return { success: false, error: "La descripción debe tener al menos 20 caracteres" };
  }
  
  const reputation = getProfessionalReputation(data.professionalId);
  if (!reputation) {
    return { success: false, error: "Profesional no encontrado" };
  }
  
  const newReport: Report = {
    id: `rpt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    professionalId: data.professionalId,
    clientId: data.clientId,
    type: data.type,
    title: data.title.trim(),
    description: data.description.trim(),
    status: "pendiente",
    createdAt: new Date().toISOString(),
  };
  
  reputation.reports.push(newReport);
  
  // Si hay múltiples denuncias pendientes, cambiar estado a "en-revision"
  const pendingReports = reputation.reports.filter((r) => r.status === "pendiente");
  if (pendingReports.length >= 3 && reputation.status === "activo") {
    reputation.status = "en-revision";
    reputation.lastStatusChange = new Date().toISOString();
  }
  
  saveProfessionalReputation(reputation);
  
  return { success: true, report: newReport };
}

/**
 * Bloquea a un profesional (solo para el cliente que bloquea)
 */
export function blockProfessional(
  professionalId: string,
  clientId: string,
  reason?: string
): { success: boolean; error?: string } {
  const reputation = getProfessionalReputation(professionalId);
  if (!reputation) {
    return { success: false, error: "Profesional no encontrado" };
  }
  
  if (reputation.blockedBy.includes(clientId)) {
    return { success: false, error: "Ya has bloqueado a este profesional" };
  }
  
  reputation.blockedBy.push(clientId);
  
  // Guardar bloqueo individual
  const block: Block = {
    id: `blk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    professionalId,
    clientId,
    reason,
    createdAt: new Date().toISOString(),
  };
  
  const key = `legal-py-block-${clientId}-${professionalId}`;
  localStorage.setItem(key, JSON.stringify(block));
  
  saveProfessionalReputation(reputation);
  
  return { success: true };
}

/**
 * Desbloquea a un profesional
 */
export function unblockProfessional(
  professionalId: string,
  clientId: string
): { success: boolean; error?: string } {
  const reputation = getProfessionalReputation(professionalId);
  if (!reputation) {
    return { success: false, error: "Profesional no encontrado" };
  }
  
  reputation.blockedBy = reputation.blockedBy.filter((id) => id !== clientId);
  
  const key = `legal-py-block-${clientId}-${professionalId}`;
  localStorage.removeItem(key);
  
  saveProfessionalReputation(reputation);
  
  return { success: true };
}

/**
 * Verifica si un cliente ha bloqueado a un profesional
 */
export function isBlocked(professionalId: string, clientId: string): boolean {
  if (typeof window === "undefined") return false;
  
  const key = `legal-py-block-${clientId}-${professionalId}`;
  return localStorage.getItem(key) !== null;
}

/**
 * Obtiene las reseñas de un profesional (con paginación)
 */
export function getReviews(
  professionalId: string,
  options?: {
    limit?: number;
    offset?: number;
    sortBy?: "recent" | "rating" | "helpful";
    minRating?: number;
  }
): { reviews: Review[]; total: number } {
  const reputation = getProfessionalReputation(professionalId);
  if (!reputation) {
    return { reviews: [], total: 0 };
  }
  
  let reviews = [...reputation.reviews];
  
  // Filtrar por rating mínimo
  if (options?.minRating) {
    reviews = reviews.filter((r) => r.rating >= options.minRating!);
  }
  
  // Ordenar
  if (options?.sortBy === "rating") {
    reviews.sort((a, b) => b.rating - a.rating);
  } else if (options?.sortBy === "helpful") {
    reviews.sort((a, b) => (b.helpful || 0) - (a.helpful || 0));
  } else {
    // Por defecto: más recientes primero
    reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  const total = reviews.length;
  
  // Paginación
  const offset = options?.offset || 0;
  const limit = options?.limit || reviews.length;
  reviews = reviews.slice(offset, offset + limit);
  
  return { reviews, total };
}

/**
 * Actualiza el historial de desempeño (llamado cuando se completa un caso)
 */
export function updatePerformanceHistory(
  professionalId: string,
  data: Partial<PerformanceHistory>
): void {
  const reputation = getProfessionalReputation(professionalId);
  if (!reputation) return;
  
  // Obtener período actual
  const now = new Date();
  const quarter = Math.floor(now.getMonth() / 3) + 1;
  const period = `${now.getFullYear()}-Q${quarter}`;
  
  let history = reputation.performanceHistory.find((h) => h.period === period);
  
  if (!history) {
    history = {
      period,
      casesCompleted: 0,
      averageRating: 0,
      clientSatisfaction: 0,
      responseTime: 0,
    };
    reputation.performanceHistory.push(history);
  }
  
  Object.assign(history, data);
  
  // Mantener solo últimos 8 períodos
  reputation.performanceHistory = reputation.performanceHistory
    .sort((a, b) => b.period.localeCompare(a.period))
    .slice(0, 8);
  
  saveProfessionalReputation(reputation);
}

/**
 * Obtiene las denuncias (solo para administradores)
 */
export function getReports(professionalId: string): Report[] {
  const reputation = getProfessionalReputation(professionalId);
  if (!reputation) return [];
  return reputation.reports;
}

/**
 * Resuelve una denuncia (solo para administradores)
 */
export function resolveReport(
  professionalId: string,
  reportId: string,
  resolution: string,
  status: "resuelta" | "desestimada"
): { success: boolean; error?: string } {
  const reputation = getProfessionalReputation(professionalId);
  if (!reputation) {
    return { success: false, error: "Reputación no encontrada" };
  }
  
  const report = reputation.reports.find((r) => r.id === reportId);
  if (!report) {
    return { success: false, error: "Denuncia no encontrada" };
  }
  
  report.status = status;
  report.resolvedAt = new Date().toISOString();
  report.resolution = resolution;
  
  // Si todas las denuncias están resueltas y estaba en revisión, volver a activo
  const pendingReports = reputation.reports.filter((r) => r.status === "pendiente" || r.status === "en-revision");
  if (pendingReports.length === 0 && reputation.status === "en-revision") {
    reputation.status = "activo";
    reputation.lastStatusChange = new Date().toISOString();
  }
  
  saveProfessionalReputation(reputation);
  
  return { success: true };
}

/**
 * Cambia el estado del profesional (solo para administradores)
 */
export function updateProfessionalStatus(
  professionalId: string,
  status: ProfessionalStatus,
  reason?: string,
  suspensionUntil?: string
): { success: boolean; error?: string } {
  const reputation = getProfessionalReputation(professionalId);
  if (!reputation) {
    return { success: false, error: "Reputación no encontrada" };
  }
  
  reputation.status = status;
  reputation.lastStatusChange = new Date().toISOString();
  
  if (status === "suspendido") {
    reputation.suspensionReason = reason;
    reputation.suspensionUntil = suspensionUntil;
  } else {
    reputation.suspensionReason = undefined;
    reputation.suspensionUntil = undefined;
  }
  
  saveProfessionalReputation(reputation);
  
  return { success: true };
}
