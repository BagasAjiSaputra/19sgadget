"use client";

import React from "react";
import { Flame, Gem, ShieldCheck, MessageCircle, Database } from "lucide-react";
import { DuoButton } from "./ui/DuoButton";

interface NavbarProps {
  onOpenSupabaseHelper: () => void;
  storageReady?: boolean;
}

export function Navbar({ onOpenSupabaseHelper, storageReady = true }: NavbarProps) {
  const adminWhatsAppUrl = "https://wa.me/6285176954992?text=Halo%2019s%20Gadget!%20Saya%20ingin%20tanya%20katalog%20gadget.";

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center border border-emerald-500/30 shadow-sm cursor-pointer select-none">
            19s
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight text-zinc-100">
                19s<span className="text-emerald-400">Gadget</span>
              </span>
            </div>
            <p className="text-xs font-medium text-zinc-400 hidden sm:block">
              Toko Handphone, Tablet & Laptop Original
            </p>
          </div>
        </div>

        {/* Duolingo Gamification Stats (Streak & Gems) */}
        <div className="hidden md:flex items-center gap-3">
          {/* Streak Counter */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-orange-50 border-2 border-orange-200 border-b-4 text-orange-600 font-black text-sm select-none">
            <Flame className="w-5 h-5 fill-orange-500 text-orange-500 animate-pulse" />
            <span>7 HARI PROMO</span>
          </div>

          {/* Gems Counter */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-sky-50 border-2 border-sky-200 border-b-4 text-sky-600 font-black text-sm select-none">
            <Gem className="w-5 h-5 fill-sky-400 text-sky-500" />
            <span>1.250 KOIN</span>
          </div>

          {/* Official Warranty Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-emerald-50 border-2 border-emerald-200 border-b-4 text-emerald-700 font-black text-sm select-none">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>100% RESMI</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2.5">
          {/* Supabase Schema / Storage Status button */}
          <button
            onClick={onOpenSupabaseHelper}
            title="Supabase Schema & Storage Helper"
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl border-2 border-slate-200 border-b-4 hover:border-emerald-400 text-slate-700 font-bold text-xs bg-white active:border-b-2 active:translate-y-[2px] transition-all"
          >
            <Database className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">Supabase 19sgadget</span>
            {storageReady && (
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            )}
          </button>

          {/* WhatsApp Chat Button */}
          <a
            href={adminWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline"
          >
            <DuoButton
              variant="green"
              size="sm"
              icon={<MessageCircle className="w-4 h-4 fill-white" />}
            >
              Chat Admin
            </DuoButton>
          </a>
        </div>
      </div>
    </header>
  );
}

