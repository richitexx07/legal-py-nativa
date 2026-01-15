"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import Button from "./Button";
import { useI18n } from "./I18nProvider";
import LanguageSelector from "./LanguageSelector";

export default function NavbarTop() {
  const [notifications, setNotifications] = useState(3); // Demo: 3 notificaciones
  const { t, idioma, setIdioma } = useI18n();

  const navItems = [
    { href: "/", label: t.nav.inicio },
    { href: "/profesionales", label: t.nav.profesionales },
    { href: "/gestores", label: t.nav.gestores },
    { href: "/ujieres", label: t.nav.ujieres },
    { href: "/casos", label: t.nav.casos },
    { href: "/migraciones", label: t.nav.migraciones },
    { href: "/chat", label: t.nav.mensajes },
    { href: "/documentos/traduccion", label: t.nav.traduccion },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0E1B2A]/90 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
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
        <nav className="hidden md:flex items-center gap-5 text-sm">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-white/80 hover:text-[#C9A24D] transition"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
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
          <div className="hidden sm:flex items-center gap-2">
            <Link href="/profesionales/registro">
              <Button variant="ghost" size="sm">
                {t.nav.soyProfesional}
              </Button>
            </Link>
            <Link href="/casos/nuevo">
              <Button variant="primary" size="sm">
                {t.nav.publicarCaso}
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
    </header>
  );
}
