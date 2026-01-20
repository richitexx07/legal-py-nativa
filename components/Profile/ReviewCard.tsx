"use client";

import Card from "@/components/Card";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import { Review } from "@/lib/reputation";
import { markReviewHelpful } from "@/lib/reputation";
import { useState } from "react";

interface ReviewCardProps {
  review: Review;
  professionalId: string;
  currentUserId?: string;
  onHelpfulClick?: (reviewId: string) => void;
}

export default function ReviewCard({
  review,
  professionalId,
  currentUserId,
  onHelpfulClick,
}: ReviewCardProps) {
  const [helpfulCount, setHelpfulCount] = useState(review.helpful || 0);
  const [hasMarkedHelpful, setHasMarkedHelpful] = useState(false);

  const handleHelpful = () => {
    if (!hasMarkedHelpful) {
      markReviewHelpful(review.id, professionalId);
      setHelpfulCount((prev) => prev + 1);
      setHasMarkedHelpful(true);
      if (onHelpfulClick) {
        onHelpfulClick(review.id);
      }
    }
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <svg
        key={i}
        className={`h-4 w-4 ${i < rating ? "text-[#C9A24D]" : "text-white/20"}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Hoy";
    if (days === 1) return "Ayer";
    if (days < 7) return `Hace ${days} días`;
    if (days < 30) return `Hace ${Math.floor(days / 7)} semanas`;
    if (days < 365) return `Hace ${Math.floor(days / 30)} meses`;
    return `Hace ${Math.floor(days / 365)} años`;
  };

  return (
    <Card>
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <p className="font-semibold text-white">{review.clientName}</p>
              {review.verified && (
                <Badge variant="outline" className="text-xs">
                  ✓ Verificado
                </Badge>
              )}
              <span className="text-xs text-white/60">{formatDate(review.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1 mb-2">{renderStars(review.rating)}</div>
          </div>
        </div>

        <p className="text-white/80 leading-relaxed">{review.comment}</p>

        {review.tags && review.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {review.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {review.response && (
          <div className="mt-3 pt-3 border-t border-white/10">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-white">Respuesta del profesional</span>
                  <span className="text-xs text-white/60">
                    {formatDate(review.response.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-white/70 leading-relaxed">{review.response.text}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <button
            onClick={handleHelpful}
            disabled={hasMarkedHelpful}
            className={`text-xs flex items-center gap-1 ${
              hasMarkedHelpful
                ? "text-[#C9A24D] cursor-default"
                : "text-white/60 hover:text-white cursor-pointer"
            }`}
          >
            <span>👍</span>
            <span>Útil ({helpfulCount})</span>
          </button>
        </div>
      </div>
    </Card>
  );
}
