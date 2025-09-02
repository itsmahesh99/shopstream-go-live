-- Quick fix: Make existing streams live for testing
-- Run this in your Supabase SQL Editor

UPDATE public.live_stream_sessions 
SET 
  status = 'live',
  actual_start_time = NOW() - INTERVAL '20 minutes',
  current_viewers = FLOOR(RANDOM() * 200 + 50)::INTEGER,
  peak_viewers = FLOOR(RANDOM() * 300 + 100)::INTEGER,
  total_unique_viewers = FLOOR(RANDOM() * 500 + 200)::INTEGER,
  thumbnail_url = CASE 
    WHEN id = (SELECT id FROM public.live_stream_sessions LIMIT 1) 
    THEN '/lovable-uploads/f8d1a83b-970d-4d3a-966a-e0e1deaddb20.png'
    ELSE '/lovable-uploads/9f9465c9-14a1-4b53-b185-257751bc97c5.png'
  END
WHERE status = 'scheduled';

-- Verify the update
SELECT 
  title,
  status,
  current_viewers,
  stage_name,
  follower_count
FROM public.live_sessions_with_influencer 
WHERE status = 'live';