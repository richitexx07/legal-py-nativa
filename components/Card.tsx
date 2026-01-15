import { ReactNode, HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = "", hover = false, ...props }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-[#13253A] p-5 ${
        hover ? "hover:border-[#C9A24D]/40 hover:bg-[#13253A]/90 transition" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
