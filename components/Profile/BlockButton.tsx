"use client";

import { useState } from "react";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import FormField from "@/components/FormField";
import { blockProfessional, unblockProfessional, isBlocked } from "@/lib/reputation";
import { useEffect } from "react";

interface BlockButtonProps {
  professionalId: string;
  clientId: string;
  professionalName: string;
}

export default function BlockButton({
  professionalId,
  clientId,
  professionalName,
}: BlockButtonProps) {
  const [blocked, setBlocked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setBlocked(isBlocked(professionalId, clientId));
  }, [professionalId, clientId]);

  const handleBlock = async () => {
    setLoading(true);
    try {
      const response = blockProfessional(professionalId, clientId, reason || undefined);
      if (response.success) {
        setBlocked(true);
        setShowModal(false);
        setReason("");
      }
    } catch (error) {
      console.error("Error blocking professional:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnblock = async () => {
    setLoading(true);
    try {
      const response = unblockProfessional(professionalId, clientId);
      if (response.success) {
        setBlocked(false);
      }
    } catch (error) {
      console.error("Error unblocking professional:", error);
    } finally {
      setLoading(false);
    }
  };

  if (blocked) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={handleUnblock}
        disabled={loading}
        className="text-red-400 border-red-400/50 hover:bg-red-400/10"
      >
        {loading ? "Desbloqueando..." : "🔒 Desbloquear"}
      </Button>
    );
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowModal(true)}
        className="text-red-400 border-red-400/50 hover:bg-red-400/10"
      >
        🚫 Bloquear
      </Button>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Bloquear Profesional">
        <div className="space-y-4">
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <p className="text-sm text-white/80">
              Estás a punto de bloquear a <strong>{professionalName}</strong>. Esto significa que:
            </p>
            <ul className="text-sm text-white/70 mt-2 space-y-1 list-disc list-inside">
              <li>No podrás ver sus servicios ni contactarlo</li>
              <li>No recibirás mensajes de este profesional</li>
              <li>Puedes desbloquearlo en cualquier momento</li>
            </ul>
          </div>

          <FormField label="Razón (opcional)" htmlFor="reason">
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D] resize-none"
              placeholder="¿Por qué deseas bloquear a este profesional? (opcional)"
              maxLength={200}
            />
          </FormField>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => {
                setShowModal(false);
                setReason("");
              }}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="primary"
              className="flex-1 bg-red-500 hover:bg-red-600"
              onClick={handleBlock}
              disabled={loading}
            >
              {loading ? "Bloqueando..." : "Confirmar Bloqueo"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
