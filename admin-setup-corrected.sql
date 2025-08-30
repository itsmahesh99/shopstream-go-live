-- Admin Panel Migration Script for Existing Schema
-- Run this in your Supabase SQL editor

-- Add new columns to influencers table for HMS auth tokens
ALTER TABLE public.influencers 
ADD COLUMN IF NOT EXISTS hms_room_code VARCHAR(255),
ADD COLUMN IF NOT EXISTS hms_auth_token TEXT,
ADD COLUMN IF NOT EXISTS hms_room_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS token_expires_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS token_created_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS is_streaming_enabled BOOLEAN DEFAULT false;

-- Create admin permissions table
CREATE TABLE IF NOT EXISTS public.admin_permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'admin',
    permissions JSONB DEFAULT '{"manage_influencers": true, "view_analytics": true, "manage_tokens": true}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.admin_permissions ENABLE ROW LEVEL SECURITY;

-- Create policy for admin permissions (drop if exists first)
DROP POLICY IF EXISTS "Admins can manage admin permissions" ON public.admin_permissions;
CREATE POLICY "Admins can manage admin permissions" ON public.admin_permissions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.admin_permissions ap 
            WHERE ap.user_id = auth.uid() 
            AND ap.permissions->>'manage_influencers' = 'true'
        )
    );

-- Grant access
GRANT ALL ON public.admin_permissions TO authenticated;

-- Insert a default admin user (replace with your actual user ID)
-- You can get your user ID by running: SELECT auth.uid();
-- INSERT INTO public.admin_permissions (user_id, role, permissions)
-- VALUES ('your-user-id-here', 'admin', '{"manage_influencers": true, "view_analytics": true, "manage_tokens": true}');

-- Create view for admin analytics using influencers table
CREATE OR REPLACE VIEW public.influencer_analytics_admin AS
SELECT 
    i.id,
    i.email,
    i.first_name,
    i.last_name,
    i.display_name,
    'influencer' as role,
    i.hms_room_code,
    i.hms_auth_token IS NOT NULL as has_auth_token,
    i.is_streaming_enabled,
    i.token_created_at,
    i.created_at as profile_created_at,
    i.updated_at as profile_updated_at,
    -- Stream statistics
    COUNT(ls.id) as total_streams,
    COALESCE(SUM(ls.total_unique_viewers), 0) as total_viewers,
    COALESCE(AVG(ls.total_unique_viewers), 0) as avg_viewers_per_stream,
    COALESCE(MAX(ls.peak_viewers), 0) as max_peak_viewers,
    -- Recent activity
    MAX(ls.actual_start_time) as last_stream_date,
    COUNT(CASE WHEN ls.actual_start_time >= NOW() - INTERVAL '30 days' THEN 1 END) as streams_last_30_days,
    COUNT(CASE WHEN ls.status = 'live' THEN 1 END) as currently_live_streams,
    i.verification_status,
    i.is_verified,
    i.is_active
FROM public.influencers i
LEFT JOIN public.live_sessions ls ON i.id = ls.influencer_id
GROUP BY i.id, i.email, i.first_name, i.last_name, i.display_name, 
         i.hms_room_code, i.hms_auth_token, i.is_streaming_enabled, 
         i.token_created_at, i.created_at, i.updated_at, i.verification_status, 
         i.is_verified, i.is_active;

-- Grant access to the view
GRANT SELECT ON public.influencer_analytics_admin TO authenticated;

-- Note: Views cannot have RLS policies directly. 
-- Access control is handled through the underlying tables (influencers and live_sessions)
-- which already have appropriate RLS policies for admin access.

-- Update existing policies to allow admin access to influencers table
DROP POLICY IF EXISTS "Admins can manage all influencers" ON public.influencers;
CREATE POLICY "Admins can manage all influencers" ON public.influencers
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.admin_permissions ap 
            WHERE ap.user_id = auth.uid() 
            AND ap.permissions->>'manage_influencers' = 'true'
        )
    );

COMMENT ON TABLE public.admin_permissions IS 'Admin user permissions for managing the platform';
COMMENT ON VIEW public.influencer_analytics_admin IS 'Analytics view for admin panel showing influencer performance and status';
