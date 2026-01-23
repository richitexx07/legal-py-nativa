"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import { mockPasantias } from "@/lib/educacion-data";
import BitacoraBiometrica from "@/components/EdTech/BitacoraBiometrica";
import CheckInJuzgado from "@/components/EdTech/CheckInJuzgado";
import BilleteraAcademica from "@/components/EdTech/BilleteraAcademica";
import { getSession } from "@/lib/auth";
import { GraduationCap, MapPin, Clock, Users, Award } from "lucide-react";

function PasantiaDetalleContent() {
  const params = useParams();
  const router = useRouter();
  const pasantiaId = params.id as string;
  const pasantia = mockPasantias.find((p) => p.id === pasantiaId);
  const session = getSession();

  const [activeTab, setActiveTab] = useState<"info" | "bitacora" | "checkin" | "billetera">("info");

  useEffect(() => {
    if (!pasantia) {
      router.push("/pasantias");
    }
  }, [pasantia, router]);

  if (!pasantia) {
    return null;
  }

  const tabs = [
    { id: "info", label: "Información", icon: "📋" },
    { id: "bitacora", label: "Bitácora Biométrica", icon: "📝" },
    { id: "checkin", label: "Check-in Juzgados", icon: "📍" },
    { id: "billetera", label: "Billetera Académica", icon: "🎓" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <Link href="/pasantias" className="text-[#C9A24D] hover:underline text-sm mb-4 inline-block">
          ← Volver a pasantías
        </Link>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">{pasantia.titulo}</h1>
        <p className="text-white/70">{pasantia.descripcion}</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-3 font-medium transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "text-white border-b-2 border-[#C9A24D]"
                : "text-white/60 hover:text-white/80"
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "info" && (
        <div className="space-y-6">
          <Card>
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#C9A24D]/20 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-[#C9A24D]" />
                </div>
                <div>
                  <h3 className="font-bold text-white">{pasantia.titulo}</h3>
                  <p className="text-sm text-white/70">{pasantia.area}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-white/60 mb-1">⏱️ Duración</p>
                  <p className="text-sm text-white">{pasantia.duracion}</p>
                </div>
                <div>
                  <p className="text-xs text-white/60 mb-1">🕐 Horario</p>
                  <p className="text-sm text-white">{pasantia.horario}</p>
                </div>
                <div>
                  <p className="text-xs text-white/60 mb-1">💼 Modalidad</p>
                  <p className="text-sm text-white">{pasantia.modalidad}</p>
                </div>
                <div>
                  <p className="text-xs text-white/60 mb-1">👥 Cupos</p>
                  <p className="text-sm text-white">
                    {pasantia.cuposDisponibles} de {pasantia.cupos} disponibles
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <h4 className="font-semibold text-white mb-2">Requisitos</h4>
                <ul className="space-y-1">
                  {pasantia.requisitos.map((req, idx) => (
                    <li key={idx} className="text-sm text-white/80 flex items-start gap-2">
                      <span className="text-[#C9A24D] mt-1">•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-white/10">
                <h4 className="font-semibold text-white mb-2">Responsabilidades</h4>
                <ul className="space-y-1">
                  {pasantia.responsabilidades.map((resp, idx) => (
                    <li key={idx} className="text-sm text-white/80 flex items-start gap-2">
                      <span className="text-[#C9A24D] mt-1">✓</span>
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-white/10">
                <h4 className="font-semibold text-white mb-2">Beneficios</h4>
                <ul className="space-y-1">
                  {pasantia.beneficios.map((ben, idx) => (
                    <li key={idx} className="text-sm text-white/80 flex items-start gap-2">
                      <span className="text-green-400 mt-1">★</span>
                      <span>{ben}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === "bitacora" && (
        <div>
          {session?.user?.role === "estudiante" ? (
            <BitacoraBiometrica pasantiaId={pasantiaId} />
          ) : (
            <Card className="text-center py-12">
              <p className="text-white/70">Debes ser estudiante para acceder a la bitácora biométrica.</p>
            </Card>
          )}
        </div>
      )}

      {activeTab === "checkin" && (
        <div>
          {session?.user?.role === "estudiante" ? (
            <CheckInJuzgado />
          ) : (
            <Card className="text-center py-12">
              <p className="text-white/70">Debes ser estudiante para hacer check-in en juzgados.</p>
            </Card>
          )}
        </div>
      )}

      {activeTab === "billetera" && (
        <div>
          {session?.user?.role === "estudiante" ? (
            <BilleteraAcademica />
          ) : (
            <Card className="text-center py-12">
              <p className="text-white/70">Debes ser estudiante para acceder a tu billetera académica.</p>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

export default function PasantiaDetallePage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <Card>
            <div className="text-center py-8">
              <p className="text-white/70">Cargando...</p>
            </div>
          </Card>
        </div>
      }
    >
      <PasantiaDetalleContent />
    </Suspense>
  );
}
