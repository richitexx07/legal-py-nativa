import Link from "next/link";
import Button from "@/components/Button";
import Card from "@/components/Card";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="max-w-md text-center">
        <div className="space-y-4">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/10">
            <svg
              className="h-10 w-10 text-white/60"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Profesional no encontrado</h1>
          <p className="text-white/70">
            El profesional que estás buscando no existe o ha sido eliminado.
          </p>
          <div className="pt-4">
            <Link href="/profesionales">
              <Button variant="primary" size="md" className="w-full md:w-auto">
                Ver todos los profesionales
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
