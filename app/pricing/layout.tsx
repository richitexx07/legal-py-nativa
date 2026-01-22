import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Planes y Suscripciones | Legal PY",
  description:
    "Planes premium para cada etapa: Básico, Profesional, Premium, EdTech y GEP. Seguridad tangible y asistencia IA (Justo & Victoria).",
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
