"use client";

import React from "react";

export type DuoButtonVariant = "green" | "blue" | "yellow" | "red" | "purple" | "white" | "ghost" | "dark";
export type DuoButtonSize = "sm" | "md" | "lg";

interface DuoButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: DuoButtonVariant;
  size?: DuoButtonSize;
  children: React.ReactNode;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export function DuoButton({
  variant = "green",
  size = "md",
  children,
  icon,
  fullWidth = false,
  className = "",
  disabled = false,
  ...props
}: DuoButtonProps) {
  const variantStyles: Record<DuoButtonVariant, string> = {
    green:
      "bg-emerald-600 text-white border-2 border-emerald-700 border-b-4 hover:bg-emerald-500 active:border-b-2 active:translate-y-[2px]",
    blue:
      "bg-sky-600 text-white border-2 border-sky-700 border-b-4 hover:bg-sky-500 active:border-b-2 active:translate-y-[2px]",
    yellow:
      "bg-amber-500 text-zinc-950 border-2 border-amber-600 border-b-4 hover:bg-amber-400 active:border-b-2 active:translate-y-[2px]",
    red:
      "bg-rose-600 text-white border-2 border-rose-700 border-b-4 hover:bg-rose-500 active:border-b-2 active:translate-y-[2px]",
    purple:
      "bg-purple-600 text-white border-2 border-purple-700 border-b-4 hover:bg-purple-500 active:border-b-2 active:translate-y-[2px]",
    white:
      "bg-zinc-900 text-zinc-200 border-2 border-zinc-700 border-b-4 hover:bg-zinc-800 hover:border-zinc-600 active:border-b-2 active:translate-y-[2px]",
    dark:
      "bg-zinc-800 text-zinc-100 border-2 border-zinc-700 border-b-4 hover:bg-zinc-750 hover:border-zinc-600 active:border-b-2 active:translate-y-[2px]",
    ghost:
      "bg-transparent text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 border-2 border-transparent active:translate-y-[1px]",
  };

  const sizeStyles: Record<DuoButtonSize, string> = {
    sm: "px-3 py-1.5 text-xs font-bold rounded-xl gap-1.5",
    md: "px-4 py-2.5 text-xs font-black rounded-2xl gap-2",
    lg: "px-5 py-3 text-sm font-black rounded-2xl gap-2.5",
  };

  const disabledStyles = disabled
    ? "opacity-40 cursor-not-allowed pointer-events-none border-b-2 translate-y-0"
    : "cursor-pointer";

  return (
    <button
      disabled={disabled}
      className={`inline-flex items-center justify-center font-sans tracking-wide transition-all select-none uppercase ${
        fullWidth ? "w-full" : ""
      } ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${className}`}
      {...props}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}
