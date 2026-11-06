import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "";

  if (!url || !serviceKey) {
    return NextResponse.json({
      connected: false,
      message: "Supabase environment variables missing",
    });
  }

  const supabase = createClient(url, serviceKey);

  // 1. Check storage bucket
  const { data: files, error: storageError } = await supabase.storage
    .from("19sgadget_products")
    .list();

  // 2. Check table 19sgadget_products
  const { data: tableData, error: tableError } = await supabase
    .from("19sgadget_products")
    .select("id")
    .limit(1);

  const tableExists = !tableError;

  return NextResponse.json({
    connected: true,
    supabaseUrl: url,
    storageBucket: "19sgadget_products",
    bucketFound: !storageError,
    imagesInBucket: files?.length || 0,
    tableExists,
    tableError: tableError ? tableError.message : null,
    totalProductsInDb: tableData?.length || 0,
  });
}

