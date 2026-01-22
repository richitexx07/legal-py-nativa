"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { extractIdData, type IdCardData } from "@/lib/ocrService";
import Button from "@/components/Button";
import confetti from "canvas-confetti";

interface SmartIdUploaderProps {
  onDataExtracted: (data: IdCardData) => void;
  onConfirm?: (data: IdCardData) => void;
}

export default function SmartIdUploader({ onDataExtracted, onConfirm }: SmartIdUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<IdCardData | null>(null);
  const [scanPosition, setScanPosition] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const animationRef = useRef<number | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleFile(file);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  }, []);

  const handleFile = async (file: File) => {
    // Crear preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Procesar con OCR
    setIsProcessing(true);
    setExtractedData(null);

    // Animación de escáner
    const startTime = Date.now();
    const animateScan = () => {
      const elapsed = Date.now() - startTime;
      const progress = (elapsed % 2000) / 2000; // Ciclo de 2 segundos
      setScanPosition(progress * 100);
      animationRef.current = requestAnimationFrame(animateScan);
    };
    animateScan();

    try {
      const data = await extractIdData(file);
      
      // Detener animación
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      setScanPosition(0);

      if (data) {
        setExtractedData(data);
        onDataExtracted(data);
        
        // Confeti de éxito
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ["#10b981", "#34d399"],
        });
      } else {
        alert("No se pudieron extraer datos de la imagen. Por favor, asegúrate de que la foto sea clara y legible.");
      }
    } catch (error) {
      console.error("Error procesando imagen:", error);
      alert("Error al procesar la imagen. Por favor, intenta nuevamente.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirm = () => {
    if (extractedData && onConfirm) {
      onConfirm(extractedData);
    }
  };

  return (
    <div className="space-y-4">
      {/* Área de carga */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
          isDragging
            ? "border-[#C9A24D] bg-[#C9A24D]/10"
            : "border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {!preview ? (
          <div className="space-y-4">
            <div className="text-4xl">📄</div>
            <div>
              <p className="text-white font-semibold mb-1">
                Arrastra tu cédula aquí o haz clic para seleccionar
              </p>
              <p className="text-sm text-white/60">
                Formatos soportados: JPG, PNG, PDF
              </p>
            </div>
          </div>
        ) : (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="max-h-64 mx-auto rounded-lg"
            />
            
            {/* Overlay de escáner animado */}
            {isProcessing && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg">
                <div className="text-center space-y-3">
                  <div className="relative w-full h-1 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-green-400 to-transparent"
                      style={{
                        y: `${scanPosition}%`,
                      }}
                      animate={{
                        y: [0, 100, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  </div>
                  <p className="text-white font-semibold">🤖 La IA está leyendo tu documento...</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Datos extraídos */}
      <AnimatePresence>
        {extractedData && !isProcessing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4 p-4 rounded-2xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">✅</span>
              <p className="text-white font-semibold">Datos extraídos automáticamente</p>
            </div>

            <div className="space-y-3">
              {extractedData.nombres && (
                <div>
                  <label className="text-xs text-white/70 mb-1 block">Nombres</label>
                  <input
                    type="text"
                    value={extractedData.nombres}
                    onChange={(e) =>
                      setExtractedData({ ...extractedData, nombres: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
                  />
                </div>
              )}

              {extractedData.apellidos && (
                <div>
                  <label className="text-xs text-white/70 mb-1 block">Apellidos</label>
                  <input
                    type="text"
                    value={extractedData.apellidos}
                    onChange={(e) =>
                      setExtractedData({ ...extractedData, apellidos: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
                  />
                </div>
              )}

              {extractedData.documentNumber && (
                <div>
                  <label className="text-xs text-white/70 mb-1 block">Nº Cédula</label>
                  <input
                    type="text"
                    value={extractedData.documentNumber}
                    onChange={(e) =>
                      setExtractedData({ ...extractedData, documentNumber: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
                  />
                </div>
              )}

              {extractedData.dateOfBirth && (
                <div>
                  <label className="text-xs text-white/70 mb-1 block">Fecha de Nacimiento</label>
                  <input
                    type="text"
                    value={extractedData.dateOfBirth}
                    onChange={(e) =>
                      setExtractedData({ ...extractedData, dateOfBirth: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
                  />
                </div>
              )}
            </div>

            {onConfirm && (
              <Button
                variant="primary"
                className="w-full mt-4"
                onClick={handleConfirm}
              >
                ✅ Confirmar Datos
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
