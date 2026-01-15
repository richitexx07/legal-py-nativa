"use client";

import { useState } from "react";
import Modal from "./Modal";
import Button from "./Button";
import { useRouter } from "next/navigation";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type View = "login" | "forgot" | "confirm" | "reset";

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const router = useRouter();
  const [view, setView] = useState<View>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [codigo, setCodigo] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validación
    if (!email) {
      setErrors({ email: "El email es requerido" });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors({ email: "Email inválido" });
      return;
    }
    if (!password) {
      setErrors({ password: "La contraseña es requerida" });
      return;
    }

    setLoading(true);

    // Simular login (demo)
    setTimeout(() => {
      setLoading(false);
      // Verificar si existe cuenta en localStorage
      const savedAccount = localStorage.getItem("mockProfessionalAccount");
      if (savedAccount) {
        const account = JSON.parse(savedAccount);
        if (account.email === email) {
          // Login exitoso - redirigir al panel
          onClose();
          router.push("/profesional/panel");
        } else {
          setErrors({ general: "Email o contraseña incorrectos" });
        }
      } else {
        // No hay cuenta - mostrar mensaje o crear demo
        setErrors({
          general: "No existe una cuenta con este email. ¿Quieres crear una cuenta?",
        });
      }
    }, 1000);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!email) {
      setErrors({ email: "Ingresa tu email para recuperar tu contraseña" });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors({ email: "Email inválido" });
      return;
    }

    setLoading(true);

    // Simular envío de código (demo)
    setTimeout(() => {
      setLoading(false);
      // Guardar código demo en localStorage
      const demoCode = "123456";
      localStorage.setItem("resetCode", demoCode);
      localStorage.setItem("resetEmail", email);
      setView("confirm");
    }, 1500);
  };

  const handleConfirmCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!codigo) {
      setErrors({ codigo: "Ingresa el código de confirmación" });
      return;
    }

    const savedCode = localStorage.getItem("resetCode");
    if (codigo !== savedCode) {
      setErrors({ codigo: "Código incorrecto. Intenta con: 123456 (demo)" });
      return;
    }

    setView("reset");
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!newPassword) {
      setErrors({ newPassword: "La nueva contraseña es requerida" });
      return;
    }
    if (newPassword.length < 8) {
      setErrors({ newPassword: "La contraseña debe tener al menos 8 caracteres" });
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrors({ confirmPassword: "Las contraseñas no coinciden" });
      return;
    }

    setLoading(true);

    // Simular cambio de contraseña (demo)
    setTimeout(() => {
      setLoading(false);
      // Limpiar códigos temporales
      localStorage.removeItem("resetCode");
      localStorage.removeItem("resetEmail");

      // Mostrar éxito y volver a login
      alert("Contraseña actualizada exitosamente. Ahora puedes iniciar sesión.");
      setView("login");
      setNewPassword("");
      setConfirmPassword("");
      setCodigo("");
    }, 1000);
  };

  const handleClose = () => {
    setView("login");
    setEmail("");
    setPassword("");
    setCodigo("");
    setNewPassword("");
    setConfirmPassword("");
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Iniciar Sesión">
      {view === "login" && (
        <form onSubmit={handleLogin} className="space-y-4">
          {errors.general && (
            <div className="rounded-lg bg-red-500/20 border border-red-500/50 p-3">
              <p className="text-sm text-red-400">{errors.general}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Email o Usuario
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
              placeholder="tu@email.com"
            />
            {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 pr-10 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
                placeholder="Tu contraseña"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password}</p>}
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setView("forgot")}
              className="text-sm text-[#C9A24D] hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <Button type="submit" variant="primary" className="w-full" disabled={loading}>
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#13253A] text-white/60">O continúa con</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
              </svg>
              <span className="text-white text-sm">Google</span>
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
            >
              <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span className="text-white text-sm">Facebook</span>
            </button>
          </div>
        </form>
      )}

      {view === "forgot" && (
        <form onSubmit={handleForgotPassword} className="space-y-4">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-white mb-2">
              Recuperar Contraseña
            </h3>
            <p className="text-sm text-white/70">
              Ingresa tu email y te enviaremos un código de verificación
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
              placeholder="tu@email.com"
            />
            {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
          </div>

          <div className="bg-[#C9A24D]/10 border border-[#C9A24D]/30 rounded-lg p-3">
            <p className="text-xs text-white/70">
              <strong>Demo:</strong> Se enviará un código al email. Usa <strong>123456</strong> como código de prueba.
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => {
                setView("login");
                setErrors({});
              }}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="primary" className="flex-1" disabled={loading}>
              {loading ? "Enviando..." : "Enviar Código"}
            </Button>
          </div>
        </form>
      )}

      {view === "confirm" && (
        <form onSubmit={handleConfirmCode} className="space-y-4">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-white mb-2">
              Código de Verificación
            </h3>
            <p className="text-sm text-white/70">
              Ingresa el código que enviamos a <strong className="text-white">{email}</strong>
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Código de 6 dígitos
            </label>
            <input
              type="text"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.replace(/\D/g, "").slice(0, 6))}
              className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
              placeholder="123456"
              maxLength={6}
            />
            {errors.codigo && <p className="mt-1 text-xs text-red-400">{errors.codigo}</p>}
          </div>

          <div className="bg-[#C9A24D]/10 border border-[#C9A24D]/30 rounded-lg p-3">
            <p className="text-xs text-white/70">
              <strong>Demo:</strong> Usa el código <strong>123456</strong>
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => {
                setView("forgot");
                setCodigo("");
                setErrors({});
              }}
            >
              Volver
            </Button>
            <Button type="submit" variant="primary" className="flex-1" disabled={loading}>
              Verificar
            </Button>
          </div>
        </form>
      )}

      {view === "reset" && (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-white mb-2">
              Nueva Contraseña
            </h3>
            <p className="text-sm text-white/70">
              Crea una nueva contraseña para tu cuenta
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Nueva Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 pr-10 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
                placeholder="Mínimo 8 caracteres"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            {errors.newPassword && (
              <p className="mt-1 text-xs text-red-400">{errors.newPassword}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Confirmar Contraseña
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
              placeholder="Confirma tu contraseña"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-400">{errors.confirmPassword}</p>
            )}
          </div>

          <Button type="submit" variant="primary" className="w-full" disabled={loading}>
            {loading ? "Actualizando..." : "Actualizar Contraseña"}
          </Button>
        </form>
      )}
    </Modal>
  );
}
