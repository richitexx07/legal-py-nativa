"use client";

import Card from "@/components/Card";
import { getPaymentStats, PaymentFilters } from "@/lib/payments";

interface PaymentStatsProps {
  filters?: PaymentFilters;
}

export default function PaymentStats({ filters }: PaymentStatsProps) {
  const stats = getPaymentStats(filters);

  const formatAmount = (amount: number) => {
    // En producción, esto debería manejar múltiples monedas
    return new Intl.NumberFormat("es-PY", {
      style: "currency",
      currency: "PYG",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <div className="text-center">
          <p className="text-2xl font-bold text-[#C9A24D]">{stats.total}</p>
          <p className="text-sm text-white/70 mt-1">Total de Pagos</p>
        </div>
      </Card>

      <Card>
        <div className="text-center">
          <p className="text-2xl font-bold text-[#C9A24D]">{formatAmount(stats.totalAmount)}</p>
          <p className="text-sm text-white/70 mt-1">Monto Total</p>
        </div>
      </Card>

      <Card>
        <div className="text-center">
          <p className="text-2xl font-bold text-[#C9A24D]">{stats.byStatus.verificado}</p>
          <p className="text-sm text-white/70 mt-1">Verificados</p>
        </div>
      </Card>

      <Card>
        <div className="text-center">
          <p className="text-2xl font-bold text-[#C9A24D]">{stats.byStatus.pendiente}</p>
          <p className="text-sm text-white/70 mt-1">Pendientes</p>
        </div>
      </Card>
    </div>
  );
}
