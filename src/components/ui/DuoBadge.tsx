import React from "react";

export type DuoBadgeVariant = "green" | "blue" | "yellow" | "red" | "purple" | "slate" | "orange";

interface DuoBadgeProps {
  variant?: DuoBadgeVariant;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export function DuoBadge({
  variant = "green",
  children,
  icon,
  className = "",
}: DuoBadgeProps) {
  const variantStyles: Record<DuoBadgeVariant, string> = {
    green: "bg-emerald-100 text-emerald-800 border-emerald-300",
    blue: "bg-sky-100 text-sky-800 border-sky-300",
    yellow: "bg-amber-100 text-amber-900 border-amber-300",
    red: "bg-rose-100 text-rose-800 border-rose-300",
    purple: "bg-purple-100 text-purple-800 border-purple-300",
    orange: "bg-orange-100 text-orange-900 border-orange-300",
    slate: "bg-slate-100 text-slate-700 border-slate-300",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase border-2 ${variantStyles[variant]} ${className}`}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}

