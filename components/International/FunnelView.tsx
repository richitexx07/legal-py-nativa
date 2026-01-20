"use client";

import { useState } from "react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import {
  InternationalCase,
  processGEPGoldResponse,
  processConsortiumResponse,
  deriveToTierPremium,
  getTierPremiumConsortia,
  getTierStandardConsortia,
  LegalConsortium,
} from "@/lib/international";

interface FunnelViewProps {
  caseData: InternationalCase;
  onUpdate: () => void;
  isGEPGold?: boolean; // Si el usuario es GEP Gold
}

export default function FunnelView({ caseData, onUpdate, isGEPGold = false }: FunnelViewProps) {
  const [loading, setLoading] = useState(false);
  const [selectedStep, setSelectedStep] = useState<"gep" | "tier_premium" | "tier_standard">("gep");
  const tierPremiumConsortia = getTierPremiumConsortia();
  const tierStandardConsortia = getTierStandardConsortia();
  
  // Determinar qué consorcios mostrar según el estado
  const getConsortiaToShow = (): LegalConsortium[] => {
    if (caseData.internationalStatus === "asignado_consorcio_tier_premium" || 
        caseData.assignmentType === "consorcio_tier_premium") {
      return tierPremiumConsortia;
    }
    if (caseData.internationalStatus === "asignado_consorcio_tier_standard" || 
        caseData.assignmentType === "consorcio_tier_standard") {
      return tierStandardConsortia;
    }
    return tierPremiumConsortia; // Default
  };
  
  const consortia = getConsortiaToShow();

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

  const handleDeriveToTierPremium = async () => {
    setLoading(true);
    try {
      await deriveToTierPremium(caseData.id);
      onUpdate();
      setSelectedStep("tier_premium");
    } catch (error) {
      console.error("Error deriving to tier premium:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-xl font-bold text-white mb-4">Derivación Priorizada por Perfil Técnico (DPT)</h2>
        <p className="text-sm text-white/70 mb-6">
          Sistema ético de derivación profesional basado en perfil técnico, especialidad y experiencia. 
          Sin competencia económica. Proceso transparente y respetuoso de códigos éticos profesionales.
        </p>
        
        {/* Perfil Técnico del Caso */}
        {caseData.technicalProfile && (
          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30 mb-6">
            <p className="text-xs text-blue-400 font-semibold mb-2">📋 Perfil Técnico del Caso</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-white/70">
              <div>
                <span className="text-white/60">Categoría:</span>
                <p className="text-white/90 font-medium">{caseData.technicalProfile.categoria}</p>
              </div>
              <div>
                <span className="text-white/60">Complejidad:</span>
                <p className="text-white/90 font-medium capitalize">{caseData.technicalProfile.nivelComplejidad.replace("_", " ")}</p>
              </div>
              {caseData.technicalProfile.especialidadesRequeridas && caseData.technicalProfile.especialidadesRequeridas.length > 0 && (
                <div className="col-span-2">
                  <span className="text-white/60">Especialidades requeridas:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {caseData.technicalProfile.especialidadesRequeridas.map((spec) => (
                      <Badge key={spec} variant="outline" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Paso 1: GEP Gold */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C9A24D] text-black font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-white">⭐ GEP Gold - Evaluación Prioritaria</h3>
                <p className="text-xs text-white/60">Derivación prioritaria según perfil técnico</p>
              </div>
            </div>
            {caseData.gepGoldAssigned && (
              <Badge
                variant={caseData.gepGoldResponse === "aceptado" ? "accent" : caseData.gepGoldResponse === "pendiente" ? "terracota" : "outline"}
                className="text-xs"
              >
                {caseData.gepGoldResponse === "aceptado"
                  ? "✓ Aceptado"
                  : caseData.gepGoldResponse === "declinado"
                  ? "✗ Declinado"
                  : `⏳ Evaluación Prioritaria (${caseData.gepConfiguration?.ventanaEvaluacion || 48}h)`}
              </Badge>
            )}
          </div>

          {!caseData.gepGoldAssigned ? (
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <p className="text-sm text-white/70 mb-4">
                Este caso será derivado al socio GEP Gold para evaluación prioritaria según su perfil técnico. 
                El GEP Gold tiene una ventana exclusiva de {caseData.gepConfiguration?.ventanaEvaluacion || 48} horas para evaluar y responder.
              </p>
              <div className="p-3 rounded-lg bg-[#C9A24D]/10 border border-[#C9A24D]/30 mb-4">
                <p className="text-xs text-[#C9A24D] font-semibold mb-1">Proceso Ético de Derivación</p>
                <p className="text-xs text-white/70">
                  La derivación se basa exclusivamente en coincidencia de perfil técnico, especialidad y experiencia. 
                  No hay competencia económica ni pujas.
                </p>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  // En producción, esto enviaría notificación a GEP Gold
                  alert("Caso derivado a GEP Gold para evaluación prioritaria. Ventana de 48 horas.");
                }}
              >
                Derivar a GEP Gold
              </Button>
            </div>
          ) : (
            <div className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-4">
              {caseData.gepGoldResponse === "pendiente" && isGEPGold && (
                <div className="space-y-3">
                  <p className="text-sm text-white/80">
                    Este caso fue derivado a ti según coincidencia de perfil técnico. Revisa los detalles y decide si aceptas o declinas la asignación.
                  </p>
                  {caseData.derivationStatus?.perfilTecnicoCoincidente && (
                    <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/30">
                      <p className="text-xs text-blue-400 mb-1">Coincidencias de perfil:</p>
                      <p className="text-xs text-white/70">{caseData.derivationStatus.perfilTecnicoCoincidente.join(", ")}</p>
                    </div>
                  )}
                  <div className="flex gap-3">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleGEPGoldResponse("aceptado")}
                      disabled={loading}
                    >
                      ✓ Aceptar Caso
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
                    ✓ GEP Gold ha aceptado el caso según perfil técnico. El caso está asignado.
                  </p>
                </div>
              )}
              {caseData.gepGoldResponse === "declinado" && (
                <div className="p-3 rounded-lg bg-yellow-500/20 border border-yellow-500/50">
                  <p className="text-sm text-yellow-400 mb-3">
                    ✗ GEP Gold ha declinado el caso. El caso será derivado automáticamente a Consorcios Tier Premium según perfil técnico.
                  </p>
                  {caseData.internationalStatus !== "asignado_consorcio_tier_premium" && 
                   caseData.internationalStatus !== "asignado_consorcio_tier_standard" && (
                    <Button variant="primary" size="sm" onClick={handleDeriveToTierPremium} disabled={loading}>
                      Derivar a Tier Premium
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

        {/* Paso 2: Tier Premium */}
        {(caseData.internationalStatus === "asignado_consorcio_tier_premium" ||
          caseData.assignmentType === "consorcio_tier_premium" ||
          (caseData.gepGoldResponse === "declinado" && caseData.internationalStatus !== "asignado_gep")) && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C08457] text-white font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-white">🏆 Consorcios Tier Premium</h3>
                  <p className="text-xs text-white/60">Derivación ética según perfil técnico</p>
                </div>
              </div>
            </div>
            
            {caseData.derivationStatus?.razonDerivacion && (
              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 mb-4">
                <p className="text-xs text-blue-400 font-semibold mb-1">Razón de Derivación:</p>
                <p className="text-xs text-white/70">{caseData.derivationStatus.razonDerivacion}</p>
                {caseData.derivationStatus.perfilTecnicoCoincidente && (
                  <p className="text-xs text-white/60 mt-1">
                    Coincidencias: {caseData.derivationStatus.perfilTecnicoCoincidente.join(", ")}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-3">
              {consortia.map((consortium) => {
                // Determinar qué respuesta usar según el tier
                const response = caseData.tierPremiumResponses?.[consortium.id] || 
                                caseData.tierStandardResponses?.[consortium.id] ||
                                caseData.top5ConsortiaResponses?.[consortium.id]; // Legacy compatibility
                return (
                  <Card key={consortium.id} className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-white">{consortium.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            ⭐ {consortium.rating}
                          </Badge>
                          {consortium.tier && (
                            <Badge variant={consortium.tier === "premium" ? "accent" : "outline"} className="text-xs">
                              {consortium.tier === "premium" ? "🏆 Premium" : "📋 Standard"}
                            </Badge>
                          )}
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
                        {/* Mostrar coincidencias de perfil técnico */}
                        {caseData.technicalProfile?.especialidadesRequeridas && 
                         consortium.specialties.some(spec => 
                           caseData.technicalProfile.especialidadesRequeridas?.includes(spec)
                         ) && (
                          <div className="mt-2 pt-2 border-t border-white/10">
                            <p className="text-xs text-[#C9A24D]">
                              ✓ Coincidencia de perfil técnico
                            </p>
                          </div>
                        )}
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

        {/* Paso 3: Tier Standard (si aplica) */}
        {(caseData.internationalStatus === "asignado_consorcio_tier_standard" ||
          caseData.assignmentType === "consorcio_tier_standard") && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#6B7280] text-white font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-white">📋 Consorcios Tier Standard</h3>
                  <p className="text-xs text-white/60">Derivación ética según perfil técnico</p>
                </div>
              </div>
            </div>
            
            {caseData.derivationStatus?.razonDerivacion && (
              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 mb-4">
                <p className="text-xs text-blue-400 font-semibold mb-1">Razón de Derivación:</p>
                <p className="text-xs text-white/70">{caseData.derivationStatus.razonDerivacion}</p>
              </div>
            )}

            <div className="space-y-3">
              {tierStandardConsortia.map((consortium) => {
                const response = caseData.tierStandardResponses?.[consortium.id];
                return (
                  <Card key={consortium.id} className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-white">{consortium.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            ⭐ {consortium.rating}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            📋 Standard
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
