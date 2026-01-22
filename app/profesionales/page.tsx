"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Image from "next/image";
import { mockProfesionales, mockCategorias } from "@/lib/mock-data";

function ProfesionalesContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const categoriaParam = searchParams.get("categoria");

  // Agrupar profesionales por categoría
  const profesionalesPorCategoria = useMemo(() => {
    const grupos: Record<string, typeof mockProfesionales> = {};
    
    mockProfesionales.forEach((pro) => {
      const categoria = pro.categoria || "Otros";
      if (!grupos[categoria]) {
        grupos[categoria] = [];
      }
      grupos[categoria].push(pro);
    });

    // Ordenar cada grupo por rating
    Object.keys(grupos).forEach((cat) => {
      grupos[cat].sort((a, b) => b.rating - a.rating);
    });

    return grupos;
  }, []);

  // Si hay filtro de categoría, mostrar solo esa categoría
  const categoriasAMostrar = categoriaParam
    ? [categoriaParam]
    : Object.keys(profesionalesPorCategoria);

  // Obtener información de categorías
  const getCategoriaInfo = (categoria: string) => {
    return mockCategorias.find((c) => c.titulo === categoria);
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">
            {categoriaParam ? getCategoriaInfo(categoriaParam)?.titulo : "Profesionales"}
          </h1>
          <p className="text-white/70 mt-2 text-lg">
            {categoriaParam
              ? getCategoriaInfo(categoriaParam)?.descripcion
              : "Encontrá profesionales verificados por categoría. Cada categoría está separada y organizada."}
          </p>
        </div>
        {categoriaParam && (
          <Link href="/profesionales">
            <Button variant="outline" size="sm" className="rounded-xl">
              Ver Todas las Categorías
            </Button>
          </Link>
        )}
      </div>

      {/* Secciones por categoría - NO MEZCLADAS */}
      {categoriasAMostrar.map((categoria) => {
        const profesionales = profesionalesPorCategoria[categoria] || [];
        const categoriaInfo = getCategoriaInfo(categoria);

        if (profesionales.length === 0) return null;

        return (
          <section key={categoria} className="space-y-6">
            {/* Header de categoría con icono */}
            <div className="flex items-center gap-4 pb-4 border-b border-white/10">
              {categoriaInfo?.icono && (
                <div className="relative w-16 h-16 shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#C9A24D]/20 to-transparent rounded-xl blur-sm" />
                  <div className="relative w-full h-full border-2 border-[#C9A24D]/50 rounded-xl p-2 bg-white/5">
                    <Image
                      src={categoriaInfo.icono}
                      alt={categoria}
                      fill
                      className="object-contain p-1"
                      sizes="64px"
                    />
                  </div>
                </div>
              )}
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
                  {categoriaInfo?.titulo || categoria}
                </h2>
                <p className="text-white/70 text-sm">
                  {categoriaInfo?.descripcion || `${profesionales.length} profesional${profesionales.length > 1 ? 'es' : ''} disponible${profesionales.length > 1 ? 's' : ''}`}
                </p>
              </div>
            </div>

            {/* Grid de profesionales de esta categoría */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profesionales.map((pro) => (
                <Card key={pro.id} className="h-full p-6 hover:shadow-xl hover:scale-[1.02] transition-all border border-white/10 hover:border-[#C9A24D]/40 bg-gradient-to-br from-white/5 to-white/0">
                  <div className="flex flex-col h-full">
                    {/* Avatar/Foto del profesional */}
                    <div className="flex items-start gap-4 mb-4">
                      {pro.avatar ? (
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 border-white/20 bg-white/5">
                          <Image
                            src={pro.avatar}
                            alt={pro.nombre}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </div>
                      ) : (
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#C9A24D] to-[#C08457] text-lg font-bold text-black border-2 border-[#C9A24D]/50">
                          {pro.nombre
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-white text-lg truncate mb-1">
                          {pro.nombre}
                        </h3>
                        <p className="text-sm text-white/70 truncate">{pro.titulo}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-yellow-400 text-sm">⭐</span>
                          <span className="text-sm font-semibold text-white">{pro.rating.toFixed(1)}</span>
                          <span className="text-xs text-white/50">•</span>
                          <span className="text-xs text-white/60">{pro.ciudad}</span>
                        </div>
                      </div>
                    </div>

                    {/* Descripción */}
                    {pro.descripcion && (
                      <p className="text-xs text-white/60 mb-3 line-clamp-2 flex-1">
                        {pro.descripcion}
                      </p>
                    )}

                    {/* Precio */}
                    <div className="mb-4">
                      <span className="text-sm text-[#C9A24D] font-semibold">{pro.precio}</span>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex flex-col gap-2 mt-auto">
                      <Link href={`/profesionales/${pro.id}`}>
                        <Button 
                          variant="primary" 
                          className="w-full rounded-xl py-2.5 font-semibold bg-[#C9A24D] hover:bg-[#C08457] text-black"
                        >
                          Ver Perfil →
                        </Button>
                      </Link>
                      <div className="flex gap-2">
                        <Link href={`/profesionales/${pro.id}/chat`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full rounded-xl text-xs">
                            Chat
                          </Button>
                        </Link>
                        <Link href={`/profesionales/${pro.id}/reservar`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full rounded-xl text-xs">
                            Reservar
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        );
      })}

      {/* Mensaje si no hay profesionales */}
      {categoriasAMostrar.length === 0 && (
        <Card>
          <div className="text-center py-8">
            <p className="text-white/70">
              No se encontraron profesionales.
            </p>
            <Link href="/profesionales">
              <Button variant="primary" className="mt-4 rounded-xl">
                Ver Todos los Profesionales
              </Button>
            </Link>
          </div>
        </Card>
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
