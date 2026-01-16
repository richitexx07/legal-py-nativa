// Tipos e interfaces para el módulo de Educación y Capacitación

export interface Docente {
  id: string;
  nombre: string;
  titulo: string;
  especialidad: string;
  bio: string;
  experiencia: number;
  avatar?: string;
  email: string;
  telefono: string;
  certificaciones?: string[];
}

export interface Especializacion {
  id: string;
  titulo: string;
  descripcion: string;
  area: string;
  nivel: "Básico" | "Intermedio" | "Avanzado" | "Especializado";
  duracion: string;
  modalidad: "Online" | "Presencial" | "Híbrido";
  precio: string;
  icono: string;
  objetivos: string[];
  contenido: string[];
  requisitos?: string[];
}

export interface Curso {
  id: string;
  slug: string;
  titulo: string;
  descripcion: string;
  descripcionLarga: string;
  area: string;
  nivel: "Básico" | "Intermedio" | "Avanzado";
  duracion: string;
  horas: number;
  modalidad: "Online" | "Presencial" | "Híbrido";
  precio: string;
  precioDescuento?: string;
  docenteId: string;
  temario: TemarioItem[];
  metodologia: string;
  certificacion: boolean;
  certificacionDescripcion?: string;
  proximasEdiciones: EdicionCurso[];
  requisitos?: string[];
  dirigidoA: string[];
  beneficios: string[];
  testimoniales?: Testimonial[];
  brochure?: string;
}

export interface TemarioItem {
  id: string;
  titulo: string;
  subtemas: string[];
  duracion: string;
}

export interface EdicionCurso {
  id: string;
  fechaInicio: string;
  fechaFin: string;
  horario: string;
  cupos: number;
  cuposDisponibles: number;
  modalidad: "Online" | "Presencial" | "Híbrido";
  lugar?: string;
  linkReunion?: string;
  estado: "Abierta" | "Completa" | "Finalizada" | "Próximamente";
}

export interface Certificacion {
  id: string;
  titulo: string;
  descripcion: string;
  nivel: "Básico" | "Intermedio" | "Avanzado" | "Especializado";
  requisitos: string[];
  duracion: string;
  costo: string;
  procesoVerificacion: string[];
  beneficios: string[];
  codigoEjemplo: string; // Para verificación ficticia
}

export interface Pasantia {
  id: string;
  titulo: string;
  area: string;
  descripcion: string;
  requisitos: string[];
  responsabilidades: string[];
  beneficios: string[];
  duracion: string;
  modalidad: "Presencial" | "Híbrido" | "Remoto";
  horario: string;
  certificacion: boolean;
  cupos: number;
  cuposDisponibles: number;
  fechaInicio: string;
  fechaFinPostulacion: string;
  estado: "Abierta" | "Cerrada" | "En selección" | "Finalizada";
}

export interface PostulacionPasantia {
  id: string;
  numeroSolicitud: string;
  pasantiaId: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  universidad: string;
  carrera: string;
  semestre: number;
  cv?: string; // Nombre del archivo
  disponibilidadHoraria: string;
  motivacion: string;
  fechaPostulacion: string;
  estado: "Recibido" | "En revisión" | "Entrevista" | "Finalista" | "Aceptado" | "Rechazado";
  observaciones?: string;
}

export interface SolicitudCapacitacion {
  id: string;
  numeroSolicitud: string;
  tipo: "Profesional" | "Empresa" | "Estudiante";
  nombre: string;
  email: string;
  telefono: string;
  empresa?: string;
  cargo?: string;
  areaInteres: string;
  modalidad: "Online" | "Presencial" | "In-company";
  cantidadParticipantes?: number;
  fechaDeseada?: string;
  objetivos: string;
  presupuesto?: string;
  fechaSolicitud: string;
  estado: "Recibido" | "En evaluación" | "Propuesta enviada" | "Aceptado" | "Rechazado";
  propuestaUrl?: string;
}

export interface InscripcionCurso {
  id: string;
  numeroInscripcion: string;
  cursoId: string;
  edicionId: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  empresa?: string;
  cargo?: string;
  metodoPago: string;
  fechaInscripcion: string;
  estado: "Pendiente" | "Confirmado" | "Cancelado";
  comprobante?: string;
}

export interface Testimonial {
  id: string;
  nombre: string;
  cargo: string;
  empresa?: string;
  comentario: string;
  rating: number;
  cursoId?: string;
  fecha: string;
}

// Datos Mock

export const mockDocentes: Docente[] = [
  {
    id: "doc-1",
    nombre: "Dr. Roberto Martínez",
    titulo: "Abogado Especialista en Litigación",
    especialidad: "Derecho Procesal Civil y Comercial",
    bio: "Más de 20 años de experiencia en litigación civil y comercial. Profesor universitario y autor de varios libros sobre derecho procesal.",
    experiencia: 20,
    email: "r.martinez@legalpy.edu.py",
    telefono: "+595 21 123-4567",
    certificaciones: ["Especialización en Derecho Procesal", "Mediador Certificado"],
    avatar: "/avatars/icono_abogado_avatar.jpeg",
  },
  {
    id: "doc-2",
    nombre: "Dra. María González",
    titulo: "Abogada Laboralista",
    especialidad: "Derecho Procesal Laboral",
    bio: "Especialista en derecho laboral con amplia experiencia en litigación y asesoría empresarial. Ex funcionaria del Ministerio de Trabajo.",
    experiencia: 15,
    email: "m.gonzalez@legalpy.edu.py",
    telefono: "+595 21 234-5678",
    certificaciones: ["Especialización en Derecho Laboral"],
    avatar: "/avatars/icono_abogada_avatar.jpeg",
  },
  {
    id: "doc-3",
    nombre: "Dr. Carlos Benítez",
    titulo: "Magistrado (R) y Profesor",
    especialidad: "Derecho Civil y Procesal Civil",
    bio: "Ex magistrado con 25 años de experiencia en la función judicial. Especialista en nulidades procesales y derecho civil.",
    experiencia: 25,
    email: "c.benitez@legalpy.edu.py",
    telefono: "+595 21 345-6789",
    certificaciones: ["Magistrado (R)", "Especialización en Derecho Civil"],
    avatar: "/avatars/icono_abogado_avatar.jpeg",
  },
  {
    id: "doc-4",
    nombre: "Dra. Ana Silva",
    titulo: "Abogada Especialista",
    especialidad: "Derecho Procesal y Litigación",
    bio: "Experta en redacción de demandas y estrategias procesales. Capacitadora en múltiples instituciones jurídicas.",
    experiencia: 12,
    email: "a.silva@legalpy.edu.py",
    telefono: "+595 21 456-7890",
    certificaciones: ["Especialización en Litigación Estratégica"],
    avatar: "/avatars/icono_abogada_avatar.jpeg",
  },
  {
    id: "doc-5",
    nombre: "Dr. Luis Fernández",
    titulo: "Abogado Especialista en Compliance",
    especialidad: "Derecho Financiero y Compliance",
    bio: "Especialista en cumplimiento normativo, SEPRELAD y prevención de lavado de activos. Consultor de empresas multinacionales.",
    experiencia: 18,
    email: "l.fernandez@legalpy.edu.py",
    telefono: "+595 21 567-8901",
    certificaciones: ["Certificación en Compliance", "Especialización en LA/FT"],
    avatar: "/avatars/icono_abogado_avatar.jpeg",
  },
];

export const mockEspecializaciones: Especializacion[] = [
  {
    id: "esp-1",
    titulo: "Litigación Civil y Comercial",
    descripcion: "Especialización completa en litigación civil y comercial con enfoque práctico y estratégico.",
    area: "Derecho Civil",
    nivel: "Especializado",
    duracion: "6 meses",
    modalidad: "Híbrido",
    precio: "Gs. 2.500.000",
    icono: "⚖️",
    objetivos: [
      "Dominar técnicas avanzadas de litigación",
      "Estrategias de negociación y mediación",
      "Redacción de escritos procesales de alto nivel",
    ],
    contenido: [
      "Fundamentos del proceso civil",
      "Estrategias de litigación",
      "Medidas cautelares",
      "Ejecución de sentencias",
      "Recursos procesales",
    ],
    requisitos: ["Título de abogado", "Mínimo 2 años de experiencia"],
  },
  {
    id: "esp-2",
    titulo: "Derecho Laboral y Relaciones de Trabajo",
    descripcion: "Especialización en derecho laboral, contratación, despidos y relaciones laborales.",
    area: "Derecho Laboral",
    nivel: "Avanzado",
    duracion: "4 meses",
    modalidad: "Online",
    precio: "Gs. 1.800.000",
    icono: "👔",
    objetivos: [
      "Dominar la normativa laboral paraguaya",
      "Gestionar conflictos laborales",
      "Asesorar en contratación y despidos",
    ],
    contenido: [
      "Contrato de trabajo",
      "Despidos y finiquitos",
      "Proceso laboral",
      "Seguridad social",
      "Negociación colectiva",
    ],
  },
  {
    id: "esp-3",
    titulo: "Derecho Corporativo y Compliance",
    descripcion: "Especialización en derecho corporativo, gobierno corporativo y cumplimiento normativo.",
    area: "Derecho Corporativo",
    nivel: "Especializado",
    duracion: "5 meses",
    modalidad: "Híbrido",
    precio: "Gs. 3.000.000",
    icono: "🏢",
    objetivos: [
      "Gestionar estructuras corporativas",
      "Implementar programas de compliance",
      "Asesorar en fusiones y adquisiciones",
    ],
    contenido: [
      "Sociedades comerciales",
      "Gobierno corporativo",
      "Compliance y ética empresarial",
      "Fusiones y adquisiciones",
      "Fintech y regulación",
    ],
  },
  {
    id: "esp-4",
    titulo: "Derecho Penal Económico",
    descripcion: "Especialización en delitos económicos, financieros y lavado de activos.",
    area: "Derecho Penal",
    nivel: "Avanzado",
    duracion: "4 meses",
    modalidad: "Online",
    precio: "Gs. 2.200.000",
    icono: "💰",
    objetivos: [
      "Comprender delitos económicos",
      "Asesorar en prevención de LA/FT",
      "Defender en procesos penales económicos",
    ],
    contenido: [
      "Delitos económicos",
      "Lavado de activos",
      "Financiamiento del terrorismo",
      "Proceso penal económico",
      "Compliance penal",
    ],
  },
  {
    id: "esp-5",
    titulo: "Derecho Tributario",
    descripcion: "Especialización en normativa tributaria, planificación fiscal y defensa tributaria.",
    area: "Derecho Tributario",
    nivel: "Avanzado",
    duracion: "5 meses",
    modalidad: "Híbrido",
    precio: "Gs. 2.800.000",
    icono: "📊",
    objetivos: [
      "Dominar la normativa tributaria",
      "Planificar estrategias fiscales",
      "Defender en procesos tributarios",
    ],
    contenido: [
      "Sistema tributario paraguayo",
      "IVA, IRP, IRACIS",
      "Planificación fiscal",
      "Proceso tributario",
      "Defensa en fiscalizaciones",
    ],
  },
  {
    id: "esp-6",
    titulo: "Propiedad Intelectual",
    descripcion: "Especialización en marcas, patentes, derechos de autor y protección de activos intangibles.",
    area: "Propiedad Intelectual",
    nivel: "Intermedio",
    duracion: "3 meses",
    modalidad: "Online",
    precio: "Gs. 1.500.000",
    icono: "📝",
    objetivos: [
      "Proteger activos intelectuales",
      "Gestionar marcas y patentes",
      "Asesorar en licencias",
    ],
    contenido: [
      "Marcas y signos distintivos",
      "Patentes e invenciones",
      "Derechos de autor",
      "Licencias y transferencias",
      "Enforcement y litigación",
    ],
  },
  {
    id: "esp-7",
    titulo: "Arbitraje y Mediación",
    descripcion: "Especialización en métodos alternativos de resolución de conflictos.",
    area: "ADR",
    nivel: "Avanzado",
    duracion: "4 meses",
    modalidad: "Híbrido",
    precio: "Gs. 2.000.000",
    icono: "🤝",
    objetivos: [
      "Dominar técnicas de mediación",
      "Gestionar procesos arbitrales",
      "Facilitar negociaciones",
    ],
    contenido: [
      "Mediación y conciliación",
      "Arbitraje comercial",
      "Técnicas de negociación",
      "Procedimientos ADR",
      "Ejecución de laudos",
    ],
  },
  {
    id: "esp-8",
    titulo: "Derecho Inmobiliario",
    descripcion: "Especialización en transacciones inmobiliarias, propiedad y desarrollo urbano.",
    area: "Derecho Inmobiliario",
    nivel: "Intermedio",
    duracion: "3 meses",
    modalidad: "Presencial",
    precio: "Gs. 1.800.000",
    icono: "🏠",
    objetivos: [
      "Gestionar transacciones inmobiliarias",
      "Asesorar en desarrollo urbano",
      "Proteger derechos de propiedad",
    ],
    contenido: [
      "Propiedad y posesión",
      "Contratos inmobiliarios",
      "Registro de inmuebles",
      "Desarrollo urbano",
      "Litigación inmobiliaria",
    ],
  },
];

export const mockCursos: Curso[] = [
  {
    id: "curso-1",
    slug: "litigacion-para-principiantes",
    titulo: "Litigación para Principiantes",
    descripcion: "Curso completo para abogados que inician en la práctica litigiosa. Desde atención al cliente hasta presentación de querellas.",
    descripcionLarga: "Este curso está diseñado para abogados que están comenzando su carrera en litigación. Cubre todos los aspectos fundamentales desde la atención inicial al cliente, alternativas al juicio, estructuración de honorarios, técnicas de litigación y presentación efectiva de querellas. Incluye casos prácticos y ejercicios de simulación.",
    area: "Derecho Procesal",
    nivel: "Básico",
    duracion: "8 semanas",
    horas: 40,
    modalidad: "Híbrido",
    precio: "Gs. 1.200.000",
    precioDescuento: "Gs. 950.000",
    docenteId: "doc-1",
    temario: [
      {
        id: "t1",
        titulo: "Atención al Cliente y Consultoría Legal",
        subtemas: [
          "Primera consulta: qué preguntar",
          "Análisis de viabilidad del caso",
          "Estructuración de honorarios",
          "Contratos de servicios legales",
        ],
        duracion: "5 horas",
      },
      {
        id: "t2",
        titulo: "Alternativas al Juicio",
        subtemas: [
          "Negociación directa",
          "Mediación y conciliación",
          "Transacciones y acuerdos",
          "Cuándo litigar vs. negociar",
        ],
        duracion: "4 horas",
      },
      {
        id: "t3",
        titulo: "Fundamentos de Litigación",
        subtemas: [
          "Estructura del proceso civil",
          "Competencia y jurisdicción",
          "Medidas preparatorias",
          "Estrategias procesales",
        ],
        duracion: "8 horas",
      },
      {
        id: "t4",
        titulo: "Redacción de Escritos Procesales",
        subtemas: [
          "Demandas y contestaciones",
          "Excepciones y defensas",
          "Recursos procesales",
          "Escritos de prueba",
        ],
        duracion: "10 horas",
      },
      {
        id: "t5",
        titulo: "Presentación de Querellas",
        subtemas: [
          "Querellas civiles",
          "Querellas penales",
          "Documentación requerida",
          "Seguimiento del caso",
        ],
        duracion: "6 horas",
      },
      {
        id: "t6",
        titulo: "Taller Práctico",
        subtemas: [
          "Simulación de audiencias",
          "Redacción de casos reales",
          "Feedback personalizado",
        ],
        duracion: "7 horas",
      },
    ],
    metodologia: "Clases teóricas, casos prácticos, talleres de redacción y simulaciones de audiencias. Material de estudio incluido.",
    certificacion: true,
    certificacionDescripcion: "Certificado de participación y aprobación emitido por Legal PY. Válido para créditos de educación continua.",
    proximasEdiciones: [
      {
        id: "ed-1",
        fechaInicio: "2025-02-10",
        fechaFin: "2025-04-07",
        horario: "Lunes y Miércoles 19:00 - 21:00",
        cupos: 25,
        cuposDisponibles: 18,
        modalidad: "Híbrido",
        lugar: "Sede Legal PY, Asunción / Online",
        linkReunion: "https://meet.legalpy.edu.py/litigacion-feb",
        estado: "Abierta",
      },
      {
        id: "ed-2",
        fechaInicio: "2025-03-15",
        fechaFin: "2025-05-10",
        horario: "Sábados 09:00 - 13:00",
        cupos: 30,
        cuposDisponibles: 30,
        modalidad: "Presencial",
        lugar: "Sede Legal PY, Asunción",
        estado: "Abierta",
      },
    ],
    requisitos: ["Título de abogado", "Conocimientos básicos de derecho procesal"],
    dirigidoA: [
      "Abogados recién egresados",
      "Abogados que inician en litigación",
      "Estudiantes de último año de derecho",
    ],
    beneficios: [
      "Material de estudio completo",
      "Acceso a biblioteca digital",
      "Certificado de participación",
      "Networking con colegas",
      "Soporte post-curso",
    ],
    testimoniales: [
      {
        id: "test-1",
        nombre: "Juan Pérez",
        cargo: "Abogado",
        comentario: "Excelente curso, muy práctico y bien estructurado. Me dio las herramientas necesarias para comenzar a litigar con confianza.",
        rating: 5,
        cursoId: "curso-1",
        fecha: "2024-11-15",
      },
    ],
    brochure: "/brochures/litigacion-principiantes.pdf",
  },
  {
    id: "curso-2",
    slug: "derecho-procesal-laboral",
    titulo: "Curso Teórico–Práctico en Derecho Procesal Laboral",
    descripcion: "Curso completo sobre el proceso laboral: demanda, contestación, excepciones, prueba y ejecución.",
    descripcionLarga: "Curso intensivo que cubre todos los aspectos del proceso laboral paraguayo. Desde la presentación de la demanda hasta la ejecución de sentencias. Incluye análisis de jurisprudencia y casos prácticos reales.",
    area: "Derecho Laboral",
    nivel: "Intermedio",
    duracion: "6 semanas",
    horas: 32,
    modalidad: "Online",
    precio: "Gs. 1.000.000",
    docenteId: "doc-2",
    temario: [
      {
        id: "t1",
        titulo: "Demanda Laboral",
        subtemas: [
          "Requisitos de la demanda",
          "Contenido y estructura",
          "Documentación anexa",
          "Presentación y registro",
        ],
        duracion: "6 horas",
      },
      {
        id: "t2",
        titulo: "Contestación y Excepciones",
        subtemas: [
          "Plazo para contestar",
          "Excepciones procesales",
          "Excepciones de fondo",
          "Reconvención",
        ],
        duracion: "5 horas",
      },
      {
        id: "t3",
        titulo: "Etapa Probatoria",
        subtemas: [
          "Medios de prueba",
          "Ofrecimiento de prueba",
          "Prueba documental",
          "Prueba testimonial",
        ],
        duracion: "8 horas",
      },
      {
        id: "t4",
        titulo: "Sentencia y Recursos",
        subtemas: [
          "Estructura de la sentencia",
          "Recursos disponibles",
          "Apelación",
          "Casación",
        ],
        duracion: "6 horas",
      },
      {
        id: "t5",
        titulo: "Ejecución Laboral",
        subtemas: [
          "Título ejecutivo",
          "Proceso de ejecución",
          "Embargos y medidas",
          "Liquidación de haberes",
        ],
        duracion: "7 horas",
      },
    ],
    metodologia: "Clases en vivo, material de estudio, casos prácticos y foro de discusión.",
    certificacion: true,
    proximasEdiciones: [
      {
        id: "ed-1",
        fechaInicio: "2025-02-05",
        fechaFin: "2025-03-19",
        horario: "Martes y Jueves 20:00 - 22:00",
        cupos: 40,
        cuposDisponibles: 25,
        modalidad: "Online",
        linkReunion: "https://meet.legalpy.edu.py/laboral-feb",
        estado: "Abierta",
      },
    ],
    requisitos: ["Título de abogado", "Conocimientos básicos de derecho laboral"],
    dirigidoA: [
      "Abogados laboralistas",
      "Abogados que manejan casos laborales",
      "Estudiantes avanzados",
    ],
    beneficios: [
      "Grabaciones de clases",
      "Material actualizado",
      "Certificado de participación",
    ],
    brochure: "/brochures/procesal-laboral.pdf",
  },
  {
    id: "curso-3",
    slug: "nulidades-proceso-civil",
    titulo: "Nulidades en el Proceso Civil",
    descripcion: "Curso especializado sobre nulidades procesales, incluye video-clases y análisis jurisprudencial.",
    descripcionLarga: "Curso avanzado sobre nulidades en el proceso civil paraguayo. Análisis exhaustivo de la jurisprudencia, tipos de nulidades, efectos y recursos. Incluye video-clases grabadas y material complementario.",
    area: "Derecho Procesal Civil",
    nivel: "Avanzado",
    duracion: "5 semanas",
    horas: 30,
    modalidad: "Online",
    precio: "Gs. 1.500.000",
    docenteId: "doc-3",
    temario: [
      {
        id: "t1",
        titulo: "Fundamentos de las Nulidades",
        subtemas: [
          "Concepto y naturaleza",
          "Principios generales",
          "Clasificación",
          "Efectos de la nulidad",
        ],
        duracion: "6 horas",
      },
      {
        id: "t2",
        titulo: "Nulidades Absolutas",
        subtemas: [
          "Características",
          "Casos de aplicación",
          "Procedimiento",
          "Jurisprudencia",
        ],
        duracion: "8 horas",
      },
      {
        id: "t3",
        titulo: "Nulidades Relativas",
        subtemas: [
          "Diferencias con absolutas",
          "Casos específicos",
          "Sanación de vicios",
          "Jurisprudencia",
        ],
        duracion: "8 horas",
      },
      {
        id: "t4",
        titulo: "Recursos y Nulidades",
        subtemas: [
          "Recurso de nulidad",
          "Nulidad como excepción",
          "Nulidad en casación",
          "Estrategias procesales",
        ],
        duracion: "8 horas",
      },
    ],
    metodologia: "Video-clases grabadas, material de lectura, análisis de casos y foro de consultas.",
    certificacion: true,
    proximasEdiciones: [
      {
        id: "ed-1",
        fechaInicio: "2025-02-01",
        fechaFin: "2025-03-08",
        horario: "Acceso 24/7 (asíncrono)",
        cupos: 50,
        cuposDisponibles: 35,
        modalidad: "Online",
        estado: "Abierta",
      },
    ],
    requisitos: ["Título de abogado", "Experiencia en litigación civil"],
    dirigidoA: [
      "Abogados litigantes",
      "Magistrados",
      "Estudiantes avanzados",
    ],
    beneficios: [
      "Acceso permanente a video-clases",
      "Material actualizado",
      "Certificado de participación",
    ],
    brochure: "/brochures/nulidades-civil.pdf",
  },
  {
    id: "curso-4",
    slug: "como-plantear-demanda",
    titulo: "Cómo Plantear una Demanda",
    descripcion: "Curso práctico sobre competencia, medidas preparatorias, redacción de demandas, citación y sumarísimo.",
    descripcionLarga: "Curso intensivo que enseña paso a paso cómo plantear una demanda efectiva. Cubre desde la determinación de competencia hasta la presentación y seguimiento. Incluye taller de jurisprudencia.",
    area: "Derecho Procesal",
    nivel: "Básico",
    duracion: "6 semanas",
    horas: 36,
    modalidad: "Híbrido",
    precio: "Gs. 1.100.000",
    docenteId: "doc-4",
    temario: [
      {
        id: "t1",
        titulo: "Competencia y Jurisdicción",
        subtemas: [
          "Determinación de competencia",
          "Competencia territorial",
          "Competencia por materia",
          "Conflictos de competencia",
        ],
        duracion: "5 horas",
      },
      {
        id: "t2",
        titulo: "Medidas Preparatorias",
        subtemas: [
          "Embargos preventivos",
          "Medidas cautelares",
          "Procedimiento",
          "Garantías",
        ],
        duracion: "6 horas",
      },
      {
        id: "t3",
        titulo: "Redacción de la Demanda",
        subtemas: [
          "Estructura de la demanda",
          "Hechos y fundamentos",
          "Petitorio",
          "Documentación",
        ],
        duracion: "10 horas",
      },
      {
        id: "t4",
        titulo: "Citación y Notificaciones",
        subtemas: [
          "Proceso de citación",
          "Notificaciones",
          "Plazos procesales",
          "Efectos de la citación",
        ],
        duracion: "5 horas",
      },
      {
        id: "t5",
        titulo: "Proceso Sumarísimo",
        subtemas: [
          "Características",
          "Cuándo aplicar",
          "Diferencias con ordinario",
          "Estrategias",
        ],
        duracion: "5 horas",
      },
      {
        id: "t6",
        titulo: "Taller de Jurisprudencia",
        subtemas: [
          "Análisis de casos",
          "Jurisprudencia relevante",
          "Aplicación práctica",
        ],
        duracion: "5 horas",
      },
    ],
    metodologia: "Clases teóricas, talleres prácticos, ejercicios de redacción y análisis de casos.",
    certificacion: true,
    proximasEdiciones: [
      {
        id: "ed-1",
        fechaInicio: "2025-02-12",
        fechaFin: "2025-03-26",
        horario: "Miércoles y Viernes 19:00 - 21:00",
        cupos: 30,
        cuposDisponibles: 22,
        modalidad: "Híbrido",
        lugar: "Sede Legal PY, Asunción / Online",
        linkReunion: "https://meet.legalpy.edu.py/demanda-feb",
        estado: "Abierta",
      },
    ],
    requisitos: ["Título de abogado o estudiante avanzado"],
    dirigidoA: [
      "Abogados que inician",
      "Estudiantes de último año",
      "Abogados que buscan mejorar",
    ],
    beneficios: [
      "Plantillas de demandas",
      "Material de estudio",
      "Certificado de participación",
    ],
    brochure: "/brochures/como-plantear-demanda.pdf",
  },
  {
    id: "curso-5",
    slug: "marco-legal-seprelad-vehiculos",
    titulo: "Marco Legal de Sujetos Obligados ante la SEPRELAD (Operaciones Vehículos Automotores)",
    descripcion: "Curso especializado sobre obligaciones, informes y cumplimiento normativo para concesionarias y empresas del sector automotor.",
    descripcionLarga: "Curso dirigido a empresas del sector automotor que son sujetos obligados ante la SEPRELAD. Cubre todas las obligaciones, informes requeridos y mejores prácticas de cumplimiento normativo.",
    area: "Compliance",
    nivel: "Intermedio",
    duracion: "4 semanas",
    horas: 24,
    modalidad: "Online",
    precio: "Gs. 1.800.000",
    docenteId: "doc-5",
    temario: [
      {
        id: "t1",
        titulo: "Marco Normativo SEPRELAD",
        subtemas: [
          "Ley 1015/97",
          "Decretos reglamentarios",
          "Resoluciones SEPRELAD",
          "Actualizaciones normativas",
        ],
        duracion: "6 horas",
      },
      {
        id: "t2",
        titulo: "Obligaciones de los Sujetos Obligados",
        subtemas: [
          "Identificación de clientes",
          "Diligencias de conocimiento",
          "Conservación de registros",
          "Comunicación de operaciones sospechosas",
        ],
        duracion: "8 horas",
      },
      {
        id: "t3",
        titulo: "Informes y Reportes",
        subtemas: [
          "Informes periódicos",
          "Reportes de operaciones",
          "Plazos y formatos",
          "Sistema de reportes SEPRELAD",
        ],
        duracion: "6 horas",
      },
      {
        id: "t4",
        titulo: "Cumplimiento Normativo",
        subtemas: [
          "Programas de compliance",
          "Políticas internas",
          "Capacitación del personal",
          "Auditorías internas",
        ],
        duracion: "4 horas",
      },
    ],
    metodologia: "Clases en vivo, material actualizado, casos prácticos y plantillas de documentos.",
    certificacion: true,
    proximasEdiciones: [
      {
        id: "ed-1",
        fechaInicio: "2025-02-20",
        fechaFin: "2025-03-20",
        horario: "Jueves 19:00 - 21:00",
        cupos: 35,
        cuposDisponibles: 28,
        modalidad: "Online",
        linkReunion: "https://meet.legalpy.edu.py/seprelad-feb",
        estado: "Abierta",
      },
    ],
    requisitos: ["Conocimientos básicos de derecho comercial"],
    dirigidoA: [
      "Abogados corporativos",
      "Responsables de compliance",
      "Gerentes legales",
      "Empresas del sector automotor",
    ],
    beneficios: [
      "Plantillas de documentos",
      "Material actualizado",
      "Certificado de participación",
      "Asesoría post-curso (1 mes)",
    ],
    brochure: "/brochures/seprelad-vehiculos.pdf",
  },
];

export const mockCertificaciones: Certificacion[] = [
  {
    id: "cert-1",
    titulo: "Certificación en Litigación Estratégica",
    descripcion: "Certificación avanzada que valida competencias en litigación estratégica y técnicas procesales.",
    nivel: "Especializado",
    requisitos: [
      "Título de abogado",
      "Mínimo 3 años de experiencia en litigación",
      "Aprobar examen teórico-práctico",
      "Presentar 3 casos exitosos",
    ],
    duracion: "6 meses",
    costo: "Gs. 3.500.000",
    procesoVerificacion: [
      "Inscripción y evaluación de requisitos",
      "Curso preparatorio (4 meses)",
      "Examen teórico",
      "Examen práctico (simulación)",
      "Evaluación de casos presentados",
      "Emisión de certificado",
    ],
    beneficios: [
      "Certificado verificado digitalmente",
      "Inclusión en directorio de certificados",
      "Credenciales físicas y digitales",
      "Actualización continua",
    ],
    codigoEjemplo: "LPY-LIT-2025-00123",
  },
  {
    id: "cert-2",
    titulo: "Certificación en Compliance y Prevención de LA/FT",
    descripcion: "Certificación que valida conocimientos y competencias en compliance y prevención de lavado de activos.",
    nivel: "Avanzado",
    requisitos: [
      "Título de abogado o relacionado",
      "Mínimo 2 años de experiencia",
      "Aprobar examen de conocimientos",
      "Curso de actualización anual",
    ],
    duracion: "4 meses",
    costo: "Gs. 2.800.000",
    procesoVerificacion: [
      "Inscripción",
      "Curso preparatorio",
      "Examen de conocimientos",
      "Emisión de certificado",
      "Renovación anual",
    ],
    beneficios: [
      "Certificado verificado",
      "Acceso a actualizaciones normativas",
      "Red de profesionales certificados",
    ],
    codigoEjemplo: "LPY-COMP-2025-00456",
  },
];

export const mockPasantias: Pasantia[] = [
  {
    id: "pas-1",
    titulo: "Secretaría Jurídica Junior",
    area: "Administración Legal",
    descripcion: "Pasantía para estudiantes de derecho que deseen adquirir experiencia en secretaría jurídica, organización de expedientes y apoyo administrativo.",
    requisitos: [
      "Estudiante de derecho (4to año en adelante)",
      "Disponibilidad de 20 horas semanales",
      "Conocimientos básicos de derecho procesal",
      "Manejo de herramientas ofimáticas",
    ],
    responsabilidades: [
      "Organización de expedientes",
      "Redacción de documentos básicos",
      "Atención telefónica y presencial",
      "Apoyo en gestión administrativa",
      "Actualización de bases de datos",
    ],
    beneficios: [
      "Experiencia práctica en entorno legal",
      "Certificado de pasantía",
      "Posibilidad de referencia laboral",
      "Capacitación continua",
      "Stipend mensual de Gs. 500.000",
    ],
    duracion: "6 meses",
    modalidad: "Presencial",
    horario: "Lunes a Viernes, 4 horas diarias (flexible)",
    certificacion: true,
    cupos: 3,
    cuposDisponibles: 2,
    fechaInicio: "2025-03-01",
    fechaFinPostulacion: "2025-02-15",
    estado: "Abierta",
  },
  {
    id: "pas-2",
    titulo: "Asistente de Litigación",
    area: "Litigación",
    descripcion: "Pasantía para estudiantes avanzados interesados en litigación. Apoyo en preparación de casos, investigación y asistencia en audiencias.",
    requisitos: [
      "Estudiante de derecho (5to año o egresado reciente)",
      "Interés en litigación",
      "Disponibilidad de 25 horas semanales",
      "Buen nivel de redacción",
    ],
    responsabilidades: [
      "Investigación jurídica",
      "Preparación de escritos procesales",
      "Asistencia en audiencias",
      "Análisis de jurisprudencia",
      "Apoyo en estrategias procesales",
    ],
    beneficios: [
      "Experiencia directa en litigación",
      "Mentoría de abogados senior",
      "Certificado de pasantía",
      "Stipend mensual de Gs. 600.000",
    ],
    duracion: "6 meses",
    modalidad: "Híbrido",
    horario: "Lunes a Viernes, 5 horas diarias",
    certificacion: true,
    cupos: 2,
    cuposDisponibles: 1,
    fechaInicio: "2025-03-01",
    fechaFinPostulacion: "2025-02-15",
    estado: "Abierta",
  },
  {
    id: "pas-3",
    titulo: "Legal Operations",
    area: "Operaciones Legales",
    descripcion: "Pasantía enfocada en optimización de procesos legales, tecnología legal y gestión de casos.",
    requisitos: [
      "Estudiante de derecho o carreras afines",
      "Interés en tecnología y procesos",
      "Disponibilidad de 20 horas semanales",
      "Conocimientos básicos de herramientas digitales",
    ],
    responsabilidades: [
      "Optimización de procesos",
      "Gestión de sistemas legales",
      "Análisis de datos",
      "Automatización de tareas",
      "Apoyo en proyectos de innovación",
    ],
    beneficios: [
      "Experiencia en legal tech",
      "Certificado de pasantía",
      "Stipend mensual de Gs. 550.000",
    ],
    duracion: "4 meses",
    modalidad: "Remoto",
    horario: "Flexible, 20 horas semanales",
    certificacion: true,
    cupos: 2,
    cuposDisponibles: 2,
    fechaInicio: "2025-03-15",
    fechaFinPostulacion: "2025-03-01",
    estado: "Abierta",
  },
];

// Datos de ejemplo para almacenamiento local (simulado)
export const mockInscripciones: InscripcionCurso[] = [];
export const mockPostulaciones: PostulacionPasantia[] = [];
export const mockSolicitudesCapacitacion: SolicitudCapacitacion[] = [];
