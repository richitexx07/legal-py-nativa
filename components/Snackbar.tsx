"use client";

import { useEffect } from "react";

interface SnackbarProps {
  message: string;
  type?: "success" | "error" | "info" | "warning";
  isOpen: boolean;
  onClose: () => void;
  duration?: number;
}

export default function Snackbar({
  message,
  type = "info",
  isOpen,
  onClose,
  duration = 4000,
}: SnackbarProps) {
  useEffect(() => {
    if (isOpen && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  const types = {
    success: "bg-green-600",
    error: "bg-red-600",
    info: "bg-[#13253A] border-[#C9A24D]",
    warning: "bg-[#C08457]",
  };

  return (
    <div className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 transform transition-all md:bottom-24">
      <div
        className={`flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg ${types[type]}`}
      >
        <p className="text-sm font-medium text-white">{message}</p>
        <button
          onClick={onClose}
          className="ml-2 text-white/80 hover:text-white"
          aria-label="Cerrar"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
