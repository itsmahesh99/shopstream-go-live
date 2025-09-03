-- ===============================================================================
-- SAMPLE PRODUCTS FOR PRODUCT AND LIVE_PRODUCT TABLES
-- Comprehensive sample data for testing and development
-- ===============================================================================

BEGIN;

-- Insert sample categories first
INSERT INTO public.categories (id, name, description, is_active) 
SELECT '11111111-1111-1111-1111-111111111111'::uuid, 'Electronics', 'Electronic gadgets and accessories', true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = 'Electronics')
UNION ALL
SELECT '22222222-2222-2222-2222-222222222222'::uuid, 'Fashion', 'Clothing and fashion accessories', true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = 'Fashion')
UNION ALL
SELECT '33333333-3333-3333-3333-333333333333'::uuid, 'Home & Garden', 'Home decor and garden items', true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = 'Home & Garden')
UNION ALL
SELECT '44444444-4444-4444-4444-444444444444'::uuid, 'Beauty & Health', 'Beauty products and health accessories', true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = 'Beauty & Health')
UNION ALL
SELECT '55555555-5555-5555-5555-555555555555'::uuid, 'Sports & Fitness', 'Sports equipment and fitness gear', true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = 'Sports & Fitness');

-- Temporarily disable the foreign key constraint for sample data insertion
ALTER TABLE public.influencers DROP CONSTRAINT IF EXISTS influencers_user_id_fkey;

-- Create sample influencers if none exist
INSERT INTO public.influencers (id, user_id, display_name, first_name, last_name, email, phone, bio)
SELECT 
    '99999999-9999-9999-9999-999999999999'::uuid,
    '88888888-8888-8888-8888-888888888888'::uuid,
    'Tech Guru',
    'Tech',
    'Guru',
    'techguru@example.com',
    '+1234567890',
    'Technology enthusiast and product reviewer'
WHERE NOT EXISTS (SELECT 1 FROM public.influencers WHERE email = 'techguru@example.com')
UNION ALL
SELECT 
    '99999999-9999-9999-9999-999999999998'::uuid,
    '88888888-8888-8888-8888-888888888887'::uuid,
    'Fashion Queen',
    'Fashion',
    'Queen',
    'fashionqueen@example.com',
    '+1234567891',
    'Fashion influencer and style expert'
WHERE NOT EXISTS (SELECT 1 FROM public.influencers WHERE email = 'fashionqueen@example.com')
UNION ALL
SELECT 
    '99999999-9999-9999-9999-999999999997'::uuid,
    '88888888-8888-8888-8888-888888888886'::uuid,
    'Home Stylist',
    'Home',
    'Stylist',
    'homestylist@example.com',
    '+1234567892',
    'Home decor and lifestyle influencer'
WHERE NOT EXISTS (SELECT 1 FROM public.influencers WHERE email = 'homestylist@example.com');

-- ===============================================================================
-- BULK PRODUCTS (E-COMMERCE)
-- ===============================================================================

INSERT INTO public.products (
    id, influencer_id, category_id, name, description, short_description,
    sku, brand, retail_price, compare_price, stock_quantity,
    images, tags, is_active, is_featured, is_live_stream_eligible
) VALUES
-- Electronics Products
(
    'p1111111-1111-1111-1111-111111111111'::uuid,
    '99999999-9999-9999-9999-999999999999'::uuid,
    '11111111-1111-1111-1111-111111111111'::uuid,
    'Wireless Bluetooth Headphones Pro',
    'Premium quality wireless headphones with active noise cancellation, 40-hour battery life, and crystal-clear audio quality. Perfect for music lovers and professionals.',
    'Premium wireless headphones with ANC',
    'WBH-PRO-001', 'AudioTech', 4999.00, 6999.00, 75,
    '["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400", "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400"]'::jsonb,
    '{"wireless", "bluetooth", "headphones", "noise-cancellation", "premium"}'::text[],
    true, true, true
),
(
    'p1111111-1111-1111-1111-111111111112'::uuid,
    '99999999-9999-9999-9999-999999999999'::uuid,
    '11111111-1111-1111-1111-111111111111'::uuid,
    'Smart Phone Case with MagSafe',
    'Ultra-slim phone case with built-in MagSafe compatibility and military-grade drop protection.',
    'MagSafe compatible phone case',
    'SPC-MAG-002', 'TechGuard', 1799.00, 2299.00, 150,
    '["https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400"]'::jsonb,
    '{"phone", "case", "magsafe", "protection", "wireless"}'::text[],
    true, false, true
),
(
    'p1111111-1111-1111-1111-111111111113'::uuid,
    '99999999-9999-9999-9999-999999999999'::uuid,
    '11111111-1111-1111-1111-111111111111'::uuid,
    'Wireless Charging Pad 15W',
    'Fast wireless charging pad with LED indicator and foreign object detection.',
    'Fast 15W wireless charging pad',
    'WCP-15W-003', 'ChargeTech', 1299.00, 1799.00, 80,
    '["https://images.unsplash.com/photo-1609592884643-61b1acf6ad4d?w=400"]'::jsonb,
    '{"wireless", "charging", "fast", "15w", "led"}'::text[],
    true, true, true
),
(
    'p1111111-1111-1111-1111-111111111114'::uuid,
    '99999999-9999-9999-9999-999999999999'::uuid,
    '11111111-1111-1111-1111-111111111111'::uuid,
    'Gaming Mechanical Keyboard RGB',
    'Professional gaming keyboard with cherry MX switches and customizable RGB backlighting.',
    'Gaming mechanical keyboard with RGB',
    'GMK-RGB-004', 'GamePro', 3999.00, 5499.00, 45,
    '["https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400"]'::jsonb,
    '{"gaming", "keyboard", "mechanical", "rgb", "cherry-mx"}'::text[],
    true, true, true
),

-- Fashion Products
(
    'p2222222-2222-2222-2222-222222222221'::uuid,
    '99999999-9999-9999-9999-999999999998'::uuid,
    '22222222-2222-2222-2222-222222222222'::uuid,
    'Premium Cotton Polo Shirt',
    'Classic fit polo shirt made from 100% premium cotton. Available in 8 different colors with embroidered logo.',
    'Premium cotton polo shirt',
    'PCP-001', 'StyleWear', 1299.00, 1799.00, 200,
    '["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400"]'::jsonb,
    '{"polo", "cotton", "premium", "classic", "casual"}'::text[],
    true, true, true
),
(
    'p2222222-2222-2222-2222-222222222222'::uuid,
    '99999999-9999-9999-9999-999999999998'::uuid,
    '22222222-2222-2222-2222-222222222222'::uuid,
    'Genuine Leather Wallet RFID',
    'Handcrafted genuine leather wallet with RFID blocking technology and multiple card slots.',
    'Genuine leather RFID wallet',
    'GLW-RFID-002', 'LeatherCraft', 1999.00, 2799.00, 120,
    '["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400"]'::jsonb,
    '{"wallet", "leather", "rfid", "handcrafted", "premium"}'::text[],
    true, false, true
),
(
    'p2222222-2222-2222-2222-222222222223'::uuid,
    '99999999-9999-9999-9999-999999999998'::uuid,
    '22222222-2222-2222-2222-222222222222'::uuid,
    'Designer Denim Jeans',
    'Premium denim jeans with slim fit design and vintage wash. Made from sustainable cotton.',
    'Premium designer denim jeans',
    'DDJ-SLIM-003', 'DenimCo', 2499.00, 3499.00, 85,
    '["https://images.unsplash.com/photo-1542272604-787c3835535d?w=400"]'::jsonb,
    '{"jeans", "denim", "designer", "slim-fit", "sustainable"}'::text[],
    true, true, true
),
(
    'p2222222-2222-2222-2222-222222222224'::uuid,
    '99999999-9999-9999-9999-999999999998'::uuid,
    '22222222-2222-2222-2222-222222222222'::uuid,
    'Silk Scarf Collection',
    'Luxurious silk scarf with hand-printed patterns. Perfect accessory for any outfit.',
    'Luxurious silk scarf',
    'SSC-LUX-004', 'SilkStyle', 1599.00, 2199.00, 60,
    '["https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400"]'::jsonb,
    '{"scarf", "silk", "luxury", "hand-printed", "accessory"}'::text[],
    true, false, true
),

-- Home & Garden Products
(
    'p3333333-3333-3333-3333-333333333331'::uuid,
    '99999999-9999-9999-9999-999999999997'::uuid,
    '33333333-3333-3333-3333-333333333333'::uuid,
    'Aromatherapy Essential Oil Diffuser',
    'Ultrasonic essential oil diffuser with 7 LED color options, timer settings, and mist control.',
    'Ultrasonic aromatherapy diffuser',
    'AED-ULT-001', 'HomeScent', 2799.00, 3599.00, 90,
    '["https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400"]'::jsonb,
    '{"aromatherapy", "diffuser", "essential-oils", "ultrasonic", "led"}'::text[],
    true, true, true
),
(
    'p3333333-3333-3333-3333-333333333332'::uuid,
    '99999999-9999-9999-9999-999999999997'::uuid,
    '33333333-3333-3333-3333-333333333333'::uuid,
    'Smart Plant Pot with Sensors',
    'Self-watering plant pot with soil moisture sensors and mobile app connectivity.',
    'Smart self-watering plant pot',
    'SPP-SMART-002', 'GreenTech', 1899.00, 2499.00, 50,
    '["https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400"]'::jsonb,
    '{"smart", "plant-pot", "sensors", "self-watering", "app"}'::text[],
    true, true, true
),
(
    'p3333333-3333-3333-3333-333333333333'::uuid,
    '99999999-9999-9999-9999-999999999997'::uuid,
    '33333333-3333-3333-3333-333333333333'::uuid,
    'Bamboo Kitchen Utensil Set',
    'Eco-friendly bamboo kitchen utensil set with 7 pieces and wooden holder.',
    'Eco-friendly bamboo utensil set',
    'BKU-ECO-003', 'EcoKitchen', 999.00, 1399.00, 100,
    '["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400"]'::jsonb,
    '{"bamboo", "kitchen", "utensils", "eco-friendly", "sustainable"}'::text[],
    true, false, true
),

-- Beauty & Health Products
(
    'p4444444-4444-4444-4444-444444444441'::uuid,
    '99999999-9999-9999-9999-999999999998'::uuid,
    '44444444-4444-4444-4444-444444444444'::uuid,
    'LED Face Mask Therapy Device',
    'Professional LED light therapy face mask with red and blue light for skincare.',
    'LED light therapy face mask',
    'LFM-THER-001', 'BeautyTech', 3499.00, 4999.00, 30,
    '["https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400"]'::jsonb,
    '{"led", "face-mask", "therapy", "skincare", "red-light", "blue-light"}'::text[],
    true, true, true
),
(
    'p4444444-4444-4444-4444-444444444442'::uuid,
    '99999999-9999-9999-9999-999999999998'::uuid,
    '44444444-4444-4444-4444-444444444444'::uuid,
    'Vitamin C Serum Set',
    'Premium vitamin C serum with hyaluronic acid and vitamin E for glowing skin.',
    'Premium vitamin C serum set',
    'VCS-PREM-002', 'GlowSkin', 1799.00, 2399.00, 80,
    '["https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=400"]'::jsonb,
    '{"vitamin-c", "serum", "skincare", "hyaluronic-acid", "anti-aging"}'::text[],
    true, true, true
),

-- Sports & Fitness Products
(
    'p5555555-5555-5555-5555-555555555551'::uuid,
    '99999999-9999-9999-9999-999999999999'::uuid,
    '55555555-5555-5555-5555-555555555555'::uuid,
    'Smart Fitness Tracker Watch',
    'Advanced fitness tracker with heart rate monitoring, GPS, and 14-day battery life.',
    'Smart fitness tracker watch',
    'SFT-ADV-001', 'FitTrack', 3999.00, 5499.00, 65,
    '["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400"]'::jsonb,
    '{"fitness", "tracker", "smart-watch", "heart-rate", "gps"}'::text[],
    true, true, true
),
(
    'p5555555-5555-5555-5555-555555555552'::uuid,
    '99999999-9999-9999-9999-999999999999'::uuid,
    '55555555-5555-5555-5555-555555555555'::uuid,
    'Yoga Mat Premium Non-Slip',
    'Extra thick yoga mat with superior grip and eco-friendly materials.',
    'Premium non-slip yoga mat',
    'YMP-ECO-002', 'ZenFit', 1299.00, 1799.00, 120,
    '["https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400"]'::jsonb,
    '{"yoga", "mat", "non-slip", "eco-friendly", "thick"}'::text[],
    true, false, true
);

-- ===============================================================================
-- LIVE PRODUCTS (LIVE STREAMING)
-- ===============================================================================

INSERT INTO public.live_products (
    id, influencer_id, category_id, name, description, price, compare_at_price,
    stock_quantity, original_stock, sku, brand, images, tags, is_active
) VALUES
-- Electronics Live Products
(
    'l1111111-1111-1111-1111-111111111111'::uuid,
    '99999999-9999-9999-9999-999999999999'::uuid,
    '11111111-1111-1111-1111-111111111111'::uuid,
    'Smart Watch Series X Pro',
    'Latest smartwatch with advanced health monitoring, ECG, blood oxygen tracking, and 10-day battery.',
    6999.00, 9999.00, 25, 25,
    'SWX-PRO-L001', 'TechLife',
    '["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400"]'::jsonb,
    '{"smartwatch", "health", "ecg", "blood-oxygen", "premium"}'::text[],
    true
),
(
    'l1111111-1111-1111-1111-111111111112'::uuid,
    '99999999-9999-9999-9999-999999999999'::uuid,
    '11111111-1111-1111-1111-111111111111'::uuid,
    'Gaming Mouse Wireless RGB Pro',
    'Professional gaming mouse with 25600 DPI, wireless connectivity, and customizable RGB.',
    2499.00, 3499.00, 20, 20,
    'GMW-RGB-L002', 'GameElite',
    '["https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400"]'::jsonb,
    '{"gaming", "mouse", "wireless", "rgb", "25600-dpi"}'::text[],
    true
),
(
    'l1111111-1111-1111-1111-111111111113'::uuid,
    '99999999-9999-9999-9999-999999999999'::uuid,
    '11111111-1111-1111-1111-111111111111'::uuid,
    'Bluetooth Speaker Waterproof',
    'Portable Bluetooth speaker with 360-degree sound, waterproof design, and 24-hour battery.',
    1999.00, 2799.00, 35, 35,
    'BTS-WAT-L003', 'SoundWave',
    '["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400"]'::jsonb,
    '{"bluetooth", "speaker", "waterproof", "portable", "360-sound"}'::text[],
    true
),

-- Fashion Live Products
(
    'l2222222-2222-2222-2222-222222222221'::uuid,
    '99999999-9999-9999-9999-999999999998'::uuid,
    '22222222-2222-2222-2222-222222222222'::uuid,
    'Designer Sunglasses Polarized',
    'Luxury designer sunglasses with polarized lenses and titanium frame.',
    3999.00, 5999.00, 15, 15,
    'DSP-LUX-L001', 'LuxVision',
    '["https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400"]'::jsonb,
    '{"sunglasses", "designer", "polarized", "titanium", "luxury"}'::text[],
    true
),
(
    'l2222222-2222-2222-2222-222222222222'::uuid,
    '99999999-9999-9999-9999-999999999998'::uuid,
    '22222222-2222-2222-2222-222222222222'::uuid,
    'Premium Travel Backpack',
    'Professional travel backpack with laptop compartment, USB port, and anti-theft design.',
    2999.00, 4199.00, 28, 28,
    'PTB-PRO-L002', 'TravelPro',
    '["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400"]'::jsonb,
    '{"backpack", "travel", "laptop", "usb", "anti-theft"}'::text[],
    true
),
(
    'l2222222-2222-2222-2222-222222222223'::uuid,
    '99999999-9999-9999-9999-999999999998'::uuid,
    '22222222-2222-2222-2222-222222222222'::uuid,
    'Cashmere Scarf Limited Edition',
    'Ultra-soft cashmere scarf with limited edition pattern design.',
    2799.00, 3799.00, 12, 12,
    'CSL-LIM-L003', 'CashmereStyle',
    '["https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400"]'::jsonb,
    '{"cashmere", "scarf", "limited-edition", "ultra-soft", "luxury"}'::text[],
    true
),

-- Home & Garden Live Products
(
    'l3333333-3333-3333-3333-333333333331'::uuid,
    '99999999-9999-9999-9999-999999999997'::uuid,
    '33333333-3333-3333-3333-333333333333'::uuid,
    'Smart Home LED Strip Kit',
    'WiFi-enabled LED strip lights with voice control and music sync.',
    1799.00, 2499.00, 40, 40,
    'SHL-KIT-L001', 'SmartHome',
    '["https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400"]'::jsonb,
    '{"led", "strip", "smart-home", "wifi", "voice-control", "music-sync"}'::text[],
    true
),
(
    'l3333333-3333-3333-3333-333333333332'::uuid,
    '99999999-9999-9999-9999-999999999997'::uuid,
    '33333333-3333-3333-3333-333333333333'::uuid,
    'Air Purifier HEPA Filter',
    'High-efficiency air purifier with HEPA filter and smart air quality monitoring.',
    4999.00, 6999.00, 18, 18,
    'APH-SMART-L002', 'PureAir',
    '["https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400"]'::jsonb,
    '{"air-purifier", "hepa", "smart", "air-quality", "monitoring"}'::text[],
    true
),

-- Beauty & Health Live Products
(
    'l4444444-4444-4444-4444-444444444441'::uuid,
    '99999999-9999-9999-9999-999999999998'::uuid,
    '44444444-4444-4444-4444-444444444444'::uuid,
    'Jade Roller & Gua Sha Set',
    'Authentic jade facial roller and gua sha tool set for skincare massage.',
    799.00, 1299.00, 45, 45,
    'JRG-SET-L001', 'JadeBeauty',
    '["https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400"]'::jsonb,
    '{"jade", "roller", "gua-sha", "skincare", "massage", "authentic"}'::text[],
    true
),
(
    'l4444444-4444-4444-4444-444444444442'::uuid,
    '99999999-9999-9999-9999-999999999998'::uuid,
    '44444444-4444-4444-4444-444444444444'::uuid,
    'Collagen Peptides Powder',
    'Premium collagen peptides powder for skin, hair, and joint health.',
    1599.00, 2199.00, 60, 60,
    'CPP-PREM-L002', 'VitalHealth',
    '["https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400"]'::jsonb,
    '{"collagen", "peptides", "powder", "skin", "hair", "joint-health"}'::text[],
    true
),

-- Sports & Fitness Live Products
(
    'l5555555-5555-5555-5555-555555555551'::uuid,
    '99999999-9999-9999-9999-999999999999'::uuid,
    '55555555-5555-5555-5555-555555555555'::uuid,
    'Resistance Bands Pro Set',
    'Professional resistance bands set with 5 different resistance levels and accessories.',
    899.00, 1399.00, 50, 50,
    'RBP-SET-L001', 'ProFit',
    '["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400"]'::jsonb,
    '{"resistance", "bands", "professional", "5-levels", "accessories"}'::text[],
    true
),
(
    'l5555555-5555-5555-5555-555555555552'::uuid,
    '99999999-9999-9999-9999-999999999999'::uuid,
    '55555555-5555-5555-5555-555555555555'::uuid,
    'Protein Shaker Bottle Smart',
    'Smart protein shaker with built-in mixing technology and measurement tracker.',
    599.00, 899.00, 75, 75,
    'PSB-SMART-L002', 'FitGear',
    '["https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400"]'::jsonb,
    '{"protein", "shaker", "smart", "mixing", "measurement", "tracker"}'::text[],
    true
);

-- ===============================================================================
-- UPDATE SAMPLE DATA WITH RATINGS AND SALES
-- ===============================================================================

-- Add random ratings, sales data, and reviews for products
UPDATE public.products SET 
    total_sales = FLOOR(RANDOM() * 200) + 10,
    average_rating = ROUND((RANDOM() * 2 + 3)::numeric, 2),
    total_reviews = FLOOR(RANDOM() * 100) + 5,
    updated_at = NOW()
WHERE id LIKE 'p%';

-- Add random ratings, sales data, and reviews for live_products
UPDATE public.live_products SET 
    total_sales = FLOOR(RANDOM() * 100) + 5,
    average_rating = ROUND((RANDOM() * 2 + 3)::numeric, 2),
    total_reviews = FLOOR(RANDOM() * 50) + 2,
    updated_at = NOW()
WHERE id LIKE 'l%';

-- Update some products to be featured
UPDATE public.products 
SET is_featured = true 
WHERE id IN (
    'p1111111-1111-1111-1111-111111111111',
    'p2222222-2222-2222-2222-222222222221',
    'p3333333-3333-3333-3333-333333333331',
    'p4444444-4444-4444-4444-444444444441',
    'p5555555-5555-5555-5555-555555555551'
);

-- Set some products as low stock to test inventory management
UPDATE public.products 
SET stock_quantity = FLOOR(RANDOM() * 10) + 1
WHERE id IN (
    'p1111111-1111-1111-1111-111111111114',
    'p2222222-2222-2222-2222-222222222224',
    'p4444444-4444-4444-4444-444444444441'
);

-- Set some live products as low stock
UPDATE public.live_products 
SET stock_quantity = FLOOR(RANDOM() * 5) + 1
WHERE id IN (
    'l2222222-2222-2222-2222-222222222223',
    'l3333333-3333-3333-3333-333333333332'
);

-- Add created_at and updated_at timestamps
UPDATE public.products 
SET 
    created_at = NOW() - INTERVAL '30 days' * RANDOM(),
    updated_at = NOW() - INTERVAL '7 days' * RANDOM()
WHERE created_at IS NULL;

UPDATE public.live_products 
SET 
    created_at = NOW() - INTERVAL '15 days' * RANDOM(),
    updated_at = NOW() - INTERVAL '3 days' * RANDOM()
WHERE created_at IS NULL;

COMMIT;

-- ===============================================================================
-- RESTORE CONSTRAINTS (OPTIONAL)
-- ===============================================================================
-- Uncomment the following lines if you want to restore the foreign key constraint
-- This should only be done after ensuring all influencers have valid user_id references
-- ALTER TABLE public.influencers ADD CONSTRAINT influencers_user_id_fkey 
--   FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- ===============================================================================
-- VERIFICATION QUERIES
-- ===============================================================================

-- Uncomment these queries to verify the data insertion
/*
SELECT 'Products Count' as table_name, COUNT(*) as count FROM public.products
UNION ALL
SELECT 'Live Products Count' as table_name, COUNT(*) as count FROM public.live_products
UNION ALL
SELECT 'Categories Count' as table_name, COUNT(*) as count FROM public.categories
UNION ALL
SELECT 'Influencers Count' as table_name, COUNT(*) as count FROM public.influencers;

SELECT category_id, COUNT(*) as product_count 
FROM public.products 
GROUP BY category_id;

SELECT category_id, COUNT(*) as live_product_count 
FROM public.live_products 
GROUP BY category_id;
*/
