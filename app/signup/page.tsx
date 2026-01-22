"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { useLanguage } from "@/context/LanguageContext";
import { getSession, register } from "@/lib/auth";
import { UserRole } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import BiometricLogin from "@/components/Security/BiometricLogin";
import { isWebAuthnAvailable } from "@/lib/security/webauthn";

type SignupStep = "role" | "plan" | "data" | "payment" | "complete";

const userRoles = [
  {
    id: "profesional" as UserRole,
    name: "Profesional",
    description: "Abogados, Escribanos, Gestores",
    icon: "⚖️",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "cliente" as UserRole,
    name: "Cliente",
    description: "Personas que necesitan servicios legales",
    icon: "👤",
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "estudiante" as UserRole,
    name: "Estudiante",
    description: "Estudiantes de derecho y pasantes",
    icon: "🎓",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "institucion" as UserRole,
    name: "Empresa (GEP)",
    description: "Estudios jurídicos y empresas premium",
    icon: "🏢",
    color: "from-yellow-500 to-orange-500",
  },
];

const plans = [
  {
    id: "basico",
    name: "Básico",
    price: "Gs. 150.000",
    period: "/ mes",
    features: [
      "Acceso a casos simples",
      "Publica casos sin comisiones",
      "Panel básico",
      "Historial 6 meses",
    ],
  },
  {
    id: "profesional",
    name: "Profesional",
    price: "Gs. 350.000",
    period: "/ mes",
    popular: true,
    features: [
      "Visibilidad aumentada",
      "Panel de métricas",
      "Prioridad en casos",
      "Motor DPT activo",
    ],
  },
  {
    id: "empresarial",
    name: "Empresarial",
    price: "Gs. 650.000",
    period: "/ mes",
    features: [
      "Multi-usuario",
      "API de integración",
      "Reportes ejecutivos",
      "Soporte prioritario",
    ],
  },
  {
    id: "gep",
    name: "GEP (Elite)",
    price: "Personalizado",
    period: "",
    features: [
      "Acceso exclusivo 24h antes",
      "Casos high-ticket",
      "Acompañamiento estratégico",
      "Soporte 24/7",
    ],
  },
];

function SignupPageContent() {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState<SignupStep>("role");
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const [mounted, setMounted] = useState(false);
  const [supportsBiometric, setSupportsBiometric] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Si ya hay sesión, redirigir
    if (getSession()) {
      router.push("/panel");
      return;
    }
    // Si viene con rol desde URL
    const roleParam = searchParams.get("rol");
    if (roleParam && ["profesional", "cliente", "estudiante", "institucion"].includes(roleParam)) {
      setSelectedRole(roleParam as UserRole);
      setCurrentStep("plan");
    }
    // Verificar soporte de biometría
    if (typeof window !== "undefined") {
      setSupportsBiometric(isWebAuthnAvailable());
    }
  }, [router, searchParams]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0E1B2A] via-[#13253A] to-[#0E1B2A] flex items-center justify-center">
        <div className="h-96 bg-white/5 rounded-2xl animate-pulse w-full max-w-4xl" />
      </div>
    );
  }

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setCurrentStep("plan");
  };

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    setCurrentStep("data");
  };

  const handleDataSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;

    try {
      const result = await register({
        email: formData.email,
        password: formData.password,
        role: selectedRole,
        firstName: formData.firstName,
        lastName: formData.lastName,
      });

      if (result.success) {
        // En modo demo, saltar pago y ir directo a completar
        const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === "true";
        if (isDemo || selectedPlan === "basico") {
          setCurrentStep("complete");
          setTimeout(() => {
            router.push("/panel");
          }, 2000);
        } else {
          setCurrentStep("payment");
        }
      } else {
        alert(result.error || "Error al registrar");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Error al registrar. Intenta nuevamente.");
    }
  };

  const handlePaymentComplete = () => {
    setCurrentStep("complete");
    setTimeout(() => {
      router.push("/panel");
    }, 2000);
  };

  // Barra de progreso
  const getProgress = () => {
    const steps = ["role", "plan", "data", "payment", "complete"];
    return ((steps.indexOf(currentStep) + 1) / steps.length) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E1B2A] via-[#13253A] to-[#0E1B2A] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <div className="flex items-center justify-center gap-3">
              <div className="relative w-12 h-12">
                <Image src="/logo.png" alt="Legal PY" fill className="object-contain" priority />
              </div>
              <span className="text-2xl font-bold text-white">Legal PY</span>
            </div>
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">Crea tu Cuenta</h1>
          <p className="text-white/70">Únete a la plataforma legal más avanzada de Paraguay</p>
        </div>

        {/* Barra de Progreso */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/60">Paso {currentStep === "role" ? 1 : currentStep === "plan" ? 2 : currentStep === "data" ? 3 : currentStep === "payment" ? 4 : 5} de 5</span>
            <span className="text-sm text-white/60">{Math.round(getProgress())}%</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#C9A24D] to-[#C08457] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${getProgress()}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Contenido según el paso */}
        <AnimatePresence mode="wait">
          {/* Paso 1: Selección de Rol */}
          {currentStep === "role" && (
            <motion.div
              key="role"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="p-8">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">
                  ¿Qué tipo de usuario eres?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userRoles.map((role) => (
                    <button
                      key={role.id}
                      onClick={() => handleRoleSelect(role.id)}
                      className="p-6 rounded-2xl border-2 border-white/10 bg-white/5 hover:border-[#C9A24D]/40 hover:bg-white/10 transition-all text-left group"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`text-4xl p-3 rounded-xl bg-gradient-to-br ${role.color} bg-opacity-20`}>
                          {role.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-1">{role.name}</h3>
                          <p className="text-sm text-white/70">{role.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Paso 2: Selección de Plan */}
          {currentStep === "plan" && (
            <motion.div
              key="plan"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Elige tu Plan</h2>
                  <button
                    onClick={() => setCurrentStep("role")}
                    className="text-sm text-white/60 hover:text-white transition"
                  >
                    ← Cambiar tipo
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {plans.map((plan) => (
                    <button
                      key={plan.id}
                      onClick={() => handlePlanSelect(plan.id)}
                      className={`p-6 rounded-2xl border-2 transition-all text-left ${
                        selectedPlan === plan.id
                          ? "border-[#C9A24D] bg-[#C9A24D]/10"
                          : "border-white/10 bg-white/5 hover:border-white/20"
                      } ${plan.popular ? "ring-2 ring-blue-500/50" : ""}`}
                    >
                      {plan.popular && (
                        <div className="mb-2">
                          <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full">
                            Más Elegido
                          </span>
                        </div>
                      )}
                      <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                      <div className="mb-4">
                        <span className="text-3xl font-bold text-[#C9A24D]">{plan.price}</span>
                        {plan.period && <span className="text-white/60 ml-1">{plan.period}</span>}
                      </div>
                      <ul className="space-y-2">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm text-white/80">
                            <span className="text-green-400">✓</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </button>
                  ))}
                </div>
                {selectedPlan && (
                  <div className="mt-6 flex justify-end">
                    <Button
                      variant="primary"
                      onClick={() => setCurrentStep("data")}
                      className="px-8 py-3"
                    >
                      Continuar →
                    </Button>
                  </div>
                )}
              </Card>
            </motion.div>
          )}

          {/* Paso 3: Datos Básicos */}
          {currentStep === "data" && (
            <motion.div
              key="data"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Datos Básicos</h2>
                  <button
                    onClick={() => setCurrentStep("plan")}
                    className="text-sm text-white/60 hover:text-white transition"
                  >
                    ← Cambiar plan
                  </button>
                </div>
                <form onSubmit={handleDataSubmit} className="space-y-4">
                  <div>
                    <label className="block text-white/80 mb-2 text-sm font-medium">
                      Nombre
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-[#C9A24D] focus:ring-2 focus:ring-[#C9A24D]/20 outline-none"
                      placeholder="Juan"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 mb-2 text-sm font-medium">
                      Apellido
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-[#C9A24D] focus:ring-2 focus:ring-[#C9A24D]/20 outline-none"
                      placeholder="Pérez"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 mb-2 text-sm font-medium">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-[#C9A24D] focus:ring-2 focus:ring-[#C9A24D]/20 outline-none"
                      placeholder="tu@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 mb-2 text-sm font-medium">
                      Contraseña
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-[#C9A24D] focus:ring-2 focus:ring-[#C9A24D]/20 outline-none"
                      placeholder="Mínimo 6 caracteres"
                    />
                  </div>
                  <p className="text-xs text-white/50 text-center">
                    Al registrarte, aceptas nuestros{" "}
                    <Link href="/legal-center" className="text-[#C9A24D] hover:underline">
                      Términos y Condiciones
                    </Link>
                  </p>
                  <Button type="submit" variant="primary" className="w-full py-3 rounded-xl">
                    Continuar al Pago →
                  </Button>
                </form>
              </Card>
            </motion.div>
          )}

          {/* Paso 4: Pago */}
          {currentStep === "payment" && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Pago</h2>
                  <button
                    onClick={() => setCurrentStep("data")}
                    className="text-sm text-white/60 hover:text-white transition"
                  >
                    ← Volver
                  </button>
                </div>
                <div className="space-y-6">
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/80">Plan seleccionado:</span>
                      <span className="font-bold text-white">
                        {plans.find(p => p.id === selectedPlan)?.name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/80">Precio:</span>
                      <span className="text-2xl font-bold text-[#C9A24D]">
                        {plans.find(p => p.id === selectedPlan)?.price}
                        {plans.find(p => p.id === selectedPlan)?.period}
                      </span>
                    </div>
                  </div>

                  {/* Modo Demo: Mostrar tarjetas de prueba */}
                  {process.env.NEXT_PUBLIC_DEMO_MODE === "true" && (
                    <div className="p-4 bg-yellow-500/20 border border-yellow-500/40 rounded-xl">
                      <p className="text-sm text-yellow-200 mb-2">
                        💡 <strong>Modo Demo:</strong> Usa estas tarjetas de prueba:
                      </p>
                      <div className="space-y-1 text-xs text-yellow-100/80 font-mono">
                        <p>Visa: 4242 4242 4242 4242</p>
                        <p>Mastercard: 5555 5555 5555 4444</p>
                        <p>Fecha: Cualquier fecha futura | CVV: Cualquier 3 dígitos</p>
                      </div>
                    </div>
                  )}

                  {/* Formulario de pago simulado */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white/80 mb-2 text-sm font-medium">
                        Número de Tarjeta
                      </label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-[#C9A24D] focus:ring-2 focus:ring-[#C9A24D]/20 outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white/80 mb-2 text-sm font-medium">
                          Fecha de Vencimiento
                        </label>
                        <input
                          type="text"
                          placeholder="MM/AA"
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-[#C9A24D] focus:ring-2 focus:ring-[#C9A24D]/20 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-white/80 mb-2 text-sm font-medium">
                          CVV
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-[#C9A24D] focus:ring-2 focus:ring-[#C9A24D]/20 outline-none"
                        />
                      </div>
                    </div>
                    {/* Autorización Biométrica (si está disponible) */}
                    {supportsBiometric && formData.email && (
                      <div className="py-4 border-t border-white/10">
                        <p className="text-sm text-white/70 text-center mb-4">
                          Autoriza con biometría para mayor seguridad
                        </p>
                        <BiometricLogin
                          email={formData.email}
                          mode="authorize"
                          size="md"
                          onSuccess={() => {
                            // Si la biometría es exitosa, proceder con el pago
                            handlePaymentComplete();
                          }}
                          onError={(error) => {
                            // El error se muestra en el componente
                            console.error("Error biométrico:", error);
                          }}
                        />
                        <div className="relative my-4">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                          </div>
                          <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-[#13253A] text-white/60">O continúa con tarjeta</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <Button
                      variant="primary"
                      onClick={handlePaymentComplete}
                      className="w-full py-3 rounded-xl"
                    >
                      Pagar y Completar Registro
                    </Button>
                    <p className="text-xs text-white/50 text-center">
                      🔒 Pago seguro procesado por Stripe
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Paso 5: Completado */}
          {currentStep === "complete" && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <Card className="p-12 text-center">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
                  <svg className="w-16 h-16 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">¡Registro Completado!</h2>
                <p className="text-white/70 text-lg mb-6">
                  Bienvenido a Legal PY. Redirigiendo a tu panel...
                </p>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-white/60">
          <p>
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="text-[#C9A24D] hover:underline font-medium">
              Inicia Sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-[#0E1B2A] via-[#13253A] to-[#0E1B2A] flex items-center justify-center">
        <div className="h-96 bg-white/5 rounded-2xl animate-pulse w-full max-w-4xl" />
      </div>
    }>
      <SignupPageContent />
    </Suspense>
  );
}
