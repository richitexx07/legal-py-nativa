"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Card from "@/components/Card";
import LoginForm from "@/components/Auth/LoginForm";
import { getSession } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();

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
          <h1 className="text-3xl font-bold text-white mb-2">Inicia Sesión</h1>
          <p className="text-white/70">
            Accede a tu cuenta para gestionar tus casos y servicios
          </p>
        </div>

        {/* Formulario */}
        <Card>
          <LoginForm />
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-white/70">
          <p>
            ¿Olvidaste tu contraseña?{" "}
            <Link href="/forgot-password" className="text-[#C9A24D] hover:underline font-medium">
              Recupérala aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
