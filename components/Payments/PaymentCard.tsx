"use client";

import Card from "@/components/Card";
import Badge from "@/components/Badge";
import { PaymentRecord } from "@/lib/payments";
import Link from "next/link";

interface PaymentCardProps {
  payment: PaymentRecord;
  showCaseLink?: boolean;
}

export default function PaymentCard({ payment, showCaseLink = true }: PaymentCardProps) {
  const formatAmount = (amount: number, currency: string) => {
    const formatter = new Intl.NumberFormat("es-PY", {
      style: "currency",
      currency: currency === "PYG" ? "PYG" : currency,
      minimumFractionDigits: currency === "PYG" ? 0 : 2,
      maximumFractionDigits: currency === "PYG" ? 0 : 2,
    });
    return formatter.format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-PY", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getMethodIcon = (method: string) => {
    const icons: Record<string, string> = {
      "transferencia-bancaria": "🏦",
      "tarjeta-credito": "💳",
      "tarjeta-debito": "💳",
      efectivo: "💵",
      cheque: "📝",
      "billetera-digital": "📱",
      crypto: "₿",
      otro: "🔷",
    };
    return icons[method] || "💰";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verificado":
        return "accent";
      case "registrado":
        return "outline";
      case "pendiente":
        return "terracota";
      case "rechazado":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <Card hover>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <p className="text-xs text-white/60 font-mono">{payment.paymentNumber}</p>
              <Badge variant={getStatusColor(payment.status)} className="text-xs">
                {payment.status === "verificado" && "✓"}
                {payment.status === "pendiente" && "⏳"}
                {payment.status === "rechazado" && "✗"}
                {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
              </Badge>
            </div>
            <h3 className="font-semibold text-white text-lg">
              {formatAmount(payment.amount, payment.currency)}
            </h3>
            <p className="text-sm text-white/70 mt-1">{payment.description}</p>
          </div>
          <div className="text-3xl shrink-0">{getMethodIcon(payment.method)}</div>
        </div>

        {/* Detalles */}
        <div className="grid grid-cols-2 gap-4 text-sm pt-3 border-t border-white/10">
          <div>
            <span className="text-white/60">Método:</span>
            <p className="text-white/80 mt-1 capitalize">
              {payment.method.replace(/-/g, " ")}
            </p>
          </div>
          <div>
            <span className="text-white/60">Fecha:</span>
            <p className="text-white/80 mt-1">{formatDate(payment.paymentDate)}</p>
          </div>
          {payment.reference && (
            <div>
              <span className="text-white/60">Referencia:</span>
              <p className="text-white/80 mt-1 font-mono text-xs">{payment.reference}</p>
            </div>
          )}
          {payment.caseId && showCaseLink && (
            <div>
              <span className="text-white/60">Caso:</span>
              <Link
                href={`/casos/${payment.caseId}`}
                className="text-[#C9A24D] hover:underline mt-1 block"
              >
                Ver caso →
              </Link>
            </div>
          )}
        </div>

        {/* Notas */}
        {payment.notes && (
          <div className="pt-3 border-t border-white/10">
            <p className="text-xs text-white/60 mb-1">Notas:</p>
            <p className="text-sm text-white/70">{payment.notes}</p>
          </div>
        )}

        {/* Verificado */}
        {payment.verifiedAt && (
          <div className="pt-3 border-t border-white/10">
            <p className="text-xs text-white/60">
              ✓ Verificado el {formatDate(payment.verifiedAt)}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
