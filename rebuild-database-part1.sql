-- ===============================================================================
-- COMPLETE DATABASE REBUILD SCRIPT
-- This script creates the entire database schema from scratch
-- Run this AFTER running reset-database.sql
-- ===============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$ 
BEGIN
    RAISE NOTICE '====================================================';
    RAISE NOTICE 'STARTING COMPLETE DATABASE REBUILD';
    RAISE NOTICE '====================================================';
END $$;

-- =============================================================================
-- USER TABLES (linked to auth.users)
-- =============================================================================

-- 1. CUSTOMERS TABLE
CREATE TABLE public.customers (
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

-- 2. WHOLESALERS TABLE
CREATE TABLE public.wholesalers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  business_name VARCHAR(255) NOT NULL,
  contact_person_name VARCHAR(100),
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  
  -- Business Information
  business_registration_number VARCHAR(100),
  gst_number VARCHAR(20),
  pan_number VARCHAR(20),
  business_type VARCHAR(50),
  
  -- Address Information
  business_address_line_1 TEXT,
  business_address_line_2 TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100) DEFAULT 'India',
  
  -- Banking Information
  bank_account_number VARCHAR(50),
  bank_name VARCHAR(100),
  bank_branch VARCHAR(100),
  ifsc_code VARCHAR(20),
  
  -- Business Metrics
  total_products INTEGER DEFAULT 0,
  total_sales DECIMAL(12,2) DEFAULT 0.00,
  commission_rate DECIMAL(5,2) DEFAULT 10.00, -- Percentage
  
  -- Status and Verification
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  verification_date TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 3. INFLUENCERS TABLE
CREATE TABLE public.influencers (
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
  
  -- Status and Verification
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

DO $$ BEGIN RAISE NOTICE 'Created user tables: customers, wholesalers, influencers'; END $$;

-- =============================================================================
-- CORE BUSINESS TABLES
-- =============================================================================

-- 4. PRODUCTS TABLE
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wholesaler_id UUID REFERENCES public.wholesalers(id) ON DELETE CASCADE NOT NULL,
  
  -- Basic Product Information
  name VARCHAR(255) NOT NULL,
  description TEXT,
  short_description TEXT,
  sku VARCHAR(100) UNIQUE,
  barcode VARCHAR(100),
  
  -- Categorization
  category VARCHAR(100),
  subcategory VARCHAR(100),
  brand VARCHAR(100),
  tags TEXT[], -- Array of tags for better search
  
  -- Pricing
  wholesale_price DECIMAL(10,2) NOT NULL,
  retail_price DECIMAL(10,2) NOT NULL,
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

-- 5. CART TABLE
CREATE TABLE public.cart (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  
  -- Cart Details
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
  
  -- Optional: Product Variants
  selected_color VARCHAR(50),
  selected_size VARCHAR(50),
  product_options JSONB, -- For custom options
  
  -- Timestamps
  added_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  
  -- Unique constraint to prevent duplicate entries
  UNIQUE(customer_id, product_id, selected_color, selected_size)
);

-- 6. ORDERS TABLE
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  influencer_id UUID REFERENCES public.influencers(id) ON DELETE SET NULL, -- Optional: if order came from live stream
  
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
  shipping_address JSONB NOT NULL, -- Full address object
  billing_address JSONB, -- Can be different from shipping
  shipping_method VARCHAR(50),
  tracking_number VARCHAR(100),
  estimated_delivery_date DATE,
  actual_delivery_date DATE,
  
  -- Payment Information
  payment_method VARCHAR(50),
  payment_reference VARCHAR(100),
  payment_gateway VARCHAR(50),
  
  -- Live Stream Connection
  live_session_id UUID, -- Reference to live session if applicable
  influencer_commission DECIMAL(10,2) DEFAULT 0.00,
  
  -- Additional Information
  notes TEXT,
  internal_notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 7. ORDER ITEMS TABLE
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  wholesaler_id UUID REFERENCES public.wholesalers(id) ON DELETE SET NULL,
  
  -- Product Details (snapshot at time of order)
  product_name VARCHAR(255) NOT NULL,
  product_sku VARCHAR(100),
  selected_color VARCHAR(50),
  selected_size VARCHAR(50),
  
  -- Pricing
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
  
  -- Wholesaler Commission
  wholesaler_commission DECIMAL(10,2) DEFAULT 0.00,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 8. QUERIES/SUPPORT TICKETS TABLE
CREATE TABLE public.queries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL, -- Optional: if query is order-related
  
  -- Query Details
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  category VARCHAR(50) DEFAULT 'general' CHECK (category IN ('general', 'order', 'product', 'payment', 'shipping', 'technical', 'complaint')),
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  
  -- Status and Assignment
  status VARCHAR(30) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed', 'escalated')),
  assigned_to UUID, -- Can reference admin/support staff
  
  -- Communication
  customer_email VARCHAR(255),
  customer_phone VARCHAR(20),
  response TEXT,
  internal_notes TEXT,
  
  -- Resolution
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolution_time_hours INTEGER, -- Auto-calculated
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

DO $$ BEGIN RAISE NOTICE 'Created business tables: products, cart, orders, order_items, queries'; END $$;

-- =============================================================================
-- LIVE STREAMING TABLES
-- =============================================================================

-- 9. LIVE SESSIONS TABLE
CREATE TABLE public.live_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  influencer_id UUID REFERENCES public.influencers(id) ON DELETE CASCADE NOT NULL,
  
  -- Session Details
  title VARCHAR(255) NOT NULL,
  description TEXT,
  scheduled_start_time TIMESTAMP WITH TIME ZONE,
  actual_start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER,
  
  -- Session Metrics
  peak_viewers INTEGER DEFAULT 0,
  total_unique_viewers INTEGER DEFAULT 0,
  total_products_showcased INTEGER DEFAULT 0,
  total_sales_generated DECIMAL(12,2) DEFAULT 0.00,
  
  -- Status
  status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'ended', 'cancelled')),
  
  -- Technical Details
  stream_url VARCHAR(500),
  recording_url VARCHAR(500),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 10. LIVE SESSION PRODUCTS TABLE (Products featured in live sessions)
CREATE TABLE public.live_session_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  live_session_id UUID REFERENCES public.live_sessions(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  
  -- Display Details
  display_order INTEGER DEFAULT 0,
  special_price DECIMAL(10,2), -- Live session special price
  is_featured BOOLEAN DEFAULT false,
  
  -- Performance Metrics
  clicks INTEGER DEFAULT 0,
  orders_generated INTEGER DEFAULT 0,
  revenue_generated DECIMAL(12,2) DEFAULT 0.00,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  
  UNIQUE(live_session_id, product_id)
);

DO $$ BEGIN RAISE NOTICE 'Created live streaming tables: live_sessions, live_session_products'; END $$;

-- =============================================================================
-- INFLUENCER DASHBOARD TABLES
-- =============================================================================

-- 11. INFLUENCER ACHIEVEMENTS TABLE
CREATE TABLE public.influencer_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  influencer_id UUID REFERENCES public.influencers(id) ON DELETE CASCADE NOT NULL,
  
  -- Achievement Details
  achievement_type VARCHAR(50) NOT NULL, -- 'stream_master', 'audience_builder', 'revenue_generator', etc.
  title VARCHAR(100) NOT NULL,
  description TEXT,
  criteria JSONB, -- Flexible criteria definition
  
  -- Achievement Status
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  progress_value INTEGER DEFAULT 0, -- Current progress towards achievement
  target_value INTEGER, -- Target value to complete achievement
  
  -- Metadata
  icon_name VARCHAR(50), -- Icon identifier for UI
  badge_color VARCHAR(20), -- Badge color for UI
  points_awarded INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 12. INFLUENCER GOALS TABLE (Monthly/Weekly Goals)
CREATE TABLE public.influencer_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  influencer_id UUID REFERENCES public.influencers(id) ON DELETE CASCADE NOT NULL,
  
  -- Goal Details
  goal_type VARCHAR(50) NOT NULL, -- 'monthly_streams', 'monthly_earnings', 'monthly_followers', etc.
  title VARCHAR(100) NOT NULL,
  description TEXT,
  
  -- Goal Period
  period_type VARCHAR(20) NOT NULL CHECK (period_type IN ('weekly', 'monthly', 'quarterly', 'yearly')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  
  -- Goal Values
  target_value DECIMAL(12,2) NOT NULL,
  current_value DECIMAL(12,2) DEFAULT 0.00,
  unit VARCHAR(20), -- 'streams', 'dollars', 'followers', etc.
  
  -- Status
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'failed', 'paused')),
  completion_percentage DECIMAL(5,2) DEFAULT 0.00,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 13. INFLUENCER EARNINGS TABLE (Detailed earnings tracking)
CREATE TABLE public.influencer_earnings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  influencer_id UUID REFERENCES public.influencers(id) ON DELETE CASCADE NOT NULL,
  live_session_id UUID REFERENCES public.live_sessions(id) ON DELETE SET NULL, -- Optional: session-specific earnings
  
  -- Earning Details
  earning_type VARCHAR(50) NOT NULL, -- 'commission', 'bonus', 'tip', 'sponsorship', etc.
  amount DECIMAL(12,2) NOT NULL,
  commission_rate DECIMAL(5,2), -- Commission rate applied
  gross_sales DECIMAL(12,2), -- Original sales amount (for commission calculations)
  
  -- Order Information (if applicable)
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  
  -- Payment Status
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'paid', 'disputed')),
  payment_date TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  description TEXT,
  notes TEXT,
  
  -- Timestamps
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 14. INFLUENCER ANALYTICS TABLE (Daily/Weekly/Monthly analytics)
CREATE TABLE public.influencer_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  influencer_id UUID REFERENCES public.influencers(id) ON DELETE CASCADE NOT NULL,
  
  -- Analytics Period
  period_type VARCHAR(20) NOT NULL CHECK (period_type IN ('daily', 'weekly', 'monthly')),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  
  -- Streaming Metrics
  total_streams INTEGER DEFAULT 0,
  total_stream_hours DECIMAL(8,2) DEFAULT 0.00,
  average_viewers DECIMAL(8,2) DEFAULT 0.00,
  peak_concurrent_viewers INTEGER DEFAULT 0,
  
  -- Engagement Metrics
  total_viewers INTEGER DEFAULT 0,
  unique_viewers INTEGER DEFAULT 0,
  returning_viewers INTEGER DEFAULT 0,
  average_watch_time DECIMAL(8,2) DEFAULT 0.00, -- in minutes
  
  -- Sales Metrics
  total_sales DECIMAL(12,2) DEFAULT 0.00,
  total_orders INTEGER DEFAULT 0,
  conversion_rate DECIMAL(5,2) DEFAULT 0.00, -- percentage
  average_order_value DECIMAL(10,2) DEFAULT 0.00,
  
  -- Growth Metrics
  new_followers INTEGER DEFAULT 0,
  total_followers_end INTEGER DEFAULT 0,
  follower_growth_rate DECIMAL(5,2) DEFAULT 0.00, -- percentage
  
  -- Earnings
  total_earnings DECIMAL(12,2) DEFAULT 0.00,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  
  -- Ensure unique period per influencer
  UNIQUE(influencer_id, period_type, period_start, period_end)
);

-- 15. INFLUENCER NOTIFICATIONS TABLE
CREATE TABLE public.influencer_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  influencer_id UUID REFERENCES public.influencers(id) ON DELETE CASCADE NOT NULL,
  
  -- Notification Details
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'achievement', 'goal_progress', 'earning', 'system', etc.
  priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  
  -- Status
  is_read BOOLEAN DEFAULT false,
  is_deleted BOOLEAN DEFAULT false,
  
  -- Related Data (optional)
  related_type VARCHAR(50), -- 'live_session', 'achievement', 'goal', etc.
  related_id UUID, -- ID of related entity
  
  -- Action URL (optional)
  action_url VARCHAR(500),
  action_text VARCHAR(100),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  read_at TIMESTAMP WITH TIME ZONE,
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- 16. INFLUENCER SETTINGS TABLE
CREATE TABLE public.influencer_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  influencer_id UUID REFERENCES public.influencers(id) ON DELETE CASCADE UNIQUE NOT NULL,
  
  -- Notification Preferences
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT true,
  sms_notifications BOOLEAN DEFAULT false,
  notification_frequency VARCHAR(20) DEFAULT 'instant' CHECK (notification_frequency IN ('instant', 'daily', 'weekly')),
  
  -- Streaming Preferences
  auto_record_streams BOOLEAN DEFAULT true,
  stream_quality VARCHAR(20) DEFAULT 'high' CHECK (stream_quality IN ('low', 'medium', 'high', 'ultra')),
  chat_moderation_level VARCHAR(20) DEFAULT 'medium' CHECK (chat_moderation_level IN ('none', 'low', 'medium', 'high')),
  
  -- Privacy Settings
  profile_visibility VARCHAR(20) DEFAULT 'public' CHECK (profile_visibility IN ('public', 'private', 'followers_only')),
  show_earnings BOOLEAN DEFAULT false,
  show_follower_count BOOLEAN DEFAULT true,
  
  -- Goal Preferences
  default_goal_period VARCHAR(20) DEFAULT 'monthly' CHECK (default_goal_period IN ('weekly', 'monthly', 'quarterly')),
  goal_reminder_frequency VARCHAR(20) DEFAULT 'weekly' CHECK (goal_reminder_frequency IN ('daily', 'weekly', 'monthly')),
  
  -- Dashboard Preferences
  dashboard_theme VARCHAR(20) DEFAULT 'light' CHECK (dashboard_theme IN ('light', 'dark', 'auto')),
  preferred_currency VARCHAR(10) DEFAULT 'USD',
  timezone VARCHAR(50) DEFAULT 'UTC',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

DO $$ BEGIN RAISE NOTICE 'Created influencer dashboard tables: achievements, goals, earnings, analytics, notifications, settings'; END $$;

-- Continue in part 2...
