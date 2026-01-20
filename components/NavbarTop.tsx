"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import Button from "./Button";
import { useI18n } from "./I18nProvider";
import LanguageSelector from "./LanguageSelector";
import LoginModal from "./LoginModal";
import { getSession } from "@/lib/auth";

export default function NavbarTop() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ top: 0, right: 0 });
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [session, setSession] = useState(getSession());
  const buttonRef = useRef<HTMLButtonElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { t, idioma, setIdioma } = useI18n();

  useEffect(() => {
    if (isLoginModalOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setButtonPosition({
        top: rect.bottom + 10,
        right: window.innerWidth - rect.right,
      });
    }
  }, [isLoginModalOpen]);

  // Verificar sesión al montar y cuando cambie
  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentSession = getSession();
      setSession(currentSession);
    }
  }, []);

  // Cerrar menú de usuario al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserMenuOpen]);

  const navItems = [
    { href: "/", label: t.nav.inicio },
    { href: "/profesionales", label: t.nav.profesionales },
    { href: "/cursos", label: "Cursos" },
    { href: "/especializaciones", label: "Especializaciones" },
    { href: "/pasantias", label: "Pasantías" },
    { href: "/gestores", label: t.nav.gestores },
    { href: "/ujieres", label: t.nav.ujieres },
    { href: "/casos", label: t.nav.casos },
    { href: "/migraciones", label: t.nav.migraciones },
    { href: "/chat", label: t.nav.mensajes },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0E1B2A]/90 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="flex items-center justify-between gap-4 min-w-0">
          {/* Zona Izquierda: Logo + Menú */}
          <div className="flex items-center gap-6 min-w-0 flex-1">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-[#C9A24D] overflow-hidden">
                <Image
                  src="/avatars/icono_balanza_de_justicia_-removebg-preview.png"
                  alt="Legal Py"
                  width={32}
                  height={32}
                  className="object-contain"
                  unoptimized
                />
              </div>
              <span className="text-xl font-extrabold text-[#C9A24D]">Legal</span>
              <span className="text-xl font-extrabold">Py</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:block min-w-0">
              <ul className="flex items-center gap-2 flex-wrap min-w-0">
                {navItems.map((item) => (
                  <li key={item.href} className="shrink-0">
                    <Link
                      href={item.href}
                      className="block px-3 py-2 rounded-lg text-sm text-white/80 hover:text-[#C9A24D] hover:bg-white/5 transition-all duration-200 whitespace-nowrap"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Zona Derecha: Notificaciones + Divisor + Botones */}
          <div className="flex items-center gap-4 shrink-0">
            {/* Language Selector */}
            <div className="hidden sm:block">
              <LanguageSelector currentLanguage={idioma} onLanguageChange={setIdioma} />
            </div>

            {/* Notifications */}
            {(() => {
              // Obtener userId del session si está disponible
              const mockUserId =
                typeof window !== "undefined"
                  ? localStorage.getItem("legal-py-current-user-id") || null
                  : null;

              // #region agent log
              fetch("http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  sessionId: "debug-session",
                  runId: "run1",
                  hypothesisId: "H2",
                  location: "components/NavbarTop.tsx:Notifications",
                  message: "Navbar notifications render",
                  data: { hasUserId: !!mockUserId },
                  timestamp: Date.now(),
                }),
              }).catch(() => {});
              // #endregion
              
              if (mockUserId) {
                // Dynamic import para evitar problemas de SSR
                const NotificationBell = require("@/components/Notifications/NotificationBell").default;
                return <NotificationBell userId={mockUserId} />;
              }
              
              return (
                <button
                  onClick={() => {
                    window.location.href = "/login";
                  }}
                  className="relative rounded-lg p-2 hover:bg-white/5 transition transform translate-y-[3px]"
                  aria-label="Notificaciones"
                >
                  <svg className="h-6 w-6 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </button>
              );
            })()}

            {/* Divisor Vertical */}
            <div className="hidden sm:block h-6 w-px bg-white/10" aria-hidden="true" />

            {/* Desktop CTAs - Botones de Autenticación o Menú de Usuario */}
            {session ? (
              <div className="hidden sm:block relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition"
                >
                  <div className="w-8 h-8 rounded-full bg-[#C9A24D] flex items-center justify-center text-white font-semibold">
                    {session.user.email.charAt(0).toUpperCase()}
                  </div>
                  <svg
                    className={`w-4 h-4 text-white/70 transition-transform ${isUserMenuOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Menú Desplegable */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-lg bg-[#13253A] border border-white/10 shadow-xl z-50">
                    <div className="p-4 border-b border-white/10">
                      <p className="text-sm font-semibold text-white">{session.user.email}</p>
                      <p className="text-xs text-white/60 mt-1">
                        Nivel {session.user.kycTier} -{" "}
                        {session.user.kycTier === 0
                          ? "Visitante"
                          : session.user.kycTier === 1
                          ? "Básico"
                          : session.user.kycTier === 2
                          ? "Verificado"
                          : "GEP/Corp"}
                      </p>
                    </div>
                    <div className="p-2">
                      <Link
                        href="/opportunities"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition group relative"
                      >
                        <svg
                          className="w-5 h-5 text-blue-400 group-hover:text-blue-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="text-sm text-white/90 group-hover:text-white">Panel de Oportunidades</span>
                        <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      </Link>
                      <Link
                        href="/security-center"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition group"
                      >
                        <svg
                          className="w-5 h-5 text-[#C9A24D] group-hover:text-[#C9A24D]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          />
                        </svg>
                        <span className="text-sm text-white/90 group-hover:text-white">Centro de Seguridad</span>
                      </Link>
                      <Link
                        href="/panel"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition group"
                      >
                        <svg
                          className="w-5 h-5 text-white/60 group-hover:text-white/80"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        <span className="text-sm text-white/70 group-hover:text-white/90">Mi Panel</span>
                      </Link>
                      <div className="border-t border-white/10 my-2" />
                      <button
                        onClick={() => {
                          if (typeof window !== "undefined") {
                            localStorage.removeItem("legal-py-session");
                            setSession(null);
                            setIsUserMenuOpen(false);
                            window.location.href = "/";
                          }
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-500/10 transition group text-left"
                      >
                        <svg
                          className="w-5 h-5 text-red-400 group-hover:text-red-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        <span className="text-sm text-red-400 group-hover:text-red-300">Cerrar Sesión</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/login">
                  <Button variant="primary" size="sm">
                    Ingresar
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="secondary" size="sm">
                    Registrarse
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile CTAs - Botones de Autenticación o Menú de Usuario */}
            {session ? (
              <div className="flex sm:hidden relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-white/5 transition"
                >
                  <div className="w-8 h-8 rounded-full bg-[#C9A24D] flex items-center justify-center text-white font-semibold text-sm">
                    {session.user.email.charAt(0).toUpperCase()}
                  </div>
                </button>

                {/* Menú Desplegable Mobile */}
                {isUserMenuOpen && (
                  <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" onClick={() => setIsUserMenuOpen(false)}>
                    <div className="absolute bottom-0 left-0 right-0 bg-[#13253A] border-t border-white/10 rounded-t-2xl p-4">
                      <div className="mb-4 pb-4 border-b border-white/10">
                        <p className="text-sm font-semibold text-white">{session.user.email}</p>
                        <p className="text-xs text-white/60 mt-1">
                          Nivel {session.user.kycTier} -{" "}
                          {session.user.kycTier === 0
                            ? "Visitante"
                            : session.user.kycTier === 1
                            ? "Básico"
                            : session.user.kycTier === 2
                            ? "Verificado"
                            : "GEP/Corp"}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Link
                          href="/opportunities"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 transition relative"
                        >
                          <svg
                            className="w-6 h-6 text-blue-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                          <span className="text-white font-medium">Panel de Oportunidades</span>
                          <span className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        </Link>
                        <Link
                          href="/security-center"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 transition"
                        >
                          <svg
                            className="w-6 h-6 text-[#C9A24D]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                            />
                          </svg>
                          <span className="text-white font-medium">Centro de Seguridad</span>
                        </Link>
                        <Link
                          href="/panel"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 transition"
                        >
                          <svg
                            className="w-6 h-6 text-white/70"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          <span className="text-white/90">Mi Panel</span>
                        </Link>
                        <button
                          onClick={() => {
                            if (typeof window !== "undefined") {
                              localStorage.removeItem("legal-py-session");
                              setSession(null);
                              setIsUserMenuOpen(false);
                              window.location.href = "/";
                            }
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition text-red-400"
                        >
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                          <span className="font-medium">Cerrar Sesión</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex sm:hidden items-center gap-2">
                <Link href="/login">
                  <Button variant="primary" size="sm">
                    Ingresar
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="secondary" size="sm">
                    Registrarse
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Login Modal - Posicionado debajo del botón */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        buttonPosition={buttonPosition}
      />
    </header>
  );
}
