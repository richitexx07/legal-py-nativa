// Sistema de notificaciones para Legal PY

/**
 * Canal de notificación
 */
export type NotificationChannel = "email" | "whatsapp" | "app";

/**
 * Tipo de notificación
 */
export type NotificationType =
  | "case_created"
  | "case_updated"
  | "case_assigned"
  | "case_status_changed"
  | "document_uploaded"
  | "comment_added"
  | "payment_registered"
  | "payment_verified"
  | "timeline_event"
  | "checklist_completed"
  | "international_case_created"
  | "gep_gold_response"
  | "consortium_response"
  | "auction_started"
  | "auction_bid_received"
  | "auction_winner_selected"
  | "reminder"
  | "alert"
  | "system";

/**
 * Prioridad de notificación
 */
export type NotificationPriority = "low" | "medium" | "high" | "urgent";

/**
 * Estado de notificación
 */
export type NotificationStatus = "pending" | "sent" | "delivered" | "read" | "failed";

/**
 * Notificación
 */
export interface Notification {
  id: string; // ID único
  userId: string; // ID del usuario destinatario
  type: NotificationType;
  channel: NotificationChannel;
  priority: NotificationPriority;
  title: string;
  message: string;
  status: NotificationStatus;
  createdAt: string; // ISO 8601
  sentAt?: string; // ISO 8601
  deliveredAt?: string; // ISO 8601
  readAt?: string; // ISO 8601
  metadata?: Record<string, any>; // Datos adicionales (links, IDs de casos, etc.)
  actionUrl?: string; // URL de acción (ej: /casos/123)
  actionLabel?: string; // Label del botón de acción
}

/**
 * Preferencias de notificación de usuario
 */
export interface NotificationPreferences {
  userId: string;
  email: {
    enabled: boolean;
    types: NotificationType[]; // Tipos habilitados
    priority: NotificationPriority[]; // Prioridades mínimas
  };
  whatsapp: {
    enabled: boolean;
    phoneNumber?: string; // Número de WhatsApp
    types: NotificationType[];
    priority: NotificationPriority[];
  };
  app: {
    enabled: boolean;
    types: NotificationType[];
    priority: NotificationPriority[];
    pushEnabled: boolean; // Para app futura
  };
  quietHours?: {
    enabled: boolean;
    start: string; // HH:mm (ej: "22:00")
    end: string; // HH:mm (ej: "08:00")
  };
}

/**
 * Datos para crear una notificación
 */
export interface CreateNotificationData {
  userId: string;
  type: NotificationType;
  channels?: NotificationChannel[]; // Si no se especifica, usa preferencias del usuario
  priority?: NotificationPriority;
  title: string;
  message: string;
  metadata?: Record<string, any>;
  actionUrl?: string;
  actionLabel?: string;
}

/**
 * Genera un ID único para notificaciones
 */
function generateNotificationId(): string {
  return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Obtiene todas las notificaciones
 */
function getAllNotifications(): Notification[] {
  if (typeof window === "undefined") return [];
  
  const key = "legal-py-notifications";
  const stored = localStorage.getItem(key);
  
  if (!stored) return [];
  
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

/**
 * Guarda una notificación
 */
function saveNotification(notification: Notification): void {
  const allNotifications = getAllNotifications();
  const existingIndex = allNotifications.findIndex((n) => n.id === notification.id);
  
  if (existingIndex >= 0) {
    allNotifications[existingIndex] = notification;
  } else {
    allNotifications.push(notification);
  }
  
  localStorage.setItem("legal-py-notifications", JSON.stringify(allNotifications));
}

/**
 * Obtiene preferencias de notificación de un usuario
 */
export function getNotificationPreferences(userId: string): NotificationPreferences {
  if (typeof window === "undefined") {
    return getDefaultPreferences(userId);
  }
  
  const key = `legal-py-notification-preferences-${userId}`;
  const stored = localStorage.getItem(key);
  
  if (!stored) {
    return getDefaultPreferences(userId);
  }
  
  try {
    return JSON.parse(stored);
  } catch {
    return getDefaultPreferences(userId);
  }
}

/**
 * Preferencias por defecto
 */
function getDefaultPreferences(userId: string): NotificationPreferences {
  return {
    userId,
    email: {
      enabled: true,
      types: [
        "case_created",
        "case_updated",
        "case_assigned",
        "payment_registered",
        "payment_verified",
        "international_case_created",
        "auction_winner_selected",
      ],
      priority: ["medium", "high", "urgent"],
    },
    whatsapp: {
      enabled: false,
      types: ["case_assigned", "payment_verified", "auction_winner_selected"],
      priority: ["high", "urgent"],
    },
    app: {
      enabled: true,
      types: [
        "case_created",
        "case_updated",
        "case_assigned",
        "document_uploaded",
        "comment_added",
        "payment_registered",
        "timeline_event",
        "checklist_completed",
        "international_case_created",
        "gep_gold_response",
        "consortium_response",
        "auction_started",
        "auction_bid_received",
        "auction_winner_selected",
        "reminder",
        "alert",
      ],
      priority: ["low", "medium", "high", "urgent"],
      pushEnabled: true,
    },
  };
}

/**
 * Guarda preferencias de notificación
 */
export function saveNotificationPreferences(
  preferences: NotificationPreferences
): { success: boolean; error?: string } {
  if (typeof window === "undefined") {
    return { success: false, error: "Solo disponible en cliente" };
  }
  
  const key = `legal-py-notification-preferences-${preferences.userId}`;
  localStorage.setItem(key, JSON.stringify(preferences));
  
  return { success: true };
}

/**
 * Crea y envía una notificación
 */
export async function sendNotification(
  data: CreateNotificationData
): Promise<{ success: boolean; notifications?: Notification[]; error?: string }> {
  const preferences = getNotificationPreferences(data.userId);
  const channels = data.channels || getChannelsFromPreferences(preferences, data.type, data.priority || "medium");
  
  if (channels.length === 0) {
    return {
      success: false,
      error: "No hay canales habilitados para este tipo de notificación",
    };
  }
  
  const now = new Date().toISOString();
  const notifications: Notification[] = [];
  
  // Crear notificación para cada canal
  for (const channel of channels) {
    const notification: Notification = {
      id: generateNotificationId(),
      userId: data.userId,
      type: data.type,
      channel,
      priority: data.priority || "medium",
      title: data.title,
      message: data.message,
      status: "pending",
      createdAt: now,
      metadata: data.metadata,
      actionUrl: data.actionUrl,
      actionLabel: data.actionLabel,
    };
    
    // Enviar notificación (mock)
    const sendResult = await sendNotificationToChannel(notification, preferences);
    
    if (sendResult.success) {
      notification.status = "sent";
      notification.sentAt = new Date().toISOString();
      
      // Simular entrega después de un delay
      setTimeout(() => {
        notification.status = "delivered";
        notification.deliveredAt = new Date().toISOString();
        saveNotification(notification);
      }, 1000);
    } else {
      notification.status = "failed";
    }
    
    saveNotification(notification);
    notifications.push(notification);
  }
  
  return { success: true, notifications };
}

/**
 * Determina qué canales usar según preferencias
 */
function getChannelsFromPreferences(
  preferences: NotificationPreferences,
  type: NotificationType,
  priority: NotificationPriority
): NotificationChannel[] {
  const channels: NotificationChannel[] = [];
  
  // Email
  if (
    preferences.email.enabled &&
    preferences.email.types.includes(type) &&
    preferences.email.priority.includes(priority)
  ) {
    channels.push("email");
  }
  
  // WhatsApp
  if (
    preferences.whatsapp.enabled &&
    preferences.whatsapp.phoneNumber &&
    preferences.whatsapp.types.includes(type) &&
    preferences.whatsapp.priority.includes(priority)
  ) {
    channels.push("whatsapp");
  }
  
  // App
  if (
    preferences.app.enabled &&
    preferences.app.types.includes(type) &&
    preferences.app.priority.includes(priority)
  ) {
    channels.push("app");
  }
  
  return channels;
}

/**
 * Envía notificación a un canal específico (mock)
 */
async function sendNotificationToChannel(
  notification: Notification,
  preferences: NotificationPreferences
): Promise<{ success: boolean; error?: string }> {
  // Verificar horas silenciosas
  if (preferences.quietHours?.enabled) {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
    const start = preferences.quietHours.start;
    const end = preferences.quietHours.end;
    
    // Lógica simple: si está en rango de horas silenciosas, no enviar (excepto urgentes)
    if (notification.priority !== "urgent") {
      // En producción, esto sería más complejo
      // Por ahora, solo simulamos el envío
    }
  }
  
  // Simular envío según canal
  switch (notification.channel) {
    case "email":
      // Mock: simular envío de email
      console.log(`[MOCK EMAIL] To: user_${notification.userId}`, notification.title);
      await new Promise((resolve) => setTimeout(resolve, 500));
      return { success: true };
      
    case "whatsapp":
      // Mock: simular envío de WhatsApp
      const phoneNumber = preferences.whatsapp.phoneNumber || "N/A";
      console.log(`[MOCK WHATSAPP] To: ${phoneNumber}`, notification.title);
      await new Promise((resolve) => setTimeout(resolve, 500));
      return { success: true };
      
    case "app":
      // Mock: simular notificación push (app futura)
      console.log(`[MOCK APP PUSH] To: user_${notification.userId}`, notification.title);
      await new Promise((resolve) => setTimeout(resolve, 300));
      return { success: true };
      
    default:
      return { success: false, error: "Canal no soportado" };
  }
}

/**
 * Obtiene notificaciones de un usuario
 */
export function getUserNotifications(
  userId: string,
  filters?: {
    channel?: NotificationChannel;
    type?: NotificationType;
    status?: NotificationStatus;
    unreadOnly?: boolean;
    limit?: number;
  }
): Notification[] {
  let notifications = getAllNotifications().filter((n) => n.userId === userId);
  
  if (filters) {
    if (filters.channel) {
      notifications = notifications.filter((n) => n.channel === filters.channel);
    }
    if (filters.type) {
      notifications = notifications.filter((n) => n.type === filters.type);
    }
    if (filters.status) {
      notifications = notifications.filter((n) => n.status === filters.status);
    }
    if (filters.unreadOnly) {
      notifications = notifications.filter((n) => n.status !== "read");
    }
  }
  
  // Ordenar por fecha (más recientes primero)
  notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  if (filters?.limit) {
    notifications = notifications.slice(0, filters.limit);
  }
  
  return notifications;
}

/**
 * Marca notificación como leída
 */
export function markNotificationAsRead(notificationId: string): { success: boolean; error?: string } {
  const allNotifications = getAllNotifications();
  const notification = allNotifications.find((n) => n.id === notificationId);
  
  if (!notification) {
    return { success: false, error: "Notificación no encontrada" };
  }
  
  notification.status = "read";
  notification.readAt = new Date().toISOString();
  
  saveNotification(notification);
  
  return { success: true };
}

/**
 * Marca todas las notificaciones como leídas
 */
export function markAllNotificationsAsRead(userId: string): { success: boolean; count?: number } {
  const notifications = getUserNotifications(userId, { unreadOnly: true });
  
  notifications.forEach((n) => {
    n.status = "read";
    n.readAt = new Date().toISOString();
    saveNotification(n);
  });
  
  return { success: true, count: notifications.length };
}

/**
 * Elimina una notificación
 */
export function deleteNotification(notificationId: string): { success: boolean; error?: string } {
  const allNotifications = getAllNotifications();
  const filtered = allNotifications.filter((n) => n.id !== notificationId);
  
  localStorage.setItem("legal-py-notifications", JSON.stringify(filtered));
  
  return { success: true };
}

/**
 * Obtiene estadísticas de notificaciones
 */
export function getNotificationStats(userId: string): {
  total: number;
  unread: number;
  byChannel: Record<NotificationChannel, number>;
  byType: Record<NotificationType, number>;
  byStatus: Record<NotificationStatus, number>;
} {
  const notifications = getUserNotifications(userId);
  
  const stats = {
    total: notifications.length,
    unread: notifications.filter((n) => n.status !== "read").length,
    byChannel: {
      email: 0,
      whatsapp: 0,
      app: 0,
    } as Record<NotificationChannel, number>,
    byType: {} as Record<NotificationType, number>,
    byStatus: {
      pending: 0,
      sent: 0,
      delivered: 0,
      read: 0,
      failed: 0,
    } as Record<NotificationStatus, number>,
  };
  
  notifications.forEach((n) => {
    stats.byChannel[n.channel]++;
    stats.byType[n.type] = (stats.byType[n.type] || 0) + 1;
    stats.byStatus[n.status]++;
  });
  
  return stats;
}

/**
 * Plantillas de notificaciones por tipo
 */
export function getNotificationTemplate(
  type: NotificationType,
  data: Record<string, any>
): { title: string; message: string } {
  const templates: Record<NotificationType, (data: any) => { title: string; message: string }> = {
    case_created: (d) => ({
      title: "Nuevo caso creado",
      message: `Se ha creado el caso "${d.caseTitle || "N/A"}" (${d.caseNumber || "N/A"})`,
    }),
    case_updated: (d) => ({
      title: "Caso actualizado",
      message: `El caso "${d.caseTitle || "N/A"}" ha sido actualizado`,
    }),
    case_assigned: (d) => ({
      title: "Caso asignado",
      message: `Se te ha asignado el caso "${d.caseTitle || "N/A"}"`,
    }),
    case_status_changed: (d) => ({
      title: "Estado de caso cambiado",
      message: `El caso "${d.caseTitle || "N/A"}" cambió a estado: ${d.newStatus || "N/A"}`,
    }),
    document_uploaded: (d) => ({
      title: "Documento subido",
      message: `Se subió un nuevo documento al caso "${d.caseTitle || "N/A"}"`,
    }),
    comment_added: (d) => ({
      title: "Nuevo comentario",
      message: `${d.authorName || "Alguien"} comentó en el caso "${d.caseTitle || "N/A"}"`,
    }),
    payment_registered: (d) => ({
      title: "Pago registrado",
      message: `Se registró un pago de ${d.amount || "N/A"} ${d.currency || "USD"} para el caso "${d.caseTitle || "N/A"}"`,
    }),
    payment_verified: (d) => ({
      title: "Pago verificado",
      message: `El pago de ${d.amount || "N/A"} ${d.currency || "USD"} ha sido verificado`,
    }),
    timeline_event: (d) => ({
      title: "Nuevo evento en timeline",
      message: `Nuevo evento: "${d.eventTitle || "N/A"}" en el caso "${d.caseTitle || "N/A"}"`,
    }),
    checklist_completed: (d) => ({
      title: "Tarea completada",
      message: `Se completó la tarea "${d.taskLabel || "N/A"}" en el caso "${d.caseTitle || "N/A"}"`,
    }),
    international_case_created: (d) => ({
      title: "Caso internacional creado",
      message: `Se creó un caso internacional con monto estimado de ${d.amount || "N/A"} USD`,
    }),
    gep_gold_response: (d) => ({
      title: "Respuesta de GEP Gold",
      message: `GEP Gold ha ${d.response === "aceptado" ? "aceptado" : "declinado"} el caso internacional`,
    }),
    consortium_response: (d) => ({
      title: "Respuesta de consorcio",
      message: `${d.consortiumName || "Un consorcio"} ha ${d.response === "aceptado" ? "aceptado" : "declinado"} el caso`,
    }),
    auction_started: (d) => ({
      title: "Subasta iniciada",
      message: `Se inició una subasta para el caso internacional "${d.caseTitle || "N/A"}"`,
    }),
    auction_bid_received: (d) => ({
      title: "Nueva oferta en subasta",
      message: `Se recibió una nueva oferta de ${d.amount || "N/A"} USD en la subasta`,
    }),
    auction_winner_selected: (d) => ({
      title: "Ganador de subasta seleccionado",
      message: `Se seleccionó un ganador para la subasta del caso "${d.caseTitle || "N/A"}"`,
    }),
    reminder: (d) => ({
      title: d.reminderTitle || "Recordatorio",
      message: d.reminderMessage || "Tienes un recordatorio pendiente",
    }),
    alert: (d) => ({
      title: d.alertTitle || "Alerta",
      message: d.alertMessage || "Tienes una alerta importante",
    }),
    system: (d) => ({
      title: d.systemTitle || "Notificación del sistema",
      message: d.systemMessage || "Notificación del sistema",
    }),
  };
  
  const template = templates[type];
  return template ? template(data) : { title: "Notificación", message: "Nueva notificación" };
}
