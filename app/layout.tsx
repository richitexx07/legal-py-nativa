import "./globals.css";
import type { Metadata } from "next";
import { LanguageProvider } from "@/context/LanguageContext";
import NavbarTop from "@/components/NavbarTop";
import BottomNav from "@/components/BottomNav";
import SmartAssistant from "@/components/SmartAssistant";
import Footer from "@/components/Footer";
import DemoControls from "@/components/Demo/DemoControls";

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
  // Captura de errores global en cliente
  if (typeof window !== "undefined") {
    window.addEventListener("error", (event) => {
      fetch('http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/layout.tsx:global-error',message:'Global error caught',data:{errorMessage:event.message,errorSource:event.filename,errorLine:event.lineno,errorCol:event.colno},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H1'})}).catch(()=>{});
    });
    window.addEventListener("unhandledrejection", (event) => {
      fetch('http://127.0.0.1:7242/ingest/8568c4c1-fdfd-4da4-81a0-a7add37291b9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/layout.tsx:unhandled-rejection',message:'Unhandled promise rejection',data:{reason:event.reason?.toString()||'Unknown'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H1'})}).catch(()=>{});
    });
  }

  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className="min-h-screen bg-[#0E1B2A] text-white">
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
        </LanguageProvider>
      </body>
    </html>
  );
}
