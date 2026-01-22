/**
 * useUserState - Hook para Estados Progresivos de Usuario
 * 
 * Implementa el modelo de estados progresivos:
 * - Estado 0: Visitante (sin sesión)
 * - Estado 1: Usuario registrado (sin plan)
 * - Estado 2: Usuario con plan activo
 * 
 * @author Legal PY Team
 */

import { useMemo } from "react";
import { getSession } from "@/lib/auth";
import { AuthSession } from "@/lib/types";

export type UserState = "visitor" | "registered" | "with_plan";

export interface UserStateInfo {
  state: UserState;
  canCreateCases: boolean;
  canUploadDocuments: boolean;
  canMakePayments: boolean;
  canContactProfessionals: boolean;
  canUseIAUnlimited: boolean;
  requiresBiometricForAction: (action: "create_case" | "upload_doc" | "payment" | "contact_pro") => boolean;
  showActionBlockedMessage: (action: string) => string;
}

/**
 * Hook para obtener el estado progresivo del usuario
 */
export function useUserState(): UserStateInfo {
  const session = useMemo(() => {
    if (typeof window === "undefined") return null;
    return getSession();
  }, []);

  const userState: UserState = useMemo(() => {
    if (!session) return "visitor";
    
    // Verificar si tiene plan activo
    const hasActivePlan = 
      session.user.kycTier > 0 || 
      (session.profile && "planStatus" in session.profile && session.profile.planStatus === "active");
    
    if (hasActivePlan) return "with_plan";
    return "registered";
  }, [session]);

  const canCreateCases = userState === "with_plan";
  const canUploadDocuments = userState === "with_plan";
  const canMakePayments = userState === "with_plan";
  const canContactProfessionals = userState === "with_plan";
  const canUseIAUnlimited = userState === "with_plan";

  const requiresBiometricForAction = (action: "create_case" | "upload_doc" | "payment" | "contact_pro"): boolean => {
    // Solo requiere biometría si tiene plan activo (Estado 2)
    if (userState !== "with_plan") return false;
    
    // Todas las acciones sensibles requieren biometría en Estado 2
    return true;
  };

  const showActionBlockedMessage = (action: string): string => {
    if (userState === "visitor") {
      return `Iniciá sesión para ${action}. La biometría se activará al confirmar.`;
    }
    if (userState === "registered") {
      return `Contratá un plan para ${action}. Ver planes en /pricing`;
    }
    return "";
  };

  return {
    state: userState,
    canCreateCases,
    canUploadDocuments,
    canMakePayments,
    canContactProfessionals,
    canUseIAUnlimited,
    requiresBiometricForAction,
    showActionBlockedMessage,
  };
}
