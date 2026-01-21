"use client";

import { useState } from "react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

export default function RegistroProfesional() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    especialidad: "",
    experiencia: "",
    ciudad: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo: solo mostrar mensaje
    alert("Registro enviado (demo). En producción, esto se enviaría al backend.");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white">Registro de Profesional</h1>
        <p className="mt-2 text-white/70">
          Completa el formulario para registrarte como profesional en Legal Py.
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Nombre completo
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              required
              className="w-full rounded-xl bg-white/10 px-4 py-3 outline-none ring-1 ring-white/10 focus:ring-[#C9A24D]/60 text-white placeholder-white/50"
              placeholder="Dr. Juan Pérez"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full rounded-xl bg-white/10 px-4 py-3 outline-none ring-1 ring-white/10 focus:ring-[#C9A24D]/60 text-white placeholder-white/50"
                placeholder="tu@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Teléfono
              </label>
              <input
                type="tel"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                required
                className="w-full rounded-xl bg-white/10 px-4 py-3 outline-none ring-1 ring-white/10 focus:ring-[#C9A24D]/60 text-white placeholder-white/50"
                placeholder="0981 123 456"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Especialidad
              </label>
              <select
                value={formData.especialidad}
                onChange={(e) => setFormData({ ...formData, especialidad: e.target.value })}
                required
                className="w-full rounded-xl bg-white/10 px-4 py-3 outline-none ring-1 ring-white/10 focus:ring-[#C9A24D]/60 text-white"
              >
                <option value="" className="bg-[#13253A]">Seleccionar...</option>
                <option value="penal" className="bg-[#13253A]">Penal</option>
                <option value="civil" className="bg-[#13253A]">Civil</option>
                <option value="laboral" className="bg-[#13253A]">Laboral</option>
                <option value="comercial" className="bg-[#13253A]">Comercial</option>
                <option value="notarial" className="bg-[#13253A]">Notarial</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Años de experiencia
              </label>
              <input
                type="number"
                value={formData.experiencia}
                onChange={(e) => setFormData({ ...formData, experiencia: e.target.value })}
                required
                min="0"
                className="w-full rounded-xl bg-white/10 px-4 py-3 outline-none ring-1 ring-white/10 focus:ring-[#C9A24D]/60 text-white placeholder-white/50"
                placeholder="5"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Ciudad
            </label>
            <input
              type="text"
              value={formData.ciudad}
              onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
              required
              className="w-full rounded-xl bg-white/10 px-4 py-3 outline-none ring-1 ring-white/10 focus:ring-[#C9A24D]/60 text-white placeholder-white/50"
              placeholder="Asunción"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" variant="primary" size="lg" className="flex-1">
              Enviar Registro
            </Button>
            <Link href="/profesionales">
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
