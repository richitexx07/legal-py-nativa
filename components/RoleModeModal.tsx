"use client";

import Modal from "@/components/Modal";
import { useLanguage } from "@/context/LanguageContext";

export type ViewMode = "cliente" | "profesional" | "estudiante";

interface RoleModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMode: ViewMode;
  onSelectMode: (mode: ViewMode) => void;
}

export default function RoleModeModal({ isOpen, onClose, currentMode, onSelectMode }: RoleModeModalProps) {
  const { t } = useLanguage();

  const rows: Array<{ id: ViewMode; icon: string; titleKey: string; descKey: string }> = [
    { id: "cliente", icon: "👤", titleKey: "roles.client_title", descKey: "roles.client_desc" },
    { id: "profesional", icon: "💼", titleKey: "roles.pro_title", descKey: "roles.pro_desc" },
    { id: "estudiante", icon: "🎓", titleKey: "roles.student_title", descKey: "roles.student_desc" },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t("roles.switch_modal_title") || "Selecciona tu Espacio de Trabajo"}
      className="max-w-lg bg-slate-900/95 border border-white/10 rounded-3xl shadow-2xl animate-scale-in"
      position="center"
      zIndexClass="z-[9999]"
    >
      <div className="space-y-4">
        <p className="text-sm text-white/70">
          {t("roles.modal_subtitle") || "Elegí el modo para adaptar la interfaz (sin perder tus datos)."}
        </p>

        <div className="space-y-2">
          {rows.map((row) => {
            const active = currentMode === row.id;
            const title = t(row.titleKey);
            const desc = t(row.descKey);
            return (
              <button
                key={row.id}
                onClick={() => onSelectMode(row.id)}
                className={`w-full flex items-center justify-between gap-3 rounded-2xl px 4 py-3 transition-all text-left ${
                  active
                    ? "bg-white text-slate-900 shadow-lg"
                    : "bg-slate-800/80 hover:bg-slate-700/90 text-white"
                }`}
                aria-label={`Seleccionar modo ${title}`}
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-900/80 flex items-center justify-center text-lg">
                    {row.icon}
                  </div>
                  <div>
                    <p className={`font-semibold ${active ? "text-slate-900" : "text-white"}`}>{title}</p>
                    <p className={`text-xs ${active ? "text-slate-600" : "text-slate-300/80"}`}>{desc}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  {active ? (
                    <div className="h-5 w-5 rounded-full border-2 border-blue-500 flex items-center justify-center">
                      <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                    </div>
                  ) : (
                    <div className="h-5 w-5 rounded-full border border-slate-500/60 group-hover:border-white/80" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex justify-end pt-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-2xl bg-slate-800 text-sm text-white/80 hover:bg-slate-700 transition"
          >
            {t("common.cancel")}
          </button>
        </div>
      </div>
    </Modal>
  );
}

