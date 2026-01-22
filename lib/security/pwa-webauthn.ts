/**
 * Utilidades de Compatibilidad PWA y Mobile WebAuthn
 * 
 * Verificaciones y fallbacks para iOS, Android y Desktop
 * 
 * @author Legal PY Security Team
 * @version 1.0.0
 */

// ============================================================================
// TYPES
// ============================================================================

export interface WebAuthnCompatibility {
  /** WebAuthn está disponible */
  isAvailable: boolean;
  /** Autenticador de plataforma disponible (FaceID, TouchID, etc.) */
  platformAuthenticatorAvailable: boolean;
  /** HTTPS está activo */
  isSecureContext: boolean;
  /** Es PWA instalada */
  isPWA: boolean;
  /** Es dispositivo móvil */
  isMobile: boolean;
  /** Plataforma detectada */
  platform: "ios" | "android" | "desktop" | "unknown";
  /** Limitaciones conocidas */
  limitations: string[];
  /** Recomendación de fallback */
  fallbackRecommended: boolean;
}

// ============================================================================
// DETECTION UTILITIES
// ============================================================================

/**
 * Detecta si estamos en un contexto seguro (HTTPS)
 */
export function isSecureContext(): boolean {
  if (typeof window === "undefined") return false;
  return window.isSecureContext === true;
}

/**
 * Detecta si la app está instalada como PWA
 */
export function isPWAInstalled(): boolean {
  if (typeof window === "undefined") return false;
  
  // Verificar display mode standalone
  if (window.matchMedia("(display-mode: standalone)").matches) {
    return true;
  }
  
  // Verificar si está en modo standalone (iOS)
  if ((window.navigator as any).standalone === true) {
    return true;
  }
  
  // Verificar referrer (Android)
  if (document.referrer.includes("android-app://")) {
    return true;
  }
  
  return false;
}

/**
 * Detecta si es dispositivo móvil
 */
export function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false;
  
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
}

/**
 * Detecta la plataforma
 */
export function detectPlatform(): "ios" | "android" | "desktop" | "unknown" {
  if (typeof window === "undefined") return "unknown";
  
  const userAgent = window.navigator.userAgent.toLowerCase();
  const platform = window.navigator.platform.toLowerCase();
  
  if (/iphone|ipad|ipod/.test(userAgent) || (platform === "macintel" && "ontouchend" in document)) {
    return "ios";
  }
  
  if (/android/.test(userAgent)) {
    return "android";
  }
  
  return "desktop";
}

/**
 * Verifica si WebAuthn está disponible
 */
export function isWebAuthnAvailable(): boolean {
  if (typeof window === "undefined") return false;
  return typeof window.PublicKeyCredential !== "undefined";
}

/**
 * Verifica si hay un autenticador de plataforma disponible
 */
export async function isPlatformAuthenticatorAvailable(): Promise<boolean> {
  if (typeof window === "undefined" || !window.PublicKeyCredential) {
    return false;
  }
  
  try {
    return await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  } catch {
    return false;
  }
}

/**
 * Detecta limitaciones conocidas por plataforma
 */
export function detectLimitations(platform: "ios" | "android" | "desktop" | "unknown"): string[] {
  const limitations: string[] = [];
  
  if (platform === "ios") {
    // Limitaciones conocidas de iOS
    limitations.push("iOS requiere HTTPS obligatorio");
    limitations.push("Safari 14+ requerido para WebAuthn completo");
    limitations.push("PWA debe estar instalada para mejor experiencia");
    limitations.push("No funciona en iframes (cross-origin)");
    limitations.push("FaceID requiere iOS 12+");
  } else if (platform === "android") {
    // Limitaciones conocidas de Android
    limitations.push("Android requiere Chrome 67+ o navegador compatible");
    limitations.push("Biometría requiere Android 9+ (API 28+)");
    limitations.push("PWA debe estar instalada para mejor experiencia");
    limitations.push("Algunos dispositivos pueden requerir configuración adicional");
  } else if (platform === "desktop") {
    limitations.push("Windows Hello requiere Windows 10+");
    limitations.push("TouchID requiere macOS con hardware compatible");
    limitations.push("Chrome/Edge/Firefox requeridos para mejor soporte");
  }
  
  return limitations;
}

// ============================================================================
// MAIN COMPATIBILITY CHECK
// ============================================================================

/**
 * Verifica compatibilidad completa de WebAuthn para PWA/Mobile
 * 
 * Retorna información detallada sobre disponibilidad y limitaciones
 */
export async function checkWebAuthnCompatibility(): Promise<WebAuthnCompatibility> {
  const isAvailable = isWebAuthnAvailable();
  const platformAuthenticatorAvailable = isAvailable 
    ? await isPlatformAuthenticatorAvailable() 
    : false;
  const isSecure = isSecureContext();
  const isPWA = isPWAInstalled();
  const isMobile = isMobileDevice();
  const platform = detectPlatform();
  const limitations = detectLimitations(platform);
  
  // Determinar si se recomienda fallback
  const fallbackRecommended = 
    !isAvailable ||
    !platformAuthenticatorAvailable ||
    !isSecure ||
    (isMobile && !isPWA && platform === "ios"); // iOS funciona mejor en PWA
  
  return {
    isAvailable,
    platformAuthenticatorAvailable,
    isSecureContext: isSecure,
    isPWA,
    isMobile,
    platform,
    limitations,
    fallbackRecommended,
  };
}

// ============================================================================
// PWA SPECIFIC CHECKS
// ============================================================================

/**
 * Verifica condiciones específicas para PWA
 */
export function checkPWAConditions(): {
  isStandalone: boolean;
  isHTTPS: boolean;
  isSameOrigin: boolean;
  isInIframe: boolean;
  recommendations: string[];
} {
  if (typeof window === "undefined") {
    return {
      isStandalone: false,
      isHTTPS: false,
      isSameOrigin: true,
      isInIframe: false,
      recommendations: ["Ejecutar en contexto de navegador"],
    };
  }
  
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches || 
                       (window.navigator as any).standalone === true;
  const isHTTPS = window.isSecureContext === true;
  const isSameOrigin = window.location.origin === window.location.origin; // Siempre true, pero verificar
  const isInIframe = window.self !== window.top;
  
  const recommendations: string[] = [];
  
  if (!isHTTPS) {
    recommendations.push("⚠️ HTTPS es obligatorio para WebAuthn. Usar HTTPS en producción.");
  }
  
  if (isInIframe) {
    recommendations.push("⚠️ WebAuthn no funciona en iframes. Usar ventana principal.");
  }
  
  if (!isStandalone && isMobileDevice()) {
    recommendations.push("💡 Instalar como PWA mejora la experiencia en mobile.");
  }
  
  return {
    isStandalone,
    isHTTPS,
    isSameOrigin,
    isInIframe,
    recommendations,
  };
}

// ============================================================================
// MOBILE UX HELPERS
// ============================================================================

/**
 * Obtiene el tamaño recomendado del botón para mobile
 */
export function getMobileButtonSize(isMobile: boolean): "sm" | "md" | "lg" {
  if (!isMobile) return "lg";
  
  // En mobile, botones más grandes para mejor UX (thumb-friendly)
  return "lg"; // Ya es grande, pero podemos ajustar si es necesario
}

/**
 * Verifica si se debe mostrar fallback
 */
export function shouldShowFallback(compatibility: WebAuthnCompatibility): boolean {
  return compatibility.fallbackRecommended;
}
