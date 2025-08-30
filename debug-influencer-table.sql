-- Check if the influencers table has the correct RLS policies
-- Run this in your Supabase SQL editor to verify policies

-- 1. Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'influencers';

-- 2. Check existing policies
SELECT policyname, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'influencers';

-- 3. Check for any constraints that might be causing issues
SELECT 
    tc.constraint_name,
    tc.constraint_type,
    cc.check_clause
FROM information_schema.table_constraints tc
LEFT JOIN information_schema.check_constraints cc 
    ON tc.constraint_name = cc.constraint_name
WHERE tc.table_name = 'influencers'
    AND tc.table_schema = 'public';

-- 4. Check column definitions
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns
WHERE table_name = 'influencers'
    AND table_schema = 'public'
ORDER BY ordinal_position;
