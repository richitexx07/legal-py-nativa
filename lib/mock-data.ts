// Tipos para los datos mock

export interface Profesional {
  id: string;
  nombre: string;
  titulo: string;
  especialidad: string;
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

export interface Ujier {
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

// Datos mock

export const mockProfesionales: Profesional[] = [
  {
    id: "1",
    nombre: "Dr. Mario Gómez",
    titulo: "Abogado Penalista",
    especialidad: "Penal",
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
    id: "4",
    nombre: "Esc. Laura Aquino",
    titulo: "Escribana",
    especialidad: "Notarial",
    ciudad: "Asunción",
    rating: 4.9,
    experiencia: 8,
    precio: "desde Gs. 250.000",
    descripcion: "Escribana pública con amplia experiencia en actas y escrituras.",
    especialidades: ["Notarial", "Registral"],
    idiomas: ["Español"],
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

export const mockUjieres: Ujier[] = [
  {
    id: "1",
    nombre: "Ujiería Legal Express",
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
];

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
    titulo: "Ujieres",
    descripcion: "Notificaciones, diligencias y constancias",
    href: "/ujieres",
    icono: "/avatars/icono_ujieres_-removebg-preview.png",
  },
  {
    id: "6",
    titulo: "Migraciones",
    descripcion: "Residencia, cédula, trámites para extranjeros",
    href: "/migraciones",
    icono: "/avatars/icono_migraciones_-removebg-preview.png",
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
