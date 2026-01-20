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
    <footer className="border-t border-white/10 mt-10">
      <div className="mx-auto max-w-7xl px-4 py-8 text-sm text-white/70 flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
        <p>
          {t.footer.copyright} {new Date().getFullYear()} Legal Py — {t.footer.demo}
        </p>
        <div className="flex flex-wrap items-center gap-2 text-white/50">
          <span>{t.footer.seguridad}</span>
          <span>•</span>
          <Link href="/legal/privacy" className="hover:text-[#C9A24D] transition-colors">
            {t.footer.privacidad}
          </Link>
          <span>•</span>
          <Link href="/legal/terms" className="hover:text-[#C9A24D] transition-colors">
            Términos y Condiciones
          </Link>
          <span>•</span>
          <span>{t.footer.cumplimiento}</span>
          <span>•</span>
          <span>{t.footer.soporte}</span>
        </div>
      </div>
    </footer>
  );
}
