"use client";

import { use, useState, useEffect } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Tabs from "@/components/Tabs";
import { getCaseById, updateCase, updateChecklistItem, assignProfessional } from "@/lib/cases";
import { getSession } from "@/lib/auth";
import type { Case, CaseStatus } from "@/lib/cases";

// Componentes de casos
import CaseHeader from "@/components/Case/CaseHeader";
import CaseTimeline from "@/components/Case/CaseTimeline";
import CaseChecklist from "@/components/Case/CaseChecklist";
import CaseDocuments from "@/components/Case/CaseDocuments";
import CaseComments from "@/components/Case/CaseComments";
import CaseInfo from "@/components/Case/CaseInfo";
import PaymentHistory from "@/components/Payments/PaymentHistory";
import PaymentForm from "@/components/Payments/PaymentForm";
import { getPaymentsByCase } from "@/lib/payments";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CasoDetallePage({ params }: PageProps) {
  const { id } = use(params);
  const session = getSession();
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [payments, setPayments] = useState<any[]>([]);

  // Cargar caso
  useEffect(() => {
    const loadCase = () => {
      const caseItem = getCaseById(id);
      if (!caseItem) {
        setError("Caso no encontrado");
        setLoading(false);
        return;
      }

      // Verificar permisos
      if (session) {
        const isClient = session.user.role === "cliente";
        const isProfessional = session.user.role === "profesional";

        if (
          (isClient && caseItem.clientId !== session.user.id) ||
          (isProfessional && caseItem.professionalId !== session.user.id)
        ) {
          setError("No tienes permisos para ver este caso");
          setLoading(false);
          return;
        }
      }

      setCaseData(caseItem);
      
      // Cargar pagos asociados al caso
      const casePayments = getPaymentsByCase(id);
      setPayments(casePayments);
      
      setLoading(false);
    };

    loadCase();
  }, [id, session]);

  const handleStatusChange = async (newStatus: CaseStatus) => {
    if (!caseData || !session) return;

    try {
      const response = await updateCase(caseData.id, { status: newStatus }, session.user.id);
      if (response.success && response.case) {
        setCaseData(response.case);
      }
    } catch (err) {
      console.error("Error updating case status:", err);
    }
  };

  const handleChecklistToggle = async (itemId: string, completed: boolean) => {
    if (!caseData || !session) return;

    try {
      const response = await updateChecklistItem(
        caseData.id,
        itemId,
        completed,
        session.user.id
      );
      if (response.success) {
        // Recargar caso
        const updatedCase = getCaseById(caseData.id);
        if (updatedCase) {
          setCaseData(updatedCase);
        }
      }
    } catch (err) {
      console.error("Error updating checklist:", err);
    }
  };

  const handleDocumentsChange = () => {
    if (!caseData) return;
    const updatedCase = getCaseById(caseData.id);
    if (updatedCase) {
      setCaseData(updatedCase);
    }
  };

  const handleCommentsChange = () => {
    if (!caseData) return;
    const updatedCase = getCaseById(caseData.id);
    if (updatedCase) {
      setCaseData(updatedCase);
    }
  };

  const handlePaymentSuccess = () => {
    if (!caseData) return;
    const casePayments = getPaymentsByCase(caseData.id);
    setPayments(casePayments);
    setShowPaymentForm(false);
  };

  const handleAssignProfessional = () => {
    // En producción, esto abriría un modal para seleccionar profesional
    alert("Funcionalidad de asignación de profesional - Próximamente");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#C9A24D] border-r-transparent"></div>
          <p className="mt-4 text-white/60">Cargando caso...</p>
        </div>
      </div>
    );
  }

  if (error || !caseData) {
    return (
      <div className="space-y-6">
        <Card>
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/20 mb-4">
              <span className="text-3xl">❌</span>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">
              {error || "Caso no encontrado"}
            </h2>
            <p className="text-white/70 mb-6">
              {error || "El caso que buscas no existe o no tienes permisos para verlo."}
            </p>
            <Link href="/casos">
              <Button variant="primary">Volver a Casos</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const isClient = session?.user.role === "cliente";
  const isProfessional = session?.user.role === "profesional";
  const canEdit = isClient || (isProfessional && caseData.professionalId === session?.user.id);

  const tabs = [
    {
      id: "timeline",
      label: "Timeline",
      content: (
        <CaseTimeline
          events={caseData.timeline}
          canAddEvents={canEdit}
          onAddEvent={() => {
            alert("Funcionalidad de agregar evento - Próximamente");
          }}
        />
      ),
    },
    {
      id: "checklist",
      label: "Checklist",
      content: (
        <CaseChecklist
          items={caseData.checklist}
          onToggleItem={handleChecklistToggle}
          canEdit={canEdit}
          onAddItem={() => {
            alert("Funcionalidad de agregar tarea - Próximamente");
          }}
        />
      ),
    },
    {
      id: "documentos",
      label: "Documentos",
      content: (
        <CaseDocuments
          caseId={caseData.id}
          documents={caseData.documents}
          userId={session?.user.id || ""}
          onDocumentsChange={handleDocumentsChange}
          canUpload={canEdit}
        />
      ),
    },
    {
      id: "comentarios",
      label: "Comentarios",
      content: (
        <CaseComments
          caseId={caseData.id}
          comments={caseData.comments}
          currentUserId={session?.user.id || ""}
          currentUserName={
            session?.profile && "firstName" in session.profile
              ? `${session.profile.firstName} ${session.profile.lastName || ""}`.trim() || "Usuario"
              : "Usuario"
          }
          currentUserRole={isClient ? "cliente" : "profesional"}
          onCommentsChange={handleCommentsChange}
        />
      ),
    },
    {
      id: "pagos",
      label: "Pagos",
      content: showPaymentForm ? (
        <PaymentForm
          caseId={caseData.id}
          clientId={caseData.clientId}
          professionalId={caseData.professionalId}
          onSuccess={handlePaymentSuccess}
          onCancel={() => setShowPaymentForm(false)}
        />
      ) : (
        <PaymentHistory
          filters={{ caseId: caseData.id }}
          showRegisterButton={canEdit}
          onRegisterClick={() => setShowPaymentForm(true)}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <CaseHeader
            caseData={caseData}
            onStatusChange={handleStatusChange}
            showActions={canEdit}
          />
        </div>
        <Link href="/casos">
          <Button variant="ghost" size="sm">
            ← Volver
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <Card>
            <Tabs tabs={tabs} defaultTab="timeline" />
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <CaseInfo caseData={caseData} onAssignProfessional={handleAssignProfessional} />

          {/* Notificaciones */}
          {caseData.notifications.length > 0 && (
            <Card>
              <h3 className="font-semibold text-white mb-4">Notificaciones</h3>
              <div className="space-y-3">
                {caseData.notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="rounded-lg border border-white/10 bg-white/5 p-3 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-white text-sm">{notif.type}</p>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          notif.status === "entregada"
                            ? "bg-green-500/20 text-green-400"
                            : notif.status === "pendiente"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {notif.status}
                      </span>
                    </div>
                    <p className="text-xs text-white/60">
                      {new Date(notif.scheduledDate).toLocaleDateString("es-PY")}
                    </p>
                    {notif.evidence && (
                      <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                        <span className="text-xs text-white/60">Evidencia:</span>
                        <span className="text-xs">
                          {notif.evidence.type === "acuse" && "📄 Acuse"}
                          {notif.evidence.type === "foto" && "📷 Foto"}
                          {notif.evidence.type === "geotag" && "📍 Geotag"}
                          {notif.evidence.type === "documento" && "📄 Documento"}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
