"use client";

import { ReactNode, useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  className?: string;
  position?: "center" | "below-button";
  buttonPosition?: { top: number; right: number };
  /** Permite sobreescribir la capa (z-index) del overlay principal */
  zIndexClass?: string;
}

export default function Modal({
  isOpen,
  onClose,
  children,
  title,
  className = "",
  position = "center",
  buttonPosition,
  zIndexClass,
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const positionClasses = position === "below-button" 
    ? "flex items-start justify-end"
    : "flex items-center justify-center p-4 min-h-screen";

  const modalStyle = position === "below-button" && buttonPosition
    ? {
        top: `${buttonPosition.top}px`,
        right: `${buttonPosition.right}px`,
      }
    : {};

  const zClass = zIndexClass || "z-50";

  return (
    <div className={`fixed inset-0 ${zClass} ${positionClasses}`}>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className={`relative w-full max-w-md rounded-2xl border border-white/10 bg-[#13253A] shadow-2xl ${position === "below-button" ? "m-4 absolute" : ""} ${className}`}
        style={modalStyle}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-center justify-between border-b border-white/10 p-6">
            <h2 className="text-xl font-bold text-white">{title}</h2>
            <button
              onClick={onClose}
              className="rounded-lg p-1 hover:bg-white/5 transition text-white/60 hover:text-white"
              aria-label="Cerrar"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}
        <div className={title ? "p-6" : "p-6"}>{children}</div>
      </div>
    </div>
  );
}
