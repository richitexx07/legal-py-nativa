"use client";

import { useState } from "react";
import Button from "./Button";

export default function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* FAB Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#C9A24D] shadow-lg transition hover:bg-[#b8943f] md:bottom-6 md:right-6"
        aria-label="Abrir chat"
      >
        {isOpen ? (
          <svg className="h-6 w-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg className="h-6 w-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-32 right-4 z-40 w-80 rounded-2xl border border-white/10 bg-[#13253A] shadow-2xl md:bottom-20 md:right-6">
          <div className="flex items-center justify-between border-b border-white/10 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C9A24D]">
                <span className="text-sm font-bold text-black">LP</span>
              </div>
              <div>
                <h3 className="font-semibold text-white">Asistente Legal</h3>
                <p className="text-xs text-white/60">En línea</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1 hover:bg-white/5"
              aria-label="Cerrar chat"
            >
              <svg className="h-5 w-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="max-h-96 space-y-4 overflow-y-auto p-4">
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10">
                <span className="text-xs font-bold text-white">LP</span>
              </div>
              <div className="flex-1 rounded-lg bg-white/5 p-3">
                <p className="text-sm text-white/90">
                  Hola, soy el asistente de Legal Py. ¿En qué puedo ayudarte hoy?
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#C9A24D]">
                <span className="text-xs font-bold text-black">Tú</span>
              </div>
              <div className="flex-1 rounded-lg bg-[#C9A24D]/20 p-3">
                <p className="text-sm text-white/90">Necesito un abogado penalista</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10">
                <span className="text-xs font-bold text-white">LP</span>
              </div>
              <div className="flex-1 rounded-lg bg-white/5 p-3">
                <p className="text-sm text-white/90">
                  Te puedo ayudar a encontrar profesionales verificados. ¿En qué ciudad estás?
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 p-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Escribe tu mensaje..."
                className="flex-1 rounded-lg bg-white/10 px-4 py-2 text-sm text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-[#C9A24D]/60"
              />
              <Button variant="primary" size="sm">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
