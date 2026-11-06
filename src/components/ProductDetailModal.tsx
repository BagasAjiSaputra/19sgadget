"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { GadgetProduct } from "../types/gadget";
import { X, MessageCircle } from "lucide-react";
import { DuoButton } from "./ui/DuoButton";

interface ProductDetailModalProps {
  product: GadgetProduct | null;
  onClose: () => void;
}

export function ProductDetailModal({ product, onClose }: ProductDetailModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (product) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [product]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  const ram = product.specs?.ram;
  const storage = product.specs?.storage;
  const description = product.specs?.description || product.description;

  const getWhatsAppLink = () => {
    const message = encodeURIComponent(
      `Halo 19s Gadget, saya tertarik dengan unit ${product.name}. Apakah masih ready?`
    );
    return `https://wa.me/6285176954992?text=${message}`;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-gadget-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={dialogRef}
        className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden text-zinc-100 flex flex-col"
      >
        {/* Header: Minimal Bar with Close */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-950/80">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400">
            <span className="text-emerald-400">{product.category_id}</span>
            <span>•</span>
            <span>{product.brand}</span>
          </div>

          <button
            onClick={onClose}
            aria-label="Tutup"
            className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 hover:border-zinc-600 text-zinc-300 flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Gambar Unit (Fokus Utama) */}
        <div className="relative aspect-square w-full bg-zinc-950 p-6 sm:p-8 flex items-center justify-center overflow-hidden">
          <Image
            src={product.image_url}
            alt={product.name}
            width={600}
            height={600}
            className="object-contain max-h-full max-w-full drop-shadow-lg"
            priority
          />
        </div>

        {/* Informasi Ringkas Unit */}
        <div className="p-4 sm:p-5 border-t border-zinc-800 bg-zinc-900">
          <h2
            id="modal-gadget-title"
            className="text-base sm:text-lg font-bold text-zinc-100 mb-1"
          >
            {product.name}
          </h2>

          {description && (
            <p className="text-xs text-zinc-400 line-clamp-2 mb-3">
              {description}
            </p>
          )}

          {/* RAM & Storage minimal badges */}
          {(ram || storage) && (
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-300 mb-4">
              {ram && (
                <span className="bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700/60 text-[11px]">
                  RAM: {ram}
                </span>
              )}
              {storage && (
                <span className="bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700/60 text-[11px]">
                  Storage: {storage}
                </span>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-2 border-t border-zinc-800/80">
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline flex-1"
            >
              <DuoButton
                variant="green"
                size="md"
                fullWidth
                icon={<MessageCircle className="w-4 h-4 fill-white" />}
              >
                Chat WA
              </DuoButton>
            </a>

            <DuoButton variant="white" size="md" onClick={onClose}>
              Tutup
            </DuoButton>
          </div>
        </div>
      </div>
    </div>
  );
}
