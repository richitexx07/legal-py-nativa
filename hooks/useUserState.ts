"use client";

import { getSession } from "@/lib/auth";

/**
 * Modelo de estados progresivos (NO binario)
 *
 * 0 – Visitante: sin sesión. Ve Home, IA demo, profesionales, casos internacionales, gráficas, planes.
 *    No puede ejecutar acciones.
 *
 * 1 – Registrado sin plan: tiene sesión, sin plan activo. Accede al Panel, explora, ve flujos,
 *    IA limitada, ve botones de acción con bloqueo informativo. No crea casos, no sube docs,
 *    no paga, no contacta profesionales. NO forzar biometría.
 *
 * 2 – Usuario con plan activo: puede crear casos, subir docs, contactar profesionales, usar IA según plan.
 *    Aquí se activan controles biométricos por acción.
 */
export type UserState = 0 | 1 | 2;

export function useUserState(): UserState {
  if (typeof window === "undefined") return 0;
  const session = getSession();
  if (!session) return 0;

  const profile = session.profile as { planId?: string; planStatus?: string } | undefined;
  const planStatus = profile?.planStatus;
  const planId = profile?.planId;

  const hasActivePlan = planStatus === "active" && !!planId;
  const isDemoGep =
    typeof window !== "undefined" && localStorage.getItem("legal-py-demo-plan") === "GEP";
  if (hasActivePlan || isDemoGep) return 2;
  return 1;
}

export function hasActivePlan(session: ReturnType<typeof getSession>): boolean {
  if (!session) return false;
  const profile = session.profile as { planId?: string; planStatus?: string } | undefined;
  return profile?.planStatus === "active" && !!profile?.planId;
}
