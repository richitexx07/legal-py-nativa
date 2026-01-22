"use client";

import Link from "next/link";
import Button from "@/components/Button";
import Card from "@/components/Card";
import { Package, FileText, Globe, Shield, Clock, CheckCircle } from "lucide-react";

export default function CourierLegalPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E1B2A] via-[#13253A] to-[#0E1B2A] py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#C9A24D] to-[#C08457] mb-6">
            <Package className="w-10 h-10 text-black" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Servicio de Courier Legal
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Envío o Legalización de Documentos. Servicio seguro y confiable para tus trámites legales.
          </p>
        </div>

        {/* Servicios */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card className="p-8 border-2 border-[#C9A24D]/40 hover:border-[#C9A24D]/70 transition-all">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#C9A24D]/20 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6 text-[#C9A24D]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Envío de Documentos</h3>
                <p className="text-white/70 text-sm">
                  Envío seguro de documentos legales dentro de Paraguay y al exterior.
                </p>
              </div>
            </div>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2 text-sm text-white/80">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Seguimiento en tiempo real
              </li>
              <li className="flex items-center gap-2 text-sm text-white/80">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Seguro y asegurado
              </li>
              <li className="flex items-center gap-2 text-sm text-white/80">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Entrega garantizada
              </li>
            </ul>
            <Button variant="primary" className="w-full bg-[#C9A24D] hover:bg-[#C08457] text-black">
              Solicitar Envío
            </Button>
          </Card>

          <Card className="p-8 border-2 border-[#C9A24D]/40 hover:border-[#C9A24D]/70 transition-all">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#C9A24D]/20 flex items-center justify-center shrink-0">
                <Globe className="w-6 h-6 text-[#C9A24D]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Legalización de Documentos</h3>
                <p className="text-white/70 text-sm">
                  Apostillado y legalización de documentos para uso internacional.
                </p>
              </div>
            </div>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2 text-sm text-white/80">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Apostillado de La Haya
              </li>
              <li className="flex items-center gap-2 text-sm text-white/80">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Legalización consular
              </li>
              <li className="flex items-center gap-2 text-sm text-white/80">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Traducciones certificadas
              </li>
            </ul>
            <Button variant="primary" className="w-full bg-[#C9A24D] hover:bg-[#C08457] text-black">
              Solicitar Legalización
            </Button>
          </Card>
        </div>

        {/* Características */}
        <Card className="p-8 border border-white/10 bg-white/5">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Características del Servicio</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <Shield className="w-10 h-10 text-[#C9A24D] mx-auto mb-3" />
              <h3 className="font-bold text-white mb-2">Seguro</h3>
              <p className="text-sm text-white/70">Documentos protegidos y asegurados</p>
            </div>
            <div className="text-center">
              <Clock className="w-10 h-10 text-[#C9A24D] mx-auto mb-3" />
              <h3 className="font-bold text-white mb-2">Rápido</h3>
              <p className="text-sm text-white/70">Entrega en tiempo récord</p>
            </div>
            <div className="text-center">
              <CheckCircle className="w-10 h-10 text-[#C9A24D] mx-auto mb-3" />
              <h3 className="font-bold text-white mb-2">Confiable</h3>
              <p className="text-sm text-white/70">Seguimiento en cada paso</p>
            </div>
          </div>
        </Card>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link href="/login">
            <Button variant="primary" size="lg" className="px-8 py-4 text-lg font-semibold rounded-xl">
              Iniciar Sesión para Solicitar
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
