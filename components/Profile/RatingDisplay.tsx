"use client";

import { RatingStats } from "@/lib/reputation";
import Card from "@/components/Card";

interface RatingDisplayProps {
  stats: RatingStats;
  showDistribution?: boolean;
}

export default function RatingDisplay({ stats, showDistribution = true }: RatingDisplayProps) {
  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <svg
        key={i}
        className={`h-5 w-5 ${
          i < Math.floor(rating) ? "text-[#C9A24D]" : "text-white/20"
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  const percentage = (value: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-6">
        <div className="text-center">
          <p className="text-5xl font-bold text-[#C9A24D]">
            {stats.average > 0 ? stats.average.toFixed(1) : "—"}
          </p>
          <div className="flex items-center justify-center gap-1 mt-2">
            {renderStars(stats.average)}
          </div>
          <p className="text-sm text-white/60 mt-2">
            {stats.total} {stats.total === 1 ? "reseña" : "reseñas"}
          </p>
        </div>

        {showDistribution && stats.total > 0 && (
          <div className="flex-1 space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = stats.distribution[rating.toString() as keyof typeof stats.distribution];
              const pct = percentage(count, stats.total);
              return (
                <div key={rating} className="flex items-center gap-3">
                  <span className="text-sm text-white/70 w-8">{rating} ⭐</span>
                  <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#C9A24D] rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs text-white/60 w-12 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
