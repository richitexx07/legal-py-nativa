"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useI18n } from "@/components/I18nProvider";
import Link from "next/link";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Image from "next/image";
import { mockProfesionales, mockCategorias } from "@/lib/mock-data";

function ProfesionalesContent() {
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const categoriaParam = searchParams.get("categoria");

  // Filtrar profesionales por categoría
  const profesionalesFiltrados = categoriaParam
    ? mockProfesionales.filter((p) => {
        // Normalizar comparación (eliminar espacios y mayúsculas/minúsculas)
        const categoriaNormalizada = categoriaParam.trim();
        const profesionalCategoria = p.categoria?.trim();
        return profesionalCategoria === categoriaNormalizada;
      })
    : mockProfesionales;

  // Obtener título de categoría
  const categoriaInfo = categoriaParam
    ? mockCategorias.find((c) => c.titulo === categoriaParam)
    : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            {categoriaInfo ? categoriaInfo.titulo : t.professionals.listTitle}
          </h1>
          <p className="text-white/70 mt-1">
            {categoriaInfo
              ? categoriaInfo.descripcion
              : t.professionals.listSubtitle}
          </p>
        </div>
        {categoriaParam && (
          <Link href="/profesionales">
            <Button variant="outline" size="sm">
              Ver Todos
            </Button>
          </Link>
        )}
      </div>

      {profesionalesFiltrados.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <p className="text-white/70">
              No se encontraron profesionales en esta categoría.
            </p>
            <Link href="/profesionales">
              <Button variant="primary" className="mt-4">
                Ver Todos los Profesionales
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {profesionalesFiltrados.map((pro) => (
            <Card key={pro.id} hover>
              <div className="flex items-start gap-4">
                {pro.avatar ? (
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full">
                    <Image
                      src={pro.avatar}
                      alt={pro.nombre}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                ) : (
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#C9A24D] to-[#C08457] text-lg font-bold text-black">
                    {pro.nombre
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[#C9A24D] truncate">
                    {pro.nombre}
                  </h3>
                  <p className="text-sm text-white/70">{pro.titulo}</p>
                  <p className="text-xs text-white/60 mt-1">{pro.ciudad}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-sm text-[#C9A24D]">⭐ {pro.rating}</span>
                    <span className="text-xs text-white/50">•</span>
                    <span className="text-xs text-white/60">{pro.precio}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Link href={`/profesionales/${pro.id}/chat`}>
                  <Button variant="primary" size="sm" className="flex-1 min-w-0">
                    {t.professionals.actionsChat}
                  </Button>
                </Link>
                <Link href={`/profesionales/${pro.id}`}>
                  <Button variant="outline" size="sm" className="flex-1 min-w-0">
                    {t.professionals.actionsViewProfile}
                  </Button>
                </Link>
                <Link href={`/profesionales/${pro.id}/reservar`}>
                  <Button variant="ghost" size="sm" className="flex-1 min-w-0">
                    {t.professionals.actionsBook}
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Profesionales() {
  return (
    <Suspense fallback={
      <div className="space-y-6">
        <Card>
          <div className="text-center py-8">
            <p className="text-white/70">Cargando...</p>
          </div>
        </Card>
      </div>
    }>
      <ProfesionalesContent />
    </Suspense>
  );
}
