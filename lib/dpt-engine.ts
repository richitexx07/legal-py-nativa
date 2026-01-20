// Motor DPT (Derivación Priorizada por Perfil Técnico) - Legal PY

import { LegalCase } from "./types";
import { KYCTier } from "./types";

/**
 * Calcula la prioridad del caso y asigna exclusividad GEP si aplica
 * Regla de Negocio: Si complexity es 'ALTA' O estimatedBudget > 5000000 (Guaraníes),
 * asigna exclusiveForGepUntil = Fecha actual + 24 horas
 */
export function calculateCasePriority(caseData: Omit<LegalCase, "exclusiveForGepUntil" | "id" | "createdAt">): {
  exclusiveForGepUntil: string | null;
} {
  const isHighTicket = caseData.complexity === "ALTA" || caseData.estimatedBudget > 5000000;

  if (isHighTicket) {
    // Asignar exclusividad GEP por 24 horas
    const now = new Date();
    const exclusiveUntil = new Date(now.getTime() + 24 * 60 * 60 * 1000); // +24 horas
    return {
      exclusiveForGepUntil: exclusiveUntil.toISOString(),
    };
  }

  return {
    exclusiveForGepUntil: null,
  };
}

/**
 * Obtiene los casos disponibles para un usuario según su tier
 * - Si userTier es 3 (GEP), devuelve TODOS los casos
 * - Si userTier < 3, filtra los casos: Oculta o marca como "Bloqueado" aquellos
 *   donde exclusiveForGepUntil sea una fecha futura
 */
export function getAvailableCasesForUser(userTier: KYCTier, allCases: LegalCase[]): LegalCase[] {
  if (userTier === 3) {
    // GEP puede ver todos los casos
    return allCases;
  }

  // Para usuarios no-GEP, filtrar casos exclusivos GEP que aún no han expirado
  const now = new Date();
  return allCases.map((legalCase) => {
    // Si el caso tiene exclusividad GEP y aún no ha expirado, marcarlo como bloqueado
    if (legalCase.exclusiveForGepUntil) {
      const exclusiveUntil = new Date(legalCase.exclusiveForGepUntil);
      if (exclusiveUntil > now) {
        // El caso sigue siendo exclusivo GEP
        return {
          ...legalCase,
          // Mantenemos el caso pero con el flag de exclusividad activo
        };
      }
    }
    return legalCase;
  });
}

/**
 * Verifica si un caso está disponible para un usuario no-GEP
 */
export function isCaseAvailableForUser(userTier: KYCTier, legalCase: LegalCase): boolean {
  if (userTier === 3) {
    return true; // GEP puede ver todos
  }

  if (!legalCase.exclusiveForGepUntil) {
    return true; // Caso libre, disponible para todos
  }

  // Verificar si la exclusividad ya expiró
  const now = new Date();
  const exclusiveUntil = new Date(legalCase.exclusiveForGepUntil);
  return exclusiveUntil <= now; // Disponible solo si ya expiró
}

/**
 * Obtiene el tiempo restante hasta que un caso se libere para usuarios no-GEP
 * Retorna null si el caso ya está disponible o si el usuario es GEP
 */
export function getTimeUntilRelease(legalCase: LegalCase): number | null {
  if (!legalCase.exclusiveForGepUntil) {
    return null; // Ya está disponible
  }

  const now = new Date();
  const exclusiveUntil = new Date(legalCase.exclusiveForGepUntil);

  if (exclusiveUntil <= now) {
    return null; // Ya expiró, está disponible
  }

  // Retornar milisegundos restantes
  return exclusiveUntil.getTime() - now.getTime();
}
