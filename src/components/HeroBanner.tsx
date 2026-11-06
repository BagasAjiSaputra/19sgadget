import React from "react";
import { Sparkles, Truck, CheckCircle2, Zap } from "lucide-react";

export function HeroBanner() {
  return (
    <div className="w-full mb-8">
      {/* Duolingo Quest Style Container */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#58CC02] to-[#46A302] p-6 sm:p-8 border-4 border-[#358200] border-b-8 text-white shadow-lg">
        {/* Playful background decorative shapes */}
        <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/10 blur-xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-emerald-400/20 blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Left Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 text-xs sm:text-sm font-black uppercase tracking-wider mb-3">
              <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
              <span>Promo Spesial 19s Gadget x Duolingo Style</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-3">
              Level Up Gadget Impianmu!
            </h1>

            <p className="text-emerald-100 font-bold text-sm sm:text-base max-w-2xl mb-6">
              Katalog smartphone flagship, tablet produktivitas, dan laptop performa tinggi.
              Semua produk 100% original, BNIB, bergaransi resmi, dan didukung penyimpanan gambar Supabase Storage.
            </p>

            {/* Duolingo Quest Progress Bar */}
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border-2 border-white/20 max-w-lg mx-auto lg:mx-0">
              <div className="flex items-center justify-between text-xs font-black uppercase mb-1.5 text-emerald-100">
                <span>Misi Hari Ini: Pilih Gadget Favorit</span>
                <span className="text-amber-300 font-black">+250 XP GADGET</span>
              </div>
              <div className="w-full h-4 bg-emerald-950/30 rounded-full overflow-hidden p-0.5 border border-white/20">
                <div
                  className="h-full bg-gradient-to-r from-[#FFC800] to-[#FFA000] rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: "85%" }}
                />
              </div>
              <p className="text-[11px] text-emerald-100 font-semibold mt-1">
                85% Kupon Diskon & Gratis Ongkir Telah Diklaim Pembeli Hari Ini!
              </p>
            </div>
          </div>

          {/* Right Mascot / Benefit Cards */}
          <div className="w-full lg:w-80 flex flex-col gap-3">
            {/* Mascot Speech Card */}
            <div className="bg-white rounded-2xl p-4 border-2 border-slate-200 border-b-4 text-slate-800 shadow-md">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  19s
                </div>
                <div>
                  <div className="text-xs font-black text-[#58CC02] uppercase tracking-wider">
                    Duo Gadget Assistant
                  </div>
                  <p className="text-xs font-bold text-slate-600 mt-0.5">
                    &quot;Cari yang pas buat kamu! Ada Handphone kamera pro, Tablet buat nugas, sampai Laptop gaming beast.&quot;
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Benefits Pills */}
            <div className="grid grid-cols-2 gap-2 text-xs font-extrabold">
              <div className="bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-xl p-2.5 flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-300 shrink-0" />
                <span>Gratis Ongkir</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-xl p-2.5 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
                <span>100% BNIB</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

