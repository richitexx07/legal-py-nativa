// Tipos para los datos mock

export interface Profesional {
  id: string;
  nombre: string;
  titulo: string;
  especialidad: string;
  categoria: "Abogados" | "Escribanos" | "Despachantes" | "Gestores" | "Oficial de Justicia" | "Gestiones Migratorias";
  ciudad: string;
  rating: number;
  experiencia: number;
  precio: string;
  descripcion?: string;
  especialidades?: string[];
  idiomas?: string[];
  imagen?: string;
  avatar?: string;
}

export interface Gestor {
  id: string;
  nombre: string;
  tipo: string;
  ciudad: string;
  rating: number;
  servicios: string[];
  precio: string;
}

export interface OficialJusticia {
  id: string;
  nombre: string;
  ciudad: string;
  rating: number;
  servicios: string[];
  precio: string;
}

export interface Caso {
  id: string;
  titulo: string;
  numero: string;
  estado: "activo" | "cerrado" | "en-pausa";
  ultimaActualizacion: string;
  descripcion?: string;
  profesionalId?: string;
}

export interface Mensaje {
  id: string;
  remitente: string;
  contenido: string;
  fecha: string;
  leido: boolean;
  tipo?: "texto" | "documento" | "sistema";
}

export interface Categoria {
  id: string;
  titulo: string;
  descripcion: string;
  href: string;
  icono?: string;
}

export interface Plan {
  id: string;
  nombre: string;
  precio: number;
  moneda: "PYG" | "USD";
  periodo: "mensual" | "anual";
  descripcion: string;
  features: string[];
  destacado?: boolean;
}

export interface MetodoPago {
  id: string;
  nombre: string;
  descripcion: string;
  tipo: "paraguay" | "internacional";
  icono: string;
  disponible: boolean;
}

export interface ProfesionalSuscripcion {
  id: string;
  email: string;
  nombre: string;
  tipo: string;
  ciudad: string;
  planId: string;
  metodoPagoId: string;
  fechaAlta: string;
  estado: "activo" | "pendiente" | "suspendido";
}

// Datos mock

export const mockProfesionales: Profesional[] = [
  // ABOGADOS
  {
    id: "1",
    nombre: "Dr. Mario Gómez",
    titulo: "Abogado Penalista",
    especialidad: "Penal",
    categoria: "Abogados",
    ciudad: "Asunción",
    rating: 4.8,
    experiencia: 15,
    precio: "desde Gs. 200.000",
    descripcion: "Especialista en derecho penal con amplia experiencia en casos complejos.",
    especialidades: ["Penal", "Procesal Penal"],
    idiomas: ["Español", "Guaraní"],
    avatar: "/avatars/icono_abogado_primer_plano.jpeg",
  },
  {
    id: "2",
    nombre: "Dra. Sofía Ramírez",
    titulo: "Laboralista",
    especialidad: "Laboral",
    categoria: "Abogados",
    ciudad: "Asunción",
    rating: 4.8,
    experiencia: 12,
    precio: "desde Gs. 180.000",
    descripcion: "Experta en derecho laboral y relaciones de trabajo.",
    especialidades: ["Laboral", "Seguridad Social"],
    idiomas: ["Español"],
    avatar: "/avatars/icono_abogada_primer_plano .jpeg",
  },
  {
    id: "3",
    nombre: "Dr. Juan López",
    titulo: "Civil & Comercial",
    especialidad: "Civil",
    categoria: "Abogados",
    ciudad: "San Lorenzo",
    rating: 4.8,
    experiencia: 10,
    precio: "desde Gs. 150.000",
    descripcion: "Especialista en derecho civil y comercial.",
    especialidades: ["Civil", "Comercial"],
    idiomas: ["Español", "Inglés"],
    avatar: "/avatars/icono_abogadotrigueñoprimerplano.jpeg", 
  },
  {
    id: "5",
    nombre: "Dra. Sofía Benítez",
    titulo: "Abogada (Civil & Familia)",
    especialidad: "Familiar",
    categoria: "Abogados",
    ciudad: "Asunción",
    rating: 4.9,
    experiencia: 14,
    precio: "desde Gs. 150.000",
    descripcion: "Especialista en derecho de familia y sucesiones.",
    especialidades: ["Familiar", "Civil"],
    idiomas: ["Español", "Guaraní"],
    avatar: "/avatars/icono_abogada_avatar.jpeg",
  },
  {
    id: "6",
    nombre: "Dr. Marcos Ríos",
    titulo: "Abogado Penal",
    especialidad: "Penal",
    categoria: "Abogados",
    ciudad: "Luque",
    rating: 4.7,
    experiencia: 11,
    precio: "desde Gs. 200.000",
    descripcion: "Especialista en derecho penal y procesal penal.",
    especialidades: ["Penal"],
    idiomas: ["Español"],
    avatar: "/avatars/icono_abogado_avatar.jpeg",
  },
  // ESCRIBANOS
  {
    id: "4",
    nombre: "Esc. Laura Aquino",
    titulo: "Escribana",
    especialidad: "Notarial",
    categoria: "Escribanos",
    ciudad: "Asunción",
    rating: 4.9,
    experiencia: 8,
    precio: "desde Gs. 250.000",
    descripcion: "Escribana pública con amplia experiencia en actas y escrituras.",
    especialidades: ["Notarial", "Registral"],
    idiomas: ["Español"],
    avatar: "/avatars/icono_abogada_avatar.jpeg",
  },
  {
    id: "7",
    nombre: "Esc. Carlos Mendoza",
    titulo: "Escribano Público",
    especialidad: "Notarial",
    categoria: "Escribanos",
    ciudad: "San Lorenzo",
    rating: 4.8,
    experiencia: 10,
    precio: "desde Gs. 220.000",
    descripcion: "Escribano público especializado en poderes y certificaciones.",
    especialidades: ["Notarial"],
    idiomas: ["Español", "Guaraní"],
    avatar: "/avatars/icono_abogado_avatar.jpeg",
  },
  // DESPACHANTES
  {
    id: "8",
    nombre: "Lic. Diego Amarilla",
    titulo: "Despachante de Aduana",
    especialidad: "Aduanero",
    categoria: "Despachantes",
    ciudad: "Ciudad del Este",
    rating: 4.6,
    experiencia: 9,
    precio: "desde Gs. 300.000",
    descripcion: "Especialista en trámites aduaneros y comercio exterior.",
    especialidades: ["Aduanero", "Comercio Exterior"],
    idiomas: ["Español", "Portugués"],
    avatar: "/avatars/icono_abogado_avatar.jpeg",
  },
  {
    id: "9",
    nombre: "Desp. Ana Torres",
    titulo: "Despachante Aduanero",
    especialidad: "Aduanero",
    categoria: "Despachantes",
    ciudad: "Asunción",
    rating: 4.7,
    experiencia: 7,
    precio: "desde Gs. 280.000",
    descripcion: "Experta en importación y exportación.",
    especialidades: ["Aduanero"],
    idiomas: ["Español", "Inglés"],
    avatar: "/avatars/icono_abogada_avatar.jpeg",
  },
  // GESTORES
  {
    id: "10",
    nombre: "Gest. Roberto Silva",
    titulo: "Gestor General",
    especialidad: "Gestoría",
    categoria: "Gestores",
    ciudad: "Asunción",
    rating: 4.7,
    experiencia: 12,
    precio: "desde Gs. 100.000",
    descripcion: "Gestor especializado en trámites administrativos.",
    especialidades: ["RUC", "Registro de Comercio"],
    idiomas: ["Español"],
    avatar: "/avatars/icono_abogado_avatar.jpeg",
  },
  {
    id: "11",
    nombre: "Gest. María González",
    titulo: "Gestora Especializada",
    especialidad: "Gestoría",
    categoria: "Gestores",
    ciudad: "San Lorenzo",
    rating: 4.6,
    experiencia: 8,
    precio: "desde Gs. 120.000",
    descripcion: "Experta en trámites municipales y licencias.",
    especialidades: ["Licencias", "Trámites Municipales"],
    idiomas: ["Español"],
    avatar: "/avatars/icono_abogada_avatar.jpeg",
  },
  // OFICIAL DE JUSTICIA
  {
    id: "12",
    nombre: "Of. Pedro Martínez",
    titulo: "Oficial de Justicia",
    especialidad: "Notificaciones",
    categoria: "Oficial de Justicia",
    ciudad: "Asunción",
    rating: 4.8,
    experiencia: 6,
    precio: "desde Gs. 80.000",
    descripcion: "Oficial de justicia especializado en notificaciones y diligencias.",
    especialidades: ["Notificaciones", "Diligencias"],
    idiomas: ["Español"],
    avatar: "/avatars/icono_abogado_avatar.jpeg",
  },
  {
    id: "13",
    nombre: "Of. Julia Fernández",
    titulo: "Oficial de Justicia",
    especialidad: "Notificaciones",
    categoria: "Oficial de Justicia",
    ciudad: "Luque",
    rating: 4.7,
    experiencia: 5,
    precio: "desde Gs. 90.000",
    descripcion: "Experta en notificaciones y constancias judiciales.",
    especialidades: ["Notificaciones", "Constancias"],
    idiomas: ["Español"],
    avatar: "/avatars/icono_abogada_avatar.jpeg",
  },
  // GESTIONES MIGRATORIAS
  {
    id: "14",
    nombre: "Mig. Luis Herrera",
    titulo: "Especialista en Gestiones Migratorias",
    especialidad: "Gestiones Migratorias",
    categoria: "Gestiones Migratorias",
    ciudad: "Asunción",
    rating: 4.8,
    experiencia: 10,
    precio: "desde Gs. 150.000",
    descripcion: "Especialista en trámites migratorios y residencias. Asesoramiento y gestión privada de documentos para extranjeros.",
    especialidades: ["Asesoramiento para residencia temporal", "Asesoramiento para residencia permanente", "Renovación / actualización de residencia", "Cédula de identidad para extranjeros", "Regularización migratoria", "Preparación y revisión de carpeta", "Turnos y acompañamiento", "Seguimiento de expediente"],
    idiomas: ["Español", "Inglés"],
    avatar: "/avatars/icono_abogado_avatar.jpeg",
  },
  {
    id: "15",
    nombre: "Mig. Carmen Díaz",
    titulo: "Gestora de Trámites para Extranjeros",
    especialidad: "Gestiones Migratorias",
    categoria: "Gestiones Migratorias",
    ciudad: "Ciudad del Este",
    rating: 4.7,
    experiencia: 8,
    precio: "desde Gs. 140.000",
    descripcion: "Experta en trámites para extranjeros. Preparación de carpetas y seguimiento de expedientes.",
    especialidades: ["Asesoramiento para residencia permanente", "Regularización migratoria", "Reagrupación familiar", "Preparación y revisión de carpeta", "Gestión de antecedentes, legalizaciones y apostillas", "Atención y soporte durante el proceso"],
    idiomas: ["Español", "Portugués"],
    avatar: "/avatars/icono_abogada_avatar.jpeg",
  },
];

export const mockGestores: Gestor[] = [
  {
    id: "1",
    nombre: "Gestoría Central",
    tipo: "Gestoría General",
    ciudad: "Asunción",
    rating: 4.7,
    servicios: ["RUC", "Registro de Comercio", "Trámites Municipales"],
    precio: "desde Gs. 100.000",
  },
  {
    id: "2",
    nombre: "Gestión Rápida",
    tipo: "Gestoría Especializada",
    ciudad: "San Lorenzo",
    rating: 4.6,
    servicios: ["Cédula", "Pasaporte", "Licencias"],
    precio: "desde Gs. 120.000",
  },
];

export const mockOficialesJusticia: OficialJusticia[] = [
  {
    id: "1",
    nombre: "Oficialía Legal Express",
    ciudad: "Asunción",
    rating: 4.8,
    servicios: ["Notificaciones", "Diligencias", "Constancias"],
    precio: "desde Gs. 80.000",
  },
  {
    id: "2",
    nombre: "Servicios Judiciales PY",
    ciudad: "Luque",
    rating: 4.7,
    servicios: ["Notificaciones", "Embargos", "Medidas Cautelares"],
    precio: "desde Gs. 90.000",
  },
  {
    id: "3",
    nombre: "Oficialía Central",
    ciudad: "San Lorenzo",
    rating: 4.6,
    servicios: ["Notificaciones", "Diligencias", "Constancias", "Embargos"],
    precio: "desde Gs. 85.000",
  },
  {
    id: "4",
    nombre: "Servicios Judiciales del Este",
    ciudad: "Ciudad del Este",
    rating: 4.9,
    servicios: ["Notificaciones", "Medidas Cautelares", "Embargos"],
    precio: "desde Gs. 95.000",
  },
];

// Mantener compatibilidad con código antiguo (deprecated)
export const mockUjieres = mockOficialesJusticia;

export const mockCasos: Caso[] = [
  {
    id: "1",
    titulo: "López vs. Empresa X",
    numero: "#34721",
    estado: "activo",
    ultimaActualizacion: "Audiencia programada para el 20 de mayo",
    descripcion: "Caso de demanda laboral",
    profesionalId: "1",
  },
  {
    id: "2",
    titulo: "Expediente Juan Pérez",
    numero: "#34722",
    estado: "activo",
    ultimaActualizacion: "Documentos pendientes de revisión",
    descripcion: "Trámite de constitución de sociedad",
  },
];

export const mockMensajes: Mensaje[] = [
  {
    id: "1",
    remitente: "Dr. Mario Gómez",
    contenido: "He subido la demanda a nuestro chat.",
    fecha: "2024-05-13T10:30:00",
    leido: false,
    tipo: "documento",
  },
  {
    id: "2",
    remitente: "Asistente Legal",
    contenido: "Tu consulta ha sido recibida. Te contactaremos pronto.",
    fecha: "2024-05-13T09:15:00",
    leido: true,
    tipo: "sistema",
  },
];

export const mockCategorias: Categoria[] = [
  {
    id: "1",
    titulo: "Abogados",
    descripcion: "Civil, penal, laboral, corporativo",
    href: "/profesionales",
    icono: "/avatars/icono_abogados_-removebg-preview.png",
  },
  {
    id: "2",
    titulo: "Escribanos",
    descripcion: "Actas, poderes, escrituras, certificaciones",
    href: "/profesionales",
    icono: "/avatars/icono_escribanos_-removebg-preview.png",
  },
  {
    id: "3",
    titulo: "Despachantes",
    descripcion: "Aduanas, importación/exportación, trámites",
    href: "/profesionales",
    icono: "/avatars/icono_despachantes_-removebg-preview.png",
  },
  {
    id: "4",
    titulo: "Gestores",
    descripcion: "Documentos, registros, municipalidades",
    href: "/gestores",
    icono: "/avatars/icono_gestores_-removebg-preview.png",
  },
  {
    id: "5",
    titulo: "Oficial de Justicia",
    descripcion: "Notificaciones, diligencias y constancias",
    href: "/oficiales-justicia",
    icono: "/avatars/icono_oficialdejusticia_removedbackground.png",
  },
  {
    id: "6",
    titulo: "Gestiones Migratorias",
    descripcion: "Residencia · Documentos · Regularización",
    href: "/migraciones",
    icono: "/avatars/icono_gestionesmigratorias-removebg-preview.png",
  },
  {
    id: "7",
    titulo: "Casos",
    descripcion: "Seguimiento, hitos, alertas y documentos",
    href: "/casos",
  },
  {
    id: "8",
    titulo: "Mensajes",
    descripcion: "Chat, archivos y bot de asistencia",
    href: "/chat",
  },
];

// Datos mock para planes
export const mockPlanes: Plan[] = [
  {
    id: "1",
    nombre: "Básico",
    precio: 100000,
    moneda: "PYG",
    periodo: "mensual",
    descripcion: "Plan ideal para profesionales que recién comienzan",
    features: [
      "Perfil público visible",
      "Hasta 5 casos activos",
      "Notificaciones básicas",
      "Soporte por email",
    ],
  },
  {
    id: "2",
    nombre: "Pro + IA",
    precio: 250000,
    moneda: "PYG",
    periodo: "mensual",
    descripcion: "Potenciado con IA para mayor visibilidad y eficiencia",
    features: [
      "Todo lo del plan Básico",
      "Casos ilimitados",
      "Asistente IA para consultas",
      "Análisis de casos con IA",
      "Prioridad en búsquedas",
      "Soporte prioritario 24/7",
      "Estadísticas avanzadas",
    ],
    destacado: true,
  },
];

// Datos mock para métodos de pago
export const mockMetodosPago: MetodoPago[] = [
  // Paraguay
  {
    id: "bancard",
    nombre: "Tarjeta/QR (Bancard/TPago)",
    descripcion: "Pago con tarjeta de crédito/débito o código QR",
    tipo: "paraguay",
    icono: "💳",
    disponible: true,
  },
  {
    id: "transferencia",
    nombre: "Transferencia Bancaria",
    descripcion: "Transferencia directa desde tu banco",
    tipo: "paraguay",
    icono: "🏦",
    disponible: true,
  },
  {
    id: "tigo-money",
    nombre: "Tigo Money",
    descripcion: "Pago a través de tu billetera Tigo Money",
    tipo: "paraguay",
    icono: "📱",
    disponible: true,
  },
  {
    id: "personal-pay",
    nombre: "Personal Pay",
    descripcion: "Pago con tu billetera Personal Pay",
    tipo: "paraguay",
    icono: "📲",
    disponible: true,
  },
  {
    id: "zimple",
    nombre: "Zimple",
    descripcion: "Pago rápido con Zimple",
    tipo: "paraguay",
    icono: "💸",
    disponible: true,
  },
  {
    id: "pagopar",
    nombre: "Pagopar",
    descripcion: "Suscripción recurrente con Pagopar",
    tipo: "paraguay",
    icono: "🔁",
    disponible: true,
  },
  // Internacional
  {
    id: "tarjeta-int",
    nombre: "Tarjeta Internacional",
    descripcion: "Visa, Mastercard, American Express",
    tipo: "internacional",
    icono: "🌍",
    disponible: true,
  },
  {
    id: "stripe",
    nombre: "Stripe",
    descripcion: "Pago seguro con Stripe",
    tipo: "internacional",
    icono: "💳",
    disponible: true,
  },
  {
    id: "paypal",
    nombre: "PayPal",
    descripcion: "Pago con tu cuenta PayPal",
    tipo: "internacional",
    icono: "🅿️",
    disponible: true,
  },
];

// Ejemplos de profesionales recién inscritos (para demo)
export const mockProfesionalesRecienInscritos: ProfesionalSuscripcion[] = [
  {
    id: "prof-new-1",
    email: "nuevo1@example.com",
    nombre: "Dr. Carlos Mendoza",
    tipo: "Abogado",
    ciudad: "Asunción",
    planId: "2",
    metodoPagoId: "bancard",
    fechaAlta: "2024-05-15",
    estado: "activo",
  },
  {
    id: "prof-new-2",
    email: "nuevo2@example.com",
    nombre: "Esc. Ana Torres",
    tipo: "Escribana",
    ciudad: "Ciudad del Este",
    planId: "1",
    metodoPagoId: "tigo-money",
    fechaAlta: "2024-05-14",
    estado: "activo",
  },
];
