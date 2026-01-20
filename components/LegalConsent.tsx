"use client";

import Link from "next/link";

interface LegalConsentProps {
  acceptTerms?: boolean;
  acceptPrivacy?: boolean;
  veracidad?: boolean;
  onTermsChange?: (value: boolean) => void;
  onPrivacyChange?: (value: boolean) => void;
  onVeracidadChange?: (value: boolean) => void;
  termsError?: string;
  privacyError?: string;
  veracidadError?: string;
  errors?: {
    terminos?: string;
    privacidad?: string;
    veracidad?: string;
    terms?: string;
    privacy?: string;
  };
}

export default function LegalConsent({
  acceptTerms,
  acceptPrivacy,
  veracidad,
  onTermsChange,
  onPrivacyChange,
  onVeracidadChange,
  termsError,
  privacyError,
  veracidadError,
  errors = {},
}: LegalConsentProps) {
  // Compatibilidad con diferentes nombres de props
  const terms = acceptTerms !== undefined ? acceptTerms : false;
  const privacy = acceptPrivacy !== undefined ? acceptPrivacy : false;
  const veracidadValue = veracidad !== undefined ? veracidad : false;
  
  const termsErr = termsError || errors.terms || errors.terminos;
  const privacyErr = privacyError || errors.privacy || errors.privacidad;
  const veracidadErr = veracidadError || errors.veracidad;

  const handleTermsChange = (value: boolean) => {
    if (onTermsChange) onTermsChange(value);
  };

  const handlePrivacyChange = (value: boolean) => {
    if (onPrivacyChange) onPrivacyChange(value);
  };

  const handleVeracidadChange = (value: boolean) => {
    if (onVeracidadChange) onVeracidadChange(value);
  };

  return (
    <div className="space-y-4">
      {/* Términos y Condiciones */}
      {(onTermsChange !== undefined || acceptTerms !== undefined) && (
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="terms"
            checked={terms}
            onChange={(e) => handleTermsChange(e.target.checked)}
            required
            className="mt-1 w-5 h-5 rounded border-white/20 bg-white/5 text-[#C9A24D] focus:ring-[#C9A24D] focus:ring-2 shrink-0"
          />
          <label htmlFor="terms" className="flex-1 text-sm text-white/90 cursor-pointer">
            Acepto los{" "}
            <Link
              href="/legal/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C9A24D] hover:underline font-medium"
            >
              Términos y Condiciones
            </Link>
            <span className="text-red-400 ml-1">*</span>
          </label>
        </div>
      )}
      {termsErr && <p className="text-xs text-red-400 ml-8">{termsErr}</p>}

      {/* Política de Privacidad */}
      {(onPrivacyChange !== undefined || acceptPrivacy !== undefined) && (
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="privacy"
            checked={privacy}
            onChange={(e) => handlePrivacyChange(e.target.checked)}
            required
            className="mt-1 w-5 h-5 rounded border-white/20 bg-white/5 text-[#C9A24D] focus:ring-[#C9A24D] focus:ring-2 shrink-0"
          />
          <label htmlFor="privacy" className="flex-1 text-sm text-white/90 cursor-pointer">
            Acepto la{" "}
            <Link
              href="/legal/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C9A24D] hover:underline font-medium"
            >
              Política de Privacidad
            </Link>
            <span className="text-red-400 ml-1">*</span>
          </label>
        </div>
      )}
      {privacyErr && <p className="text-xs text-red-400 ml-8">{privacyErr}</p>}

      {/* Veracidad (solo para profesionales) */}
      {onVeracidadChange !== undefined && (
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="veracidad"
            checked={veracidadValue}
            onChange={(e) => handleVeracidadChange(e.target.checked)}
            required
            className="mt-1 w-5 h-5 rounded border-white/20 bg-white/5 text-[#C9A24D] focus:ring-[#C9A24D] focus:ring-2 shrink-0"
          />
          <label htmlFor="veracidad" className="flex-1 text-sm text-white/90 cursor-pointer">
            Declaro bajo juramento que toda la información proporcionada es veraz y que poseo las
            credenciales profesionales necesarias para ejercer mi profesión.
            <span className="text-red-400 ml-1">*</span>
          </label>
        </div>
      )}
      {veracidadErr && <p className="text-xs text-red-400 ml-8">{veracidadErr}</p>}

      {/* Descargo Legal */}
      <div className="mt-4 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30">
        <h4 className="text-sm font-semibold text-yellow-400 mb-2">⚠️ Descargo Legal Importante</h4>
        <p className="text-xs text-white/70 leading-relaxed">
          <strong>Legal PY es una plataforma de intermediación.</strong> No proporcionamos
          asesoramiento legal directo ni procesamos pagos. Los servicios legales son proporcionados
          por profesionales independientes. Legal PY no se hace responsable por la calidad de los
          servicios prestados por profesionales ni por los resultados de casos.
        </p>
      </div>

      {/* Política de Cancelación (solo para profesionales) */}
      {onVeracidadChange !== undefined && (
        <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10">
          <h4 className="text-sm font-semibold text-white mb-2">Política de Cancelación</h4>
          <p className="text-xs text-white/70">
            Puedes cancelar tu suscripción en cualquier momento desde tu panel. La cancelación será
            efectiva al finalizar el período de facturación actual. No se realizarán reembolsos por
            períodos ya facturados.
          </p>
        </div>
      )}
    </div>
  );
}
