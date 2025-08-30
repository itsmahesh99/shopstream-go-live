-- Simple Version: Prevent Multiple Live Streams Per Influencer
-- Run this in your Supabase SQL Editor (no complex triggers)

-- Step 1: End duplicate live streams (keep only the most recent one per influencer)
WITH ranked_streams AS (
  SELECT 
    id,
    influencer_id,
    ROW_NUMBER() OVER (PARTITION BY influencer_id ORDER BY actual_start_time DESC NULLS LAST, created_at DESC) as rn
  FROM public.live_stream_sessions 
  WHERE status = 'live'
)
UPDATE public.live_stream_sessions 
SET 
  status = 'ended',
  actual_end_time = NOW(),
  updated_at = NOW()
WHERE id IN (
  SELECT id FROM ranked_streams WHERE rn > 1
);

-- Step 2: Add unique constraint to prevent multiple live streams per influencer
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_live_stream_per_influencer 
ON public.live_stream_sessions (influencer_id) 
WHERE status = 'live';

-- Step 3: Verify - check for any remaining duplicate live streams
SELECT 
  influencer_id,
  COUNT(*) as live_streams_count,
  STRING_AGG(title, ', ') as stream_titles
FROM public.live_stream_sessions 
WHERE status = 'live'
GROUP BY influencer_id
HAVING COUNT(*) > 1;

-- Expected result: No rows returned (no duplicates)