import "./globals.css";
import type { Metadata } from "next";
import { I18nProvider } from "@/components/I18nProvider";
import NavbarTop from "@/components/NavbarTop";
import BottomNav from "@/components/BottomNav";
import FloatingChatButton from "@/components/FloatingChatButton";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Legal Py",
  description: "La plataforma legal integral de Paraguay",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className="min-h-screen bg-[#0E1B2A] text-white">
        <I18nProvider>
          {/* Top Navigation - Desktop */}
          <NavbarTop />

          {/* Main Content */}
          <main className="mx-auto max-w-7xl px-4 py-8 pb-24 md:pb-8">{children}</main>

          {/* Footer */}
          <Footer />

          {/* Bottom Navigation - Mobile Only */}
          <BottomNav />

          {/* Floating Chat Button - All Devices */}
          <FloatingChatButton />
        </I18nProvider>
      </body>
    </html>
  );
}
