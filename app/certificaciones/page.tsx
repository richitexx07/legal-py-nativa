"use client";

import { useState } from "react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import FormField from "@/components/FormField";
import Snackbar from "@/components/Snackbar";
import { mockCertificaciones } from "@/lib/educacion-data";

export default function CertificacionesPage() {
  const [codigoVerificacion, setCodigoVerificacion] = useState("");
  const [resultadoVerificacion, setResultadoVerificacion] = useState<{
    valido: boolean;
    certificado?: typeof mockCertificaciones[0];
    mensaje: string;
  } | null>(null);
  const [snackbar, setSnackbar] = useState({ isOpen: false, message: "", type: "info" as const });

  const handleVerificar = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!codigoVerificacion.trim()) {
      setSnackbar({
        isOpen: true,
        message: "Ingresa un código de verificación",
        type: "error",
      });
      return;
    }

    // Simular verificación (en producción sería una consulta a BD)
    const certificado = mockCertificaciones.find((c) => 
      codigoVerificacion.toUpperCase().includes(c.codigoEjemplo.split("-")[2]) ||
      codigoVerificacion.toUpperCase().includes("LPY")
    );

    if (certificado) {
      setResultadoVerificacion({
        valido: true,
        certificado,
        mensaje: "Certificado verificado correctamente",
      });
      setSnackbar({
        isOpen: true,
        message: "Certificado verificado correctamente",
        type: "success",
      });
    } else {
      setResultadoVerificacion({
        valido: false,
        mensaje: "Código de certificado no encontrado o inválido",
      });
      setSnackbar({
        isOpen: true,
        message: "Código de certificado no encontrado",
        type: "error",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
          Certificaciones
        </h1>
        <p className="text-white/70 max-w-3xl">
          Programas de certificación que validan tus competencias profesionales. Verifica certificados
          emitidos por Legal PY.
        </p>
      </div>

      {/* Verificación de Certificados */}
      <Card>
        <h2 className="text-xl font-bold text-white mb-4">Verificar Certificado</h2>
        <form onSubmit={handleVerificar} className="space-y-4">
          <FormField
            label="Código de certificado"
            htmlFor="codigo"
            hint="Ejemplo: LPY-LIT-2025-00123"
          >
            <input
              id="codigo"
              type="text"
              value={codigoVerificacion}
              onChange={(e) => setCodigoVerificacion(e.target.value.toUpperCase())}
              placeholder="LPY-XXX-YYYY-NNNNN"
              className="w-full px-4 py-2 rounded-xl bg-[#13253A] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
            />
          </FormField>
          <Button type="submit" variant="primary">
            Verificar certificado
          </Button>
        </form>

        {resultadoVerificacion && (
          <div className={`mt-4 p-4 rounded-lg border ${
            resultadoVerificacion.valido
              ? "bg-green-500/20 border-green-500/50"
              : "bg-red-500/20 border-red-500/50"
          }`}>
            <div className="flex items-start gap-3">
              <span className="text-2xl">{resultadoVerificacion.valido ? "✓" : "✗"}</span>
              <div>
                <p className={`font-semibold ${
                  resultadoVerificacion.valido ? "text-green-400" : "text-red-400"
                }`}>
                  {resultadoVerificacion.mensaje}
                </p>
                {resultadoVerificacion.valido && resultadoVerificacion.certificado && (
                  <div className="mt-3 space-y-2 text-sm text-white/80">
                    <p><strong>Certificación:</strong> {resultadoVerificacion.certificado.titulo}</p>
                    <p><strong>Nivel:</strong> {resultadoVerificacion.certificado.nivel}</p>
                    <p><strong>Código:</strong> {codigoVerificacion}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Catálogo de Certificaciones */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
          Programas de Certificación Disponibles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockCertificaciones.map((cert) => (
            <Card key={cert.id} hover className="h-full flex flex-col">
              <div className="flex-1">
                <h3 className="font-semibold text-[#C9A24D] text-lg mb-2">{cert.titulo}</h3>
                <p className="text-sm text-white/70 mb-4">{cert.descripcion}</p>

                <div className="space-y-3 mb-4">
                  <div>
                    <p className="text-xs text-white/60 mb-1">Nivel:</p>
                    <Badge variant="outline" className="text-xs">
                      {cert.nivel}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-white/60 mb-1">Duración:</p>
                    <p className="text-sm text-white">{cert.duracion}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/60 mb-1">Costo:</p>
                    <p className="text-sm font-semibold text-[#C9A24D]">{cert.costo}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-white/60 mb-2">Requisitos:</p>
                  <ul className="space-y-1">
                    {cert.requisitos.slice(0, 3).map((req, idx) => (
                      <li key={idx} className="text-xs text-white/70 flex items-start gap-1">
                        <span className="text-[#C9A24D] mt-1">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-white/60 mb-2">Beneficios:</p>
                  <ul className="space-y-1">
                    {cert.beneficios.map((ben, idx) => (
                      <li key={idx} className="text-xs text-white/70 flex items-start gap-1">
                        <span className="text-[#C9A24D] mt-1">✓</span>
                        <span>{ben}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <Button variant="primary" className="w-full" size="sm">
                  Solicitar información
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Snackbar
        message={snackbar.message}
        type={snackbar.type}
        isOpen={snackbar.isOpen}
        onClose={() => setSnackbar({ ...snackbar, isOpen: false })}
      />
    </div>
  );
}
