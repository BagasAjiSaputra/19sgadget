"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { GadgetProduct } from "../types/gadget";
import {
  X,
  Star,
  Shield,
  Truck,
  RotateCcw,
  CheckCircle2,
  MessageCircle,
  Cpu,
  HardDrive,
  Monitor,
  Battery,
  Camera,
  Layers,
  Sparkles,
  Info,
} from "lucide-react";
import { DuoButton } from "./ui/DuoButton";

interface ProductDetailModalProps {
  product: GadgetProduct | null;
  onClose: () => void;
}

export function ProductDetailModal({ product, onClose }: ProductDetailModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (product) {
      setSelectedColor(product.specs.color || "Default");
      setQuantity(1);
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

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const cleanBadge = product.badge
    ? product.badge.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, "").trim()
    : null;

  const getWhatsAppOrderLink = () => {
    const totalPrice = product.price * quantity;
    const priceText = product.price > 0 ? formatRupiah(totalPrice) : "Tanya via WA / Nego";
    const message = encodeURIComponent(
      `Halo 19s Gadget, saya ingin tanya/pesan unit berikut:\n\n` +
      `Nama Produk: ${product.name}\n` +
      `Brand: ${product.brand}\n` +
      `Kategori: ${product.category_id.toUpperCase()}\n` +
      `Varian Warna: ${selectedColor}\n` +
      `Jumlah: ${quantity} Unit\n` +
      `Harga: ${priceText}\n` +
      `Garansi: ${product.warranty}\n\n` +
      `Apakah unit ini masih ready stock? Terima kasih.`
    );
    return `https://wa.me/6285176954992?text=${message}`;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-gadget-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={dialogRef}
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-zinc-900 border-4 border-zinc-800 border-b-8 rounded-3xl shadow-2xl overflow-hidden text-zinc-100"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/60">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-xs font-black uppercase text-zinc-400 tracking-wider">
              {product.brand} • {product.category_id}
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Tutup jendela detail"
            className="w-9 h-9 rounded-xl bg-zinc-800 border-2 border-zinc-700 hover:border-zinc-600 text-zinc-300 flex items-center justify-center font-black active:translate-y-[1px] transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Left: Product Image */}
            <div className="flex flex-col gap-4">
              <div className="relative aspect-square w-full rounded-3xl bg-zinc-950 border-2 border-zinc-800 p-8 flex items-center justify-center overflow-hidden">
                {cleanBadge && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-zinc-900 text-emerald-400 border border-emerald-500/40 shadow-sm">
                      {cleanBadge}
                    </span>
                  </div>
                )}
                <Image
                  src={product.image_url}
                  alt={product.name}
                  width={500}
                  height={500}
                  className="object-contain max-h-full w-auto drop-shadow-md"
                  priority
                />
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-zinc-950/70 border border-zinc-800 rounded-2xl p-2.5 text-center">
                  <Shield className="w-4 h-4 mx-auto text-emerald-400 mb-1" />
                  <div className="text-[10px] font-black uppercase text-zinc-300">Garansi Resmi</div>
                  <div className="text-[10px] text-zinc-500 font-bold">100% Original</div>
                </div>
                <div className="bg-zinc-950/70 border border-zinc-800 rounded-2xl p-2.5 text-center">
                  <Truck className="w-4 h-4 mx-auto text-sky-400 mb-1" />
                  <div className="text-[10px] font-black uppercase text-zinc-300">Free Ongkir</div>
                  <div className="text-[10px] text-zinc-500 font-bold">Asuransi Penuh</div>
                </div>
                <div className="bg-zinc-950/70 border border-zinc-800 rounded-2xl p-2.5 text-center">
                  <RotateCcw className="w-4 h-4 mx-auto text-amber-400 mb-1" />
                  <div className="text-[10px] font-black uppercase text-zinc-300">Retur 7 Hari</div>
                  <div className="text-[10px] text-zinc-500 font-bold">Cacat Pabrik</div>
                </div>
              </div>
            </div>

            {/* Right: Info & Specs */}
            <div className="flex flex-col gap-5">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-black uppercase bg-sky-500/10 text-sky-400 border border-sky-500/20">
                    {product.brand}
                  </span>
                  <div className="flex items-center gap-1 text-amber-400 font-extrabold text-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{product.rating.toFixed(1)}</span>
                    <span className="text-zinc-500 font-medium">({product.review_count} review)</span>
                  </div>
                </div>

                <h2
                  id="modal-gadget-title"
                  className="text-2xl sm:text-3xl font-black text-zinc-100 leading-snug"
                >
                  {product.name}
                </h2>

                <p className="text-sm text-zinc-300 leading-relaxed mt-2">
                  {product.specs?.description || product.description || `${product.brand} ${product.category_id} original bergaransi resmi.`}
                </p>

                <div className="mt-4 p-4 rounded-2xl bg-zinc-950 border-2 border-zinc-800 flex items-baseline justify-between">
                  <div>
                    {product.original_price && product.original_price > product.price && (
                      <div className="text-xs font-bold text-zinc-500 line-through">
                        {formatRupiah(product.original_price)}
                      </div>
                    )}
                    <div className="text-2xl sm:text-3xl font-black text-emerald-400">
                      {product.price > 0 ? formatRupiah(product.price) : "Hubungi Kami (Nego)"}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-black uppercase">
                      Ready Stock
                    </span>
                    <div className="text-[11px] font-bold text-zinc-400 mt-1">
                      Tersedia {product.stock} unit
                    </div>
                  </div>
                </div>
              </div>

              {/* Color Selection */}
              {product.specs.color && (
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-zinc-400 mb-2">
                    Varian Warna: <span className="text-zinc-200 font-black">{selectedColor}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[product.specs.color].map((clr) => (
                      <button
                        key={clr}
                        onClick={() => setSelectedColor(clr)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                          selectedColor === clr
                            ? "bg-zinc-800 text-zinc-100 border-emerald-500"
                            : "bg-zinc-950 text-zinc-400 border-zinc-800"
                        }`}
                      >
                        {clr}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-zinc-400 mb-2">
                  Jumlah Pesanan
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center rounded-2xl border-2 border-zinc-700 bg-zinc-950 overflow-hidden">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className="px-4 py-2 font-black text-lg text-zinc-300 hover:bg-zinc-800 disabled:opacity-30 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 font-black text-sm text-zinc-100 select-none">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                      disabled={quantity >= product.stock}
                      className="px-4 py-2 font-black text-lg text-zinc-300 hover:bg-zinc-800 disabled:opacity-30 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs font-bold text-zinc-500">
                    Maks. {product.stock} unit per pesanan
                  </span>
                </div>
              </div>

              {/* Minimal Info Note */}
              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-3.5 flex items-start gap-3">
                <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-xs font-bold text-zinc-400">
                  Semua gadget bergaransi resmi. Klik tombol WhatsApp di bawah untuk konsultasi spek, negosiasi, atau cek ketersediaan warna.
                </p>
              </div>
            </div>
          </div>

          {/* Full Specifications Section */}
          <div className="pt-6 border-t border-zinc-800">
            <h3 className="text-base font-black text-zinc-100 mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" /> Spesifikasi Lengkap
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {product.specs.processor && (
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800">
                  <Cpu className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[11px] font-bold text-zinc-500 uppercase">Prosesor / Chipset</div>
                    <div className="text-sm font-black text-zinc-200">{product.specs.processor}</div>
                  </div>
                </div>
              )}

              {product.specs.screen && (
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800">
                  <Monitor className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[11px] font-bold text-zinc-500 uppercase">Layar & Panel</div>
                    <div className="text-sm font-black text-zinc-200">{product.specs.screen}</div>
                  </div>
                </div>
              )}

              {product.specs.ram && (
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800">
                  <HardDrive className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[11px] font-bold text-zinc-500 uppercase">RAM</div>
                    <div className="text-sm font-black text-zinc-200">{product.specs.ram}</div>
                  </div>
                </div>
              )}

              {product.specs.storage && (
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800">
                  <HardDrive className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[11px] font-bold text-zinc-500 uppercase">Penyimpanan (Storage)</div>
                    <div className="text-sm font-black text-zinc-200">{product.specs.storage}</div>
                  </div>
                </div>
              )}

              {product.specs.battery && (
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800">
                  <Battery className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[11px] font-bold text-zinc-500 uppercase">Baterai</div>
                    <div className="text-sm font-black text-zinc-200">{product.specs.battery}</div>
                  </div>
                </div>
              )}

              {product.specs.camera && (
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800">
                  <Camera className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[11px] font-bold text-zinc-500 uppercase">Kamera</div>
                    <div className="text-sm font-black text-zinc-200">{product.specs.camera}</div>
                  </div>
                </div>
              )}

              {product.specs.gpu && (
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800">
                  <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[11px] font-bold text-zinc-500 uppercase">GPU / Grafis</div>
                    <div className="text-sm font-black text-zinc-200">{product.specs.gpu}</div>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] font-bold text-zinc-500 uppercase">Garansi & Kondisi</div>
                  <div className="text-sm font-black text-zinc-200">
                    {product.condition} • {product.warranty}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bar */}
        <div className="px-6 py-4 bg-zinc-950 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-zinc-500">
              {product.price > 0 ? `Total Harga (${quantity} Unit):` : "Harga Unit:"}
            </div>
            <div className="text-2xl font-black text-zinc-100">
              {product.price > 0 ? formatRupiah(product.price * quantity) : "Tanya via WA / Nego"}
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <DuoButton variant="white" size="md" onClick={onClose}>
              Tutup
            </DuoButton>

            <a
              href={getWhatsAppOrderLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline flex-1 sm:flex-initial"
            >
              <DuoButton
                variant="green"
                size="md"
                fullWidth
                icon={<MessageCircle className="w-4 h-4 fill-white" />}
              >
                Pesan via WhatsApp
              </DuoButton>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
