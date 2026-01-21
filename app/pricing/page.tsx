"use client";

import Button from "@/components/Button";
import { useLanguage } from "@/context/LanguageContext";

const plans = [
  {
    name: "Básico",
    price: "Gs. 150.000",
    pricePeriod: "/ mes",
    highlight: false,
    idealFor: "Estudiantes y Juniors",
    badge: null,
    benefits: [
      "Acceso a casos simples",
      "Publica casos sin comisiones ocultas",
      "Recibe respuestas ordenadas en tu panel",
      "Historial básico de gestiones por 6 meses",
    ],
    gep: false,
    borderColor: "border-gray-300",
    bgColor: "bg-white",
    textColor: "text-gray-900",
  },
  {
    name: "Profesional",
    price: "Gs. 350.000",
    pricePeriod: "/ mes",
    highlight: true,
    idealFor: "Abogados Independientes",
    badge: "Más Elegido",
    benefits: [
      "Visibilidad aumentada",
      "Panel de métricas",
      "Tu perfil aparece primero para casos de tu especialidad",
      "Recibe clientes mientras duermes gracias al Motor DPT",
      "Recordatorios inteligentes para no perder plazos",
    ],
    gep: false,
    borderColor: "border-blue-500",
    bgColor: "bg-white",
    textColor: "text-gray-900",
  },
  {
    name: "Empresarial",
    price: "Gs. 650.000",
    pricePeriod: "/ mes",
    highlight: false,
    idealFor: "Estudios Jurídicos",
    badge: null,
    benefits: [
      "Multi-usuario",
      "API de integración",
      "Múltiples usuarios bajo una misma marca",
      "Tablero unificado de casos y tiempos de respuesta",
      "Reportes ejecutivos listos para enviar a socios",
    ],
    gep: false,
    borderColor: "border-black",
    bgColor: "bg-white",
    textColor: "text-gray-900",
  },
  {
    name: "GEP (Elite)",
    price: "Personalizado",
    pricePeriod: "",
    highlight: false,
    idealFor: "Socios Estratégicos",
    badge: "Elite",
    benefits: [
      "Acceso Exclusivo al Motor DPT High-Ticket (24h antes)",
      "Prioridad 24h en casos complejos y de alto valor",
      "Acompañamiento estratégico para expansión regional",
      "Soporte dedicado 24/7",
    ],
    gep: true,
    borderColor: "border-yellow-400",
    bgColor: "bg-gradient-to-br from-gray-900 via-black to-gray-900",
    textColor: "text-yellow-300",
  },
] as const;

export default function PricingPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-16 px-4">
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
            Planes transparentes para cada etapa profesional
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Elige el nivel que mejor se adapta a tu práctica. Nos encargamos de la captación y del
            orden, vos te enfocás en ganar casos y cuidar a tus clientes.
          </p>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`relative rounded-2xl border-2 ${plan.borderColor} ${
                plan.highlight ? "shadow-2xl scale-105" : plan.gep ? "shadow-xl" : "shadow-lg"
              } ${plan.bgColor} ${plan.textColor} p-8 flex flex-col justify-between transition-all hover:shadow-2xl hover:scale-[1.02]`}
            >
              {/* Badge destacado */}
              {plan.badge && (
                <div
                  className={`absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-bold ${
                    plan.gep
                      ? "bg-gradient-to-r from-yellow-400 to-amber-500 text-black"
                      : plan.highlight
                      ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                      : "bg-gray-800 text-white"
                  } shadow-lg`}
                >
                  {plan.badge}
                </div>
              )}

              <div className="space-y-6">
                {/* Header */}
                <div>
                  <h2 className={`text-2xl font-bold mb-2 ${plan.gep ? "text-yellow-300" : "text-gray-900"}`}>
                    {plan.name}
                  </h2>
                  <p className="text-sm text-gray-600 font-medium">{plan.idealFor}</p>
                </div>

                {/* Precio */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-baseline gap-1">
                    <span className={`text-4xl font-extrabold ${plan.gep ? "text-yellow-300" : "text-gray-900"}`}>
                      {plan.price}
                    </span>
                    {plan.pricePeriod && (
                      <span className={`text-lg ${plan.gep ? "text-yellow-200/80" : "text-gray-600"}`}>
                        {plan.pricePeriod}
                      </span>
                    )}
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3 mt-6">
                  {plan.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className={`mt-0.5 shrink-0 ${plan.gep ? "text-yellow-400" : "text-green-500"}`}>
                        {plan.gep ? "✨" : "✓"}
                      </span>
                      <span className={`text-sm ${plan.gep ? "text-yellow-100" : "text-gray-700"} leading-relaxed`}>
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Button */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <Button
                  variant={plan.gep ? "primary" : plan.highlight ? "primary" : "secondary"}
                  className={`w-full rounded-xl py-3 text-base font-semibold transition-all ${
                    plan.gep
                      ? "bg-gradient-to-r from-yellow-400 to-amber-500 text-black hover:from-yellow-300 hover:to-amber-400 shadow-lg hover:shadow-xl"
                      : plan.highlight
                      ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 shadow-lg hover:shadow-xl"
                      : "bg-gray-900 text-white hover:bg-gray-800"
                  }`}
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      if (plan.gep) {
                        window.location.href = "/contacto";
                      } else {
                        window.location.href = "/register";
                      }
                    }
                  }}
                >
                  {plan.gep ? "💎 Hablar con Ventas" : "Elegir este plan"}
                </Button>
                {plan.highlight && !plan.gep && (
                  <p className="mt-3 text-xs text-gray-500 text-center">
                    Recomendado para profesionales que quieren escalar sin perder el control.
                  </p>
                )}
                {plan.gep && (
                  <p className="mt-3 text-xs text-yellow-200/90 text-center">
                    Cupos limitados. Curamos el dealflow para socios estratégicos.
                  </p>
                )}
              </div>
            </article>
          ))}
        </main>
      </div>
    </div>
  );
}

