-- Add viewer-specific HMS fields to influencers table (SAFE VERSION)
-- This allows manual assignment of HMS room code and auth token for viewers

DO $$
BEGIN
    -- Add new columns for viewer HMS credentials (only if they don't exist)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'influencers' AND column_name = 'hms_viewer_room_code') THEN
        ALTER TABLE public.influencers ADD COLUMN hms_viewer_room_code VARCHAR(255);
        RAISE NOTICE 'Added column hms_viewer_room_code';
    ELSE
        RAISE NOTICE 'Column hms_viewer_room_code already exists';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'influencers' AND column_name = 'hms_viewer_auth_token') THEN
        ALTER TABLE public.influencers ADD COLUMN hms_viewer_auth_token TEXT;
        RAISE NOTICE 'Added column hms_viewer_auth_token';
    ELSE
        RAISE NOTICE 'Column hms_viewer_auth_token already exists';
    END IF;
END $$;

-- Create indexes for faster lookups (only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_influencers_hms_viewer_room_code ON public.influencers(hms_viewer_room_code);
CREATE INDEX IF NOT EXISTS idx_influencers_hms_viewer_auth_token ON public.influencers(hms_viewer_auth_token);

-- Add comments for documentation
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'influencers' AND column_name = 'hms_viewer_room_code') THEN
        EXECUTE 'COMMENT ON COLUMN public.influencers.hms_viewer_room_code IS ''HMS room code for viewers to join this influencer''''s live streams''';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'influencers' AND column_name = 'hms_viewer_auth_token') THEN
        EXECUTE 'COMMENT ON COLUMN public.influencers.hms_viewer_auth_token IS ''HMS auth token for viewers to authenticate when joining live streams''';
    END IF;
END $$;

-- Drop and recreate the admin function to include new fields (if it exists)
DROP FUNCTION IF EXISTS admin_get_all_influencers();

CREATE OR REPLACE FUNCTION admin_get_all_influencers()
RETURNS TABLE (
    id UUID,
    email TEXT,
    first_name TEXT,
    last_name TEXT,
    display_name TEXT,
    hms_room_code TEXT,
    hms_auth_token TEXT,
    hms_viewer_room_code TEXT,
    hms_viewer_auth_token TEXT,
    hms_room_id TEXT,
    is_streaming_enabled BOOLEAN,
    token_created_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    verification_status TEXT,
    is_verified BOOLEAN,
    is_active BOOLEAN
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        i.id,
        i.email,
        i.first_name,
        i.last_name,
        i.display_name,
        i.hms_room_code,
        i.hms_auth_token,
        i.hms_viewer_room_code,
        i.hms_viewer_auth_token,
        i.hms_room_id,
        i.is_streaming_enabled,
        i.token_created_at,
        i.created_at,
        i.updated_at,
        i.verification_status,
        i.is_verified,
        i.is_active
    FROM public.influencers i
    ORDER BY i.created_at DESC;
END;
$$;

-- Drop and recreate the admin update function to handle viewer fields
DROP FUNCTION IF EXISTS admin_update_influencer_token(UUID, TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS admin_update_influencer_token(UUID, TEXT, TEXT, TEXT, TEXT, TEXT);

CREATE OR REPLACE FUNCTION admin_update_influencer_token(
    p_influencer_id UUID,
    p_auth_token TEXT,
    p_room_code TEXT DEFAULT NULL,
    p_room_id TEXT DEFAULT NULL,
    p_viewer_auth_token TEXT DEFAULT NULL,
    p_viewer_room_code TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.influencers 
    SET 
        hms_auth_token = p_auth_token,
        hms_room_code = COALESCE(p_room_code, hms_room_code),
        hms_room_id = COALESCE(p_room_id, hms_room_id),
        hms_viewer_auth_token = COALESCE(p_viewer_auth_token, hms_viewer_auth_token),
        hms_viewer_room_code = COALESCE(p_viewer_room_code, hms_viewer_room_code),
        token_created_at = NOW(),
        updated_at = NOW()
    WHERE id = p_influencer_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Influencer with ID % not found', p_influencer_id;
    END IF;
    
    RAISE NOTICE 'Updated influencer % with tokens', p_influencer_id;
END;
$$;

-- Verify the changes
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'influencers' 
    AND column_name IN ('hms_viewer_room_code', 'hms_viewer_auth_token')
ORDER BY column_name;

SELECT 'Viewer HMS fields migration completed successfully!' as status;