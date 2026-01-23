"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import {
  BilleteraAcademica as BilleteraType,
  CertificadoAcademico,
  obtenerBilleteraAcademica,
  generarHashCertificado,
} from "@/lib/edtech";
import { getSession } from "@/lib/auth";
import { GraduationCap, Download, Share2, CheckCircle, Clock, Award } from "lucide-react";
import QRCode from "qrcode.react";

export default function BilleteraAcademica() {
  const session = getSession();
  const estudianteId = session?.user?.id || "";

  const [billetera, setBilletera] = useState<BilleteraType | null>(null);
  const [certificadoSeleccionado, setCertificadoSeleccionado] = useState<CertificadoAcademico | null>(null);

  useEffect(() => {
    if (estudianteId) {
      const billeteraData = obtenerBilleteraAcademica(estudianteId);
      setBilletera(billeteraData);
    }
  }, [estudianteId]);

  const verificarCertificado = (hash: string) => {
    // En producción, esto consultaría un servicio de blockchain
    // Por ahora, simulamos verificación
    window.open(`https://legalpy.com/verificar/${hash}`, "_blank");
  };

  const descargarCertificado = (certificado: CertificadoAcademico) => {
    // En producción, esto generaría un PDF del certificado
    alert(`Descargando certificado: ${certificado.titulo}`);
  };

  const compartirCertificado = (certificado: CertificadoAcademico) => {
    if (navigator.share) {
      navigator.share({
        title: `Certificado: ${certificado.titulo}`,
        text: `He completado: ${certificado.titulo}`,
        url: certificado.urlVerificacion,
      });
    } else {
      // Fallback: copiar URL al portapapeles
      navigator.clipboard.writeText(certificado.urlVerificacion);
      alert("URL de verificación copiada al portapapeles");
    }
  };

  if (!billetera) {
    return (
      <Card className="text-center py-12">
        <GraduationCap className="w-16 h-16 text-white/30 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Billetera Académica</h3>
        <p className="text-white/70 mb-6">
          Tus certificados académicos aparecerán aquí una vez que completes cursos o pasantías.
        </p>
        <p className="text-sm text-white/50">
          Los certificados están validados con tecnología Blockchain para garantizar su autenticidad.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">🎓 Billetera Académica</h2>
        <p className="text-white/70 text-sm">
          Tus certificados académicos validados con Blockchain. Descarga, comparte y verifica la autenticidad de tus logros.
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-blue-500/30">
          <div className="text-center">
            <p className="text-3xl font-extrabold text-blue-400 mb-1">{billetera.horasTotales}</p>
            <p className="text-xs text-white/70">Horas Totales</p>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-green-500/20 to-green-600/10 border-green-500/30">
          <div className="text-center">
            <p className="text-3xl font-extrabold text-green-400 mb-1">{billetera.pasantiasCompletadas}</p>
            <p className="text-xs text-white/70">Pasantías</p>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-purple-500/20 to-purple-600/10 border-purple-500/30">
          <div className="text-center">
            <p className="text-3xl font-extrabold text-purple-400 mb-1">{billetera.cursosCompletados}</p>
            <p className="text-xs text-white/70">Cursos</p>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border-yellow-500/30">
          <div className="text-center">
            <p className="text-3xl font-extrabold text-yellow-400 mb-1">{billetera.certificaciones}</p>
            <p className="text-xs text-white/70">Certificaciones</p>
          </div>
        </Card>
      </div>

      {/* Lista de Certificados */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white">Mis Certificados</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {billetera.certificados.map((certificado) => (
            <Card
              key={certificado.id}
              className="hover:border-[#C9A24D]/50 transition-all cursor-pointer"
              onClick={() => setCertificadoSeleccionado(certificado)}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Award className="w-5 h-5 text-[#C9A24D]" />
                      <h4 className="font-semibold text-white">{certificado.titulo}</h4>
                    </div>
                    <p className="text-xs text-white/70">{certificado.descripcion}</p>
                  </div>
                  <Badge
                    variant={
                      certificado.estado === "emitido"
                        ? "accent"
                        : certificado.estado === "verificado"
                        ? "accent"
                        : "terracota"
                    }
                    className="text-xs"
                  >
                    {certificado.estado === "emitido"
                      ? "Emitido"
                      : certificado.estado === "verificado"
                      ? "✓ Verificado"
                      : "Revocado"}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 text-xs text-white/60">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {certificado.horas}h
                  </span>
                  <span>{certificado.institucion}</span>
                </div>

                <div className="flex gap-2 pt-2 border-t border-white/10">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      descargarCertificado(certificado);
                    }}
                    className="flex-1"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Descargar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      compartirCertificado(certificado);
                    }}
                    className="flex-1"
                  >
                    <Share2 className="w-3 h-3 mr-1" />
                    Compartir
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Modal de Detalle de Certificado */}
      {certificadoSeleccionado && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setCertificadoSeleccionado(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-[#13253A] rounded-2xl p-6 max-w-2xl w-full border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">{certificadoSeleccionado.titulo}</h3>
                <p className="text-white/70">{certificadoSeleccionado.descripcion}</p>
              </div>
              <button
                onClick={() => setCertificadoSeleccionado(null)}
                className="text-white/60 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Información del Certificado */}
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-white/60 mb-1">Institución</p>
                  <p className="text-sm text-white">{certificadoSeleccionado.institucion}</p>
                </div>
                <div>
                  <p className="text-xs text-white/60 mb-1">Fecha de Emisión</p>
                  <p className="text-sm text-white">
                    {new Date(certificadoSeleccionado.fechaEmision).toLocaleDateString("es-PY", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-white/60 mb-1">Horas</p>
                  <p className="text-sm text-white">{certificadoSeleccionado.horas} horas</p>
                </div>
                <div>
                  <p className="text-xs text-white/60 mb-1">Hash Blockchain</p>
                  <p className="text-xs text-white/50 font-mono break-all">
                    {certificadoSeleccionado.hashBlockchain}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    onClick={() => verificarCertificado(certificadoSeleccionado.hashBlockchain)}
                    className="flex-1"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Verificar
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => descargarCertificado(certificadoSeleccionado)}
                    className="flex-1"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Descargar PDF
                  </Button>
                </div>
              </div>

              {/* QR Code */}
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="p-4 bg-white rounded-lg">
                  <div className="w-48 h-48 flex items-center justify-center bg-gray-100 rounded">
                    <p className="text-xs text-gray-500 text-center">
                      QR Code<br />
                      {certificadoSeleccionado.hashBlockchain.substring(0, 20)}...
                    </p>
                  </div>
                </div>
                <p className="text-xs text-white/60 text-center">
                  Escanea este código QR para verificar la autenticidad del certificado
                </p>
                <Button
                  variant="outline"
                  onClick={() => compartirCertificado(certificadoSeleccionado)}
                  size="sm"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Compartir Certificado
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {billetera.certificados.length === 0 && (
        <Card className="text-center py-12">
          <GraduationCap className="w-16 h-16 text-white/30 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Aún no tienes certificados</h3>
          <p className="text-white/70 mb-6">
            Completa cursos o pasantías para obtener certificados validados con Blockchain.
          </p>
        </Card>
      )}
    </div>
  );
}
