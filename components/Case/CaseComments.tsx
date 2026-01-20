"use client";

import { useState } from "react";
import { CaseComment } from "@/lib/cases";
import Card from "@/components/Card";
import Button from "@/components/Button";
import FormField from "@/components/FormField";
import Badge from "@/components/Badge";
import { addComment } from "@/lib/cases";

interface CaseCommentsProps {
  caseId: string;
  comments: CaseComment[];
  currentUserId: string;
  currentUserName: string;
  currentUserRole: "cliente" | "profesional";
  onCommentsChange: () => void;
}

export default function CaseComments({
  caseId,
  comments,
  currentUserId,
  currentUserName,
  currentUserRole,
  onCommentsChange,
}: CaseCommentsProps) {
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!newComment.trim()) {
      setError("El comentario no puede estar vacío");
      return;
    }

    setLoading(true);

    try {
      const response = await addComment(
        caseId,
        newComment,
        currentUserId,
        currentUserName,
        currentUserRole
      );

      if (response.success) {
        setNewComment("");
        onCommentsChange();
      } else {
        setError(response.error || "Error al agregar el comentario");
      }
    } catch (err) {
      setError("Error inesperado. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "Hace un momento";
    if (minutes < 60) return `Hace ${minutes} minuto${minutes > 1 ? "s" : ""}`;
    if (hours < 24) return `Hace ${hours} hora${hours > 1 ? "s" : ""}`;
    if (days < 7) return `Hace ${days} día${days > 1 ? "s" : ""}`;
    return date.toLocaleDateString("es-PY", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  return (
    <Card>
      <h2 className="text-xl font-bold text-white mb-4">Comentarios</h2>

      {/* Formulario de nuevo comentario */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-3">
        {error && (
          <div className="rounded-lg bg-red-500/20 border border-red-500/50 p-3">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <FormField label="Nuevo Comentario" htmlFor="comment">
          <textarea
            id="comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D] resize-none"
            placeholder="Escribe un comentario sobre el caso..."
            maxLength={1000}
          />
          <p className="text-xs text-white/60 mt-1">{newComment.length}/1000 caracteres</p>
        </FormField>

        <Button type="submit" variant="primary" size="sm" disabled={loading || !newComment.trim()}>
          {loading ? "Enviando..." : "Agregar Comentario"}
        </Button>
      </form>

      {/* Lista de comentarios */}
      <div className="space-y-4">
        {comments.length > 0 ? (
          comments
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map((comment) => (
              <div
                key={comment.id}
                className="rounded-lg border border-white/10 bg-white/5 p-4 space-y-2"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-white">{comment.authorName}</p>
                      <Badge variant="outline" className="text-xs">
                        {comment.authorRole === "cliente" ? "👤 Cliente" : "⚖️ Profesional"}
                      </Badge>
                      <span className="text-xs text-white/60">{formatDate(comment.createdAt)}</span>
                    </div>
                    <p className="text-white/80 leading-relaxed whitespace-pre-wrap">
                      {comment.content}
                    </p>
                    {comment.editedAt && (
                      <p className="text-xs text-white/50 mt-1 italic">
                        Editado {formatDate(comment.editedAt)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
        ) : (
          <div className="text-center py-8">
            <p className="text-white/60">No hay comentarios todavía.</p>
            <p className="text-sm text-white/50 mt-1">Sé el primero en comentar.</p>
          </div>
        )}
      </div>
    </Card>
  );
}
