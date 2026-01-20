"use client";

import Card from "@/components/Card";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import Link from "next/link";
import { Case } from "@/lib/cases";
import { mockProfesionales } from "@/lib/mock-data";

interface CaseInfoProps {
  caseData: Case;
  onAssignProfessional?: () => void;
}

export default function CaseInfo({ caseData, onAssignProfessional }: CaseInfoProps) {
  const professional = caseData.professionalId
    ? mockProfesionales.find((p) => p.id === caseData.professionalId)
    : null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-PY", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Información del caso */}
      <Card>
        <h3 className="font-semibold text-white mb-4">Información del Caso</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-white/60">Creado:</span>
            <span className="text-white/80">{formatDate(caseData.createdAt)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/60">Última actualización:</span>
            <span className="text-white/80">{formatDate(caseData.updatedAt)}</span>
          </div>
          {caseData.closedAt && (
            <div className="flex justify-between">
              <span className="text-white/60">Cerrado:</span>
              <span className="text-white/80">{formatDate(caseData.closedAt)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-white/60">Documentos:</span>
            <span className="text-white/80">{caseData.documents.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/60">Comentarios:</span>
            <span className="text-white/80">{caseData.comments.length}</span>
          </div>
        </div>
      </Card>

      {/* Profesional asignado */}
      {professional ? (
        <Card>
          <h3 className="font-semibold text-white mb-4">Profesional Asignado</h3>
          <div className="space-y-3">
            <div>
              <p className="font-medium text-white">{professional.nombre}</p>
              <p className="text-sm text-white/70">{professional.titulo}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-white/60">Rating:</span>
              <span className="text-[#C9A24D] font-semibold">⭐ {professional.rating}</span>
            </div>
            <Link href={`/profesionales/${professional.id}`}>
              <Button variant="outline" size="sm" className="w-full">
                Ver Perfil
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <Card>
          <h3 className="font-semibold text-white mb-4">Profesional Asignado</h3>
          <p className="text-sm text-white/60 mb-3">No hay profesional asignado todavía.</p>
          {onAssignProfessional && (
            <Button variant="primary" size="sm" className="w-full" onClick={onAssignProfessional}>
              Asignar Profesional
            </Button>
          )}
        </Card>
      )}

      {/* Información del juzgado */}
      {caseData.courtInfo && (
        <Card>
          <h3 className="font-semibold text-white mb-4">Información Judicial</h3>
          <div className="space-y-2 text-sm">
            {caseData.courtInfo.courtName && (
              <div>
                <span className="text-white/60">Juzgado:</span>
                <p className="text-white/80 mt-1">{caseData.courtInfo.courtName}</p>
              </div>
            )}
            {caseData.courtInfo.caseNumber && (
              <div>
                <span className="text-white/60">Número de expediente:</span>
                <p className="text-white/80 mt-1 font-mono">{caseData.courtInfo.caseNumber}</p>
              </div>
            )}
            {caseData.courtInfo.judge && (
              <div>
                <span className="text-white/60">Juez:</span>
                <p className="text-white/80 mt-1">{caseData.courtInfo.judge}</p>
              </div>
            )}
            {caseData.courtInfo.address && (
              <div>
                <span className="text-white/60">Dirección:</span>
                <p className="text-white/80 mt-1">{caseData.courtInfo.address}</p>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
