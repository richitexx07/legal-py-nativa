"use client";

import { useState, useEffect } from "react";
import { getSession, updateKYCTier } from "@/lib/auth";
import Card from "@/components/Card";
import Button from "@/components/Button";

export default function DemoControls() {
  const [isOpen, setIsOpen] = useState(false);
  const [session, setSession] = useState(getSession());
  const [isVisible, setIsVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>(() => {
    if (typeof window === "undefined") return "Básico";
    return localStorage.getItem("legal-py-demo-plan") || "Básico";
  });

  useEffect(() => {
    // Solo visible en desarrollo o si el usuario es admin (simulado)
    if (typeof window !== "undefined") {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'components/Demo/DemoControls.tsx:15',message:'DemoControls init',data:{hostname:window.location.hostname},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H4'})}).catch(()=>{});
      // #endregion
      const isDev = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
      // También visible si hay una flag en localStorage
      const showDemoControls = localStorage.getItem("legal-py-demo-mode") === "true";
      setIsVisible(isDev || showDemoControls);
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'components/Demo/DemoControls.tsx:19',message:'DemoControls visibility set',data:{isDev,showDemoControls,isVisible:isDev||showDemoControls},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H4'})}).catch(()=>{});
      // #endregion
    }
  }, []);

  useEffect(() => {
    // Actualizar sesión cuando cambie
    const currentSession = getSession();
    setSession(currentSession);
  }, [isOpen]);

  if (!isVisible) {
    return null;
  }

  const handleSetTier = async (tier: 1 | 3) => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'components/Demo/DemoControls.tsx:33',message:'handleSetTier called',data:{tier,hasSession:!!session,userId:session?.user.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H4'})}).catch(()=>{});
    // #endregion
    if (!session) {
      alert("Debes estar autenticado para usar los controles de demo");
      return;
    }

    try {
      await updateKYCTier(session.user.id, tier);
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'components/Demo/DemoControls.tsx:40',message:'Tier updated successfully',data:{tier},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H4'})}).catch(()=>{});
      // #endregion
      // Actualizar sesión local
      const updatedSession = getSession();
      if (updatedSession) {
        setSession(updatedSession);
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'components/Demo/DemoControls.tsx:45',message:'Reloading page',data:{newTier:updatedSession.user.kycTier},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H4'})}).catch(()=>{});
        // #endregion
        // Forzar recarga de la página para actualizar toda la UI
        window.location.reload();
      }
    } catch (error) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'components/Demo/DemoControls.tsx:50',message:'ERROR updating tier',data:{errorMessage:error instanceof Error?error.message:String(error)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H4'})}).catch(()=>{});
      // #endregion
      alert("Error al actualizar el tier: " + (error instanceof Error ? error.message : String(error)));
    }
  };

  const handleResetData = () => {
    if (confirm("¿Estás seguro de que quieres resetear todos los datos? Esto borrará el localStorage.")) {
      // Borrar datos específicos pero mantener sesión
      localStorage.removeItem("legal-py-cases");
      localStorage.removeItem("inscripcionesCursos");
      localStorage.removeItem("postulacionesPasantias");
      localStorage.removeItem("solicitudesCapacitacion");
      
      alert("Datos reseteados. La página se recargará.");
      window.location.reload();
    }
  };

  const currentTier = session?.user.kycTier || 0;
  const tierNames = {
    0: "Visitante",
    1: "Básico",
    2: "Verificado",
    3: "GEP/Corp",
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium shadow-lg transition"
          title="Controles de Demo"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
            />
          </svg>
          <span className="hidden sm:inline">Demo</span>
        </button>
      ) : (
        <Card className="w-64 shadow-2xl">
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-white">🎮 Controles de Demo</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/60 hover:text-white transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-2 rounded-lg bg-white/5 border border-white/10 space-y-1">
              <p className="text-xs text-white/60 mb-1">Nivel Actual</p>
              <p className="text-sm font-semibold text-white">
                Nivel {currentTier} - {tierNames[currentTier as keyof typeof tierNames]}
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-white/60">Cambiar Nivel Rápido</p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={currentTier === 1 ? "primary" : "outline"}
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => handleSetTier(1)}
                >
                  👮‍♂️ Nivel 1
                </Button>
                <Button
                  variant={currentTier === 3 ? "primary" : "outline"}
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => handleSetTier(3)}
                >
                  👑 GEP
                </Button>
              </div>
            </div>

            <div className="border-t border-white/10 pt-2 space-y-2">
              <p className="text-xs text-white/60 mb-1">Simular Plan</p>
              <select
                value={selectedPlan}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedPlan(value);
                  if (typeof window !== "undefined") {
                    localStorage.setItem("legal-py-demo-plan", value);
                    // #region agent log
                    fetch('http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9',{
                      method:'POST',
                      headers:{'Content-Type':'application/json'},
                      body:JSON.stringify({location:'components/Demo/DemoControls.tsx:planChange',message:'Demo plan changed',data:{plan:value},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypeothesisId:'H4'}),
                    }).catch(()=>{});
                    // #endregion
                    window.dispatchEvent(new CustomEvent('legal-py-plan-changed',{ detail:{ plan:value }}));
                  }
                }}
                className="w-full rounded-lg bg-slate-900/80 border border-white/20 px-2 py-1 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <option value="Básico">Básico</option>
                <option value="Profesional">Profesional</option>
                <option value="Empresarial">Empresarial</option>
                <option value="GEP">GEP</option>
              </select>
            </div>

            <div className="border-t border-white/10 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs text-red-400 border-red-400/30 hover:bg-red-500/10"
                onClick={handleResetData}
              >
                🗑️ Resetear Datos
              </Button>
            </div>

            <p className="text-xs text-white/40 text-center mt-2">
              Modo Demo - Solo desarrollo
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
