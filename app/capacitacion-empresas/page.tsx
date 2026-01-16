"use client";

import { useState } from "react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import FormField from "@/components/FormField";
import Snackbar from "@/components/Snackbar";
import { SolicitudCapacitacion } from "@/lib/educacion-data";

export default function CapacitacionEmpresasPage() {
  const [tipoSolicitud, setTipoSolicitud] = useState<"Profesional" | "Empresa" | "Estudiante">("Empresa");
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    empresa: "",
    cargo: "",
    areaInteres: "",
    modalidad: "",
    cantidadParticipantes: "",
    fechaDeseada: "",
    objetivos: "",
    presupuesto: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [snackbar, setSnackbar] = useState({ isOpen: false, message: "", type: "info" as const });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validación
    const newErrors: Record<string, string> = {};
    if (!formData.nombre) newErrors.nombre = "El nombre es requerido";
    if (!formData.email) {
      newErrors.email = "El email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }
    if (!formData.telefono) newErrors.telefono = "El teléfono es requerido";
    if (tipoSolicitud === "Empresa" && !formData.empresa) {
      newErrors.empresa = "El nombre de la empresa es requerido";
    }
    if (!formData.areaInteres) newErrors.areaInteres = "El área de interés es requerida";
    if (!formData.modalidad) newErrors.modalidad = "La modalidad es requerida";
    if (!formData.objetivos) newErrors.objetivos = "Los objetivos son requeridos";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Generar número de solicitud
    const numeroSolicitud = `LPY-CAP-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 100000)).padStart(5, "0")}`;

    // Guardar en localStorage (simulado)
    const solicitud: SolicitudCapacitacion = {
      id: Date.now().toString(),
      numeroSolicitud,
      tipo: tipoSolicitud,
      nombre: formData.nombre,
      email: formData.email,
      telefono: formData.telefono,
      empresa: formData.empresa || undefined,
      cargo: formData.cargo || undefined,
      areaInteres: formData.areaInteres,
      modalidad: formData.modalidad as "Online" | "Presencial" | "In-company",
      cantidadParticipantes: formData.cantidadParticipantes ? parseInt(formData.cantidadParticipantes) : undefined,
      fechaDeseada: formData.fechaDeseada || undefined,
      objetivos: formData.objetivos,
      presupuesto: formData.presupuesto || undefined,
      fechaSolicitud: new Date().toISOString(),
      estado: "Recibido",
    };

    const solicitudes = JSON.parse(localStorage.getItem("solicitudesCapacitacion") || "[]");
    solicitudes.push(solicitud);
    localStorage.setItem("solicitudesCapacitacion", JSON.stringify(solicitudes));

    // Simular generación de propuesta
    const propuestaUrl = `/propuestas/${numeroSolicitud}.pdf`;
    console.log("📄 Propuesta generada (demo):", propuestaUrl);
    console.log("📧 Correo simulado enviado a:", formData.email);
    console.log("📧 Asunto: Propuesta de capacitación - " + numeroSolicitud);
    console.log("📧 Contenido: Tu propuesta está lista. Descarga: " + propuestaUrl);

    setSnackbar({
      isOpen: true,
      message: `Solicitud recibida. Tu número es: ${numeroSolicitud}. Recibirás la propuesta por email.`,
      type: "success",
    });

    // Limpiar formulario
    setFormData({
      nombre: "",
      email: "",
      telefono: "",
      empresa: "",
      cargo: "",
      areaInteres: "",
      modalidad: "",
      cantidadParticipantes: "",
      fechaDeseada: "",
      objetivos: "",
      presupuesto: "",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
          Servicios de Capacitación
        </h1>
        <p className="text-white/70 max-w-3xl">
          Capacitación personalizada para profesionales, empresas e instituciones. Programas
          in-company, online o presenciales adaptados a tus necesidades.
        </p>
      </div>

      <Card>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white mb-4">Solicitar Propuesta</h2>
          <div className="flex gap-3">
            {(["Profesional", "Empresa", "Estudiante"] as const).map((tipo) => (
              <button
                key={tipo}
                type="button"
                onClick={() => setTipoSolicitud(tipo)}
                className={`px-4 py-2 rounded-xl transition ${
                  tipoSolicitud === tipo
                    ? "bg-[#C9A24D] text-black font-semibold"
                    : "bg-white/5 text-white/70 hover:bg-white/10"
                }`}
              >
                {tipo}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Nombre completo" htmlFor="nombre" required error={errors.nombre}>
              <input
                id="nombre"
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-[#13253A] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
              />
            </FormField>

            <FormField label="Email" htmlFor="email" required error={errors.email}>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-[#13253A] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Teléfono" htmlFor="telefono" required error={errors.telefono}>
              <input
                id="telefono"
                type="tel"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-[#13253A] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
              />
            </FormField>

            {tipoSolicitud === "Empresa" && (
              <FormField label="Empresa" htmlFor="empresa" required error={errors.empresa}>
                <input
                  id="empresa"
                  type="text"
                  value={formData.empresa}
                  onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-[#13253A] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
                />
              </FormField>
            )}

            {tipoSolicitud !== "Estudiante" && (
              <FormField label="Cargo" htmlFor="cargo">
                <input
                  id="cargo"
                  type="text"
                  value={formData.cargo}
                  onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-[#13253A] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
                />
              </FormField>
            )}
          </div>

          <FormField label="Área de interés" htmlFor="areaInteres" required error={errors.areaInteres}>
            <select
              id="areaInteres"
              value={formData.areaInteres}
              onChange={(e) => setFormData({ ...formData, areaInteres: e.target.value })}
              className="w-full px-4 py-2 rounded-xl bg-[#13253A] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
              style={{ colorScheme: 'dark' }}
            >
              <option value="" className="bg-[#13253A] text-white">Seleccionar área</option>
              <option value="Litigación" className="bg-[#13253A] text-white">Litigación</option>
              <option value="Derecho Laboral" className="bg-[#13253A] text-white">Derecho Laboral</option>
              <option value="Derecho Corporativo" className="bg-[#13253A] text-white">Derecho Corporativo</option>
              <option value="Compliance" className="bg-[#13253A] text-white">Compliance</option>
              <option value="Derecho Tributario" className="bg-[#13253A] text-white">Derecho Tributario</option>
              <option value="Otro" className="bg-[#13253A] text-white">Otro</option>
            </select>
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Modalidad" htmlFor="modalidad" required error={errors.modalidad}>
              <select
                id="modalidad"
                value={formData.modalidad}
                onChange={(e) => setFormData({ ...formData, modalidad: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-[#13253A] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
                style={{ colorScheme: 'dark' }}
              >
                <option value="" className="bg-[#13253A] text-white">Seleccionar modalidad</option>
                <option value="Online" className="bg-[#13253A] text-white">Online</option>
                <option value="Presencial" className="bg-[#13253A] text-white">Presencial</option>
                <option value="In-company" className="bg-[#13253A] text-white">In-company</option>
              </select>
            </FormField>

            {tipoSolicitud === "Empresa" && (
              <FormField label="Cantidad de participantes" htmlFor="participantes">
                <input
                  id="participantes"
                  type="number"
                  min="1"
                  value={formData.cantidadParticipantes}
                  onChange={(e) => setFormData({ ...formData, cantidadParticipantes: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-[#13253A] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
                />
              </FormField>
            )}
          </div>

          {tipoSolicitud === "Empresa" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Fecha deseada (opcional)" htmlFor="fechaDeseada">
                <input
                  id="fechaDeseada"
                  type="date"
                  value={formData.fechaDeseada}
                  onChange={(e) => setFormData({ ...formData, fechaDeseada: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-[#13253A] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
                />
              </FormField>

              <FormField label="Presupuesto estimado (opcional)" htmlFor="presupuesto">
                <input
                  id="presupuesto"
                  type="text"
                  value={formData.presupuesto}
                  onChange={(e) => setFormData({ ...formData, presupuesto: e.target.value })}
                  placeholder="Ej: Gs. 5.000.000"
                  className="w-full px-4 py-2 rounded-xl bg-[#13253A] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
                />
              </FormField>
            </div>
          )}

          <FormField
            label="Objetivos de la capacitación"
            htmlFor="objetivos"
            required
            error={errors.objetivos}
            hint="Describe qué esperas lograr con esta capacitación"
          >
            <textarea
              id="objetivos"
              value={formData.objetivos}
              onChange={(e) => setFormData({ ...formData, objetivos: e.target.value })}
              rows={5}
              className="w-full px-4 py-2 rounded-xl bg-[#13253A] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
              placeholder="Ej: Capacitar a nuestro equipo legal en nuevas normativas de compliance..."
            />
          </FormField>

          <div className="pt-4 border-t border-white/10">
            <Button type="submit" variant="primary" className="w-full">
              Solicitar propuesta
            </Button>
            <p className="text-xs text-white/50 mt-2 text-center">
              Recibirás una propuesta personalizada por email en un plazo de 48 horas.
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
