"use client";

import React from "react";
import { GadgetCategory } from "../types/gadget";
import { Smartphone, Tablet, Laptop, LayoutGrid } from "lucide-react";

interface CategoryFilterProps {
  activeCategory: GadgetCategory;
  onSelectCategory: (category: GadgetCategory) => void;
  counts: Record<GadgetCategory, number>;
}

export function CategoryFilter({
  activeCategory,
  onSelectCategory,
  counts,
}: CategoryFilterProps) {
  const categories: {
    id: GadgetCategory;
    label: string;
    icon: React.ReactNode;
    color: string;
    activeBorder: string;
    activeBg: string;
  }[] = [
    {
      id: "all",
      label: "Semua",
      icon: <LayoutGrid className="w-5 h-5" />,
      color: "#58CC02",
      activeBorder: "border-[#46A302]",
      activeBg: "bg-[#58CC02] text-white",
    },
    {
      id: "handphone",
      label: "Handphone",
      icon: <Smartphone className="w-5 h-5" />,
      color: "#1CB0F6",
      activeBorder: "border-[#1899D6]",
      activeBg: "bg-[#1CB0F6] text-white",
    },
    {
      id: "tablet",
      label: "Tablet",
      icon: <Tablet className="w-5 h-5" />,
      color: "#FF9600",
      activeBorder: "border-[#E58500]",
      activeBg: "bg-[#FF9600] text-white",
    },
    {
      id: "laptop",
      label: "Laptop",
      icon: <Laptop className="w-5 h-5" />,
      color: "#CE82FF",
      activeBorder: "border-[#A559E6]",
      activeBg: "bg-[#CE82FF] text-white",
    },
  ];

  return (
    <div className="w-full mb-6">
      <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2.5 px-4 sm:px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-wider transition-all select-none whitespace-nowrap shrink-0 border-2 border-b-4 cursor-pointer active:border-b-2 active:translate-y-[2px] ${
                isActive
                  ? `${cat.activeBg} ${cat.activeBorder} shadow-sm`
                  : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <span className="shrink-0">{cat.icon}</span>
              <span>{cat.label}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-black ${
                  isActive
                    ? "bg-black/20 text-white"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {counts[cat.id] || 0}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

