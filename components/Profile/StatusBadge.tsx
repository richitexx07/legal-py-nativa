"use client";

import Badge from "@/components/Badge";
import { ProfessionalStatus } from "@/lib/reputation";

interface StatusBadgeProps {
  status: ProfessionalStatus;
  showLabel?: boolean;
}

export default function StatusBadge({ status, showLabel = true }: StatusBadgeProps) {
  const statusConfig = {
    activo: {
      label: "Activo",
      variant: "accent" as const,
      icon: "✅",
      color: "text-green-400",
    },
    suspendido: {
      label: "Suspendido",
      variant: "outline" as const,
      icon: "⛔",
      color: "text-red-400",
    },
    "en-revision": {
      label: "En Revisión",
      variant: "outline" as const,
      icon: "⏳",
      color: "text-yellow-400",
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
