"use client";

import Link from "next/link";
import { useI18n } from "./I18nProvider";
import { useEffect } from "react";

export default function Footer() {
  const { t } = useI18n();

  // #region agent log
  useEffect(() => {
    if (typeof window !== "undefined") {
      fetch("http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: "debug-session",
          runId: "run1",
          hypothesisId: "H3",
          location: "components/Footer.tsx:Footer",
          message: "Footer rendered with policy links",
          data: {},
          timestamp: Date.now(),
        }),
      }).catch(() => {});
    }
  }, []);
  // #endregion

  return (
    <footer className="border-t border-white/10 mt-10 bg-gradient-to-br from-[#0E1B2A] to-[#13253A]">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Columna 1: Información de la empresa */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal PY</h3>
            <p className="text-sm text-white/70">
              Plataforma legal tecnológica de intermediación. Conectamos clientes con profesionales legales.
            </p>
          </div>

          {/* Columna 2: Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/legal-center" className="text-sm text-white/70 hover:text-[#C9A24D] transition-colors">
                  Centro de Transparencia & Legal
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="text-sm text-white/70 hover:text-[#C9A24D] transition-colors">
                  {t.footer.privacidad}
                </Link>
              </li>
              <li>
                <Link href="/legal/terms" className="text-sm text-white/70 hover:text-[#C9A24D] transition-colors">
                  Términos y Condiciones
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Soporte */}
          <div>
            <h3 className="text-white font-semibold mb-4">Soporte</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-sm text-white/70">{t.footer.soporte}</span>
              </li>
              <li>
                <span className="text-sm text-white/70">{t.footer.seguridad}</span>
              </li>
              <li>
                <span className="text-sm text-white/70">{t.footer.cumplimiento}</span>
              </li>
            </ul>
          </div>

          {/* Columna 4: Contacto */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contacto</h3>
            <ul className="space-y-2">
              <li>
                <a href="mailto:dpo@legalpy.com" className="text-sm text-white/70 hover:text-[#C9A24D] transition-colors">
                  dpo@legalpy.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-6 text-center text-sm text-white/50">
          <p>
            {t.footer.copyright} {new Date().getFullYear()} Legal Py — {t.footer.demo}
          </p>
        </div>
      </div>
    </footer>
  );
}
