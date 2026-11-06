"use client";

import React from "react";
import Image from "next/image";
import { GadgetProduct } from "../types/gadget";

interface ProductCardProps {
  product: GadgetProduct;
  onOpenDetail?: (product: GadgetProduct) => void;
}

export function ProductCard({ product, onOpenDetail }: ProductCardProps) {
  const ram = product.specs?.ram || "-";
  const storage = product.specs?.storage || "-";
  const description =
    product.specs?.description ||
    product.description ||
    `${product.brand} ${product.category_id} berkualitas dengan spesifikasi terbaik.`;

  const formatRupiah = (val?: number) => {
    if (!val || val <= 0) return "Hubungi Kami";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div
      onClick={() => onOpenDetail && onOpenDetail(product)}
      className="group bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 cursor-pointer"
    >
      <div>
        {/* Gambar */}
        <div className="relative aspect-square w-full rounded-xl bg-zinc-950/90 border border-zinc-800/80 p-4 mb-3 flex items-center justify-center overflow-hidden">
          <Image
            src={product.image_url}
            alt={product.name}
            width={280}
            height={280}
            className="object-contain max-h-full w-auto transform group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>

        {/* Kategori & Brand */}
        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider mb-1">
          <span className="text-emerald-400">{product.category_id}</span>
          <span className="text-zinc-500">{product.brand}</span>
        </div>

        {/* Nama */}
        <h3 className="font-bold text-sm text-zinc-100 group-hover:text-emerald-400 transition-colors line-clamp-1 mb-1.5">
          {product.name}
        </h3>

        {/* Deskripsi */}
        <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-3">
          {description}
        </p>

        {/* Harga */}
        <div className="text-base font-black text-emerald-400 mb-3">
          {formatRupiah(product.price)}
        </div>
      </div>

      {/* RAM & Storage */}
      <div className="pt-2.5 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-300 font-mono">
        <span className="bg-zinc-800/70 px-2 py-0.5 rounded border border-zinc-700/50">
          RAM: {ram}
        </span>
        <span className="bg-zinc-800/70 px-2 py-0.5 rounded border border-zinc-700/50">
          Storage: {storage}
        </span>
      </div>
    </div>
  );
}
