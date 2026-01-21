"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { LanguageCode, defaultLanguage, translate } from "@/lib/translations";

/**
 * Tipo del contexto de idioma
 */
interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: (key: string) => string;
}

/**
 * Contexto de React para el sistema de traducciones
 */
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

/**
 * Props del Provider
 */
interface LanguageProviderProps {
  children: ReactNode;
}

/**
 * Provider del contexto de idioma
 * - Gestiona el estado del idioma actual
 * - Persiste la preferencia en localStorage
 * - Actualiza el atributo lang del HTML
 * - Proporciona función de traducción con fallback automático a español
 */
export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<LanguageCode>(defaultLanguage);

  // Cargar idioma guardado al montar el componente
  useEffect(() => {
    if (typeof window === "undefined") return;

    const saved = localStorage.getItem("legal-py-language") as LanguageCode | null;
    const validLanguages: LanguageCode[] = ["es", "en", "pt", "de", "fr", "it", "gn"];

    if (saved && validLanguages.includes(saved)) {
      setLanguageState(saved);
      document.documentElement.lang = saved;
    } else {
      // Si no hay idioma guardado, usar el predeterminado
      document.documentElement.lang = defaultLanguage;
    }

    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: "debug-session",
        runId: "run-i18n",
        hypothesisId: "H-I18N-INIT",
        location: "context/LanguageContext.tsx:init",
        message: "LanguageProvider initialized",
        data: { saved: saved || null, current: language },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
  }, []);

  /**
   * Función para cambiar el idioma
   * - Actualiza el estado
   * - Persiste en localStorage
   * - Actualiza el atributo lang del HTML
   */
  const setLanguage = useCallback((newLanguage: LanguageCode) => {
    const validLanguages: LanguageCode[] = ["es", "en", "pt", "de", "fr", "it", "gn"];
    
    // Validar que el idioma sea válido
    if (!validLanguages.includes(newLanguage)) {
      console.warn(`Invalid language code: ${newLanguage}. Falling back to Spanish.`);
      newLanguage = defaultLanguage;
    }

    setLanguageState(newLanguage);
    
    if (typeof window !== "undefined") {
      localStorage.setItem("legal-py-language", newLanguage);
      document.documentElement.lang = newLanguage;
    }

    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: "debug-session",
        runId: "run-i18n",
        hypothesisId: "H-I18N-CHANGE",
        location: "context/LanguageContext.tsx:setLanguage",
        message: "Language changed via useLanguage hook",
        data: { newLanguage, previous: language },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
  }, [language]);

  /**
   * Función de traducción robusta con fallback automático
   * - Intenta obtener la traducción en el idioma actual
   * - Si no existe, usa español como fallback
   * - Si tampoco existe en español, devuelve la clave original
   * - NUNCA devuelve undefined o null
   */
  const t = useCallback((key: string): string => {
    if (!key || typeof key !== "string") {
      console.warn(`Invalid translation key: ${key}`);
      return key || "";
    }

    // Intentar traducción en el idioma actual
    let translated = translate(language, key);

    // Si la traducción devolvió la clave misma (no encontrada), intentar español
    if (translated === key && language !== defaultLanguage) {
      translated = translate(defaultLanguage, key);
      
      // #region agent log
      fetch("http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: "debug-session",
          runId: "run-i18n",
          hypothesisId: "H-I18N-FALLBACK",
          location: "context/LanguageContext.tsx:t",
          message: "Translation fallback to Spanish",
          data: { key, requestedLang: language, fallbackLang: defaultLanguage },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
    }

    // Asegurar que siempre devolvemos un string válido
    return typeof translated === "string" && translated.length > 0 
      ? translated 
      : key; // Si todo falla, devolver la clave como último recurso
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

/**
 * Hook para consumir el contexto de idioma
 * @returns {LanguageContextType} Objeto con language, setLanguage y t
 * @throws {Error} Si se usa fuera del LanguageProvider
 * 
 * @example
 * ```tsx
 * const { language, setLanguage, t } = useLanguage();
 * 
 * return (
 *   <div>
 *     <h1>{t("hero.title")}</h1>
 *     <button onClick={() => setLanguage("en")}>English</button>
 *   </div>
 * );
 * ```
 */
export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  
  return context;
}
