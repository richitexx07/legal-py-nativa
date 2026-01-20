"use client";

import { useState, useRef } from "react";
import { CaseDocument } from "@/lib/cases";
import Card from "@/components/Card";
import Button from "@/components/Button";
import DocumentList from "@/components/DocumentList";
import { addDocument, deleteDocument } from "@/lib/cases";

interface CaseDocumentsProps {
  caseId: string;
  documents: CaseDocument[];
  userId: string;
  onDocumentsChange: () => void;
  canUpload?: boolean;
}

export default function CaseDocuments({
  caseId,
  documents,
  userId,
  onDocumentsChange,
  canUpload = true,
}: CaseDocumentsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setUploading(true);

    try {
      const response = await addDocument(caseId, file, userId);
      if (response.success) {
        onDocumentsChange();
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        setError(response.error || "Error al subir el documento");
      }
    } catch (err) {
      setError("Error inesperado al subir el documento");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (documentId: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este documento?")) return;

    try {
      const response = await deleteDocument(caseId, documentId, userId);
      if (response.success) {
        onDocumentsChange();
      } else {
        setError(response.error || "Error al eliminar el documento");
      }
    } catch (err) {
      setError("Error inesperado al eliminar el documento");
    }
  };

  // Convertir documentos al formato de DocumentList
  const documentListItems = documents.map((doc) => ({
    id: doc.id,
    name: doc.name,
    type: doc.type,
    size: formatFileSize(doc.size),
    uploadedAt: formatDate(doc.uploadedAt),
    price: undefined,
  }));

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Hoy";
    if (days === 1) return "Ayer";
    if (days < 7) return `Hace ${days} días`;
    if (days < 30) return `Hace ${Math.floor(days / 7)} semanas`;
    return date.toLocaleDateString("es-PY", { month: "short", day: "numeric" });
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Documentos</h2>
        {canUpload && (
          <div>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              className="hidden"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? "Subiendo..." : "+ Subir Documento"}
            </Button>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-500/20 border border-red-500/50 p-3">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {documents.length > 0 ? (
        <DocumentList
          documents={documentListItems}
          onUpload={() => fileInputRef.current?.click()}
          showUpload={canUpload}
        />
      ) : (
        <div className="text-center py-8">
          <p className="text-white/60 mb-4">No hay documentos subidos todavía.</p>
          {canUpload && (
            <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
              Subir Primer Documento
            </Button>
          )}
        </div>
      )}

      {canUpload && (
        <div className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
          <p className="text-xs text-white/70">
            <strong>Nota:</strong> La subida de documentos es simulada. En producción, los archivos
            se subirían a un servidor real.
          </p>
        </div>
      )}
    </Card>
  );
}
