-- Delete existing product-related tables
-- This will permanently remove the tables and all their data
-- WARNING: CASCADE will also drop dependent objects (foreign keys, views, etc.)

-- Drop live_stream_products table first (if it has foreign key references to products)
DROP TABLE IF EXISTS live_stream_products CASCADE;

-- Drop products table with CASCADE to handle foreign key dependencies
-- This will drop:
-- - cart_product_id_fkey constraint on cart table
-- - order_items_product_id_fkey constraint on order_items table  
-- - live_session_products_product_id_fkey constraint on live_session_products table
-- - influencer_earnings_product_id_fkey constraint on influencer_earnings table
-- - wholesaler_product_summary view
DROP TABLE IF EXISTS products CASCADE;

-- Verify tables are deleted (optional check)
-- SELECT table_name FROM information_schema.tables 
-- WHERE table_schema = 'public' AND table_name IN ('products', 'live_stream_products');