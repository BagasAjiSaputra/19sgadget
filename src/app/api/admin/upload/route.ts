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

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_session")?.value;
    if (!isAuthorized(token)) {
      return NextResponse.json({ error: "Sesi tidak valid / belum login" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 });
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
    const supabase = createClient(url, serviceKey);

    // Format safe filename
    const ext = file.name.split(".").pop() || "webp";
    const cleanName = file.name
      .replace(/\.[^/.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "-");
    const fileName = `${cleanName}-${Date.now()}.${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    const { data, error } = await supabase.storage
      .from("19sgadget_products")
      .upload(fileName, buffer, {
        contentType: file.type || "image/webp",
        upsert: true,
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: publicUrlData } = supabase.storage
      .from("19sgadget_products")
      .getPublicUrl(data.path);

    return NextResponse.json({
      success: true,
      fileName,
      publicUrl: publicUrlData.publicUrl,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Terjadi kesalahan upload" },
      { status: 500 }
    );
  }
}
