-- Add sample live streams for testing
-- Run this in your Supabase SQL Editor

-- First, let's update existing sessions to be live
UPDATE public.live_stream_sessions 
SET 
  status = 'live',
  actual_start_time = NOW() - INTERVAL '20 minutes',
  current_viewers = FLOOR(RANDOM() * 200 + 50)::INTEGER,
  peak_viewers = FLOOR(RANDOM() * 300 + 100)::INTEGER,
  total_unique_viewers = FLOOR(RANDOM() * 500 + 200)::INTEGER,
  thumbnail_url = '/lovable-uploads/f8d1a83b-970d-4d3a-966a-e0e1deaddb20.png'
WHERE status = 'scheduled'
LIMIT 2;

-- Insert additional live streams if needed
INSERT INTO public.live_stream_sessions (
  influencer_id,
  title,
  description,
  status,
  scheduled_start_time,
  actual_start_time,
  current_viewers,
  peak_viewers,
  total_unique_viewers,
  thumbnail_url,
  visibility
) VALUES 
(
  'dbf31c88-dd6a-4a9d-af7d-1db49ceace81', -- shivi123's ID
  '🔥 Fashion Haul - Winter Collection',
  'Showcasing the latest winter fashion trends and exclusive deals!',
  'live',
  NOW() - INTERVAL '30 minutes',
  NOW() - INTERVAL '25 minutes',
  156,
  203,
  445,
  '/lovable-uploads/f8d1a83b-970d-4d3a-966a-e0e1deaddb20.png',
  'public'
),
(
  'dbf31c88-dd6a-4a9d-af7d-1db49ceace81', -- shivi123's ID
  '📱 Tech Review - Latest Gadgets',
  'Reviewing the newest smartphones and accessories with live demos!',
  'live',
  NOW() - INTERVAL '15 minutes',
  NOW() - INTERVAL '10 minutes',
  89,
  124,
  267,
  '/lovable-uploads/9f9465c9-14a1-4b53-b185-257751bc97c5.png',
  'public'
);

-- Verify the live streams
SELECT 
  id,
  title,
  status,
  current_viewers,
  actual_start_time,
  stage_name,
  follower_count
FROM public.live_sessions_with_influencer 
WHERE status = 'live'
ORDER BY actual_start_time DESC;