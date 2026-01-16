"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Image from "next/image";
import { mockProfesionales } from "@/lib/mock-data";

export default function ReservarCita() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const profesional = mockProfesionales.find((p) => p.id === id);

  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [motivo, setMotivo] = useState("");
  const [loading, setLoading] = useState(false);

  if (!profesional) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <div className="text-center py-8">
            <p className="text-white/70">Profesional no encontrado</p>
            <Button
              variant="primary"
              className="mt-4"
              onClick={() => router.push("/profesionales")}
            >
              Volver a Profesionales
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const handleReservar = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simular reserva
    setTimeout(() => {
      setLoading(false);
      alert(
        `¡Cita reservada exitosamente!\n\nProfesional: ${profesional.nombre}\nFecha: ${fecha}\nHora: ${hora}\nMotivo: ${motivo}\n\nEsta es una demo ficticia.`
      );
      router.push(`/profesionales/${id}`);
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          ← Volver
        </Button>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white">
          Reservar Cita
        </h1>
      </div>

      {/* Profesional Info */}
      <Card>
        <div className="flex items-center gap-4">
          {profesional.avatar ? (
            <div className="relative h-16 w-16 rounded-full overflow-hidden">
              <Image
                src={profesional.avatar}
                alt={profesional.nombre}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
          ) : (
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#C9A24D] to-[#C08457] flex items-center justify-center text-white font-bold">
              {profesional.nombre
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </div>
          )}
          <div>
            <h2 className="text-lg font-bold text-white">{profesional.nombre}</h2>
            <p className="text-sm text-white/70">{profesional.titulo}</p>
            <p className="text-sm text-[#C9A24D] mt-1">{profesional.precio}</p>
          </div>
        </div>
      </Card>

      {/* Form */}
      <Card>
        <form onSubmit={handleReservar} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Fecha *
            </label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              required
              className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Hora *
            </label>
            <select
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
            >
              <option value="">Selecciona una hora</option>
              <option value="09:00">09:00</option>
              <option value="10:00">10:00</option>
              <option value="11:00">11:00</option>
              <option value="14:00">14:00</option>
              <option value="15:00">15:00</option>
              <option value="16:00">16:00</option>
              <option value="17:00">17:00</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Motivo de la Consulta *
            </label>
            <textarea
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              required
              rows={4}
              className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
              placeholder="Describe brevemente el motivo de tu consulta..."
            />
          </div>

          <div className="bg-[#C9A24D]/10 border border-[#C9A24D]/30 rounded-lg p-4">
            <p className="text-sm text-white/80">
              <strong>Nota:</strong> Esta es una reserva ficticia de demostración. No se realizará
              ninguna cita real.
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => router.back()}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="primary" className="flex-1" disabled={loading}>
              {loading ? "Reservando..." : "Confirmar Reserva"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
