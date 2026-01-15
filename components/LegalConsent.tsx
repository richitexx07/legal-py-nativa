import Link from "next/link";

interface LegalConsentProps {
  terminos: boolean;
  privacidad: boolean;
  veracidad: boolean;
  onTerminosChange: (value: boolean) => void;
  onPrivacidadChange: (value: boolean) => void;
  onVeracidadChange: (value: boolean) => void;
  errors?: {
    terminos?: string;
    privacidad?: string;
    veracidad?: string;
  };
}

export default function LegalConsent({
  terminos,
  privacidad,
  veracidad,
  onTerminosChange,
  onPrivacidadChange,
  onVeracidadChange,
  errors = {},
}: LegalConsentProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id="terminos"
          checked={terminos}
          onChange={(e) => onTerminosChange(e.target.checked)}
          className="mt-1 w-5 h-5 rounded border-white/20 bg-white/5 text-[#C9A24D] focus:ring-[#C9A24D] focus:ring-2"
        />
        <label htmlFor="terminos" className="flex-1 text-sm text-white/90 cursor-pointer">
          Acepto los{" "}
          <Link href="/profesional/terminos" className="text-[#C9A24D] hover:underline">
            Términos y Condiciones
          </Link>
        </label>
      </div>
      {errors.terminos && <p className="text-xs text-red-400 ml-8">{errors.terminos}</p>}

      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id="privacidad"
          checked={privacidad}
          onChange={(e) => onPrivacidadChange(e.target.checked)}
          className="mt-1 w-5 h-5 rounded border-white/20 bg-white/5 text-[#C9A24D] focus:ring-[#C9A24D] focus:ring-2"
        />
        <label htmlFor="privacidad" className="flex-1 text-sm text-white/90 cursor-pointer">
          Acepto la{" "}
          <Link href="/profesional/privacidad" className="text-[#C9A24D] hover:underline">
            Política de Privacidad
          </Link>
        </label>
      </div>
      {errors.privacidad && <p className="text-xs text-red-400 ml-8">{errors.privacidad}</p>}

      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id="veracidad"
          checked={veracidad}
          onChange={(e) => onVeracidadChange(e.target.checked)}
          className="mt-1 w-5 h-5 rounded border-white/20 bg-white/5 text-[#C9A24D] focus:ring-[#C9A24D] focus:ring-2"
        />
        <label htmlFor="veracidad" className="flex-1 text-sm text-white/90 cursor-pointer">
          Declaro bajo juramento que toda la información proporcionada es veraz y que poseo las
          credenciales profesionales necesarias para ejercer mi profesión.
        </label>
      </div>
      {errors.veracidad && <p className="text-xs text-red-400 ml-8">{errors.veracidad}</p>}

      <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10">
        <h4 className="text-sm font-semibold text-white mb-2">Política de Cancelación</h4>
        <p className="text-xs text-white/70">
          Puedes cancelar tu suscripción en cualquier momento desde tu panel. La cancelación será
          efectiva al finalizar el período de facturación actual. No se realizarán reembolsos por
          períodos ya facturados.
        </p>
      </div>
    </div>
  );
}
