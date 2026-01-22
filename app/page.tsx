"use client";

import Link from "next/link";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Image from "next/image";
import { mockCategorias, mockProfesionales } from "@/lib/mock-data";

const SIX_CATEGORIES = mockCategorias.slice(0, 6);

// Profesionales destacados (top 6 por rating)
const FEATURED_PROFESSIONALS = mockProfesionales
  .filter((p) => p.categoria === "Abogados")
  .sort((a, b) => b.rating - a.rating)
  .slice(0, 6);

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

      {/* Asistentes IA - Victoria & Justo - VISIBLES Y ACCESIBLES */}
      <section className="py-16 px-4 border-t border-white/10 bg-gradient-to-b from-transparent to-[#13253A]/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Habla con <span className="text-[#C9A24D]">Victoria</span> y <span className="text-[#C9A24D]">Justo</span>
            </h2>
            <p className="text-lg text-white/80 mb-4 max-w-2xl mx-auto">
              Asistentes IA disponibles 24/7. Te orientan y derivan al profesional indicado. 
              <span className="block mt-2 text-base text-white/70">Modo demo sin límites - Sin registro necesario</span>
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-400/15 border border-yellow-400/30">
              <span className="text-sm">⚠️</span>
              <p className="text-xs text-yellow-200 font-semibold">
                Esto no constituye asesoramiento legal. Solo filtrado y derivación.
              </p>
            </div>
          </div>
          
          {/* Cards de asistentes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-8">
            {/* Victoria */}
            <Card className="p-6 hover:shadow-xl hover:scale-[1.02] transition-all border border-white/10 hover:border-[#C9A24D]/40 bg-gradient-to-br from-blue-500/10 to-purple-500/10">
              <div className="flex items-start gap-4">
                <div className="relative h-16 w-16 rounded-2xl overflow-hidden border-2 border-blue-400/40 bg-white/5 shrink-0">
                  <Image 
                    src="/avatars/icono_abogada_avatar.jpeg" 
                    alt="Victoria" 
                    fill 
                    className="object-cover" 
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold text-white">Victoria</h3>
                    <span className="text-lg">👩‍⚖️</span>
                  </div>
                  <p className="text-sm text-white/70 mb-3">
                    Empatía, calma y precisión. Ideal para familia, laboral y estudiantes.
                  </p>
                  <p className="text-xs text-blue-300/80 font-medium">
                    Disponible ahora - Clic en el botón flotante para iniciar
                  </p>
                </div>
              </div>
            </Card>

            {/* Justo */}
            <Card className="p-6 hover:shadow-xl hover:scale-[1.02] transition-all border border-white/10 hover:border-[#C9A24D]/40 bg-gradient-to-br from-[#C9A24D]/10 to-[#C08457]/10">
              <div className="flex items-start gap-4">
                <div className="relative h-16 w-16 rounded-2xl overflow-hidden border-2 border-[#C9A24D]/40 bg-white/5 shrink-0">
                  <Image 
                    src="/avatars/icono_abogado_avatar.jpeg" 
                    alt="Justo" 
                    fill 
                    className="object-cover" 
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold text-white">Justo</h3>
                    <span className="text-lg">👨‍⚖️</span>
                  </div>
                  <p className="text-sm text-white/70 mb-3">
                    Autoridad, claro y pausado. Ideal para casos corporativos y penales.
                  </p>
                  <p className="text-xs text-[#C9A24D] font-medium">
                    Disponible ahora - Clic en el botón flotante para iniciar
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-white/60">
              💡 Los asistentes están disponibles en el botón flotante (esquina inferior derecha)
            </p>
          </div>
        </div>
      </section>

      {/* Profesionales Destacados - NO listado genérico */}
      <section className="py-16 px-4 border-t border-white/10 bg-gradient-to-b from-transparent to-[#13253A]/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Profesionales Destacados</h2>
            <p className="text-white/70 text-lg">
              Abogados verificados con alta calificación. Encontrá al experto para tu caso.
            </p>
          </div>
          
          {/* Grid de profesionales destacados */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {FEATURED_PROFESSIONALS.map((prof) => (
              <Link key={prof.id} href={`/profesionales/${prof.id}`}>
                <Card className="h-full p-6 hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer border border-white/10 hover:border-[#C9A24D]/40 bg-gradient-to-br from-white/5 to-white/0">
                  <div className="flex items-start gap-4">
                    <div className="relative h-16 w-16 rounded-xl overflow-hidden border-2 border-white/20 bg-white/5 shrink-0">
                      <Image
                        src={prof.avatar || "/avatars/icono_abogado_avatar.jpeg"}
                        alt={prof.nombre}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="min-w-0">
                          <h3 className="font-bold text-white text-base truncate">{prof.nombre}</h3>
                          <p className="text-sm text-white/70 truncate">{prof.titulo}</p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <span className="text-yellow-400 text-sm">⭐</span>
                          <span className="text-sm font-semibold text-white">{prof.rating.toFixed(1)}</span>
                        </div>
                      </div>
                      <p className="text-xs text-white/60 mb-2 line-clamp-2">{prof.descripcion || `${prof.especialidad} • ${prof.ciudad}`}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#C9A24D] font-semibold">{prof.precio}</span>
                        <span className="text-xs text-white/50">{prof.experiencia} años exp.</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {/* Link a ver todos */}
          <div className="text-center">
            <Link href="/profesionales">
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                Ver todos los profesionales
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 6 categorías fijas de profesionales */}
      <section className="py-12 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Categorías de Servicios</h2>
            <p className="text-white/70">Seis categorías. Encontrá el servicio que necesitás.</p>
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

      {/* Gráficas actividad (anonimizadas, demo-safe) - MEJORADAS */}
      <section className="py-16 px-4 border-t border-white/10 bg-gradient-to-b from-transparent to-[#0E1B2A]/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Actividad de la plataforma
            </h2>
            <p className="text-white/70 text-base mb-2 max-w-2xl mx-auto">
              Datos anonimizados y demo-safe. La plataforma está viva y activa.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-green-300 font-medium">En tiempo real</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {ACTIVITY_CHART.map((item, index) => (
              <Card 
                key={item.label} 
                className="p-8 border border-white/10 hover:border-[#C9A24D]/40 hover:shadow-xl transition-all bg-gradient-to-br from-white/5 to-white/0"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-white/70 text-sm font-medium">{item.label}</p>
                    <div className={`w-4 h-16 rounded-full ${item.color} opacity-90 shadow-lg`} />
                  </div>
                  <div>
                    <p className="text-4xl font-extrabold text-white mb-1">{item.value}</p>
                    <p className="text-xs text-white/50">
                      {index === 0 && "Casos activos ahora"}
                      {index === 1 && "Matchings esta semana"}
                      {index === 2 && "Profesionales verificados"}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Gráfica de matching visual */}
          <Card className="p-6 border border-white/10 bg-gradient-to-br from-[#C9A24D]/10 to-transparent">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Tasa de Matching</h3>
                <span className="text-2xl font-extrabold text-[#C9A24D]">94%</span>
              </div>
              <div className="relative h-3 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#C9A24D] to-[#C08457] rounded-full"
                  style={{ width: "94%" }}
                />
              </div>
              <p className="text-xs text-white/60">
                Casos resueltos exitosamente con profesionales verificados
              </p>
            </div>
          </Card>
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
