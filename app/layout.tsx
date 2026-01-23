import "./globals.css";
import type { Metadata } from "next";
import { LanguageProvider } from "@/context/LanguageContext";
import NavbarTop from "@/components/NavbarTop";
import BottomNav from "@/components/BottomNav";
import SmartAssistant from "@/components/SmartAssistant";
import Footer from "@/components/Footer";
import DemoControls from "@/components/Demo/DemoControls";
import BiometricGate from "@/components/Security/BiometricGate";
import GlobalErrorHandler from "@/components/ErrorBoundary/GlobalErrorHandler";

export const metadata: Metadata = {
  title: "Legal Py",
  description: "La plataforma legal integral de Paraguay",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#0E1B2A] text-white">
        <GlobalErrorHandler />
        <LanguageProvider>
          {/* Top Navigation - Desktop */}
          <NavbarTop />

          {/* Main Content */}
          <main className="mx-auto max-w-7xl px-4 py-8 pb-24 md:pb-8">{children}</main>

          {/* Footer */}
          <Footer />

          {/* Bottom Navigation - Mobile Only */}
          <BottomNav />

          {/* Smart Assistants - All Devices */}
          <SmartAssistant />

          {/* Demo Controls - Solo en desarrollo */}
          <DemoControls />

          {/* Bloqueo Biométrico - Solo en acciones críticas (NO bloquea al inicio) */}
          <BiometricGate />
        </LanguageProvider>
      </body>
    </html>
  );
}
