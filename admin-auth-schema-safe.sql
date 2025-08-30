-- Safe Admin Authentication System - Database Schema
-- This can be run multiple times without errors
-- Run this in your Supabase SQL editor

-- Create admin_users table for separate admin authentication (safe)
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    secret_key VARCHAR(100) NOT NULL,
    full_name VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for admin_users (safe to run multiple times)
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Grant access (safe to run multiple times)
GRANT ALL ON public.admin_users TO authenticated;
GRANT SELECT ON public.admin_users TO anon;

-- Create or replace functions (safe to run multiple times)
CREATE OR REPLACE FUNCTION public.verify_admin_credentials(
    p_email VARCHAR(255),
    p_password TEXT,
    p_secret_key VARCHAR(100)
)
RETURNS TABLE(
    admin_id UUID,
    email VARCHAR(255),
    full_name VARCHAR(100),
    is_active BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        au.id,
        au.email,
        au.full_name,
        au.is_active
    FROM public.admin_users au
    WHERE au.email = p_email 
      AND au.password_hash = crypt(p_password, au.password_hash)
      AND au.secret_key = p_secret_key
      AND au.is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.create_admin_user(
    p_email VARCHAR(255),
    p_password TEXT,
    p_secret_key VARCHAR(100),
    p_full_name VARCHAR(100) DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    new_admin_id UUID;
BEGIN
    -- Check if email already exists
    IF EXISTS (SELECT 1 FROM public.admin_users WHERE email = p_email) THEN
        RAISE EXCEPTION 'Admin user with this email already exists';
    END IF;
    
    -- Insert new admin user
    INSERT INTO public.admin_users (email, password_hash, secret_key, full_name)
    VALUES (p_email, crypt(p_password, gen_salt('bf')), p_secret_key, p_full_name)
    RETURNING id INTO new_admin_id;
    
    RETURN new_admin_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.update_admin_last_login(p_admin_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.admin_users 
    SET last_login = NOW(), updated_at = NOW()
    WHERE id = p_admin_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Safely create policies
DO $$
BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Admin users can view own record" ON public.admin_users;
    DROP POLICY IF EXISTS "Admin users can update own record" ON public.admin_users;
    
    -- Create new policies
    CREATE POLICY "Admin users can view own record" ON public.admin_users
        FOR SELECT USING (id = auth.uid()::uuid);

    CREATE POLICY "Admin users can update own record" ON public.admin_users
        FOR UPDATE USING (id = auth.uid()::uuid);
END $$;

-- Add admin_user_id column to admin_permissions if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'admin_permissions' AND column_name = 'admin_user_id') THEN
        ALTER TABLE public.admin_permissions ADD COLUMN admin_user_id UUID REFERENCES public.admin_users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_active ON public.admin_users(is_active);
CREATE INDEX IF NOT EXISTS idx_admin_permissions_admin_user_id ON public.admin_permissions(admin_user_id);

-- Grant execute permissions on functions (safe to run multiple times)
GRANT EXECUTE ON FUNCTION public.verify_admin_credentials TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.create_admin_user TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.update_admin_last_login TO anon, authenticated;

-- Comments
COMMENT ON TABLE public.admin_users IS 'Separate authentication table for admin users';
COMMENT ON FUNCTION public.verify_admin_credentials IS 'Verify admin login credentials including secret key';
COMMENT ON FUNCTION public.create_admin_user IS 'Create new admin user with encrypted password';
COMMENT ON FUNCTION public.update_admin_last_login IS 'Update admin user last login timestamp';

-- Success message
SELECT 'Admin authentication schema setup completed successfully!' as status;
