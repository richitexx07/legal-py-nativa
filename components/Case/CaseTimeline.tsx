"use client";

import { TimelineEvent } from "@/lib/cases";
import Timeline from "@/components/Timeline";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { useState } from "react";

interface CaseTimelineProps {
  events: TimelineEvent[];
  onAddEvent?: () => void;
  canAddEvents?: boolean;
}

export default function CaseTimeline({
  events,
  onAddEvent,
  canAddEvents = false,
}: CaseTimelineProps) {
  // Convertir eventos del formato Case al formato Timeline
  const timelineEvents = events.map((event) => ({
    id: event.id,
    date: new Date(event.createdAt).toLocaleString("es-PY", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    title: event.title,
    description: event.description,
    status: event.status,
    metadata: event.metadata
      ? Object.fromEntries(
          Object.entries(event.metadata).map(([key, value]) => [key, String(value)])
        )
      : undefined,
  }));

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case "creacion":
        return "✨";
      case "documento-subido":
        return "📄";
      case "documento-firmado":
        return "✍️";
      case "audiencia":
        return "⚖️";
      case "notificacion":
        return "📬";
      case "comentario":
        return "💬";
      case "estado-cambiado":
        return "🔄";
      case "tarea-completada":
        return "✅";
      case "recordatorio":
        return "⏰";
      default:
        return "📌";
    }
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Timeline del Caso</h2>
        {canAddEvents && onAddEvent && (
          <Button variant="outline" size="sm" onClick={onAddEvent}>
            + Agregar Evento
          </Button>
        )}
      </div>
      {timelineEvents.length > 0 ? (
        <Timeline events={timelineEvents} />
      ) : (
        <div className="text-center py-8">
          <p className="text-white/60">No hay eventos registrados todavía.</p>
        </div>
      )}
    </Card>
  );
}
