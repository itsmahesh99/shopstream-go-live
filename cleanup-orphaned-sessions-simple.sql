-- Simple Cleanup: End Orphaned Live Sessions
-- Run this in your Supabase SQL Editor

-- End sessions that have been live for more than 4 hours (likely abandoned)
UPDATE public.live_stream_sessions 
SET 
  status = 'ended',
  actual_end_time = NOW(),
  updated_at = NOW()
WHERE 
  status = 'live' 
  AND actual_start_time IS NOT NULL 
  AND actual_start_time < NOW() - INTERVAL '4 hours';

-- End sessions that are 'live' but have no start time (invalid state)
UPDATE public.live_stream_sessions 
SET 
  status = 'ended',
  actual_end_time = NOW(),
  updated_at = NOW()
WHERE 
  status = 'live' 
  AND actual_start_time IS NULL;

-- Check results
SELECT 
  status,
  COUNT(*) as count
FROM public.live_stream_sessions 
GROUP BY status
ORDER BY status;