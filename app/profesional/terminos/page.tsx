import Card from "@/components/Card";
import Link from "next/link";
import Button from "@/components/Button";

export default function Terminos() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-white">Términos y Condiciones</h1>
        <Link href="/profesional/alta">
          <Button variant="outline" size="sm">
            ← Volver
          </Button>
        </Link>
      </div>

      <Card>
        <div className="prose prose-invert max-w-none space-y-6">
          <p className="text-white/70 text-sm mb-4">
            <strong className="text-white">Última actualización:</strong> Mayo 2024
          </p>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Aceptación de los Términos</h2>
            <p className="text-white/80">
              Al acceder y utilizar Legal Py, aceptas estar sujeto a estos Términos y Condiciones.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. Suscripción Profesional</h2>
            <p className="text-white/80">
              Los profesionales deben mantener sus credenciales actualizadas y verificar la
              veracidad de la información proporcionada.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. Pagos y Facturación</h2>
            <p className="text-white/80">
              Las suscripciones se renuevan automáticamente. Puedes cancelar en cualquier momento
              desde tu panel.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Cancelación</h2>
            <p className="text-white/80">
              La cancelación será efectiva al finalizar el período de facturación actual. No se
              realizarán reembolsos por períodos ya facturados.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. Responsabilidad</h2>
            <p className="text-white/80">
              Cada profesional es responsable de la veracidad de su información y de cumplir con
              las regulaciones profesionales aplicables.
            </p>
          </section>
        </div>
      </Card>
    </div>
  );
}
