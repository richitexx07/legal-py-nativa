"use client";

import { useState } from "react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { useI18n } from "@/components/I18nProvider";
import Link from "next/link";

export default function NuevoCaso() {
  const { t } = useI18n();
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    tipo: "",
    urgencia: "normal",
    profesionalId: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo: solo mostrar mensaje
    alert("Caso publicado (demo). En producción, esto se guardaría en la base de datos.");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white">{t.nav.publicarCaso}</h1>
        <p className="mt-2 text-white/70">
          Publica tu caso y recibe ofertas de profesionales verificados.
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Título del caso
            </label>
            <input
              type="text"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              required
              className="w-full rounded-xl bg-white/10 px-4 py-3 outline-none ring-1 ring-white/10 focus:ring-[#C9A24D]/60 text-white placeholder-white/50"
              placeholder="Ej: Demanda laboral por despido injustificado"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Descripción
            </label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              required
              rows={6}
              className="w-full rounded-xl bg-white/10 px-4 py-3 outline-none ring-1 ring-white/10 focus:ring-[#C9A24D]/60 text-white placeholder-white/50 resize-none"
              placeholder="Describe tu caso en detalle..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Tipo de caso
              </label>
              <select
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                required
                className="w-full rounded-xl bg-white/10 px-4 py-3 outline-none ring-1 ring-white/10 focus:ring-[#C9A24D]/60 text-white"
              >
                <option value="" className="bg-[#13253A]">Seleccionar...</option>
                <option value="penal" className="bg-[#13253A]">Penal</option>
                <option value="civil" className="bg-[#13253A]">Civil</option>
                <option value="laboral" className="bg-[#13253A]">Laboral</option>
                <option value="comercial" className="bg-[#13253A]">Comercial</option>
                <option value="familia" className="bg-[#13253A]">Familia</option>
                <option value="otro" className="bg-[#13253A]">Otro</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Urgencia
              </label>
              <select
                value={formData.urgencia}
                onChange={(e) => setFormData({ ...formData, urgencia: e.target.value })}
                className="w-full rounded-xl bg-white/10 px-4 py-3 outline-none ring-1 ring-white/10 focus:ring-[#C9A24D]/60 text-white"
              >
                <option value="baja" className="bg-[#13253A]">Baja</option>
                <option value="normal" className="bg-[#13253A]">Normal</option>
                <option value="alta" className="bg-[#13253A]">Alta</option>
                <option value="urgente" className="bg-[#13253A]">Urgente</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Profesional preferido (opcional)
            </label>
            <select
              value={formData.profesionalId}
              onChange={(e) => setFormData({ ...formData, profesionalId: e.target.value })}
              className="w-full rounded-xl bg-white/10 px-4 py-3 outline-none ring-1 ring-white/10 focus:ring-[#C9A24D]/60 text-white"
            >
              <option value="" className="bg-[#13253A]">Cualquier profesional</option>
              <option value="1" className="bg-[#13253A]">Dr. Mario Gómez</option>
              <option value="2" className="bg-[#13253A]">Dra. Sofía Ramírez</option>
              <option value="3" className="bg-[#13253A]">Dr. Juan López</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" variant="primary" size="lg" className="flex-1">
              Publicar Caso
            </Button>
            <Link href="/casos">
              <Button type="button" variant="ghost" size="lg">
                Cancelar
              </Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
