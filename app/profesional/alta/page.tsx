"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/Card";
import Button from "@/components/Button";
import ProgressBar from "@/components/ProgressBar";
import WizardSteps from "@/components/WizardSteps";
import PaymentMethodCard from "@/components/PaymentMethodCard";
import LegalConsent from "@/components/LegalConsent";
import { mockPlanes, mockMetodosPago } from "@/lib/mock-data";

interface WizardData {
  // Paso 1
  tipoProfesional: string;
  ubicacion: string;
  idiomas: string[];

  // Paso 2
  email: string;
  password: string;
  authMethod: "email" | "google" | "facebook" | "whatsapp";

  // Paso 3
  ciPasaporte: File | null;
  matricula: File | null;
  titulo: File | null;

  // Paso 4
  fotoPerfil: File | null;
  cv: File | null;
  especialidades: string[];
  tarifas: string;
  disponibilidad: string;

  // Paso 5
  planId: string;

  // Paso 6
  metodoPagoId: string;
  terminos: boolean;
  privacidad: boolean;
  veracidad: boolean;
}

const TOTAL_STEPS = 6;
const STEPS_LABELS = [
  "Información Básica",
  "Cuenta",
  "Verificación",
  "Perfil",
  "Plan",
  "Pago",
];

export default function AltaProfesional() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<WizardData>({
    tipoProfesional: "",
    ubicacion: "",
    idiomas: [],
    email: "",
    password: "",
    authMethod: "email",
    ciPasaporte: null,
    matricula: null,
    titulo: null,
    fotoPerfil: null,
    cv: null,
    especialidades: [],
    tarifas: "",
    disponibilidad: "",
    planId: "",
    metodoPagoId: "",
    terminos: false,
    privacidad: false,
    veracidad: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  // Cargar desde localStorage
  useEffect(() => {
    const saved = localStorage.getItem("profesional-wizard");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setData(parsed);
        setCurrentStep(parsed.currentStep || 1);
      } catch (e) {
        console.error("Error loading wizard data:", e);
      }
    }
  }, []);

  // Guardar en localStorage
  const saveProgress = (newData: Partial<WizardData>, step?: number) => {
    const updated = { ...data, ...newData };
    setData(updated);
    localStorage.setItem(
      "profesional-wizard",
      JSON.stringify({ ...updated, currentStep: step || currentStep })
    );
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!data.tipoProfesional) newErrors.tipoProfesional = "Selecciona un tipo de profesional";
      if (!data.ubicacion) newErrors.ubicacion = "Selecciona una ubicación";
    }

    if (step === 2) {
      if (data.authMethod === "email") {
        if (!data.email) newErrors.email = "El email es requerido";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
          newErrors.email = "Email inválido";
        }
        if (!data.password) newErrors.password = "La contraseña es requerida";
        else if (data.password.length < 8) {
          newErrors.password = "La contraseña debe tener al menos 8 caracteres";
        }
      }
    }

    if (step === 5 && !data.planId) {
      newErrors.planId = "Selecciona un plan";
    }

    if (step === 6) {
      if (!data.metodoPagoId) newErrors.metodoPagoId = "Selecciona un método de pago";
      if (!data.terminos) newErrors.terminos = "Debes aceptar los términos";
      if (!data.privacidad) newErrors.privacidad = "Debes aceptar la política de privacidad";
      if (!data.veracidad) newErrors.veracidad = "Debes declarar la veracidad";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < TOTAL_STEPS) {
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);
        saveProgress({}, nextStep);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      saveProgress({}, prevStep);
    }
  };

  const handleFinalizar = () => {
    if (validateStep(6)) {
      // Crear mock account
      const mockAccount = {
        id: `prof-${Date.now()}`,
        email: data.email,
        nombre: data.tipoProfesional,
        tipo: data.tipoProfesional,
        ciudad: data.ubicacion,
        planId: data.planId,
        metodoPagoId: data.metodoPagoId,
        fechaAlta: new Date().toISOString().split("T")[0],
        estado: "activo" as const,
      };

      localStorage.setItem("mockProfessionalAccount", JSON.stringify(mockAccount));
      localStorage.removeItem("profesional-wizard");
      router.push("/profesional/panel");
    }
  };

  const getPasswordStrength = (password: string) => {
    if (password.length < 8) return { strength: "débil", color: "text-red-400" };
    if (password.length < 12) return { strength: "media", color: "text-yellow-400" };
    return { strength: "fuerte", color: "text-green-400" };
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white">
          Únete como Profesional
        </h1>
        <p className="text-white/70">Completa tu perfil en {TOTAL_STEPS} pasos</p>
      </div>

      {/* Progress Bar */}
      <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />

      {/* Wizard Steps */}
      <WizardSteps steps={STEPS_LABELS} currentStep={currentStep} className="mb-8" />

      {/* Step Content */}
      <Card>
        {/* PASO 1: Información Básica */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">Información Básica</h2>

            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Tipo de Profesional *
              </label>
              <select
                value={data.tipoProfesional}
                onChange={(e) => saveProgress({ tipoProfesional: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
              >
                <option value="">Selecciona...</option>
                <option value="Abogado">Abogado</option>
                <option value="Escribano">Escribano</option>
                <option value="Despachante">Despachante</option>
                <option value="Gestor">Gestor</option>
                <option value="Oficial de Justicia">Oficial de Justicia</option>
              </select>
              {errors.tipoProfesional && (
                <p className="mt-1 text-xs text-red-400">{errors.tipoProfesional}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">Ubicación *</label>
              <select
                value={data.ubicacion}
                onChange={(e) => saveProgress({ ubicacion: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
              >
                <option value="">Selecciona...</option>
                <option value="Asunción">Asunción</option>
                <option value="Ciudad del Este">Ciudad del Este</option>
                <option value="San Lorenzo">San Lorenzo</option>
                <option value="Luque">Luque</option>
                <option value="Encarnación">Encarnación</option>
                <option value="Pedro Juan Caballero">Pedro Juan Caballero</option>
              </select>
              {errors.ubicacion && (
                <p className="mt-1 text-xs text-red-400">{errors.ubicacion}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">Idiomas</label>
              <div className="flex flex-wrap gap-2">
                {["Español", "Guaraní", "Inglés", "Portugués"].map((idioma) => (
                  <button
                    key={idioma}
                    type="button"
                    onClick={() => {
                      const newIdiomas = data.idiomas.includes(idioma)
                        ? data.idiomas.filter((i) => i !== idioma)
                        : [...data.idiomas, idioma];
                      saveProgress({ idiomas: newIdiomas });
                    }}
                    className={`px-4 py-2 rounded-lg text-sm transition ${
                      data.idiomas.includes(idioma)
                        ? "bg-[#C9A24D] text-black font-semibold"
                        : "bg-white/5 text-white/70 hover:bg-white/10"
                    }`}
                  >
                    {idioma}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PASO 2: Crear Cuenta */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">Crear Cuenta</h2>

            {/* OAuth Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => saveProgress({ authMethod: "google" })}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="text-white">Google</span>
              </button>

              <button
                type="button"
                onClick={() => saveProgress({ authMethod: "facebook" })}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
              >
                <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span className="text-white">Facebook</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  alert("Integración de OTP por WhatsApp (demo)");
                  saveProgress({ authMethod: "whatsapp" });
                }}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
              >
                <span className="text-2xl">💬</span>
                <span className="text-white">WhatsApp</span>
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#13253A] text-white/60">O continúa con email</span>
              </div>
            </div>

            {/* Email/Password Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">Email *</label>
                <input
                  type="email"
                  value={data.email}
                  onChange={(e) => saveProgress({ email: e.target.value, authMethod: "email" })}
                  className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
                  placeholder="tu@email.com"
                />
                {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Contraseña *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={data.password}
                    onChange={(e) => saveProgress({ password: e.target.value, authMethod: "email" })}
                    className="w-full px-4 py-2 pr-10 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
                    placeholder="Mínimo 8 caracteres"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
                {data.password && (
                  <p
                    className={`mt-1 text-xs ${getPasswordStrength(data.password).color}`}
                  >
                    Seguridad: {getPasswordStrength(data.password).strength}
                  </p>
                )}
                {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password}</p>}
              </div>
            </div>
          </div>
        )}

        {/* PASO 3: Verificación */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">Verificar Credenciales</h2>
            <p className="text-white/70 text-sm">
              Sube documentos que verifiquen tu identidad y credenciales profesionales
            </p>

            {[
              { key: "ciPasaporte", label: "CI o Pasaporte", file: data.ciPasaporte },
              { key: "matricula", label: "Matrícula Profesional", file: data.matricula },
              { key: "titulo", label: "Título Profesional (PDF)", file: data.titulo },
            ].map(({ key, label, file }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-white/90 mb-2">{label}</label>
                <div className="flex items-center gap-4">
                  <label className="flex-1 cursor-pointer">
                    <input
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          saveProgress({ [key]: file });
                        }
                      }}
                      className="hidden"
                      accept={key === "titulo" ? ".pdf" : "image/*,.pdf"}
                    />
                    <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition text-center text-white/70">
                      {file ? file.name : "Seleccionar archivo"}
                    </div>
                  </label>
                  {file && (
                    <button
                      type="button"
                      onClick={() => saveProgress({ [key]: null })}
                      className="text-red-400 hover:text-red-300"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PASO 4: Perfil Público */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">Perfil Público</h2>

            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Foto de Perfil
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) saveProgress({ fotoPerfil: file });
                }}
                className="hidden"
                id="fotoPerfil"
              />
              <label
                htmlFor="fotoPerfil"
                className="block w-32 h-32 rounded-full bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition flex items-center justify-center"
              >
                {data.fotoPerfil ? (
                  <span className="text-white/70">✓</span>
                ) : (
                  <span className="text-white/50">📷</span>
                )}
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">CV (PDF)</label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) saveProgress({ cv: file });
                }}
                className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/70"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Especialidades
              </label>
              <div className="flex flex-wrap gap-2">
                {["Penal", "Civil", "Laboral", "Comercial", "Notarial", "Familiar"].map((esp) => (
                  <button
                    key={esp}
                    type="button"
                    onClick={() => {
                      const newEspecialidades = data.especialidades.includes(esp)
                        ? data.especialidades.filter((e) => e !== esp)
                        : [...data.especialidades, esp];
                      saveProgress({ especialidades: newEspecialidades });
                    }}
                    className={`px-4 py-2 rounded-lg text-sm transition ${
                      data.especialidades.includes(esp)
                        ? "bg-[#C9A24D] text-black font-semibold"
                        : "bg-white/5 text-white/70 hover:bg-white/10"
                    }`}
                  >
                    {esp}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">Tarifas</label>
              <input
                type="text"
                value={data.tarifas}
                onChange={(e) => saveProgress({ tarifas: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
                placeholder="Ej: desde Gs. 200.000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Disponibilidad
              </label>
              <select
                value={data.disponibilidad}
                onChange={(e) => saveProgress({ disponibilidad: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
              >
                <option value="">Selecciona...</option>
                <option value="Lun-Vie 9-18hs">Lun-Vie 9-18hs</option>
                <option value="Lun-Vie 8-17hs">Lun-Vie 8-17hs</option>
                <option value="Lun-Sab 9-13hs">Lun-Sab 9-13hs</option>
                <option value="24/7">24/7</option>
              </select>
            </div>
          </div>
        )}

        {/* PASO 5: Plan */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">Selecciona tu Plan</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockPlanes.map((plan) => (
                <Card
                  key={plan.id}
                  hover
                  className={`cursor-pointer transition-all ${
                    data.planId === plan.id
                      ? "border-[#C9A24D] bg-[#13253A]/90 ring-2 ring-[#C9A24D]/30"
                      : ""
                  } ${plan.destacado ? "border-[#C08457]" : ""}`}
                  onClick={() => saveProgress({ planId: plan.id })}
                >
                  {plan.destacado && (
                    <div className="mb-3 text-center">
                      <span className="inline-block px-3 py-1 rounded-full bg-[#C08457] text-white text-xs font-semibold">
                        ⭐ Recomendado
                      </span>
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-white mb-2">{plan.nombre}</h3>
                  <div className="mb-4">
                    <span className="text-3xl font-extrabold text-[#C9A24D]">
                      {plan.precio.toLocaleString()} {plan.moneda}
                    </span>
                    <span className="text-white/60 text-sm">/{plan.periodo}</span>
                  </div>
                  <p className="text-white/70 text-sm mb-4">{plan.descripcion}</p>
                  <ul className="space-y-2">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-white/80">
                        <span className="text-[#C9A24D] mt-0.5">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  {data.planId === plan.id && (
                    <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2 text-sm text-[#C9A24D]">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Seleccionado
                    </div>
                  )}
                </Card>
              ))}
            </div>
            {errors.planId && <p className="text-xs text-red-400">{errors.planId}</p>}
          </div>
        )}

        {/* PASO 6: Pago */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">Método de Pago</h2>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Métodos de Paraguay</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {mockMetodosPago
                  .filter((m) => m.tipo === "paraguay")
                  .map((metodo) => (
                    <PaymentMethodCard
                      key={metodo.id}
                      id={metodo.id}
                      name={metodo.nombre}
                      description={metodo.descripcion}
                      icon={<span className="text-2xl">{metodo.icono}</span>}
                      selected={data.metodoPagoId === metodo.id}
                      onClick={() => {
                        saveProgress({ metodoPagoId: metodo.id });
                        alert(`Integración demo: ${metodo.nombre}`);
                      }}
                    />
                  ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Métodos Internacionales</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {mockMetodosPago
                  .filter((m) => m.tipo === "internacional")
                  .map((metodo) => (
                    <PaymentMethodCard
                      key={metodo.id}
                      id={metodo.id}
                      name={metodo.nombre}
                      description={metodo.descripcion}
                      icon={<span className="text-2xl">{metodo.icono}</span>}
                      selected={data.metodoPagoId === metodo.id}
                      onClick={() => {
                        saveProgress({ metodoPagoId: metodo.id });
                        alert(`Integración demo: ${metodo.nombre}`);
                      }}
                    />
                  ))}
              </div>
            </div>

            {errors.metodoPagoId && (
              <p className="text-xs text-red-400">{errors.metodoPagoId}</p>
            )}

            {/* Legal Consent */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <LegalConsent
                terminos={data.terminos}
                privacidad={data.privacidad}
                veracidad={data.veracidad}
                onTerminosChange={(value) => saveProgress({ terminos: value })}
                onPrivacidadChange={(value) => saveProgress({ privacidad: value })}
                onVeracidadChange={(value) => saveProgress({ veracidad: value })}
                errors={{
                  terminos: errors.terminos,
                  privacidad: errors.privacidad,
                  veracidad: errors.veracidad,
                }}
              />
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-white/10 mt-6">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            ← Anterior
          </Button>

          {currentStep < TOTAL_STEPS ? (
            <Button variant="primary" onClick={handleNext}>
              Siguiente →
            </Button>
          ) : (
            <Button variant="primary" onClick={handleFinalizar}>
              Finalizar y Suscribirme
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
