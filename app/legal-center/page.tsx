import { getLegalPolicies } from "@/lib/legal";
import Card from "@/components/Card";
import Tabs from "@/components/Tabs";
import Link from "next/link";

export const metadata = {
  title: "Centro Legal y de Transparencia - Legal PY",
  description: "Políticas y términos de uso de Legal PY",
};

export default function LegalCenterPage() {
  const policyLevels = getLegalPolicies();

  const tabs = policyLevels.map((level) => ({
    id: level.id,
    label: `${level.emoji} ${level.title.split(':')[0]}`,
    content: (
      <div className="space-y-6">
        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <p className="text-sm text-white/80 leading-relaxed">{level.description}</p>
        </div>
        
        <div className="space-y-6">
          {level.policies.map((policy) => (
            <Card key={policy.number} className="p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#C9A24D]/20 flex items-center justify-center">
                    <span className="text-[#C9A24D] font-bold text-sm">{policy.number}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">{policy.title}</h3>
                    <div className="prose prose-invert max-w-none">
                      <div className="text-sm text-white/80 leading-relaxed whitespace-pre-line">
                        {policy.content}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    ),
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E1B2A] via-[#13253A] to-[#0E1B2A]">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Centro Legal y de Transparencia
          </h1>
          <p className="text-lg text-white/70 mb-2">
            Bienvenido al Centro de Gobernanza de Legal PY
          </p>
          <p className="text-sm text-white/60">
            Para facilitar su lectura, hemos clasificado nuestras políticas por orden de prioridad e impacto en su experiencia.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="mb-6 flex flex-wrap gap-4 justify-center">
          <Link
            href="/legal/terms"
            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:text-white transition text-sm"
          >
            📄 Términos y Condiciones
          </Link>
          <Link
            href="/legal/privacy"
            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:text-white transition text-sm"
          >
            🔒 Política de Privacidad
          </Link>
        </div>

        {/* Tabs con Políticas */}
        <Card className="p-6">
          <Tabs tabs={tabs} defaultTab="nivel-1" />
        </Card>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-white/60 mb-2">
            ¿Tienes preguntas sobre nuestras políticas?
          </p>
          <p className="text-sm text-white/60">
            Contacta a nuestro equipo legal:{" "}
            <a
              href="mailto:dpo@legalpy.com"
              className="text-[#C9A24D] hover:underline"
            >
              dpo@legalpy.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
