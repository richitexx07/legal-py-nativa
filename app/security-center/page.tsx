"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession, updateIdentityVerification } from "@/lib/auth";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Badge from "@/components/Badge";

export default function SecurityCenterPage() {
  const router = useRouter();
  const [session, setSession] = useState<ReturnType<typeof getSession>>(null);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    cedulaFrente: "pending" | "uploaded";
    cedulaDorso: "pending" | "uploaded";
    selfie: "pending" | "uploaded";
  }>({
    cedulaFrente: "pending",
    cedulaDorso: "pending",
    selfie: "pending",
  });

  // Mock data para dispositivos activos
  const [activeDevices] = useState([
    {
      id: "1",
      name: "Chrome",
      location: "Asunción, Paraguay",
      lastActive: "Hace 2 min",
      ip: "192.168.1.100",
      current: true,
    },
    {
      id: "2",
      name: "Safari - iPhone",
      location: "Ciudad del Este, Paraguay",
      lastActive: "Hace 3 días",
      ip: "192.168.1.101",
      current: false,
    },
  ]);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const currentSession = getSession();
      setSession(currentSession);
      if (!currentSession) {
        router.push("/login");
      }
    }
  }, [router]);

  // Durante SSR o antes del mount, mostrar placeholder para evitar hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0E1B2A] via-[#13253A] to-[#0E1B2A] py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8">
            <div className="h-10 w-64 bg-white/5 rounded-lg animate-pulse mb-2" />
            <div className="h-5 w-96 bg-white/5 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const user = session.user;
  const tierNames = {
    0: "Visitante",
    1: "Básico",
    2: "Verificado",
    3: "GEP/Corp",
  };

  const tierColors = {
    0: "bg-gray-500",
    1: "bg-blue-500",
    2: "bg-green-500",
    3: "bg-[#C9A24D]",
  };

  const getTierProgress = () => {
    if (user.kycTier === 0) return 0;
    if (user.kycTier === 1) return 33;
    if (user.kycTier === 2) return 66;
    if (user.kycTier === 3) return 100;
    return 0;
  };

  const getNextTierRequirements = () => {
    if (user.kycTier === 0) {
      return ["Verificar email"];
    }
    if (user.kycTier === 1) {
      return ["Verificar identidad (subir documentos)", "Completar biometría"];
    }
    if (user.kycTier === 2) {
      return ["Solicitar acceso GEP/Corporativo"];
    }
    return [];
  };

  const handleFileUpload = async (type: "cedulaFrente" | "cedulaDorso" | "selfie") => {
    // Simular carga de archivo
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setUploadStatus((prev) => ({
      ...prev,
      [type]: "uploaded",
    }));

    // Guardar en localStorage que la cédula fue subida (para BiometricGate)
    if (type === "cedulaFrente" || type === "cedulaDorso") {
      if (typeof window !== "undefined") {
        localStorage.setItem(`legal-py-cedula-${user.id}`, "uploaded");
      }
    }

    // Si todos los documentos están subidos, cambiar estado a "en revisión"
    const newStatus = { ...uploadStatus, [type]: "uploaded" };
    const allUploaded =
      newStatus.cedulaFrente === "uploaded" &&
      newStatus.cedulaDorso === "uploaded" &&
      newStatus.selfie === "uploaded";

    if (allUploaded) {
      await updateIdentityVerification(user.id, { status: "in_review" });
      // Actualizar sesión
      const updatedSession = getSession();
      if (updatedSession) {
        setSession(updatedSession);
      }
    }

    setLoading(false);
  };

  const handleSubmitDocuments = async () => {
    if (
      uploadStatus.cedulaFrente === "uploaded" &&
      uploadStatus.cedulaDorso === "uploaded" &&
      uploadStatus.selfie === "uploaded"
    ) {
      setLoading(true);
      await updateIdentityVerification(user.id, { status: "in_review" });
      const updatedSession = getSession();
      if (updatedSession) {
        setSession(updatedSession);
      }
      setLoading(false);
      alert("Documentos enviados. Tu verificación está en revisión.");
    } else {
      alert("Por favor sube todos los documentos requeridos.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E1B2A] via-[#13253A] to-[#0E1B2A] py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🔒 Centro de Seguridad</h1>
          <p className="text-white/70">Gestiona tu nivel de verificación y seguridad de cuenta</p>
        </div>

        {/* Sección A: Nivel de Cuenta */}
        <Card className="mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-white">Nivel de Cuenta</h2>
              <Badge
                variant={user.kycTier === 3 ? "accent" : "outline"}
                className={`${tierColors[user.kycTier]} text-white`}
              >
                Nivel {user.kycTier} - {tierNames[user.kycTier]}
              </Badge>
            </div>

            {/* Barra de progreso */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-white/70 mb-2">
                <span>Progreso de verificación</span>
                <span>{getTierProgress()}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full ${tierColors[user.kycTier]} transition-all duration-500`}
                  style={{ width: `${getTierProgress()}%` }}
                />
              </div>
            </div>

            {/* Requisitos para siguiente nivel */}
            {user.kycTier < 3 && (
              <div className="mt-4 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                <p className="text-sm font-semibold text-blue-400 mb-2">
                  Para subir al Nivel {user.kycTier + 1} necesitas:
                </p>
                <ul className="space-y-1">
                  {getNextTierRequirements().map((req, index) => (
                    <li key={index} className="text-sm text-white/70 flex items-center gap-2">
                      <span className="text-blue-400">•</span>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Estado de verificación de identidad */}
            {user.identityVerificationStatus && (
              <div className="mt-4 p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">Verificación de Identidad</p>
                    <p className="text-xs text-white/60 mt-1">
                      Estado:{" "}
                      {user.identityVerificationStatus === "pending"
                        ? "Pendiente"
                        : user.identityVerificationStatus === "in_review"
                        ? "En revisión"
                        : user.identityVerificationStatus === "verified"
                        ? "Verificado ✓"
                        : "Rechazado"}
                    </p>
                  </div>
                  {user.identityVerificationStatus === "verified" && (
                    <Badge variant="accent" className="bg-green-500 text-white">
                      ✓ Verificado
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Sección B: Verificación de Identidad */}
        <Card className="mb-6">
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-white mb-4">Verificación de Identidad</h2>
            <p className="text-sm text-white/70 mb-6">
              Sube los documentos requeridos para verificar tu identidad y acceder a funciones avanzadas.
            </p>

            <div className="space-y-4">
              {/* Foto Cédula Frente */}
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-semibold text-white">Foto Cédula Frente</p>
                    <p className="text-xs text-white/60">Sube una foto clara del frente de tu cédula</p>
                  </div>
                  {uploadStatus.cedulaFrente === "uploaded" && (
                    <Badge variant="accent" className="bg-green-500 text-white">
                      ✓ Subido
                    </Badge>
                  )}
                </div>
                <div className="mt-3">
                  <input
                    type="file"
                    accept="image/*"
                    id="cedulaFrente"
                    className="hidden"
                    onChange={() => handleFileUpload("cedulaFrente")}
                    disabled={loading || uploadStatus.cedulaFrente === "uploaded"}
                  />
                  <label
                    htmlFor="cedulaFrente"
                    className={`inline-block px-4 py-2 rounded-lg cursor-pointer transition ${
                      uploadStatus.cedulaFrente === "uploaded"
                        ? "bg-green-500/20 border border-green-500/50 text-green-400 cursor-not-allowed"
                        : "bg-[#C9A24D]/20 border border-[#C9A24D]/50 text-[#C9A24D] hover:bg-[#C9A24D]/30"
                    }`}
                  >
                    {uploadStatus.cedulaFrente === "uploaded" ? "✓ Documento subido" : "Seleccionar archivo"}
                  </label>
                </div>
              </div>

              {/* Foto Cédula Dorso */}
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-semibold text-white">Foto Cédula Dorso</p>
                    <p className="text-xs text-white/60">Sube una foto clara del dorso de tu cédula</p>
                  </div>
                  {uploadStatus.cedulaDorso === "uploaded" && (
                    <Badge variant="accent" className="bg-green-500 text-white">
                      ✓ Subido
                    </Badge>
                  )}
                </div>
                <div className="mt-3">
                  <input
                    type="file"
                    accept="image/*"
                    id="cedulaDorso"
                    className="hidden"
                    onChange={() => handleFileUpload("cedulaDorso")}
                    disabled={loading || uploadStatus.cedulaDorso === "uploaded"}
                  />
                  <label
                    htmlFor="cedulaDorso"
                    className={`inline-block px-4 py-2 rounded-lg cursor-pointer transition ${
                      uploadStatus.cedulaDorso === "uploaded"
                        ? "bg-green-500/20 border border-green-500/50 text-green-400 cursor-not-allowed"
                        : "bg-[#C9A24D]/20 border border-[#C9A24D]/50 text-[#C9A24D] hover:bg-[#C9A24D]/30"
                    }`}
                  >
                    {uploadStatus.cedulaDorso === "uploaded" ? "✓ Documento subido" : "Seleccionar archivo"}
                  </label>
                </div>
              </div>

              {/* Selfie (Liveness check) */}
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-semibold text-white">Selfie (Verificación de vida)</p>
                    <p className="text-xs text-white/60">Toma una selfie para verificación biométrica</p>
                  </div>
                  {uploadStatus.selfie === "uploaded" && (
                    <Badge variant="accent" className="bg-green-500 text-white">
                      ✓ Subido
                    </Badge>
                  )}
                </div>
                <div className="mt-3">
                  <input
                    type="file"
                    accept="image/*"
                    capture="user"
                    id="selfie"
                    className="hidden"
                    onChange={() => handleFileUpload("selfie")}
                    disabled={loading || uploadStatus.selfie === "uploaded"}
                  />
                  <label
                    htmlFor="selfie"
                    className={`inline-block px-4 py-2 rounded-lg cursor-pointer transition ${
                      uploadStatus.selfie === "uploaded"
                        ? "bg-green-500/20 border border-green-500/50 text-green-400 cursor-not-allowed"
                        : "bg-[#C9A24D]/20 border border-[#C9A24D]/50 text-[#C9A24D] hover:bg-[#C9A24D]/30"
                    }`}
                  >
                    {uploadStatus.selfie === "uploaded" ? "✓ Selfie subido" : "Tomar selfie"}
                  </label>
                </div>
              </div>

              {/* Botón enviar */}
              <div className="mt-6">
                <Button
                  variant="primary"
                  onClick={handleSubmitDocuments}
                  disabled={
                    loading ||
                    uploadStatus.cedulaFrente !== "uploaded" ||
                    uploadStatus.cedulaDorso !== "uploaded" ||
                    uploadStatus.selfie !== "uploaded" ||
                    user.identityVerificationStatus === "in_review" ||
                    user.identityVerificationStatus === "verified"
                  }
                  className="w-full"
                >
                  {loading
                    ? "Procesando..."
                    : user.identityVerificationStatus === "in_review"
                    ? "En revisión..."
                    : user.identityVerificationStatus === "verified"
                    ? "✓ Verificación completada"
                    : "Enviar Documentos para Verificación"}
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Sección C: Dispositivos y Accesos */}
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-white">Dispositivos y Accesos</h2>
              <Button variant="outline" size="sm">
                Ver todos
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-white/80">Dispositivo</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-white/80">Ubicación</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-white/80">Última actividad</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-white/80">IP</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-white/80">Estado</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-white/80">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {activeDevices.map((device) => (
                    <tr key={device.id} className="border-b border-white/5 hover:bg-white/5 transition">
                      <td className="py-3 px-4 text-sm text-white/90">{device.name}</td>
                      <td className="py-3 px-4 text-sm text-white/70">{device.location}</td>
                      <td className="py-3 px-4 text-sm text-white/70">{device.lastActive}</td>
                      <td className="py-3 px-4 text-sm text-white/70 font-mono">{device.ip}</td>
                      <td className="py-3 px-4">
                        {device.current ? (
                          <Badge variant="accent" className="bg-green-500 text-white text-xs">
                            Activo
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            Inactivo
                          </Badge>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {!device.current && (
                          <button className="text-xs text-red-400 hover:text-red-300 transition">
                            Cerrar sesión
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
