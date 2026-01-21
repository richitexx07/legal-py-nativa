"use client";

import { useState, useEffect, useRef } from "react";
import { PolicyLevel } from "@/lib/legal";
import Link from "next/link";
import Button from "@/components/Button";

interface LegalCenterClientProps {
  policyLevels: PolicyLevel[];
}

export default function LegalCenterClient({ policyLevels }: LegalCenterClientProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    // #region agent log
    if (typeof window !== "undefined") {
      fetch('http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/legal-center/LegalCenterClient.tsx:mount',message:'LegalCenterClient mounted',data:{policyLevelsCount:policyLevels.length,levels:policyLevels.map(l=>({id:l.id,title:l.title,policiesCount:l.policies.length}))},timestamp:Date.now(),sessionId:'debug-session',runId:'run-verify',hypothesisId:'H2'})}).catch(()=>{});
    }
    // #endregion

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
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-serif font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Centro de Gobernanza y Transparencia
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
            Bienvenido al Ecosistema Legal PY. Nuestra infraestructura conecta necesidades reales con soluciones expertas.
          </p>
        </div>

        <div className="flex gap-8">
          {/* Navegación Lateral Sticky */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24">
              <nav className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Índice</h3>
                <ul className="space-y-2">
                  {policyLevels.map((level) => (
                    <li key={level.id}>
                      <button
                        onClick={() => scrollToSection(level.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                          activeSection === level.id
                            ? "bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-500"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        <span className="mr-2">{level.emoji}</span>
                        {level.title.split(":")[0]}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </aside>

          {/* Contenido Principal */}
          <main className="flex-1 max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-12">
              {/* Contenido de cada nivel */}
              {policyLevels.map((level) => (
                <div
                  key={level.id}
                  ref={(el) => {
                    sectionRefs.current[level.id] = el;
                  }}
                  className="mb-16 scroll-mt-24"
                >
                  <div className="mb-8 pb-4 border-b-2 border-gray-200">
                    <h2
                      className="text-3xl font-serif font-bold text-gray-900 mb-2"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {level.emoji} {level.title}
                    </h2>
                    <p className="text-gray-600 italic" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {level.description}
                    </p>
                  </div>

                  <div className="space-y-8">
                    {level.policies.map((policy) => (
                      <div key={policy.number} className="prose prose-lg max-w-none">
                        <h3
                          className="text-2xl font-serif font-semibold text-gray-900 mb-4"
                          style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                          {policy.number}. {policy.title}
                        </h3>
                        <div
                          className="text-gray-700 leading-relaxed whitespace-pre-line"
                          style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px", lineHeight: "1.75" }}
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
                <p className="text-sm text-gray-500 text-center" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Última actualización: {new Date().toLocaleDateString("es-PY", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-sm text-gray-500 text-center mt-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                  ¿Tienes preguntas? Contacta a nuestro equipo legal:{" "}
                  <a href="mailto:dpo@legalpy.com" className="text-blue-600 hover:underline">
                    dpo@legalpy.com
                  </a>
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Botón Flotante "Descargar PDF" */}
      <button
        onClick={handleDownloadPDF}
        className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2 z-50"
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
        Descargar PDF Firmado
      </button>
    </div>
  );
}
