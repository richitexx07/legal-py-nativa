"use client";

import { useState, useEffect, useRef } from "react";
import Button from "@/components/Button";
import FormField from "@/components/FormField";

interface TwoFactorFormProps {
  email: string;
  method: "email" | "sms" | "app";
  onVerify: (code: string) => Promise<void>;
  onCancel?: () => void;
  error?: string;
}

export default function TwoFactorForm({
  email,
  method,
  onVerify,
  onCancel,
  error,
}: TwoFactorFormProps) {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const methodLabels = {
    email: "email",
    sms: "SMS",
    app: "aplicación de autenticación",
  };

  useEffect(() => {
    // Auto-focus en el primer input
    inputRefs.current[0]?.focus();
  }, []);

  const handleCodeChange = (index: number, value: string) => {
    // Solo permitir números
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-avanzar al siguiente input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-enviar cuando se complete el código
    if (newCode.every((digit) => digit !== "") && index === 5) {
      handleSubmit(newCode.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").slice(0, 6);
    if (/^\d+$/.test(pasted)) {
      const newCode = pasted.split("").concat(Array(6 - pasted.length).fill(""));
      setCode(newCode);
      const lastFilledIndex = Math.min(pasted.length - 1, 5);
      inputRefs.current[lastFilledIndex]?.focus();
      if (pasted.length === 6) {
        handleSubmit(pasted);
      }
    }
  };

  const handleSubmit = async (codeValue?: string) => {
    const codeToVerify = codeValue || code.join("");
    if (codeToVerify.length !== 6) {
      return;
    }

    setLoading(true);
    try {
      await onVerify(codeToVerify);
    } catch (err) {
      // Error manejado por el componente padre
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#C9A24D]/20 mb-4">
          <span className="text-3xl">🔐</span>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Verificación en Dos Pasos</h3>
        <p className="text-sm text-white/70">
          Ingresa el código de 6 dígitos que enviamos a tu {methodLabels[method]}
        </p>
        <p className="text-sm font-medium text-white mt-1">{email}</p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-500/20 border border-red-500/50 p-4">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      <div className="bg-[#C9A24D]/10 border border-[#C9A24D]/30 rounded-lg p-4">
        <p className="text-xs text-white/70 text-center">
          <strong>Demo:</strong> Usa el código <strong className="text-[#C9A24D]">123456</strong> o
          cualquier código de 6 dígitos para probar
        </p>
      </div>

      <FormField label="Código de Verificación" htmlFor="code">
        <div className="flex gap-2 justify-center" onPaste={handlePaste}>
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleCodeChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-14 text-center text-2xl font-bold rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
            />
          ))}
        </div>
      </FormField>

      <div className="flex gap-3">
        {onCancel && (
          <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button
          type="button"
          variant="primary"
          className="flex-1"
          onClick={() => handleSubmit()}
          disabled={loading || code.join("").length !== 6}
        >
          {loading ? "Verificando..." : "Verificar"}
        </Button>
      </div>

      <div className="text-center">
        <button
          type="button"
          className="text-sm text-[#C9A24D] hover:underline"
          onClick={() => {
            // En producción, aquí se reenviaría el código
            alert("Código reenviado. Revisa tu " + methodLabels[method]);
          }}
        >
          ¿No recibiste el código? Reenviar
        </button>
      </div>
    </div>
  );
}
