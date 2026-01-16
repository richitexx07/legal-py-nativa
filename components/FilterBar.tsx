"use client";

import { ReactNode } from "react";

interface FilterBarProps {
  children: ReactNode;
  onClear?: () => void;
  showClearButton?: boolean;
}

export default function FilterBar({ children, onClear, showClearButton = true }: FilterBarProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">{children}</div>
      {showClearButton && onClear && (
        <button
          onClick={onClear}
          className="text-sm text-[#C9A24D] hover:underline"
          type="button"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );
}
