"use client";

import { UserRole } from "@/lib/types";

interface RoleSelectorProps {
  selectedRole: UserRole | null;
  onRoleSelect: (role: UserRole) => void;
  error?: string;
}

export default function RoleSelector({ selectedRole, onRoleSelect, error }: RoleSelectorProps) {
  const roles: { value: UserRole; label: string; icon: string; description: string }[] = [
    {
      value: "cliente",
      label: "Cliente",
      icon: "👤",
      description: "Busco servicios legales",
    },
    {
      value: "profesional",
      label: "Profesional",
      icon: "⚖️",
      description: "Soy abogado, escribano o gestor",
    },
    {
      value: "estudiante",
      label: "Estudiante/Pasante",
      icon: "🎓",
      description: "Busco oportunidades de pasantía",
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">Selecciona tu tipo de cuenta</h3>
        <p className="text-sm text-white/70">Elige el rol que mejor describe tu situación</p>
      </div>

      <div className="grid gap-4">
        {roles.map((role) => (
          <button
            key={role.value}
            type="button"
            onClick={() => onRoleSelect(role.value)}
            className={`
              relative p-4 rounded-xl border-2 transition-all text-left
              ${
                selectedRole === role.value
                  ? "border-[#C9A24D] bg-[#C9A24D]/10"
                  : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
              }
            `}
          >
            <div className="flex items-start gap-4">
              <div className="text-3xl">{role.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-white">{role.label}</h4>
                  {selectedRole === role.value && (
                    <span className="text-[#C9A24D] text-sm">✓ Seleccionado</span>
                  )}
                </div>
                <p className="text-sm text-white/70">{role.description}</p>
              </div>
              {selectedRole === role.value && (
                <div className="absolute top-3 right-3">
                  <div className="w-5 h-5 rounded-full bg-[#C9A24D] flex items-center justify-center">
                    <span className="text-black text-xs">✓</span>
                  </div>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      {error && <p className="text-sm text-red-400 mt-2">{error}</p>}
    </div>
  );
}
