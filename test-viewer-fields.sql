-- Test script to verify viewer HMS fields are working correctly

-- Check if the new columns exist
SELECT 
    table_name,
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'influencers' 
    AND column_name IN ('hms_viewer_room_code', 'hms_viewer_auth_token')
ORDER BY column_name;

-- Check if the indexes exist
SELECT 
    indexname,
    tablename,
    indexdef
FROM pg_indexes 
WHERE tablename = 'influencers' 
    AND indexname LIKE '%viewer%';

-- Test the updated admin function (if it exists)
SELECT 
    'admin_get_all_influencers' as function_name,
    COUNT(*) as parameter_count
FROM information_schema.parameters 
WHERE specific_name IN (
    SELECT specific_name 
    FROM information_schema.routines 
    WHERE routine_name = 'admin_get_all_influencers'
);

-- Test inserting sample data (optional - only run if you want to test)
-- INSERT INTO public.influencers (
--     email, 
--     first_name, 
--     last_name, 
--     hms_room_code, 
--     hms_auth_token,
--     hms_viewer_room_code,
--     hms_viewer_auth_token,
--     is_streaming_enabled
-- ) VALUES (
--     'test@example.com',
--     'Test',
--     'User',
--     'ROOM_TEST_001',
--     'HMS_BROADCASTER_TOKEN_123',
--     'VIEWER_TEST_001', 
--     'HMS_VIEWER_TOKEN_123',
--     true
-- ) ON CONFLICT (email) DO NOTHING;

SELECT 'Database schema verification complete!' as status;