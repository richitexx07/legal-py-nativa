"use client";

import { useState, useEffect } from "react";

export type ViewMode = "cliente" | "profesional";

interface RoleSwitchProps {
  currentMode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
  className?: string;
}

export default function RoleSwitch({ currentMode, onModeChange, className = "" }: RoleSwitchProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Guardar preferencia en localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("legal-py-view-mode", currentMode);
    }
  }, [currentMode]);

  const handleToggle = () => {
    setIsAnimating(true);
    const newMode: ViewMode = currentMode === "cliente" ? "profesional" : "cliente";
    onModeChange(newMode);
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Cliente Mode */}
      <button
        onClick={handleToggle}
        className={`
          relative flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ease-out
          ${currentMode === "cliente" 
            ? "bg-white/20 text-white shadow-lg scale-105" 
            : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80"}
          ${isAnimating ? "animate-pulse" : ""}
        `}
        aria-label={`Modo ${currentMode === "cliente" ? "Cliente activo" : "Cambiar a Cliente"}`}
      >
        <span className="text-lg">👤</span>
        <span className="hidden sm:inline text-sm font-medium">Cliente</span>
      </button>

      {/* Toggle Switch */}
      <div className="relative">
        <button
          onClick={handleToggle}
          className={`
            relative w-14 h-7 rounded-full transition-all duration-300 ease-out
            ${currentMode === "profesional" ? "bg-[#C9A24D]" : "bg-white/20"}
            focus:outline-none focus:ring-2 focus:ring-[#C9A24D]/50 focus:ring-offset-2 focus:ring-offset-[#0E1B2A]
            ${isAnimating ? "animate-pulse" : ""}
          `}
          aria-label="Cambiar modo de visualización"
        >
          {/* Switch Thumb */}
          <div
            className={`
              absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-lg
              transition-all duration-300 ease-out transform
              ${currentMode === "profesional" ? "translate-x-7" : "translate-x-0"}
            `}
          >
            {/* Icono dentro del thumb */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs">
                {currentMode === "profesional" ? "💼" : "👤"}
              </span>
            </div>
          </div>
        </button>
      </div>

      {/* Profesional Mode */}
      <button
        onClick={handleToggle}
        className={`
          relative flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ease-out
          ${currentMode === "profesional" 
            ? "bg-[#C9A24D]/20 text-[#C9A24D] shadow-lg scale-105 border border-[#C9A24D]/30" 
            : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80"}
          ${isAnimating ? "animate-pulse" : ""}
        `}
        aria-label={`Modo ${currentMode === "profesional" ? "Profesional activo" : "Cambiar a Profesional"}`}
      >
        <span className="text-lg">💼</span>
        <span className="hidden sm:inline text-sm font-medium">Profesional</span>
      </button>
    </div>
  );
}
