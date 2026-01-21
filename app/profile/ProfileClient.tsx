"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import Badge from "@/components/Badge";
import { getSession, updateIdentityVerification, updateProfile } from "@/lib/auth";
import type { AuthSession } from "@/lib/types";
import BiometricVerificationModal from "@/components/Security/BiometricVerificationModal";

function safeInitials(name: string) {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "LP";
  return `${parts[0][0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase();
}

export default function ProfileClient() {
  const router = useRouter();
  const params = useSearchParams();

  const [session, setSession] = useState<AuthSession | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isBioModalOpen, setIsBioModalOpen] = useState(false);

  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [instagram, setInstagram] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [x, setX] = useState("");

  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const fullName = useMemo(() => {
    const p = session?.profile;
    return `${p?.firstName ?? ""} ${p?.lastName ?? ""}`.trim() || "Usuario";
  }, [session]);

  const avatarSrc = useMemo(() => {
    const p = session?.profile as any;
    return (p?.avatar as string | undefined) || "";
  }, [session]);

  const verified = !!session?.user.isIdentityVerified || (session?.user.kycTier ?? 0) >= 2;

  useEffect(() => {
    const s = getSession();
    setSession(s);
    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: "debug-session",
        runId: "run-profile-2",
        hypothesisId: "H-PROFILE-MOUNT",
        location: "app/profile/ProfileClient.tsx:mount",
        message: "Profile client mounted",
        data: { hasSession: !!s, kycTier: s?.user.kycTier ?? null, isIdentityVerified: s?.user.isIdentityVerified ?? null },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion

    if (!s) return;
    setBio((s.profile as any).bio ?? "");
    setPhone((s.profile as any).phone ?? "");
    setWebsite((s.profile as any).socials?.website ?? "");
    setInstagram((s.profile as any).socials?.instagram ?? "");
    setLinkedin((s.profile as any).socials?.linkedin ?? "");
    setX((s.profile as any).socials?.x ?? "");

    if (params?.get("verify") === "1") {
      setIsBioModalOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveEdits = async () => {
    if (!session) return;
    setSaving(true);
    setStatusMsg(null);
    const userId = session.user.id;
    const role = session.user.role;

    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: "debug-session",
        runId: "run-profile-2",
        hypothesisId: "H-PROFILE-SAVE",
        location: "app/profile/ProfileClient.tsx:saveEdits",
        message: "Saving profile edits",
        data: { role, hasBio: !!bio, hasPhone: !!phone, hasSocials: !!(website || instagram || linkedin || x) },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion

    const res = await updateProfile(userId, role, {
      bio,
      phone,
      socials: { website, instagram, linkedin, x },
    } as any);

    setSaving(false);
    if (res.success) {
      const next = getSession();
      setSession(next);
      setIsEditOpen(false);
      setStatusMsg("Perfil actualizado.");
      return;
    }
    setStatusMsg(res.error || "No se pudo guardar.");
  };

  const onBiometricVerified = async ({ selfieDataUrl }: { selfieDataUrl: string }) => {
    if (!session) return;
    const userId = session.user.id;
    const role = session.user.role;

    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: "debug-session",
        runId: "run-profile-2",
        hypothesisId: "H-BIO-VERIFY",
        location: "app/profile/ProfileClient.tsx:onBiometricVerified",
        message: "Biometric verified flow completed",
        data: { role, selfieLen: selfieDataUrl.length },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion

    await updateProfile(userId, role, { avatar: selfieDataUrl } as any);
    await updateIdentityVerification(userId, { status: "verified", selfieDataUrl });
    localStorage.setItem("legal-py-reverify-required", "false");

    const next = getSession();
    setSession(next);
    setIsBioModalOpen(false);
    setStatusMsg("Identidad actualizada y verificada.");
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0E1B2A] via-[#13253A] to-[#0E1B2A] p-6">
        <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl text-white">
          <p className="text-white/70">Debes iniciar sesión para ver tu perfil.</p>
          <div className="mt-4">
            <Button variant="primary" className="rounded-2xl" onClick={() => router.push("/login")}>
              Ir a Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E1B2A] via-[#13253A] to-[#0E1B2A]">
      {/* Banner cover */}
      <div className="relative h-44 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#C9A24D]/25 via-blue-500/20 to-emerald-500/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_55%)]" />
      </div>

      <div className="mx-auto max-w-5xl px-4 pb-14">
        {/* Header card */}
        <div className="-mt-16 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-2xl shadow-2xl">
          {/* Alerta de visibilidad / verificación */}
          {!verified && (
            <div className="mb-4 rounded-2xl border border-yellow-400/40 bg-yellow-400/10 px-4 py-3 text-xs md:text-sm text-yellow-100">
              ⚠️ Identidad no verificada. Tu perfil es invisible para clientes premium hasta que completes la validación biométrica.
            </div>
          )}

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="flex items-end gap-5">
              {/* Avatar (bloqueado) */}
              <button
                type="button"
                onClick={() => setIsBioModalOpen(true)}
                className="relative h-28 w-28 rounded-full border border-white/15 bg-white/5 overflow-hidden shadow-xl group focus:outline-none focus:ring-2 focus:ring-[#C9A24D]/70 focus:ring-offset-2 focus:ring-offset-slate-900"
                aria-label="Actualizar foto de perfil mediante verificación biométrica"
              >
                {avatarSrc ? (
                  <Image src={avatarSrc} alt="Foto de perfil" fill className="object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-2xl font-extrabold text-white/90">
                    {safeInitials(fullName)}
                  </div>
                )}
                {/* Candado / cámara: NO editable directo */}
                <div className="absolute bottom-2 right-2 rounded-full bg-black/70 border border-emerald-400/70 px-2 py-1 flex items-center gap-1 backdrop-blur">
                  <span className="text-xs">🔒</span>
                  <span className="text-[10px] text-emerald-200 font-semibold hidden sm:inline">
                    Biométrico
                  </span>
                </div>
              </button>

              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl md:text-3xl font-extrabold text-white truncate">{fullName}</h1>
                  {verified && (
                    <Badge variant="accent" className="bg-blue-500 text-white">
                      ✓ Identidad Verificada Biométricamente
                    </Badge>
                  )}
                </div>
                <p className="text-white/70 text-sm mt-1 truncate">{session.user.email}</p>
                <p className="text-white/50 text-xs mt-1">
                  ID: <span className="font-mono">{session.user.id}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 justify-end">
              <Button variant="secondary" className="rounded-2xl" onClick={() => setIsEditOpen(true)}>
                Editar Perfil
              </Button>
              <Button
                variant="primary"
                className="rounded-2xl"
                onClick={() => {
                  setIsBioModalOpen(true);
                  // #region agent log
                  fetch("http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      sessionId: "debug-session",
                      runId: "run-profile-2",
                      hypothesisId: "H-BIO-START",
                      location: "app/profile/ProfileClient.tsx:openBiometric",
                      message: "User opened biometric capture modal",
                      data: { role: session.user.role },
                      timestamp: Date.now(),
                    }),
                  }).catch(() => {});
                  // #endregion
                }}
              >
                🔄 Actualizar Identidad / Foto
              </Button>
            </div>
          </div>

          {statusMsg && <p className="mt-4 text-sm text-white/80">{statusMsg}</p>}

          {/* Profile content */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-white font-bold mb-2">Bio</h2>
              <p className="text-white/70 text-sm whitespace-pre-wrap">{bio || "Sin bio todavía."}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-3">
              <div>
                <p className="text-xs text-white/50 mb-1">Teléfono</p>
                <p className="text-sm text-white/80">{phone || "No definido"}</p>
              </div>
              <div>
                <p className="text-xs text-white/50 mb-1">Redes</p>
                <ul className="text-sm text-white/80 space-y-1">
                  <li>🌐 {website || "—"}</li>
                  <li>📷 {instagram || "—"}</li>
                  <li>💼 {linkedin || "—"}</li>
                  <li>𝕏 {x || "—"}</li>
                </ul>
              </div>
              <div className="pt-2 border-t border-white/10">
                <p className="text-[11px] text-white/50">
                  La foto de perfil está protegida. Solo se cambia vía validación biométrica.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal edición */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Editar Perfil"
        className="max-w-xl bg-white/10 backdrop-blur-2xl border border-white/15"
        position="center"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-white/80 mb-1">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full min-h-24 rounded-2xl bg-white/10 border border-white/10 px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-[#C9A24D]/60"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-white/80 mb-1">Teléfono</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-11 rounded-2xl bg-white/10 border border-white/10 px-4 text-sm text-white outline-none focus:ring-2 focus:ring-[#C9A24D]/60"
              />
            </div>
            <div>
              <label className="block text-sm text-white/80 mb-1">Website</label>
              <input
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full h-11 rounded-2xl bg-white/10 border border-white/10 px-4 text-sm text-white outline-none focus:ring-2 focus:ring-[#C9A24D]/60"
              />
            </div>
            <div>
              <label className="block text-sm text-white/80 mb-1">Instagram</label>
              <input
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className="w-full h-11 rounded-2xl bg-white/10 border border-white/10 px-4 text-sm text-white outline-none focus:ring-2 focus:ring-[#C9A24D]/60"
              />
            </div>
            <div>
              <label className="block text-sm text-white/80 mb-1">LinkedIn</label>
              <input
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                className="w-full h-11 rounded-2xl bg-white/10 border border-white/10 px-4 text-sm text-white outline-none focus:ring-2 focus:ring-[#C9A24D]/60"
              />
            </div>
            <div>
              <label className="block text-sm text-white/80 mb-1">X</label>
              <input
                value={x}
                onChange={(e) => setX(e.target.value)}
                className="w-full h-11 rounded-2xl bg-white/10 border border-white/10 px-4 text-sm text-white outline-none focus:ring-2 focus:ring-[#C9A24D]/60"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" className="rounded-2xl" onClick={() => setIsEditOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" className="rounded-2xl" onClick={saveEdits} disabled={saving}>
              {saving ? "Guardando…" : "Guardar"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal biometría - usa cámara real (react-webcam) */}
      <BiometricVerificationModal
        isOpen={isBioModalOpen}
        onClose={() => setIsBioModalOpen(false)}
        onVerify={(imgSrc) => onBiometricVerified({ selfieDataUrl: imgSrc })}
      />
    </div>
  );
}

