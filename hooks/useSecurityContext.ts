"use client";

import { useState, useEffect, useMemo } from "react";

export type DeviceType = "mobile" | "desktop" | "tablet";
export type SecurityLevel = "public" | "protected" | "critical";

interface SecurityContext {
  deviceType: DeviceType;
  isMobile: boolean;
  isDesktop: boolean;
  isTablet: boolean;
  supportsWebAuthn: boolean;
  supportsNFC: boolean;
  userAgent: string;
  screenWidth: number;
  requiresMFA: boolean; // Si detecta IP nueva o dispositivo nuevo
  securityLevel: SecurityLevel;
}

/**
 * Hook que detecta el contexto de seguridad del dispositivo y usuario
 */
export function useSecurityContext(): SecurityContext {
  const [deviceType, setDeviceType] = useState<DeviceType>("desktop");
  const [userAgent, setUserAgent] = useState<string>("");
  const [screenWidth, setScreenWidth] = useState<number>(0);
  const [supportsWebAuthn, setSupportsWebAuthn] = useState<boolean>(false);
  const [supportsNFC, setSupportsNFC] = useState<boolean>(false);
  const [requiresMFA, setRequiresMFA] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ua = navigator.userAgent;
    setUserAgent(ua);
    setScreenWidth(window.innerWidth);

    // Detectar tipo de dispositivo
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    const isTablet = /iPad|Android/i.test(ua) && !/Mobile/i.test(ua);
    
    if (isMobile) {
      setDeviceType("mobile");
    } else if (isTablet) {
      setDeviceType("tablet");
    } else {
      setDeviceType("desktop");
    }

    // Detectar soporte de WebAuthn
    const hasWebAuthn = typeof window.PublicKeyCredential !== "undefined";
    setSupportsWebAuthn(hasWebAuthn);

    // Detectar soporte de NFC (solo en móviles Android/iOS con API disponible)
    const hasNFC = "NDEFReader" in window || "nfc" in navigator;
    setSupportsNFC(hasNFC && isMobile);

    // Verificar si requiere MFA (IP nueva o dispositivo nuevo)
    // En producción, esto se verificaría contra el backend
    const lastKnownIP = localStorage.getItem("legal-py-last-ip");
    const lastKnownDevice = localStorage.getItem("legal-py-last-device");
    
    // Simular detección de IP nueva (en producción se obtendría del backend)
    const currentDevice = `${ua}-${screenWidth}`;
    if (lastKnownIP && lastKnownIP !== "unknown" && lastKnownDevice !== currentDevice) {
      setRequiresMFA(true);
    }

    // Guardar dispositivo actual
    localStorage.setItem("legal-py-last-device", currentDevice);

    // Listener para cambios de tamaño de pantalla
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isMobile = deviceType === "mobile";
  const isDesktop = deviceType === "desktop";
  const isTablet = deviceType === "tablet";

  // Determinar nivel de seguridad según la ruta actual (se puede pasar como parámetro)
  const securityLevel: SecurityLevel = useMemo(() => {
    if (typeof window === "undefined") return "public";
    
    const path = window.location.pathname;
    
    // Rutas críticas (pagos, aceptar casos)
    if (path.includes("/subscribe") || path.includes("/accept-case") || path.includes("/pagos")) {
      return "critical";
    }
    
    // Rutas protegidas (panel, post-case)
    if (path.includes("/panel") || path.includes("/post-case") || path.includes("/profile")) {
      return "protected";
    }
    
    // Rutas públicas (demo, navegación)
    return "public";
  }, []);

  return {
    deviceType,
    isMobile,
    isDesktop,
    isTablet,
    supportsWebAuthn,
    supportsNFC,
    userAgent,
    screenWidth,
    requiresMFA,
    securityLevel,
  };
}

/**
 * Función helper para determinar si una ruta requiere autenticación
 */
export function requiresAuth(pathname: string): boolean {
  const protectedRoutes = ["/panel", "/post-case", "/profile", "/security-center"];
  const criticalRoutes = ["/subscribe", "/accept-case", "/pagos"];
  
  return protectedRoutes.some(route => pathname.startsWith(route)) ||
         criticalRoutes.some(route => pathname.startsWith(route));
}

/**
 * Función helper para determinar si una ruta es crítica (requiere re-verificación)
 */
export function isCriticalRoute(pathname: string): boolean {
  const criticalRoutes = ["/subscribe", "/accept-case", "/pagos"];
  return criticalRoutes.some(route => pathname.startsWith(route));
}
