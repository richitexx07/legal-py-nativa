/**
 * Tipos específicos para el módulo educativo de Legal PY
 */

/**
 * Registro de asistencia a pasantía (check-in biométrico)
 */
export interface InternshipCheckIn {
  id: string;
  studentId: string;
  internshipId: string;
  checkInDate: string; // ISO 8601 date string
  checkInTime: string; // HH:mm format
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  photoDataUrl: string; // Foto del check-in
  verified: boolean;
  verifiedBy?: string; // ID del tutor/profesional que verificó
  verifiedAt?: string; // ISO 8601 date string
}

/**
 * Entrada de bitácora de casos
 */
export interface CaseLogEntry {
  id: string;
  studentId: string;
  internshipId: string;
  caseId?: string; // ID del caso relacionado (opcional)
  entryDate: string; // ISO 8601 date string
  description: string; // "Hoy redacté una providencia en el caso X"
  validated: boolean;
  validatedBy?: string; // ID del tutor
  validatedAt?: string; // ISO 8601 date string
}

/**
 * Pasantía supervisada digital
 */
export interface DigitalInternship {
  id: string;
  studentId: string;
  tutorId: string; // ID del profesional o docente tutor
  institutionId: string;
  startDate: string; // ISO 8601 date string
  endDate: string; // ISO 8601 date string
  requiredHours: number; // Horas requeridas (ej: 200)
  completedHours: number; // Horas completadas
  status: "active" | "completed" | "cancelled";
  checkIns: InternshipCheckIn[];
  caseLogs: CaseLogEntry[];
  location?: {
    name: string; // "Juzgado de Primera Instancia", "Estudio Jurídico XYZ"
    address: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
}

/**
 * Score de actividad del estudiante
 */
export interface StudentActivityScore {
  studentId: string;
  totalScore: number; // Puntaje total
  components: {
    internshipHours: number; // Horas de pasantía completadas
    caseLogs: number; // Número de entradas en bitácora
    validatedTasks: number; // Tareas validadas por tutores
    platformActivity: number; // Actividad general en la plataforma
  };
  lastUpdated: string; // ISO 8601 date string
}

/**
 * Distinción académica
 */
export interface AcademicDistinction {
  id: string;
  studentId: string;
  institutionId: string;
  distinctionType: "honor" | "merit" | "excellence" | "top_graduate";
  title: string; // "Summa Cum Laude", "Mejor Promedio", etc.
  description?: string;
  awardedDate: string; // ISO 8601 date string
  validated: boolean; // Validado por la institución
  certificateUrl?: string; // URL del certificado
}

/**
 * Perfil de talento para bolsa de trabajo
 */
export interface TalentProfile {
  studentId: string;
  institutionId: string;
  isTopTalent: boolean; // Tiene badge "Top Talent 🌟"
  activityScore: StudentActivityScore;
  distinctions: AcademicDistinction[];
  languages: string[]; // ["es", "en", "pt"]
  availableForInternational: boolean; // Disponible para pasantías internacionales
  preferredLocations?: string[]; // Países/ciudades preferidas
  lastUpdated: string; // ISO 8601 date string
}
