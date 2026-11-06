export type GadgetCategory = 'all' | 'handphone' | 'tablet' | 'laptop';

export interface GadgetSpecs {
  ram?: string;
  storage?: string;
  processor?: string;
  screen?: string;
  battery?: string;
  camera?: string;
  gpu?: string;
  weight?: string;
  stylus?: string;
  audio?: string;
  color?: string;
  description?: string;
  [key: string]: string | undefined;
}

export interface GadgetProduct {
  id: string;
  category_id: 'handphone' | 'tablet' | 'laptop';
  name: string;
  slug: string;
  brand: string;
  price: number;
  original_price?: number;
  discount_percent?: number;
  image_url: string;
  description?: string;
  specs: GadgetSpecs;
  stock: number;
  condition: string;
  badge?: string;
  rating: number;
  review_count: number;
  warranty: string;
  is_featured: boolean;
  created_at?: string;
}

export interface CategoryInfo {
  id: GadgetCategory;
  name: string;
  icon: string;
  color: string;
  borderColor: string;
  count?: number;
}
