"use client";

import { useState } from "react";
import { UserRole, RegisterData } from "@/lib/types";
import { register } from "@/lib/auth";
import Button from "@/components/Button";
import FormField from "@/components/FormField";
import RoleSelector from "./RoleSelector";
import Link from "next/link";

interface RegisterFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function RegisterForm({ onSuccess, onError }: RegisterFormProps) {
  const [step, setStep] = useState<"role" | "credentials">("role");
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setErrors({});
  };

  const handleRoleContinue = () => {
    if (!selectedRole) {
      setErrors({ role: "Por favor selecciona un tipo de cuenta" });
      return;
    }
    setStep("credentials");
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!email) {
      newErrors.email = "El email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Email inválido";
    }

    if (!password) {
      newErrors.password = "La contraseña es requerida";
    } else if (password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      newErrors.password = "La contraseña debe contener mayúsculas, minúsculas y números";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    if (!acceptTerms) {
      newErrors.terms = "Debes aceptar los términos y condiciones";
    }

    if (!acceptPrivacy) {
      newErrors.privacy = "Debes aceptar la política de privacidad";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !selectedRole) return;

    setLoading(true);
    setErrors({});

    try {
      const registerData: RegisterData = {
        email,
        password,
        role: selectedRole,
        authMethod: "email",
        acceptTerms,
        acceptPrivacy,
      };

      const response = await register(registerData);

      if (response.success && response.session) {
        if (onSuccess) {
          onSuccess();
        } else {
          // Redirigir según el rol
          const redirectPath =
            selectedRole === "profesional"
              ? "/profesional/panel"
              : selectedRole === "estudiante"
              ? "/pasantias"
              : "/casos";
          
          window.location.href = redirectPath;
        }
      } else {
        const errorMessage = response.error || "Error al registrar. Intenta nuevamente.";
        setErrors({ general: errorMessage });
        if (onError) {
          onError(errorMessage);
        }
      }
    } catch (error) {
      const errorMessage = "Error inesperado. Intenta nuevamente.";
      setErrors({ general: errorMessage });
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  if (step === "role") {
    return (
      <div className="space-y-6">
        <RoleSelector
          selectedRole={selectedRole}
          onRoleSelect={handleRoleSelect}
          error={errors.role}
        />
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => window.history.back()}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="primary"
            className="flex-1"
            onClick={handleRoleContinue}
          >
            Continuar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.general && (
        <div className="rounded-lg bg-red-500/20 border border-red-500/50 p-4">
          <p className="text-sm text-red-400">{errors.general}</p>
        </div>
      )}

      <div className="bg-[#C9A24D]/10 border border-[#C9A24D]/30 rounded-lg p-4">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">
            {selectedRole === "cliente" ? "👤" : selectedRole === "profesional" ? "⚖️" : "🎓"}
          </span>
          <div>
            <p className="font-semibold text-white">
              {selectedRole === "cliente"
                ? "Registro como Cliente"
                : selectedRole === "profesional"
                ? "Registro como Profesional"
                : "Registro como Estudiante"}
            </p>
            <button
              type="button"
              onClick={() => setStep("role")}
              className="text-sm text-[#C9A24D] hover:underline mt-1"
            >
              Cambiar tipo de cuenta
            </button>
          </div>
        </div>
      </div>

      <FormField label="Email" htmlFor="email" required error={errors.email}>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
          placeholder="tu@email.com"
          autoComplete="email"
        />
      </FormField>

      <FormField label="Contraseña" htmlFor="password" required error={errors.password}>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 pr-10 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
            placeholder="Mínimo 8 caracteres"
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
          >
            {showPassword ? "👁️" : "👁️‍🗨️"}
          </button>
        </div>
      </FormField>

      <FormField label="Confirmar Contraseña" htmlFor="confirmPassword" required error={errors.confirmPassword}>
        <input
          id="confirmPassword"
          type={showPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
          placeholder="Confirma tu contraseña"
          autoComplete="new-password"
        />
      </FormField>

      <div className="space-y-4">
        {/* Términos y Condiciones - OBLIGATORIO */}
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="acceptTerms"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            required
            className="mt-1 w-5 h-5 rounded border-white/20 bg-white/5 text-[#C9A24D] focus:ring-[#C9A24D] focus:ring-2 shrink-0"
          />
          <label htmlFor="acceptTerms" className="flex-1 text-sm text-white/90 cursor-pointer">
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
        {errors.terms && <p className="text-xs text-red-400 ml-8">{errors.terms}</p>}

        {/* Política de Privacidad - OBLIGATORIO */}
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="acceptPrivacy"
            checked={acceptPrivacy}
            onChange={(e) => setAcceptPrivacy(e.target.checked)}
            required
            className="mt-1 w-5 h-5 rounded border-white/20 bg-white/5 text-[#C9A24D] focus:ring-[#C9A24D] focus:ring-2 shrink-0"
          />
          <label htmlFor="acceptPrivacy" className="flex-1 text-sm text-white/90 cursor-pointer">
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
        {errors.privacy && <p className="text-xs text-red-400 ml-8">{errors.privacy}</p>}

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
      </div>

      <Button type="submit" variant="primary" className="w-full" disabled={loading}>
        {loading ? "Registrando..." : "Crear Cuenta"}
      </Button>

      <div className="text-center text-sm text-white/70">
        ¿Ya tienes cuenta?{" "}
        <a href="/login" className="text-[#C9A24D] hover:underline">
          Inicia sesión
        </a>
      </div>
    </form>
  );
}
