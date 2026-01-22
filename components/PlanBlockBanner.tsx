"use client";

import Link from "next/link";
import Button from "@/components/Button";

export type BlockedAction = "create_case" | "upload_doc" | "contact_pro" | "reservar";

const MESSAGES: Record<BlockedAction, string> = {
  create_case: "Activá un plan para crear casos y recibir propuestas de profesionales.",
  upload_doc: "Activá un plan para subir documentos legales.",
  contact_pro: "Activá un plan para contactar profesionales y reservar citas.",
  reservar: "Activá un plan para reservar citas con profesionales.",
};

interface PlanBlockBannerProps {
  action: BlockedAction;
  className?: string;
  /** Si true, muestra solo el texto (sin CTA). */
  compact?: boolean;
}

export default function PlanBlockBanner({ action, className = "", compact }: PlanBlockBannerProps) {
  const msg = MESSAGES[action];
  return (
    <div
      className={`rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 ${className}`}
      role="status"
      aria-live="polite"
    >
      <p className="text-sm text-amber-200/90">{msg}</p>
      {!compact && (
        <Link href="/pricing" className="mt-2 inline-block">
          <Button variant="primary" size="sm" className="rounded-xl bg-[#C9A24D] hover:bg-[#b8943f] text-black">
            Ver planes →
          </Button>
        </Link>
      )}
    </div>
  );
}
