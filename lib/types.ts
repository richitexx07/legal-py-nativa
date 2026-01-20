// Tipos de usuario y autenticación para Legal PY

/**
 * Roles disponibles en la plataforma
 */
export type UserRole = "cliente" | "profesional" | "estudiante";

/**
 * Estado de verificación del usuario
 */
export type VerificationStatus = "pending" | "verified" | "rejected";

/**
 * Métodos de autenticación disponibles
 */
export type AuthMethod = "email" | "google" | "facebook" | "apple";

/**
 * Estado de activación de 2FA
 */
export type TwoFactorStatus = "disabled" | "enabled" | "pending";

/**
 * Información básica del usuario
 */
export interface User {
  id: string; // ID único no editable, generado automáticamente
  email: string;
  role: UserRole;
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  twoFactorMethod?: "email" | "sms" | "app";
  active: boolean;
  lastLogin?: string; // ISO 8601 date string
  authMethod: AuthMethod;
}

/**
 * Perfil del cliente
 */
export interface ClientProfile {
  userId: string; // Referencia al User.id
  firstName: string;
  lastName: string;
  phone?: string;
  documentType?: "cedula" | "pasaporte" | "dni";
  documentNumber?: string;
  dateOfBirth?: string; // ISO 8601 date string
  address?: {
    street?: string;
    city?: string;
    department?: string;
    zipCode?: string;
    country?: string;
  };
  preferredLanguage: "es" | "gn" | "en" | "pt";
  avatar?: string;
  verificationStatus: VerificationStatus;
}

/**
 * Especialidad del profesional
 */
export type ProfessionalSpecialty =
  | "Abogados"
  | "Escribanos"
  | "Despachantes"
  | "Gestores"
  | "Oficial de Justicia"
  | "Gestiones Migratorias";

/**
 * Perfil del profesional
 */
export interface ProfessionalProfile {
  userId: string; // Referencia al User.id
  firstName: string;
  lastName: string;
  professionalTitle: string; // Ej: "Dr.", "Dra.", "Lic.", etc.
  specialties: ProfessionalSpecialty[];
  experienceYears: number;
  city: string;
  phone?: string;
  documentType?: "cedula" | "pasaporte" | "dni";
  documentNumber?: string;
  professionalLicense?: string; // Número de matrícula
  bio?: string;
  languages: string[]; // Idiomas que maneja
  avatar?: string;
  verificationStatus: VerificationStatus;
  rating?: number;
  casesHandled?: number;
  planId?: string; // ID del plan de suscripción
  planStatus?: "active" | "pending" | "suspended" | "cancelled";
}

/**
 * Perfil del estudiante/pasante
 */
export interface StudentProfile {
  userId: string; // Referencia al User.id
  firstName: string;
  lastName: string;
  studentId?: string; // Número de cédula de estudiante
  university?: string;
  career?: string; // Carrera que estudia
  yearOfStudy?: number; // Año de estudio (1-5)
  phone?: string;
  dateOfBirth?: string; // ISO 8601 date string
  address?: {
    street?: string;
    city?: string;
    department?: string;
    zipCode?: string;
  };
  cvUrl?: string; // URL del CV subido
  coverLetterUrl?: string; // URL de carta de presentación
  preferredLanguage: "es" | "gn" | "en" | "pt";
  avatar?: string;
  verificationStatus: VerificationStatus;
  internshipsApplied?: string[]; // IDs de pasantías a las que se postuló
}

/**
 * Usuario completo con su perfil según el rol
 */
export type UserWithProfile =
  | (User & { profile: ClientProfile })
  | (User & { profile: ProfessionalProfile })
  | (User & { profile: StudentProfile });

/**
 * Datos de registro inicial
 */
export interface RegisterData {
  email: string;
  password: string;
  role: UserRole;
  authMethod?: AuthMethod;
  acceptTerms: boolean;
  acceptPrivacy: boolean;
}

/**
 * Datos de login
 */
export interface LoginData {
  email: string;
  password?: string; // Opcional si es login social
  authMethod: AuthMethod;
  twoFactorCode?: string; // Código 2FA si está habilitado
  rememberMe?: boolean;
}

/**
 * Sesión de usuario autenticado
 */
export interface AuthSession {
  user: User;
  profile: ClientProfile | ProfessionalProfile | StudentProfile;
  token?: string; // Token JWT mock (no real por ahora)
  expiresAt?: string; // ISO 8601 date string
}

/**
 * Respuesta de autenticación
 */
export interface AuthResponse {
  success: boolean;
  session?: AuthSession;
  requiresTwoFactor?: boolean;
  twoFactorMethod?: "email" | "sms" | "app";
  message?: string;
  error?: string;
}

/**
 * Datos para completar perfil después del registro
 */
export type ProfileCompletionData =
  | Partial<ClientProfile>
  | Partial<ProfessionalProfile>
  | Partial<StudentProfile>;
