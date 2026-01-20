"use client";

import { useState } from "react";
import { PaymentRecord, PaymentFilters, getPaymentHistory } from "@/lib/payments";
import Card from "@/components/Card";
import Button from "@/components/Button";
import PaymentCard from "./PaymentCard";
import PaymentDisclaimer from "./PaymentDisclaimer";

interface PaymentHistoryProps {
  filters?: PaymentFilters;
  showRegisterButton?: boolean;
  onRegisterClick?: () => void;
}

export default function PaymentHistory({
  filters,
  showRegisterButton = false,
  onRegisterClick,
}: PaymentHistoryProps) {
  const [sortBy, setSortBy] = useState<"date" | "amount">("date");
  const [statusFilter, setStatusFilter] = useState<string>("");

  const history = getPaymentHistory(filters);
  const visibleMonths = history.visibleMonths;

  let displayPayments = [...history.payments];

  // Aplicar filtro de estado
  if (statusFilter) {
    displayPayments = displayPayments.filter((p) => p.status === statusFilter);
  }

  // Ordenar
  if (sortBy === "amount") {
    displayPayments.sort((a, b) => b.amount - a.amount);
  } else {
    displayPayments.sort(
      (a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime()
    );
  }

  const formatTotal = (payments: PaymentRecord[]) => {
    const totals: Record<string, number> = {};
    payments.forEach((p) => {
      totals[p.currency] = (totals[p.currency] || 0) + p.amount;
    });
    return totals;
  };

  const totals = formatTotal(displayPayments);

  return (
    <div className="space-y-6">
      <PaymentDisclaimer />

      {/* Header y controles */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-white">Historial de Pagos</h2>
          <p className="text-sm text-white/60 mt-1">
            Mostrando últimos {visibleMonths} meses ({history.total} registros)
          </p>
        </div>
        {showRegisterButton && onRegisterClick && (
          <Button variant="primary" onClick={onRegisterClick}>
            + Registrar Pago
          </Button>
        )}
      </div>

      {/* Totales */}
      {Object.keys(totals).length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Object.entries(totals).map(([currency, amount]) => {
            const formatter = new Intl.NumberFormat("es-PY", {
              style: "currency",
              currency: currency === "PYG" ? "PYG" : currency,
              minimumFractionDigits: currency === "PYG" ? 0 : 2,
            });
            return (
              <Card key={currency}>
                <div className="text-center">
                  <p className="text-xs text-white/60 mb-1">{currency}</p>
                  <p className="text-xl font-bold text-[#C9A24D]">
                    {formatter.format(amount)}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm text-white/60">Ordenar por:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "date" | "amount")}
            className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
            style={{ colorScheme: "dark" }}
          >
            <option value="date">Fecha (más reciente)</option>
            <option value="amount">Monto (mayor a menor)</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-white/60">Filtrar por estado:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
            style={{ colorScheme: "dark" }}
          >
            <option value="">Todos</option>
            <option value="registrado">Registrado</option>
            <option value="verificado">Verificado</option>
            <option value="pendiente">Pendiente</option>
            <option value="rechazado">Rechazado</option>
          </select>
        </div>
      </div>

      {/* Lista de pagos */}
      {displayPayments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayPayments.map((payment) => (
            <PaymentCard key={payment.id} payment={payment} showCaseLink={!!filters?.caseId} />
          ))}
        </div>
      ) : (
        <Card>
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-4">
              <span className="text-3xl">💰</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No hay pagos registrados</h3>
            <p className="text-sm text-white/60 mb-6">
              {statusFilter
                ? "No hay pagos que coincidan con los filtros seleccionados."
                : "Aún no has registrado ningún pago en los últimos 3 meses."}
            </p>
            {showRegisterButton && onRegisterClick && (
              <Button variant="primary" onClick={onRegisterClick}>
                Registrar Primer Pago
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Nota sobre período de visibilidad */}
      <Card className="bg-blue-500/10 border-blue-500/30">
        <div className="flex items-start gap-3">
          <span className="text-xl">ℹ️</span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-blue-400 mb-1">
              Período de Visibilidad y Respaldo
            </p>
            <p className="text-xs text-white/70 leading-relaxed">
              Los pagos registrados son visibles durante <strong>3 meses</strong> en tu historial.
              El respaldo técnico se mantiene por <strong>6 meses</strong> para fines de
              auditoría y consulta administrativa. Después de este período, los registros pueden
              ser archivados según las políticas de retención de datos.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
