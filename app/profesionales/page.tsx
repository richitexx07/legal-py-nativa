"use client";

import { useI18n } from "@/components/I18nProvider";
import Link from "next/link";

const people = [
    { name: "Dra. Sofía Benítez", role: "Abogada (Civil & Familia)", city: "Asunción", rating: 4.9, price: "desde Gs. 150.000" },
    { name: "Dr. Marcos Ríos", role: "Abogado Penal", city: "Luque", rating: 4.7, price: "desde Gs. 200.000" },
    { name: "Esc. Laura Aquino", role: "Escribana", city: "San Lorenzo", rating: 4.8, price: "desde Gs. 250.000" },
    { name: "Lic. Diego Amarilla", role: "Despachante de Aduana", city: "CDE", rating: 4.6, price: "desde Gs. 300.000" },
  ];
  
  export default function Profesionales() {
    const { t } = useI18n();
    
    return (
      <div className="space-y-6">
        <h1 className="text-2xl md:text-3xl font-extrabold">{t.professionals.listTitle}</h1>
        <p className="text-white/70">{t.professionals.listSubtitle}</p>
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {people.map((p) => (
            <div key={p.name} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-[#C9A24D]">{p.name}</h3>
                  <p className="text-sm text-white/70">{p.role}</p>
                  <p className="text-xs text-white/60 mt-1">{p.city}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm">⭐ {p.rating}</p>
                  <p className="text-xs text-white/60">{p.price}</p>
                </div>
              </div>
  
              <div className="mt-4 flex gap-2">
                <button className="rounded-xl bg-[#C9A24D] px-4 py-2 text-sm font-semibold text-black hover:bg-[#b8943f]">
                  {t.professionals.actionsChat}
                </button>
                <Link href="/profesionales/1" className="rounded-xl border border-white/15 px-4 py-2 text-sm text-white/80 hover:bg-white/5">
                  {t.professionals.actionsViewProfile}
                </Link>
                <button className="rounded-xl border border-[#C9A24D]/40 px-4 py-2 text-sm hover:bg-[#C9A24D]/10">
                  {t.professionals.actionsBook}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  