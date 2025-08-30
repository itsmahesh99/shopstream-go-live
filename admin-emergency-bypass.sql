-- Emergency Admin Bypass - Use Only for Testing
-- Run this in your Supabase SQL editor

-- Completely disable RLS on all admin-related tables
ALTER TABLE public.admin_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_permissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencers DISABLE ROW LEVEL SECURITY;

-- Grant full access to all tables for testing
GRANT ALL ON public.admin_users TO anon, authenticated;
GRANT ALL ON public.admin_permissions TO anon, authenticated;
GRANT ALL ON public.influencers TO anon, authenticated;

-- Create a super simple admin validation
CREATE OR REPLACE FUNCTION public.validate_admin_simple(p_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (SELECT 1 FROM public.admin_users WHERE email = p_email AND is_active = true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.validate_admin_simple TO anon, authenticated;

SELECT 'Emergency admin bypass activated - admin system should work now!' as status;
