"use client";

import { useState, useEffect } from "react";
import { getFeatureFlags, isMasterKey } from "@/lib/feature-flags";
import { getSession } from "@/lib/auth";

/**
 * Hook para verificar y gestionar el modo demo
 */
export function useDemoMode() {
  const [flags, setFlags] = useState(getFeatureFlags());
  const [isDemoUser, setIsDemoUser] = useState(false);

  useEffect(() => {
    const session = getSession();
    if (session) {
      setIsDemoUser(isMasterKey(session.user.email));
    }
    setFlags(getFeatureFlags());
  }, []);

  return {
    ...flags,
    isDemoUser,
    requiresBiometric: (route: string) => {
      if (isDemoUser) return false;
      return flags.biometricRequired;
    },
  };
}
