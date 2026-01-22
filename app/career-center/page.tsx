"use client";

import { useState, useEffect } from "react";
import { getSession } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import { TalentProfile, AcademicDistinction, StudentActivityScore } from "@/lib/edu-types";

export default function CareerCenterPage() {
  const router = useRouter();
  const [session, setSession] = useState<ReturnType<typeof getSession>>(null);
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState<"all" | "top_talent" | "international">("all");
  const [languageFilter, setLanguageFilter] = useState<string>("all");

  // Mock data - En producción vendría de una API
  const [talentProfiles, setTalentProfiles] = useState<TalentProfile[]>([
    {
      studentId: "s1",
      institutionId: "inst1",
      isTopTalent: true,
      activityScore: {
        studentId: "s1",
        totalScore: 95,
        components: {
          internshipHours: 180,
          caseLogs: 45,
          validatedTasks: 38,
          platformActivity: 120,
        },
        lastUpdated: new Date().toISOString(),
      },
      distinctions: [
        {
          id: "d1",
          studentId: "s1",
          institutionId: "inst1",
          distinctionType: "honor",
          title: "Summa Cum Laude",
          awardedDate: "2024-12-01",
          validated: true,
        },
      ],
      languages: ["es", "en", "pt"],
      availableForInternational: true,
      preferredLocations: ["España", "Estados Unidos"],
      lastUpdated: new Date().toISOString(),
    },
    {
      studentId: "s2",
      institutionId: "inst1",
      isTopTalent: true,
      activityScore: {
        studentId: "s2",
        totalScore: 92,
        components: {
          internshipHours: 175,
          caseLogs: 42,
          validatedTasks: 35,
          platformActivity: 115,
        },
        lastUpdated: new Date().toISOString(),
      },
      distinctions: [
        {
          id: "d2",
          studentId: "s2",
          institutionId: "inst1",
          distinctionType: "merit",
          title: "Mejor Promedio",
          awardedDate: "2024-11-15",
          validated: true,
        },
      ],
      languages: ["es", "en"],
      availableForInternational: false,
      lastUpdated: new Date().toISOString(),
    },
    {
      studentId: "s3",
      institutionId: "inst1",
      isTopTalent: false,
      activityScore: {
        studentId: "s3",
        totalScore: 88,
        components: {
          internshipHours: 160,
          caseLogs: 38,
          validatedTasks: 30,
          platformActivity: 100,
        },
        lastUpdated: new Date().toISOString(),
      },
      distinctions: [],
      languages: ["es"],
      availableForInternational: false,
      lastUpdated: new Date().toISOString(),
    },
  ]);

  const [studentNames] = useState<Record<string, string>>({
    s1: "María González",
    s2: "Juan Pérez",
    s3: "Ana Martínez",
  });

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const currentSession = getSession();
      setSession(currentSession);
    }
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0E1B2A] via-[#13253A] to-[#0E1B2A] py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="h-96 bg-white/5 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  const isGEP = session?.user.kycTier === 3 || localStorage.getItem("legal-py-demo-plan") === "gep";
  const filteredProfiles = talentProfiles.filter((profile) => {
    if (filter === "top_talent" && !profile.isTopTalent) return false;
    if (filter === "international" && !profile.availableForInternational) return false;
    if (languageFilter !== "all" && !profile.languages.includes(languageFilter)) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E1B2A] via-[#13253A] to-[#0E1B2A] py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3">
            💼 Centro de Carreras - Meritocracia Algorítmica
          </h1>
          <p className="text-lg text-white/70">
            Descubre el talento jurídico más destacado. Los perfiles Top Talent son visibles primero para socios GEP.
          </p>
        </div>

        {/* Filtros */}
        <Card className="p-6 bg-white/5 border-white/10">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-white/80 mb-2">Filtro de Talento</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as typeof filter)}
                className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos</option>
                <option value="top_talent">🌟 Top Talent</option>
                <option value="international">🌍 Disponible Internacional</option>
              </select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-white/80 mb-2">Idioma</label>
              <select
                value={languageFilter}
                onChange={(e) => setLanguageFilter(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos</option>
                <option value="es">Español</option>
                <option value="en">Inglés</option>
                <option value="pt">Portugués</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Info para GEP */}
        {isGEP && (
          <Card className="p-6 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30">
            <div className="flex items-center gap-3">
              <span className="text-3xl">👑</span>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Acceso Exclusivo GEP</h3>
                <p className="text-sm text-white/80">
                  Como socio GEP, tienes acceso prioritario a los perfiles Top Talent antes que otros bufetes.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Grid de Talentos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfiles.map((profile) => {
            const studentName = studentNames[profile.studentId] || "Estudiante";
            const isVisible = profile.isTopTalent ? isGEP : true; // Top Talent solo visible para GEP

            if (!isVisible) {
              return (
                <Card key={profile.studentId} className="p-6 bg-white/5 border-white/10 opacity-50 blur-sm relative">
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="text-center">
                      <span className="text-4xl mb-2 block">🔒</span>
                      <p className="text-white font-bold">Solo Socios GEP</p>
                    </div>
                  </div>
                  <div className="opacity-30">
                    <div className="h-32 bg-white/10 rounded-lg mb-4" />
                    <div className="h-4 bg-white/10 rounded mb-2" />
                    <div className="h-4 bg-white/10 rounded w-2/3" />
                  </div>
                </Card>
              );
            }

            return (
              <Card key={profile.studentId} className="p-6 bg-white/5 border-white/10 hover:border-blue-400/30 transition">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white text-2xl font-bold">
                      {studentName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{studentName}</h3>
                      {profile.isTopTalent && (
                        <Badge variant="accent" className="text-xs mt-1">
                          🌟 Top Talent
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Score */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white/80">Puntaje de Actividad</span>
                    <span className="text-lg font-bold text-white">{profile.activityScore.totalScore}</span>
                  </div>
                  <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                      style={{ width: `${profile.activityScore.totalScore}%` }}
                    />
                  </div>
                </div>

                {/* Distinciones */}
                {profile.distinctions.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-white/60 mb-2">Distinciones Académicas</p>
                    <div className="flex flex-wrap gap-2">
                      {profile.distinctions.map((dist) => (
                        <Badge key={dist.id} variant="outline" className="text-xs">
                          🏆 {dist.title}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Idiomas */}
                <div className="mb-4">
                  <p className="text-xs text-white/60 mb-2">Idiomas</p>
                  <div className="flex gap-2">
                    {profile.languages.map((lang) => (
                      <Badge key={lang} variant="outline" className="text-xs">
                        {lang === "es" ? "🇪🇸" : lang === "en" ? "🇺🇸" : lang === "pt" ? "🇵🇹" : lang}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4 pt-4 border-t border-white/10">
                  <div>
                    <p className="text-xs text-white/60">Horas</p>
                    <p className="text-lg font-bold text-white">{profile.activityScore.components.internshipHours}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/60">Bitácoras</p>
                    <p className="text-lg font-bold text-white">{profile.activityScore.components.caseLogs}</p>
                  </div>
                </div>

                {/* CTA */}
                <div className="space-y-2">
                  <Button variant="primary" className="w-full rounded-xl py-2 text-sm">
                    Ver Perfil Completo
                  </Button>
                  {profile.availableForInternational && (
                    <Button
                      variant="outline"
                      className="w-full rounded-xl py-2 text-sm"
                      onClick={() => alert("Funcionalidad de postulación internacional próximamente")}
                    >
                      🌍 Postular a Pasantía Internacional
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {/* CTA para estudiantes */}
        {session?.user.role === "estudiante" && (
          <Card className="p-8 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 text-center">
            <h3 className="text-2xl font-bold text-white mb-3">¿Quieres aparecer aquí?</h3>
            <p className="text-white/80 mb-6">
              Completa tus pasantías, mantén un alto puntaje de actividad y obtén distinciones académicas para
              aparecer como Top Talent.
            </p>
            <Button variant="primary" onClick={() => router.push("/panel")} className="rounded-xl">
              Ir a Mi Panel
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
