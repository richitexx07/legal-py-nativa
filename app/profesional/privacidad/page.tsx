import Card from "@/components/Card";
import Link from "next/link";
import Button from "@/components/Button";

export default function Privacidad() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-white">Política de Privacidad</h1>
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
            <h2 className="text-xl font-bold text-white mb-3">1. Información que Recopilamos</h2>
            <p className="text-white/80">
              Recopilamos información de identificación, credenciales profesionales, datos de
              contacto y de pago necesarios para proporcionar nuestros servicios.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. Uso de la Información</h2>
            <p className="text-white/80">
              Utilizamos tu información para gestionar tu cuenta, procesar pagos, verificar
              credenciales y mejorar nuestros servicios.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. Seguridad</h2>
            <p className="text-white/80">
              Implementamos medidas de seguridad técnicas y organizativas para proteger tu
              información personal.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Tus Derechos</h2>
            <p className="text-white/80">
              Tienes derecho a acceder, rectificar, eliminar y oponerte al procesamiento de tus
              datos personales.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. Compartir Información</h2>
            <p className="text-white/80">
              No compartimos tu información personal con terceros excepto cuando sea necesario para
              proporcionar nuestros servicios o cumplir con obligaciones legales.
            </p>
          </section>
        </div>
      </Card>
    </div>
  );
}
