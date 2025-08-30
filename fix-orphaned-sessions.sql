-- Fix Orphaned Live Sessions
-- Run this to clean up sessions that are stuck in 'live' status

-- Step 1: Find sessions that have been 'live' for more than 4 hours (likely orphaned)
SELECT 
  id,
  title,
  influencer_id,
  status,
  actual_start_time,
  EXTRACT(EPOCH FROM (NOW() - actual_start_time))/3600 as hours_live
FROM public.live_stream_sessions 
WHERE 
  status = 'live' 
  AND actual_start_time IS NOT NULL 
  AND actual_start_time < NOW() - INTERVAL '4 hours'
ORDER BY actual_start_time;

-- Step 2: End sessions that have been live for more than 4 hours
UPDATE public.live_stream_sessions 
SET 
  status = 'ended',
  actual_end_time = NOW(),
  updated_at = NOW()
WHERE 
  status = 'live' 
  AND actual_start_time IS NOT NULL 
  AND actual_start_time < NOW() - INTERVAL '4 hours';

-- Step 3: End sessions that are 'live' but have no actual_start_time (invalid state)
UPDATE public.live_stream_sessions 
SET 
  status = 'ended',
  actual_end_time = NOW(),
  updated_at = NOW()
WHERE 
  status = 'live' 
  AND actual_start_time IS NULL;

-- Step 4: Verify cleanup
SELECT 
  status,
  COUNT(*) as count,
  MIN(actual_start_time) as oldest_start,
  MAX(actual_start_time) as newest_start
FROM public.live_stream_sessions 
GROUP BY status
ORDER BY status;

-- Success message
DO $$ 
BEGIN 
  RAISE NOTICE 'Orphaned sessions cleanup complete!';
END $$;