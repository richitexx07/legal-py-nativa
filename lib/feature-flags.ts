/**
 * Sistema de Feature Flags y Modo Demo para Legal PY
 * Controla el comportamiento de la plataforma según el entorno
 */

export interface FeatureFlags {
  demoMode: boolean;
  biometricRequired: boolean;
  realPayments: boolean;
  masterKeyEnabled: boolean;
  bypassBiometric: boolean;
}

/**
 * Obtiene las feature flags según el entorno
 */
export function getFeatureFlags(): FeatureFlags {
  if (typeof window === "undefined") {
    // Server-side: usar variables de entorno
    return {
      demoMode: process.env.NEXT_PUBLIC_DEMO_MODE === "true",
      biometricRequired: process.env.NEXT_PUBLIC_BIOMETRIC_REQUIRED !== "false",
      realPayments: process.env.NEXT_PUBLIC_REAL_PAYMENTS === "true",
      masterKeyEnabled: process.env.NEXT_PUBLIC_MASTER_KEY_ENABLED === "true",
      bypassBiometric: process.env.NEXT_PUBLIC_DEMO_MODE === "true",
    };
  }

  // Client-side: leer de localStorage o usar defaults
  const demoMode = localStorage.getItem("legal-py-demo-mode") === "true" || 
                   process.env.NEXT_PUBLIC_DEMO_MODE === "true";
  
  return {
    demoMode,
    biometricRequired: !demoMode && process.env.NEXT_PUBLIC_BIOMETRIC_REQUIRED !== "false",
    realPayments: !demoMode && process.env.NEXT_PUBLIC_REAL_PAYMENTS === "true",
    masterKeyEnabled: demoMode || process.env.NEXT_PUBLIC_MASTER_KEY_ENABLED === "true",
    bypassBiometric: demoMode,
  };
}

/**
 * Verifica si un usuario es el master key (demo)
 */
export function isMasterKey(email: string): boolean {
  const flags = getFeatureFlags();
  if (!flags.masterKeyEnabled) return false;
  
  return email === "demo@legalpy.com";
}

/**
 * Verifica si se debe requerir biometría para una acción
 */
export function requiresBiometric(action: string, route: string): boolean {
  const flags = getFeatureFlags();
  
  // Si está en modo demo y es master key, nunca requerir
  if (flags.bypassBiometric) {
    return false;
  }

  // Rutas críticas que SIEMPRE requieren biometría
  const criticalRoutes = [
    "/subscribe",
    "/accept-case",
    "/pagos",
    "/transfer",
    "/profile/edit",
  ];

  // Rutas públicas que NUNCA requieren biometría
  const publicRoutes = [
    "/",
    "/login",
    "/signup",
    "/register",
    "/pricing",
    "/about",
    "/services",
    "/opportunities", // Solo lectura
  ];

  // Si es ruta pública, no requerir
  if (publicRoutes.some(r => route.startsWith(r))) {
    return false;
  }

  // Si es ruta crítica, requerir
  if (criticalRoutes.some(r => route.startsWith(r))) {
    return flags.biometricRequired;
  }

  // Por defecto, no requerir
  return false;
}

/**
 * Verifica si se deben usar pagos reales
 */
export function useRealPayments(): boolean {
  const flags = getFeatureFlags();
  return flags.realPayments;
}
