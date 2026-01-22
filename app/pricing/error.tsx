"use client";

import { useEffect } from "react";
import Link from "next/link";
import Button from "@/components/Button";

export default function PricingError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Pricing route error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-[#0E1B2A] px-4">
      <div className="max-w-md text-center">
        <h2 className="text-xl font-bold text-white mb-2">Error al cargar planes</h2>
        <p className="text-white/70 text-sm mb-6">
          No se pudo mostrar el dashboard de suscripciones. Intentá de nuevo.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="primary" onClick={reset} className="rounded-xl">
            Reintentar
          </Button>
          <Link
            href="/"
            className="inline-flex justify-center rounded-xl border border-white/15 px-4 py-2 text-sm text-white/80 hover:bg-white/5 transition w-full sm:w-auto"
          >
            Ir al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
