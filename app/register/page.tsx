"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Card from "@/components/Card";
import RegisterForm from "@/components/Auth/RegisterForm";
import EmailVerificationForm from "@/components/Auth/EmailVerificationForm";
import { getSession } from "@/lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<"register" | "verify">("register");
  const [userEmail, setUserEmail] = useState("");

  // Verificar si ya hay sesión
  useEffect(() => {
    const session = getSession();
    if (session) {
      // Redirigir según el rol
      const redirectPath =
        session.user.role === "profesional"
          ? "/profesional/panel"
          : session.user.role === "estudiante"
          ? "/pasantias"
          : "/casos";
      router.push(redirectPath);
    }
  }, [router]);

  const handleRegisterSuccess = () => {
    // Después del registro exitoso, mostrar verificación de email
    const session = getSession();
    if (session) {
      setUserEmail(session.user.email);
      setStep("verify");
    } else {
      // Si no hay sesión, redirigir a login
      router.push("/login");
    }
  };

  const handleEmailVerified = () => {
    // Email verificado, redirigir según el rol
    const session = getSession();
    if (session) {
      const redirectPath =
        session.user.role === "profesional"
          ? "/profesional/panel"
          : session.user.role === "estudiante"
          ? "/pasantias"
          : "/casos";
      router.push(redirectPath);
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E1B2A] via-[#13253A] to-[#0E1B2A] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <div className="flex items-center justify-center gap-3">
              <div className="relative w-12 h-12">
                <Image
                  src="/logo.png"
                  alt="Legal PY"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="text-2xl font-bold text-white">Legal PY</span>
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">
            {step === "register" ? "Crea tu Cuenta" : "Verifica tu Email"}
          </h1>
          <p className="text-white/70">
            {step === "register"
              ? "Únete a la plataforma legal más completa de Paraguay"
              : "Confirma tu dirección de email para continuar"}
          </p>
        </div>

        {/* Formulario */}
        <Card>
          {step === "register" ? (
            <RegisterForm
              onSuccess={handleRegisterSuccess}
              onError={(error) => {
                console.error("Registration error:", error);
              }}
            />
          ) : (
            <EmailVerificationForm
              email={userEmail}
              onVerified={handleEmailVerified}
              onCancel={() => {
                setStep("register");
                setUserEmail("");
              }}
            />
          )}
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-white/70">
          <p>
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="text-[#C9A24D] hover:underline font-medium">
              Inicia sesión
            </Link>
          </p>
        </div>

        {/* Social login placeholders */}
        {step === "register" && (
          <div className="mt-6">
            <div className="relative mb-4">
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
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
                onClick={() => {
                  alert("Login con Google - Próximamente");
                }}
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
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
                onClick={() => {
                  alert("Login con Facebook - Próximamente");
                }}
              >
                <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
                onClick={() => {
                  alert("Login con Apple - Próximamente");
                }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
