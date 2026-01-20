"use client";

import { useState } from "react";
import { RegisterPaymentData, PaymentMethod, PaymentCurrency } from "@/lib/payments";
import { registerPayment } from "@/lib/payments";
import Button from "@/components/Button";
import FormField from "@/components/FormField";
import Card from "@/components/Card";
import PaymentDisclaimer from "./PaymentDisclaimer";
import Snackbar from "@/components/Snackbar";

interface PaymentFormProps {
  caseId?: string;
  clientId: string;
  professionalId?: string;
  onSuccess: () => void;
  onCancel?: () => void;
}

export default function PaymentForm({
  caseId,
  clientId,
  professionalId,
  onSuccess,
  onCancel,
}: PaymentFormProps) {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<PaymentCurrency>("PYG");
  const [method, setMethod] = useState<PaymentMethod>("transferencia-bancaria");
  const [description, setDescription] = useState("");
  const [reference, setReference] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    message: string;
    type: "success" | "error" | "info" | "warning";
    isOpen: boolean;
  }>({
    message: "",
    type: "info",
    isOpen: false,
  });

  const paymentMethods: { value: PaymentMethod; label: string; icon: string }[] = [
    { value: "transferencia-bancaria", label: "Transferencia Bancaria", icon: "🏦" },
    { value: "tarjeta-credito", label: "Tarjeta de Crédito", icon: "💳" },
    { value: "tarjeta-debito", label: "Tarjeta de Débito", icon: "💳" },
    { value: "efectivo", label: "Efectivo", icon: "💵" },
    { value: "cheque", label: "Cheque", icon: "📝" },
    { value: "billetera-digital", label: "Billetera Digital", icon: "📱" },
    { value: "crypto", label: "Criptomoneda", icon: "₿" },
    { value: "otro", label: "Otro", icon: "🔷" },
  ];

  const currencies: { value: PaymentCurrency; label: string; symbol: string }[] = [
    { value: "PYG", label: "Guaraníes (PYG)", symbol: "Gs." },
    { value: "USD", label: "Dólares (USD)", symbol: "$" },
    { value: "EUR", label: "Euros (EUR)", symbol: "€" },
    { value: "BRL", label: "Reales (BRL)", symbol: "R$" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validaciones
    const amountNum = parseFloat(amount);
    if (!amount || isNaN(amountNum) || amountNum <= 0) {
      setErrors({ amount: "El monto debe ser mayor a 0" });
      return;
    }

    if (!description || description.trim().length < 5) {
      setErrors({ description: "La descripción debe tener al menos 5 caracteres" });
      return;
    }

    setLoading(true);

    try {
      const data: RegisterPaymentData = {
        caseId,
        clientId,
        professionalId,
        amount: amountNum,
        currency,
        method,
        description: description.trim(),
        reference: reference.trim() || undefined,
        paymentDate: paymentDate || undefined,
        notes: notes.trim() || undefined,
      };

      const response = await registerPayment(data, clientId);

      if (response.success) {
        setSnackbar({
          message: "✓ Pago registrado en el historial (Legal PY no procesa fondos)",
          type: "success",
          isOpen: true,
        });
        onSuccess();
      } else {
        const msg = response.error || "Error al registrar el pago";
        setErrors({ general: msg });
        setSnackbar({
          message: msg,
          type: "error",
          isOpen: true,
        });
      }
    } catch (error) {
      const msg = "Error inesperado. Intenta nuevamente.";
      setErrors({ general: msg });
      setSnackbar({
        message: msg,
        type: "error",
        isOpen: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedCurrency = currencies.find((c) => c.value === currency);

  return (
    <div className="space-y-6">
      <PaymentDisclaimer />

      <Card>
        <h2 className="text-xl font-bold text-white mb-4">Registrar Pago</h2>
        <p className="text-sm text-white/70 mb-6">
          Registra un pago que ya realizaste fuera de la plataforma. Este registro es solo para
          llevar un control y seguimiento.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.general && (
            <div className="rounded-lg bg-red-500/20 border border-red-500/50 p-3">
              <p className="text-sm text-red-400">{errors.general}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Monto" htmlFor="amount" required error={errors.amount}>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60">
                  {selectedCurrency?.symbol}
                </span>
                <input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-12 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
                  placeholder="0.00"
                />
              </div>
            </FormField>

            <FormField label="Moneda" htmlFor="currency" required>
              <select
                id="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value as PaymentCurrency)}
                className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
                style={{ colorScheme: "dark" }}
              >
                {currencies.map((curr) => (
                  <option key={curr.value} value={curr.value} className="bg-[#13253A] text-white">
                    {curr.label}
                  </option>
                ))}
              </select>
            </FormField>
          </div>

          <FormField label="Método de Pago" htmlFor="method" required>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {paymentMethods.map((pm) => (
                <label
                  key={pm.value}
                  className={`flex flex-col items-center gap-2 p-3 rounded-lg border cursor-pointer transition ${
                    method === pm.value
                      ? "border-[#C9A24D] bg-[#C9A24D]/10"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <input
                    type="radio"
                    name="method"
                    value={pm.value}
                    checked={method === pm.value}
                    onChange={(e) => setMethod(e.target.value as PaymentMethod)}
                    className="hidden"
                  />
                  <span className="text-2xl">{pm.icon}</span>
                  <span className="text-xs text-center text-white/80">{pm.label}</span>
                </label>
              ))}
            </div>
          </FormField>

          <FormField label="Descripción" htmlFor="description" required error={errors.description}>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D] resize-none"
              placeholder="Ej: Pago de honorarios profesionales, Consulta inicial, etc."
              maxLength={200}
            />
            <p className="text-xs text-white/60 mt-1">{description.length}/200 caracteres</p>
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Número de Referencia/Comprobante" htmlFor="reference">
              <input
                id="reference"
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
                placeholder="Ej: TRANS-123456, VOUCHER-789"
                maxLength={50}
              />
            </FormField>

            <FormField label="Fecha del Pago" htmlFor="paymentDate">
              <input
                id="paymentDate"
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
                style={{ colorScheme: "dark" }}
              />
              <p className="text-xs text-white/60 mt-1">
                Si no especificas, se usará la fecha actual
              </p>
            </FormField>
          </div>

          <FormField label="Notas Adicionales (opcional)" htmlFor="notes">
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D] resize-none"
              placeholder="Información adicional sobre el pago..."
              maxLength={500}
            />
            <p className="text-xs text-white/60 mt-1">{notes.length}/500 caracteres</p>
          </FormField>

          <div className="flex gap-3 pt-2">
            {onCancel && (
              <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
                Cancelar
              </Button>
            )}
            <Button type="submit" variant="primary" className="flex-1" disabled={loading}>
              {loading ? "Registrando..." : "Registrar Pago"}
            </Button>
          </div>
        </form>
      </Card>

      <Snackbar
        message={snackbar.message}
        type={snackbar.type}
        isOpen={snackbar.isOpen}
        onClose={() => setSnackbar({ ...snackbar, isOpen: false })}
      />
    </div>
  );
}
