// Sistema de registro de pagos para Legal PY
// IMPORTANTE: Legal PY NO procesa pagos, solo registra los pagos realizados externamente

/**
 * Estado del registro de pago
 */
export type PaymentStatus = "registrado" | "verificado" | "rechazado" | "pendiente";

/**
 * Método de pago utilizado
 */
export type PaymentMethod =
  | "transferencia-bancaria"
  | "tarjeta-credito"
  | "tarjeta-debito"
  | "efectivo"
  | "cheque"
  | "billetera-digital"
  | "crypto"
  | "otro";

/**
 * Moneda del pago
 */
export type PaymentCurrency = "PYG" | "USD" | "EUR" | "BRL";

/**
 * Registro de pago
 * IMPORTANTE: Este es solo un REGISTRO. Legal PY no procesa ni maneja el dinero.
 */
export interface PaymentRecord {
  id: string; // ID único no editable
  paymentNumber: string; // Número de registro legible
  caseId?: string; // ID del caso asociado (opcional)
  clientId: string; // ID del cliente que realizó el pago
  professionalId?: string; // ID del profesional que recibió el pago
  amount: number; // Monto del pago
  currency: PaymentCurrency; // Moneda
  method: PaymentMethod; // Método de pago utilizado
  description: string; // Descripción del pago
  reference?: string; // Número de referencia/comprobante externo
  receiptUrl?: string; // URL del comprobante (si se subió)
  status: PaymentStatus; // Estado del registro
  registeredAt: string; // ISO 8601 - Fecha de registro en Legal PY
  paymentDate: string; // ISO 8601 - Fecha en que se realizó el pago (puede ser diferente)
  registeredBy: string; // ID del usuario que registró el pago
  verifiedAt?: string; // ISO 8601 - Fecha de verificación (si aplica)
  verifiedBy?: string; // ID del usuario que verificó
  notes?: string; // Notas adicionales
  metadata?: Record<string, string | number>; // Datos adicionales
}

/**
 * Datos para registrar un pago
 */
export interface RegisterPaymentData {
  caseId?: string;
  clientId: string;
  professionalId?: string;
  amount: number;
  currency: PaymentCurrency;
  method: PaymentMethod;
  description: string;
  reference?: string;
  paymentDate?: string; // Si no se proporciona, usa la fecha actual
  receiptUrl?: string;
  notes?: string;
}

/**
 * Filtros para historial de pagos
 */
export interface PaymentFilters {
  caseId?: string;
  clientId?: string;
  professionalId?: string;
  status?: PaymentStatus;
  method?: PaymentMethod;
  currency?: PaymentCurrency;
  startDate?: string; // ISO 8601
  endDate?: string; // ISO 8601
}

/**
 * Genera un ID único para registros de pago
 */
function generatePaymentId(): string {
  return `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Genera un número de registro legible
 */
function generatePaymentNumber(): string {
  const year = new Date().getFullYear();
  const number = Math.floor(Math.random() * 100000);
  return `PAY-${year}${number.toString().padStart(5, "0")}`;
}

/**
 * Obtiene todos los registros de pago
 */
function getAllPayments(): PaymentRecord[] {
  if (typeof window === "undefined") return [];
  
  const key = "legal-py-payments";
  const stored = localStorage.getItem(key);
  
  if (!stored) return [];
  
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

/**
 * Guarda un registro de pago
 */
function savePayment(payment: PaymentRecord): void {
  const allPayments = getAllPayments();
  const existingIndex = allPayments.findIndex((p) => p.id === payment.id);
  
  if (existingIndex >= 0) {
    allPayments[existingIndex] = payment;
  } else {
    allPayments.push(payment);
  }
  
  localStorage.setItem("legal-py-payments", JSON.stringify(allPayments));
}

/**
 * Registra un nuevo pago
 * IMPORTANTE: Esto solo REGISTRA el pago. Legal PY no procesa ni maneja el dinero.
 */
export function registerPayment(
  data: RegisterPaymentData,
  registeredBy: string
): { success: boolean; payment?: PaymentRecord; error?: string } {
  // Validaciones
  if (!data.clientId) {
    return { success: false, error: "ID de cliente requerido" };
  }
  
  if (!data.amount || data.amount <= 0) {
    return { success: false, error: "El monto debe ser mayor a 0" };
  }
  
  if (!data.description || data.description.trim().length < 5) {
    return { success: false, error: "La descripción debe tener al menos 5 caracteres" };
  }
  
  const now = new Date().toISOString();
  const paymentId = generatePaymentId();
  const paymentNumber = generatePaymentNumber();
  
  const newPayment: PaymentRecord = {
    id: paymentId,
    paymentNumber,
    caseId: data.caseId,
    clientId: data.clientId,
    professionalId: data.professionalId,
    amount: data.amount,
    currency: data.currency,
    method: data.method,
    description: data.description.trim(),
    reference: data.reference?.trim(),
    receiptUrl: data.receiptUrl,
    status: "registrado",
    registeredAt: now,
    paymentDate: data.paymentDate || now,
    registeredBy,
    notes: data.notes?.trim(),
  };
  
  savePayment(newPayment);
  
  return { success: true, payment: newPayment };
}

/**
 * Obtiene el historial de pagos visible (últimos 3 meses)
 */
export function getPaymentHistory(
  filters?: PaymentFilters
): { payments: PaymentRecord[]; total: number; visibleMonths: number } {
  const allPayments = getAllPayments();
  
  // Calcular fecha límite (3 meses atrás)
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  const threeMonthsAgoISO = threeMonthsAgo.toISOString();
  
  // Filtrar por fecha (solo últimos 3 meses)
  let filtered = allPayments.filter((p) => p.registeredAt >= threeMonthsAgoISO);
  
  // Aplicar filtros adicionales
  if (filters) {
    if (filters.caseId) {
      filtered = filtered.filter((p) => p.caseId === filters.caseId);
    }
    if (filters.clientId) {
      filtered = filtered.filter((p) => p.clientId === filters.clientId);
    }
    if (filters.professionalId) {
      filtered = filtered.filter((p) => p.professionalId === filters.professionalId);
    }
    if (filters.status) {
      filtered = filtered.filter((p) => p.status === filters.status);
    }
    if (filters.method) {
      filtered = filtered.filter((p) => p.method === filters.method);
    }
    if (filters.currency) {
      filtered = filtered.filter((p) => p.currency === filters.currency);
    }
    if (filters.startDate) {
      filtered = filtered.filter((p) => p.registeredAt >= filters.startDate!);
    }
    if (filters.endDate) {
      filtered = filtered.filter((p) => p.registeredAt <= filters.endDate!);
    }
  }
  
  // Ordenar por fecha (más recientes primero)
  filtered.sort((a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime());
  
  return {
    payments: filtered,
    total: filtered.length,
    visibleMonths: 3,
  };
}

/**
 * Obtiene todos los pagos (incluyendo respaldo técnico de 6 meses)
 * Solo para uso administrativo o exportación
 */
export function getAllPaymentRecords(filters?: PaymentFilters): PaymentRecord[] {
  const allPayments = getAllPayments();
  
  // Calcular fecha límite (6 meses atrás para respaldo técnico)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const sixMonthsAgoISO = sixMonthsAgo.toISOString();
  
  // Filtrar por fecha (últimos 6 meses para respaldo técnico)
  let filtered = allPayments.filter((p) => p.registeredAt >= sixMonthsAgoISO);
  
  // Aplicar filtros adicionales
  if (filters) {
    if (filters.caseId) {
      filtered = filtered.filter((p) => p.caseId === filters.caseId);
    }
    if (filters.clientId) {
      filtered = filtered.filter((p) => p.clientId === filters.clientId);
    }
    if (filters.professionalId) {
      filtered = filtered.filter((p) => p.professionalId === filters.professionalId);
    }
    if (filters.status) {
      filtered = filtered.filter((p) => p.status === filters.status);
    }
    if (filters.method) {
      filtered = filtered.filter((p) => p.method === filters.method);
    }
    if (filters.currency) {
      filtered = filtered.filter((p) => p.currency === filters.currency);
    }
    if (filters.startDate) {
      filtered = filtered.filter((p) => p.registeredAt >= filters.startDate!);
    }
    if (filters.endDate) {
      filtered = filtered.filter((p) => p.registeredAt <= filters.endDate!);
    }
  }
  
  // Ordenar por fecha (más recientes primero)
  filtered.sort((a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime());
  
  return filtered;
}

/**
 * Obtiene un registro de pago por ID
 */
export function getPaymentById(paymentId: string): PaymentRecord | null {
  const allPayments = getAllPayments();
  return allPayments.find((p) => p.id === paymentId) || null;
}

/**
 * Obtiene pagos asociados a un caso
 */
export function getPaymentsByCase(caseId: string): PaymentRecord[] {
  const allPayments = getAllPayments();
  return allPayments
    .filter((p) => p.caseId === caseId)
    .sort((a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime());
}

/**
 * Obtiene pagos de un cliente
 */
export function getPaymentsByClient(clientId: string): PaymentRecord[] {
  return getPaymentHistory({ clientId }).payments;
}

/**
 * Obtiene pagos de un profesional
 */
export function getPaymentsByProfessional(professionalId: string): PaymentRecord[] {
  return getPaymentHistory({ professionalId }).payments;
}

/**
 * Actualiza el estado de un registro de pago
 */
export function updatePaymentStatus(
  paymentId: string,
  status: PaymentStatus,
  verifiedBy?: string,
  notes?: string
): { success: boolean; payment?: PaymentRecord; error?: string } {
  const payment = getPaymentById(paymentId);
  if (!payment) {
    return { success: false, error: "Registro de pago no encontrado" };
  }
  
  payment.status = status;
  if (status === "verificado" && verifiedBy) {
    payment.verifiedAt = new Date().toISOString();
    payment.verifiedBy = verifiedBy;
  }
  if (notes) {
    payment.notes = notes;
  }
  
  savePayment(payment);
  
  return { success: true, payment };
}

/**
 * Actualiza un registro de pago
 */
export function updatePayment(
  paymentId: string,
  data: Partial<RegisterPaymentData>
): { success: boolean; payment?: PaymentRecord; error?: string } {
  const payment = getPaymentById(paymentId);
  if (!payment) {
    return { success: false, error: "Registro de pago no encontrado" };
  }
  
  // Actualizar campos permitidos
  if (data.amount !== undefined) payment.amount = data.amount;
  if (data.currency !== undefined) payment.currency = data.currency;
  if (data.method !== undefined) payment.method = data.method;
  if (data.description !== undefined) payment.description = data.description.trim();
  if (data.reference !== undefined) payment.reference = data.reference?.trim();
  if (data.receiptUrl !== undefined) payment.receiptUrl = data.receiptUrl;
  if (data.notes !== undefined) payment.notes = data.notes?.trim();
  if (data.caseId !== undefined) payment.caseId = data.caseId;
  
  savePayment(payment);
  
  return { success: true, payment };
}

/**
 * Elimina un registro de pago (solo si está dentro del período de respaldo técnico)
 * En producción, esto debería ser solo para administradores
 */
export function deletePayment(paymentId: string): { success: boolean; error?: string } {
  const payment = getPaymentById(paymentId);
  if (!payment) {
    return { success: false, error: "Registro de pago no encontrado" };
  }
  
  // Verificar que esté dentro del período de respaldo técnico (6 meses)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
  if (new Date(payment.registeredAt) < sixMonthsAgo) {
    return {
      success: false,
      error: "No se puede eliminar. El registro está fuera del período de respaldo técnico.",
    };
  }
  
  const allPayments = getAllPayments();
  const filtered = allPayments.filter((p) => p.id !== paymentId);
  localStorage.setItem("legal-py-payments", JSON.stringify(filtered));
  
  return { success: true };
}

/**
 * Obtiene estadísticas de pagos
 */
export function getPaymentStats(
  filters?: PaymentFilters
): {
  total: number;
  totalAmount: number;
  byStatus: Record<PaymentStatus, number>;
  byMethod: Record<PaymentMethod, number>;
  byCurrency: Record<PaymentCurrency, number>;
} {
  const history = getPaymentHistory(filters);
  
  const stats = {
    total: history.payments.length,
    totalAmount: 0,
    byStatus: {
      registrado: 0,
      verificado: 0,
      rechazado: 0,
      pendiente: 0,
    } as Record<PaymentStatus, number>,
    byMethod: {} as Record<PaymentMethod, number>,
    byCurrency: {} as Record<PaymentCurrency, number>,
  };
  
  history.payments.forEach((payment) => {
    // Total amount (convertir todo a PYG para sumar)
    // En producción, esto debería manejar conversiones de moneda
    stats.totalAmount += payment.amount;
    
    // Por estado
    stats.byStatus[payment.status] = (stats.byStatus[payment.status] || 0) + 1;
    
    // Por método
    stats.byMethod[payment.method] = (stats.byMethod[payment.method] || 0) + 1;
    
    // Por moneda
    stats.byCurrency[payment.currency] = (stats.byCurrency[payment.currency] || 0) + 1;
  });
  
  return stats;
}

/**
 * Exporta registros de pago (para respaldo o reportes)
 */
export function exportPayments(filters?: PaymentFilters): PaymentRecord[] {
  // Exporta todos los registros dentro del período de respaldo técnico (6 meses)
  return getAllPaymentRecords(filters);
}
