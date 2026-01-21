"use client";

import Button from "@/components/Button";

const plans = [
  {
    name: "Básico",
    price: "Gs. 150.000 / mes",
    highlight: false,
    tone: "from-slate-800 to-slate-900",
    badge: "Para empezar",
    benefits: [
      "Publica casos sin comisiones ocultas",
      "Recibe respuestas ordenadas en tu panel",
      "Historial básico de gestiones por 6 meses",
    ],
  },
  {
    name: "Profesional",
    price: "Gs. 350.000 / mes",
    highlight: true,
    tone: "from-sky-900 to-slate-900",
    badge: "El más popular",
    benefits: [
      "Tu perfil aparece primero para casos de tu especialidad",
      "Recibe clientes mientras duermes gracias al Motor DPT",
      "Recordatorios inteligentes para no perder plazos",
    ],
  },
  {
    name: "Empresarial",
    price: "Gs. 650.000 / mes",
    highlight: false,
    tone: "from-violet-900 to-slate-900",
    badge: "Para estudios y consorcios",
    benefits: [
      "Múltiples usuarios bajo una misma marca",
      "Tablero unificado de casos y tiempos de respuesta",
      "Reportes ejecutivos listos para enviar a socios",
    ],
  },
  {
    name: "GEP (Gold Enterprise)",
    price: "Hablar con Ventas",
    highlight: true,
    tone: "from-black via-slate-900 to-black",
    badge: "Elite",
    benefits: [
      "Acceso exclusivo al Motor DPT High-Ticket",
      "Prioridad 24h en casos complejos y de alto valor",
      "Acompañamiento estratégico para expansión regional",
    ],
    gep: true,
  },
] as const;

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050816] via-[#020617] to-black text-white py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-10">
        <header className="text-center space-y-3">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Planes de Suscripción pensados para tus metas legales
          </h1>
          <p className="text-sm md:text-base text-white/70 max-w-2xl mx-auto">
            Elige el nivel que mejor se adapta a tu práctica. Nos encargamos de la captación y del
            orden, vos te enfocás en ganar casos y cuidar a tus clientes.
          </p>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`relative rounded-3xl border ${
                plan.gep
                  ? "border-yellow-400/70 shadow-[0_0_40px_rgba(250,204,21,0.35)]"
                  : plan.highlight
                  ? "border-sky-400/70 shadow-[0_0_30px_rgba(56,189,248,0.25)]"
                  : "border-white/10 shadow-xl"
              } bg-gradient-to-b ${plan.tone} p-6 flex flex-col justify-between`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-xl font-bold">{plan.name}</h2>
                  <span
                    className={`text-xs px-2 py-1 rounded-full border ${
                      plan.gep
                        ? "border-yellow-400/70 text-yellow-200 bg-yellow-500/10"
                        : plan.highlight
                        ? "border-sky-400/70 text-sky-200 bg-sky-500/10"
                        : "border-white/20 text-white/70 bg-white/5"
                    }`}
                  >
                    {plan.badge}
                  </span>
                </div>
                <p className={`text-lg font-semibold ${plan.gep ? "text-yellow-300" : "text-white"}`}>
                  {plan.price}
                </p>
                <ul className="mt-2 space-y-2 text-sm text-white/80">
                  {plan.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-2">
                      <span className="mt-0.5">{plan.gep ? "✨" : "✔️"}</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6">
                <Button
                  variant="primary"
                  className={`w-full rounded-2xl py-2.5 text-sm font-semibold ${
                    plan.gep
                      ? "bg-gradient-to-r from-yellow-400 to-amber-500 text-black hover:from-yellow-300 hover:to-amber-400"
                      : plan.highlight
                      ? "bg-gradient-to-r from-sky-400 to-cyan-400 text-slate-900 hover:from-sky-300 hover:to-cyan-300"
                      : "bg-white text-slate-900 hover:bg-slate-100"
                  }`}
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      window.location.href = plan.gep ? "/contacto" : "/register";
                    }
                  }}
                >
                  {plan.gep ? "Hablar con el equipo GEP" : "Elegir este plan"}
                </Button>
                {plan.highlight && !plan.gep && (
                  <p className="mt-2 text-[11px] text-white/60 text-center">
                    Recomendado para profesionales que quieren escalar sin perder el control.
                  </p>
                )}
                {plan.gep && (
                  <p className="mt-2 text-[11px] text-yellow-200/80 text-center">
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

