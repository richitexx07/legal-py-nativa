"use client";

import { useState } from "react";
import { CreateReviewData } from "@/lib/reputation";
import { addReview } from "@/lib/reputation";
import Button from "@/components/Button";
import FormField from "@/components/FormField";
import Card from "@/components/Card";

interface ReviewFormModalProps {
  professionalId: string;
  clientId: string;
  onSubmit: () => void;
  onCancel?: () => void;
}

export default function ReviewForm({ professionalId, clientId, onSubmit, onCancel }: ReviewFormModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const availableTags = ["Puntual", "Comunicativo", "Profesional", "Detallado", "Accesible"];

  const toggleTag = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter((t) => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (rating === 0) {
      setErrors({ rating: "Por favor selecciona una calificación" });
      return;
    }

    if (!comment || comment.trim().length < 10) {
      setErrors({ comment: "El comentario debe tener al menos 10 caracteres" });
      return;
    }

    setLoading(true);

    try {
      const data: CreateReviewData = {
        professionalId,
        clientId,
        rating,
        comment: comment.trim(),
        tags: tags.length > 0 ? tags : undefined,
      };

      const response = addReview(data);

      if (response.success) {
        onSubmit();
      } else {
        setErrors({ general: response.error || "Error al enviar la reseña" });
      }
    } catch (error) {
      setErrors({ general: "Error inesperado. Intenta nuevamente." });
    } finally {
      setLoading(false);
    }
  };

  const renderStars = () => {
    return [...Array(5)].map((_, i) => {
      const starValue = i + 1;
      const displayRating = hoverRating || rating;
      return (
        <button
          key={i}
          type="button"
          onClick={() => setRating(starValue)}
          onMouseEnter={() => setHoverRating(starValue)}
          onMouseLeave={() => setHoverRating(0)}
          className="focus:outline-none"
        >
          <svg
            className={`h-8 w-8 transition-colors ${
              starValue <= displayRating ? "text-[#C9A24D]" : "text-white/20"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      );
    });
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.general && (
          <div className="rounded-lg bg-red-500/20 border border-red-500/50 p-3">
            <p className="text-sm text-red-400">{errors.general}</p>
          </div>
        )}

        <FormField label="Calificación" required error={errors.rating}>
          <div className="flex items-center gap-2" onMouseLeave={() => setHoverRating(0)}>
            {renderStars()}
            {rating > 0 && (
              <span className="ml-2 text-sm text-white/70">
                {rating === 1 && "Muy malo"}
                {rating === 2 && "Malo"}
                {rating === 3 && "Regular"}
                {rating === 4 && "Bueno"}
                {rating === 5 && "Excelente"}
              </span>
            )}
          </div>
        </FormField>

        <FormField label="Comentario" htmlFor="comment" required error={errors.comment}>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D] resize-none"
            placeholder="Comparte tu experiencia con este profesional..."
            maxLength={1000}
          />
          <p className="text-xs text-white/60 mt-1">{comment.length}/1000 caracteres</p>
        </FormField>

        <FormField label="Características (opcional)">
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1.5 rounded-lg text-sm transition ${
                  tags.includes(tag)
                    ? "bg-[#C9A24D] text-black font-medium"
                    : "bg-white/5 border border-white/10 text-white/70 hover:bg-white/10"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </FormField>

        <div className="flex gap-3 pt-2">
          {onCancel && (
            <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          <Button type="submit" variant="primary" className="flex-1" disabled={loading}>
            {loading ? "Enviando..." : "Publicar Reseña"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
