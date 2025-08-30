-- Check the current schema of the influencers table
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'influencers' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check if the new HMS viewer fields exist
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'influencers' 
    AND column_name IN ('hms_viewer_room_code', 'hms_viewer_auth_token', 'followers_count')
ORDER BY column_name;

-- Check if there are any live stream sessions to test with
SELECT 
    id,
    title,
    status,
    influencer_id,
    room_code,
    created_at
FROM live_stream_sessions 
ORDER BY created_at DESC 
LIMIT 5;