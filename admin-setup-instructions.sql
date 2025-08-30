-- Admin Setup Script - Create First Admin User
-- Run this in your Supabase SQL editor after running admin-auth-schema.sql

-- First, run the admin authentication schema
-- Then use this to create your first admin user

-- Example usage (replace with your actual details):
-- SELECT public.create_admin_user(
--     'admin@yourcompany.com',
--     'your-secure-password',
--     'your-secret-key-123',
--     'Admin User'
-- );

-- To verify your admin user was created:
-- SELECT id, email, full_name, is_active, created_at FROM public.admin_users;

-- Test login function:
-- SELECT * FROM public.verify_admin_credentials(
--     'admin@yourcompany.com',
--     'your-secure-password',
--     'your-secret-key-123'
-- );

COMMENT ON SCHEMA public IS 'Admin authentication system setup complete. Use the create_admin_user function to create your first admin user.';
