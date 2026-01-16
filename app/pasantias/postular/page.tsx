"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Card from "@/components/Card";
import Button from "@/components/Button";
import FormField from "@/components/FormField";
import Snackbar from "@/components/Snackbar";
import { mockPasantias, PostulacionPasantia } from "@/lib/educacion-data";

export default function PostularPasantiaPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pasantiaId = searchParams.get("pasantia");
  const pasantia = pasantiaId ? mockPasantias.find((p) => p.id === pasantiaId) : null;

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    universidad: "",
    carrera: "",
    semestre: "",
    disponibilidadHoraria: "",
    motivacion: "",
  });
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [snackbar, setSnackbar] = useState({ isOpen: false, message: "", type: "info" as const });

  useEffect(() => {
    if (!pasantia) {
      router.push("/pasantias");
    }
  }, [pasantia, router]);

  if (!pasantia) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validación
    const newErrors: Record<string, string> = {};
    if (!formData.nombre) newErrors.nombre = "El nombre es requerido";
    if (!formData.apellido) newErrors.apellido = "El apellido es requerido";
    if (!formData.email) {
      newErrors.email = "El email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }
    if (!formData.telefono) newErrors.telefono = "El teléfono es requerido";
    if (!formData.universidad) newErrors.universidad = "La universidad es requerida";
    if (!formData.carrera) newErrors.carrera = "La carrera es requerida";
    if (!formData.semestre) newErrors.semestre = "El semestre es requerido";
    if (!formData.disponibilidadHoraria) newErrors.disponibilidadHoraria = "La disponibilidad es requerida";
    if (!formData.motivacion) newErrors.motivacion = "La motivación es requerida";
    if (!cvFile) newErrors.cv = "Debes subir tu CV";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Generar número de solicitud
    const numeroSolicitud = `LPY-PAS-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 100000)).padStart(5, "0")}`;

    // Guardar en localStorage (simulado)
    const postulacion: PostulacionPasantia = {
      id: Date.now().toString(),
      numeroSolicitud,
      pasantiaId: pasantia.id,
      nombre: formData.nombre,
      apellido: formData.apellido,
      email: formData.email,
      telefono: formData.telefono,
      universidad: formData.universidad,
      carrera: formData.carrera,
      semestre: parseInt(formData.semestre),
      cv: cvFile.name,
      disponibilidadHoraria: formData.disponibilidadHoraria,
      motivacion: formData.motivacion,
      fechaPostulacion: new Date().toISOString(),
      estado: "Recibido",
    };

    const postulaciones = JSON.parse(localStorage.getItem("postulacionesPasantias") || "[]");
    postulaciones.push(postulacion);
    localStorage.setItem("postulacionesPasantias", JSON.stringify(postulaciones));

    // Simular envío de correo
    console.log("📧 Correo simulado enviado a:", formData.email);
    console.log("📧 Asunto: Confirmación de postulación - " + pasantia.titulo);
    console.log("📧 Contenido: Tu número de solicitud es: " + numeroSolicitud);

    setSnackbar({
      isOpen: true,
      message: `Postulación exitosa. Tu número de solicitud es: ${numeroSolicitud}`,
      type: "success",
    });

    // Limpiar formulario
    setFormData({
      nombre: "",
      apellido: "",
      email: "",
      telefono: "",
      universidad: "",
      carrera: "",
      semestre: "",
      disponibilidadHoraria: "",
      motivacion: "",
    });
    setCvFile(null);

    // Redirigir después de 2 segundos
    setTimeout(() => {
      router.push("/pasantias?postulacion=exito");
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <Link href="/pasantias" className="text-[#C9A24D] hover:underline text-sm mb-4 inline-block">
          ← Volver a pasantías
        </Link>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
          Postular a: {pasantia.titulo}
        </h1>
        <p className="text-white/70">{pasantia.descripcion}</p>
      </div>

      <Card>
        <h2 className="text-xl font-bold text-white mb-4">Formulario de Postulación</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Nombre" htmlFor="nombre" required error={errors.nombre}>
              <input
                id="nombre"
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-[#13253A] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
              />
            </FormField>

            <FormField label="Apellido" htmlFor="apellido" required error={errors.apellido}>
              <input
                id="apellido"
                type="text"
                value={formData.apellido}
                onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-[#13253A] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Email" htmlFor="email" required error={errors.email}>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-[#13253A] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
              />
            </FormField>

            <FormField label="Teléfono" htmlFor="telefono" required error={errors.telefono}>
              <input
                id="telefono"
                type="tel"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-[#13253A] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Universidad" htmlFor="universidad" required error={errors.universidad}>
              <input
                id="universidad"
                type="text"
                value={formData.universidad}
                onChange={(e) => setFormData({ ...formData, universidad: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-[#13253A] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
              />
            </FormField>

            <FormField label="Carrera" htmlFor="carrera" required error={errors.carrera}>
              <input
                id="carrera"
                type="text"
                value={formData.carrera}
                onChange={(e) => setFormData({ ...formData, carrera: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-[#13253A] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
              />
            </FormField>
          </div>

          <FormField label="Semestre/Año" htmlFor="semestre" required error={errors.semestre}>
            <input
              id="semestre"
              type="number"
              min="1"
              max="10"
              value={formData.semestre}
              onChange={(e) => setFormData({ ...formData, semestre: e.target.value })}
              className="w-full px-4 py-2 rounded-xl bg-[#13253A] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
              placeholder="Ej: 5"
            />
          </FormField>

          <FormField label="Disponibilidad Horaria" htmlFor="disponibilidad" required error={errors.disponibilidadHoraria}>
            <textarea
              id="disponibilidad"
              value={formData.disponibilidadHoraria}
              onChange={(e) => setFormData({ ...formData, disponibilidadHoraria: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 rounded-xl bg-[#13253A] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
              placeholder="Indica tus horarios disponibles (ej: Lunes a Viernes, 14:00 - 18:00)"
            />
          </FormField>

          <FormField label="CV (PDF)" htmlFor="cv" required error={errors.cv}>
            <input
              id="cv"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setCvFile(e.target.files?.[0] || null)}
              className="w-full px-4 py-2 rounded-xl bg-[#13253A] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#C9A24D] file:text-black hover:file:bg-[#b8943f]"
            />
            {cvFile && (
              <p className="text-xs text-white/60 mt-1">Archivo seleccionado: {cvFile.name}</p>
            )}
          </FormField>

          <FormField label="Motivación" htmlFor="motivacion" required error={errors.motivacion} hint="Explica por qué quieres realizar esta pasantía">
            <textarea
              id="motivacion"
              value={formData.motivacion}
              onChange={(e) => setFormData({ ...formData, motivacion: e.target.value })}
              rows={5}
              className="w-full px-4 py-2 rounded-xl bg-[#13253A] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
              placeholder="Cuéntanos por qué te interesa esta pasantía y qué esperas aprender..."
            />
          </FormField>

          <div className="pt-4 border-t border-white/10">
            <Button type="submit" variant="primary" className="w-full">
              Enviar postulación
            </Button>
            <p className="text-xs text-white/50 mt-2 text-center">
              Al enviar, recibirás un correo de confirmación con tu número de solicitud.
            </p>
          </div>
        </form>
      </Card>

      <Snackbar
        message={snackbar.message}
        type={snackbar.type}
        isOpen={snackbar.isOpen}
        onClose={() => setSnackbar({ ...snackbar, isOpen: false })}
      />
    </div>
  );
}
