import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import crypto from "crypto";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin19s";

function isAuthorized(token?: string): boolean {
  if (!token) return false;
  const expectedToken = crypto
    .createHash("sha256")
    .update(`${ADMIN_PASSWORD}_19sgadget_salt_2026`)
    .digest("hex");
  return token === expectedToken;
}

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    "";
  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}

// GET all products (Accessible for catalog & admin)
export async function GET() {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("19sgadget_products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(
    { products: data || [] },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    }
  );
}

// POST create new product (Protected)
export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_session")?.value;
    if (!isAuthorized(token)) {
      return NextResponse.json({ error: "Sesi tidak valid / belum login" }, { status: 401 });
    }

    const body = await req.json();
    const supabase = getSupabase();

    const {
      name,
      category_id,
      brand,
      price,
      original_price,
      image_url,
      specs,
      stock,
      condition,
      badge,
      warranty,
    } = body;

    if (!name || !category_id || !brand || !image_url) {
      return NextResponse.json(
        { error: "Nama, Kategori, Brand, dan Gambar wajib diisi." },
        { status: 400 }
      );
    }

    // Generate unique slug
    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    const productPrice = price !== undefined && price !== null ? Number(price) : 0;
    const discountPercent =
      original_price && Number(original_price) > productPrice
        ? Math.round(((Number(original_price) - productPrice) / Number(original_price)) * 100)
        : 0;

    const { data, error } = await supabase
      .from("19sgadget_products")
      .insert([
        {
          name,
          slug,
          category_id,
          brand,
          price: productPrice,
          original_price: original_price ? Number(original_price) : null,
          discount_percent: discountPercent,
          image_url,
          specs: specs || {},
          stock: stock !== undefined ? Number(stock) : 5,
          condition: condition || "Baru (BNIB)",
          badge: badge || null,
          warranty: warranty || "1 Tahun Garansi Resmi",
          rating: 5.0,
          review_count: 1,
          is_featured: false,
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, product: data });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Terjadi kesalahan internal" },
      { status: 500 }
    );
  }
}

// PUT / PATCH update product (Protected)
export async function PUT(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_session")?.value;
    if (!isAuthorized(token)) {
      return NextResponse.json({ error: "Sesi tidak valid / belum login" }, { status: 401 });
    }

    const body = await req.json();
    const {
      id,
      name,
      category_id,
      brand,
      price,
      original_price,
      image_url,
      specs,
      stock,
      condition,
      badge,
      warranty,
    } = body;

    if (!id) {
      return NextResponse.json({ error: "ID produk wajib diisi" }, { status: 400 });
    }

    const supabase = getSupabase();
    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (name !== undefined) updates.name = name;
    if (category_id !== undefined) updates.category_id = category_id;
    if (brand !== undefined) updates.brand = brand;
    if (price !== undefined) updates.price = Number(price);
    if (original_price !== undefined) {
      updates.original_price = original_price ? Number(original_price) : null;
      if (price !== undefined && original_price && Number(original_price) > Number(price)) {
        updates.discount_percent = Math.round(
          ((Number(original_price) - Number(price)) / Number(original_price)) * 100
        );
      } else {
        updates.discount_percent = 0;
      }
    }
    if (image_url !== undefined) updates.image_url = image_url;
    if (specs !== undefined) updates.specs = specs;
    if (stock !== undefined) updates.stock = Number(stock);
    if (condition !== undefined) updates.condition = condition;
    if (badge !== undefined) updates.badge = badge || null;
    if (warranty !== undefined) updates.warranty = warranty;

    const { data, error } = await supabase
      .from("19sgadget_products")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, product: data });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Gagal memperbarui produk" },
      { status: 500 }
    );
  }
}

// DELETE product by id (Protected)
export async function DELETE(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_session")?.value;
    if (!isAuthorized(token)) {
      return NextResponse.json({ error: "Sesi tidak valid / belum login" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID produk tidak diberikan" }, { status: 400 });
    }

    const supabase = getSupabase();
    const { error } = await supabase.from("19sgadget_products").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Produk berhasil dihapus" });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Gagal menghapus produk" },
      { status: 500 }
    );
  }
}
