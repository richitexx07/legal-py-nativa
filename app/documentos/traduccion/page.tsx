"use client";

import { useState } from "react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { useI18n } from "@/components/I18nProvider";

type TranslationStatus = "idle" | "processing" | "completed";

export default function TraduccionPage() {
  const { t } = useI18n();
  const [file, setFile] = useState<File | null>(null);
  const [sourceLang, setSourceLang] = useState("es");
  const [targetLang, setTargetLang] = useState("en");
  const [status, setStatus] = useState<TranslationStatus>("idle");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus("idle");
    }
  };

  const handleTranslate = () => {
    if (!file) return;
    setStatus("processing");
    // Simular procesamiento
    setTimeout(() => {
      setStatus("completed");
    }, 2000);
  };

  const languages = [
    { code: "es", name: "Español" },
    { code: "en", name: "English" },
    { code: "pt", name: "Português" },
    { code: "de", name: "Deutsch" },
    { code: "fr", name: "Français" },
    { code: "it", name: "Italiano" },
    { code: "gn", name: "Guaraní" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white">{t("translation.page_title")}</h1>
        <p className="mt-2 text-white/70">{t("translation.page_subtitle")}</p>
      </div>

      <Card>
        <div className="space-y-6">
          {/* Upload */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              {t("translation.upload_label")}
            </label>
            <input
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileChange}
              className="w-full rounded-xl bg-white/10 px-4 py-3 outline-none ring-1 ring-white/10 focus:ring-[#C9A24D]/60 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#C9A24D] file:text-black hover:file:bg-[#b8943f] cursor-pointer"
            />
            {file && (
              <p className="mt-2 text-sm text-white/60">
                {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </p>
            )}
          </div>

          {/* Language Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                {t("translation.source_language")}
              </label>
              <select
                value={sourceLang}
                onChange={(e) => setSourceLang(e.target.value)}
                className="w-full rounded-xl bg-white/10 px-4 py-3 outline-none ring-1 ring-white/10 focus:ring-[#C9A24D]/60 text-white"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-[#13253A]">
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                {t("translation.target_language")}
              </label>
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="w-full rounded-xl bg-white/10 px-4 py-3 outline-none ring-1 ring-white/10 focus:ring-[#C9A24D]/60 text-white"
              >
                {languages
                  .filter((lang) => lang.code !== sourceLang)
                  .map((lang) => (
                    <option key={lang.code} value={lang.code} className="bg-[#13253A]">
                      {lang.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Translate Button */}
          <Button
            onClick={handleTranslate}
            variant="primary"
            size="lg"
            className="w-full"
            disabled={!file || status === "processing"}
          >
            {status === "processing" ? t("translation.status_processing") : t("translation.translate_button")}
          </Button>
        </div>
      </Card>

      {/* Status / Result */}
      <Card>
        <div className="space-y-4">
          {status === "idle" && (
            <p className="text-white/60 text-center py-8">{t("translation.status_idle")}</p>
          )}
          {status === "processing" && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#C9A24D]"></div>
              <p className="mt-4 text-white/60">{t("translation.status_processing")}</p>
            </div>
          )}
          {status === "completed" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">{t("translation.status_result_title")}</h3>
              <div className="rounded-xl bg-white/5 p-6 border border-white/10">
                <p className="text-white/60">{t("translation.status_placeholder")}</p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
