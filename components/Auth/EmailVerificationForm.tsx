"use client";

import { useState } from "react";
import Button from "@/components/Button";
import FormField from "@/components/FormField";
import { sendEmailVerificationCode, verifyEmail } from "@/lib/auth";

interface EmailVerificationFormProps {
  email: string;
  onVerified: () => void;
  onCancel?: () => void;
}

export default function EmailVerificationForm({
  email,
  onVerified,
  onCancel,
}: EmailVerificationFormProps) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [codeSent, setCodeSent] = useState(false);

  const handleSendCode = async () => {
    setSending(true);
    setError("");
    try {
      const response = await sendEmailVerificationCode(email);
      if (response.success) {
        setCodeSent(true);
        alert(response.message || "Código enviado. Revisa tu email.");
      } else {
        setError(response.error || "Error al enviar el código");
      }
    } catch (err) {
      setError("Error inesperado. Intenta nuevamente.");
    } finally {
      setSending(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!code || code.length !== 6) {
      setError("Por favor ingresa el código de 6 dígitos");
      setLoading(false);
      return;
    }

    try {
      const response = await verifyEmail(email, code);
      if (response.success) {
        onVerified();
      } else {
        setError(response.error || "Código inválido");
      }
    } catch (err) {
      setError("Error inesperado. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#C9A24D]/20 mb-4">
          <span className="text-3xl">📧</span>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Verifica tu Email</h3>
        <p className="text-sm text-white/70">
          Hemos enviado un código de verificación a
        </p>
        <p className="text-sm font-medium text-white mt-1">{email}</p>
      </div>

      {!codeSent && (
        <div className="text-center">
          <Button
            type="button"
            variant="primary"
            onClick={handleSendCode}
            disabled={sending}
          >
            {sending ? "Enviando..." : "Enviar Código"}
          </Button>
        </div>
      )}

      {codeSent && (
        <>
          {error && (
            <div className="rounded-lg bg-red-500/20 border border-red-500/50 p-4">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <div className="bg-[#C9A24D]/10 border border-[#C9A24D]/30 rounded-lg p-4">
            <p className="text-xs text-white/70 text-center">
              <strong>Demo:</strong> Usa el código <strong className="text-[#C9A24D]">123456</strong>{" "}
              para verificar
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-4">
            <FormField label="Código de Verificación" htmlFor="code">
              <input
                id="code"
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="w-full px-4 py-3 text-center text-2xl font-bold tracking-widest rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
                placeholder="123456"
                autoComplete="one-time-code"
              />
            </FormField>

            <div className="flex gap-3">
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={onCancel}
                >
                  Cancelar
                </Button>
              )}
              <Button
                type="submit"
                variant="primary"
                className="flex-1"
                disabled={loading || code.length !== 6}
              >
                {loading ? "Verificando..." : "Verificar Email"}
              </Button>
            </div>
          </form>

          <div className="text-center">
            <button
              type="button"
              className="text-sm text-[#C9A24D] hover:underline"
              onClick={handleSendCode}
            >
              ¿No recibiste el código? Reenviar
            </button>
          </div>
        </>
      )}
    </div>
  );
}
