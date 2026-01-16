"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import Button from "./Button";
import { useI18n } from "./I18nProvider";
import LanguageSelector from "./LanguageSelector";
import LoginModal from "./LoginModal";

export default function NavbarTop() {
  const [notifications, setNotifications] = useState(3); // Demo: 3 notificaciones
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-4 flex items-center justify-between gap-4">
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
        <nav className="hidden lg:flex items-center gap-1 text-sm flex-1 justify-center max-w-4xl mx-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-2 rounded-lg text-white/80 hover:text-[#C9A24D] hover:bg-white/5 transition-all duration-200 whitespace-nowrap text-center"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          {/* Language Selector */}
          <div className="hidden sm:block">
            <LanguageSelector currentLanguage={idioma} onLanguageChange={setIdioma} />
          </div>

          {/* Notifications */}
          <button
            onClick={() => {
              // TODO: Abrir panel de notificaciones
              alert("Panel de notificaciones (demo)");
            }}
            className="relative rounded-lg p-2 hover:bg-white/5 transition"
            aria-label="Notificaciones"
          >
            <svg className="h-5 w-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#C08457] text-xs font-bold text-white">
                {notifications > 9 ? "9+" : notifications}
              </span>
            )}
          </button>

          {/* Desktop CTAs */}
          <div className="hidden sm:flex items-center gap-2.5">
            <div className="relative" ref={buttonRef as any}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsLoginModalOpen(true)}
                className="px-4"
              >
                {t.nav.iniciarSesion}
              </Button>
            </div>
            <Link href="/profesional/alta">
              <Button variant="primary" size="sm" className="px-4">
                {t.profesional.suscribirme}
              </Button>
            </Link>
          </div>

          {/* Mobile/Tablet Menu Button */}
          <button 
            className="lg:hidden rounded-lg p-2 hover:bg-white/5 transition" 
            aria-label="Menú"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile/Tablet Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#0E1B2A]/95 backdrop-blur">
          <nav className="mx-auto max-w-7xl px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-2.5 rounded-lg text-white/80 hover:text-[#C9A24D] hover:bg-white/5 transition-all duration-200"
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-white/10 space-y-2">
              <button
                onClick={() => {
                  setIsLoginModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full px-4 py-2.5 rounded-lg text-white/80 hover:bg-white/5 transition text-left"
              >
                {t.nav.iniciarSesion}
              </button>
              <Link
                href="/profesional/alta"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full px-4 py-2.5 rounded-lg bg-[#C9A24D] text-white hover:bg-[#C08457] transition text-center font-medium"
              >
                {t.profesional.suscribirme}
              </Link>
            </div>
          </nav>
        </div>
      )}

      {/* Login Modal - Posicionado debajo del botón */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        buttonPosition={buttonPosition}
      />
    </header>
  );
}
