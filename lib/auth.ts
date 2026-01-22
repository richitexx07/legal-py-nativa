// Funciones mock de autenticación para Legal PY
// Todas las funciones simulan operaciones sin backend real

import {
  User,
  UserRole,
  RegisterData,
  LoginData,
  AuthResponse,
  AuthSession,
  ClientProfile,
  ProfessionalProfile,
  StudentProfile,
  ProfileCompletionData,
  AuthMethod,
  LegalCase,
} from "./types";

/**
 * Genera un ID único para usuarios
 */
function generateUserId(): string {
  return `usr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

const SESSION_API = "/api/auth/session";

/**
 * Almacena la sesión en localStorage y sincroniza cookie httpOnly vía API
 * para que el middleware pueda verificar autenticación en rutas protegidas.
 */
async function saveSession(session: AuthSession): Promise<void> {
  if (typeof window === "undefined") return;
  localStorage.setItem("legal-py-session", JSON.stringify(session));
  try {
    await fetch(SESSION_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session }),
      credentials: "same-origin",
    });
  } catch {
    // Ignorar fallos de red; localStorage sigue siendo fuente de verdad en cliente
  }
}

/**
 * Obtiene la sesión actual de localStorage
 */
export function getSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("legal-py-session");
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

/**
 * Elimina la sesión (localStorage y cookie vía API)
 */
export async function clearSession(): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    await fetch(SESSION_API, { method: "DELETE", credentials: "same-origin" });
  } catch {
    // Ignorar fallos de red
  }
  localStorage.removeItem("legal-py-session");
}

/**
 * Obtiene todos los usuarios almacenados
 */
function getUsers(): User[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem("legal-py-users");
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

/**
 * Guarda un usuario
 */
function saveUser(user: User): void {
  const users = getUsers();
  const existingIndex = users.findIndex((u) => u.id === user.id);
  if (existingIndex >= 0) {
    users[existingIndex] = user;
  } else {
    users.push(user);
  }
  localStorage.setItem("legal-py-users", JSON.stringify(users));
}

/**
 * Obtiene un perfil según el tipo
 */
function getProfile(userId: string, role: UserRole): ClientProfile | ProfessionalProfile | StudentProfile | null {
  if (typeof window === "undefined") return null;
  const key = `legal-py-profile-${role}-${userId}`;
  const stored = localStorage.getItem(key);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

/**
 * Guarda un perfil
 */
function saveProfile(userId: string, role: UserRole, profile: ClientProfile | ProfessionalProfile | StudentProfile): void {
  const key = `legal-py-profile-${role}-${userId}`;
  localStorage.setItem(key, JSON.stringify(profile));
}

/**
 * Genera un código 2FA mock
 */
function generateTwoFactorCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Simula envío de código 2FA (solo mock, no envía realmente)
 */
function sendTwoFactorCode(email: string, code: string, method: "email" | "sms" | "app"): void {
  // En producción, aquí se enviaría el código realmente
  // Por ahora, lo guardamos en localStorage para pruebas
  localStorage.setItem("legal-py-2fa-code", JSON.stringify({ email, code, method, expiresAt: Date.now() + 10 * 60 * 1000 })); // 10 minutos
  console.log(`[MOCK] 2FA Code for ${email}: ${code} (method: ${method})`);
}

/**
 * Verifica un código 2FA
 */
function verifyTwoFactorCode(email: string, code: string): boolean {
  const stored = localStorage.getItem("legal-py-2fa-code");
  if (!stored) return false;
  try {
    const data = JSON.parse(stored);
    if (data.email !== email) return false;
    if (data.code !== code) return false;
    if (Date.now() > data.expiresAt) return false;
    return true;
  } catch {
    return false;
  }
}

/**
 * Registra un nuevo usuario
 */
export async function register(data: RegisterData): Promise<AuthResponse> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Validaciones
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return {
      success: false,
      error: "Email inválido",
    };
  }

  if (!data.password || data.password.length < 8) {
    return {
      success: false,
      error: "La contraseña debe tener al menos 8 caracteres",
    };
  }

  // En modo demo, no requerir aceptación de términos
  const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === "true";
  if (!isDemo && (!data.acceptTerms || !data.acceptPrivacy)) {
    return {
      success: false,
      error: "Debes aceptar los términos y condiciones y la política de privacidad",
    };
  }

  // Verificar si el email ya existe
  const users = getUsers();
  const existingUser = users.find((u) => u.email === data.email);
  if (existingUser) {
    return {
      success: false,
      error: "Este email ya está registrado",
    };
  }

  // Crear nuevo usuario
  const now = new Date().toISOString();
  const newUser: User = {
    id: generateUserId(),
    email: data.email,
    role: data.role,
    createdAt: now,
    updatedAt: now,
    emailVerified: false, // Requiere verificación
    twoFactorEnabled: false,
    active: true,
    authMethod: data.authMethod || "email",
    // Campos de seguridad KYC - Inicializar en Nivel 0 (Visitante)
    kycTier: 0,
    isIdentityVerified: false,
    identityVerificationStatus: "pending",
  };

  // Guardar usuario
  saveUser(newUser);

  // Crear perfil vacío según el rol
  const profile: ClientProfile | ProfessionalProfile | StudentProfile = {
    userId: newUser.id,
    firstName: "",
    lastName: "",
    preferredLanguage: "es",
    verificationStatus: "pending",
    ...(data.role === "cliente" && {
      // ClientProfile
    } as Partial<ClientProfile>),
    ...(data.role === "profesional" && {
      // ProfessionalProfile
      professionalTitle: "",
      specialties: [],
      experienceYears: 0,
      city: "",
      languages: [],
      planStatus: "pending",
    } as Partial<ProfessionalProfile>),
    ...(data.role === "estudiante" && {
      // StudentProfile
      internshipsApplied: [],
    } as Partial<StudentProfile>),
  };

  saveProfile(newUser.id, data.role, profile);

  // Crear sesión automáticamente después del registro
  const session: AuthSession = {
    user: newUser,
    profile: profile,
    token: `mock_token_${newUser.id}`,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 días
  };

  await saveSession(session);

  return {
    success: true,
    message: "Registro exitoso. Bienvenido a Legal PY.",
    session: session,
  };
}

/**
 * Inicia sesión con email y contraseña
 */
export async function login(data: LoginData): Promise<AuthResponse> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Cuenta maestra de demostración (modo inversor / GEP)
  if (data.email === "demo@legalpy.com" && data.password === "inversor2026") {
    const nowIso = new Date().toISOString();
    const demoUserId = "usr_demo_gep";

    const demoUser: User = {
      id: demoUserId,
      email: "demo@legalpy.com",
      role: "profesional",
      createdAt: nowIso,
      updatedAt: nowIso,
      emailVerified: true,
      twoFactorEnabled: false,
      active: true,
      lastLogin: nowIso,
      authMethod: "email",
      kycTier: 3,
      isIdentityVerified: true,
      identityVerificationStatus: "verified",
      identityVerifiedAt: nowIso,
    };

    const demoProfile: ProfessionalProfile = {
      userId: demoUserId,
      firstName: "Cuenta",
      lastName: "Demo Inversor",
      professionalTitle: "Socio GEP",
      specialties: ["Abogados"],
      experienceYears: 10,
      city: "Asunción",
      phone: "+595 999 000 000",
      languages: ["es", "en"],
      verificationStatus: "verified",
      planId: "GEP",
      planStatus: "active",
    };

    // Sembrar demo en localStorage
    if (typeof window !== "undefined") {
      // Usuarios y perfiles demo
      const users = getUsers().filter((u) => u.id !== demoUserId);
      users.push(demoUser);
      localStorage.setItem("legal-py-users", JSON.stringify(users));
      saveProfile(demoUserId, "profesional", demoProfile);

      // Casos demo (5 activos) para dashboard y oportunidades
      const demoCases: LegalCase[] = Array.from({ length: 5 }).map((_, idx) => ({
        id: `demo_case_${idx + 1}`,
        title: idx < 2 ? "Caso Corporativo High-Ticket" : "Gestión Legal Recurrente",
        description:
          idx < 2
            ? "Reestructuración societaria y blindaje patrimonial para grupo empresarial."
            : "Gestión mensual de contratos y cobranzas para cliente PYME.",
        complexity: idx < 2 ? "ALTA" : "MEDIA",
        practiceArea: idx % 2 === 0 ? "CORPORATIVO_EAS" : "COBRO_EJECUTIVO",
        estimatedBudget: idx < 2 ? 25000000 : 6000000,
        status: "OPEN",
        exclusiveForGepUntil: idx < 2 ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() : null,
        createdAt: new Date(Date.now() - idx * 3600 * 1000).toISOString(),
      }));
      localStorage.setItem("legal-py-cases", JSON.stringify(demoCases));

      // Marcar modo demo y plan actual
      localStorage.setItem("legal-py-demo-mode", "true");
      localStorage.setItem("legal-py-demo-plan", "GEP");
    }

    const session: AuthSession = {
      user: demoUser,
      profile: demoProfile,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };

    await saveSession(session);

    return {
      success: true,
      session,
      message: "Inicio de sesión de demostración (modo inversor GEP)",
    };
  }

  // Validaciones
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return {
      success: false,
      error: "Email inválido",
    };
  }

  if (data.authMethod === "email" && (!data.password || data.password.length < 8)) {
    return {
      success: false,
      error: "Contraseña requerida",
    };
  }

  // Buscar usuario
  const users = getUsers();
  const user = users.find((u) => u.email === data.email);

  if (!user) {
    return {
      success: false,
      error: "Email o contraseña incorrectos",
    };
  }

  if (!user.active) {
    return {
      success: false,
      error: "Tu cuenta está desactivada. Contacta soporte.",
    };
  }

  // Si tiene 2FA habilitado, requerir código
  if (user.twoFactorEnabled) {
    if (!data.twoFactorCode) {
      // Generar y enviar código
      const code = generateTwoFactorCode();
      sendTwoFactorCode(user.email, code, user.twoFactorMethod || "email");
      return {
        success: false,
        requiresTwoFactor: true,
        twoFactorMethod: user.twoFactorMethod || "email",
        message: `Código de verificación enviado a ${user.email}`,
      };
    }

    // Verificar código 2FA
    if (!verifyTwoFactorCode(user.email, data.twoFactorCode)) {
      return {
        success: false,
        error: "Código de verificación inválido o expirado",
        requiresTwoFactor: true,
        twoFactorMethod: user.twoFactorMethod || "email",
      };
    }
  }

  // Obtener perfil
  const profile = getProfile(user.id, user.role);
  if (!profile) {
    return {
      success: false,
      error: "Error al cargar el perfil. Por favor regístrate nuevamente.",
    };
  }

  // Actualizar último login
  user.lastLogin = new Date().toISOString();
  saveUser(user);

  // Crear sesión
  const session: AuthSession = {
    user,
    profile,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 días
  };

  await saveSession(session);

  return {
    success: true,
    session,
    message: "Inicio de sesión exitoso",
  };
}

/**
 * Login con proveedor social (mock)
 */
export async function loginWithProvider(provider: "google" | "facebook" | "apple"): Promise<AuthResponse> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // En producción, aquí se haría la autenticación real con OAuth
  // Por ahora, simulamos un login exitoso después de confirmación

  return {
    success: false,
    error: "Login social no implementado todavía. Usa email/contraseña.",
  };
}

/**
 * Verifica email con código (mock)
 */
export async function verifyEmail(email: string, code: string): Promise<AuthResponse> {
  // Simular delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const users = getUsers();
  const user = users.find((u) => u.email === email);
  if (!user) {
    return {
      success: false,
      error: "Usuario no encontrado",
    };
  }

  // Mock: código de verificación es siempre "123456" para demo
  if (code !== "123456") {
    return {
      success: false,
      error: "Código inválido. Usa 123456 para demo.",
    };
  }

  user.emailVerified = true;
  // Actualizar KYC Tier a Nivel 1 (Básico) cuando se verifica el email
  if (user.kycTier === 0) {
    user.kycTier = 1;
  }
  user.updatedAt = new Date().toISOString();
  saveUser(user);

  const profile = getProfile(user.id, user.role);
  if (!profile) {
    return {
      success: false,
      error: "Error al cargar el perfil",
    };
  }

  const session: AuthSession = {
    user,
    profile,
  };

  await saveSession(session);

  return {
    success: true,
    session,
    message: "Email verificado exitosamente",
  };
}

/**
 * Envía código de verificación de email (mock)
 */
export async function sendEmailVerificationCode(email: string): Promise<{ success: boolean; message?: string; error?: string }> {
  // Simular delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Mock: guardar código
  const code = "123456"; // Siempre 123456 para demo
  localStorage.setItem("legal-py-email-verification", JSON.stringify({ email, code, expiresAt: Date.now() + 10 * 60 * 1000 }));
  console.log(`[MOCK] Email verification code for ${email}: ${code}`);

  return {
    success: true,
    message: `Código enviado a ${email}. Usa 123456 para demo.`,
  };
}

/**
 * Cierra sesión (localStorage y cookie)
 */
export async function logout(): Promise<void> {
  await clearSession();
}

/**
 * Actualiza el perfil del usuario
 */
export async function updateProfile(
  userId: string,
  role: UserRole,
  data: ProfileCompletionData
): Promise<{ success: boolean; profile?: ClientProfile | ProfessionalProfile | StudentProfile; error?: string }> {
  // Simular delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const profile = getProfile(userId, role);
  if (!profile) {
    return {
      success: false,
      error: "Perfil no encontrado",
    };
  }

  const updatedProfile = { ...profile, ...data, userId };
  saveProfile(userId, role, updatedProfile);

  // Actualizar sesión
  const session = getSession();
  if (session && session.user.id === userId) {
    session.profile = updatedProfile;
    await saveSession(session);
  }

  return {
    success: true,
    profile: updatedProfile,
  };
}

/**
 * Habilita 2FA (mock)
 */
export async function enableTwoFactor(
  userId: string,
  method: "email" | "sms" | "app"
): Promise<{ success: boolean; qrCode?: string; secret?: string; error?: string }> {
  // Simular delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const users = getUsers();
  const user = users.find((u) => u.id === userId);
  if (!user) {
    return {
      success: false,
      error: "Usuario no encontrado",
    };
  }

  user.twoFactorEnabled = true;
  user.twoFactorMethod = method;
  saveUser(user);

  // Mock: generar QR code y secret (en producción sería real)
  const secret = `MOCK_SECRET_${Math.random().toString(36).substr(2, 16)}`;
  const qrCode = `data:image/svg+xml;base64,${btoa(`<svg>Mock QR for ${user.email}</svg>`)}`;

  return {
    success: true,
    qrCode,
    secret,
  };
}

/**
 * Deshabilita 2FA
 */
export async function disableTwoFactor(userId: string, code: string): Promise<{ success: boolean; error?: string }> {
  // Simular delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const users = getUsers();
  const user = users.find((u) => u.id === userId);
  if (!user) {
    return {
      success: false,
      error: "Usuario no encontrado",
    };
  }

  if (!user.twoFactorEnabled) {
    return {
      success: false,
      error: "2FA no está habilitado",
    };
  }

  // Verificar código antes de deshabilitar
  if (!verifyTwoFactorCode(user.email, code)) {
    return {
      success: false,
      error: "Código inválido",
    };
  }

  user.twoFactorEnabled = false;
  user.twoFactorMethod = undefined;
  saveUser(user);

  return {
    success: true,
  };
}

/**
 * Actualiza el estado de verificación de identidad del usuario
 */
export async function updateIdentityVerification(
  userId: string,
  data: {
    status: "pending" | "in_review" | "verified" | "rejected";
    selfieDataUrl?: string; // URL de la selfie capturada (para matching con cédula)
  }
): Promise<{ success: boolean; error?: string }> {
  const { status, selfieDataUrl } = data;
  await new Promise((resolve) => setTimeout(resolve, 500));

  const users = getUsers();
  const user = users.find((u) => u.id === userId);
  if (!user) {
    return {
      success: false,
      error: "Usuario no encontrado",
    };
  }

  user.identityVerificationStatus = status;
  user.updatedAt = new Date().toISOString();

  if (status === "verified") {
    user.isIdentityVerified = true;
    user.identityVerifiedAt = new Date().toISOString();
    // Guardar selfie en localStorage para referencia futura (simulado)
    if (selfieDataUrl && typeof window !== "undefined") {
      try {
        const biometricData = JSON.parse(localStorage.getItem(`legal-py-biometric-${userId}`) || "{}");
        biometricData.selfieDataUrl = selfieDataUrl;
        biometricData.verifiedAt = new Date().toISOString();
        localStorage.setItem(`legal-py-biometric-${userId}`, JSON.stringify(biometricData));
      } catch (e) {
        console.error("Error guardando selfie:", e);
      }
    }
    // Actualizar KYC Tier a Nivel 2 (Verificado) cuando se verifica la identidad
    if (user.kycTier < 2) {
      user.kycTier = 2;
    }
  } else if (status === "rejected") {
    user.isIdentityVerified = false;
  }

  saveUser(user);

  // Actualizar sesión si existe
  const session = getSession();
  if (session && session.user.id === userId) {
    session.user = user;
    await saveSession(session);
  }

  return {
    success: true,
  };
}

/**
 * Actualiza el KYC Tier del usuario
 */
export async function updateKYCTier(
  userId: string,
  tier: 0 | 1 | 2 | 3
): Promise<{ success: boolean; error?: string }> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const users = getUsers();
  const user = users.find((u) => u.id === userId);
  if (!user) {
    return {
      success: false,
      error: "Usuario no encontrado",
    };
  }

  user.kycTier = tier;
  user.updatedAt = new Date().toISOString();
  saveUser(user);

  // Actualizar sesión si existe
  const session = getSession();
  if (session && session.user.id === userId) {
    session.user = user;
    await saveSession(session);
  }

  return {
    success: true,
  };
}
