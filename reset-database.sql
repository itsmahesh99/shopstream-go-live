-- ===============================================================================
-- COMPLETE DATABASE RESET SCRIPT
-- WARNING: This will delete ALL existing data and tables
-- Only run this if you want to start completely fresh
-- ===============================================================================

-- First, let's see what tables exist before dropping
DO $$ 
BEGIN
    RAISE NOTICE 'Current tables in public schema:';
END $$;

SELECT 'Existing table: ' || tablename as info
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- ===============================================================================
-- STEP 1: DROP ALL POLICIES FIRST
-- ===============================================================================

-- Drop all RLS policies to avoid dependency issues
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        BEGIN
            EXECUTE 'DROP POLICY IF EXISTS "Customers can view own profile" ON public.' || r.tablename;
            EXECUTE 'DROP POLICY IF EXISTS "Customers can update own profile" ON public.' || r.tablename;
            EXECUTE 'DROP POLICY IF EXISTS "Customers can insert own profile" ON public.' || r.tablename;
            EXECUTE 'DROP POLICY IF EXISTS "Wholesalers can view own profile" ON public.' || r.tablename;
            EXECUTE 'DROP POLICY IF EXISTS "Wholesalers can update own profile" ON public.' || r.tablename;
            EXECUTE 'DROP POLICY IF EXISTS "Wholesalers can insert own profile" ON public.' || r.tablename;
            EXECUTE 'DROP POLICY IF EXISTS "Influencers can view own profile" ON public.' || r.tablename;
            EXECUTE 'DROP POLICY IF EXISTS "Influencers can update own profile" ON public.' || r.tablename;
            EXECUTE 'DROP POLICY IF EXISTS "Influencers can insert own profile" ON public.' || r.tablename;
            EXECUTE 'DROP POLICY IF EXISTS "Anyone can view active products" ON public.' || r.tablename;
            EXECUTE 'DROP POLICY IF EXISTS "Wholesalers can manage own products" ON public.' || r.tablename;
            EXECUTE 'DROP POLICY IF EXISTS "Customers can manage own cart" ON public.' || r.tablename;
            EXECUTE 'DROP POLICY IF EXISTS "Customers can view own orders" ON public.' || r.tablename;
            EXECUTE 'DROP POLICY IF EXISTS "Wholesalers can view relevant orders" ON public.' || r.tablename;
            EXECUTE 'DROP POLICY IF EXISTS "Users can view relevant order items" ON public.' || r.tablename;
            EXECUTE 'DROP POLICY IF EXISTS "Customers can manage own queries" ON public.' || r.tablename;
            EXECUTE 'DROP POLICY IF EXISTS "Anyone can view live sessions" ON public.' || r.tablename;
            EXECUTE 'DROP POLICY IF EXISTS "Influencers can manage own live sessions" ON public.' || r.tablename;
            EXECUTE 'DROP POLICY IF EXISTS "Anyone can view live session products" ON public.' || r.tablename;
            EXECUTE 'DROP POLICY IF EXISTS "Influencers can manage own live session products" ON public.' || r.tablename;
            EXECUTE 'DROP POLICY IF EXISTS "Influencers can view own achievements" ON public.' || r.tablename;
            EXECUTE 'DROP POLICY IF EXISTS "Influencers can manage own achievements" ON public.' || r.tablename;
            EXECUTE 'DROP POLICY IF EXISTS "Influencers can view own goals" ON public.' || r.tablename;
            EXECUTE 'DROP POLICY IF EXISTS "Influencers can manage own goals" ON public.' || r.tablename;
            EXECUTE 'DROP POLICY IF EXISTS "Influencers can view own earnings" ON public.' || r.tablename;
            EXECUTE 'DROP POLICY IF EXISTS "Influencers can view own analytics" ON public.' || r.tablename;
            EXECUTE 'DROP POLICY IF EXISTS "Influencers can manage own analytics" ON public.' || r.tablename;
            EXECUTE 'DROP POLICY IF EXISTS "Influencers can view own notifications" ON public.' || r.tablename;
            EXECUTE 'DROP POLICY IF EXISTS "Influencers can manage own notifications" ON public.' || r.tablename;
            EXECUTE 'DROP POLICY IF EXISTS "Influencers can view own settings" ON public.' || r.tablename;
            EXECUTE 'DROP POLICY IF EXISTS "Influencers can manage own settings" ON public.' || r.tablename;
        EXCEPTION WHEN OTHERS THEN
            -- Ignore errors for policies that don't exist
            NULL;
        END;
    END LOOP;
    RAISE NOTICE 'Dropped all RLS policies';
END $$;

-- ===============================================================================
-- STEP 2: DROP ALL TRIGGERS
-- ===============================================================================

-- Drop all triggers first to avoid issues
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT trigger_name, event_object_table 
        FROM information_schema.triggers 
        WHERE trigger_schema = 'public'
    ) LOOP
        BEGIN
            EXECUTE 'DROP TRIGGER IF EXISTS ' || r.trigger_name || ' ON public.' || r.event_object_table || ' CASCADE';
        EXCEPTION WHEN OTHERS THEN
            NULL;
        END;
    END LOOP;
    RAISE NOTICE 'Dropped all triggers';
END $$;

-- ===============================================================================
-- STEP 3: DROP ALL VIEWS
-- ===============================================================================

-- Drop all views
DROP VIEW IF EXISTS public.customer_order_summary CASCADE;
DROP VIEW IF EXISTS public.wholesaler_product_summary CASCADE;

-- Drop any other views that might exist
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT viewname FROM pg_views WHERE schemaname = 'public') LOOP
        BEGIN
            EXECUTE 'DROP VIEW IF EXISTS public.' || r.viewname || ' CASCADE';
        EXCEPTION WHEN OTHERS THEN
            NULL;
        END;
    END LOOP;
    RAISE NOTICE 'Dropped all views';
END $$;

-- ===============================================================================
-- STEP 4: DROP ALL TABLES (in correct dependency order)
-- ===============================================================================

-- Drop tables in reverse dependency order to avoid foreign key constraints
DROP TABLE IF EXISTS public.influencer_notifications CASCADE;
DROP TABLE IF EXISTS public.influencer_settings CASCADE;
DROP TABLE IF EXISTS public.influencer_analytics CASCADE;
DROP TABLE IF EXISTS public.influencer_earnings CASCADE;
DROP TABLE IF EXISTS public.influencer_goals CASCADE;
DROP TABLE IF EXISTS public.influencer_achievements CASCADE;
DROP TABLE IF EXISTS public.live_session_products CASCADE;
DROP TABLE IF EXISTS public.live_sessions CASCADE;
DROP TABLE IF EXISTS public.queries CASCADE;
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.cart CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.influencers CASCADE;
DROP TABLE IF EXISTS public.wholesalers CASCADE;
DROP TABLE IF EXISTS public.customers CASCADE;

-- Drop any remaining tables that might exist
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        BEGIN
            EXECUTE 'DROP TABLE IF EXISTS public.' || r.tablename || ' CASCADE';
        EXCEPTION WHEN OTHERS THEN
            NULL;
        END;
    END LOOP;
    RAISE NOTICE 'Dropped all remaining tables';
END $$;

-- ===============================================================================
-- STEP 5: DROP ALL FUNCTIONS
-- ===============================================================================

-- Drop all custom functions
DROP FUNCTION IF EXISTS public.handle_updated_at() CASCADE;
DROP FUNCTION IF EXISTS public.generate_order_number() CASCADE;
DROP FUNCTION IF EXISTS public.update_customer_stats() CASCADE;
DROP FUNCTION IF EXISTS public.update_influencer_goal_progress() CASCADE;
DROP FUNCTION IF EXISTS public.check_influencer_achievements() CASCADE;
DROP FUNCTION IF EXISTS public.create_default_influencer_achievements(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.create_default_influencer_goals(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.create_default_influencer_settings(UUID) CASCADE;

-- Drop any other functions in public schema
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT proname, oidvectortypes(proargtypes) as args
        FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public'
        AND proname NOT LIKE 'pg_%'
    ) LOOP
        BEGIN
            EXECUTE 'DROP FUNCTION IF EXISTS public.' || r.proname || '(' || r.args || ') CASCADE';
        EXCEPTION WHEN OTHERS THEN
            NULL;
        END;
    END LOOP;
    RAISE NOTICE 'Dropped all custom functions';
END $$;

-- ===============================================================================
-- STEP 6: DROP ALL SEQUENCES
-- ===============================================================================

-- Drop all sequences
DROP SEQUENCE IF EXISTS order_sequence CASCADE;

-- Drop any other sequences in public schema
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT sequencename FROM pg_sequences WHERE schemaname = 'public') LOOP
        BEGIN
            EXECUTE 'DROP SEQUENCE IF EXISTS public.' || r.sequencename || ' CASCADE';
        EXCEPTION WHEN OTHERS THEN
            NULL;
        END;
    END LOOP;
    RAISE NOTICE 'Dropped all sequences';
END $$;

-- ===============================================================================
-- STEP 7: DROP ALL TYPES (if any custom types exist)
-- ===============================================================================

DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT typname FROM pg_type WHERE typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public') AND typtype = 'e') LOOP
        BEGIN
            EXECUTE 'DROP TYPE IF EXISTS public.' || r.typname || ' CASCADE';
        EXCEPTION WHEN OTHERS THEN
            NULL;
        END;
    END LOOP;
    RAISE NOTICE 'Dropped all custom types';
END $$;

-- ===============================================================================
-- VERIFICATION: Show remaining objects
-- ===============================================================================

-- Show what's left in public schema
SELECT 'Remaining tables:' as info;
SELECT 'Table: ' || tablename as remaining_objects
FROM pg_tables 
WHERE schemaname = 'public'
UNION ALL
SELECT 'View: ' || viewname
FROM pg_views 
WHERE schemaname = 'public'
UNION ALL
SELECT 'Function: ' || proname
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
AND proname NOT LIKE 'pg_%'
UNION ALL
SELECT 'Sequence: ' || sequencename
FROM pg_sequences 
WHERE schemaname = 'public';

-- ===============================================================================
-- COMPLETION MESSAGE
-- ===============================================================================

DO $$ 
BEGIN
    RAISE NOTICE '====================================================';
    RAISE NOTICE 'DATABASE RESET COMPLETED SUCCESSFULLY!';
    RAISE NOTICE '====================================================';
    RAISE NOTICE 'All tables, views, functions, sequences, and policies have been removed.';
    RAISE NOTICE 'You can now run the complete database schema scripts.';
    RAISE NOTICE '====================================================';
END $$;
