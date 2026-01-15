interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "accent" | "terracota" | "outline";
  className?: string;
}

export default function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  const variants = {
    default: "bg-white/10 text-white/80",
    accent: "bg-[#C9A24D] text-black",
    terracota: "bg-[#C08457] text-white",
    outline: "border border-[#C9A24D]/40 text-[#C9A24D]",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
