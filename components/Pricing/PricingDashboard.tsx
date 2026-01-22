"use client";

/**
 * PricingDashboard – Dashboard de Suscripciones Premium Legal PY
 * Principios: neuromarketing, neuroventas, seguridad como beneficio tangible.
 * Plan GEP: exclusivo, sin precio público. Biometría solo al confirmar pago.
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FolderOpen,
  Zap,
  Bot,
  BarChart3,
  Shield,
  CreditCard,
  UserCheck,
  TrendingUp,
  Brain,
  Users,
  Rocket,
  LayoutDashboard,
  Sparkles,
  Crown,
  Briefcase,
  GraduationCap,
  ChevronRight,
  Lock,
  X,
} from "lucide-react";
import Button from "@/components/Button";
import PaymentAuthorizationModal from "@/components/Payments/PaymentAuthorizationModal";
import { getSession } from "@/lib/auth";
import Link from "next/link";

// ─── Tipos ─────────────────────────────────────────────────────────────────

type PlanId = "basico" | "profesional" | "premium" | "edtech" | "gep";

interface SecurityBlock {
  icon: "auth" | "pay" | "identity" | "biometric" | "audit" | "roles" | "predictive";
  label: string;
}

interface PlanConfig {
  id: PlanId;
  name: string;
  tagline: string;
  price: number | null;
  priceLabel?: string;
  period: string;
  idealFor: string;
  badge?: string;
  highlight?: boolean;
  gep?: boolean;
  benefits: { icon: string; label: string }[];
  security: SecurityBlock[];
  iaLabel: string;
  cta: string;
  ctaAria: string;
}

// ─── Datos de planes ───────────────────────────────────────────────────────

const PLANS: PlanConfig[] = [
  {
    id: "basico",
    name: "Básico",
    tagline: "Tu actividad legal, ordenada y protegida",
    price: 150_000,
    period: "/ mes",
    idealFor: "Pequeños estudios / profesionales independientes",
    benefits: [
      { icon: "folder", label: "Gestión inteligente de expedientes" },
      { icon: "zap", label: "Automatización legal básica" },
      { icon: "bot", label: "Justo & Victoria en modo asistido" },
      { icon: "chart", label: "Control básico de actividad" },
    ],
    security: [
      { icon: "auth", label: "Autenticación segura" },
      { icon: "pay", label: "Pagos cifrados 256-bit" },
      { icon: "identity", label: "Protección de identidad" },
    ],
    iaLabel: "Justo & Victoria en modo asistido",
    cta: "Asegurar mi actividad legal",
    ctaAria: "Elegir plan Básico y asegurar mi actividad legal",
  },
  {
    id: "profesional",
    name: "Profesional",
    tagline: "Potencia tu firma con inteligencia y control",
    price: 350_000,
    period: "/ mes",
    idealFor: "Estudios medianos",
    badge: "Elección inteligente",
    highlight: true,
    benefits: [
      { icon: "all", label: "Todo Básico incluido" },
      { icon: "trend", label: "Inteligencia de negocio legal" },
      { icon: "brain", label: "Analíticas avanzadas de casos" },
      { icon: "zap", label: "Automatización avanzada" },
      { icon: "priority", label: "Prioridad en matching con clientes" },
    ],
    security: [
      { icon: "biometric", label: "Biometría por acción crítica" },
      { icon: "auth", label: "Monitoreo activo de sesiones" },
      { icon: "audit", label: "Auditoría de acciones" },
    ],
    iaLabel: "Justo & Victoria + analíticas avanzadas",
    cta: "Potenciar mi firma ahora",
    ctaAria: "Elegir plan Profesional y potenciar mi firma",
  },
  {
    id: "premium",
    name: "Premium",
    tagline: "Escala con control total",
    price: 650_000,
    period: "/ mes",
    idealFor: "Estudios grandes / equipos completos",
    benefits: [
      { icon: "all", label: "Todo Profesional incluido" },
      { icon: "users", label: "Usuarios ilimitados" },
      { icon: "rocket", label: "Acceso anticipado a nuevas funciones" },
      { icon: "dashboard", label: "Panel ejecutivo completo" },
      { icon: "ia", label: "IA sin límites operativos" },
    ],
    security: [
      { icon: "roles", label: "Control de roles y permisos granulares" },
      { icon: "audit", label: "Auditoría completa exportable" },
      { icon: "predictive", label: "Soporte predictivo ante riesgos operativos" },
    ],
    iaLabel: "IA sin límites operativos",
    cta: "Escalar con control total",
    ctaAria: "Elegir plan Premium y escalar con control total",
  },
  {
    id: "edtech",
    name: "Estudiante / EdTech",
    tagline: "Invierte en tu futuro legal",
    price: 120_000,
    period: "/ mes",
    idealFor: "Estudiantes y clientes educativos",
    benefits: [
      { icon: "book", label: "Acceso completo a contenidos educativos" },
      { icon: "bot", label: "Justo & Victoria en modo formativo" },
      { icon: "brain", label: "Simulación de casos reales" },
      { icon: "shield", label: "Seguridad legal básica incluida" },
      { icon: "promo", label: "Promo cruzada si luego contrata plan profesional" },
    ],
    security: [
      { icon: "auth", label: "Autenticación segura" },
      { icon: "identity", label: "Protección de identidad" },
    ],
    iaLabel: "Justo & Victoria en modo formativo",
    cta: "Invertir en mi futuro legal",
    ctaAria: "Elegir plan Estudiante e invertir en mi futuro legal",
  },
];

const GEP_PLAN: PlanConfig = {
  id: "gep",
  name: "GEP",
  tagline: "Gold Enterprise Partner",
  price: null,
  idealFor: "Socios estratégicos",
  period: "",
  benefits: [
    { icon: "crown", label: "Derecho de Preferencia DPT (acceso a casos high-ticket antes que nadie)" },
    { icon: "trend", label: "Inteligencia de mercado exclusiva" },
    { icon: "talent", label: "Captación prioritaria de talento" },
    { icon: "council", label: "Asiento en Consejo Consultivo Legal PY" },
    { icon: "renew", label: "Licencia renovable con revalorización" },
  ],
  security: [],
  iaLabel: "Acceso exclusivo a inteligencia de mercado",
  cta: "Solicitar conversación estratégica",
  ctaAria: "Solicitar conversación estratégica para GEP",
  gep: true,
};

// ─── Helpers ───────────────────────────────────────────────────────────────

function BenefitIcon({ icon }: { icon: string }) {
  const size = "w-4 h-4 shrink-0";
  switch (icon) {
    case "folder":
      return <FolderOpen className={size} />;
    case "zap":
      return <Zap className={size} />;
    case "bot":
      return <Bot className={size} />;
    case "chart":
      return <BarChart3 className={size} />;
    case "trend":
      return <TrendingUp className={size} />;
    case "brain":
      return <Brain className={size} />;
    case "priority":
      return <Briefcase className={size} />;
    case "all":
      return <Sparkles className={size} />;
    case "users":
      return <Users className={size} />;
    case "rocket":
      return <Rocket className={size} />;
    case "dashboard":
      return <LayoutDashboard className={size} />;
    case "ia":
      return <Sparkles className={size} />;
    case "book":
      return <GraduationCap className={size} />;
    case "shield":
      return <Shield className={size} />;
    case "promo":
      return <TrendingUp className={size} />;
    case "crown":
      return <Crown className={size} />;
    case "talent":
      return <Users className={size} />;
    case "council":
      return <Briefcase className={size} />;
    case "renew":
      return <Zap className={size} />;
    default:
      return <ChevronRight className={size} />;
  }
}

function SecurityIcon({ type }: { type: SecurityBlock["icon"] }) {
  const size = "w-4 h-4 shrink-0";
  switch (type) {
    case "auth":
      return <Lock className={size} />;
    case "pay":
      return <CreditCard className={size} />;
    case "identity":
      return <UserCheck className={size} />;
    case "biometric":
      return <UserCheck className={size} />;
    case "audit":
      return <BarChart3 className={size} />;
    case "roles":
      return <Users className={size} />;
    case "predictive":
      return <Brain className={size} />;
    default:
      return <Shield className={size} />;
  }
}

// ─── Card de plan (con precio) ──────────────────────────────────────────────

function PlanCard({
  plan,
  onCtaClick,
}: {
  plan: PlanConfig;
  onCtaClick: (plan: PlanConfig) => void;
}) {
  const isGep = plan.gep ?? false;
  const isHighlight = plan.highlight ?? false;
  const hasPrice = plan.price != null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`
        relative rounded-2xl border-2 overflow-hidden
        flex flex-col
        transition-all duration-300 hover:shadow-xl
        ${isGep ? "gep-card bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#0a0a0a] border-[#C9A24D]/50" : ""}
        ${isHighlight ? "scale-105 shadow-2xl shadow-[#C9A24D]/30 border-[#C9A24D]/70 bg-gradient-to-br from-[#13253A] via-[#1a3045] to-[#13253A] ring-2 ring-[#C9A24D]/20" : ""}
        ${!isGep && !isHighlight ? "bg-[#13253A] border-white/15 hover:border-[#C9A24D]/30 hover:scale-[1.02]" : ""}
      `}
    >
      {plan.badge && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: "spring" }}
          className={`
            absolute -top-0.5 left-1/2 -translate-x-1/2 px-5 py-2 rounded-b-xl text-xs font-extrabold shadow-2xl z-10
            ${isHighlight ? "bg-gradient-to-r from-[#C9A24D] via-[#d4af5a] to-[#C9A24D] text-black animate-pulse" : "bg-white/10 text-[#C9A24D] backdrop-blur-sm"}
          `}
        >
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            {plan.badge}
          </span>
        </motion.div>
      )}

      <div className={`p-6 md:p-8 flex flex-col flex-1 ${isGep ? "text-white" : "text-white"}`}>
        <div className="mb-4">
          <h3 className={`text-xl md:text-2xl font-bold ${isGep ? "text-[#C9A24D]" : "text-white"}`}>
            {plan.name}
          </h3>
          <p className="text-sm text-white/60 mt-1">{plan.idealFor}</p>
        </div>

        {/* Precio: solo si no es GEP */}
        {hasPrice && plan.price != null && (
          <div className="mb-6 flex items-baseline gap-1">
            <span className="text-3xl md:text-4xl font-extrabold text-[#C9A24D]">
              Gs. {plan.price.toLocaleString("es-PY")}
            </span>
            <span className="text-white/60">{plan.period}</span>
          </div>
        )}

        {/* Beneficios */}
        <ul className="space-y-3 flex-1">
          {plan.benefits.map((b, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-0.5 text-[#C9A24D]">
                <BenefitIcon icon={b.icon} />
              </span>
              <span className="text-sm text-white/85">{b.label}</span>
            </li>
          ))}
        </ul>

        {/* Bloque Seguridad - Beneficio Tangible */}
        {plan.security.length > 0 && (
          <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-green-500/10 border border-green-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/5 to-transparent animate-pulse" />
            <div className="relative">
              <p className="text-xs font-bold text-green-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-400" /> Seguridad como Beneficio
              </p>
              <ul className="space-y-2.5">
                {plan.security.map((s, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-xs text-white/90">
                    <span className="text-green-400/90 shrink-0">
                      <SecurityIcon type={s.icon} />
                    </span>
                    <span className="font-medium">{s.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Bloque IA */}
        <div className="mt-4 p-4 rounded-xl bg-[#C9A24D]/10 border border-[#C9A24D]/20">
          <p className="text-xs font-semibold text-[#C9A24D] uppercase tracking-wider mb-1 flex items-center gap-2">
            <Bot className="w-3.5 h-3.5" /> Asistencia IA
          </p>
          <p className="text-sm text-white/85">{plan.iaLabel}</p>
        </div>

        {/* CTA con Embedded Commands - Neuroventas */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant="primary"
              size="lg"
              className={`w-full rounded-xl py-4 font-bold text-base bg-gradient-to-r from-[#C9A24D] to-[#d4af5a] hover:from-[#d4af5a] hover:to-[#C9A24D] text-black transition-all hover:shadow-xl hover:shadow-[#C9A24D]/40 ${
                isHighlight ? "ring-2 ring-[#C9A24D]/50 ring-offset-2 ring-offset-[#13253A]" : ""
              }`}
              onClick={() => onCtaClick(plan)}
              aria-label={plan.ctaAria}
            >
              <span className="flex items-center justify-center gap-2">
                {plan.cta}
                <ChevronRight className="w-5 h-5 inline-block animate-pulse" />
              </span>
            </Button>
          </motion.div>
          {isHighlight && !isGep && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-3 text-xs text-[#C9A24D]/90 text-center font-medium"
            >
              ⚡ Recomendado para estudios que quieren crecer con control y seguridad
            </motion.p>
          )}
          {plan.id === "edtech" && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-3 p-3 rounded-lg bg-[#C9A24D]/15 border border-[#C9A24D]/30"
            >
              <p className="text-xs font-semibold text-[#C9A24D] text-center">
                🎓 Promo: Si luego contratas plan Profesional, obtienes descuento especial
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.article>
  );
}

// ─── Card GEP (separada, sin precio) ────────────────────────────────────────

function GepCard({ onCtaClick }: { onCtaClick: () => void }) {
  const plan = GEP_PLAN;
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="gep-card relative rounded-2xl overflow-hidden border-2 border-[#C9A24D]/50 bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#0a0a0a] mt-4 md:mt-8"
    >
      <div className="absolute inset-0 gep-glow pointer-events-none" aria-hidden="true" />
      <div className="relative p-8 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <Crown className="w-8 h-8 text-[#C9A24D]" />
            <h2 className="text-2xl md:text-3xl font-bold text-[#C9A24D]">
              GEP – Gold Enterprise Partner
            </h2>
          </div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-white/80 mb-6 max-w-2xl text-base leading-relaxed"
          >
            <span className="font-semibold text-[#C9A24D]">Exclusividad total.</span> Cupos limitados. Sin White Label. 
            <span className="italic"> Precio bajo conversación estratégica.</span>
          </motion.p>
          <ul className="space-y-3">
            {plan.benefits.map((b, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-[#C9A24D] mt-0.5">
                  <BenefitIcon icon={b.icon} />
                </span>
                <span className="text-white/90">{b.label}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:w-80 shrink-0 flex flex-col items-start md:items-end gap-4">
          <Button
            variant="primary"
            size="lg"
            className="w-full md:w-auto rounded-xl py-3.5 font-semibold bg-gradient-to-r from-[#C9A24D] to-[#d4af5a] text-black hover:from-[#d4af5a] hover:to-[#C9A24D] transition-all hover:shadow-lg hover:shadow-[#C9A24D]/30"
            onClick={onCtaClick}
            aria-label={plan.ctaAria}
          >
            {plan.cta}
            <ChevronRight className="w-4 h-4 ml-2 inline-block" />
          </Button>
          <p className="text-xs text-[#C9A24D]/80">
            Cupos limitados. Exclusividad total.
          </p>
        </div>
      </div>
    </motion.section>
  );
}

// ─── Modal GEP ──────────────────────────────────────────────────────────────

function GepModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg rounded-2xl border border-[#C9A24D]/40 bg-gradient-to-br from-[#0E1B2A] via-[#13253A] to-[#0E1B2A] p-8 shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex flex-col items-center text-center space-y-6">
              <Crown className="w-14 h-14 text-[#C9A24D]" />
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Solicitud GEP recibida</h3>
                <p className="text-white/75 text-sm">
                  Un asesor estratégico de Legal PY se pondrá en contacto contigo para una
                  conversación confidencial. Cupos limitados.
                </p>
              </div>
              <Button variant="primary" onClick={onClose} className="rounded-xl">
                Cerrar
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ─── PricingDashboard ───────────────────────────────────────────────────────

export default function PricingDashboard() {
  const [paymentModal, setPaymentModal] = useState<{
    open: boolean;
    plan: PlanConfig | null;
  }>({ open: false, plan: null });
  const [gepModalOpen, setGepModalOpen] = useState(false);
  const [session, setSession] = useState<ReturnType<typeof getSession>>(null);

  useEffect(() => {
    if (typeof window !== "undefined") setSession(getSession());
  }, []);

  const handleCta = (plan: PlanConfig) => {
    if (plan.gep) {
      setGepModalOpen(true);
      return;
    }
    if (plan.price != null) {
      setPaymentModal({ open: true, plan });
      return;
    }
    setPaymentModal({ open: false, plan: null });
  };

  const handlePaymentAuthorized = () => {
    setPaymentModal({ open: false, plan: null });
    window.location.href = "/pagos";
  };

  const selectedPlan = paymentModal.plan;
  const amount = selectedPlan?.price ?? 0;

  return (
    <div className="min-h-screen bg-[#0E1B2A]">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center max-w-3xl mx-auto mb-12 md:mb-16"
        >
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4 bg-gradient-to-r from-white via-[#C9A24D]/90 to-white bg-clip-text text-transparent"
          >
            Planes premium para cada etapa
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-white/80 leading-relaxed"
          >
            Beneficios claros, <span className="text-green-400 font-semibold">seguridad tangible</span> y asistencia IA 
            <span className="text-[#C9A24D] font-semibold"> (Justo & Victoria)</span> en cada plan.
            <br className="hidden md:block" />
            <span className="text-white/90">Elegí el que potencia tu actividad legal.</span>
          </motion.p>
        </motion.header>

        {/* Grid de planes con precio - Profesional destacado */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 relative">
          {PLANS.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <PlanCard plan={plan} onCtaClick={handleCta} />
            </motion.div>
          ))}
        </div>

        {/* GEP – separado, sin precio */}
        <GepCard onCtaClick={() => handleCta(GEP_PLAN)} />

        {/* Login prompt si no hay sesión y abrió modal de pago */}
        <AnimatePresence>
          {paymentModal.open && !session && (
            <motion.div
              key="login-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div
                role="button"
                tabIndex={0}
                onClick={() => setPaymentModal({ open: false, plan: null })}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setPaymentModal({ open: false, plan: null });
                  }
                }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-default focus:outline-none focus:ring-2 focus:ring-[#C9A24D] focus:ring-inset"
                aria-label="Cerrar y volver a planes"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="relative rounded-2xl border border-white/20 bg-[#13253A] p-8 max-w-md text-center"
              >
                <p className="text-white mb-6">
                  Iniciá sesión para continuar con la suscripción. La biometría se activará al
                  confirmar el pago.
                </p>
                <div className="flex gap-3 justify-center">
                  <Link href="/login">
                    <Button variant="primary">Iniciar sesión</Button>
                  </Link>
                  <Button variant="outline" onClick={() => setPaymentModal({ open: false, plan: null })}>
                    Cerrar
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal de autorización de pago (biometría al confirmar) */}
        {session && selectedPlan && (
          <PaymentAuthorizationModal
            isOpen={paymentModal.open}
            onClose={() => setPaymentModal({ open: false, plan: null })}
            onAuthorize={handlePaymentAuthorized}
            amount={amount}
            currency="PYG"
            description={`Legal PY – ${selectedPlan.name}`}
            email={session.user?.email}
          />
        )}

        <GepModal isOpen={gepModalOpen} onClose={() => setGepModalOpen(false)} />
      </div>
    </div>
  );
}
