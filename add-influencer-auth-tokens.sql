-- Add auth token and room code fields to influencer profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS hms_auth_token TEXT,
ADD COLUMN IF NOT EXISTS hms_room_code TEXT,
ADD COLUMN IF NOT EXISTS hms_room_id TEXT,
ADD COLUMN IF NOT EXISTS token_expires_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS is_streaming_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS last_stream_at TIMESTAMP WITH TIME ZONE;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_hms_room_code ON public.profiles(hms_room_code);
CREATE INDEX IF NOT EXISTS idx_profiles_hms_auth_token ON public.profiles(hms_auth_token);

-- Add RLS policies for admin access
CREATE POLICY "Admins can manage all influencer tokens" ON public.profiles
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles admin_profile
    WHERE admin_profile.id = auth.uid()
    AND admin_profile.role = 'admin'
  )
);

-- Update existing influencers with default streaming enabled status
UPDATE public.profiles 
SET is_streaming_enabled = true 
WHERE role = 'influencer' AND is_streaming_enabled IS NULL;

-- Add comment for documentation
COMMENT ON COLUMN public.profiles.hms_auth_token IS 'Pre-generated HMS auth token for influencer streaming';
COMMENT ON COLUMN public.profiles.hms_room_code IS 'Assigned HMS room code for influencer';
COMMENT ON COLUMN public.profiles.hms_room_id IS 'Full HMS room ID for influencer';
COMMENT ON COLUMN public.profiles.token_expires_at IS 'When the auth token expires and needs refresh';
COMMENT ON COLUMN public.profiles.is_streaming_enabled IS 'Whether influencer is allowed to stream';
COMMENT ON COLUMN public.profiles.last_stream_at IS 'Last time influencer went live';
