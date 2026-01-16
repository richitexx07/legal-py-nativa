"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import FormField from "@/components/FormField";
import Snackbar from "@/components/Snackbar";
import { mockCursos, mockDocentes, InscripcionCurso } from "@/lib/educacion-data";
import Image from "next/image";
import Link from "next/link";

export default function CursoDetallePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const curso = mockCursos.find((c) => c.slug === slug);
  const docente = curso ? mockDocentes.find((d) => d.id === curso.docenteId) : null;

  const [showForm, setShowForm] = useState(false);
  const [edicionSeleccionada, setEdicionSeleccionada] = useState<string>("");
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    empresa: "",
    cargo: "",
    metodoPago: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [snackbar, setSnackbar] = useState<{ isOpen: boolean; message: string; type: "success" | "error" | "info" | "warning" }>({ isOpen: false, message: "", type: "info" });

  if (!curso) {
    return (
      <div className="space-y-6">
        <Card>
          <div className="text-center py-8">
            <p className="text-white/70 mb-4">Curso no encontrado</p>
            <Link href="/cursos">
              <Button variant="primary">Volver a cursos</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const edicionAbierta = curso.proximasEdiciones.find((e) => e.estado === "Abierta");

  const handleInscripcion = (e: React.FormEvent) => {
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
    if (!edicionSeleccionada) newErrors.edicion = "Debes seleccionar una edición";
    if (!formData.metodoPago) newErrors.metodoPago = "Debes seleccionar un método de pago";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Generar número de inscripción
    const numeroInscripcion = `LPY-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 100000)).padStart(5, "0")}`;

    // Guardar en localStorage (simulado)
    const inscripcion: InscripcionCurso = {
      id: Date.now().toString(),
      numeroInscripcion,
      cursoId: curso.id,
      edicionId: edicionSeleccionada,
      nombre: formData.nombre,
      apellido: formData.apellido,
      email: formData.email,
      telefono: formData.telefono,
      empresa: formData.empresa || undefined,
      cargo: formData.cargo || undefined,
      metodoPago: formData.metodoPago,
      fechaInscripcion: new Date().toISOString(),
      estado: "Pendiente",
    };

    const inscripciones = JSON.parse(localStorage.getItem("inscripcionesCursos") || "[]");
    inscripciones.push(inscripcion);
    localStorage.setItem("inscripcionesCursos", JSON.stringify(inscripciones));

    // Simular envío de correo
    console.log("📧 Correo simulado enviado a:", formData.email);
    console.log("📧 Asunto: Confirmación de inscripción - " + curso.titulo);
    console.log("📧 Contenido: Tu número de inscripción es: " + numeroInscripcion);

    setSnackbar({
      isOpen: true,
      message: `Inscripción exitosa. Tu número de solicitud es: ${numeroInscripcion}`,
      type: "success",
    });

    setShowForm(false);
    setFormData({
      nombre: "",
      apellido: "",
      email: "",
      telefono: "",
      empresa: "",
      cargo: "",
      metodoPago: "",
    });
    setEdicionSeleccionada("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link href="/cursos" className="text-[#C9A24D] hover:underline text-sm mb-4 inline-block">
          ← Volver a cursos
        </Link>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">{curso.titulo}</h1>
        <p className="text-white/70 text-lg">{curso.descripcion}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contenido Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Descripción */}
          <Card>
            <h2 className="text-xl font-bold text-white mb-4">Descripción del Curso</h2>
            <p className="text-white/80 leading-relaxed">{curso.descripcionLarga}</p>
          </Card>

          {/* Temario */}
          <Card>
            <h2 className="text-xl font-bold text-white mb-4">Temario</h2>
            <div className="space-y-4">
              {curso.temario.map((item) => (
                <div key={item.id} className="border-l-2 border-[#C9A24D] pl-4">
                  <h3 className="font-semibold text-[#C9A24D] mb-2">{item.titulo}</h3>
                  <ul className="space-y-1 text-sm text-white/70">
                    {item.subtemas.map((subtema, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-[#C9A24D] mt-1">•</span>
                        <span>{subtema}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-white/50 mt-2">Duración: {item.duracion}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Metodología */}
          <Card>
            <h2 className="text-xl font-bold text-white mb-4">Metodología</h2>
            <p className="text-white/80">{curso.metodologia}</p>
          </Card>

          {/* Dirigido a */}
          <Card>
            <h2 className="text-xl font-bold text-white mb-4">Dirigido a</h2>
            <ul className="space-y-2">
              {curso.dirigidoA.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-white/80">
                  <span className="text-[#C9A24D] mt-1">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Beneficios */}
          <Card>
            <h2 className="text-xl font-bold text-white mb-4">Beneficios</h2>
            <ul className="space-y-2">
              {curso.beneficios.map((beneficio, idx) => (
                <li key={idx} className="flex items-start gap-2 text-white/80">
                  <span className="text-[#C9A24D] mt-1">✓</span>
                  <span>{beneficio}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Info rápida */}
          <Card>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-white/60 mb-1">Precio</p>
                <p className="text-2xl font-bold text-[#C9A24D]">
                  {curso.precioDescuento ? (
                    <>
                      <span className="line-through text-white/50 text-lg">{curso.precio}</span>{" "}
                      {curso.precioDescuento}
                    </>
                  ) : (
                    curso.precio
                  )}
                </p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Duración:</span>
                  <span className="text-white font-semibold">{curso.duracion}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Horas:</span>
                  <span className="text-white font-semibold">{curso.horas} horas</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Modalidad:</span>
                  <span className="text-white font-semibold">{curso.modalidad}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Nivel:</span>
                  <Badge variant="outline" className="text-xs">
                    {curso.nivel}
                  </Badge>
                </div>
              </div>

              {curso.certificacion && (
                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 text-[#C9A24D]">
                    <span>🎓</span>
                    <span className="text-sm font-semibold">Certificado incluido</span>
                  </div>
                  {curso.certificacionDescripcion && (
                    <p className="text-xs text-white/60 mt-1">{curso.certificacionDescripcion}</p>
                  )}
                </div>
              )}

              <div className="pt-4 border-t border-white/10">
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => setShowForm(!showForm)}
                >
                  {showForm ? "Cancelar inscripción" : "Inscribirse ahora"}
                </Button>
                {curso.brochure && (
                  <Button
                    variant="outline"
                    className="w-full mt-2"
                    onClick={() => {
                      // Simular descarga
                      alert("Descargando brochure (demo): " + curso.brochure);
                    }}
                  >
                    📥 Descargar brochure
                  </Button>
                )}
              </div>
            </div>
          </Card>

          {/* Docente */}
          {docente && (
            <Card>
              <h3 className="font-semibold text-white mb-3">Docente</h3>
              <div className="flex items-start gap-3">
                {docente.avatar ? (
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full">
                    <Image
                      src={docente.avatar}
                      alt={docente.nombre}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                ) : (
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#C9A24D] to-[#C08457] text-lg font-bold text-black">
                    {docente.nombre
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#C9A24D]">{docente.nombre}</p>
                  <p className="text-sm text-white/70">{docente.titulo}</p>
                  <p className="text-xs text-white/60 mt-1">{docente.especialidad}</p>
                </div>
              </div>
            </Card>
          )}

          {/* Próximas ediciones */}
          <Card>
            <h3 className="font-semibold text-white mb-3">Próximas Ediciones</h3>
            <div className="space-y-3">
              {curso.proximasEdiciones.map((edicion) => (
                <div
                  key={edicion.id}
                  className={`p-3 rounded-lg border ${
                    edicion.estado === "Abierta"
                      ? "border-[#C9A24D]/40 bg-[#C9A24D]/10"
                      : "border-white/10 bg-white/5"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Badge
                      variant={edicion.estado === "Abierta" ? "accent" : "outline"}
                      className="text-xs"
                    >
                      {edicion.estado}
                    </Badge>
                    {edicion.cuposDisponibles > 0 && (
                      <span className="text-xs text-[#C9A24D]">
                        {edicion.cuposDisponibles} cupos
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-white font-semibold">
                    {new Date(edicion.fechaInicio).toLocaleDateString("es-PY", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-xs text-white/60 mt-1">{edicion.horario}</p>
                  {edicion.lugar && (
                    <p className="text-xs text-white/60 mt-1">📍 {edicion.lugar}</p>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Formulario de inscripción */}
      {showForm && (
        <Card>
          <h2 className="text-xl font-bold text-white mb-4">Formulario de Inscripción</h2>
          <form onSubmit={handleInscripcion} className="space-y-4">
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
              <FormField label="Empresa (opcional)" htmlFor="empresa">
                <input
                  id="empresa"
                  type="text"
                  value={formData.empresa}
                  onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-[#13253A] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
                />
              </FormField>

              <FormField label="Cargo (opcional)" htmlFor="cargo">
                <input
                  id="cargo"
                  type="text"
                  value={formData.cargo}
                  onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-[#13253A] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
                />
              </FormField>
            </div>

            <FormField label="Edición" htmlFor="edicion" required error={errors.edicion}>
              <select
                id="edicion"
                value={edicionSeleccionada}
                onChange={(e) => setEdicionSeleccionada(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-[#13253A] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
                style={{ colorScheme: 'dark' }}
              >
                <option value="" className="bg-[#13253A] text-white">Seleccionar edición</option>
                {curso.proximasEdiciones
                  .filter((e) => e.estado === "Abierta")
                  .map((edicion) => (
                    <option key={edicion.id} value={edicion.id} className="bg-[#13253A] text-white">
                      {new Date(edicion.fechaInicio).toLocaleDateString("es-PY")} - {edicion.horario} ({edicion.modalidad})
                    </option>
                  ))}
              </select>
            </FormField>

            <FormField label="Método de pago" htmlFor="metodoPago" required error={errors.metodoPago}>
              <select
                id="metodoPago"
                value={formData.metodoPago}
                onChange={(e) => setFormData({ ...formData, metodoPago: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-[#13253A] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
                style={{ colorScheme: 'dark' }}
              >
                <option value="" className="bg-[#13253A] text-white">Seleccionar método</option>
                <option value="tarjeta" className="bg-[#13253A] text-white">Tarjeta de crédito/débito</option>
                <option value="transferencia" className="bg-[#13253A] text-white">Transferencia bancaria</option>
                <option value="tigo-money" className="bg-[#13253A] text-white">Tigo Money</option>
                <option value="personal-pay" className="bg-[#13253A] text-white">Personal Pay</option>
              </select>
            </FormField>

            <div className="pt-4 border-t border-white/10">
              <Button type="submit" variant="primary" className="w-full">
                Confirmar inscripción
              </Button>
              <p className="text-xs text-white/50 mt-2 text-center">
                Al confirmar, recibirás un correo con los detalles de pago y acceso al curso.
              </p>
            </div>
          </form>
        </Card>
      )}

      <Snackbar
        message={snackbar.message}
        type={snackbar.type}
        isOpen={snackbar.isOpen}
        onClose={() => setSnackbar({ ...snackbar, isOpen: false })}
      />
    </div>
  );
}
