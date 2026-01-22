"use client";

import { useState } from "react";
import Button from "@/components/Button";
import Card from "@/components/Card";
import { CaseLogEntry } from "@/lib/edu-types";

interface CaseLogFormProps {
  internshipId: string;
  onLogSubmit: (entry: CaseLogEntry) => void;
}

export default function CaseLogForm({ internshipId, onLogSubmit }: CaseLogFormProps) {
  const [description, setDescription] = useState("");
  const [caseId, setCaseId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      alert("Por favor, describe tu actividad");
      return;
    }

    setIsSubmitting(true);

    const entry: CaseLogEntry = {
      id: `log_${Date.now()}`,
      studentId: "current_student", // En producción, obtener del session
      internshipId,
      caseId: caseId || undefined,
      entryDate: new Date().toISOString(),
      description,
      validated: false,
    };

    // Guardar en localStorage (simulación)
    const existingLogs = JSON.parse(localStorage.getItem(`internship_${internshipId}_logs`) || "[]");
    existingLogs.push(entry);
    localStorage.setItem(`internship_${internshipId}_logs`, JSON.stringify(existingLogs));

    onLogSubmit(entry);
    setDescription("");
    setCaseId("");
    setIsSubmitting(false);
  };

  return (
    <Card className="p-6 bg-white/5 border-white/10">
      <h3 className="text-xl font-bold text-white mb-4">📝 Bitácora de Casos</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            ID del Caso (Opcional)
          </label>
          <input
            type="text"
            value={caseId}
            onChange={(e) => setCaseId(e.target.value)}
            placeholder="case_12345"
            className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Describe tu actividad
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ej: Hoy redacté una providencia en el caso X..."
            rows={4}
            className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            required
          />
        </div>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting || !description.trim()}
          className="w-full rounded-xl py-3"
        >
          {isSubmitting ? "Guardando..." : "💾 Guardar Entrada"}
        </Button>
      </form>
    </Card>
  );
}
