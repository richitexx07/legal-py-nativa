"use client";

/**
 * GlobalErrorHandler - Manejo de errores global en cliente
 * 
 * Este componente maneja errores globales y unhandled rejections
 * SOLO en el cliente, evitando problemas de SSR/hydration
 */

import { useEffect } from "react";

export default function GlobalErrorHandler() {
  useEffect(() => {
    // Solo ejecutar en cliente
    if (typeof window === "undefined") return;

    // Handler para errores globales
    const handleError = (event: ErrorEvent) => {
      // Log en consola para desarrollo
      if (process.env.NODE_ENV === "development") {
        console.error("Global error:", {
          message: event.message,
          source: event.filename,
          line: event.lineno,
          col: event.colno,
        });
      }
      
      // En producción, podrías enviar a un servicio de logging real
      // Ejemplo: Sentry, LogRocket, etc.
      // NO usar localhost en producción
    };

    // Handler para unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      // Log en consola para desarrollo
      if (process.env.NODE_ENV === "development") {
        console.error("Unhandled promise rejection:", event.reason);
      }
      
      // En producción, podrías enviar a un servicio de logging real
      // NO usar localhost en producción
    };

    // Registrar listeners
    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    // Cleanup
    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, []);

  // Este componente no renderiza nada
  return null;
}
