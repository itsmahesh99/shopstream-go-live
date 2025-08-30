-- Test script to verify that the user profile tables exist and are properly configured
-- Run this in your Supabase SQL Editor to test the database setup

-- Check if all user tables exist
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('customers', 'wholesalers', 'influencers')
ORDER BY tablename;

-- Check customers table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'customers'
ORDER BY ordinal_position;

-- Check wholesalers table structure  
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'wholesalers'
ORDER BY ordinal_position;

-- Check influencers table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'influencers'
ORDER BY ordinal_position;

-- Test insert permissions (this should work with RLS policies)
-- You can uncomment these to test actual inserts:

/*
-- Test customer insert
INSERT INTO public.customers (
    user_id, 
    email, 
    first_name, 
    last_name, 
    phone
) VALUES (
    gen_random_uuid(), -- This would normally be the auth.users id
    'test@example.com',
    'Test',
    'Customer',
    '+1234567890'
);

-- Test wholesaler insert  
INSERT INTO public.wholesalers (
    user_id,
    email,
    business_name,
    contact_person_name,
    phone
) VALUES (
    gen_random_uuid(), -- This would normally be the auth.users id
    'wholesaler@example.com',
    'Test Business',
    'Test Contact',
    '+1234567890'
);

-- Test influencer insert
INSERT INTO public.influencers (
    user_id,
    email,
    first_name,
    last_name,
    display_name,
    bio
) VALUES (
    gen_random_uuid(), -- This would normally be the auth.users id
    'influencer@example.com',
    'Test',
    'Influencer',
    '@testinfluencer',
    'Test bio for influencer'
);
*/
