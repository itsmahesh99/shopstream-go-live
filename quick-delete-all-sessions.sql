-- Quick Delete All Live Sessions (One-liner)
-- WARNING: This permanently deletes ALL live session data!

-- Delete all sessions
DELETE FROM public.live_stream_sessions;

-- Verify deletion
SELECT COUNT(*) as remaining_sessions FROM public.live_stream_sessions;