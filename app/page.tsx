"use client";

import Link from "next/link";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Image from "next/image";
import { mockCategorias, mockProfesionales } from "@/lib/mock-data";
import { Search } from "lucide-react";

const SIX_CATEGORIES = mockCategorias.slice(0, 6);

// TODOS los profesionales (no solo destacados)
const ALL_PROFESSIONALS = mockProfesionales
  .filter((p) => p.categoria === "Abogados")
  .sort((a, b) => b.rating - a.rating);

const ACTIVITY_CHART = [
  { label: "Casos abiertos", value: 127, color: "bg-[#C9A24D]" },
  { label: "Matchings esta semana", value: 43, color: "bg-blue-500" },
  { label: "Profesionales activos", value: 89, color: "bg-emerald-500" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E1B2A] via-[#13253A] to-[#0E1B2A]">
      {/* Hero con Búsqueda */}
      <section className="relative min-h-[70vh] flex items-center justify-center px-4 py-16 overflow-hidden">
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
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 leading-tight">
            Encontrá el profesional legal que{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A24D] to-[#C08457]">
              necesitás
            </span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Encontrá profesionales verificados, gestores y ujieres. Publicá tu caso, subí documentos, recibí notificaciones y hacé seguimiento en un solo lugar.
          </p>
          
          {/* Barra de búsqueda */}
          <div className="max-w-2xl mx-auto mb-6">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-2">
              <div className="flex items-center gap-2 px-4 text-white/60">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="¿Qué servicio legal necesitás?"
                className="flex-1 bg-transparent text-white placeholder-white/50 outline-none text-lg"
                onFocus={(e) => {
                  e.target.closest('div')?.classList.add('ring-2', 'ring-[#C9A24D]/50');
                }}
                onBlur={(e) => {
                  e.target.closest('div')?.classList.remove('ring-2', 'ring-[#C9A24D]/50');
                }}
              />
              <Link href="/profesionales">
                <Button variant="primary" className="px-6 py-3 rounded-xl font-semibold">
                  Buscar
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
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

      {/* Servicios principales - CON ICONOS DORADOS Y BORDES (PRIMERO) */}
      <section className="py-16 px-4 border-t border-white/10 bg-gradient-to-b from-transparent to-[#13253A]/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Servicios principales</h2>
            <p className="text-white/70 text-lg">Seis categorías. Encontrá el servicio que necesitás.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {SIX_CATEGORIES.map((c) => (
              <Link key={c.id} href={c.href || "/profesionales"}>
                <Card className="h-full p-6 hover:shadow-2xl hover:scale-[1.05] transition-all cursor-pointer border-2 border-[#C9A24D]/40 hover:border-[#C9A24D]/70 text-center bg-gradient-to-br from-white/5 to-white/0 relative overflow-hidden group">
                  {/* Borde dorado animado */}
                  <div className="absolute inset-0 border-2 border-[#C9A24D]/30 rounded-xl group-hover:border-[#C9A24D]/60 transition-all" />
                  
                  {c.icono && (
                    <div className="relative w-20 h-20 mx-auto mb-4">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#C9A24D]/20 to-transparent rounded-xl blur-sm group-hover:blur-md transition-all" />
                      <div className="relative w-full h-full border-2 border-[#C9A24D]/50 rounded-xl p-2 bg-white/5 group-hover:border-[#C9A24D] group-hover:bg-[#C9A24D]/10 transition-all">
                        <Image 
                          src={c.icono} 
                          alt={c.titulo} 
                          fill 
                          className="object-contain p-1" 
                          sizes="80px" 
                        />
                      </div>
                    </div>
                  )}
                  <h3 className="font-bold text-white text-base mb-2">{c.titulo}</h3>
                  <p className="text-white/70 text-xs leading-relaxed">{c.descripcion}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Casos internacionales - CON PRIORIDAD (SEGUNDO) */}
      <section className="py-16 px-4 border-t border-white/10 bg-gradient-to-br from-[#C9A24D]/10 via-[#13253A] to-[#C9A24D]/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#C9A24D]/5 to-transparent opacity-50" />
        <div className="relative max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C9A24D] to-[#C08457] flex items-center justify-center">
                  <span className="text-2xl">🌍</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white">Casos Internacionales</h2>
              </div>
              <p className="text-white/80 text-lg max-w-2xl">
                Derivación priorizada, matching con profesionales GEP y seguimiento de hitos. Casos high-ticket con monto mínimo de USD 5,000.
              </p>
            </div>
            <Link href="/casos-internacionales">
              <Button 
                variant="primary" 
                className="px-8 py-4 text-lg font-semibold rounded-xl bg-gradient-to-r from-[#C9A24D] to-[#C08457] hover:from-[#C08457] hover:to-[#C9A24D] shadow-xl hover:shadow-2xl transition-all"
              >
                Ver Casos Internacionales →
              </Button>
            </Link>
          </div>
          
          {/* Preview de casos internacionales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-5 border border-[#C9A24D]/30 bg-white/5 hover:bg-white/10 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-[#C9A24D]/20 flex items-center justify-center">
                  <span className="text-lg">💼</span>
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Casos Corporativos</h3>
                  <p className="text-xs text-white/60">High-ticket</p>
                </div>
              </div>
              <p className="text-xs text-white/70">Reestructuración societaria y blindaje patrimonial</p>
            </Card>
            <Card className="p-5 border border-[#C9A24D]/30 bg-white/5 hover:bg-white/10 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-[#C9A24D]/20 flex items-center justify-center">
                  <span className="text-lg">⚖️</span>
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Derivación DPT</h3>
                  <p className="text-xs text-white/60">Priorizada</p>
                </div>
              </div>
              <p className="text-xs text-white/70">Matching con profesionales GEP verificados</p>
            </Card>
            <Card className="p-5 border border-[#C9A24D]/30 bg-white/5 hover:bg-white/10 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-[#C9A24D]/20 flex items-center justify-center">
                  <span className="text-lg">📊</span>
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Seguimiento</h3>
                  <p className="text-xs text-white/60">En tiempo real</p>
                </div>
              </div>
              <p className="text-xs text-white/70">Hitos, alertas y documentos centralizados</p>
            </Card>
          </div>
        </div>
      </section>

      {/* TODOS los Profesionales - CON FOTO Y BOTÓN (TERCERO) */}
      <section className="py-16 px-4 border-t border-white/10 bg-gradient-to-b from-transparent to-[#13253A]/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Profesionales</h2>
              <p className="text-white/70 text-lg">
                Abogados verificados. Encontrá al experto para tu caso.
              </p>
            </div>
            <Link href="/profesionales">
              <span className="text-[#C9A24D] hover:text-[#C08457] font-semibold text-sm">
                Ver todos →
              </span>
            </Link>
          </div>
          
          {/* Grid de TODOS los profesionales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ALL_PROFESSIONALS.map((prof) => (
              <Card 
                key={prof.id} 
                className="h-full p-6 hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer border border-white/10 hover:border-[#C9A24D]/40 bg-gradient-to-br from-white/5 to-white/0"
              >
                <Link href={`/profesionales/${prof.id}`} className="block">
                  <div className="flex items-start gap-4 mb-4">
                    {/* Foto del profesional */}
                    <div className="relative h-20 w-20 rounded-xl overflow-hidden border-2 border-white/20 bg-white/5 shrink-0">
                      <Image
                        src={prof.avatar || "/avatars/icono_abogado_avatar.jpeg"}
                        alt={prof.nombre}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="min-w-0">
                          <h3 className="font-bold text-white text-lg truncate">{prof.nombre}</h3>
                          <p className="text-sm text-white/70 truncate">{prof.titulo}</p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <span className="text-yellow-400 text-sm">⭐</span>
                          <span className="text-sm font-semibold text-white">{prof.rating.toFixed(1)}</span>
                        </div>
                      </div>
                      <p className="text-xs text-white/60 mb-2 line-clamp-2">{prof.descripcion || `${prof.especialidad} • ${prof.ciudad}`}</p>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-[#C9A24D] font-semibold">{prof.precio}</span>
                        <span className="text-xs text-white/50">{prof.ciudad}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Botón Ver Perfil */}
                  <Button 
                    variant="primary" 
                    className="w-full rounded-xl py-2.5 font-semibold bg-[#C9A24D] hover:bg-[#C08457] text-black"
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.href = `/profesionales/${prof.id}`;
                    }}
                  >
                    Ver Perfil →
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Accesos rápidos - Courier Legal, Consulta Rápida, Publicar Caso */}
      <section className="py-16 px-4 border-t border-white/10 bg-gradient-to-b from-transparent to-[#0E1B2A]/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Accesos rápidos</h2>
            <p className="text-white/70 text-lg">Servicios disponibles ahora</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Consulta Rápida */}
            <Link href="/chat">
              <Card className="h-full p-8 hover:shadow-2xl hover:scale-[1.03] transition-all cursor-pointer border-2 border-white/10 hover:border-blue-400/50 bg-gradient-to-br from-blue-500/10 to-purple-500/10 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-500/20 flex items-center justify-center border border-blue-400/30">
                  <svg className="w-8 h-8 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Consulta Rápida</h3>
                <p className="text-white/70 text-sm mb-6">Chat con un Abogado Ahora</p>
                <Button variant="outline" className="w-full border-white/30 text-white hover:bg-white/10">
                  Iniciar Chat →
                </Button>
              </Card>
            </Link>

            {/* Servicio de Courier Legal */}
            <Link href="/courier-legal">
              <Card className="h-full p-8 hover:shadow-2xl hover:scale-[1.03] transition-all cursor-pointer border-2 border-white/10 hover:border-[#C9A24D]/50 bg-gradient-to-br from-[#C9A24D]/10 to-[#C08457]/10 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#C9A24D]/20 flex items-center justify-center border border-[#C9A24D]/30">
                  <svg className="w-8 h-8 text-[#C9A24D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Servicio de Courier Legal</h3>
                <p className="text-white/70 text-sm mb-6">Envío o Legalización de Documentos</p>
                <Button variant="primary" className="w-full bg-[#C9A24D] hover:bg-[#C08457] text-black font-semibold">
                  Solicitar Servicio →
                </Button>
              </Card>
            </Link>

            {/* Publicar Caso - Motor DPT */}
            <Link href="/post-case">
              <Card className="h-full p-8 hover:shadow-2xl hover:scale-[1.03] transition-all cursor-pointer border-2 border-white/10 hover:border-green-400/50 bg-gradient-to-br from-green-500/10 to-emerald-500/10 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-green-500/20 flex items-center justify-center border border-green-400/30">
                  <svg className="w-8 h-8 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Publicar Caso</h3>
                <p className="text-white/70 text-sm mb-6">Derivación Priorizada por Perfil Técnico (DPT)</p>
                <Button variant="outline" className="w-full border-white/30 text-white hover:bg-white/10">
                  Publicar Caso →
                </Button>
              </Card>
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
