// Sistema de gestión de casos y expedientes para Legal PY

/**
 * Estado del caso
 */
export type CaseStatus = "activo" | "en-pausa" | "cerrado" | "archivado";

/**
 * Prioridad del caso
 */
export type CasePriority = "baja" | "media" | "alta" | "urgente";

/**
 * Tipo de evento en el timeline
 */
export type EventType =
  | "creacion"
  | "actualizacion"
  | "documento-subido"
  | "documento-firmado"
  | "audiencia"
  | "notificacion"
  | "comentario"
  | "estado-cambiado"
  | "tarea-completada"
  | "recordatorio";

/**
 * Estado de un evento
 */
export type EventStatus = "completed" | "pending" | "in-progress" | "cancelled";

/**
 * Evento del timeline
 */
export interface TimelineEvent {
  id: string;
  type: EventType;
  title: string;
  description: string;
  status: EventStatus;
  createdAt: string; // ISO 8601 date string
  createdBy: string; // ID del usuario que creó el evento
  metadata?: Record<string, string | number>; // Datos adicionales
  attachments?: string[]; // IDs de documentos relacionados
}

/**
 * Item del checklist
 */
export interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  completedAt?: string; // ISO 8601 date string
  completedBy?: string; // ID del usuario que completó
  dueDate?: string; // ISO 8601 date string
  priority?: CasePriority;
  notes?: string;
}

/**
 * Documento del caso
 */
export interface CaseDocument {
  id: string;
  name: string;
  type: string; // PDF, DOCX, etc.
  size: number; // En bytes
  uploadedAt: string; // ISO 8601 date string
  uploadedBy: string; // ID del usuario
  url?: string; // URL del documento (mock)
  category?: string; // Categoría del documento
  version?: number;
  signed?: boolean;
  signedAt?: string;
  signedBy?: string;
}

/**
 * Notificación relacionada al caso
 */
export interface CaseNotification {
  id: string;
  type: string;
  status: "pendiente" | "entregada" | "rechazada";
  scheduledDate: string; // ISO 8601 date string
  deliveredDate?: string;
  evidence?: {
    type: "acuse" | "foto" | "geotag" | "documento";
    url?: string;
  };
  notes?: string;
}

/**
 * Comentario en el caso
 */
export interface CaseComment {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: "cliente" | "profesional";
  content: string;
  createdAt: string;
  editedAt?: string;
  attachments?: string[]; // IDs de documentos
}

/**
 * Caso completo
 */
export interface Case {
  id: string; // ID único no editable, formato: LPY-{timestamp}-{random}
  caseNumber: string; // Número de caso legible
  title: string;
  description?: string;
  status: CaseStatus;
  priority: CasePriority;
  clientId: string; // ID del cliente
  professionalId?: string; // ID del profesional asignado
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
  closedAt?: string; // ISO 8601 date string
  timeline: TimelineEvent[];
  checklist: ChecklistItem[];
  documents: CaseDocument[];
  notifications: CaseNotification[];
  comments: CaseComment[];
  tags?: string[];
  courtInfo?: {
    courtName?: string;
    caseNumber?: string;
    judge?: string;
    address?: string;
  };
  alerts?: string[]; // Alertas activas
}

/**
 * Datos para crear un caso
 */
export interface CreateCaseData {
  title: string;
  description?: string;
  clientId: string;
  professionalId?: string;
  priority?: CasePriority;
  tags?: string[];
  initialChecklist?: string[]; // Labels iniciales del checklist
}

/**
 * Datos para actualizar un caso
 */
export interface UpdateCaseData {
  title?: string;
  description?: string;
  status?: CaseStatus;
  priority?: CasePriority;
  professionalId?: string;
  tags?: string[];
}

/**
 * Genera un ID único para casos
 */
function generateCaseId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  return `LPY-${timestamp}-${random}`;
}

/**
 * Genera un número de caso legible
 */
function generateCaseNumber(): string {
  const year = new Date().getFullYear();
  const number = Math.floor(Math.random() * 10000);
  return `LPY-${year}${number.toString().padStart(4, "0")}`;
}

/**
 * Obtiene todos los casos de un usuario
 */
export function getCasesByUser(userId: string, role: "cliente" | "profesional"): Case[] {
  if (typeof window === "undefined") return [];
  
  const key = "legal-py-cases";
  const stored = localStorage.getItem(key);
  
  if (!stored) return [];
  
  try {
    const allCases: Case[] = JSON.parse(stored);
    
    if (role === "cliente") {
      return allCases.filter((c) => c.clientId === userId);
    } else {
      return allCases.filter((c) => c.professionalId === userId);
    }
  } catch {
    return [];
  }
}

/**
 * Obtiene un caso por ID
 */
export function getCaseById(caseId: string): Case | null {
  if (typeof window === "undefined") return null;
  
  const key = "legal-py-cases";
  const stored = localStorage.getItem(key);
  
  if (!stored) return null;
  
  try {
    const allCases: Case[] = JSON.parse(stored);
    return allCases.find((c) => c.id === caseId) || null;
  } catch {
    return null;
  }
}

/**
 * Guarda un caso
 */
function saveCase(caseData: Case): void {
  const key = "legal-py-cases";
  const stored = localStorage.getItem(key);
  
  let allCases: Case[] = [];
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
 * Crea un nuevo caso
 */
export function createCase(data: CreateCaseData): { success: boolean; case?: Case; error?: string } {
  if (!data.title || data.title.trim().length < 3) {
    return { success: false, error: "El título debe tener al menos 3 caracteres" };
  }
  
  if (!data.clientId) {
    return { success: false, error: "ID de cliente requerido" };
  }
  
  const now = new Date().toISOString();
  const caseId = generateCaseId();
  const caseNumber = generateCaseNumber();
  
  // Crear evento inicial
  const initialEvent: TimelineEvent = {
    id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: "creacion",
    title: "Caso creado",
    description: `Caso "${data.title}" creado en el sistema`,
    status: "completed",
    createdAt: now,
    createdBy: data.clientId,
  };
  
  // Crear checklist inicial
  const checklist: ChecklistItem[] = (data.initialChecklist || []).map((label, index) => ({
    id: `chk_${Date.now()}_${index}`,
    label,
    completed: false,
  }));
  
  const newCase: Case = {
    id: caseId,
    caseNumber,
    title: data.title.trim(),
    description: data.description?.trim(),
    status: "activo",
    priority: data.priority || "media",
    clientId: data.clientId,
    professionalId: data.professionalId,
    createdAt: now,
    updatedAt: now,
    timeline: [initialEvent],
    checklist,
    documents: [],
    notifications: [],
    comments: [],
    tags: data.tags || [],
    alerts: [],
  };
  
  saveCase(newCase);
  
  return { success: true, case: newCase };
}

/**
 * Actualiza un caso
 */
export function updateCase(
  caseId: string,
  data: UpdateCaseData,
  userId: string
): { success: boolean; case?: Case; error?: string } {
  const existingCase = getCaseById(caseId);
  if (!existingCase) {
    return { success: false, error: "Caso no encontrado" };
  }
  
  // Verificar permisos
  if (existingCase.clientId !== userId && existingCase.professionalId !== userId) {
    return { success: false, error: "No tienes permisos para actualizar este caso" };
  }
  
  const now = new Date().toISOString();
  
  // Crear evento si cambió el estado
  if (data.status && data.status !== existingCase.status) {
    const statusEvent: TimelineEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: "estado-cambiado",
      title: `Estado cambiado a ${data.status}`,
      description: `El caso cambió de "${existingCase.status}" a "${data.status}"`,
      status: "completed",
      createdAt: now,
      createdBy: userId,
      metadata: {
        oldStatus: existingCase.status,
        newStatus: data.status,
      },
    };
    existingCase.timeline.unshift(statusEvent);
  }
  
  // Actualizar campos
  if (data.title !== undefined) existingCase.title = data.title.trim();
  if (data.description !== undefined) existingCase.description = data.description?.trim();
  if (data.status !== undefined) existingCase.status = data.status;
  if (data.priority !== undefined) existingCase.priority = data.priority;
  if (data.professionalId !== undefined) existingCase.professionalId = data.professionalId;
  if (data.tags !== undefined) existingCase.tags = data.tags;
  
  existingCase.updatedAt = now;
  
  // Si se cerró, agregar fecha de cierre
  if (data.status === "cerrado" && !existingCase.closedAt) {
    existingCase.closedAt = now;
  }
  
  saveCase(existingCase);
  
  return { success: true, case: existingCase };
}

/**
 * Agrega un evento al timeline
 */
export function addTimelineEvent(
  caseId: string,
  event: Omit<TimelineEvent, "id" | "createdAt">
): { success: boolean; event?: TimelineEvent; error?: string } {
  const caseData = getCaseById(caseId);
  if (!caseData) {
    return { success: false, error: "Caso no encontrado" };
  }
  
  const newEvent: TimelineEvent = {
    ...event,
    id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
  };
  
  caseData.timeline.unshift(newEvent);
  caseData.updatedAt = new Date().toISOString();
  
  saveCase(caseData);
  
  return { success: true, event: newEvent };
}

/**
 * Actualiza un item del checklist
 */
export function updateChecklistItem(
  caseId: string,
  itemId: string,
  completed: boolean,
  userId: string,
  notes?: string
): { success: boolean; error?: string } {
  const caseData = getCaseById(caseId);
  if (!caseData) {
    return { success: false, error: "Caso no encontrado" };
  }
  
  const item = caseData.checklist.find((i) => i.id === itemId);
  if (!item) {
    return { success: false, error: "Item no encontrado" };
  }
  
  const now = new Date().toISOString();
  
  item.completed = completed;
  if (completed) {
    item.completedAt = now;
    item.completedBy = userId;
    if (notes) item.notes = notes;
    
    // Agregar evento al timeline
    const event: TimelineEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: "tarea-completada",
      title: `Tarea completada: ${item.label}`,
      description: `Se completó la tarea "${item.label}"`,
      status: "completed",
      createdAt: now,
      createdBy: userId,
    };
    caseData.timeline.unshift(event);
  } else {
    item.completedAt = undefined;
    item.completedBy = undefined;
  }
  
  caseData.updatedAt = now;
  saveCase(caseData);
  
  return { success: true };
}

/**
 * Agrega un documento al caso (mock)
 */
export function addDocument(
  caseId: string,
  file: File,
  userId: string,
  category?: string
): { success: boolean; document?: CaseDocument; error?: string } {
  const caseData = getCaseById(caseId);
  if (!caseData) {
    return { success: false, error: "Caso no encontrado" };
  }
  
  // En producción, aquí se subiría el archivo realmente
  // Por ahora, simulamos la subida
  const now = new Date().toISOString();
  const documentId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const newDocument: CaseDocument = {
    id: documentId,
    name: file.name,
    type: file.type || file.name.split(".").pop()?.toUpperCase() || "UNKNOWN",
    size: file.size,
    uploadedAt: now,
    uploadedBy: userId,
    url: `#mock-${documentId}`, // URL mock
    category,
    version: 1,
  };
  
  caseData.documents.push(newDocument);
  
  // Agregar evento al timeline
  const event: TimelineEvent = {
    id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: "documento-subido",
    title: `Documento subido: ${file.name}`,
    description: `Se subió el documento "${file.name}"`,
    status: "completed",
    createdAt: now,
    createdBy: userId,
    attachments: [documentId],
  };
  caseData.timeline.unshift(event);
  caseData.updatedAt = now;
  
  saveCase(caseData);
  
  return { success: true, document: newDocument };
}

/**
 * Elimina un documento
 */
export function deleteDocument(
  caseId: string,
  documentId: string,
  userId: string
): { success: boolean; error?: string } {
  const caseData = getCaseById(caseId);
  if (!caseData) {
    return { success: false, error: "Caso no encontrado" };
  }
  
  const docIndex = caseData.documents.findIndex((d) => d.id === documentId);
  if (docIndex === -1) {
    return { success: false, error: "Documento no encontrado" };
  }
  
  caseData.documents.splice(docIndex, 1);
  caseData.updatedAt = new Date().toISOString();
  
  saveCase(caseData);
  
  return { success: true };
}

/**
 * Agrega un comentario al caso
 */
export function addComment(
  caseId: string,
  content: string,
  authorId: string,
  authorName: string,
  authorRole: "cliente" | "profesional",
  attachments?: string[]
): { success: boolean; comment?: CaseComment; error?: string } {
  if (!content || content.trim().length < 1) {
    return { success: false, error: "El comentario no puede estar vacío" };
  }
  
  const caseData = getCaseById(caseId);
  if (!caseData) {
    return { success: false, error: "Caso no encontrado" };
  }
  
  const now = new Date().toISOString();
  const commentId = `cmt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const newComment: CaseComment = {
    id: commentId,
    authorId,
    authorName,
    authorRole,
    content: content.trim(),
    createdAt: now,
    attachments: attachments || [],
  };
  
  caseData.comments.push(newComment);
  
  // Agregar evento al timeline
  const event: TimelineEvent = {
    id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: "comentario",
    title: "Nuevo comentario",
    description: `${authorName} agregó un comentario`,
    status: "completed",
    createdAt: now,
    createdBy: authorId,
  };
  caseData.timeline.unshift(event);
  caseData.updatedAt = now;
  
  saveCase(caseData);
  
  return { success: true, comment: newComment };
}

/**
 * Agrega una notificación
 */
export function addNotification(
  caseId: string,
  notification: Omit<CaseNotification, "id">
): { success: boolean; notification?: CaseNotification; error?: string } {
  const caseData = getCaseById(caseId);
  if (!caseData) {
    return { success: false, error: "Caso no encontrado" };
  }
  
  const notificationId = `not_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const newNotification: CaseNotification = {
    ...notification,
    id: notificationId,
  };
  
  caseData.notifications.push(newNotification);
  caseData.updatedAt = new Date().toISOString();
  
  saveCase(caseData);
  
  return { success: true, notification: newNotification };
}

/**
 * Asigna un profesional al caso
 */
export function assignProfessional(
  caseId: string,
  professionalId: string,
  userId: string
): { success: boolean; error?: string } {
  const caseData = getCaseById(caseId);
  if (!caseData) {
    return { success: false, error: "Caso no encontrado" };
  }
  
  // Solo el cliente puede asignar profesional
  if (caseData.clientId !== userId) {
    return { success: false, error: "Solo el cliente puede asignar un profesional" };
  }
  
  caseData.professionalId = professionalId;
  caseData.updatedAt = new Date().toISOString();
  
  // Agregar evento
  const event: TimelineEvent = {
    id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: "actualizacion",
    title: "Profesional asignado",
    description: "Se asignó un profesional al caso",
    status: "completed",
    createdAt: new Date().toISOString(),
    createdBy: userId,
    metadata: { professionalId },
  };
  caseData.timeline.unshift(event);
  
  saveCase(caseData);
  
  return { success: true };
}

/**
 * Elimina un caso (solo para archivar)
 */
export function archiveCase(caseId: string, userId: string): { success: boolean; error?: string } {
  const caseData = getCaseById(caseId);
  if (!caseData) {
    return { success: false, error: "Caso no encontrado" };
  }
  
  if (caseData.clientId !== userId && caseData.professionalId !== userId) {
    return { success: false, error: "No tienes permisos para archivar este caso" };
  }
  
  caseData.status = "archivado";
  caseData.updatedAt = new Date().toISOString();
  
  saveCase(caseData);
  
  return { success: true };
}
