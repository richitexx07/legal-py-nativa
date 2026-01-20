"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import Button from "./Button";
import { useI18n } from "./I18nProvider";
import LanguageSelector from "./LanguageSelector";
import LoginModal from "./LoginModal";

export default function NavbarTop() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ top: 0, right: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
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
              const mockUserId = typeof window !== "undefined" 
                ? localStorage.getItem("legal-py-current-user-id") || null
                : null;
              
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

            {/* Desktop CTAs */}
            <div className="hidden sm:flex items-center gap-2">
              <div className="relative" ref={buttonRef as any}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsLoginModalOpen(true)}
                >
                  {t.nav.iniciarSesion}
                </Button>
              </div>
              <Link href="/profesional/alta">
                <Button variant="primary" size="sm">
                  {t.profesional.suscribirme}
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden rounded-lg p-2 hover:bg-white/5 transition" aria-label="Menú">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
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
