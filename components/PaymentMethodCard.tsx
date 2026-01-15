import Card from "./Card";

interface PaymentMethodCardProps {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  selected?: boolean;
  onClick: () => void;
  badge?: string;
}

export default function PaymentMethodCard({
  id,
  name,
  description,
  icon,
  selected = false,
  onClick,
  badge,
}: PaymentMethodCardProps) {
  return (
    <Card
      hover
      className={`cursor-pointer transition-all ${
        selected ? "border-[#C9A24D] bg-[#13253A]/90 ring-2 ring-[#C9A24D]/30" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-lg ${
            selected ? "bg-[#C9A24D]/20" : "bg-white/5"
          }`}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className={`font-semibold ${selected ? "text-[#C9A24D]" : "text-white"}`}>
              {name}
            </h3>
            {badge && (
              <span className="text-xs px-2 py-1 rounded-full bg-[#C08457]/20 text-[#C08457]">
                {badge}
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-white/60">{description}</p>
          {selected && (
            <div className="mt-2 flex items-center gap-1 text-xs text-[#C9A24D]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Seleccionado
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
