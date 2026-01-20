"use client";

import { useState } from "react";
import { Case } from "@/lib/cases";
import { CreateInternationalCaseData, createInternationalCase } from "@/lib/international";
import Card from "@/components/Card";
import Button from "@/components/Button";
import FormField from "@/components/FormField";
import Badge from "@/components/Badge";

interface InternationalCaseFormProps {
  caseData: Case;
  onSuccess: () => void;
  onCancel?: () => void;
}

const COUNTRIES = [
  "Paraguay",
  "Argentina",
  "Brasil",
  "Chile",
  "Uruguay",
  "Estados Unidos",
  "España",
  "Reino Unido",
  "México",
  "Colombia",
  "Perú",
  "Ecuador",
  "Venezuela",
  "Panamá",
  "Costa Rica",
  "China",
  "Japón",
  "Alemania",
  "Francia",
  "Italia",
  "Otro",
];

const LANGUAGES = ["Español", "Inglés", "Portugués", "Francés", "Alemán", "Italiano", "Chino", "Japonés"];

export default function InternationalCaseForm({
  caseData,
  onSuccess,
  onCancel,
}: InternationalCaseFormProps) {
  const [estimatedAmount, setEstimatedAmount] = useState("");
  const [selectedCountries, setSelectedCountries] = useState<string[]>(["Paraguay"]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(["Español", "Inglés"]);
  const [complexity, setComplexity] = useState<"baja" | "media" | "alta" | "muy_alta">("media");
  const [urgency, setUrgency] = useState<"normal" | "alta" | "urgente">("normal");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const MINIMUM_AMOUNT = 5000;

  const handleCountryToggle = (country: string) => {
    if (selectedCountries.includes(country)) {
      if (selectedCountries.length > 1) {
        setSelectedCountries(selectedCountries.filter((c) => c !== country));
      }
    } else {
      setSelectedCountries([...selectedCountries, country]);
    }
  };

  const handleLanguageToggle = (language: string) => {
    if (selectedLanguages.includes(language)) {
      if (selectedLanguages.length > 1) {
        setSelectedLanguages(selectedLanguages.filter((l) => l !== language));
      }
    } else {
      setSelectedLanguages([...selectedLanguages, language]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const amountNum = parseFloat(estimatedAmount);

    if (!estimatedAmount || isNaN(amountNum) || amountNum < MINIMUM_AMOUNT) {
      setErrors({
        amount: `El monto estimado debe ser al menos USD ${MINIMUM_AMOUNT.toLocaleString()}`,
      });
      return;
    }

    if (selectedCountries.length === 0) {
      setErrors({ countries: "Debes seleccionar al menos un país" });
      return;
    }

    setLoading(true);

    try {
      const data: CreateInternationalCaseData = {
        caseId: caseData.id,
        estimatedAmount: amountNum,
        countriesInvolved: selectedCountries,
        languagesRequired: selectedLanguages,
        complexity,
        urgency,
      };

      const response = await createInternationalCase(caseData, data);

      if (response.success) {
        onSuccess();
      } else {
        setErrors({ general: response.error || "Error al crear caso internacional" });
      }
    } catch (error) {
      setErrors({ general: "Error inesperado. Intenta nuevamente." });
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card>
      <h2 className="text-xl font-bold text-white mb-4">Convertir a Caso Internacional</h2>
      <p className="text-sm text-white/70 mb-6">
        Los casos internacionales requieren un monto mínimo de{" "}
        <strong className="text-[#C9A24D]">{formatAmount(MINIMUM_AMOUNT)}</strong> y serán
        procesados a través del embudo de asignación internacional.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.general && (
          <div className="rounded-lg bg-red-500/20 border border-red-500/50 p-3">
            <p className="text-sm text-red-400">{errors.general}</p>
          </div>
        )}

        <FormField label="Monto Estimado (USD)" htmlFor="amount" required error={errors.amount}>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60">USD</span>
            <input
              id="amount"
              type="number"
              step="100"
              min={MINIMUM_AMOUNT}
              value={estimatedAmount}
              onChange={(e) => setEstimatedAmount(e.target.value)}
              className="w-full pl-12 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
              placeholder="5000"
            />
          </div>
          <p className="text-xs text-white/60 mt-1">
            Mínimo: {formatAmount(MINIMUM_AMOUNT)}
          </p>
        </FormField>

        <FormField label="Países Involucrados" htmlFor="countries" required error={errors.countries}>
          <div className="flex flex-wrap gap-2 p-3 rounded-lg bg-white/5 border border-white/10 min-h-[100px]">
            {COUNTRIES.map((country) => (
              <button
                key={country}
                type="button"
                onClick={() => handleCountryToggle(country)}
                className={`px-3 py-1.5 rounded-lg text-sm transition ${
                  selectedCountries.includes(country)
                    ? "bg-[#C9A24D] text-black font-semibold"
                    : "bg-white/10 text-white/80 hover:bg-white/20"
                }`}
              >
                {country}
              </button>
            ))}
          </div>
          <p className="text-xs text-white/60 mt-1">
            {selectedCountries.length} país{selectedCountries.length !== 1 ? "es" : ""} seleccionado
            {selectedCountries.length !== 1 ? "s" : ""}
          </p>
        </FormField>

        <FormField label="Idiomas Requeridos" htmlFor="languages">
          <div className="flex flex-wrap gap-2 p-3 rounded-lg bg-white/5 border border-white/10">
            {LANGUAGES.map((language) => (
              <button
                key={language}
                type="button"
                onClick={() => handleLanguageToggle(language)}
                className={`px-3 py-1.5 rounded-lg text-sm transition ${
                  selectedLanguages.includes(language)
                    ? "bg-[#C9A24D] text-black font-semibold"
                    : "bg-white/10 text-white/80 hover:bg-white/20"
                }`}
              >
                {language}
              </button>
            ))}
          </div>
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Complejidad" htmlFor="complexity">
            <select
              id="complexity"
              value={complexity}
              onChange={(e) => setComplexity(e.target.value as any)}
              className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
              style={{ colorScheme: "dark" }}
            >
              <option value="baja" className="bg-[#13253A] text-white">Baja</option>
              <option value="media" className="bg-[#13253A] text-white">Media</option>
              <option value="alta" className="bg-[#13253A] text-white">Alta</option>
              <option value="muy_alta" className="bg-[#13253A] text-white">Muy Alta</option>
            </select>
          </FormField>

          <FormField label="Urgencia" htmlFor="urgency">
            <select
              id="urgency"
              value={urgency}
              onChange={(e) => setUrgency(e.target.value as any)}
              className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
              style={{ colorScheme: "dark" }}
            >
              <option value="normal" className="bg-[#13253A] text-white">Normal</option>
              <option value="alta" className="bg-[#13253A] text-white">Alta</option>
              <option value="urgente" className="bg-[#13253A] text-white">Urgente</option>
            </select>
          </FormField>
        </div>

        <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
          <p className="text-xs text-white/70 leading-relaxed">
            <strong className="text-blue-400">Proceso de derivación ética:</strong> Una vez convertido,
            el caso será derivado según perfil técnico: primero al socio GEP Gold (evaluación prioritaria de 48h),
            luego a Consorcios Tier Premium, y si no hay aceptaciones, se derivará a Consorcios Tier Standard.
            <br />
            <span className="text-[#C9A24D] font-semibold">No hay subastas ni competencia económica.</span> La derivación se basa exclusivamente en coincidencia de perfil técnico, especialidad y experiencia.
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          {onCancel && (
            <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          <Button type="submit" variant="primary" className="flex-1" disabled={loading}>
            {loading ? "Convirtiendo..." : "Convertir a Caso Internacional"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
