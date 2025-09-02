-- Check existing tables in Supabase
-- Run this first to see what tables already exist

SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- Check if specific tables exist
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
    'customers',
    'wholesalers', 
    'influencers',
    'products',
    'cart',
    'orders',
    'order_items',
    'queries',
    'live_sessions',
    'live_session_products',
    'influencer_achievements',
    'influencer_goals',
    'influencer_earnings',
    'influencer_analytics',
    'influencer_notifications',
    'influencer_settings'
);
