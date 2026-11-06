import { createClient } from "@supabase/supabase-js";
import { GadgetProduct } from "../types/gadget";
import { INITIAL_PRODUCTS } from "../data/initialProducts";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://kycdtpppomsvfydovwrl.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  "";

// Client for browser / public actions
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface FetchProductsResult {
  products: GadgetProduct[];
  isUsingFallback: boolean;
  error?: string | null;
}

/**
 * Fetch products from Supabase table `19sgadget_products`.
 * If the table has not yet been migrated in Supabase SQL editor,
 * gracefully fallback to initial mock data.
 */
export async function getGadgetProducts(): Promise<FetchProductsResult> {
  try {
    const { data, error } = await supabase
      .from("19sgadget_products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return {
        products: INITIAL_PRODUCTS,
        isUsingFallback: true,
        error: error ? error.message : null,
      };
    }

    return {
      products: data as GadgetProduct[],
      isUsingFallback: false,
    };
  } catch (err) {
    return {
      products: INITIAL_PRODUCTS,
      isUsingFallback: true,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

/**
 * Returns public URL of an image stored in Supabase Storage bucket 19sgadget_products
 */
export function getGadgetImageUrl(pathOrUrl: string): string {
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl;
  }
  const cleanPath = pathOrUrl.replace(/^\/+/, "");
  const { data } = supabase.storage.from("19sgadget_products").getPublicUrl(cleanPath);
  return data.publicUrl;
}

