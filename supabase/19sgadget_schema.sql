-- ========================================================
-- 19SGADGET DATABASE SCHEMA & SUPABASE STORAGE SETUP
-- Prefix: 19sgadget_ (Harus memakai tanda kutip ganda "19sgadget_..." karena diawali angka di PostgreSQL)
-- Style: Duolingo Fun & Simple Gadget Catalog
-- ========================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. STORAGE BUCKET CREATION
-- Buat bucket penyimpanan gambar 19sgadget_products jika belum ada
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    '19sgadget_products',
    '19sgadget_products',
    true,
    10485760, -- 10MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Policy: Siapa saja boleh melihat gambar produk
DROP POLICY IF EXISTS "Public 19sgadget Storage Read" ON storage.objects;
CREATE POLICY "Public 19sgadget Storage Read"
ON storage.objects FOR SELECT
USING (bucket_id = '19sgadget_products');

-- Storage Policy: Upload diizinkan untuk authenticated & service role (atau public jika mode demo)
DROP POLICY IF EXISTS "Public 19sgadget Storage Upload" ON storage.objects;
CREATE POLICY "Public 19sgadget Storage Upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = '19sgadget_products');

-- 3. TABLE: "19sgadget_categories"
CREATE TABLE IF NOT EXISTS public."19sgadget_categories" (
    id TEXT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50) NOT NULL,
    description TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TABLE: "19sgadget_products"
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

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_19sgadget_products_cat ON public."19sgadget_products"(category_id);
CREATE INDEX IF NOT EXISTS idx_19sgadget_products_brand ON public."19sgadget_products"(brand);
CREATE INDEX IF NOT EXISTS idx_19sgadget_products_price ON public."19sgadget_products"(price);

-- Enable RLS
ALTER TABLE public."19sgadget_categories" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."19sgadget_products" ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Categories
DROP POLICY IF EXISTS "Allow public read 19sgadget_categories" ON public."19sgadget_categories";
CREATE POLICY "Allow public read 19sgadget_categories"
ON public."19sgadget_categories" FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Allow service full access 19sgadget_categories" ON public."19sgadget_categories";
CREATE POLICY "Allow service full access 19sgadget_categories"
ON public."19sgadget_categories" FOR ALL
TO service_role
USING (true);

-- RLS Policies for Products
DROP POLICY IF EXISTS "Allow public read 19sgadget_products" ON public."19sgadget_products";
CREATE POLICY "Allow public read 19sgadget_products"
ON public."19sgadget_products" FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Allow service full access 19sgadget_products" ON public."19sgadget_products";
CREATE POLICY "Allow service full access 19sgadget_products"
ON public."19sgadget_products" FOR ALL
TO service_role
USING (true);

-- ========================================================
-- 5. SEED DATA DENGAN SUPABASE STORAGE BUCKET URLS
-- ========================================================

-- Insert Categories
INSERT INTO public."19sgadget_categories" (id, name, icon, description, display_order)
VALUES
    ('handphone', 'Handphone', 'Smartphone', 'Smartphone flagship & mid-range pilihan terbaik', 1),
    ('tablet', 'Tablet', 'Tablet', 'Tablet multifungsi untuk produktivitas & hiburan', 2),
    ('laptop', 'Laptop', 'Laptop', 'Laptop performa tinggi untuk kerja, kuliah & gaming', 3)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    icon = EXCLUDED.icon,
    description = EXCLUDED.description,
    display_order = EXCLUDED.display_order;

-- Insert Products
INSERT INTO public."19sgadget_products" (
    category_id, name, slug, brand, price, original_price, discount_percent,
    image_url, specs, stock, condition, badge, rating, review_count, warranty, is_featured
)
VALUES
    -- HANDPHONES
    (
        'handphone',
        'iPhone 16 Pro Max 256GB',
        'iphone-16-pro-max-256gb',
        'Apple',
        23999000,
        25999000,
        8,
        'https://kycdtpppomsvfydovwrl.supabase.co/storage/v1/object/public/19sgadget_products/iphone-16-pro.webp',
        '{"ram": "8GB", "storage": "256GB", "processor": "Apple A18 Pro", "screen": "6.9 Super Retina XDR OLED 120Hz", "battery": "4685 mAh", "camera": "48MP + 48MP + 12MP", "color": "Desert Titanium"}'::jsonb,
        7,
        'Baru (BNIB)',
        '🔥 FLASH SALE',
        5.0,
        142,
        '1 Tahun Garansi Resmi iBox / GDN',
        true
    ),
    (
        'handphone',
        'Samsung Galaxy S24 Ultra 5G',
        'samsung-galaxy-s24-ultra-5g',
        'Samsung',
        19899000,
        21999000,
        10,
        'https://kycdtpppomsvfydovwrl.supabase.co/storage/v1/object/public/19sgadget_products/samsung-s24-ultra.webp',
        '{"ram": "12GB", "storage": "512GB", "processor": "Snapdragon 8 Gen 3 for Galaxy", "screen": "6.8 Dynamic AMOLED 2X 120Hz", "battery": "5000 mAh (45W)", "camera": "200MP + 50MP + 12MP + 10MP", "color": "Titanium Gray"}'::jsonb,
        11,
        'Baru (BNIB)',
        '⭐ BEST SELLER',
        4.9,
        98,
        '1 Tahun Garansi Resmi SEIN',
        true
    ),
    (
        'handphone',
        'Xiaomi 14 Ultra 5G',
        'xiaomi-14-ultra-5g',
        'Xiaomi',
        15499000,
        16999000,
        9,
        'https://kycdtpppomsvfydovwrl.supabase.co/storage/v1/object/public/19sgadget_products/xiaomi-14.webp',
        '{"ram": "16GB", "storage": "512GB", "processor": "Snapdragon 8 Gen 3", "screen": "6.73 LTPO AMOLED WQHD+ 120Hz", "battery": "5000 mAh (90W HyperCharge)", "camera": "Leica Quad 50MP 1-inch sensor", "color": "Black"}'::jsonb,
        5,
        'Baru (BNIB)',
        '💎 DUO PILIHAN',
        4.9,
        54,
        '1 Tahun Garansi Resmi Xiaomi Indonesia',
        false
    ),
    (
        'handphone',
        'Google Pixel 9 Pro 128GB',
        'google-pixel-9-pro-128gb',
        'Google',
        16799000,
        17999000,
        7,
        'https://kycdtpppomsvfydovwrl.supabase.co/storage/v1/object/public/19sgadget_products/pixel-9-pro.webp',
        '{"ram": "16GB", "storage": "128GB", "processor": "Google Tensor G4", "screen": "6.3 Super Actua LTPO OLED 120Hz", "battery": "4700 mAh", "camera": "50MP + 48MP + 48MP", "color": "Obsidian"}'::jsonb,
        4,
        'Baru (BNIB)',
        '✨ KAMERA TERBAIK',
        4.8,
        37,
        '1 Tahun Garansi Internasional (IMEI Terdaftar Bea Cukai)',
        false
    ),

    -- TABLETS
    (
        'tablet',
        'iPad Pro 13-inch M4 WiFi 256GB',
        'ipad-pro-13-inch-m4-wifi-256gb',
        'Apple',
        22499000,
        23999000,
        6,
        'https://kycdtpppomsvfydovwrl.supabase.co/storage/v1/object/public/19sgadget_products/ipad-pro-m4.webp',
        '{"ram": "8GB", "storage": "256GB", "processor": "Apple M4 Chip (9-core CPU)", "screen": "13.0 Ultra Retina XDR Tandem OLED", "battery": "38.99 Wh", "weight": "579g", "color": "Space Black"}'::jsonb,
        6,
        'Baru (BNIB)',
        '🏆 MONSTER POWER',
        5.0,
        82,
        '1 Tahun Garansi Resmi Apple Indonesia',
        true
    ),
    (
        'tablet',
        'Samsung Galaxy Tab S9 Ultra 5G',
        'samsung-galaxy-tab-s9-ultra-5g',
        'Samsung',
        17999000,
        19999000,
        10,
        'https://kycdtpppomsvfydovwrl.supabase.co/storage/v1/object/public/19sgadget_products/samsung-tab-s9.webp',
        '{"ram": "12GB", "storage": "256GB", "processor": "Snapdragon 8 Gen 2 for Galaxy", "screen": "14.6 Dynamic AMOLED 2X 120Hz", "battery": "11200 mAh (45W)", "stylus": "S-Pen Included IP68", "color": "Graphite"}'::jsonb,
        5,
        'Baru (BNIB)',
        '⚡ BONUS S-PEN',
        4.9,
        61,
        '1 Tahun Garansi Resmi SEIN',
        false
    ),
    (
        'tablet',
        'Xiaomi Pad 6 Pro 8/256GB',
        'xiaomi-pad-6-pro-8-256gb',
        'Xiaomi',
        5899000,
        6499000,
        9,
        'https://kycdtpppomsvfydovwrl.supabase.co/storage/v1/object/public/19sgadget_products/xiaomi-pad-6.webp',
        '{"ram": "8GB", "storage": "256GB", "processor": "Snapdragon 8+ Gen 1", "screen": "11.0 IPS LCD 2.8K 144Hz HDR10", "battery": "8600 mAh (67W Fast Charge)", "audio": "Quad Speakers Dolby Atmos", "color": "Gravity Gray"}'::jsonb,
        15,
        'Baru (BNIB)',
        '🏷️ VALUE JUARA',
        4.8,
        129,
        '1 Tahun Garansi Resmi Xiaomi',
        false
    ),
    (
        'tablet',
        'iPad Air 11-inch M2 WiFi 128GB',
        'ipad-air-11-inch-m2-wifi-128gb',
        'Apple',
        11299000,
        12499000,
        10,
        'https://kycdtpppomsvfydovwrl.supabase.co/storage/v1/object/public/19sgadget_products/ipad-air-m2.webp',
        '{"ram": "8GB", "storage": "128GB", "processor": "Apple M2 Chip", "screen": "11.0 Liquid Retina True Tone", "battery": "28.93 Wh", "stylus": "Support Apple Pencil Pro", "color": "Starlight"}'::jsonb,
        9,
        'Baru (BNIB)',
        '⭐ TERPOPULER',
        4.9,
        94,
        '1 Tahun Garansi Resmi Apple Indonesia',
        false
    ),

    -- LAPTOPS
    (
        'laptop',
        'MacBook Pro 14-inch M3 Pro 18/512GB',
        'macbook-pro-14-inch-m3-pro-18-512gb',
        'Apple',
        31499000,
        33999000,
        7,
        'https://kycdtpppomsvfydovwrl.supabase.co/storage/v1/object/public/19sgadget_products/macbook-pro-m3.webp',
        '{"ram": "18GB Unified Memory", "storage": "512GB NVMe SSD", "processor": "Apple M3 Pro (11-core CPU, 14-core GPU)", "screen": "14.2 Liquid Retina XDR 120Hz ProMotion", "battery": "Up to 18 hours battery life", "color": "Space Black"}'::jsonb,
        4,
        'Baru (BNIB)',
        '🔥 FAVORIT PRO',
        5.0,
        52,
        '1 Tahun Garansi Resmi Apple Indonesia',
        true
    ),
    (
        'laptop',
        'ASUS ROG Zephyrus G14 OLED Gaming',
        'asus-rog-zephyrus-g14-oled-gaming',
        'ASUS',
        28999000,
        31999000,
        9,
        'https://kycdtpppomsvfydovwrl.supabase.co/storage/v1/object/public/19sgadget_products/rog-zephyrus.webp',
        '{"ram": "32GB LPDDR5X", "storage": "1TB PCIe 4.0 SSD", "processor": "AMD Ryzen 9 8945HS", "gpu": "NVIDIA GeForce RTX 4070 8GB GDDR6", "screen": "14.0 3K 120Hz 0.2ms ROG Nebula OLED", "color": "Eclipse Gray"}'::jsonb,
        3,
        'Baru (BNIB)',
        '⚡ GAMING BEAST',
        4.9,
        45,
        '2 Tahun Garansi Resmi ASUS VIP Perfect Warranty',
        true
    ),
    (
        'laptop',
        'Lenovo ThinkPad X1 Carbon Gen 12',
        'lenovo-thinkpad-x1-carbon-gen-12',
        'Lenovo',
        26499000,
        28999000,
        9,
        'https://kycdtpppomsvfydovwrl.supabase.co/storage/v1/object/public/19sgadget_products/thinkpad-x1.webp',
        '{"ram": "32GB LPDDR5X", "storage": "1TB SSD M.2", "processor": "Intel Core Ultra 7 155H with NPU AI", "screen": "14.0 2.8K OLED Anti-Glare 120Hz", "weight": "Hanya 1.09 kg Ultralight", "color": "Deep Black"}'::jsonb,
        5,
        'Baru (BNIB)',
        '💼 BISNIS NOMOR 1',
        4.9,
        39,
        '3 Tahun Garansi Lenovo Premier Support On-Site',
        false
    ),
    (
        'laptop',
        'Dell XPS 14 9440 Intel Core Ultra 7',
        'dell-xps-14-9440-intel-core-ultra-7',
        'Dell',
        29999000,
        32999000,
        9,
        'https://kycdtpppomsvfydovwrl.supabase.co/storage/v1/object/public/19sgadget_products/dell-xps.webp',
        '{"ram": "16GB LPDDR5X", "storage": "1TB SSD NVMe", "processor": "Intel Core Ultra 7 155H", "gpu": "NVIDIA GeForce RTX 4050 6GB", "screen": "14.5 3.2K OLED Touch 120Hz", "color": "Platinum Silver"}'::jsonb,
        4,
        'Baru (BNIB)',
        '✨ DESAIN FUTURISTIK',
        4.8,
        28,
        '2 Tahun Dell ProSupport Plus Onsite',
        false
    )
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    brand = EXCLUDED.brand,
    price = EXCLUDED.price,
    original_price = EXCLUDED.original_price,
    discount_percent = EXCLUDED.discount_percent,
    image_url = EXCLUDED.image_url,
    specs = EXCLUDED.specs,
    stock = EXCLUDED.stock,
    condition = EXCLUDED.condition,
    badge = EXCLUDED.badge,
    rating = EXCLUDED.rating,
    review_count = EXCLUDED.review_count,
    warranty = EXCLUDED.warranty,
    is_featured = EXCLUDED.is_featured;
