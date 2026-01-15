"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { mockPlanes, mockMetodosPago, mockProfesionalesRecienInscritos } from "@/lib/mock-data";

export default function PanelProfesional() {
  const router = useRouter();
  const [account, setAccount] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem("mockProfessionalAccount");
    if (saved) {
      setAccount(JSON.parse(saved));
    } else {
      router.push("/profesional/alta");
    }
  }, [router]);

  if (!account) {
    return (
      <div className="text-center py-12">
        <p className="text-white/70">Cargando...</p>
      </div>
    );
  }

  const plan = mockPlanes.find((p) => p.id === account.planId);
  const metodoPago = mockMetodosPago.find((m) => m.id === account.metodoPagoId);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">
            Panel Profesional
          </h1>
          <p className="text-white/70 mt-1">Bienvenido, {account.email}</p>
        </div>
        <Button variant="outline" onClick={() => router.push("/")}>
          Ir al Inicio
        </Button>
      </div>

      {/* Success Message */}
      <Card className="bg-gradient-to-r from-[#C9A24D]/20 to-[#C08457]/20 border-[#C9A24D]">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#C9A24D] flex items-center justify-center">
            <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-white">¡Suscripción activa!</h3>
            <p className="text-white/80 text-sm">
              Tu cuenta ha sido creada exitosamente. Estamos revisando tus credenciales.
            </p>
          </div>
        </div>
      </Card>

      {/* Account Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-xl font-bold text-white mb-4">Información de Cuenta</h2>
          <div className="space-y-3">
            <div>
              <span className="text-sm text-white/60">Email:</span>
              <p className="text-white font-medium">{account.email}</p>
            </div>
            <div>
              <span className="text-sm text-white/60">Tipo:</span>
              <p className="text-white font-medium">{account.tipo}</p>
            </div>
            <div>
              <span className="text-sm text-white/60">Ciudad:</span>
              <p className="text-white font-medium">{account.ciudad}</p>
            </div>
            <div>
              <span className="text-sm text-white/60">Estado:</span>
              <span className="ml-2 px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-semibold">
                {account.estado}
              </span>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-bold text-white mb-4">Plan Actual</h2>
          {plan && (
            <div className="space-y-3">
              <div>
                <span className="text-sm text-white/60">Plan:</span>
                <p className="text-white font-medium">{plan.nombre}</p>
              </div>
              <div>
                <span className="text-sm text-white/60">Precio:</span>
                <p className="text-white font-medium">
                  {plan.precio.toLocaleString()} {plan.moneda} / {plan.periodo}
                </p>
              </div>
              <div>
                <span className="text-sm text-white/60">Método de pago:</span>
                <p className="text-white font-medium">
                  {metodoPago?.nombre || "No seleccionado"}
                </p>
              </div>
              <Button variant="outline" size="sm" className="mt-4">
                Cambiar Plan
              </Button>
            </div>
          )}
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <h2 className="text-xl font-bold text-white mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition text-left">
            <div className="text-2xl mb-2">📋</div>
            <h3 className="font-semibold text-white mb-1">Gestionar Casos</h3>
            <p className="text-sm text-white/60">Ver y administrar tus casos</p>
          </button>
          <button className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition text-left">
            <div className="text-2xl mb-2">⚙️</div>
            <h3 className="font-semibold text-white mb-1">Editar Perfil</h3>
            <p className="text-sm text-white/60">Actualizar tu información</p>
          </button>
          <button className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition text-left">
            <div className="text-2xl mb-2">📊</div>
            <h3 className="font-semibold text-white mb-1">Estadísticas</h3>
            <p className="text-sm text-white/60">Ver tu rendimiento</p>
          </button>
        </div>
      </Card>

      {/* Demo: Otros profesionales recién inscritos */}
      <Card>
        <h2 className="text-xl font-bold text-white mb-4">Profesionales Recién Inscritos (Demo)</h2>
        <div className="space-y-2">
          {mockProfesionalesRecienInscritos.map((prof) => (
            <div
              key={prof.id}
              className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between"
            >
              <div>
                <p className="font-medium text-white">{prof.nombre}</p>
                <p className="text-sm text-white/60">{prof.tipo} • {prof.ciudad}</p>
              </div>
              <span className="text-xs text-white/60">{prof.fechaAlta}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
