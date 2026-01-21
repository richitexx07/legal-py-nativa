"use client";

import Modal from "@/components/Modal";
import { useLanguage } from "@/context/LanguageContext";

export type ViewMode = "cliente" | "profesional";

interface RoleModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMode: ViewMode;
  onSelectMode: (mode: ViewMode) => void;
}

export default function RoleModeModal({ isOpen, onClose, currentMode, onSelectMode }: RoleModeModalProps) {
  const { t } = useLanguage();
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t("roles.modal_title") || "¿Cómo deseas operar hoy?"}
      className="max-w-2xl bg-white/5 backdrop-blur-2xl border border-white/15"
      position="center"
    >
      <div className="space-y-4">
        <p className="text-sm text-white/70">
          {t("roles.modal_subtitle") || "Elegí el modo para adaptar la interfaz (sin perder tus datos)."}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => onSelectMode("cliente")}
            className={`group text-left rounded-3xl p-6 border transition-all ${
              currentMode === "cliente"
                ? "bg-white/15 border-white/30 shadow-xl"
                : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
            }`}
            aria-label="Seleccionar modo cliente"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-2xl font-extrabold text-white">👤 {t("roles.client_mode")}</p>
                <p className="mt-2 text-sm text-white/70">{t("roles.client_desc")}</p>
              </div>
              {currentMode === "cliente" && (
                <div className="h-8 w-8 rounded-2xl bg-[#C9A24D]/20 border border-[#C9A24D]/30 flex items-center justify-center">
                  <span className="text-[#C9A24D] font-bold">✓</span>
                </div>
              )}
            </div>

            <div className="mt-4 rounded-2xl bg-white/5 border border-white/10 p-4">
              <p className="text-xs text-white/60 leading-relaxed">
                {t("roles.client_features") || "Verás \"Mis Casos\", transparencia, seguridad y el flujo para publicar un caso."}
              </p>
            </div>
          </button>

          <button
            onClick={() => onSelectMode("profesional")}
            className={`group text-left rounded-3xl p-6 border transition-all ${
              currentMode === "profesional"
                ? "bg-[#C9A24D]/10 border-[#C9A24D]/30 shadow-xl"
                : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
            }`}
            aria-label="Seleccionar modo profesional"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-2xl font-extrabold text-white">💼 {t("roles.pro_mode")}</p>
                <p className="mt-2 text-sm text-white/70">{t("roles.pro_desc")}</p>
              </div>
              {currentMode === "profesional" && (
                <div className="h-8 w-8 rounded-2xl bg-[#C9A24D]/20 border border-[#C9A24D]/30 flex items-center justify-center">
                  <span className="text-[#C9A24D] font-bold">✓</span>
                </div>
              )}
            </div>

            <div className="mt-4 rounded-2xl bg-white/5 border border-white/10 p-4">
              <p className="text-xs text-white/60 leading-relaxed">
                {t("roles.pro_features") || "Verás \"Panel de Oportunidades\", gestión, evaluación DPT y panel profesional."}
              </p>
            </div>
          </button>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition text-sm text-white/80"
          >
            {t("common.cancel")}
          </button>
        </div>
      </div>
    </Modal>
  );
}

