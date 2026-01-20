"use client";

import { useState, useEffect } from "react";
import { getSession } from "@/lib/auth";
import { getPaymentHistory } from "@/lib/payments";
import Card from "@/components/Card";
import PaymentHistory from "@/components/Payments/PaymentHistory";
import PaymentForm from "@/components/Payments/PaymentForm";
import PaymentStats from "@/components/Payments/PaymentStats";
import Tabs from "@/components/Tabs";

export default function PagosPage() {
  const session = getSession();
  const [view, setView] = useState<"history" | "register">("history");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    // Verificar sesión
    if (!session) {
      window.location.href = "/login";
      return;
    }
  }, [session]);

  if (!session) {
    return null;
  }

  const isClient = session.user.role === "cliente";
  const isProfessional = session.user.role === "profesional";

  const filters = isClient
    ? { clientId: session.user.id }
    : isProfessional
    ? { professionalId: session.user.id }
    : undefined;

  const handleRegisterSuccess = () => {
    setView("history");
    setRefreshKey((prev) => prev + 1);
  };

  const tabs = [
    {
      id: "history",
      label: "Historial",
      content: (
        <div key={refreshKey} className="space-y-6">
          <PaymentStats filters={filters} />
          <PaymentHistory
            filters={filters}
            showRegisterButton={true}
            onRegisterClick={() => setView("register")}
          />
        </div>
      ),
    },
    {
      id: "register",
      label: "Registrar Pago",
      content: (
        <PaymentForm
          clientId={session.user.id}
          professionalId={isProfessional ? session.user.id : undefined}
          onSuccess={handleRegisterSuccess}
          onCancel={() => setView("history")}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white">Registro de Pagos</h1>
        <p className="mt-2 text-white/70">
          Registra y consulta los pagos realizados. Recuerda que Legal PY no procesa pagos.
        </p>
      </div>

      <Card>
        <Tabs tabs={tabs} defaultTab={view} />
      </Card>
    </div>
  );
}
