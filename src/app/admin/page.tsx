"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Edit3,
  Upload,
  RefreshCw,
  Package,
  Layers,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Tablet,
  Laptop,
  Lock,
  LogOut,
  Eye,
  EyeOff,
  X,
  Shield,
  Loader2,
} from "lucide-react";
import { DuoButton } from "@/components/ui/DuoButton";
import { GadgetProduct } from "@/types/gadget";

export default function AdminPage() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Products state
  const [products, setProducts] = useState<GadgetProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"list" | "create">("list");

  // Create Form State (Kategori, Nama, Brand, Gambar, Deskripsi, RAM, Storage)
  const [categoryId, setCategoryId] = useState<"handphone" | "tablet" | "laptop">("handphone");
  const [brand, setBrand] = useState("");
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [ram, setRam] = useState("");
  const [storage, setStorage] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  // Edit Modal State
  const [editingProduct, setEditingProduct] = useState<GadgetProduct | null>(null);
  const [editCategoryId, setEditCategoryId] = useState<"handphone" | "tablet" | "laptop">("handphone");
  const [editBrand, setEditBrand] = useState("");
  const [editName, setEditName] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editRam, setEditRam] = useState("");
  const [editStorage, setEditStorage] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  // Status feedback
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/admin/auth");
      const data = await res.json();
      setIsAuthenticated(data.authenticated === true);
      if (data.authenticated) {
        fetchProducts();
      }
    } catch {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passwordInput }),
      });

      const data = await res.json();
      if (res.ok) {
        setIsAuthenticated(true);
        setPasswordInput("");
        fetchProducts();
      } else {
        setAuthError(data.error || "Password salah. Silakan coba lagi.");
      }
    } catch {
      setAuthError("Gagal menghubungi server");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    setIsAuthenticated(false);
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      if (res.ok) {
        setProducts(data.products || []);
      }
    } catch {
      setStatusMessage({ type: "error", text: "Gagal mengambil daftar produk dari database." });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isEditMode = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.publicUrl) {
        if (isEditMode) {
          setEditImageUrl(data.publicUrl);
        } else {
          setImageUrl(data.publicUrl);
        }
        setStatusMessage({ type: "success", text: "Gambar berhasil diunggah ke Supabase Storage" });
      } else {
        setStatusMessage({ type: "error", text: `Gagal upload gambar: ${data.error}` });
      }
    } catch {
      setStatusMessage({ type: "error", text: "Gagal terhubung ke endpoint upload" });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !brand || !imageUrl) {
      setStatusMessage({ type: "error", text: "Kategori, Brand, Nama, dan Foto wajib diisi." });
      return;
    }

    setSubmitting(true);
    setStatusMessage(null);

    const specs: Record<string, string> = {};
    if (description) specs.description = description;
    if (ram) specs.ram = ram;
    if (storage) specs.storage = storage;

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category_id: categoryId,
          brand,
          name,
          image_url: imageUrl,
          specs,
          price: 0,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatusMessage({ type: "success", text: `Gadget "${name}" berhasil ditambahkan.` });
        setName("");
        setBrand("");
        setImageUrl("");
        setDescription("");
        setRam("");
        setStorage("");
        fetchProducts();
        setActiveTab("list");
      } else {
        setStatusMessage({ type: "error", text: data.error || "Gagal menyimpan produk." });
      }
    } catch (err: unknown) {
      setStatusMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan produk.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (prod: GadgetProduct) => {
    setEditingProduct(prod);
    setEditCategoryId(prod.category_id);
    setEditBrand(prod.brand);
    setEditName(prod.name);
    setEditImageUrl(prod.image_url);
    setEditDescription(prod.specs?.description || prod.description || "");
    setEditRam(prod.specs?.ram || "");
    setEditStorage(prod.specs?.storage || "");
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setSavingEdit(true);
    setStatusMessage(null);

    const specs: Record<string, string | undefined> = { ...editingProduct.specs };
    specs.description = editDescription;
    specs.ram = editRam;
    specs.storage = editStorage;

    try {
      const res = await fetch("/api/admin/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingProduct.id,
          category_id: editCategoryId,
          brand: editBrand,
          name: editName,
          image_url: editImageUrl,
          specs,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatusMessage({ type: "success", text: `Perubahan "${editName}" berhasil disimpan.` });
        setEditingProduct(null);
        fetchProducts();
      } else {
        setStatusMessage({ type: "error", text: data.error || "Gagal mengupdate produk" });
      }
    } catch {
      setStatusMessage({ type: "error", text: "Terjadi kesalahan saat menyimpan perubahan" });
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDeleteProduct = async (id: string, prodName: string) => {
    if (!confirm(`Hapus gadget "${prodName}"?`)) return;

    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setStatusMessage({ type: "success", text: `Gadget "${prodName}" berhasil dihapus.` });
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        const data = await res.json();
        setStatusMessage({ type: "error", text: data.error || "Gagal menghapus produk" });
      }
    } catch {
      setStatusMessage({ type: "error", text: "Terjadi kesalahan koneksi" });
    }
  };

  // ==========================================
  // 1. LOGIN GATE SCREEN (DARK MINIMALIST)
  // ==========================================
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400">
        <div className="text-center">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-emerald-500 mb-2" />
          <div className="text-xs font-bold">Memeriksa Akses Admin...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-4 font-sans">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase text-zinc-500 hover:text-zinc-300 mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Katalog
        </Link>

        <div className="w-full max-w-sm bg-zinc-900 rounded-2xl border border-zinc-800 p-8 shadow-2xl">
          <div className="text-center mb-6">
            <div className="h-14 mx-auto flex items-center justify-center mb-3">
              <Image
                src="/logo-white.png"
                alt="19s Gadget Logo"
                width={140}
                height={50}
                className="h-11 w-auto object-contain"
                priority
              />
            </div>
            <h1 className="text-xl font-black text-zinc-100">
              Admin Portal
            </h1>
            <p className="text-xs font-medium text-zinc-400 mt-1">
              Masukkan password admin untuk mengakses dashboard
            </p>
          </div>

          {authError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-400 mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-zinc-500" />
                Password Admin
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Ketik password admin..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-emerald-500 text-sm font-bold text-zinc-100 outline-none transition-all pr-10"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-3 text-zinc-500 hover:text-zinc-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <DuoButton
              type="submit"
              variant="green"
              size="md"
              fullWidth
              disabled={authLoading}
              icon={<Lock className="w-3.5 h-3.5" />}
            >
              {authLoading ? "Memverifikasi..." : "Masuk Dashboard"}
            </DuoButton>
          </form>

          <div className="mt-6 pt-4 border-t border-zinc-800/80 text-center">
            <span className="text-[11px] font-medium text-zinc-500">
              Password default: <code className="text-emerald-400 font-mono">admin19s</code>
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // 2. PROTECTED ADMIN DASHBOARD (SIMPLIFIED)
  // ==========================================
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans pb-16 selection:bg-emerald-500 selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 flex items-center justify-center font-bold transition-all"
              title="Kembali ke Katalog"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2">
              <Image
                src="/logo-white.png"
                alt="19s Gadget Logo"
                width={110}
                height={35}
                className="h-7 w-auto object-contain"
              />
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                Admin
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/" className="no-underline hidden sm:block">
              <DuoButton variant="white" size="sm">
                Lihat Katalog
              </DuoButton>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
              title="Keluar dari Admin"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 mt-6">
        {/* Status Message */}
        {statusMessage && (
          <div
            className={`mb-6 p-3.5 rounded-xl border flex items-center justify-between ${
              statusMessage.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                : "bg-rose-500/10 border-rose-500/20 text-rose-300"
            }`}
          >
            <div className="flex items-center gap-2 text-xs font-bold">
              {statusMessage.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
            <button
              onClick={() => setStatusMessage(null)}
              className="text-xs font-bold uppercase underline ml-2 cursor-pointer text-zinc-400"
            >
              Tutup
            </button>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="flex items-center gap-2.5 mb-6">
          <button
            onClick={() => setActiveTab("list")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider border transition-all cursor-pointer ${
              activeTab === "list"
                ? "bg-zinc-800 text-zinc-100 border-emerald-500 shadow-sm"
                : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200"
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Daftar Gadget ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("create")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider border transition-all cursor-pointer ${
              activeTab === "create"
                ? "bg-zinc-800 text-zinc-100 border-sky-500 shadow-sm"
                : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200"
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Gadget</span>
          </button>

          <button
            onClick={fetchProducts}
            disabled={loading}
            className="ml-auto w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 flex items-center justify-center font-bold transition-all cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* ========================================================
            TAB 1: DAFTAR PRODUK (Kategori, Nama, Brand, Gambar, Deskripsi, RAM, Storage)
           ======================================================== */}
        {activeTab === "list" && (
          <div className="space-y-3">
            {loading ? (
              <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-12 text-center text-zinc-400">
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-emerald-400 mb-2" />
                <div className="text-xs font-bold">Memuat data dari database...</div>
              </div>
            ) : products.length === 0 ? (
              <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-12 text-center">
                <Package className="w-10 h-10 text-zinc-600 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-zinc-300 mb-1">Belum Ada Gadget</h3>
                <p className="text-xs text-zinc-500 mb-4">
                  Daftar gadget masih kosong. Tambahkan gadget pertama sekarang.
                </p>
                <DuoButton variant="blue" size="sm" onClick={() => setActiveTab("create")}>
                  Tambah Gadget Baru
                </DuoButton>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2.5">
                {products.map((item) => (
                  <div
                    key={item.id}
                    className="bg-zinc-900 rounded-2xl border border-zinc-800 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-zinc-700 transition-all"
                  >
                    <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                      {/* 1. Gambar */}
                      <div className="w-16 h-16 rounded-xl bg-zinc-950 border border-zinc-800 p-2 flex items-center justify-center shrink-0 overflow-hidden">
                        <Image
                          src={item.image_url}
                          alt={item.name}
                          width={64}
                          height={64}
                          className="object-contain max-h-full w-auto"
                        />
                      </div>

                      {/* 2. Kategori, 3. Brand, 4. Nama, 5. Deskripsi, 6. RAM, 7. Storage */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5 text-[11px] font-bold uppercase tracking-wider">
                          <span className="text-emerald-400">{item.category_id}</span>
                          <span className="text-zinc-500">•</span>
                          <span className="text-zinc-400">{item.brand}</span>
                        </div>

                        <h4 className="text-sm font-bold text-zinc-100 truncate">
                          {item.name}
                        </h4>

                        <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5">
                          {item.specs?.description || item.description || "Tidak ada deskripsi"}
                        </p>

                        <div className="flex items-center gap-2 text-xs font-mono text-zinc-300 mt-1.5">
                          <span className="bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700/60 text-[11px]">
                            RAM: {item.specs?.ram || "-"}
                          </span>
                          <span className="bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700/60 text-[11px]">
                            Storage: {item.specs?.storage || "-"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        onClick={() => openEditModal(item)}
                        className="px-3 py-1.5 rounded-xl bg-zinc-800 border border-zinc-700 hover:border-sky-500 text-zinc-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                        title="Edit Gadget"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-sky-400" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDeleteProduct(item.id, item.name)}
                        className="px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-400 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                        title="Hapus Produk"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 2: FORM TAMBAH GADGET (Kategori, Nama, Brand, Gambar, Deskripsi, RAM, Storage)
           ======================================================== */}
        {activeTab === "create" && (
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 sm:p-8">
            <h2 className="text-base font-bold text-zinc-100 mb-6 flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-400" />
              Tambah Gadget Baru
            </h2>

            <form onSubmit={handleCreateProduct} className="space-y-4">
              {/* 1. Kategori & 2. Brand */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1.5">
                    1. Kategori *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["handphone", "tablet", "laptop"] as const).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategoryId(cat)}
                        className={`py-2 rounded-xl text-xs font-bold uppercase flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                          categoryId === cat
                            ? "bg-zinc-800 text-zinc-100 border-emerald-500"
                            : "bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-zinc-300"
                        }`}
                      >
                        {cat === "handphone" && <Smartphone className="w-3.5 h-3.5" />}
                        {cat === "tablet" && <Tablet className="w-3.5 h-3.5" />}
                        {cat === "laptop" && <Laptop className="w-3.5 h-3.5" />}
                        <span>{cat}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1.5">
                    2. Brand / Merek *
                  </label>
                  <input
                    type="text"
                    required
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="Contoh: Apple, Samsung, Xiaomi"
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-emerald-500 text-zinc-100 text-xs font-bold outline-none"
                  />
                </div>
              </div>

              {/* 3. Nama Produk */}
              <div>
                <label className="block text-xs font-bold uppercase text-zinc-400 mb-1.5">
                  3. Nama Gadget *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: iPhone 16 Pro 256GB"
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-emerald-500 text-zinc-100 text-xs font-bold outline-none"
                />
              </div>

              {/* 4. Gambar (Supabase Storage) */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
                <label className="block text-xs font-bold uppercase text-zinc-300 mb-2">
                  4. Foto Produk (Supabase Storage) *
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <label className="w-full sm:w-auto px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-700 hover:border-emerald-500 text-zinc-200 font-bold text-xs uppercase flex items-center justify-center gap-2 cursor-pointer transition-all">
                    <Upload className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{uploadingImage ? "Mengunggah..." : "Pilih File"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, false)}
                      className="hidden"
                      disabled={uploadingImage}
                    />
                  </label>

                  <div className="flex-1 w-full">
                    <input
                      type="text"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="Atau tempel URL gambar..."
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 outline-none"
                    />
                  </div>

                  {imageUrl && (
                    <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                      <Image
                        src={imageUrl}
                        alt="Preview"
                        width={44}
                        height={44}
                        className="object-contain max-h-full"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* 5. Deskripsi */}
              <div>
                <label className="block text-xs font-bold uppercase text-zinc-400 mb-1.5">
                  5. Deskripsi *
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tuliskan deskripsi ringkas gadget ini..."
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-emerald-500 text-zinc-100 text-xs font-medium outline-none resize-none"
                />
              </div>

              {/* 6. RAM & 7. Storage */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1.5">
                    6. RAM
                  </label>
                  <input
                    type="text"
                    value={ram}
                    onChange={(e) => setRam(e.target.value)}
                    placeholder="Contoh: 8GB / 12GB / 16GB"
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-bold text-zinc-200 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1.5">
                    7. Storage
                  </label>
                  <input
                    type="text"
                    value={storage}
                    onChange={(e) => setStorage(e.target.value)}
                    placeholder="Contoh: 256GB / 512GB SSD / 1TB"
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-bold text-zinc-200 outline-none"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center gap-2.5 pt-4 border-t border-zinc-800">
                <DuoButton
                  type="submit"
                  variant="green"
                  size="md"
                  disabled={submitting || uploadingImage}
                  icon={<Plus className="w-3.5 h-3.5" />}
                >
                  {submitting ? "Menyimpan..." : "Simpan Gadget"}
                </DuoButton>

                <DuoButton
                  type="button"
                  variant="white"
                  size="md"
                  onClick={() => setActiveTab("list")}
                >
                  Batal
                </DuoButton>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================
            MODAL EDIT GADGET (Kategori, Nama, Brand, Gambar, Deskripsi, RAM, Storage)
           ======================================================== */}
        {editingProduct && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
            onClick={(e) => {
              if (e.target === e.currentTarget) setEditingProduct(null);
            }}
          >
            <div className="relative w-full max-w-2xl max-h-[90vh] bg-zinc-900 rounded-2xl border border-zinc-800 shadow-2xl flex flex-col overflow-hidden text-zinc-100">
              <div className="flex items-center justify-between px-6 py-4 bg-zinc-950 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-sky-400" />
                  <h3 className="text-sm font-bold text-zinc-100">
                    Edit: <span className="text-sky-400">{editingProduct.name}</span>
                  </h3>
                </div>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 hover:border-zinc-600 text-zinc-400 flex items-center justify-center font-bold transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="flex-1 overflow-y-auto p-6 space-y-4">
                {/* 1. Kategori & 2. Brand */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
                      1. Kategori
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(["handphone", "tablet", "laptop"] as const).map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setEditCategoryId(cat)}
                          className={`py-1.5 rounded-lg text-xs font-bold uppercase border transition-all cursor-pointer ${
                            editCategoryId === cat
                              ? "bg-zinc-800 text-zinc-100 border-sky-500"
                              : "bg-zinc-950 text-zinc-400 border-zinc-800"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
                      2. Brand
                    </label>
                    <input
                      type="text"
                      required
                      value={editBrand}
                      onChange={(e) => setEditBrand(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 focus:border-sky-500 text-xs font-bold text-zinc-100 outline-none"
                    />
                  </div>
                </div>

                {/* 3. Nama */}
                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
                    3. Nama Gadget
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 focus:border-sky-500 text-xs font-bold text-zinc-100 outline-none"
                  />
                </div>

                {/* 4. Gambar */}
                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800">
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-2">
                    4. Foto Produk
                  </label>
                  <div className="flex flex-col sm:flex-row items-center gap-2.5">
                    <label className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 hover:border-sky-500 text-zinc-200 font-bold text-xs uppercase flex items-center gap-1.5 cursor-pointer">
                      <Upload className="w-3.5 h-3.5 text-sky-400" />
                      <span>Ganti File</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, true)}
                        className="hidden"
                        disabled={uploadingImage}
                      />
                    </label>

                    <input
                      type="text"
                      value={editImageUrl}
                      onChange={(e) => setEditImageUrl(e.target.value)}
                      placeholder="URL Gambar..."
                      className="flex-1 w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 outline-none"
                    />

                    {editImageUrl && (
                      <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                        <Image
                          src={editImageUrl}
                          alt="Preview"
                          width={36}
                          height={36}
                          className="object-contain max-h-full"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* 5. Deskripsi */}
                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
                    5. Deskripsi
                  </label>
                  <textarea
                    rows={2}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Deskripsi produk..."
                    className="w-full px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 focus:border-sky-500 text-xs font-medium text-zinc-100 outline-none resize-none"
                  />
                </div>

                {/* 6. RAM & 7. Storage */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
                      6. RAM
                    </label>
                    <input
                      type="text"
                      value={editRam}
                      onChange={(e) => setEditRam(e.target.value)}
                      placeholder="Contoh: 8GB"
                      className="w-full px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-bold text-zinc-100 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
                      7. Storage
                    </label>
                    <input
                      type="text"
                      value={editStorage}
                      onChange={(e) => setEditStorage(e.target.value)}
                      placeholder="Contoh: 256GB"
                      className="w-full px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-bold text-zinc-100 outline-none"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-zinc-800">
                  <DuoButton
                    type="button"
                    variant="white"
                    size="sm"
                    onClick={() => setEditingProduct(null)}
                  >
                    Batal
                  </DuoButton>

                  <DuoButton
                    type="submit"
                    variant="blue"
                    size="sm"
                    disabled={savingEdit}
                    icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                  >
                    {savingEdit ? "Menyimpan..." : "Simpan Perubahan"}
                  </DuoButton>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
