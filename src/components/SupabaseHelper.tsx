"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Database,
  CheckCircle,
  AlertCircle,
  Copy,
  Check,
  FolderArchive,
  RefreshCw,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { DuoButton } from "./ui/DuoButton";

interface SupabaseHelperProps {
  isOpen: boolean;
  onClose: () => void;
  onSeedSuccess?: () => void;
}

interface SupabaseStatus {
  connected: boolean;
  supabaseUrl: string;
  storageBucket: string;
  bucketFound: boolean;
  imagesInBucket: number;
  tableExists: boolean;
  tableError?: string | null;
  totalProductsInDb?: number;
}

export function SupabaseHelper({
  isOpen,
  onClose,
  onSeedSuccess,
}: SupabaseHelperProps) {
  const [status, setStatus] = useState<SupabaseStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [copied, setCopied] = useState(false);
  const [seedResult, setSeedResult] = useState<string | null>(null);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/supabase-status");
      const data = await res.json();
      setStatus(data);
    } catch (err) {
      console.error("Failed to check status", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
    }
  }, [isOpen]);

  const handleCopySql = async () => {
    try {
      const sqlText = `-- Jalankan SQL ini di Supabase Dashboard -> SQL Editor:
-- File lengkap tersedia di: supabase/19sgadget_schema.sql

CREATE TABLE IF NOT EXISTS public."19sgadget_categories" (
    id TEXT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50) NOT NULL,
    description TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public."19sgadget_products" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id TEXT NOT NULL REFERENCES public."19sgadget_categories"(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    brand VARCHAR(100) NOT NULL,
    price BIGINT NOT NULL,
    original_price BIGINT,
    discount_percent INT DEFAULT 0,
    image_url TEXT NOT NULL,
    specs JSONB NOT NULL DEFAULT '{}'::jsonb,
    stock INT NOT NULL DEFAULT 5,
    condition VARCHAR(50) DEFAULT 'Baru (BNIB)',
    badge VARCHAR(50),
    rating NUMERIC(3, 1) DEFAULT 4.9,
    review_count INT DEFAULT 18,
    warranty VARCHAR(100) DEFAULT '1 Tahun Garansi Resmi',
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public."19sgadget_categories" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."19sgadget_products" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read 19sgadget_categories" ON public."19sgadget_categories" FOR SELECT USING (true);
CREATE POLICY "Allow public read 19sgadget_products" ON public."19sgadget_products" FOR SELECT USING (true);
`;
      await navigator.clipboard.writeText(sqlText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  const handleSeed = async () => {
    setSeeding(true);
    setSeedResult(null);
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setSeedResult(`Berhasil: ${data.message}`);
        fetchStatus();
        if (onSeedSuccess) onSeedSuccess();
      } else {
        setSeedResult(`Gagal: ${data.error || "Gagal melakukan seed"}`);
      }
    } catch (err: unknown) {
      setSeedResult(`Terjadi error: ${err instanceof Error ? err.message : "Gagal terhubung"}`);
    } finally {
      setSeeding(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-3xl border-4 border-slate-200 border-b-8 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b-2 border-slate-200">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-black text-slate-800">
              Supabase Status & Schema Helper (Awalan: 19sgadget_)
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup jendela"
            className="w-9 h-9 rounded-xl bg-white border-2 border-slate-200 border-b-4 hover:border-slate-300 text-slate-600 flex items-center justify-center font-bold active:border-b-2 active:translate-y-[2px] transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Status Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Storage Bucket Status */}
            <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black uppercase text-slate-500 flex items-center gap-1.5">
                  <FolderArchive className="w-4 h-4 text-sky-500" /> Supabase Storage
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-700">
                  Ready
                </span>
              </div>
              <div className="text-sm font-black text-slate-800">
                Bucket: <code className="text-[#58CC02]">19sgadget_products</code>
              </div>
              <p className="text-xs text-slate-500 font-bold mt-1">
                Tersimpan {status?.imagesInBucket || 12} file foto produk gadget asli siap saji.
              </p>
            </div>

            {/* Database Table Status */}
            <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black uppercase text-slate-500 flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-purple-500" /> Supabase Table
                </span>
                {status?.tableExists ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-700 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Aktif
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-800 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Perlu SQL
                  </span>
                )}
              </div>
              <div className="text-sm font-black text-slate-800">
                Tabel: <code className="text-[#1CB0F6]">19sgadget_products</code>
              </div>
              <p className="text-xs text-slate-500 font-bold mt-1">
                {status?.tableExists
                  ? "Tabel ditemukan di database Supabase."
                  : "Aplikasi otomatis memakai fallback data lokal sampai tabel dibuat."}
              </p>
            </div>
          </div>

          {/* Instruksi SQL */}
          <div className="p-5 rounded-2xl bg-sky-50 border-2 border-sky-200 text-slate-800">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-black text-sky-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-sky-600" /> File Schema SQL
              </h3>
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-black text-sky-700 hover:underline flex items-center gap-1"
              >
                Buka Supabase Dashboard <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-xs font-bold text-sky-800 mb-3">
              Schema lengkap sudah dibuatkan di file{" "}
              <code className="bg-sky-200/70 px-1.5 py-0.5 rounded font-mono font-bold text-sky-950">
                supabase/19sgadget_schema.sql
              </code>
              . Salin SQL tersebut dan jalankan di Supabase Dashboard bagian <b>SQL Editor</b>.
            </p>

            <div className="flex flex-wrap gap-2">
              <DuoButton
                variant={copied ? "green" : "blue"}
                size="sm"
                onClick={handleCopySql}
                icon={copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              >
                {copied ? "SQL Disalin ke Clipboard!" : "Salin Cuplikan SQL"}
              </DuoButton>

              <DuoButton
                variant="white"
                size="sm"
                onClick={fetchStatus}
                disabled={loading}
                icon={<RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />}
              >
                Cek Ulang Status
              </DuoButton>
            </div>
          </div>

          {/* Seed Action */}
          <div className="p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-200">
            <h3 className="text-sm font-black text-emerald-900 mb-1">
              Isi Data Otomatis (Seed) ke Supabase
            </h3>
            <p className="text-xs font-bold text-emerald-800 mb-3">
              Setelah menjalankan skrip SQL di Supabase, klik tombol di bawah untuk memasukkan 12 gadget awal langsung ke tabel Supabase menggunakan Service Role.
            </p>

            <DuoButton
              variant="green"
              size="md"
              onClick={handleSeed}
              disabled={seeding}
              icon={<Sparkles className="w-4 h-4" />}
            >
              {seeding ? "Memproses Seed..." : "Jalankan Seed 12 Gadget ke Supabase"}
            </DuoButton>

            {seedResult && (
              <div className="mt-3 p-3 rounded-xl bg-white border-2 border-emerald-300 text-xs font-bold text-slate-800">
                {seedResult}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t-2 border-slate-200 flex justify-end">
          <DuoButton variant="white" size="sm" onClick={onClose}>
            Tutup
          </DuoButton>
        </div>
      </div>
    </div>
  );
}

