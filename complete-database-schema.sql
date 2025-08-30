-- Complete E-commerce Database Schema with Live Streaming Features
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================

-- User tables indexes
CREATE INDEX idx_customers_user_id ON public.customers(user_id);
CREATE INDEX idx_customers_email ON public.customers(email);
CREATE INDEX idx_customers_phone ON public.customers(phone);

CREATE INDEX idx_wholesalers_user_id ON public.wholesalers(user_id);
CREATE INDEX idx_wholesalers_email ON public.wholesalers(email);
CREATE INDEX idx_wholesalers_verification_status ON public.wholesalers(verification_status);

CREATE INDEX idx_influencers_user_id ON public.influencers(user_id);
CREATE INDEX idx_influencers_email ON public.influencers(email);
CREATE INDEX idx_influencers_verification_status ON public.influencers(verification_status);

-- Product indexes
CREATE INDEX idx_products_wholesaler_id ON public.products(wholesaler_id);
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_status ON public.products(status);
CREATE INDEX idx_products_sku ON public.products(sku);
CREATE INDEX idx_products_is_active ON public.products(is_active);

-- Cart indexes
CREATE INDEX idx_cart_customer_id ON public.cart(customer_id);
CREATE INDEX idx_cart_product_id ON public.cart(product_id);

-- Order indexes
CREATE INDEX idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX idx_orders_influencer_id ON public.orders(influencer_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_order_number ON public.orders(order_number);
CREATE INDEX idx_orders_created_at ON public.orders(created_at);

-- Order items indexes
CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX idx_order_items_product_id ON public.order_items(product_id);
CREATE INDEX idx_order_items_wholesaler_id ON public.order_items(wholesaler_id);

-- Query indexes
CREATE INDEX idx_queries_customer_id ON public.queries(customer_id);
CREATE INDEX idx_queries_status ON public.queries(status);
CREATE INDEX idx_queries_category ON public.queries(category);
CREATE INDEX idx_queries_created_at ON public.queries(created_at);

-- Live session indexes
CREATE INDEX idx_live_sessions_influencer_id ON public.live_sessions(influencer_id);
CREATE INDEX idx_live_sessions_status ON public.live_sessions(status);
CREATE INDEX idx_live_sessions_scheduled_start_time ON public.live_sessions(scheduled_start_time);

CREATE INDEX idx_live_session_products_session_id ON public.live_session_products(live_session_id);
CREATE INDEX idx_live_session_products_product_id ON public.live_session_products(product_id);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wholesalers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_session_products ENABLE ROW LEVEL SECURITY;

-- Customers policies
CREATE POLICY "Customers can view own profile" ON public.customers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Customers can update own profile" ON public.customers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Customers can insert own profile" ON public.customers FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Wholesalers policies
CREATE POLICY "Wholesalers can view own profile" ON public.wholesalers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Wholesalers can update own profile" ON public.wholesalers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Wholesalers can insert own profile" ON public.wholesalers FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Influencers policies
CREATE POLICY "Influencers can view own profile" ON public.influencers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Influencers can update own profile" ON public.influencers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Influencers can insert own profile" ON public.influencers FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Products policies (public read, wholesaler write)
CREATE POLICY "Anyone can view active products" ON public.products FOR SELECT USING (is_active = true);
CREATE POLICY "Wholesalers can manage own products" ON public.products FOR ALL USING (
  wholesaler_id IN (SELECT id FROM public.wholesalers WHERE user_id = auth.uid())
);

-- Cart policies
CREATE POLICY "Customers can manage own cart" ON public.cart FOR ALL USING (
  customer_id IN (SELECT id FROM public.customers WHERE user_id = auth.uid())
);

-- Orders policies
CREATE POLICY "Customers can view own orders" ON public.orders FOR SELECT USING (
  customer_id IN (SELECT id FROM public.customers WHERE user_id = auth.uid())
);
CREATE POLICY "Wholesalers can view relevant orders" ON public.orders FOR SELECT USING (
  id IN (
    SELECT DISTINCT order_id FROM public.order_items 
    WHERE wholesaler_id IN (SELECT id FROM public.wholesalers WHERE user_id = auth.uid())
  )
);

-- Order items policies
CREATE POLICY "Users can view relevant order items" ON public.order_items FOR SELECT USING (
  order_id IN (SELECT id FROM public.orders WHERE customer_id IN (SELECT id FROM public.customers WHERE user_id = auth.uid()))
  OR wholesaler_id IN (SELECT id FROM public.wholesalers WHERE user_id = auth.uid())
);

-- Queries policies
CREATE POLICY "Customers can manage own queries" ON public.queries FOR ALL USING (
  customer_id IN (SELECT id FROM public.customers WHERE user_id = auth.uid())
);

-- Live sessions policies
CREATE POLICY "Anyone can view live sessions" ON public.live_sessions FOR SELECT USING (true);
CREATE POLICY "Influencers can manage own live sessions" ON public.live_sessions FOR ALL USING (
  influencer_id IN (SELECT id FROM public.influencers WHERE user_id = auth.uid())
);

-- Live session products policies
CREATE POLICY "Anyone can view live session products" ON public.live_session_products FOR SELECT USING (true);
CREATE POLICY "Influencers can manage own live session products" ON public.live_session_products FOR ALL USING (
  live_session_id IN (
    SELECT id FROM public.live_sessions 
    WHERE influencer_id IN (SELECT id FROM public.influencers WHERE user_id = auth.uid())
  )
);

-- =============================================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- =============================================================================

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to all relevant tables
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.wholesalers FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.influencers FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.cart FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.queries FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.live_sessions FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function to generate order numbers
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number = 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(NEXTVAL('order_sequence')::TEXT, 6, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create sequence for order numbers
CREATE SEQUENCE IF NOT EXISTS order_sequence START 1;

-- Apply order number trigger
CREATE TRIGGER generate_order_number BEFORE INSERT ON public.orders FOR EACH ROW EXECUTE FUNCTION public.generate_order_number();

-- Function to update customer statistics
CREATE OR REPLACE FUNCTION public.update_customer_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND OLD.status != NEW.status AND NEW.status = 'delivered') THEN
    UPDATE public.customers 
    SET 
      total_orders = (SELECT COUNT(*) FROM public.orders WHERE customer_id = NEW.customer_id AND status = 'delivered'),
      total_spent = (SELECT COALESCE(SUM(total_amount), 0) FROM public.orders WHERE customer_id = NEW.customer_id AND status = 'delivered')
    WHERE id = NEW.customer_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply customer stats trigger
CREATE TRIGGER update_customer_stats AFTER INSERT OR UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_customer_stats();

-- =============================================================================
-- INITIAL DATA AND CONSTRAINTS
-- =============================================================================

-- Note: Sample data will be added after users create their accounts

-- Create some useful views
CREATE OR REPLACE VIEW public.customer_order_summary AS
SELECT 
  c.id,
  c.first_name,
  c.last_name,
  c.email,
  COUNT(o.id) as total_orders,
  COALESCE(SUM(o.total_amount), 0) as total_spent,
  MAX(o.created_at) as last_order_date
FROM public.customers c
LEFT JOIN public.orders o ON c.id = o.customer_id AND o.status = 'delivered'
GROUP BY c.id, c.first_name, c.last_name, c.email;

CREATE OR REPLACE VIEW public.wholesaler_product_summary AS
SELECT 
  w.id,
  w.business_name,
  w.email,
  COUNT(p.id) as total_products,
  SUM(CASE WHEN p.is_active THEN 1 ELSE 0 END) as active_products,
  AVG(p.retail_price) as average_price
FROM public.wholesalers w
LEFT JOIN public.products p ON w.id = p.wholesaler_id
GROUP BY w.id, w.business_name, w.email;

-- Add comments for documentation
COMMENT ON TABLE public.customers IS 'Stores customer information linked to auth.users';
COMMENT ON TABLE public.wholesalers IS 'Stores wholesaler/supplier information';
COMMENT ON TABLE public.influencers IS 'Stores influencer information for live streaming';
COMMENT ON TABLE public.products IS 'Product catalog managed by wholesalers';
COMMENT ON TABLE public.cart IS 'Shopping cart items for customers';
COMMENT ON TABLE public.orders IS 'Customer orders with full details';
COMMENT ON TABLE public.order_items IS 'Individual items within orders';
COMMENT ON TABLE public.queries IS 'Customer support tickets and queries';
COMMENT ON TABLE public.live_sessions IS 'Live streaming sessions by influencers';
COMMENT ON TABLE public.live_session_products IS 'Products featured in live sessions';

-- =============================================================================
-- RPC FUNCTIONS FOR DEFAULT DATA CREATION
-- =============================================================================

-- Function to create default achievements for new influencers
CREATE OR REPLACE FUNCTION create_default_influencer_achievements(p_influencer_id UUID)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.influencer_achievements (
    influencer_id, 
    achievement_type, 
    title, 
    description, 
    target_value, 
    current_value,
    is_completed,
    created_at
  ) VALUES 
  (p_influencer_id, 'followers', 'First 100 Followers', 'Reach your first 100 followers', 100, 0, false, NOW()),
  (p_influencer_id, 'followers', '1K Followers Club', 'Build a community of 1,000 followers', 1000, 0, false, NOW()),
  (p_influencer_id, 'sessions', 'First Live Session', 'Complete your first live streaming session', 1, 0, false, NOW()),
  (p_influencer_id, 'sessions', 'Streaming Regular', 'Complete 10 live streaming sessions', 10, 0, false, NOW()),
  (p_influencer_id, 'earnings', 'First Sale', 'Earn your first commission', 1, 0, false, NOW()),
  (p_influencer_id, 'earnings', 'Earning Milestone', 'Reach ₹10,000 in total earnings', 10000, 0, false, NOW());
END;
$$ LANGUAGE plpgsql;

-- Function to create default goals for new influencers
CREATE OR REPLACE FUNCTION create_default_influencer_goals(p_influencer_id UUID)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.influencer_goals (
    influencer_id,
    goal_type,
    title,
    description,
    target_value,
    current_value,
    target_date,
    is_completed,
    created_at
  ) VALUES 
  (p_influencer_id, 'followers', 'Monthly Follower Growth', 'Gain 500 new followers this month', 500, 0, DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month', false, NOW()),
  (p_influencer_id, 'sessions', 'Weekly Live Sessions', 'Host 4 live sessions this month', 4, 0, DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month', false, NOW()),
  (p_influencer_id, 'earnings', 'Monthly Earnings Target', 'Earn ₹5,000 this month', 5000, 0, DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month', false, NOW());
END;
$$ LANGUAGE plpgsql;

-- Function to create default settings for new influencers
CREATE OR REPLACE FUNCTION create_default_influencer_settings(p_influencer_id UUID)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.influencer_settings (
    influencer_id,
    notifications_enabled,
    email_notifications,
    push_notifications,
    live_session_reminders,
    achievement_notifications,
    goal_reminders,
    privacy_level,
    profile_visibility,
    session_auto_record,
    created_at,
    updated_at
  ) VALUES (
    p_influencer_id,
    true,    -- notifications_enabled
    true,    -- email_notifications  
    true,    -- push_notifications
    true,    -- live_session_reminders
    true,    -- achievement_notifications
    true,    -- goal_reminders
    'public', -- privacy_level
    'public', -- profile_visibility
    false,   -- session_auto_record
    NOW(),   -- created_at
    NOW()    -- updated_at
  );
END;
$$ LANGUAGE plpgsql;
