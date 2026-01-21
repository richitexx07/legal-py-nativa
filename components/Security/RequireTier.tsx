"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/auth";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Link from "next/link";

interface RequireTierProps {
  tier: 0 | 1 | 2 | 3;
  children: ReactNode;
  fallback?: ReactNode;
}

export default function RequireTier({ tier, children, fallback }: RequireTierProps) {
  const router = useRouter();
  const [session, setSession] = useState<ReturnType<typeof getSession>>(null);
  const [mounted, setMounted] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const currentSession = getSession();
      setSession(currentSession);

      if (!currentSession) {
        router.push("/login");
        return;
      }

      if (currentSession.user.kycTier < tier) {
        setShowModal(true);
      }
    }
  }, [tier, router]);

  if (!mounted || !session) {
    return null;
  }

  if (session.user.kycTier < tier) {
    if (fallback) {
      return <>{fallback}</>;
    }

    const tierNames = {
      0: "Visitante",
      1: "Básico",
      2: "Verificado",
      3: "GEP/Corporativo",
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <Card className="max-w-md w-full mx-4">
          <div className="p-6 text-center">
            <div className="text-6xl mb-4">🛑</div>
            <h2 className="text-2xl font-bold text-white mb-2">Acceso Restringido</h2>
            <p className="text-white/70 mb-4">
              Necesitas verificar tu identidad (Nivel {tier} - {tierNames[tier]}) para realizar esta acción.
            </p>
            <p className="text-sm text-white/60 mb-6">
              Tu nivel actual: <span className="font-semibold text-white">Nivel {session.user.kycTier} - {tierNames[session.user.kycTier]}</span>
            </p>
            <div className="space-y-3">
              <Link href="/security-center" className="block">
                <Button variant="primary" className="w-full">
                  Ir al Centro de Seguridad
                </Button>
              </Link>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setShowModal(false);
                  router.back();
                }}
              >
                Volver
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
