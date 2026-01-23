"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import {
  BitacoraEntry,
  obtenerBitacoraEstudiante,
  guardarEntradaBitacora,
  obtenerUbicacionActual,
  verificarProximidadJuzgado,
  mockJuzgados,
} from "@/lib/edtech";
import { getSession } from "@/lib/auth";
import BiometricAuth from "@/components/Security/BiometricAuth";
import { MapPin, Clock, CheckCircle, XCircle, Camera, FileText } from "lucide-react";

interface BitacoraBiometricaProps {
  pasantiaId: string;
  onEntrySaved?: (entry: BitacoraEntry) => void;
}

export default function BitacoraBiometrica({ pasantiaId, onEntrySaved }: BitacoraBiometricaProps) {
  const session = getSession();
  const estudianteId = session?.user?.id || "";

  const [entries, setEntries] = useState<BitacoraEntry[]>([]);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [ubicacion, setUbicacion] = useState<{ lat: number; lng: number; direccion: string } | null>(null);
  const [errorUbicacion, setErrorUbicacion] = useState<string | null>(null);
  const [tipoLugar, setTipoLugar] = useState<"juzgado" | "estudio" | "oficina" | "otro">("juzgado");
  const [nombreLugar, setNombreLugar] = useState("");
  const [actividades, setActividades] = useState<string[]>([]);
  const [nuevaActividad, setNuevaActividad] = useState("");
  const [juzgadoSeleccionado, setJuzgadoSeleccionado] = useState<string>("");

  useEffect(() => {
    if (estudianteId) {
      const bitacora = obtenerBitacoraEstudiante(estudianteId, pasantiaId);
      setEntries(bitacora);
    }
  }, [estudianteId, pasantiaId]);

  const obtenerUbicacion = async () => {
    try {
      setErrorUbicacion(null);
      const position = await obtenerUbicacionActual();
      
      // Obtener dirección aproximada (en producción usarías un servicio de geocodificación)
      const direccion = `Lat: ${position.coords.latitude.toFixed(6)}, Lng: ${position.coords.longitude.toFixed(6)}`;
      
      setUbicacion({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        direccion,
      });

      // Si es juzgado, verificar proximidad
      if (tipoLugar === "juzgado" && juzgadoSeleccionado) {
        const juzgado = mockJuzgados.find((j) => j.id === juzgadoSeleccionado);
        if (juzgado) {
          const estaCerca = verificarProximidadJuzgado(
            { lat: position.coords.latitude, lng: position.coords.longitude },
            juzgado
          );
          
          if (!estaCerca) {
            setErrorUbicacion(
              `No estás cerca del juzgado seleccionado. Debes estar a menos de ${juzgado.radioPermitido}m.`
            );
          }
        }
      }
    } catch (error) {
      setErrorUbicacion("Error al obtener ubicación. Asegúrate de permitir el acceso a la ubicación.");
      console.error("Error obteniendo ubicación:", error);
    }
  };

  const handleCheckIn = async () => {
    if (!ubicacion) {
      await obtenerUbicacion();
      return;
    }

    if (errorUbicacion) {
      alert("Debes estar cerca del lugar seleccionado para hacer check-in.");
      return;
    }

    setIsCheckingIn(true);
  };

  const handleCheckInBiometrico = async (biometricSuccess: boolean) => {
    if (!biometricSuccess) {
      setIsCheckingIn(false);
      return;
    }

    const ahora = new Date();
    const nuevaEntrada: BitacoraEntry = {
      id: Date.now().toString(),
      pasantiaId,
      estudianteId,
      fecha: ahora.toISOString().split("T")[0],
      horaEntrada: ahora.toLocaleTimeString("es-PY", { hour: "2-digit", minute: "2-digit" }),
      ubicacion: {
        lat: ubicacion!.lat,
        lng: ubicacion!.lng,
        direccion: ubicacion!.direccion,
        tipo: tipoLugar,
        nombreLugar: nombreLugar || (tipoLugar === "juzgado" && juzgadoSeleccionado 
          ? mockJuzgados.find((j) => j.id === juzgadoSeleccionado)?.nombre 
          : undefined),
      },
      verificacionBiometrica: {
        entrada: {
          timestamp: ahora.toISOString(),
          metodo: "face", // En producción se detectaría automáticamente
          exitoso: true,
        },
      },
      actividades: [],
    };

    guardarEntradaBitacora(nuevaEntrada);
    setEntries([...entries, nuevaEntrada]);
    setIsCheckingIn(false);
    setUbicacion(null);
    setNombreLugar("");
    setJuzgadoSeleccionado("");
    setActividades([]);
    
    if (onEntrySaved) {
      onEntrySaved(nuevaEntrada);
    }

    // Haptic feedback en móvil
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }
  };

  const handleCheckOut = async (entryId: string) => {
    setIsCheckingOut(true);
    // En producción, aquí se haría la verificación biométrica
    // Por ahora, simulamos
    setTimeout(() => {
      const ahora = new Date();
      const entry = entries.find((e) => e.id === entryId);
      if (entry) {
        entry.horaSalida = ahora.toLocaleTimeString("es-PY", { hour: "2-digit", minute: "2-digit" });
        entry.verificacionBiometrica.salida = {
          timestamp: ahora.toISOString(),
          metodo: "face",
          exitoso: true,
        };
        
        const updated = entries.map((e) => (e.id === entryId ? entry : e));
        setEntries(updated);
        localStorage.setItem(`legal-py-bitacora-${estudianteId}`, JSON.stringify(updated));
      }
      setIsCheckingOut(false);
    }, 1000);
  };

  const agregarActividad = (entryId: string) => {
    if (!nuevaActividad.trim()) return;
    
    const entry = entries.find((e) => e.id === entryId);
    if (entry) {
      entry.actividades.push(nuevaActividad);
      const updated = entries.map((e) => (e.id === entryId ? entry : e));
      setEntries(updated);
      localStorage.setItem(`legal-py-bitacora-${estudianteId}`, JSON.stringify(updated));
      setNuevaActividad("");
    }
  };

  const entradaHoy = entries.find(
    (e) => e.fecha === new Date().toISOString().split("T")[0] && !e.horaSalida
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">📝 Bitácora Digital Biométrica</h2>
        <p className="text-white/70 text-sm">
          Registra tu asistencia con verificación biométrica y geolocalización. El tutor validará tus entradas.
        </p>
      </div>

      {/* Check-in */}
      {!entradaHoy && (
        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 border-green-500/30">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                <Clock className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="font-bold text-white">Check-in de Asistencia</h3>
                <p className="text-sm text-white/70">Verifica tu ubicación y realiza check-in biométrico</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Tipo de lugar
                </label>
                <select
                  value={tipoLugar}
                  onChange={(e) => setTipoLugar(e.target.value as any)}
                  className="w-full rounded-lg bg-white/10 px-4 py-2 text-white outline-none ring-1 ring-white/10 focus:ring-[#C9A24D]/60"
                >
                  <option value="juzgado" className="bg-[#13253A]">Juzgado</option>
                  <option value="estudio" className="bg-[#13253A]">Estudio Jurídico</option>
                  <option value="oficina" className="bg-[#13253A]">Oficina</option>
                  <option value="otro" className="bg-[#13253A]">Otro</option>
                </select>
              </div>

              {tipoLugar === "juzgado" && (
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Seleccionar Juzgado
                  </label>
                  <select
                    value={juzgadoSeleccionado}
                    onChange={(e) => setJuzgadoSeleccionado(e.target.value)}
                    className="w-full rounded-lg bg-white/10 px-4 py-2 text-white outline-none ring-1 ring-white/10 focus:ring-[#C9A24D]/60"
                  >
                    <option value="" className="bg-[#13253A]">Seleccionar juzgado...</option>
                    {mockJuzgados.map((juzgado) => (
                      <option key={juzgado.id} value={juzgado.id} className="bg-[#13253A]">
                        {juzgado.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {tipoLugar !== "juzgado" && (
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Nombre del lugar
                  </label>
                  <input
                    type="text"
                    value={nombreLugar}
                    onChange={(e) => setNombreLugar(e.target.value)}
                    placeholder="Ej: Estudio Legal ABC"
                    className="w-full rounded-lg bg-white/10 px-4 py-2 text-white placeholder-white/50 outline-none ring-1 ring-white/10 focus:ring-[#C9A24D]/60"
                  />
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={obtenerUbicacion}
                  className="flex-1"
                  disabled={!juzgadoSeleccionado && tipoLugar === "juzgado"}
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Obtener Ubicación
                </Button>
                {ubicacion && (
                  <Button
                    variant="primary"
                    onClick={handleCheckIn}
                    className="flex-1"
                    disabled={!!errorUbicacion}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Check-in Biométrico
                  </Button>
                )}
              </div>

              {ubicacion && (
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-xs text-white/70 mb-1">📍 Ubicación detectada:</p>
                  <p className="text-sm text-white">{ubicacion.direccion}</p>
                  {errorUbicacion && (
                    <p className="text-xs text-red-400 mt-2">{errorUbicacion}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Check-out */}
      {entradaHoy && (
        <Card className="bg-gradient-to-br from-blue-500/10 to-indigo-500/5 border-blue-500/30">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Check-in realizado</h3>
                  <p className="text-sm text-white/70">
                    Entrada: {entradaHoy.horaEntrada} - {entradaHoy.ubicacion.nombreLugar || entradaHoy.ubicacion.direccion}
                  </p>
                </div>
              </div>
              <Button
                variant="primary"
                onClick={() => handleCheckOut(entradaHoy.id)}
                disabled={isCheckingOut}
              >
                {isCheckingOut ? "Procesando..." : "Check-out"}
              </Button>
            </div>

            {/* Agregar actividades */}
            <div className="pt-4 border-t border-white/10">
              <label className="block text-sm font-medium text-white/80 mb-2">
                Agregar actividad realizada
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={nuevaActividad}
                  onChange={(e) => setNuevaActividad(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      agregarActividad(entradaHoy.id);
                    }
                  }}
                  placeholder="Ej: Revisión de expedientes, Redacción de escritos..."
                  className="flex-1 rounded-lg bg-white/10 px-4 py-2 text-white placeholder-white/50 outline-none ring-1 ring-white/10 focus:ring-[#C9A24D]/60"
                />
                <Button
                  variant="outline"
                  onClick={() => agregarActividad(entradaHoy.id)}
                  disabled={!nuevaActividad.trim()}
                >
                  Agregar
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Modal de verificación biométrica */}
      <AnimatePresence>
        {isCheckingIn && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#13253A] rounded-2xl p-6 max-w-md w-full mx-4 border border-white/10"
            >
              <h3 className="text-xl font-bold text-white mb-4">Verificación Biométrica</h3>
              <p className="text-sm text-white/70 mb-6">
                Realiza verificación biométrica para confirmar tu asistencia
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
                  onClick={() => setIsCheckingIn(false)}
                  className="w-full"
                >
                  Cancelar
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Historial de entradas */}
      {entries.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">Historial de Asistencia</h3>
          <div className="space-y-3">
            {entries
              .sort((a, b) => new Date(b.fecha + "T" + b.horaEntrada).getTime() - new Date(a.fecha + "T" + a.horaEntrada).getTime())
              .map((entry) => (
                <Card key={entry.id}>
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-white">
                            {new Date(entry.fecha).toLocaleDateString("es-PY", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </h4>
                          {entry.tutorAprobado && (
                            <Badge variant="accent" className="text-xs">
                              ✓ Aprobado
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-white/70">
                          {entry.horaEntrada} {entry.horaSalida && `- ${entry.horaSalida}`}
                        </p>
                        <p className="text-xs text-white/60 mt-1">
                          📍 {entry.ubicacion.nombreLugar || entry.ubicacion.direccion}
                        </p>
                      </div>
                      <Badge variant={entry.horaSalida ? "accent" : "terracota"}>
                        {entry.horaSalida ? "Completo" : "En curso"}
                      </Badge>
                    </div>

                    {entry.actividades.length > 0 && (
                      <div className="pt-2 border-t border-white/10">
                        <p className="text-xs text-white/60 mb-1">Actividades:</p>
                        <ul className="space-y-1">
                          {entry.actividades.map((act, idx) => (
                            <li key={idx} className="text-sm text-white/80 flex items-start gap-2">
                              <span className="text-[#C9A24D] mt-1">•</span>
                              <span>{act}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex items-center gap-4 pt-2 border-t border-white/10 text-xs text-white/60">
                      <span className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Biométrico: {entry.verificacionBiometrica.entrada.metodo}
                      </span>
                      {entry.verificacionBiometrica.salida && (
                        <span className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Salida verificada
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        </div>
      )}

      {entries.length === 0 && (
        <Card className="text-center py-8">
          <p className="text-white/70">Aún no has registrado asistencia. Realiza tu primer check-in arriba.</p>
        </Card>
      )}
    </div>
  );
}
