import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { INITIAL_PRODUCTS } from "@/data/initialProducts";

export async function POST() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  if (!url || !serviceKey) {
    return NextResponse.json(
      { error: "SUPABASE_SERVICE_ROLE_KEY is required for seeding" },
      { status: 500 }
    );
  }

  const supabase = createClient(url, serviceKey);

  // 1. Insert categories
  const categories = [
    {
      id: "handphone",
      name: "Handphone",
      icon: "Smartphone",
      description: "Smartphone flagship & mid-range pilihan terbaik",
      display_order: 1,
    },
    {
      id: "tablet",
      name: "Tablet",
      icon: "Tablet",
      description: "Tablet multifungsi untuk produktivitas & hiburan",
      display_order: 2,
    },
    {
      id: "laptop",
      name: "Laptop",
      icon: "Laptop",
      description: "Laptop performa tinggi untuk kerja, kuliah & gaming",
      display_order: 3,
    },
  ];

  const { error: catError } = await supabase
    .from("19sgadget_categories")
    .upsert(categories, { onConflict: "id" });

  if (catError) {
    return NextResponse.json(
      {
        error: "Gagal menyimpan categories. Pastikan tabel 19sgadget_categories sudah dibuat di SQL Editor.",
        details: catError.message,
      },
      { status: 400 }
    );
  }

  // 2. Insert products
  const productsToInsert = INITIAL_PRODUCTS.map((p) => ({
    category_id: p.category_id,
    name: p.name,
    slug: p.slug,
    brand: p.brand,
    price: p.price,
    original_price: p.original_price,
    discount_percent: p.discount_percent,
    image_url: p.image_url,
    specs: p.specs,
    stock: p.stock,
    condition: p.condition,
    badge: p.badge,
    rating: p.rating,
    review_count: p.review_count,
    warranty: p.warranty,
    is_featured: p.is_featured,
  }));

  const { data: inserted, error: prodError } = await supabase
    .from("19sgadget_products")
    .upsert(productsToInsert, { onConflict: "slug" })
    .select();

  if (prodError) {
    return NextResponse.json(
      {
        error: "Gagal menyimpan products. Pastikan tabel 19sgadget_products sudah dibuat di SQL Editor.",
        details: prodError.message,
      },
      { status: 400 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Berhasil melakukan seed 12 produk ke tabel 19sgadget_products!",
    count: inserted?.length || 0,
  });
}

