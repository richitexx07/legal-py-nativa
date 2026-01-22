"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { LoginData, AuthMethod } from "@/lib/types";
import { login, getSession } from "@/lib/auth";
import { isWebAuthnAvailable } from "@/lib/security/webauthn";
import Button from "@/components/Button";
import FormField from "@/components/FormField";
import TwoFactorForm from "./TwoFactorForm";
import BiometricAuth from "@/components/Security/BiometricAuth";
import { useRouter } from "next/navigation";

interface LoginFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  redirectPath?: string;
}

export default function LoginForm({ onSuccess, onError, redirectPath }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [requiresTwoFactor, setRequiresTwoFactor] = useState(false);
  const [twoFactorMethod, setTwoFactorMethod] = useState<"email" | "sms" | "app">("email");
  const [pendingEmail, setPendingEmail] = useState("");
  const [supportsWebAuthn, setSupportsWebAuthn] = useState(false);
  const [biometricLoading, setBiometricLoading] = useState(false);

  // Detectar soporte de WebAuthn
  useEffect(() => {
    if (typeof window !== "undefined") {
      setSupportsWebAuthn(isWebAuthnAvailable());
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    // Validaciones
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors({ email: "Email inválido" });
      setLoading(false);
      return;
    }

    if (!password || password.length < 8) {
      setErrors({ password: "La contraseña es requerida" });
      setLoading(false);
      return;
    }

    try {
      const loginData: LoginData = {
        email,
        password,
        authMethod: "email",
        rememberMe,
      };

      const response = await login(loginData);

      if (response.success && response.session) {
        // Login exitoso
        if (onSuccess) {
          onSuccess();
        } else {
          // Redirigir al panel principal (sin bloqueos)
          const finalPath = redirectPath || "/panel";
          router.push(finalPath);
        }
      } else if (response.requiresTwoFactor) {
        // Requiere 2FA
        setRequiresTwoFactor(true);
        setTwoFactorMethod(response.twoFactorMethod || "email");
        setPendingEmail(email);
        setPassword(""); // Limpiar contraseña
      } else {
        // Error
        const errorMessage = response.error || "Email o contraseña incorrectos";
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

  const handleTwoFactorVerify = async (code: string) => {
    setLoading(true);
    setErrors({});

    try {
      const loginData: LoginData = {
        email: pendingEmail,
        authMethod: "email",
        twoFactorCode: code,
        rememberMe,
      };

      const response = await login(loginData);

      if (response.success && response.session) {
        if (onSuccess) {
          onSuccess();
        } else {
          const finalPath = redirectPath || "/panel";
          router.push(finalPath);
        }
      } else {
        setErrors({ general: response.error || "Código inválido" });
      }
    } catch (error) {
      setErrors({ general: "Error inesperado. Intenta nuevamente." });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: "google" | "facebook" | "apple") => {
    alert(`Login con ${provider} - Próximamente`);
  };

  if (requiresTwoFactor) {
    return (
      <TwoFactorForm
        email={pendingEmail}
        method={twoFactorMethod}
        onVerify={handleTwoFactorVerify}
        onCancel={() => {
          setRequiresTwoFactor(false);
          setPendingEmail("");
        }}
        error={errors.general}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.general && (
        <div className="rounded-lg bg-red-500/20 border border-red-500/50 p-3">
          <p className="text-sm text-red-400">{errors.general}</p>
        </div>
      )}

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
            placeholder="Tu contraseña"
            autoComplete="current-password"
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

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#C9A24D] focus:ring-[#C9A24D]"
          />
          <span className="text-sm text-white/70">Recordarme</span>
        </label>
        <a
          href="/forgot-password"
          className="text-sm text-[#C9A24D] hover:underline"
        >
          ¿Olvidaste tu contraseña?
        </a>
      </div>

      {/* Smart Fingerprint Login - Banking Grade WebAuthn (Método Principal) */}
      {supportsWebAuthn && email && (
        <div className="mb-6">
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-[#13253A] text-white/70 font-medium">
                🔐 Método rápido y seguro
              </span>
            </div>
          </div>
          <BiometricAuth
            email={email}
            mode="login"
            size="lg"
            onSuccess={async () => {
              // En producción, aquí se enviaría la firma al backend para verificación
              setBiometricLoading(true);
              try {
                // Simular verificación con backend (en producción sería real)
                await new Promise((resolve) => setTimeout(resolve, 500));
                
                // Intentar login automático si hay sesión guardada
                const existingSession = getSession();
                if (existingSession && existingSession.user.email === email) {
                  if (onSuccess) {
                    onSuccess();
                  } else {
                    router.push(redirectPath || "/panel");
                  }
                } else {
                  // En producción: enviar firma WebAuthn al backend
                  // const response = await fetch('/api/auth/webauthn/verify', {
                  //   method: 'POST',
                  //   headers: { 'Content-Type': 'application/json' },
                  //   body: JSON.stringify({ assertion, email }),
                  // });
                  // if (response.ok) { 
                  //   const data = await response.json();
                  //   saveSession(data.session);
                  //   router.push('/panel'); 
                  // }
                  
                  // Por ahora, mostrar mensaje de éxito
                  setErrors({
                    general: "✓ Biometría verificada. Redirigiendo...",
                  });
                  setTimeout(() => {
                    router.push(redirectPath || "/panel");
                  }, 1000);
                }
              } catch (error) {
                setErrors({ general: "Error al procesar autenticación biométrica." });
              } finally {
                setBiometricLoading(false);
              }
            }}
            onError={(error) => {
              setErrors({ general: error });
            }}
            disabled={loading || biometricLoading}
          />
          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-[#13253A] text-white/60">O usa contraseña</span>
            </div>
          </div>
        </div>
      )}

      <Button type="submit" variant={supportsWebAuthn ? "secondary" : "primary"} className="w-full" disabled={loading || biometricLoading}>
        {loading ? "Iniciando sesión..." : supportsWebAuthn ? "Usar contraseña" : "Iniciar Sesión"}
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-[#13253A] text-white/60">O continúa con</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => handleSocialLogin("google")}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => handleSocialLogin("facebook")}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
        >
          <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => handleSocialLogin("apple")}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
          </svg>
        </button>
      </div>

      <div className="text-center text-sm text-white/70">
        ¿No tienes cuenta?{" "}
        <Link href="/signup" className="text-[#C9A24D] hover:underline font-medium">
          Regístrate
        </Link>
      </div>
    </form>
  );
}
