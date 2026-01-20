"use client";

import Card from "@/components/Card";
import Button from "@/components/Button";

type PlanRole = "cliente" | "profesional" | "estudiante";

interface PlanFeature {
  label: string;
  highlight?: boolean;
}

interface Plan {
  id: string;
  role: PlanRole;
  name: string;
  badge?: string;
  description: string;
  priceLabel: string;
  billingNote?: string;
  features: PlanFeature[];
  ctaLabel: string;
}

const PLANS: Plan[] = [
  {
    id: "cliente-basic",
    role: "cliente",
    name: "Cliente",
    description: "Para personas que necesitan organizar sus trámites, expedientes y pagos con apoyo profesional.",
    priceLabel: "Sin costo de uso de plataforma",
    billingNote: "Los honorarios se acuerdan directamente con el profesional.",
    features: [
      { label: "Gestión básica de casos y documentos" },
      { label: "Historial de pagos registrado (sin procesar fondos)", highlight: true },
      { label: "Chat y agenda con profesionales aliados" },
      { label: "Acceso a expedientes y actualizaciones en línea" },
    ],
    ctaLabel: "Registrarme como Cliente",
  },
  {
    id: "profesional-standard",
    role: "profesional",
    name: "Profesional",
    description: "Para estudios, abogados, gestores y escribanos que quieren ordenar su flujo de trabajo legal.",
    priceLabel: "Plan Profesional (monto a definir)",
    billingNote: "Licencia de uso por profesional o por estudio, según acuerdo comercial.",
    features: [
      { label: "Panel de casos nacionales e internacionales", highlight: true },
      { label: "Gestión de clientes, reputación y antecedentes" },
      { label: "Registro de pagos sin intermediación financiera" },
      { label: "Acceso a Derivación Priorizada por Perfil Técnico (DPT)" },
      { label: "Opción de upgrade a socio GEP Gold en modalidad Enterprise" },
    ],
    ctaLabel: "Soy Profesional / Estudio",
  },
  {
    id: "profesional-gep-gold",
    role: "profesional",
    name: "GEP Gold (Enterprise)",
    badge: "Socio Estratégico",
    description:
      "Plan enterprise para estudios aliados con foco en captación internacional y Derivación Priorizada.",
    priceLabel: "Licencia Enterprise a medida",
    billingNote: "Condiciones definidas por contrato (equity, exclusividad y roadmap prioritario).",
    features: [
      { label: "Ventana de evaluación prioritaria para casos internacionales (DPT)", highlight: true },
      { label: "Derivación por perfil técnico, experiencia y jurisdicción" },
      { label: "Branding interno (dominio, logo, flujos propios)" },
      { label: "Módulos y funciones enterprise no visibles para otros usuarios" },
      { label: "Consultoría legaltech y priorización en el roadmap" },
    ],
    ctaLabel: "Hablar sobre GEP Gold",
  },
  {
    id: "estudiante-basic",
    role: "estudiante",
    name: "Estudiante / Pasante",
    description: "Para estudiantes y pasantes que participan en flujos de trabajo supervisados.",
    priceLabel: "Acceso controlado por estudio / universidad",
    billingNote: "Sin cobro directo al estudiante desde la plataforma.",
    features: [
      { label: "Acceso a casos y tareas asignadas por supervisores" },
      { label: "Espacios de práctica y formación interna" },
      { label: "Flujos en modo sandbox / supervisado", highlight: true },
      { label: "Sin acceso a decisiones críticas ni a datos sensibles sin permiso" },
    ],
    ctaLabel: "Soy Estudiante / Pasante",
  },
];

export default function PlanesPage() {
  const clientePlans = PLANS.filter((p) => p.role === "cliente");
  const profesionalPlans = PLANS.filter((p) => p.role === "profesional");
  const estudiantePlans = PLANS.filter((p) => p.role === "estudiante");

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <h1 className="text-2xl md:text-3xl font-extrabold text-white">Planes y Suscripciones</h1>
        <p className="text-sm md:text-base text-white/70 max-w-2xl">
          Esta es una vista MVP de planes. Todos los montos son referenciales y la plataforma NO procesa
          pagos ni reemplaza acuerdos contractuales entre clientes y estudios. Sirve para entender cómo se
          organiza Legal PY por rol.
        </p>
      </header>

      {/* Planes para Cliente */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-white">Para Clientes</h2>
        <p className="text-sm text-white/60">
          Personas que necesitan ordenar sus trámites, comunicaciones y pagos con apoyo profesional.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {clientePlans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      </section>

      {/* Planes para Profesionales / Estudios */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-white">Para Profesionales y Estudios</h2>
        <p className="text-sm text-white/60">
          Abogados, escribanos, gestores, estudios y consorcios que quieren usar Legal PY como infraestructura
          de captación, gestión de casos y coordinación con clientes.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {profesionalPlans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      </section>

      {/* Planes para Estudiantes / Pasantes */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-white">Para Estudiantes y Pasantes</h2>
        <p className="text-sm text-white/60">
          Perfiles en formación que se integran a la plataforma a través de un estudio, universidad o
          institución aliada, siempre bajo supervisión.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {estudiantePlans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      </section>

      {/* Disclaimer legal de planes */}
      <section className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-white/60 space-y-2">
        <p>
          Legal PY actúa como infraestructura tecnológica. Las condiciones económicas finales, honorarios,
          exclusividades y alcances de servicio se definen siempre por contrato directo entre el estudio,
          profesional y sus clientes.
        </p>
        <p>
          La información de esta pantalla es referencial y forma parte de una demostración funcional. No
          constituye oferta pública ni promesa de resultado legal.
        </p>
      </section>
    </div>
  );
}

function PlanCard({ plan }: { plan: Plan }) {
  return (
    <Card className="h-full flex flex-col justify-between border border-white/10 bg-[#091320]">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
            <p className="mt-1 text-xs text-white/60">{plan.description}</p>
          </div>
          {plan.badge && (
            <span className="rounded-full bg-[#C9A24D]/10 px-3 py-1 text-xs font-semibold text-[#C9A24D]">
              {plan.badge}
            </span>
          )}
        </div>

        <div className="mt-2">
          <p className="text-sm font-semibold text-[#C9A24D]">{plan.priceLabel}</p>
          {plan.billingNote && <p className="text-xs text-white/60 mt-1">{plan.billingNote}</p>}
        </div>

        <ul className="mt-3 space-y-1 text-xs text-white/70">
          {plan.features.map((f) => (
            <li key={f.label} className="flex items-start gap-2">
              <span className="mt-[2px] text-[#C9A24D]">•</span>
              <span className={f.highlight ? "font-semibold text-white" : ""}>{f.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-3">
        <p className="text-[11px] text-white/50">
          Acción demo — podrás elegir este perfil en el registro o activar el plan con el equipo comercial.
        </p>
        <Button
          type="button"
          size="sm"
          variant="primary"
          className="whitespace-nowrap"
          onClick={() => {
            // Sólo feedback mock, sin flujo real de pago ni upgrade
            alert(`Demo de plan: ${plan.name}. La activación real se coordina con el equipo comercial.`);
          }}
        >
          {plan.ctaLabel}
        </Button>
      </div>
    </Card>
  );
}

