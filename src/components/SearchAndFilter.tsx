"use client";

import React from "react";
import { Search, X, SlidersHorizontal, ArrowUpDown } from "lucide-react";

export type SortOption = "featured" | "price-asc" | "price-desc" | "discount";

interface SearchAndFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedBrand: string;
  onBrandChange: (brand: string) => void;
  brands: string[];
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  onlyInStock: boolean;
  onToggleInStock: () => void;
}

export function SearchAndFilter({
  searchQuery,
  onSearchChange,
  selectedBrand,
  onBrandChange,
  brands,
  sortBy,
  onSortChange,
  onlyInStock,
  onToggleInStock,
}: SearchAndFilterProps) {
  return (
    <div className="w-full bg-white rounded-3xl border-2 border-slate-200 border-b-4 p-4 sm:p-5 mb-8 shadow-sm">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari gadget (misal: iPhone 16, M4, Snapdragon, 16GB, RTX)..."
            className="w-full pl-11 pr-10 py-3 rounded-2xl bg-slate-50 border-2 border-slate-200 focus:border-[#58CC02] focus:bg-white text-slate-800 placeholder-slate-400 font-bold text-sm outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sorting Dropdown & In-Stock Switch */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Sort Dropdown */}
          <div className="relative flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-2.5 rounded-2xl bg-slate-50 border-2 border-slate-200 text-xs font-black text-slate-700">
              <ArrowUpDown className="w-4 h-4 text-slate-500" />
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as SortOption)}
                aria-label="Urutkan produk berdasarkan kriteria"
                className="bg-transparent outline-none cursor-pointer font-black text-xs text-slate-700 pr-1"
              >
                <option value="featured">Rekomendasi</option>
                <option value="price-asc">Harga: Terendah</option>
                <option value="price-desc">Harga: Tertinggi</option>
                <option value="discount">Diskon Terbesar</option>
              </select>
            </div>
          </div>

          {/* In-Stock Filter */}
          <button
            onClick={onToggleInStock}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-2xl text-xs font-black border-2 border-b-4 transition-all cursor-pointer active:border-b-2 active:translate-y-[2px] ${
              onlyInStock
                ? "bg-emerald-500 text-white border-emerald-600"
                : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
            }`}
          >
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                onlyInStock ? "bg-white" : "bg-slate-400"
              }`}
            />
            <span>Ready Stock Saja</span>
          </button>
        </div>
      </div>

      {/* Brand Filter Pills */}
      <div className="mt-4 pt-3 border-t-2 border-slate-100 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-black uppercase text-slate-400 flex items-center gap-1 mr-1">
          <SlidersHorizontal className="w-3.5 h-3.5" /> Brand:
        </span>

        <button
          onClick={() => onBrandChange("all")}
          className={`px-3 py-1 rounded-xl text-xs font-black uppercase transition-all cursor-pointer border-2 border-b-2 ${
            selectedBrand === "all"
              ? "bg-[#58CC02] text-white border-[#46A302]"
              : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
          }`}
        >
          Semua
        </button>

        {brands.map((b) => {
          const isSelected = selectedBrand.toLowerCase() === b.toLowerCase();
          return (
            <button
              key={b}
              onClick={() => onBrandChange(b)}
              className={`px-3 py-1 rounded-xl text-xs font-black uppercase transition-all cursor-pointer border-2 border-b-2 ${
                isSelected
                  ? "bg-[#1CB0F6] text-white border-[#1899D6]"
                  : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
              }`}
            >
              {b}
            </button>
          );
        })}
      </div>
    </div>
  );
}

