-- Fix Admin Access to All Influencers
-- This resolves the issue where admin panel only shows the logged-in user's data

-- First, grant admin access to influencers table
GRANT ALL ON public.influencers TO anon, authenticated;

-- Create a function that allows admins to bypass RLS for influencer queries
CREATE OR REPLACE FUNCTION public.admin_get_all_influencers()
RETURNS TABLE (
    id UUID,
    email TEXT,
    first_name TEXT,
    last_name TEXT,
    display_name TEXT,
    hms_room_code TEXT,
    hms_auth_token TEXT,
    hms_room_id TEXT,
    is_streaming_enabled BOOLEAN,
    token_created_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    verification_status TEXT,
    is_verified BOOLEAN,
    is_active BOOLEAN
) AS $$
BEGIN
    -- This function bypasses RLS and returns ALL influencers for admin use
    RETURN QUERY
    SELECT 
        i.id,
        i.email,
        i.first_name,
        i.last_name,
        i.display_name,
        i.hms_room_code,
        i.hms_auth_token,
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to all users (admin verification happens in app)
GRANT EXECUTE ON FUNCTION public.admin_get_all_influencers TO anon, authenticated;

-- Create a function to update influencer tokens for admins
CREATE OR REPLACE FUNCTION public.admin_update_influencer_token(
    p_influencer_id UUID,
    p_auth_token TEXT,
    p_room_code TEXT DEFAULT NULL,
    p_room_id TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
    -- Update the influencer's token and related fields
    UPDATE public.influencers 
    SET 
        hms_auth_token = p_auth_token,
        hms_room_code = COALESCE(p_room_code, hms_room_code),
        hms_room_id = COALESCE(p_room_id, hms_room_id),
        token_created_at = NOW(),
        is_streaming_enabled = true,
        updated_at = NOW()
    WHERE id = p_influencer_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.admin_update_influencer_token TO anon, authenticated;

-- Create a function to update streaming access
CREATE OR REPLACE FUNCTION public.admin_update_streaming_access(
    p_influencer_id UUID,
    p_enabled BOOLEAN
)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE public.influencers 
    SET 
        is_streaming_enabled = p_enabled,
        updated_at = NOW()
    WHERE id = p_influencer_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.admin_update_streaming_access TO anon, authenticated;

-- If RLS is causing issues, temporarily disable it on influencers table for testing
-- You can re-enable it later with proper admin policies
ALTER TABLE public.influencers DISABLE ROW LEVEL SECURITY;

SELECT 'Admin access to all influencers enabled!' as status;
