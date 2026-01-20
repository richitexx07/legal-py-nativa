"use client";

import Card from "@/components/Card";

export default function PaymentDisclaimer() {
  return (
    <Card className="border-yellow-500/30 bg-yellow-500/10">
      <div className="flex items-start gap-3">
        <div className="text-2xl shrink-0">⚠️</div>
        <div className="flex-1 space-y-2">
          <h3 className="font-semibold text-yellow-400">Importante: Legal PY NO Procesa Pagos</h3>
          <p className="text-sm text-white/80 leading-relaxed">
            <strong>Legal PY es una plataforma de registro únicamente.</strong> No procesamos,
            recibimos, transferimos ni manejamos dinero de ninguna forma.
          </p>
          <p className="text-sm text-white/70 leading-relaxed">
            Este sistema solo permite <strong>registrar</strong> los pagos que realizas
            directamente con el profesional o entidad correspondiente. Los pagos se realizan
            fuera de nuestra plataforma mediante los métodos acordados entre las partes.
          </p>
          <div className="mt-3 pt-3 border-t border-yellow-500/20">
            <p className="text-xs text-white/60">
              <strong>Tu responsabilidad:</strong> Asegúrate de tener comprobantes de pago válidos
              y guarda todos los documentos relacionados con tus transacciones.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
