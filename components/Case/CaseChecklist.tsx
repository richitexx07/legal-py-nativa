"use client";

import { useState } from "react";
import { ChecklistItem, CasePriority } from "@/lib/cases";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Badge from "@/components/Badge";

interface CaseChecklistProps {
  items: ChecklistItem[];
  onToggleItem: (itemId: string, completed: boolean) => void;
  onAddItem?: () => void;
  canEdit?: boolean;
}

export default function CaseChecklist({
  items,
  onToggleItem,
  onAddItem,
  canEdit = true,
}: CaseChecklistProps) {
  const completedCount = items.filter((item) => item.completed).length;
  const progress = items.length > 0 ? (completedCount / items.length) * 100 : 0;

  const getPriorityColor = (priority?: CasePriority) => {
    if (!priority) return "";
    switch (priority) {
      case "urgente":
        return "border-red-500/50";
      case "alta":
        return "border-orange-500/50";
      case "media":
        return "border-yellow-500/50";
      case "baja":
        return "border-blue-500/50";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-PY", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-white">Checklist</h2>
          <p className="text-sm text-white/60 mt-1">
            {completedCount} de {items.length} completadas ({Math.round(progress)}%)
          </p>
        </div>
        {onAddItem && canEdit && (
          <Button variant="outline" size="sm" onClick={onAddItem}>
            + Agregar Tarea
          </Button>
        )}
      </div>

      {/* Barra de progreso */}
      <div className="mb-6">
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#C9A24D] rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Lista de items */}
      <div className="space-y-3">
        {items.length > 0 ? (
          items.map((item) => (
            <label
              key={item.id}
              className={`flex items-start gap-3 cursor-pointer p-3 rounded-lg border transition ${
                item.completed
                  ? "bg-white/5 border-white/10 opacity-60"
                  : `bg-white/5 border-white/10 hover:bg-white/10 ${getPriorityColor(item.priority)}`
              } ${!canEdit ? "cursor-default" : ""}`}
            >
              <input
                type="checkbox"
                checked={item.completed}
                onChange={(e) => canEdit && onToggleItem(item.id, e.target.checked)}
                disabled={!canEdit}
                className="mt-1 h-5 w-5 rounded border-white/20 bg-white/10 text-[#C9A24D] focus:ring-[#C9A24D] disabled:opacity-50"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <span
                    className={`flex-1 ${
                      item.completed ? "text-white/60 line-through" : "text-white"
                    }`}
                  >
                    {item.label}
                  </span>
                  {item.completed && (
                    <svg
                      className="h-5 w-5 text-[#C9A24D] shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                {item.priority && item.priority !== "media" && (
                  <Badge variant="outline" className="mt-2 text-xs">
                    {item.priority.toUpperCase()}
                  </Badge>
                )}
                {item.completedAt && (
                  <p className="text-xs text-white/50 mt-1">
                    Completada {formatDate(item.completedAt)}
                  </p>
                )}
                {item.dueDate && !item.completed && (
                  <p className="text-xs text-yellow-400 mt-1">
                    Vence: {formatDate(item.dueDate)}
                  </p>
                )}
                {item.notes && (
                  <p className="text-xs text-white/60 mt-1 italic">{item.notes}</p>
                )}
              </div>
            </label>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-white/60">No hay tareas en el checklist.</p>
            {onAddItem && canEdit && (
              <Button variant="outline" size="sm" className="mt-4" onClick={onAddItem}>
                Agregar Primera Tarea
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
