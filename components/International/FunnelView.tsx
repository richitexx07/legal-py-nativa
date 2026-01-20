"use client";

import { useState } from "react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import {
  InternationalCase,
  processGEPGoldResponse,
  processConsortiumResponse,
  sendToTop5Consortia,
  getTop5Consortia,
  LegalConsortium,
} from "@/lib/international";

interface FunnelViewProps {
  caseData: InternationalCase;
  onUpdate: () => void;
  isGEPGold?: boolean; // Si el usuario es GEP Gold
}

export default function FunnelView({ caseData, onUpdate, isGEPGold = false }: FunnelViewProps) {
  const [loading, setLoading] = useState(false);
  const [selectedStep, setSelectedStep] = useState<"gep" | "consortia">("gep");
  const consortia = getTop5Consortia();

  const handleGEPGoldResponse = async (response: "aceptado" | "declinado", notes?: string) => {
    setLoading(true);
    try {
      await processGEPGoldResponse({
        caseId: caseData.id,
        response,
        notes,
      });
      onUpdate();
    } catch (error) {
      console.error("Error processing GEP Gold response:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConsortiumResponse = async (
    consortiumId: string,
    response: "aceptado" | "declinado",
    notes?: string
  ) => {
    setLoading(true);
    try {
      await processConsortiumResponse({
        caseId: caseData.id,
        consortiumId,
        response,
        notes,
      });
      onUpdate();
    } catch (error) {
      console.error("Error processing consortium response:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendToConsortia = async () => {
    setLoading(true);
    try {
      await sendToTop5Consortia(caseData.id);
      onUpdate();
      setSelectedStep("consortia");
    } catch (error) {
      console.error("Error sending to consortia:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-xl font-bold text-white mb-4">Embudo de Asignación Internacional</h2>
        <p className="text-sm text-white/70 mb-6">
          Sistema de asignación para casos internacionales con monto mínimo de USD 5,000
        </p>

        {/* Paso 1: GEP Gold */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C9A24D] text-black font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-white">Socio GEP Gold</h3>
                <p className="text-xs text-white/60">Primera opción de asignación</p>
              </div>
            </div>
            {caseData.gepGoldAssigned && (
              <Badge
                variant={caseData.gepGoldResponse === "aceptado" ? "accent" : "outline"}
                className="text-xs"
              >
                {caseData.gepGoldResponse === "aceptado"
                  ? "✓ Aceptado"
                  : caseData.gepGoldResponse === "declinado"
                  ? "✗ Declinado"
                  : "⏳ Pendiente"}
              </Badge>
            )}
          </div>

          {!caseData.gepGoldAssigned ? (
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <p className="text-sm text-white/70 mb-4">
                El caso será enviado al socio GEP Gold para revisión y aceptación.
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  // En producción, esto enviaría notificación a GEP Gold
                  alert("Caso enviado a GEP Gold. Esperando respuesta...");
                }}
              >
                Enviar a GEP Gold
              </Button>
            </div>
          ) : (
            <div className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-4">
              {caseData.gepGoldResponse === "pendiente" && isGEPGold && (
                <div className="space-y-3">
                  <p className="text-sm text-white/80">
                    Revisa el caso y decide si aceptas o declinas la asignación.
                  </p>
                  <div className="flex gap-3">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleGEPGoldResponse("aceptado")}
                      disabled={loading}
                    >
                      ✓ Aceptar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleGEPGoldResponse("declinado")}
                      disabled={loading}
                    >
                      ✗ Declinar
                    </Button>
                  </div>
                </div>
              )}
              {caseData.gepGoldResponse === "aceptado" && (
                <div className="p-3 rounded-lg bg-green-500/20 border border-green-500/50">
                  <p className="text-sm text-green-400">
                    ✓ GEP Gold ha aceptado el caso. El caso está asignado.
                  </p>
                </div>
              )}
              {caseData.gepGoldResponse === "declinado" && (
                <div className="p-3 rounded-lg bg-yellow-500/20 border border-yellow-500/50">
                  <p className="text-sm text-yellow-400 mb-3">
                    ✗ GEP Gold ha declinado el caso. Proceder a Top 5 Consorcios.
                  </p>
                  {caseData.internationalStatus !== "asignado_consorcio" && (
                    <Button variant="primary" size="sm" onClick={handleSendToConsortia} disabled={loading}>
                      Enviar a Top 5 Consorcios
                    </Button>
                  )}
                </div>
              )}
              {caseData.gepGoldResponseNotes && (
                <div className="mt-3 pt-3 border-t border-white/10">
                  <p className="text-xs text-white/60 mb-1">Notas:</p>
                  <p className="text-sm text-white/70">{caseData.gepGoldResponseNotes}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Paso 2: Top 5 Consorcios */}
        {(caseData.internationalStatus === "asignado_consorcio" ||
          caseData.gepGoldResponse === "declinado") && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C08457] text-white font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-white">Top 5 Consorcios Legales</h3>
                  <p className="text-xs text-white/60">Asignación a consorcios internacionales</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {consortia.map((consortium) => {
                const response = caseData.top5ConsortiaResponses?.[consortium.id];
                return (
                  <Card key={consortium.id} className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-white">{consortium.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            ⭐ {consortium.rating}
                          </Badge>
                        </div>
                        <p className="text-sm text-white/70 mb-2">{consortium.description}</p>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {consortium.countries.slice(0, 3).map((country) => (
                            <Badge key={country} variant="outline" className="text-xs">
                              {country}
                            </Badge>
                          ))}
                          {consortium.countries.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{consortium.countries.length - 3}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-white/60">
                          <span>{consortium.casesCompleted} casos</span>
                          <span>{consortium.successRate}% éxito</span>
                        </div>
                      </div>
                      <div className="shrink-0">
                        {response === "aceptado" ? (
                          <Badge variant="accent" className="text-xs">
                            ✓ Aceptado
                          </Badge>
                        ) : response === "declinado" ? (
                          <Badge variant="outline" className="text-xs">
                            ✗ Declinado
                          </Badge>
                        ) : (
                          <div className="space-y-2">
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleConsortiumResponse(consortium.id, "aceptado")}
                              disabled={loading}
                            >
                              Aceptar
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleConsortiumResponse(consortium.id, "declinado")}
                              disabled={loading}
                            >
                              Declinar
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
