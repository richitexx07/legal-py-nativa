"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { LanguageCode, defaultLanguage, translate } from "@/lib/translations";

interface I18nContextType {
  idioma: LanguageCode;
  setIdioma: (idioma: LanguageCode) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [idioma, setIdiomaState] = useState<LanguageCode>(defaultLanguage);

  useEffect(() => {
    // Cargar idioma desde localStorage al iniciar
    const saved = localStorage.getItem("legal-py-language") as LanguageCode;
    if (saved && ["es", "en", "pt", "de", "fr", "it", "gn"].includes(saved)) {
      setIdiomaState(saved as LanguageCode);
    }

  }, []);

  const setIdioma = (newIdioma: LanguageCode) => {
    setIdiomaState(newIdioma);
    localStorage.setItem("legal-py-language", newIdioma);
    // Actualizar lang del HTML
    document.documentElement.lang = newIdioma;

  };

  const t = (key: string) => translate(idioma, key);

  return (
    <I18nContext.Provider value={{ idioma, setIdioma, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
