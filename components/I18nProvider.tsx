"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Idioma, idiomaPorDefecto, getDiccionario, Diccionario } from "@/lib/i18n";

interface I18nContextType {
  idioma: Idioma;
  setIdioma: (idioma: Idioma) => void;
  t: Diccionario;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [idioma, setIdiomaState] = useState<Idioma>(idiomaPorDefecto);

  useEffect(() => {
    // Cargar idioma desde localStorage al iniciar
    const saved = localStorage.getItem("legal-py-language") as Idioma;
    if (saved && ["es", "gn", "en", "pt"].includes(saved)) {
      setIdiomaState(saved);
    }
  }, []);

  const setIdioma = (newIdioma: Idioma) => {
    setIdiomaState(newIdioma);
    localStorage.setItem("legal-py-language", newIdioma);
    // Actualizar lang del HTML
    document.documentElement.lang = newIdioma;
  };

  const t = getDiccionario(idioma);

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
