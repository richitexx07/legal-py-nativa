"use client";

import Link from "next/link";
import Card from "./Card";
import Badge from "./Badge";
import Button from "./Button";
import { Curso } from "@/lib/educacion-data";

interface CourseCardProps {
  curso: Curso;
  showEditions?: boolean;
}

export default function CourseCard({ curso, showEditions = true }: CourseCardProps) {
  const proximaEdicion = curso.proximasEdiciones.find((e) => e.estado === "Abierta");
  const cuposDisponibles = proximaEdicion?.cuposDisponibles || 0;

  return (
    <Card hover className="h-full flex flex-col">
      <div className="flex-1">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-[#C9A24D] text-lg mb-1">{curso.titulo}</h3>
            <p className="text-sm text-white/70 line-clamp-2">{curso.descripcion}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="outline" className="text-xs">
            {curso.area}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {curso.nivel}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {curso.modalidad}
          </Badge>
        </div>

        <div className="space-y-2 text-sm text-white/60 mb-4">
          <div className="flex items-center gap-2">
            <span>⏱️</span>
            <span>{curso.duracion} ({curso.horas} horas)</span>
          </div>
          <div className="flex items-center gap-2">
            <span>💰</span>
            <span className="font-semibold text-white">
              {curso.precioDescuento ? (
                <>
                  <span className="line-through text-white/50">{curso.precio}</span>{" "}
                  <span className="text-[#C9A24D]">{curso.precioDescuento}</span>
                </>
              ) : (
                curso.precio
              )}
            </span>
          </div>
          {curso.certificacion && (
            <div className="flex items-center gap-2">
              <span>🎓</span>
              <span>Certificado incluido</span>
            </div>
          )}
        </div>

        {showEditions && proximaEdicion && (
          <div className="mb-4 p-3 rounded-lg bg-white/5 border border-white/10">
            <p className="text-xs text-white/60 mb-1">Próxima edición:</p>
            <p className="text-sm text-white font-semibold">
              {new Date(proximaEdicion.fechaInicio).toLocaleDateString("es-PY", {
                month: "long",
                year: "numeric",
              })}
            </p>
            <p className="text-xs text-white/60 mt-1">
              {cuposDisponibles > 0 ? (
                <span className="text-[#C9A24D]">
                  {cuposDisponibles} cupo{cuposDisponibles !== 1 ? "s" : ""} disponible
                  {cuposDisponibles !== 1 ? "s" : ""}
                </span>
              ) : (
                <span className="text-red-400">Sin cupos disponibles</span>
              )}
            </p>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-white/10">
        <Link href={`/cursos/${curso.slug}`}>
          <Button variant="primary" className="w-full" size="sm">
            Ver detalles e inscribirse
          </Button>
        </Link>
      </div>
    </Card>
  );
}
