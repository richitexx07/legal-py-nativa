"use client";

import { useState } from "react";
import Link from "next/link";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import { mockPasantias } from "@/lib/educacion-data";

export default function PasantiasPage() {
  const pasantiasAbiertas = mockPasantias.filter((p) => p.estado === "Abierta");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
          Programa de Pasantía Laboral
        </h1>
        <p className="text-white/70 max-w-3xl">
          Oportunidades de pasantía para secretarios/as y asistentes estudiantes. Experiencia práctica
          en entorno legal profesional.
        </p>
      </div>

      {/* Pasantías Disponibles */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
          Pasantías Disponibles
        </h2>
        {pasantiasAbiertas.length === 0 ? (
          <Card>
            <div className="text-center py-8">
              <p className="text-white/70">No hay pasantías abiertas en este momento.</p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pasantiasAbiertas.map((pasantia) => (
              <Card key={pasantia.id} hover className="h-full flex flex-col">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-[#C9A24D] text-lg">{pasantia.titulo}</h3>
                    <Badge variant="accent" className="text-xs">
                      {pasantia.estado}
                    </Badge>
                  </div>

                  <p className="text-sm text-white/70 mb-4">{pasantia.descripcion}</p>

                  <div className="space-y-2 text-sm text-white/60 mb-4">
                    <div className="flex items-center gap-2">
                      <span>📍</span>
                      <span>{pasantia.area}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>⏱️</span>
                      <span>{pasantia.duracion}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>🕐</span>
                      <span>{pasantia.horario}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>💼</span>
                      <span>{pasantia.modalidad}</span>
                    </div>
                    {pasantia.certificacion && (
                      <div className="flex items-center gap-2">
                        <span>🎓</span>
                        <span>Certificado incluido</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <span>👥</span>
                      <span className={pasantia.cuposDisponibles > 0 ? "text-[#C9A24D]" : "text-red-400"}>
                        {pasantia.cuposDisponibles} cupo{pasantia.cuposDisponibles !== 1 ? "s" : ""} disponible{pasantia.cuposDisponibles !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-white/60 mb-2 font-semibold">Requisitos:</p>
                    <ul className="space-y-1">
                      {pasantia.requisitos.slice(0, 3).map((req, idx) => (
                        <li key={idx} className="text-xs text-white/70 flex items-start gap-1">
                          <span className="text-[#C9A24D] mt-1">•</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-white/60 mb-2 font-semibold">Beneficios:</p>
                    <ul className="space-y-1">
                      {pasantia.beneficios.slice(0, 3).map((ben, idx) => (
                        <li key={idx} className="text-xs text-white/70 flex items-start gap-1">
                          <span className="text-[#C9A24D] mt-1">✓</span>
                          <span>{ben}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <Link href={`/pasantias/postular?pasantia=${pasantia.id}`}>
                    <Button variant="primary" className="w-full" size="sm" disabled={pasantia.cuposDisponibles === 0}>
                      {pasantia.cuposDisponibles > 0 ? "Postular ahora" : "Sin cupos disponibles"}
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* FAQ */}
      <Card>
        <h2 className="text-xl font-bold text-white mb-4">Preguntas Frecuentes</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-white mb-2">¿Cuáles son los requisitos para postular?</h3>
            <p className="text-sm text-white/70">
              Los requisitos varían según la pasantía, pero generalmente incluyen ser estudiante de
              derecho (4to año en adelante), disponibilidad horaria y conocimientos básicos según el
              área.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-2">¿Hay remuneración?</h3>
            <p className="text-sm text-white/70">
              Sí, todas nuestras pasantías incluyen un stipend mensual que varía según el programa.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-2">¿Se otorga certificado?</h3>
            <p className="text-sm text-white/70">
              Sí, al completar la pasantía recibirás un certificado que acredita tu experiencia.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-2">¿Cuál es la modalidad de trabajo?</h3>
            <p className="text-sm text-white/70">
              Depende de la pasantía. Ofrecemos modalidades presenciales, híbridas y remotas según
              el programa.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
