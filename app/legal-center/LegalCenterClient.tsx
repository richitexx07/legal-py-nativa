"use client";

import { useState, useEffect, useRef } from "react";
import { PolicyLevel } from "@/lib/legal";
import Link from "next/link";
import Button from "@/components/Button";
import { useLanguage } from "@/context/LanguageContext";

interface LegalCenterClientProps {
  policyLevels: PolicyLevel[];
}

export default function LegalCenterClient({ policyLevels }: LegalCenterClientProps) {
  const { t, language } = useLanguage();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    // Scroll spy para detectar la sección activa
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      
      for (const level of policyLevels) {
        const element = sectionRefs.current[level.id];
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(level.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Llamar una vez al montar

    return () => window.removeEventListener("scroll", handleScroll);
  }, [policyLevels]);

  const scrollToSection = (sectionId: string) => {
    const element = sectionRefs.current[sectionId];
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleDownloadPDF = () => {
    // Simular descarga de PDF
    alert("Generando PDF firmado... En producción, esto generaría un PDF con las políticas actuales.");
    // En producción: usar una librería como jsPDF o pdfkit
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Header con botón de descarga */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-center md:text-left">
            <h1 
              className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-3" 
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {t("legal_center.title") || "Centro de Gobernanza y Transparencia"}
            </h1>
            <p 
              className="text-lg md:text-xl text-gray-600 max-w-3xl" 
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {t("legal_center.subtitle") || "Bienvenido al Ecosistema Legal PY. Nuestra infraestructura conecta necesidades reales con soluciones expertas."}
            </p>
          </div>
          <Button
            onClick={handleDownloadPDF}
            variant="primary"
            className="rounded-xl px-6 py-3 flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            {t("legal_center.download_pdf") || "📥 Descargar Marco Legal Firmado (PDF)"}
          </Button>
        </div>

        <div className="flex gap-8">
          {/* Barra Lateral Fija (Estilo Meta/Facebook) */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24">
              <nav className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h3 
                  className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {t("legal_center.index") || "Índice de Políticas"}
                </h3>
                <ul className="space-y-1">
                  {policyLevels.map((level) => (
                    <li key={level.id}>
                      <button
                        onClick={() => scrollToSection(level.id)}
                        className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all ${
                          activeSection === level.id
                            ? "bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600 shadow-sm"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        <span className="mr-2 text-lg">{level.emoji}</span>
                        {level.title.split(":")[0]}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </aside>

          {/* Contenido Principal Scrolleable */}
          <main className="flex-1 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 md:p-12">
              {/* Contenido de cada nivel */}
              {policyLevels.map((level) => (
                <div
                  key={level.id}
                  ref={(el) => {
                    sectionRefs.current[level.id] = el;
                  }}
                  className="mb-16 scroll-mt-24 last:mb-0"
                >
                  <div className="mb-8 pb-6 border-b-2 border-gray-200">
                    <h2
                      className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-3"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {level.emoji} {level.title}
                    </h2>
                    <p 
                      className="text-gray-600 italic text-lg" 
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {level.description}
                    </p>
                  </div>

                  <div className="space-y-10">
                    {level.policies.map((policy) => (
                      <div key={policy.number} className="prose prose-lg max-w-none">
                        <h3
                          className="text-2xl md:text-3xl font-serif font-semibold text-gray-900 mb-4"
                          style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                          {policy.number}. {policy.title}
                        </h3>
                        <div
                          className="text-gray-700 leading-relaxed whitespace-pre-line"
                          style={{ 
                            fontFamily: "'Inter', sans-serif", 
                            fontSize: "16px", 
                            lineHeight: "1.8",
                            color: "#374151"
                          }}
                        >
                          {policy.content}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Footer del documento */}
              <div className="mt-16 pt-8 border-t-2 border-gray-200">
                <p 
                  className="text-sm text-gray-500 text-center mb-2" 
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {t("legal_center.last_updated") || "Última actualización"}: {new Date().toLocaleDateString("es-PY", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p 
                  className="text-sm text-gray-500 text-center" 
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {t("legal_center.questions") || "¿Tienes preguntas?"} {t("legal_center.contact") || "Contacta a nuestro equipo legal"}:{" "}
                  <a href="mailto:dpo@legalpy.com" className="text-blue-600 hover:underline font-semibold">
                    dpo@legalpy.com
                  </a>
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Botón Flotante "Descargar PDF" - Solo en móvil */}
      <button
        onClick={handleDownloadPDF}
        className="lg:hidden fixed bottom-6 right-6 bg-[#C9A24D] hover:bg-[#b8943f] text-white px-6 py-4 rounded-full shadow-2xl hover:shadow-3xl transition-all flex items-center gap-2 z-50"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <span className="hidden sm:inline">{t("legal_center.download_pdf") || "📥 Descargar PDF"}</span>
        <span className="sm:hidden">📥</span>
      </button>
    </div>
  );
}
