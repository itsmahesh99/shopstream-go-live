-- Add auth token fields to influencers table
-- This will store pre-generated room codes and auth tokens for each influencer

-- Add new columns to store HMS authentication data
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS hms_room_code VARCHAR(255),
ADD COLUMN IF NOT EXISTS hms_auth_token TEXT,
ADD COLUMN IF NOT EXISTS hms_room_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS token_expires_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS token_created_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS is_streaming_enabled BOOLEAN DEFAULT false;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_hms_room_code ON public.profiles(hms_room_code);
CREATE INDEX IF NOT EXISTS idx_profiles_streaming_enabled ON public.profiles(is_streaming_enabled);

-- Add comments for documentation
COMMENT ON COLUMN public.profiles.hms_room_code IS 'Pre-generated HMS room code for this influencer';
COMMENT ON COLUMN public.profiles.hms_auth_token IS 'Pre-generated HMS auth token for broadcasting';
COMMENT ON COLUMN public.profiles.hms_room_id IS 'HMS room ID associated with this influencer';
COMMENT ON COLUMN public.profiles.token_expires_at IS 'When the auth token expires (if applicable)';
COMMENT ON COLUMN public.profiles.token_created_at IS 'When the auth token was created';
COMMENT ON COLUMN public.profiles.is_streaming_enabled IS 'Whether this influencer is allowed to stream';

-- Create a function to generate unique room codes
CREATE OR REPLACE FUNCTION generate_room_code()
RETURNS VARCHAR(8) AS $$
DECLARE
    chars VARCHAR(36) := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    result VARCHAR(8) := '';
    i INTEGER;
BEGIN
    FOR i IN 1..8 LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::INTEGER, 1);
    END LOOP;
    
    -- Ensure uniqueness
    WHILE EXISTS (SELECT 1 FROM public.profiles WHERE hms_room_code = result) LOOP
        result := '';
        FOR i IN 1..8 LOOP
            result := result || substr(chars, floor(random() * length(chars) + 1)::INTEGER, 1);
        END LOOP;
    END LOOP;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Create admin role if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role' AND 'admin' = ANY(enum_range(NULL::user_role))) THEN
        -- If admin role doesn't exist in enum, we'll handle it in the application layer
        -- For now, we'll use a separate admin tracking approach
    END IF;
END $$;

-- Create admin permissions table
CREATE TABLE IF NOT EXISTS public.admin_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'admin',
    permissions JSONB DEFAULT '{"manage_influencers": true, "view_analytics": true, "manage_tokens": true}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    UNIQUE(user_id)
);

-- Add RLS policies for admin permissions
ALTER TABLE public.admin_permissions ENABLE ROW LEVEL SECURITY;

-- Admins can manage admin permissions
CREATE POLICY "Admins can manage admin permissions" ON public.admin_permissions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.admin_permissions ap 
            WHERE ap.user_id = auth.uid() 
            AND ap.permissions->>'manage_influencers' = 'true'
        )
    );

-- Update RLS policies for profiles to allow admin access
CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.admin_permissions ap 
            WHERE ap.user_id = auth.uid() 
            AND ap.permissions->>'manage_influencers' = 'true'
        )
    );

CREATE POLICY "Admins can update all profiles" ON public.profiles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.admin_permissions ap 
            WHERE ap.user_id = auth.uid() 
            AND ap.permissions->>'manage_influencers' = 'true'
        )
    );

-- Create influencer analytics view for admin panel
CREATE OR REPLACE VIEW public.influencer_analytics_admin AS
SELECT 
    p.id,
    p.email,
    p.first_name,
    p.last_name,
    p.display_name,
    p.role,
    p.hms_room_code,
    p.hms_auth_token IS NOT NULL as has_auth_token,
    p.is_streaming_enabled,
    p.token_created_at,
    p.created_at as profile_created_at,
    p.updated_at as profile_updated_at,
    -- Stream statistics
    COUNT(ls.id) as total_streams,
    COALESCE(SUM(ls.total_unique_viewers), 0) as total_viewers,
    COALESCE(AVG(ls.total_unique_viewers), 0) as avg_viewers_per_stream,
    COALESCE(MAX(ls.peak_viewers), 0) as max_peak_viewers,
    -- Recent activity
    MAX(ls.started_at) as last_stream_date,
    COUNT(CASE WHEN ls.started_at >= NOW() - INTERVAL '30 days' THEN 1 END) as streams_last_30_days,
    COUNT(CASE WHEN ls.status = 'live' THEN 1 END) as currently_live_streams
FROM public.profiles p
LEFT JOIN public.live_sessions_with_influencer ls ON p.id = ls.influencer_id
WHERE p.role = 'influencer'
GROUP BY p.id, p.email, p.first_name, p.last_name, p.display_name, p.role, 
         p.hms_room_code, p.hms_auth_token, p.is_streaming_enabled, 
         p.token_created_at, p.created_at, p.updated_at;

-- Grant access to admin analytics view
GRANT SELECT ON public.influencer_analytics_admin TO authenticated;

-- Add RLS policy for admin analytics view
ALTER TABLE public.influencer_analytics_admin ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view influencer analytics" ON public.influencer_analytics_admin
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.admin_permissions ap 
            WHERE ap.user_id = auth.uid() 
            AND ap.permissions->>'view_analytics' = 'true'
        )
    );

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_admin_permissions_updated_at 
    BEFORE UPDATE ON public.admin_permissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin user (you'll need to update this with actual admin user ID)
-- This is just a placeholder - you should run this manually with the correct user ID
-- INSERT INTO public.admin_permissions (user_id, role, permissions)
-- VALUES ('your-admin-user-id-here', 'admin', '{"manage_influencers": true, "view_analytics": true, "manage_tokens": true}')
-- ON CONFLICT (user_id) DO NOTHING;

COMMENT ON TABLE public.admin_permissions IS 'Admin user permissions for managing the platform';
COMMENT ON VIEW public.influencer_analytics_admin IS 'Analytics view for admin panel showing influencer performance and status';
