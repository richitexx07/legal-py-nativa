"use client";

import Link from "next/link";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Image from "next/image";
import { mockCategorias } from "@/lib/mock-data";

const SIX_CATEGORIES = mockCategorias.slice(0, 6);

const ACTIVITY_CHART = [
  { label: "Casos abiertos", value: 127, color: "bg-[#C9A24D]" },
  { label: "Matchings esta semana", value: 43, color: "bg-blue-500" },
  { label: "Profesionales activos", value: 89, color: "bg-emerald-500" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E1B2A] via-[#13253A] to-[#0E1B2A]">
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center justify-center px-4 py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A24D] rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto text-center z-10">
          <div className="mb-6 flex justify-center">
            <div className="relative w-20 h-20">
              <Image src="/logo.png" alt="Legal PY" fill className="object-contain" priority />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight">
            Tu Seguridad Jurídica{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A24D] to-[#C08457]">
              Blindada con Tecnología
            </span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Conectamos necesidades reales con profesionales verificados. Sin fricción, con seguridad.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
            <Link href="/login">
              <Button
                variant="primary"
                className="w-full sm:w-auto px-8 py-4 text-lg font-semibold rounded-xl shadow-2xl hover:shadow-[#C9A24D]/50 transition-all hover:scale-105"
              >
                Iniciar Sesión
              </Button>
            </Link>
            <Link href="/signup" className="text-white/70 hover:text-white text-sm underline transition">
              Registrarse
            </Link>
          </div>
        </div>
      </section>

      {/* Asistentes IA - Victoria & Justo */}
      <section className="py-12 px-4 border-t border-white/10">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Habla con Victoria y Justo</h2>
          <p className="text-white/70 mb-6 max-w-xl mx-auto">
            Asistentes IA disponibles 24/7. Te orientan y derivan al profesional indicado. Modo demo sin límites.
          </p>
          <p className="text-xs text-yellow-400/90 font-medium">
            Esto no constituye asesoramiento legal. Solo filtrado y derivación.
          </p>
        </div>
      </section>

      {/* 6 categorías fijas de profesionales */}
      <section className="py-12 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Profesionales Verificados</h2>
            <p className="text-white/70">Seis categorías. Encontrá al experto para tu caso.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {SIX_CATEGORIES.map((c) => (
              <Link key={c.id} href={c.href || "/profesionales"}>
                <Card className="h-full p-4 hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer border border-white/10 hover:border-[#C9A24D]/40 text-center">
                  {c.icono && (
                    <div className="relative w-12 h-12 mx-auto mb-2">
                      <Image src={c.icono} alt={c.titulo} fill className="object-contain" sizes="48px" />
                    </div>
                  )}
                  <h3 className="font-bold text-white text-sm">{c.titulo}</h3>
                  <p className="text-white/60 text-xs mt-1 line-clamp-2">{c.descripcion}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Casos internacionales */}
      <section className="py-12 px-4 border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Casos Internacionales</h2>
              <p className="text-white/70">
                Derivación priorizada, matching con profesionales GEP y seguimiento de hitos.
              </p>
            </div>
            <Link href="/casos-internacionales">
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                Ver Casos Internacionales
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Gráficas actividad (anonimizadas, demo-safe) */}
      <section className="py-12 px-4 border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">
            Actividad de la plataforma
          </h2>
          <p className="text-white/60 text-sm text-center mb-8 max-w-lg mx-auto">
            Datos anonimizados. Demo-safe.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ACTIVITY_CHART.map((item) => (
              <Card key={item.label} className="p-6 border border-white/10">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-white/60 text-sm">{item.label}</p>
                    <p className="text-2xl font-bold text-white mt-1">{item.value}</p>
                  </div>
                  <div className={`w-3 h-12 rounded-full ${item.color} opacity-80`} />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Planes - siempre visibles */}
      <section className="py-12 px-4 border-t border-white/10">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Planes y suscripciones</h2>
          <p className="text-white/70 mb-6">Elegí el plan que se adapte a vos. Roles y planes separados.</p>
          <Link href="/pricing">
            <Button variant="primary" className="rounded-xl">
              Ver planes
            </Button>
          </Link>
        </div>
      </section>

      {/* Trust */}
      <section className="py-10 px-4 border-t border-white/10">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-6 md:gap-10">
          <div className="flex items-center gap-2 text-white/60">
            <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <span className="text-sm font-medium">Encriptación AES-256</span>
          </div>
          <div className="flex items-center gap-2 text-white/60">
            <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="text-sm font-medium">Compliance GAFILAT</span>
          </div>
          <div className="flex items-center gap-2 text-white/60">
            <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
              </svg>
            </div>
            <span className="text-sm font-medium">Verificación Biométrica</span>
          </div>
        </div>
      </section>
    </div>
  );
}
