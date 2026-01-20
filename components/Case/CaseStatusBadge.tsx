"use client";

import Badge from "@/components/Badge";
import { CaseStatus } from "@/lib/cases";

interface CaseStatusBadgeProps {
  status: CaseStatus;
  showLabel?: boolean;
}

export default function CaseStatusBadge({ status, showLabel = true }: CaseStatusBadgeProps) {
  const statusConfig = {
    activo: {
      label: "En Curso",
      variant: "accent" as const,
      icon: "🟢",
    },
    "en-pausa": {
      label: "En Pausa",
      variant: "terracota" as const,
      icon: "⏸️",
    },
    cerrado: {
      label: "Cerrado",
      variant: "outline" as const,
      icon: "✅",
    },
    archivado: {
      label: "Archivado",
      variant: "outline" as const,
      icon: "📦",
    },
  };

  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} className="flex items-center gap-1.5">
      <span>{config.icon}</span>
      {showLabel && <span>{config.label}</span>}
    </Badge>
  );
}
