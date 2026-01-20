"use client";

import { useState } from "react";
import { ReportType, CreateReportData } from "@/lib/reputation";
import { createReport } from "@/lib/reputation";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import FormField from "@/components/FormField";
import Snackbar from "@/components/Snackbar";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  professionalId: string;
  clientId: string;
  professionalName: string;
}

export default function ReportModal({
  isOpen,
  onClose,
  professionalId,
  clientId,
  professionalName,
}: ReportModalProps) {
  const [type, setType] = useState<ReportType>("otro");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    message: string;
    type: "success" | "error" | "info" | "warning";
    isOpen: boolean;
  }>({
    message: "",
    type: "info",
    isOpen: false,
  });

  const reportTypes: { value: ReportType; label: string; description: string }[] = [
    {
      value: "conducta-inapropiada",
      label: "Conducta Inapropiada",
      description: "Comportamiento no profesional o inadecuado",
    },
    {
      value: "servicio-deficiente",
      label: "Servicio Deficiente",
      description: "Calidad del servicio por debajo de lo esperado",
    },
    {
      value: "fraude",
      label: "Fraude o Estafa",
      description: "Actividad fraudulenta o engañosa",
    },
    {
      value: "comunicacion-inadecuada",
      label: "Comunicación Inadecuada",
      description: "Problemas de comunicación o falta de respuesta",
    },
    {
      value: "incumplimiento",
      label: "Incumplimiento",
      description: "No cumplió con los términos acordados",
    },
    {
      value: "otro",
      label: "Otro",
      description: "Otra razón no listada",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!title || title.trim().length < 5) {
      setErrors({ title: "El título debe tener al menos 5 caracteres" });
      return;
    }

    if (!description || description.trim().length < 20) {
      setErrors({ description: "La descripción debe tener al menos 20 caracteres" });
      return;
    }

    setLoading(true);

    try {
      const data: CreateReportData = {
        professionalId,
        clientId,
        type,
        title: title.trim(),
        description: description.trim(),
      };

      const response = createReport(data);

      if (response.success) {
        setSubmitted(true);
        setSnackbar({
          message: "✓ Denuncia enviada para revisión confidencial",
          type: "success",
          isOpen: true,
        });
        setTimeout(() => {
          onClose();
          setSubmitted(false);
          setTitle("");
          setDescription("");
          setType("otro");
        }, 2000);
      } else {
        const msg = response.error || "Error al enviar la denuncia";
        setErrors({ general: msg });
        setSnackbar({
          message: msg,
          type: "error",
          isOpen: true,
        });
      }
    } catch (error) {
      const msg = "Error inesperado. Intenta nuevamente.";
      setErrors({ general: msg });
      setSnackbar({
        message: msg,
        type: "error",
        isOpen: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!submitted) {
      setTitle("");
      setDescription("");
      setType("otro");
      setErrors({});
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Denunciar Profesional">
      <Snackbar
        message={snackbar.message}
        type={snackbar.type}
        isOpen={snackbar.isOpen}
        onClose={() => setSnackbar({ ...snackbar, isOpen: false })}
      />
      {submitted ? (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
            <span className="text-3xl">✓</span>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Denuncia Enviada</h3>
          <p className="text-sm text-white/70">
            Tu denuncia ha sido recibida y será revisada por nuestro equipo.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <p className="text-sm text-white/80">
              Estás denunciando a <strong>{professionalName}</strong>. Esta denuncia será revisada
              por nuestro equipo y tomaremos las medidas correspondientes si es necesario.
            </p>
          </div>

          {errors.general && (
            <div className="rounded-lg bg-red-500/20 border border-red-500/50 p-3">
              <p className="text-sm text-red-400">{errors.general}</p>
            </div>
          )}

          <FormField label="Tipo de Denuncia" required>
            <div className="space-y-2">
              {reportTypes.map((rt) => (
                <label
                  key={rt.value}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition ${
                    type === rt.value
                      ? "border-[#C9A24D] bg-[#C9A24D]/10"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <input
                    type="radio"
                    name="reportType"
                    value={rt.value}
                    checked={type === rt.value}
                    onChange={(e) => setType(e.target.value as ReportType)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-white text-sm">{rt.label}</p>
                    <p className="text-xs text-white/60 mt-0.5">{rt.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </FormField>

          <FormField label="Título" htmlFor="title" required error={errors.title}>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
              placeholder="Resumen breve del problema"
              maxLength={100}
            />
          </FormField>

          <FormField label="Descripción Detallada" htmlFor="description" required error={errors.description}>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D] resize-none"
              placeholder="Describe detalladamente lo que sucedió. Incluye fechas, detalles relevantes y cualquier información que pueda ayudar en la revisión."
              maxLength={1000}
            />
            <p className="text-xs text-white/60 mt-1">{description.length}/1000 caracteres</p>
          </FormField>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <p className="text-xs text-white/70">
              <strong>Importante:</strong> Las denuncias son revisadas por nuestro equipo de moderación.
              Toda la información proporcionada será tratada con confidencialidad.
            </p>
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" className="flex-1" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" className="flex-1" disabled={loading}>
              {loading ? "Enviando..." : "Enviar Denuncia"}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
