"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import Card from "@/components/Card";
import { useLanguage } from "@/context/LanguageContext";
import { getSession } from "@/lib/auth";
import Image from "next/image";

// Servicios principales para mostrar en la landing
const mainServices = [
  {
    id: "abogados",
    name: "Abogados Verificados",
    description: "Encuentra el profesional ideal para tu caso legal",
    price: "Desde Gs. 2.000.000",
    icon: "⚖️",
    href: "/profesionales?categoria=Abogados",
  },
  {
    id: "escribanos",
    name: "Escribanos Públicos",
    description: "Trámites notariales y documentación oficial",
    price: "Desde Gs. 1.500.000",
    icon: "📜",
    href: "/profesionales?categoria=Escribanos",
  },
  {
    id: "migraciones",
    name: "Gestiones Migratorias",
    description: "Radicación, residencia y trámites consulares",
    price: "Desde Gs. 3.500.000",
    icon: "🌎",
    href: "/migraciones",
  },
  {
    id: "corporativo",
    name: "Asesoría Corporativa",
    description: "Constitución de empresas, due diligence, inversiones",
    price: "Desde Gs. 8.000.000",
    icon: "🏢",
    href: "/profesionales?categoria=Abogados&especialidad=Corporativo",
  },
];

export default function Home() {
  const { t } = useLanguage();
  const router = useRouter();
  const [session, setSession] = useState<ReturnType<typeof getSession>>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const currentSession = getSession();
      setSession(currentSession);
      
      // Si el usuario ya está logueado, redirigir al dashboard
      if (currentSession) {
        router.push("/panel");
      }
    }
  }, [router]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0E1B2A] via-[#13253A] to-[#0E1B2A] flex items-center justify-center">
        <div className="h-96 bg-white/5 rounded-2xl animate-pulse w-full max-w-4xl" />
      </div>
    );
  }

  // Si hay sesión, no mostrar landing (será redirigido)
  if (session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E1B2A] via-[#13253A] to-[#0E1B2A]">
      {/* Hero Section - Estilo Binance/Instagram */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 py-20 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A24D] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-5xl mx-auto text-center z-10">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <div className="relative w-24 h-24">
              <Image
                src="/logo.png"
                alt="Legal PY"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Valor Propuesto (1-2 líneas) */}
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
            Tu Seguridad Jurídica{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A24D] to-[#C08457]">
              Blindada con Tecnología
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
            Conectamos necesidades reales con profesionales verificados. Sin fricción, con seguridad.
          </p>

          {/* CTAs - Estilo Binance */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/login">
              <Button
                variant="primary"
                className="px-8 py-4 text-lg font-semibold rounded-xl shadow-2xl hover:shadow-[#C9A24D]/50 transition-all hover:scale-105"
              >
                Iniciar Sesión
              </Button>
            </Link>
            <Link href="/signup">
              <Button
                variant="outline"
                className="px-8 py-4 text-lg font-semibold rounded-xl border-2 border-white/30 text-white hover:bg-white/10 transition-all hover:scale-105"
              >
                Registrarse
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Servicios Principales - Estilo ChatGPT/Claude Pricing */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Servicios Principales
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Soluciones legales verificadas para cada necesidad
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mainServices.map((service) => (
              <Link key={service.id} href={service.href}>
                <Card className="h-full p-6 hover:shadow-2xl hover:scale-[1.02] transition-all cursor-pointer border border-white/10 hover:border-[#C9A24D]/40">
                  <div className="space-y-4">
                    <div className="text-5xl mb-4">{service.icon}</div>
                    <h3 className="text-xl font-bold text-white">{service.name}</h3>
                    <p className="text-white/70 text-sm leading-relaxed min-h-[3rem]">
                      {service.description}
                    </p>
                    <div className="pt-4 border-t border-white/10">
                      <p className="text-2xl font-bold text-[#C9A24D]">{service.price}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 px-4 border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            <div className="flex items-center gap-3 text-white/60 hover:text-white transition-colors">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <span className="text-sm font-medium">Encriptación AES-256</span>
            </div>
            <div className="flex items-center gap-3 text-white/60 hover:text-white transition-colors">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="text-sm font-medium">Compliance GAFILAT</span>
            </div>
            <div className="flex items-center gap-3 text-white/60 hover:text-white transition-colors">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                </svg>
              </div>
              <span className="text-sm font-medium">Verificación Biométrica</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
