-- ===============================================================================
-- SIMPLE TEST PRODUCTS - QUICK INSERT
-- Simple version with hardcoded UUIDs for testing
-- ===============================================================================

-- Insert sample categories first
INSERT INTO public.categories (id, name, description, is_active) 
SELECT '11111111-1111-1111-1111-111111111111', 'Electronics', 'Electronic gadgets and accessories', true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = 'Electronics')
UNION ALL
SELECT '22222222-2222-2222-2222-222222222222', 'Fashion', 'Clothing and fashion accessories', true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = 'Fashion')
UNION ALL
SELECT '33333333-3333-3333-3333-333333333333', 'Home & Garden', 'Home decor and garden items', true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = 'Home & Garden');

-- Create a sample influencer if none exists
INSERT INTO public.influencers (id, user_id, username, full_name, email, phone, bio)
SELECT 
    '99999999-9999-9999-9999-999999999999',
    '88888888-8888-8888-8888-888888888888',
    'test_influencer',
    'Test Influencer',
    'test@example.com',
    '+1234567890',
    'Sample influencer for testing products'
WHERE NOT EXISTS (SELECT 1 FROM public.influencers WHERE username = 'test_influencer');

-- BULK PRODUCTS (for e-commerce/bulk selling)
INSERT INTO public.products (
    id, influencer_id, category_id, name, description, short_description,
    sku, brand, retail_price, compare_price, stock_quantity,
    images, tags, is_active, is_featured, is_live_stream_eligible
) VALUES
-- Electronics
(
    'b1111111-1111-1111-1111-111111111111',
    '99999999-9999-9999-9999-999999999999',
    '11111111-1111-1111-1111-111111111111',
    'Wireless Bluetooth Headphones',
    'Premium quality wireless headphones with noise cancellation and 30-hour battery life.',
    'Premium wireless headphones',
    'WBH-001', 'AudioTech', 2999.00, 3999.00, 50,
    '["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400"]'::jsonb,
    '{"wireless", "bluetooth", "headphones", "audio"}'::text[],
    true, true, true
),
(
    'b2222222-2222-2222-2222-222222222222',
    '99999999-9999-9999-9999-999999999999',
    '11111111-1111-1111-1111-111111111111',
    'Smart Phone Case',
    'Durable phone case with built-in wireless charging capability.',
    'Smart phone case with wireless charging',
    'SPC-002', 'TechGuard', 1299.00, 1799.00, 100,
    '["https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400"]'::jsonb,
    '{"phone", "case", "wireless", "charging"}'::text[],
    true, false, true
),
-- Fashion
(
    'b3333333-3333-3333-3333-333333333333',
    '99999999-9999-9999-9999-999999999999',
    '22222222-2222-2222-2222-222222222222',
    'Premium Cotton T-Shirt',
    'Soft and comfortable 100% cotton t-shirt available in multiple colors.',
    'Premium 100% cotton t-shirt',
    'PCT-004', 'StyleWear', 799.00, 1199.00, 200,
    '["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400"]'::jsonb,
    '{"t-shirt", "cotton", "casual", "fashion"}'::text[],
    true, true, true
),
(
    'b4444444-4444-4444-4444-444444444444',
    '99999999-9999-9999-9999-999999999999',
    '22222222-2222-2222-2222-222222222222',
    'Leather Wallet',
    'Genuine leather wallet with RFID blocking technology.',
    'Genuine leather RFID wallet',
    'LWR-005', 'LeatherCraft', 1499.00, 1999.00, 80,
    '["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400"]'::jsonb,
    '{"wallet", "leather", "rfid", "accessories"}'::text[],
    true, false, true
),
-- Home & Garden
(
    'b5555555-5555-5555-5555-555555555555',
    '99999999-9999-9999-9999-999999999999',
    '33333333-3333-3333-3333-333333333333',
    'Aromatherapy Diffuser',
    'Ultrasonic essential oil diffuser with LED lights and timer settings.',
    'Ultrasonic aromatherapy diffuser',
    'AED-006', 'HomeScent', 2199.00, 2999.00, 60,
    '["https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400"]'::jsonb,
    '{"aromatherapy", "diffuser", "essential-oils", "home"}'::text[],
    true, true, true
);

-- LIVE PRODUCTS (for live streaming)
INSERT INTO public.live_products (
    id, influencer_id, category_id, name, description, price, compare_at_price,
    stock_quantity, original_stock, sku, brand, images, tags, is_active
) VALUES
-- Electronics
(
    'l1111111-1111-1111-1111-111111111111',
    '99999999-9999-9999-9999-999999999999',
    '11111111-1111-1111-1111-111111111111',
    'Smart Watch with Fitness Tracking',
    'Advanced smartwatch with heart rate monitoring, GPS, and 7-day battery life.',
    4999.00, 6999.00, 30, 30,
    'SWF-L001', 'FitTech',
    '["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400"]'::jsonb,
    '{"smartwatch", "fitness", "tracking", "heart-rate"}'::text[],
    true
),
(
    'l2222222-2222-2222-2222-222222222222',
    '99999999-9999-9999-9999-999999999999',
    '11111111-1111-1111-1111-111111111111',
    'Gaming Mouse RGB',
    'High-precision gaming mouse with customizable RGB lighting.',
    1799.00, 2499.00, 25, 25,
    'GMR-L002', 'GamePro',
    '["https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400"]'::jsonb,
    '{"gaming", "mouse", "rgb", "precision"}'::text[],
    true
),
-- Fashion
(
    'l3333333-3333-3333-3333-333333333333',
    '99999999-9999-9999-9999-999999999999',
    '22222222-2222-2222-2222-222222222222',
    'Designer Sunglasses',
    'Stylish designer sunglasses with 100% UV protection and polarized lenses.',
    2299.00, 3299.00, 20, 20,
    'DSU-L003', 'StyleVision',
    '["https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400"]'::jsonb,
    '{"sunglasses", "designer", "uv-protection", "style"}'::text[],
    true
),
(
    'l4444444-4444-4444-4444-444444444444',
    '99999999-9999-9999-9999-999999999999',
    '22222222-2222-2222-2222-222222222222',
    'Premium Backpack',
    'Durable backpack with padded laptop compartment and multiple pockets.',
    1999.00, 2799.00, 35, 35,
    'PBL-L004', 'TravelGear',
    '["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400"]'::jsonb,
    '{"backpack", "laptop", "travel", "durable"}'::text[],
    true
),
-- Home & Garden
(
    'l5555555-5555-5555-5555-555555555555',
    '99999999-9999-9999-9999-999999999999',
    '33333333-3333-3333-3333-333333333333',
    'LED Plant Grow Light',
    'Full-spectrum LED grow light for indoor plants and herbs.',
    1599.00, 2199.00, 40, 40,
    'LPG-L005', 'GrowTech',
    '["https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400"]'::jsonb,
    '{"led", "grow-light", "plants", "indoor-gardening"}'::text[],
    true
);

-- Add some random ratings and sales data
UPDATE public.products SET 
    total_sales = FLOOR(RANDOM() * 100) + 1,
    average_rating = ROUND((RANDOM() * 2 + 3)::numeric, 2),
    total_reviews = FLOOR(RANDOM() * 50) + 1;

UPDATE public.live_products SET 
    total_sales = FLOOR(RANDOM() * 50) + 1,
    average_rating = ROUND((RANDOM() * 2 + 3)::numeric, 2),
    total_reviews = FLOOR(RANDOM() * 25) + 1;

COMMIT;
