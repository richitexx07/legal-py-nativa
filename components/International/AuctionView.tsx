"use client";

import { useState } from "react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import FormField from "@/components/FormField";
import {
  InternationalCase,
  submitAuctionBid,
  selectAuctionWinner,
  getTop5Consortia,
  LegalConsortium,
} from "@/lib/international";

interface AuctionViewProps {
  caseData: InternationalCase;
  onUpdate: () => void;
  isAdmin?: boolean; // Si el usuario puede seleccionar ganador
}

export default function AuctionView({ caseData, onUpdate, isAdmin = false }: AuctionViewProps) {
  const [showBidForm, setShowBidForm] = useState(false);
  const [selectedConsortium, setSelectedConsortium] = useState("");
  const [amount, setAmount] = useState("");
  const [proposedFee, setProposedFee] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const consortia = getTop5Consortia();
  const isActive = caseData.auctionActive;
  const endDate = caseData.auctionEndDate ? new Date(caseData.auctionEndDate) : null;
  const isExpired = endDate ? new Date() > endDate : false;
  const bids = caseData.auctionBids || [];

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleSubmitBid = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const amountNum = parseFloat(amount);
    const feeNum = parseFloat(proposedFee);

    if (!selectedConsortium) {
      setErrors({ consortium: "Debes seleccionar un consorcio" });
      return;
    }
    if (!amount || isNaN(amountNum) || amountNum <= 0) {
      setErrors({ amount: "El monto debe ser mayor a 0" });
      return;
    }
    if (!proposedFee || isNaN(feeNum) || feeNum < 0 || feeNum > 100) {
      setErrors({ fee: "La tarifa debe ser entre 0 y 100%" });
      return;
    }
    if (!estimatedTime) {
      setErrors({ time: "Debes especificar el tiempo estimado" });
      return;
    }

    setLoading(true);

    try {
      const response = await submitAuctionBid({
        caseId: caseData.id,
        consortiumId: selectedConsortium,
        amount: amountNum,
        proposedFee: feeNum,
        estimatedTime,
        notes: notes.trim() || undefined,
      });

      if (response.success) {
        setShowBidForm(false);
        setAmount("");
        setProposedFee("");
        setEstimatedTime("");
        setNotes("");
        setSelectedConsortium("");
        onUpdate();
      } else {
        setErrors({ general: response.error || "Error al enviar la oferta" });
      }
    } catch (error) {
      setErrors({ general: "Error inesperado. Intenta nuevamente." });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectWinner = async (bidId: string) => {
    if (!confirm("¿Estás seguro de seleccionar esta oferta como ganadora?")) return;

    setLoading(true);
    try {
      const response = await selectAuctionWinner(caseData.id, bidId);
      if (response.success) {
        onUpdate();
      } else {
        alert(response.error || "Error al seleccionar ganador");
      }
    } catch (error) {
      alert("Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  if (!isActive && !isExpired && bids.length === 0) {
    return (
      <Card>
        <div className="text-center py-8">
          <p className="text-white/60">La subasta aún no ha comenzado.</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white">Subasta de Caso Internacional</h2>
            <p className="text-sm text-white/60 mt-1">
              Caso: <strong>{caseData.title}</strong>
            </p>
          </div>
          {isActive && endDate && (
            <Badge variant="terracota" className="text-xs">
              {isExpired ? "Finalizada" : `Finaliza: ${endDate.toLocaleDateString("es-PY")}`}
            </Badge>
          )}
        </div>

        {/* Info del caso */}
        <div className="p-4 rounded-lg bg-white/5 border border-white/10 mb-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-white/60">Monto estimado:</span>
              <p className="text-white font-semibold">{formatAmount(caseData.estimatedAmount)}</p>
            </div>
            <div>
              <span className="text-white/60">Países:</span>
              <p className="text-white">{caseData.countriesInvolved.join(", ")}</p>
            </div>
            <div>
              <span className="text-white/60">Complejidad:</span>
              <p className="text-white capitalize">{caseData.complexity.replace("_", " ")}</p>
            </div>
            <div>
              <span className="text-white/60">Idiomas:</span>
              <p className="text-white">{caseData.languagesRequired?.join(", ")}</p>
            </div>
          </div>
        </div>

        {/* Ofertas */}
        <div className="mb-6">
          <h3 className="font-semibold text-white mb-4">
            Ofertas Recibidas ({bids.length})
          </h3>
          {bids.length > 0 ? (
            <div className="space-y-3">
              {bids
                .sort((a, b) => b.amount - a.amount) // Ordenar por monto descendente
                .map((bid) => {
                  const consortium = consortia.find((c) => c.id === bid.consortiumId);
                  return (
                    <Card
                      key={bid.id}
                      className={`p-4 ${
                        bid.status === "aceptada"
                          ? "border-[#C9A24D] bg-[#C9A24D]/10"
                          : "border-white/10"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-white">
                              {bid.consortiumName}
                            </h4>
                            {bid.status === "aceptada" && (
                              <Badge variant="accent" className="text-xs">
                                ✓ Ganador
                              </Badge>
                            )}
                            {bid.status === "rechazada" && (
                              <Badge variant="outline" className="text-xs">
                                Rechazada
                              </Badge>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                            <div>
                              <span className="text-white/60">Monto:</span>
                              <p className="text-white font-semibold">{formatAmount(bid.amount)}</p>
                            </div>
                            <div>
                              <span className="text-white/60">Tarifa propuesta:</span>
                              <p className="text-white">{bid.proposedFee}%</p>
                            </div>
                            <div>
                              <span className="text-white/60">Tiempo estimado:</span>
                              <p className="text-white">{bid.estimatedTime}</p>
                            </div>
                            <div>
                              <span className="text-white/60">Enviada:</span>
                              <p className="text-white">
                                {new Date(bid.submittedAt).toLocaleDateString("es-PY")}
                              </p>
                            </div>
                          </div>
                          {bid.notes && (
                            <div className="mt-2 pt-2 border-t border-white/10">
                              <p className="text-xs text-white/60 mb-1">Notas:</p>
                              <p className="text-sm text-white/70">{bid.notes}</p>
                            </div>
                          )}
                          {consortium && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              <Badge variant="outline" className="text-xs">
                                ⭐ {consortium.rating}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {consortium.casesCompleted} casos
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {consortium.successRate}% éxito
                              </Badge>
                            </div>
                          )}
                        </div>
                        {isAdmin && bid.status === "pendiente" && !isExpired && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleSelectWinner(bid.id)}
                            disabled={loading}
                          >
                            Seleccionar
                          </Button>
                        )}
                      </div>
                    </Card>
                  );
                })}
            </div>
          ) : (
            <div className="text-center py-8 rounded-lg bg-white/5 border border-white/10">
              <p className="text-white/60">Aún no hay ofertas recibidas.</p>
            </div>
          )}
        </div>

        {/* Formulario de oferta */}
        {isActive && !isExpired && (
          <Card>
            {!showBidForm ? (
              <Button variant="primary" onClick={() => setShowBidForm(true)} className="w-full">
                + Enviar Oferta
              </Button>
            ) : (
              <form onSubmit={handleSubmitBid} className="space-y-4">
                <h3 className="font-semibold text-white mb-4">Nueva Oferta</h3>
                {errors.general && (
                  <div className="rounded-lg bg-red-500/20 border border-red-500/50 p-3">
                    <p className="text-sm text-red-400">{errors.general}</p>
                  </div>
                )}

                <FormField label="Consorcio" htmlFor="consortium" required error={errors.consortium}>
                  <select
                    id="consortium"
                    value={selectedConsortium}
                    onChange={(e) => setSelectedConsortium(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
                    style={{ colorScheme: "dark" }}
                  >
                    <option value="" className="bg-[#13253A] text-white">
                      Selecciona un consorcio
                    </option>
                    {consortia.map((c) => (
                      <option key={c.id} value={c.id} className="bg-[#13253A] text-white">
                        {c.name} (⭐ {c.rating})
                      </option>
                    ))}
                  </select>
                </FormField>

                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Monto (USD)" htmlFor="amount" required error={errors.amount}>
                    <input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="0"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
                      placeholder="5000"
                    />
                  </FormField>

                  <FormField
                    label="Tarifa Propuesta (%)"
                    htmlFor="fee"
                    required
                    error={errors.fee}
                  >
                    <input
                      id="fee"
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={proposedFee}
                      onChange={(e) => setProposedFee(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
                      placeholder="15"
                    />
                  </FormField>
                </div>

                <FormField
                  label="Tiempo Estimado"
                  htmlFor="time"
                  required
                  error={errors.time}
                >
                  <input
                    id="time"
                    type="text"
                    value={estimatedTime}
                    onChange={(e) => setEstimatedTime(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
                    placeholder="Ej: 3-6 meses"
                  />
                </FormField>

                <FormField label="Notas (opcional)" htmlFor="notes">
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D] resize-none"
                    placeholder="Información adicional sobre tu oferta..."
                    maxLength={500}
                  />
                </FormField>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setShowBidForm(false);
                      setErrors({});
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" variant="primary" className="flex-1" disabled={loading}>
                    {loading ? "Enviando..." : "Enviar Oferta"}
                  </Button>
                </div>
              </form>
            )}
          </Card>
        )}

        {isExpired && bids.length > 0 && !caseData.auctionWinner && (
          <Card className="bg-yellow-500/10 border-yellow-500/30">
            <p className="text-sm text-yellow-400">
              La subasta ha finalizado. {isAdmin ? "Selecciona un ganador." : "Esperando selección de ganador."}
            </p>
          </Card>
        )}
      </Card>
    </div>
  );
}
