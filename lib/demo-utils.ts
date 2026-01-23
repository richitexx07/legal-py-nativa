/**
 * Utilidades para detección de modo demo
 * Centraliza la lógica para evitar inconsistencias
 * 
 * REGLAS DE MODO DEMO:
 * - Biometría se muestra y funciona, pero NO bloquea
 * - Botón de escape siempre visible
 * - En producción: biometría obligatoria en pagos
 * 
 * @author Legal PY Security Team
 * @version 2.0.0 - Demo Mode Security Rules
 */

import { getSession } from "./auth";

/**
 * Verifica si la plataforma está en modo demo
 * Basado en variable de entorno NEXT_PUBLIC_DEMO_MODE
 * 
 * @returns true si está en modo demo
 */
export function checkDemoMode(): boolean {
  if (typeof window === "undefined") {
    // En servidor, solo verificar variable de entorno
    return process.env.NEXT_PUBLIC_DEMO_MODE === "true";
  }
  
  // En cliente: verificar variable de entorno primero (más seguro)
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") return true;
  
  // Fallback: verificar localStorage (para desarrollo local)
  if (localStorage.getItem("legal-py-demo-mode") === "true") return true;
  
  return false;
}

/**
 * Verifica si el usuario actual es la cuenta demo master
 * Basado en email de sesión
 * 
 * @returns true si es usuario demo
 */
export function checkDemoUser(): boolean {
  if (typeof window === "undefined") return false;
  
  const session = getSession();
  return session?.user?.email === "demo@legalpy.com" || false;
}

/**
 * Verifica si debe permitirse bypass de biometría
 * Combina detección de modo demo y usuario demo
 * 
 * REGLA: En modo demo, la biometría NO bloquea
 * 
 * @returns true si se puede omitir biometría
 */
export function canSkipBiometric(): boolean {
  return checkDemoMode() || checkDemoUser();
}

/**
 * Verifica si la biometría es obligatoria
 * En modo demo: NUNCA es obligatoria
 * En producción: obligatoria solo en pagos
 * 
 * @param isPaymentRoute - Si es ruta de pago
 * @returns true si la biometría es obligatoria
 */
export function isBiometricMandatory(isPaymentRoute: boolean = false): boolean {
  // En modo demo: NUNCA obligatoria
  if (checkDemoMode() || checkDemoUser()) {
    return false;
  }
  
  // En producción: obligatoria solo en pagos
  return isPaymentRoute;
}

/**
 * @deprecated Usar checkDemoMode() en su lugar
 * Mantenido para compatibilidad
 */
export function isDemoMode(): boolean {
  return checkDemoMode();
}

/**
 * @deprecated Usar checkDemoUser() en su lugar
 * Mantenido para compatibilidad
 */
export function isDemoUser(): boolean {
  return checkDemoUser();
}
