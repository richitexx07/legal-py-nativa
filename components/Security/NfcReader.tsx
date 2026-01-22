"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { readNFCIdCard, isNFCAvailable, type NFCReadResult } from "@/lib/security/nfc";
import Button from "@/components/Button";
import Card from "@/components/Card";
import confetti from "canvas-confetti";

interface NfcReaderProps {
  onDataRead?: (data: NFCReadResult) => void;
}

export default function NfcReader({ onDataRead }: NfcReaderProps) {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [result, setResult] = useState<NFCReadResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsAvailable(isNFCAvailable());
    }
  }, []);

  const handleReadNFC = async () => {
    if (!isAvailable) {
      setError("NFC no está disponible en este dispositivo");
      return;
    }

    setIsReading(true);
    setError(null);
    setResult(null);

    try {
      // Vibración sutil al iniciar
      if (navigator.vibrate) {
        navigator.vibrate(100);
      }

      const nfcResult = await readNFCIdCard();

      if (nfcResult.success) {
        setResult(nfcResult);
        if (onDataRead) {
          onDataRead(nfcResult);
        }

        // Vibración de éxito
        if (navigator.vibrate) {
          navigator.vibrate([100, 50, 100]);
        }

        // Confeti de éxito
        confetti({
          particleCount: 30,
          spread: 50,
          origin: { y: 0.6 },
          colors: ["#10b981", "#34d399"],
        });
      } else {
        setError(nfcResult.error || "Error leyendo la cédula");
      }
    } catch (err) {
      setError("Error inesperado al leer NFC: " + (err as Error).message);
    } finally {
      setIsReading(false);
    }
  };

  if (!isAvailable) {
    return (
      <Card className="p-6">
        <div className="text-center space-y-3">
          <div className="text-4xl">📱</div>
          <div>
            <p className="text-white font-semibold mb-1">NFC no disponible</p>
            <p className="text-sm text-white/60">
              Tu dispositivo no soporta lectura NFC. Usa la opción de subir foto de cédula.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* Animación de celular acercándose a tarjeta */}
        <div className="relative flex items-center justify-center h-32">
          <motion.div
            className="absolute"
            animate={isReading ? { x: [0, -20, 0], y: [0, -10, 0] } : {}}
            transition={{ duration: 2, repeat: isReading ? Infinity : 0, ease: "easeInOut" }}
          >
            <div className="w-16 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg flex items-center justify-center">
              <span className="text-2xl">📱</span>
            </div>
          </motion.div>
          <div className="absolute right-1/4">
            <div className="w-20 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg shadow-lg flex items-center justify-center">
              <span className="text-xl">🆔</span>
            </div>
          </div>
        </div>

        <div className="text-center space-y-2">
          <h3 className="text-lg font-bold text-white">Escanear Chip de Cédula (NFC)</h3>
          <p className="text-sm text-white/70">
            {isReading
              ? "Acerca tu cédula a la parte trasera del teléfono..."
              : "Asegúrate de que tu cédula tenga chip y que el NFC esté activado"}
          </p>
        </div>

        {isReading && (
          <div className="flex items-center justify-center gap-2 py-4">
            <div className="flex gap-1">
              <motion.div
                className="w-2 h-8 bg-green-400 rounded-full"
                animate={{ scaleY: [1, 1.5, 1] }}
                transition={{ duration: 0.5, repeat: Infinity, delay: 0 }}
              />
              <motion.div
                className="w-2 h-8 bg-green-400 rounded-full"
                animate={{ scaleY: [1, 1.5, 1] }}
                transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }}
              />
              <motion.div
                className="w-2 h-8 bg-green-400 rounded-full"
                animate={{ scaleY: [1, 1.5, 1] }}
                transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
              />
            </div>
            <p className="text-sm text-green-400 font-semibold">Leyendo...</p>
          </div>
        )}

        {error && (
          <div className="rounded-lg bg-red-500/20 border border-red-500/50 p-3">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {result && result.success && result.data && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-lg bg-green-500/20 border border-green-500/50 p-4 space-y-2"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">✅</span>
              <p className="text-white font-semibold">Datos leídos exitosamente</p>
            </div>
            <div className="space-y-1 text-sm text-white/90">
              {result.data.documentNumber && (
                <p>📄 Documento: {result.data.documentNumber}</p>
              )}
              {result.data.firstName && result.data.lastName && (
                <p>👤 Nombre: {result.data.firstName} {result.data.lastName}</p>
              )}
              {result.data.dateOfBirth && (
                <p>🎂 Fecha de Nacimiento: {result.data.dateOfBirth}</p>
              )}
              {result.data.nationality && (
                <p>🌍 Nacionalidad: {result.data.nationality}</p>
              )}
            </div>
          </motion.div>
        )}

        <Button
          variant="primary"
          className="w-full"
          onClick={handleReadNFC}
          disabled={isReading}
        >
          {isReading ? "Escaneando..." : "📱 Escanear Chip de Cédula (NFC)"}
        </Button>
      </div>
    </Card>
  );
}
