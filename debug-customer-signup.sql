-- Test customer profile creation directly
-- This script helps debug customer signup issues

-- First, let's check if the customers table exists and its structure
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'customers' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check if there are any customers in the table
SELECT COUNT(*) as total_customers FROM public.customers;

-- Check recent customer records (last 10)
SELECT 
    id,
    user_id,
    first_name,
    last_name,
    email,
    phone,
    created_at
FROM public.customers 
ORDER BY created_at DESC 
LIMIT 10;

-- Check auth.users for recent signups
SELECT 
    id,
    email,
    email_confirmed_at,
    created_at,
    raw_user_meta_data
FROM auth.users 
WHERE raw_user_meta_data->>'role' = 'customer'
ORDER BY created_at DESC 
LIMIT 10;

-- Check for any auth users that don't have corresponding customer profiles
SELECT 
    u.id as user_id,
    u.email,
    u.email_confirmed_at,
    u.raw_user_meta_data->>'role' as role,
    c.id as customer_profile_id
FROM auth.users u
LEFT JOIN public.customers c ON u.id = c.user_id
WHERE u.raw_user_meta_data->>'role' = 'customer'
AND c.id IS NULL
ORDER BY u.created_at DESC;
