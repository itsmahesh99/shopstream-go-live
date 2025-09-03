-- ===============================================================================
-- SAMPLE LIVE STREAMS DATA - FOR TESTING
-- Insert sample live streams for the redesigned homepage
-- ===============================================================================

-- Insert sample live streams
INSERT INTO public.live_streams (
    id, influencer_id, category_id, title, description,
    thumbnail_url, is_live, viewer_count, status,
    room_id, start_time
) VALUES
-- Electronics Live Stream
(
    'ls111111-1111-1111-1111-111111111111',
    '99999999-9999-9999-9999-999999999999', -- Sample influencer
    '11111111-1111-1111-1111-111111111111', -- Electronics category
    '📱 TECH SHOWCASE - Latest Electronics',
    'Exclusive deals on latest smartphones, laptops, and gadgets. Limited time offers!',
    '/lovable-uploads/9f9465c9-14a1-4b53-b185-257751bc97c5.png',
    true, 156, 'live',
    'room_tech_showcase_001', NOW()
),
-- Fashion Live Stream
(
    'ls222222-2222-2222-2222-222222222222',
    '99999999-9999-9999-9999-999999999999',
    '22222222-2222-2222-2222-222222222222', -- Fashion category
    '👗 FASHION FRIDAY - Designer Wear',
    'Trendy fashion collections, designer wear at unbeatable prices. Live styling tips!',
    '/lovable-uploads/f8d1a83b-970d-4d3a-966a-e0e1deaddb20.png',
    true, 342, 'live',
    'room_fashion_friday_001', NOW()
),
-- Sneakers Live Stream
(
    'ls333333-3333-3333-3333-333333333333',
    '99999999-9999-9999-9999-999999999999',
    '44444444-4444-4444-4444-444444444444', -- Sneakers category (if exists)
    '🔥 SNEAKER DROP - JORDAN RETRO COLLECTION',
    'Exclusive Jordan retro collection drop. Authentic sneakers, limited edition releases!',
    '/lovable-uploads/7c48c057-d4b0-4193-9473-be6c8eee605c.png',
    true, 208, 'live',
    'room_sneaker_drop_001', NOW()
),
-- Sports Live Stream
(
    'ls444444-4444-4444-4444-444444444444',
    '99999999-9999-9999-9999-999999999999',
    '55555555-5555-5555-5555-555555555555', -- Sports category (if exists)
    '⚽ SPORTS GEAR - Authentic Jerseys',
    'Official team jerseys, sports equipment, and fitness gear at amazing prices!',
    '/lovable-uploads/4448d6cf-1254-4262-a2a2-cb90ffd97796.png',
    true, 89, 'live',
    'room_sports_gear_001', NOW()
),
-- Beauty Live Stream
(
    'ls555555-5555-5555-5555-555555555555',
    '99999999-9999-9999-9999-999999999999',
    '66666666-6666-6666-6666-666666666666', -- Beauty category (if exists)
    '💄 BEAUTY HAUL - Korean Skincare',
    'K-beauty skincare routine, makeup tutorials, and exclusive beauty product deals!',
    '/lovable-uploads/b70ed579-11af-4d52-af36-34b2f78386c0.png',
    true, 123, 'live',
    'room_beauty_haul_001', NOW()
),
-- Gaming Live Stream
(
    'ls666666-6666-6666-6666-666666666666',
    '99999999-9999-9999-9999-999999999999',
    '77777777-7777-7777-7777-777777777777', -- Gaming category (if exists)
    '🎮 GAMING SETUP GIVEAWAY',
    'Epic gaming setup showcase, peripheral reviews, and exclusive gaming gear giveaway!',
    '/lovable-uploads/a758d528-4f86-47ab-8952-b84d3f2e2b2c.png',
    true, 267, 'live',
    'room_gaming_setup_001', NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Update viewer counts randomly every few seconds (for demo purposes)
-- This would typically be handled by your live streaming backend
UPDATE public.live_streams 
SET viewer_count = viewer_count + (RANDOM() * 20 - 10)::integer
WHERE is_live = true AND viewer_count > 10;
