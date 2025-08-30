-- Fix for missing HMS viewer fields
-- Run this if you get "column does not exist" errors

-- Check if the HMS viewer fields exist
DO $$
BEGIN
    -- Add HMS viewer fields if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'influencers' AND column_name = 'hms_viewer_room_code') THEN
        ALTER TABLE public.influencers ADD COLUMN hms_viewer_room_code VARCHAR(255);
        RAISE NOTICE 'Added hms_viewer_room_code column';
    ELSE
        RAISE NOTICE 'hms_viewer_room_code column already exists';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'influencers' AND column_name = 'hms_viewer_auth_token') THEN
        ALTER TABLE public.influencers ADD COLUMN hms_viewer_auth_token TEXT;
        RAISE NOTICE 'Added hms_viewer_auth_token column';
    ELSE
        RAISE NOTICE 'hms_viewer_auth_token column already exists';
    END IF;

    -- Add followers_count if it doesn't exist (commonly missing)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'influencers' AND column_name = 'followers_count') THEN
        ALTER TABLE public.influencers ADD COLUMN followers_count INTEGER DEFAULT 0;
        RAISE NOTICE 'Added followers_count column';
    ELSE
        RAISE NOTICE 'followers_count column already exists';
    END IF;

    -- Add display_name if it doesn't exist (commonly missing)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'influencers' AND column_name = 'display_name') THEN
        ALTER TABLE public.influencers ADD COLUMN display_name TEXT;
        RAISE NOTICE 'Added display_name column';
    ELSE
        RAISE NOTICE 'display_name column already exists';
    END IF;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_influencers_hms_viewer_room_code ON public.influencers(hms_viewer_room_code);
CREATE INDEX IF NOT EXISTS idx_influencers_hms_viewer_auth_token ON public.influencers(hms_viewer_auth_token);

-- Verify the changes
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'influencers' 
    AND column_name IN ('hms_viewer_room_code', 'hms_viewer_auth_token', 'followers_count', 'display_name')
ORDER BY column_name;

SELECT 'HMS viewer fields setup completed!' as status;