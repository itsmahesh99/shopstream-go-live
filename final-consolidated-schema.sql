-- ===============================================================================
-- FINAL CONSOLIDATED SCHEMA - COMPLETE SHOPSTREAM DATABASE
-- This is the definitive schema combining all features:
-- - Core e-commerce (customers, influencers, products, orders)
-- - Live streaming with 100ms integration
-- - Influencer dashboard with achievements, goals, analytics
-- - Admin panel features
-- - E-commerce live selling integration
-- ===============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgcrypto extension for password hashing
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- USER TABLES (linked to auth.users)
-- =============================================================================

-- 1. CUSTOMERS TABLE
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  date_of_birth DATE,
  gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
  
  -- Address Information
  address_line_1 TEXT,
  address_line_2 TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100) DEFAULT 'India',
  
  -- Preferences
  preferred_language VARCHAR(10) DEFAULT 'en',
  notification_preferences JSONB DEFAULT '{"email": true, "sms": false, "push": true}',
  
  -- Status and Metadata
  is_active BOOLEAN DEFAULT true,
  customer_tier VARCHAR(20) DEFAULT 'bronze' CHECK (customer_tier IN ('bronze', 'silver', 'gold', 'platinum')),
  total_orders INTEGER DEFAULT 0,
  total_spent DECIMAL(12,2) DEFAULT 0.00,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 3. INFLUENCERS TABLE
CREATE TABLE IF NOT EXISTS public.influencers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  display_name VARCHAR(100),
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  
  -- Social Media Information
  instagram_handle VARCHAR(100),
  youtube_channel VARCHAR(100),
  tiktok_handle VARCHAR(100),
  followers_count INTEGER DEFAULT 0,
  
  -- Professional Information
  bio TEXT,
  category VARCHAR(50), -- fashion, beauty, tech, lifestyle, etc.
  experience_years INTEGER DEFAULT 0,
  
  -- Live Streaming
  total_live_sessions INTEGER DEFAULT 0,
  total_viewers INTEGER DEFAULT 0,
  average_session_duration INTEGER DEFAULT 0, -- in minutes
  
  -- Financial Information
  commission_rate DECIMAL(5,2) DEFAULT 15.00, -- Percentage
  total_earnings DECIMAL(12,2) DEFAULT 0.00,
  
  -- HMS Integration for Live Streaming
  hms_viewer_room_code VARCHAR, -- HMS room code for viewers to join this influencer's live streams
  hms_viewer_auth_token TEXT, -- HMS auth token for viewers to authenticate when joining live streams
  
  -- Status and Verification
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);



-- ADMIN USERS TABLE (from admin-auth-schema-safe.sql, more robust)
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

-- ADMIN PERMISSIONS TABLE (from admin-setup-safe.sql)
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

-- Add HMS token columns to influencers (idempotent, only if not present)
-- (For schema file, just add columns if not present)
ALTER TABLE public.influencers ADD COLUMN IF NOT EXISTS hms_room_code VARCHAR(255);
ALTER TABLE public.influencers ADD COLUMN IF NOT EXISTS hms_auth_token TEXT;
ALTER TABLE public.influencers ADD COLUMN IF NOT EXISTS hms_room_id VARCHAR(255);
ALTER TABLE public.influencers ADD COLUMN IF NOT EXISTS token_expires_at TIMESTAMPTZ;
ALTER TABLE public.influencers ADD COLUMN IF NOT EXISTS token_created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.influencers ADD COLUMN IF NOT EXISTS is_streaming_enabled BOOLEAN DEFAULT false;

-- Admin authentication functions (from admin-auth-schema-safe.sql)
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
  IF EXISTS (SELECT 1 FROM public.admin_users WHERE email = p_email) THEN
    RAISE EXCEPTION 'Admin user with this email already exists';
  END IF;
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

-- Create default admin users if they don't exist
DO $$
BEGIN
  -- Check if admin@test.com user already exists
  IF NOT EXISTS (SELECT 1 FROM public.admin_users WHERE email = 'admin@test.com') THEN
    INSERT INTO public.admin_users (email, password_hash, secret_key, full_name, is_active)
    VALUES (
      'admin@test.com',
      crypt('admin123', gen_salt('bf')),
      'admin-secret-key-2024',
      'System Administrator',
      true
    );
    RAISE NOTICE 'Default admin user created: admin@test.com / admin123';
  END IF;

  -- Check if admin@kein.com user already exists
  IF NOT EXISTS (SELECT 1 FROM public.admin_users WHERE email = 'admin@kein.com') THEN
    INSERT INTO public.admin_users (email, password_hash, secret_key, full_name, is_active)
    VALUES (
      'admin@kein.com',
      crypt('admin123', gen_salt('bf')),
      'kein-admin-secret-key-2024',
      'Kein Administrator',
      true
    );
    RAISE NOTICE 'Kein admin user created: admin@kein.com / admin123';
  END IF;
END $$;

-- =============================================================================
-- PRODUCT SYSTEM
-- =============================================================================

-- 4. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  parent_category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  image_url VARCHAR(500),
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
   updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 5. WHOLESALE PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  influencer_id UUID REFERENCES public.influencers(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  
  -- Basic Product Information
  name VARCHAR(255) NOT NULL,
  description TEXT,
  short_description TEXT,
  sku VARCHAR(100),
  barcode VARCHAR(100),
  
  -- Categorization
  brand VARCHAR(100),
  tags TEXT[], -- Array of tags for better search
  
  -- Pricing
  retail_price DECIMAL(10,2) NOT NULL,
  compare_price DECIMAL(10,2), -- Compare at price for showing discounts
  sale_price DECIMAL(10,2),
  discount_percentage DECIMAL(5,2) DEFAULT 0.00,
  
  -- Inventory
  stock_quantity INTEGER DEFAULT 0,
  min_stock_level INTEGER DEFAULT 10,
  max_stock_level INTEGER DEFAULT 1000,
  
  -- Physical Properties
  weight DECIMAL(8,3), -- in kg
  dimensions JSONB, -- {"length": 10, "width": 5, "height": 3} in cm
  color VARCHAR(50),
  size VARCHAR(50),
  
  -- Media
  images JSONB, -- Array of image URLs
  videos JSONB, -- Array of video URLs
  
  -- SEO and Marketing
  meta_title VARCHAR(255),
  meta_description TEXT,
  keywords TEXT[],
  
  -- Status and Flags
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  is_live_stream_eligible BOOLEAN DEFAULT true,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'out_of_stock', 'discontinued')),
  
  -- Ratings and Reviews
  average_rating DECIMAL(3,2) DEFAULT 0.00,
  total_reviews INTEGER DEFAULT 0,
  total_sales INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- =============================================================================
-- LIVE STREAMING SYSTEM
-- =============================================================================

-- 6. LIVE STREAM SESSIONS (moved here before live_products that references it)
CREATE TABLE IF NOT EXISTS public.live_stream_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  influencer_id UUID REFERENCES public.influencers(id) ON DELETE CASCADE NOT NULL,
  
  -- Session Identification
  session_code VARCHAR(20) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  
  -- Scheduling
  scheduled_start_time TIMESTAMP WITH TIME ZONE,
  scheduled_end_time TIMESTAMP WITH TIME ZONE,
  actual_start_time TIMESTAMP WITH TIME ZONE,
  actual_end_time TIMESTAMP WITH TIME ZONE,
  
  -- Status
  status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'ended', 'cancelled')),
  visibility VARCHAR(20) DEFAULT 'public' CHECK (visibility IN ('public', 'private', 'unlisted')),
  
  -- Technical Details
  room_id VARCHAR(255),
  stream_url VARCHAR(500),
  stream_key VARCHAR(255),
  room_code VARCHAR(100),
  hls_url TEXT,
  rtmp_url TEXT,
  recording_url TEXT,
  
  -- Settings
  max_viewers INTEGER DEFAULT 1000,
  is_recording_enabled BOOLEAN DEFAULT true,
  is_chat_enabled BOOLEAN DEFAULT true,
  is_products_showcase BOOLEAN DEFAULT true,
  thumbnail_url TEXT,
  
  -- Metrics
  current_viewers INTEGER DEFAULT 0,
  peak_viewers INTEGER DEFAULT 0,
  total_unique_viewers INTEGER DEFAULT 0,
  total_revenue DECIMAL(12,2) DEFAULT 0.00,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 7. LIVE PRODUCTS TABLE (Streamlined - single table for live selling)
CREATE TABLE IF NOT EXISTS public.live_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    influencer_id UUID REFERENCES public.influencers(id) ON DELETE CASCADE NOT NULL,
    session_id UUID REFERENCES public.live_stream_sessions(id) ON DELETE SET NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    
    -- Basic Product Information
    name VARCHAR(255) NOT NULL,
    description TEXT,
    short_description TEXT,
    sku VARCHAR(100),
    
    -- Categorization
    brand VARCHAR(100),
    tags TEXT[],
    
    -- Pricing (Live Stream Specific)
    price DECIMAL(10,2) NOT NULL,
    compare_at_price DECIMAL(10,2),
    
    -- Limited Inventory
    stock_quantity INTEGER NOT NULL DEFAULT 1,
    original_stock INTEGER NOT NULL DEFAULT 1,
    
    -- Physical Properties
    weight DECIMAL(8,3),
    dimensions JSONB,
    color VARCHAR(50),
    size VARCHAR(50),
    
    -- Media
    images JSONB,
    video_url VARCHAR(500),
    
    -- Live Stream Features
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'sold_out', 'removed', 'featured')),
    is_flash_sale BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    
    -- Performance Metrics
    view_count INTEGER DEFAULT 0,
    click_count INTEGER DEFAULT 0,
    purchase_count INTEGER DEFAULT 0,
    revenue_generated DECIMAL(12,2) DEFAULT 0.00,
    
    -- Source Information
    source_product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- =============================================================================
-- COMMERCE TABLES
-- =============================================================================

-- 8. CART TABLE
CREATE TABLE IF NOT EXISTS public.cart (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  live_product_id UUID REFERENCES public.live_products(id) ON DELETE CASCADE,
  
  -- Cart Details
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
  
  -- Product Variants
  selected_color VARCHAR(50),
  selected_size VARCHAR(50),
  product_options JSONB,
  
  -- Timestamps
  added_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  
  -- Constraints
  CHECK ((product_id IS NOT NULL AND live_product_id IS NULL) OR (product_id IS NULL AND live_product_id IS NOT NULL))
);

-- 9. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  influencer_id UUID REFERENCES public.influencers(id) ON DELETE SET NULL,
  
  -- Order Identification
  order_number VARCHAR(50) UNIQUE NOT NULL,
  
  -- Pricing
  subtotal DECIMAL(12,2) NOT NULL,
  tax_amount DECIMAL(12,2) DEFAULT 0.00,
  shipping_cost DECIMAL(12,2) DEFAULT 0.00,
  discount_amount DECIMAL(12,2) DEFAULT 0.00,
  total_amount DECIMAL(12,2) NOT NULL,
  
  -- Order Status
  status VARCHAR(30) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  payment_status VARCHAR(30) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded', 'partially_refunded')),
  
  -- Shipping Information
  shipping_address JSONB NOT NULL,
  billing_address JSONB,
  shipping_method VARCHAR(50),
  tracking_number VARCHAR(100),
  
  -- Payment Information
  payment_method VARCHAR(50),
  payment_reference VARCHAR(100),
  
  -- Live Stream Connection
  live_session_id UUID,
  influencer_commission DECIMAL(10,2) DEFAULT 0.00,
  
  -- Additional Information
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 10. ORDER ITEMS TABLE (Enhanced for dual product support)
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  live_product_id UUID REFERENCES public.live_products(id) ON DELETE SET NULL,
  
  -- Product Details (snapshot at time of order)
  product_name VARCHAR(255) NOT NULL,
  product_sku VARCHAR(100),
  selected_color VARCHAR(50),
  selected_size VARCHAR(50),
  
  -- Pricing
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
  
  -- Commission
  wholesaler_commission DECIMAL(10,2) DEFAULT 0.00,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  
  -- Constraints
  CHECK ((product_id IS NOT NULL AND live_product_id IS NULL) OR (product_id IS NULL AND live_product_id IS NOT NULL))
);

-- =============================================================================
-- LIVE STREAMING ADDITIONAL TABLES
-- =============================================================================

-- 11. LIVE STREAM VIEWERS
CREATE TABLE IF NOT EXISTS public.live_stream_viewers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES public.live_stream_sessions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Viewer Details
  viewer_type VARCHAR(20) DEFAULT 'customer' CHECK (viewer_type IN ('customer', 'influencer', 'wholesaler', 'anonymous')),
  
  -- Session Tracking
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  left_at TIMESTAMP WITH TIME ZONE,
  watch_duration_minutes INTEGER DEFAULT 0,
  is_still_watching BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 12. LIVE STREAM CHAT
CREATE TABLE IF NOT EXISTS public.live_stream_chat (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES public.live_stream_sessions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Message Details
  message TEXT NOT NULL,
  message_type VARCHAR(20) DEFAULT 'chat' CHECK (message_type IN ('chat', 'reaction', 'system')),
  username VARCHAR(100),
  
  -- Moderation
  is_deleted BOOLEAN DEFAULT false,
  
  -- Timestamps
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- =============================================================================
-- INFLUENCER DASHBOARD SYSTEM
-- =============================================================================

-- 13. INFLUENCER ACHIEVEMENTS
CREATE TABLE IF NOT EXISTS public.influencer_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  influencer_id UUID REFERENCES public.influencers(id) ON DELETE CASCADE NOT NULL,
  
  -- Achievement Details
  achievement_type VARCHAR(50) NOT NULL,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  
  -- Achievement Status
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  progress_value INTEGER DEFAULT 0,
  target_value INTEGER,
  
  -- Metadata
  icon_name VARCHAR(50),
  badge_color VARCHAR(20),
  points_awarded INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 14. INFLUENCER GOALS
CREATE TABLE IF NOT EXISTS public.influencer_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  influencer_id UUID REFERENCES public.influencers(id) ON DELETE CASCADE NOT NULL,
  
  -- Goal Details
  goal_type VARCHAR(50) NOT NULL,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  
  -- Goal Period
  period_type VARCHAR(20) NOT NULL CHECK (period_type IN ('weekly', 'monthly', 'quarterly', 'yearly')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  
  -- Goal Values
  target_value DECIMAL(12,2) NOT NULL,
  current_value DECIMAL(12,2) DEFAULT 0.00,
  unit VARCHAR(20),
  
  -- Status
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'failed', 'paused')),
  completion_percentage DECIMAL(5,2) DEFAULT 0.00,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 15. INFLUENCER EARNINGS
CREATE TABLE IF NOT EXISTS public.influencer_earnings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  influencer_id UUID REFERENCES public.influencers(id) ON DELETE CASCADE NOT NULL,
  live_session_id UUID REFERENCES public.live_stream_sessions(id) ON DELETE SET NULL,
  
  -- Earning Details
  earning_type VARCHAR(50) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  commission_rate DECIMAL(5,2),
  
  -- Order Information
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  
  -- Payment Status
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'paid')),
  payment_date TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 16. INFLUENCER NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.influencer_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  influencer_id UUID REFERENCES public.influencers(id) ON DELETE CASCADE NOT NULL,
  
  -- Notification Details
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  
  -- Status
  is_read BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  read_at TIMESTAMP WITH TIME ZONE
);

-- =============================================================================
-- SUPPORT QUERIES
-- =============================================================================

-- 18. SUPPORT QUERIES
CREATE TABLE IF NOT EXISTS public.queries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  
  -- Query Details
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  category VARCHAR(50) DEFAULT 'general' CHECK (category IN ('general', 'order', 'product', 'payment', 'technical')),
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  
  -- Status and Assignment
  status VARCHAR(30) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  assigned_to UUID REFERENCES public.admin_users(id),
  
  -- Communication
  customer_email VARCHAR(255),
  response TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- =============================================================================
-- VIEWS AND ANALYTICS
-- =============================================================================

-- Admin analytics view (moved here after all tables are defined)
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
  COUNT(ls.id) as total_streams,
  COALESCE(SUM(ls.total_unique_viewers), 0) as total_viewers,
  COALESCE(AVG(ls.total_unique_viewers), 0) as avg_viewers_per_stream,
  COALESCE(MAX(ls.peak_viewers), 0) as max_peak_viewers,
  MAX(ls.actual_start_time) as last_stream_date,
  COUNT(CASE WHEN ls.actual_start_time >= NOW() - INTERVAL '30 days' THEN 1 END) as streams_last_30_days,
  COUNT(CASE WHEN ls.status = 'live' THEN 1 END) as currently_live_streams,
  i.verification_status,
  i.is_verified,
  i.is_active
FROM public.influencers i
LEFT JOIN public.live_stream_sessions ls ON i.id = ls.influencer_id
GROUP BY i.id, i.email, i.first_name, i.last_name, i.display_name, 
     i.hms_room_code, i.hms_auth_token, i.is_streaming_enabled, 
     i.token_created_at, i.created_at, i.updated_at, i.verification_status, 
     i.is_verified, i.is_active;

-- =============================================================================
-- SAMPLE DATA
-- =============================================================================

-- Insert sample categories
INSERT INTO public.categories (name, description, display_order) VALUES 
('Electronics', 'Electronic devices and accessories', 1),
('Fashion', 'Clothing, shoes, and accessories', 2),
('Beauty', 'Cosmetics and personal care products', 3),
('Home & Garden', 'Home improvement and garden supplies', 4)
ON CONFLICT DO NOTHING;

-- =============================================================================
-- MIGRATION: Add Missing Columns to live_stream_sessions Table
-- This adds missing columns that are required by the LiveStreamingService
-- =============================================================================

-- Add missing columns to live_stream_sessions table
ALTER TABLE public.live_stream_sessions 
ADD COLUMN IF NOT EXISTS scheduled_end_time TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS visibility VARCHAR(20) DEFAULT 'public' CHECK (visibility IN ('public', 'private', 'unlisted')),
ADD COLUMN IF NOT EXISTS stream_key VARCHAR(255),
ADD COLUMN IF NOT EXISTS room_code VARCHAR(100),
ADD COLUMN IF NOT EXISTS max_viewers INTEGER DEFAULT 1000,
ADD COLUMN IF NOT EXISTS is_recording_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS is_chat_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS is_products_showcase BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS thumbnail_url TEXT,
ADD COLUMN IF NOT EXISTS hls_url TEXT,
ADD COLUMN IF NOT EXISTS rtmp_url TEXT,
ADD COLUMN IF NOT EXISTS recording_url TEXT;

-- Add missing HMS viewer columns to influencers table
ALTER TABLE public.influencers 
ADD COLUMN IF NOT EXISTS hms_viewer_room_code VARCHAR,
ADD COLUMN IF NOT EXISTS hms_viewer_auth_token TEXT;

-- Create upcoming_streams view for scheduled streams
CREATE OR REPLACE VIEW public.upcoming_streams AS
SELECT 
  ls.*,
  i.display_name,
  i.followers_count,
  ls.scheduled_start_time as full_start_datetime
FROM public.live_stream_sessions ls
JOIN public.influencers i ON ls.influencer_id = i.id
WHERE ls.status = 'scheduled' 
  AND ls.scheduled_start_time > NOW()
  AND ls.visibility = 'public'
ORDER BY ls.scheduled_start_time ASC;

-- Update existing records to have default values for new columns
UPDATE public.live_stream_sessions 
SET 
  visibility = COALESCE(visibility, 'public'),
  max_viewers = COALESCE(max_viewers, 1000),
  is_recording_enabled = COALESCE(is_recording_enabled, true),
  is_chat_enabled = COALESCE(is_chat_enabled, true),
  is_products_showcase = COALESCE(is_products_showcase, true)
WHERE visibility IS NULL 
   OR max_viewers IS NULL 
   OR is_recording_enabled IS NULL 
   OR is_chat_enabled IS NULL 
   OR is_products_showcase IS NULL;

-- =============================================================================
-- ADMIN HMS TOKEN MANAGEMENT FUNCTIONS (Added during session)
-- =============================================================================

-- Function to update HMS tokens and room codes for influencers
CREATE OR REPLACE FUNCTION admin_update_influencer_token(
  p_influencer_id UUID,
  p_auth_token TEXT,
  p_room_code VARCHAR(255),
  p_room_id VARCHAR(255),
  p_viewer_auth_token TEXT DEFAULT NULL,
  p_viewer_room_code VARCHAR DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update the influencer's HMS tokens and room codes
  UPDATE public.influencers 
  SET 
    hms_auth_token = p_auth_token,
    hms_room_code = p_room_code,
    hms_room_id = p_room_id,
    hms_viewer_auth_token = p_viewer_auth_token,
    hms_viewer_room_code = p_viewer_room_code,
    token_created_at = NOW(),
    is_streaming_enabled = true,
    updated_at = NOW()
  WHERE id = p_influencer_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Influencer with ID % not found', p_influencer_id;
  END IF;
  
  RAISE NOTICE 'HMS tokens updated successfully for influencer %', p_influencer_id;
END;
$$;

-- Function to disable/remove HMS tokens for influencers
CREATE OR REPLACE FUNCTION admin_disable_influencer_token(p_influencer_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Disable streaming and clear tokens for the influencer
  UPDATE public.influencers 
  SET 
    hms_auth_token = NULL,
    hms_room_code = NULL,
    hms_room_id = NULL,
    hms_viewer_auth_token = NULL,
    hms_viewer_room_code = NULL,
    is_streaming_enabled = false,
    updated_at = NOW()
  WHERE id = p_influencer_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Influencer with ID % not found', p_influencer_id;
  END IF;
  
  RAISE NOTICE 'HMS tokens disabled for influencer %', p_influencer_id;
END;
$$;

-- Function to update streaming access for influencers
CREATE OR REPLACE FUNCTION admin_update_streaming_access(
  p_influencer_id UUID,
  p_enabled BOOLEAN
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update the influencer's streaming access
  UPDATE public.influencers 
  SET 
    is_streaming_enabled = p_enabled,
    updated_at = NOW()
  WHERE id = p_influencer_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Influencer with ID % not found', p_influencer_id;
  END IF;
  
  RAISE NOTICE 'Streaming access % for influencer %', 
    CASE WHEN p_enabled THEN 'enabled' ELSE 'disabled' END, 
    p_influencer_id;
END;
$$;

-- Admin function to get all influencers using email verification (bypasses RLS)
CREATE OR REPLACE FUNCTION admin_get_all_influencers_by_email(admin_email TEXT)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  email VARCHAR(255),
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  display_name VARCHAR(100),
  hms_room_code VARCHAR(255),
  hms_auth_token TEXT,
  hms_viewer_room_code VARCHAR,
  hms_viewer_auth_token TEXT,
  hms_room_id VARCHAR(255),
  is_streaming_enabled BOOLEAN,
  token_created_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  verification_status VARCHAR(20),
  is_verified BOOLEAN,
  is_active BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the provided email belongs to an active admin
  IF NOT EXISTS (
    SELECT 1 FROM public.admin_users au 
    WHERE au.email = admin_email 
    AND au.is_active = true
  ) THEN
    RAISE EXCEPTION 'Access denied. Invalid admin email or admin is inactive: %', admin_email;
  END IF;

  -- Return all influencers (bypasses RLS because of SECURITY DEFINER)
  RETURN QUERY
  SELECT 
    i.id,
    i.user_id,
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

-- Admin dashboard stats function using email verification
CREATE OR REPLACE FUNCTION get_admin_dashboard_stats_by_email(admin_email TEXT)
RETURNS TABLE(
  total_influencers BIGINT,
  active_streamers BIGINT,
  verified_influencers BIGINT,
  live_streams BIGINT,
  with_broadcaster_tokens BIGINT,
  with_viewer_tokens BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the provided email belongs to an active admin
  IF NOT EXISTS (
    SELECT 1 FROM public.admin_users au 
    WHERE au.email = admin_email 
    AND au.is_active = true
  ) THEN
    RAISE EXCEPTION 'Access denied. Invalid admin email or admin is inactive: %', admin_email;
  END IF;

  -- Return stats (bypasses RLS because of SECURITY DEFINER)
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM public.influencers)::BIGINT as total_influencers,
    (SELECT COUNT(*) FROM public.influencers WHERE is_streaming_enabled = true)::BIGINT as active_streamers,
    (SELECT COUNT(*) FROM public.influencers WHERE is_verified = true)::BIGINT as verified_influencers,
    0::BIGINT as live_streams, -- TODO: Add live streams count when implemented
    (SELECT COUNT(*) FROM public.influencers WHERE hms_auth_token IS NOT NULL)::BIGINT as with_broadcaster_tokens,
    (SELECT COUNT(*) FROM public.influencers WHERE hms_viewer_auth_token IS NOT NULL)::BIGINT as with_viewer_tokens;
END;
$$;

-- =============================================================================
-- VIEWER HMS ACCESS FUNCTIONS (Added during session)
-- =============================================================================

-- Function to get live session with HMS credentials (bypasses RLS for viewers)
CREATE OR REPLACE FUNCTION get_live_session_with_hms_credentials(p_session_id UUID)
RETURNS TABLE(
  -- Session fields
  id UUID,
  influencer_id UUID,
  session_code VARCHAR(20),
  title VARCHAR(255),
  description TEXT,
  scheduled_start_time TIMESTAMPTZ,
  scheduled_end_time TIMESTAMPTZ,
  actual_start_time TIMESTAMPTZ,
  actual_end_time TIMESTAMPTZ,
  status VARCHAR(20),
  visibility VARCHAR(20),
  room_id VARCHAR(255),
  stream_url VARCHAR(500),
  stream_key VARCHAR(255),
  room_code VARCHAR(100),
  hls_url TEXT,
  rtmp_url TEXT,
  recording_url TEXT,
  max_viewers INTEGER,
  is_recording_enabled BOOLEAN,
  is_chat_enabled BOOLEAN,
  is_products_showcase BOOLEAN,
  thumbnail_url TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  -- HMS credentials from influencer
  hms_room_code VARCHAR(255),
  hms_auth_token TEXT,
  hms_viewer_room_code VARCHAR,
  hms_viewer_auth_token TEXT,
  -- Influencer info
  influencer_display_name VARCHAR(100),
  influencer_followers_count INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Return session data with influencer HMS credentials (bypasses RLS)
  RETURN QUERY
  SELECT 
    -- Session fields
    ls.id,
    ls.influencer_id,
    ls.session_code,
    ls.title,
    ls.description,
    ls.scheduled_start_time,
    ls.scheduled_end_time,
    ls.actual_start_time,
    ls.actual_end_time,
    ls.status,
    ls.visibility,
    ls.room_id,
    ls.stream_url,
    ls.stream_key,
    ls.room_code,
    ls.hls_url,
    ls.rtmp_url,
    ls.recording_url,
    ls.max_viewers,
    ls.is_recording_enabled,
    ls.is_chat_enabled,
    ls.is_products_showcase,
    ls.thumbnail_url,
    ls.created_at,
    ls.updated_at,
    -- HMS credentials from influencer
    i.hms_room_code,
    i.hms_auth_token,
    i.hms_viewer_room_code,
    i.hms_viewer_auth_token,
    -- Influencer info
    i.display_name as influencer_display_name,
    i.followers_count as influencer_followers_count
  FROM public.live_stream_sessions ls
  INNER JOIN public.influencers i ON ls.influencer_id = i.id
  WHERE ls.id = p_session_id;
END;
$$;

-- =============================================================================
-- COMPLETION MESSAGE
-- =============================================================================

SELECT 'Final consolidated schema created successfully!' as status,
       'All tables: Users, Products, Commerce, Live Streaming, Influencer Dashboard, Admin' as features,
       'Missing columns added to live_stream_sessions and influencers tables successfully!' as migration_status;