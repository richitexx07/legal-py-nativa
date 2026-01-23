"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import {
  CheckInJuzgado as CheckInType,
  obtenerCheckInsEstudiante,
  guardarCheckIn,
  obtenerUbicacionActual,
  verificarProximidadJuzgado,
  mockJuzgados,
} from "@/lib/edtech";
import { getSession } from "@/lib/auth";
import BiometricAuth from "@/components/Security/BiometricAuth";
import { MapPin, CheckCircle, XCircle, Camera, Building2 } from "lucide-react";

export default function CheckInJuzgadoComponent() {
  const session = getSession();
  const estudianteId = session?.user?.id || "";

  const [checkIns, setCheckIns] = useState<CheckInType[]>([]);
  const [juzgadoSeleccionado, setJuzgadoSeleccionado] = useState<string>("");
  const [ubicacion, setUbicacion] = useState<{ lat: number; lng: number } | null>(null);
  const [errorUbicacion, setErrorUbicacion] = useState<string | null>(null);
  const [isVerificando, setIsVerificando] = useState(false);
  const [fotoEvidencia, setFotoEvidencia] = useState<string | null>(null);

  useEffect(() => {
    if (estudianteId) {
      const historial = obtenerCheckInsEstudiante(estudianteId);
      setCheckIns(historial);
    }
  }, [estudianteId]);

  const obtenerUbicacion = async () => {
    try {
      setErrorUbicacion(null);
      const position = await obtenerUbicacionActual();
      
      setUbicacion({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });

      // Verificar proximidad al juzgado seleccionado
      if (juzgadoSeleccionado) {
        const juzgado = mockJuzgados.find((j) => j.id === juzgadoSeleccionado);
        if (juzgado) {
          const estaCerca = verificarProximidadJuzgado(
            { lat: position.coords.latitude, lng: position.coords.longitude },
            juzgado
          );
          
          if (!estaCerca) {
            setErrorUbicacion(
              `No estás cerca del juzgado. Debes estar a menos de ${juzgado.radioPermitido}m para hacer check-in.`
            );
          } else {
            setErrorUbicacion(null);
          }
        }
      }
    } catch (error) {
      setErrorUbicacion("Error al obtener ubicación. Asegúrate de permitir el acceso a la ubicación.");
      console.error("Error obteniendo ubicación:", error);
    }
  };

  const tomarFoto = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "environment" } })
        .then((stream) => {
          const video = document.createElement("video");
          video.srcObject = stream;
          video.play();

          video.onloadedmetadata = () => {
            const canvas = document.createElement("canvas");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.drawImage(video, 0, 0);
              const fotoDataUrl = canvas.toDataURL("image/jpeg");
              setFotoEvidencia(fotoDataUrl);
              stream.getTracks().forEach((track) => track.stop());
            }
          };
        })
        .catch((error) => {
          console.error("Error accediendo a la cámara:", error);
          alert("No se pudo acceder a la cámara. Verifica los permisos.");
        });
    } else {
      alert("Tu dispositivo no soporta acceso a la cámara.");
    }
  };

  const handleCheckIn = () => {
    if (!juzgadoSeleccionado) {
      alert("Selecciona un juzgado primero");
      return;
    }

    if (!ubicacion) {
      obtenerUbicacion();
      return;
    }

    if (errorUbicacion) {
      alert("Debes estar cerca del juzgado seleccionado para hacer check-in.");
      return;
    }

    setIsVerificando(true);
  };

  const handleCheckInBiometrico = async (biometricSuccess: boolean) => {
    if (!biometricSuccess) {
      setIsVerificando(false);
      return;
    }

    const juzgado = mockJuzgados.find((j) => j.id === juzgadoSeleccionado);
    if (!juzgado || !ubicacion) return;

    const ahora = new Date();
    const nuevoCheckIn: CheckInType = {
      id: Date.now().toString(),
      estudianteId,
      juzgadoId: juzgado.id,
      juzgadoNombre: juzgado.nombre,
      fecha: ahora.toISOString().split("T")[0],
      hora: ahora.toLocaleTimeString("es-PY", { hour: "2-digit", minute: "2-digit" }),
      ubicacion: {
        lat: ubicacion.lat,
        lng: ubicacion.lng,
        direccion: juzgado.direccion,
        precision: 10, // Simulado
      },
      verificacionBiometrica: {
        timestamp: ahora.toISOString(),
        metodo: "face",
        exitoso: true,
      },
      fotoEvidencia: fotoEvidencia || undefined,
      estado: "pendiente",
    };

    guardarCheckIn(nuevoCheckIn);
    setCheckIns([...checkIns, nuevoCheckIn]);
    setIsVerificando(false);
    setUbicacion(null);
    setJuzgadoSeleccionado("");
    setFotoEvidencia(null);
    setErrorUbicacion(null);

    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }

    alert("✅ Check-in realizado exitosamente. El tutor validará tu asistencia.");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">📍 Check-in Geolocalizado en Juzgados</h2>
        <p className="text-white/70 text-sm">
          Marca tu asistencia en el juzgado con verificación biométrica y geolocalización. Solo puedes hacer check-in si estás cerca del juzgado.
        </p>
      </div>

      {/* Formulario de Check-in */}
      <Card className="bg-gradient-to-br from-blue-500/10 to-indigo-500/5 border-blue-500/30">
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="font-bold text-white">Nuevo Check-in</h3>
              <p className="text-sm text-white/70">Selecciona el juzgado y verifica tu ubicación</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Seleccionar Juzgado
              </label>
              <select
                value={juzgadoSeleccionado}
                onChange={(e) => {
                  setJuzgadoSeleccionado(e.target.value);
                  setUbicacion(null);
                  setErrorUbicacion(null);
                }}
                className="w-full rounded-lg bg-white/10 px-4 py-2 text-white outline-none ring-1 ring-white/10 focus:ring-[#C9A24D]/60"
              >
                <option value="" className="bg-[#13253A]">Seleccionar juzgado...</option>
                {mockJuzgados
                  .filter((j) => j.activo)
                  .map((juzgado) => (
                    <option key={juzgado.id} value={juzgado.id} className="bg-[#13253A]">
                      {juzgado.nombre} - {juzgado.ciudad}
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={obtenerUbicacion}
                className="flex-1"
                disabled={!juzgadoSeleccionado}
              >
                <MapPin className="w-4 h-4 mr-2" />
                Verificar Ubicación
              </Button>
              <Button
                variant="outline"
                onClick={tomarFoto}
                className="flex-1"
              >
                <Camera className="w-4 h-4 mr-2" />
                Tomar Foto
              </Button>
            </div>

            {ubicacion && (
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  {errorUbicacion ? (
                    <XCircle className="w-4 h-4 text-red-400" />
                  ) : (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  )}
                  <p className={`text-sm ${errorUbicacion ? "text-red-400" : "text-green-400"}`}>
                    {errorUbicacion || "✓ Estás cerca del juzgado seleccionado"}
                  </p>
                </div>
                <p className="text-xs text-white/60">
                  Lat: {ubicacion.lat.toFixed(6)}, Lng: {ubicacion.lng.toFixed(6)}
                </p>
              </div>
            )}

            {fotoEvidencia && (
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <p className="text-xs text-white/60 mb-2">Foto de evidencia:</p>
                <img
                  src={fotoEvidencia}
                  alt="Evidencia"
                  className="w-full rounded-lg max-h-48 object-cover"
                />
              </div>
            )}

            <Button
              variant="primary"
              onClick={handleCheckIn}
              className="w-full"
              disabled={!juzgadoSeleccionado || !ubicacion || !!errorUbicacion || isVerificando}
            >
              {isVerificando ? "Verificando..." : "Realizar Check-in Biométrico"}
            </Button>
          </div>
        </div>
      </Card>

      {/* Modal de verificación biométrica */}
      {isVerificando && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#13253A] rounded-2xl p-6 max-w-md w-full mx-4 border border-white/10"
          >
            <h3 className="text-xl font-bold text-white mb-4">Verificación Biométrica</h3>
            <p className="text-sm text-white/70 mb-6">
              Realiza verificación biométrica para confirmar tu check-in en el juzgado
            </p>
            <div className="space-y-4">
              <BiometricAuth
                mode="login"
                onSuccess={() => handleCheckInBiometrico(true)}
                onError={(error) => {
                  console.error("Error biométrico:", error);
                  handleCheckInBiometrico(false);
                }}
              />
              <Button
                variant="outline"
                onClick={() => setIsVerificando(false)}
                className="w-full"
              >
                Cancelar
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Historial de Check-ins */}
      {checkIns.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">Historial de Check-ins</h3>
          <div className="space-y-3">
            {checkIns
              .sort((a, b) => new Date(b.fecha + "T" + b.hora).getTime() - new Date(a.fecha + "T" + a.hora).getTime())
              .map((checkIn) => (
                <Card key={checkIn.id}>
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-white mb-1">{checkIn.juzgadoNombre}</h4>
                        <p className="text-sm text-white/70">
                          {new Date(checkIn.fecha).toLocaleDateString("es-PY", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })} - {checkIn.hora}
                        </p>
                        <p className="text-xs text-white/60 mt-1">
                          📍 {checkIn.ubicacion.direccion}
                        </p>
                      </div>
                      <Badge
                        variant={
                          checkIn.estado === "verificado"
                            ? "accent"
                            : checkIn.estado === "rechazado"
                            ? "terracota"
                            : "outline"
                        }
                      >
                        {checkIn.estado === "verificado"
                          ? "✓ Verificado"
                          : checkIn.estado === "rechazado"
                          ? "✗ Rechazado"
                          : "⏳ Pendiente"}
                      </Badge>
                    </div>

                    {checkIn.fotoEvidencia && (
                      <div className="pt-2 border-t border-white/10">
                        <p className="text-xs text-white/60 mb-2">Foto de evidencia:</p>
                        <img
                          src={checkIn.fotoEvidencia}
                          alt="Evidencia juzgado"
                          className="w-full rounded-lg max-h-32 object-cover"
                        />
                      </div>
                    )}

                    <div className="flex items-center gap-4 pt-2 border-t border-white/10 text-xs text-white/60">
                      <span className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Biométrico: {checkIn.verificacionBiometrica.metodo}
                      </span>
                      {checkIn.tutorAprobado && (
                        <span className="flex items-center gap-1 text-green-400">
                          <CheckCircle className="w-3 h-3" />
                          Aprobado por tutor
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        </div>
      )}

      {checkIns.length === 0 && (
        <Card className="text-center py-8">
          <p className="text-white/70">Aún no has realizado check-ins en juzgados.</p>
        </Card>
      )}
    </div>
  );
}
