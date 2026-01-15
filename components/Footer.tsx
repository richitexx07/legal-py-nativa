"use client";

import { useI18n } from "./I18nProvider";

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-white/10 mt-10">
      <div className="mx-auto max-w-7xl px-4 py-8 text-sm text-white/70 flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
        <p>
          {t.footer.copyright} {new Date().getFullYear()} Legal Py — {t.footer.demo}
        </p>
        <p className="text-white/50">
          {t.footer.seguridad} • {t.footer.privacidad} • {t.footer.cumplimiento} • {t.footer.soporte}
        </p>
      </div>
    </footer>
  );
}
