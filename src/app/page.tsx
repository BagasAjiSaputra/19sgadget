"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { GadgetProduct, GadgetCategory } from "@/types/gadget";
import { ProductCard } from "@/components/ProductCard";
import { ProductDetailModal } from "@/components/ProductDetailModal";
import {
  Smartphone,
  Tablet,
  Laptop,
  LayoutGrid,
  Search,
  X,
  MessageCircle,
  PackageX,
  CheckCircle,
} from "lucide-react";
import { DuoButton } from "@/components/ui/DuoButton";

export default function CatalogPage() {
  const [products, setProducts] = useState<GadgetProduct[]>([]);
  const [activeCategory, setActiveCategory] = useState<GadgetCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<GadgetProduct | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch real products from Supabase API (no cache)
  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products?t=${Date.now()}`, {
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Category counts
  const counts = useMemo(() => {
    const c: Record<GadgetCategory, number> = {
      all: products.length,
      handphone: 0,
      tablet: 0,
      laptop: 0,
    };
    products.forEach((p) => {
      if (c[p.category_id] !== undefined) c[p.category_id]++;
    });
    return c;
  }, [products]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (activeCategory !== "all" && p.category_id !== activeCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchBrand = p.brand.toLowerCase().includes(q);
        const matchProc = p.specs.processor?.toLowerCase().includes(q);
        return matchName || matchBrand || matchProc;
      }
      return true;
    });
  }, [products, activeCategory, searchQuery]);

  const categories: {
    id: GadgetCategory;
    label: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: "all",
      label: "Semua",
      icon: <LayoutGrid className="w-4 h-4" />,
    },
    {
      id: "handphone",
      label: "Handphone",
      icon: <Smartphone className="w-4 h-4" />,
    },
    {
      id: "tablet",
      label: "Tablet",
      icon: <Tablet className="w-4 h-4" />,
    },
    {
      id: "laptop",
      label: "Laptop",
      icon: <Laptop className="w-4 h-4" />,
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Minimal Top Header */}
      <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 no-underline">
              <Image
                src="/logo-white.png"
                alt="19s Gadget"
                width={130}
                height={40}
                className="h-8 w-auto object-contain"
                priority
              />
            </Link>
          </div>

          {/* Quick Actions (WA Button only, admin button hidden from public) */}
          <div className="flex items-center gap-2">
            <a
              href="https://wa.me/6285176954992?text=Halo%2019s%20Gadget,%20saya%20ingin%20tanya%20produk."
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline"
            >
              <DuoButton
                variant="green"
                size="sm"
                icon={<MessageCircle className="w-3.5 h-3.5 fill-white" />}
              >
                Chat WA
              </DuoButton>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Minimalist Catalog Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-zinc-900 text-emerald-400 text-[11px] font-black uppercase tracking-wider mb-2 border border-zinc-800">
            <CheckCircle className="w-3 h-3" />
            {/* <span>Garansi Resmi & Original</span> */}
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-zinc-100 tracking-tight">
            19s Gadget Katalog
          </h1>
          {/* <p className="text-xs sm:text-sm font-medium text-zinc-400 mt-1">
            Koleksi handphone, tablet, dan laptop original pilihan
          </p> */}
        </div>

        {/* Category Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-8">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer select-none whitespace-nowrap border ${
                    isActive
                      ? "bg-zinc-800 text-zinc-100 border-emerald-500 shadow-sm"
                      : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:bg-zinc-850"
                  }`}
                >
                  <span className="text-zinc-400">{cat.icon}</span>
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? "bg-emerald-500/20 text-emerald-300" : "bg-zinc-800 text-zinc-500"
                    }`}
                  >
                    {counts[cat.id] || 0}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari gadget..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-emerald-500 focus:bg-zinc-950 text-zinc-100 placeholder-zinc-500 text-xs font-medium outline-none transition-all"
            />
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5 pointer-events-none" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-2 text-zinc-500 hover:text-zinc-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 animate-pulse"
              >
                <div className="aspect-square w-full rounded-xl bg-zinc-800/60 mb-3" />
                <div className="h-3 w-24 bg-zinc-800 rounded mb-2" />
                <div className="h-4 w-3/4 bg-zinc-800 rounded mb-2" />
                <div className="h-3 w-full bg-zinc-850 rounded mb-4" />
                <div className="h-6 w-full bg-zinc-800/80 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Box-Box Item Grid */}
        {!loading && filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenDetail={setSelectedProduct}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredProducts.length === 0 && (
          <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-12 text-center max-w-md mx-auto my-12">
            <PackageX className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
            <h3 className="text-base font-black text-zinc-200 mb-1">
              {products.length === 0 ? "Belum Ada Gadget di Katalog" : "Gadget tidak ditemukan"}
            </h3>
            <p className="text-xs text-zinc-500 font-medium mb-5">
              {products.length === 0
                ? "Daftar produk masih kosong."
                : `Tidak ada gadget untuk kata kunci "${searchQuery}".`}
            </p>
            {searchQuery && (
              <DuoButton
                variant="white"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("all");
                }}
              >
                Reset Filter
              </DuoButton>
            )}
          </div>
        )}
      </main>

      {/* Minimal Footer */}
      <footer className="mt-auto bg-zinc-950 border-t border-zinc-800/80 py-6 text-center text-xs font-medium text-zinc-500">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Image
            src="/logo-white.png"
            alt="19s Gadget"
            width={90}
            height={28}
            className="h-6 w-auto object-contain opacity-80"
          />
        </div>
        {/* <span>Katalog Gadget Original & Minimalis</span> */}
      </footer>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}
