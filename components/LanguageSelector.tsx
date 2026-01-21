"use client";

import { useState, useEffect } from "react";
import { LanguageCode, languages } from "@/lib/translations";

interface LanguageSelectorProps {
  onLanguageChange: (idioma: LanguageCode) => void;
  currentLanguage: LanguageCode;
}

export default function LanguageSelector({
  onLanguageChange,
  currentLanguage,
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Guardar preferencia en localStorage
    localStorage.setItem("legal-py-language", currentLanguage);
  }, [currentLanguage]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-3 py-1.5 text-sm hover:bg-white/10 transition"
        aria-label="Seleccionar idioma"
      >
        <span>
          {languages.find((l) => l.code === currentLanguage)?.flag || "🌐"}
        </span>
        <span className="hidden sm:inline">
          {languages.find((l) => l.code === currentLanguage)?.code.toUpperCase() ||
            "ES"}
        </span>
        <svg
          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 z-50 min-w-[180px] rounded-xl border border-white/10 bg-[#13253A] shadow-lg overflow-hidden">
            {languages.map((idioma) => (
              <button
                key={idioma.code}
                onClick={() => {
                  // #region agent log
                  fetch(
                    "http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9",
                    {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        sessionId: "debug-session",
                        runId: "run-i18n",
                        hypothesisId: "H-I18N-SELECT",
                        location: "components/LanguageSelector.tsx:onClick",
                        message: "Language selected in dropdown",
                        data: { from: currentLanguage, to: idioma.code },
                        timestamp: Date.now(),
                      }),
                    }
                  ).catch(() => {});
                  // #endregion
                  onLanguageChange(idioma.code);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm transition ${
                  currentLanguage === idioma.code
                    ? "bg-[#C9A24D]/20 text-[#C9A24D]"
                    : "text-white/80 hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{idioma.flag}</span>
                  <span>{idioma.name}</span>
                  {currentLanguage === idioma.code && (
                    <svg
                      className="h-4 w-4 ml-auto text-[#C9A24D]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
