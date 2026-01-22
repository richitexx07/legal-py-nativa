"use client";

import { useState, useEffect } from "react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Link from "next/link";

export default function AboutPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0E1B2A] via-[#13253A] to-[#0E1B2A] py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="h-96 bg-white/5 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E1B2A] via-[#13253A] to-[#0E1B2A] py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-white mb-4">Sobre Legal PY</h1>
          <p className="text-xl text-white/70">
            La Plataforma Nacional de Empleabilidad Jurídica
          </p>
        </div>

        {/* Misión */}
        <Card className="p-8 bg-white/5 border-white/10">
          <h2 className="text-3xl font-bold text-white mb-4">🎯 Nuestra Misión</h2>
          <p className="text-lg text-white/80 leading-relaxed mb-4">
            Legal PY no es solo una plataforma tecnológica. Somos el ecosistema que conecta estudiantes, universidades,
            profesionales y organizaciones internacionales para democratizar el acceso a la justicia y crear oportunidades
            de empleabilidad en el sector legal paraguayo.
          </p>
          <p className="text-lg text-white/80 leading-relaxed">
            A través de nuestro módulo educativo, validamos pasantías supervisadas digitalmente, conectamos talento
            con empleo mediante meritocracia algorítmica, y facilitamos la cooperación internacional para financiar
            justicia digital.
          </p>
        </Card>

        {/* Ecosistema */}
        <Card className="p-8 bg-white/5 border-white/10">
          <h2 className="text-3xl font-bold text-white mb-6">🌐 El Ecosistema Legal PY Edu</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white/5 rounded-xl border border-white/10">
              <div className="text-4xl mb-3">🎓</div>
              <h3 className="text-xl font-bold text-white mb-2">Para Universidades</h3>
              <p className="text-white/70">
                Dashboard completo con métricas de empleabilidad, gestor de convenios con Embajadas/ONGs, y visor de
                talento para identificar a los mejores estudiantes.
              </p>
            </div>
            <div className="p-6 bg-white/5 rounded-xl border border-white/10">
              <div className="text-4xl mb-3">👨‍🎓</div>
              <h3 className="text-xl font-bold text-white mb-2">Para Estudiantes</h3>
              <p className="text-white/70">
                Pasantía supervisada digital con check-in biométrico, bitácora de casos, y gamificación que te ayuda
                a completar tus horas requeridas.
              </p>
            </div>
            <div className="p-6 bg-white/5 rounded-xl border border-white/10">
              <div className="text-4xl mb-3">💼</div>
              <h3 className="text-xl font-bold text-white mb-2">Para Bufetes</h3>
              <p className="text-white/70">
                Acceso exclusivo a perfiles Top Talent antes que la competencia. Meritocracia algorítmica que identifica
                a los mejores candidatos basado en actividad real, no solo notas.
              </p>
            </div>
            <div className="p-6 bg-white/5 rounded-xl border border-white/10">
              <div className="text-4xl mb-3">🤝</div>
              <h3 className="text-xl font-bold text-white mb-2">Para ONGs y Embajadas</h3>
              <p className="text-white/70">
                Financia justicia digital patrocinando universidades. Conecta con talento paraguayo para programas de
                intercambio y pasantías internacionales.
              </p>
            </div>
          </div>
        </Card>

        {/* Sección de Sponsors */}
        <div id="sponsors" className="scroll-mt-24">
          <Card className="p-8 bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-400/30">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              💰 Financiamiento & Sponsors
            </h2>
            <p className="text-center text-white/80 mb-8 max-w-2xl mx-auto">
              ¿Quieres financiar justicia digital? Patrocina una Universidad y forma parte del ecosistema que está
              transformando la educación legal en Paraguay.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              {[
                { name: "USAID", icon: "🇺🇸", description: "Agencia de los Estados Unidos para el Desarrollo Internacional" },
                { name: "Unión Europea", icon: "🇪🇺", description: "Programas de cooperación y desarrollo" },
                { name: "BID", icon: "🌎", description: "Banco Interamericano de Desarrollo" },
                { name: "Embajada de EE.UU.", icon: "🏛️", description: "Programas de intercambio educativo" },
              ].map((sponsor, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center justify-center p-6 bg-white/5 rounded-xl border border-white/10 hover:border-[#C9A24D]/30 transition cursor-pointer group"
                >
                  <div className="text-5xl mb-3 opacity-60 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0">
                    {sponsor.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 text-center">{sponsor.name}</h3>
                  <p className="text-xs text-white/60 text-center">{sponsor.description}</p>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Button
                variant="primary"
                className="rounded-xl px-8 py-3 text-lg"
                onClick={() => {
                  window.location.href = "mailto:partnerships@legalpy.com?subject=Interés en Patrocinio";
                }}
              >
                📧 Contactar para Patrocinio
              </Button>
            </div>
          </Card>
        </div>

        {/* CTA Final */}
        <Card className="p-8 bg-gradient-to-r from-[#C9A24D]/20 to-[#C08457]/20 border border-[#C9A24D]/30 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            ¿Listo para ser parte del ecosistema?
          </h2>
          <p className="text-lg text-white/80 mb-6">
            Únete a Legal PY y transforma cómo se conecta el talento jurídico con las oportunidades.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/register?rol=estudiante">
              <Button variant="primary" className="rounded-xl px-6 py-3">
                🎓 Soy Estudiante
              </Button>
            </Link>
            <Link href="/register?rol=institucion">
              <Button variant="primary" className="rounded-xl px-6 py-3">
                🏫 Soy Universidad
              </Button>
            </Link>
            <Link href="/register?rol=profesional">
              <Button variant="primary" className="rounded-xl px-6 py-3">
                💼 Soy Profesional
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
