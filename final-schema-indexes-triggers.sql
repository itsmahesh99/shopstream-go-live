-- ===============================================================================
-- FINAL SCHEMA INDEXES, TRIGGERS, AND POLICIES
-- Run this AFTER final-consolidated-schema.sql
-- ===============================================================================

-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_customers_user_id ON public.customers(user_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON public.customers(email);
CREATE INDEX IF NOT EXISTS idx_influencers_user_id ON public.influencers(user_id);

-- Admin tables indexes
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_active ON public.admin_users(is_active);
CREATE INDEX IF NOT EXISTS idx_admin_permissions_user_id ON public.admin_permissions(user_id);

-- Product indexes
CREATE INDEX IF NOT EXISTS idx_products_influencer_id ON public.products(influencer_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_live_products_influencer_id ON public.live_products(influencer_id);
CREATE INDEX IF NOT EXISTS idx_live_products_session_id ON public.live_products(session_id);

-- Commerce indexes
CREATE INDEX IF NOT EXISTS idx_cart_customer_id ON public.cart(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);

-- Live streaming indexes
CREATE INDEX IF NOT EXISTS idx_live_stream_sessions_influencer_id ON public.live_stream_sessions(influencer_id);
CREATE INDEX IF NOT EXISTS idx_live_stream_viewers_session_id ON public.live_stream_viewers(session_id);
CREATE INDEX IF NOT EXISTS idx_live_stream_chat_session_id ON public.live_stream_chat(session_id);

-- Influencer dashboard indexes
CREATE INDEX IF NOT EXISTS idx_influencer_achievements_influencer_id ON public.influencer_achievements(influencer_id);
CREATE INDEX IF NOT EXISTS idx_influencer_goals_influencer_id ON public.influencer_goals(influencer_id);
CREATE INDEX IF NOT EXISTS idx_influencer_earnings_influencer_id ON public.influencer_earnings(influencer_id);

-- =============================================================================

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_stream_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencer_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencer_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencer_earnings ENABLE ROW LEVEL SECURITY;

-- Enable RLS for admin tables
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_permissions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies before creating new ones
DROP POLICY IF EXISTS "Users can manage own profile" ON public.customers;

CREATE POLICY "Users can manage own profile" ON public.customers FOR ALL USING (auth.uid() = user_id);

-- Admin policies
DROP POLICY IF EXISTS "Admin users can view own record" ON public.admin_users;
DROP POLICY IF EXISTS "Admin users can update own record" ON public.admin_users;
CREATE POLICY "Admin users can view own record" ON public.admin_users FOR SELECT USING (id = auth.uid()::uuid);
CREATE POLICY "Admin users can update own record" ON public.admin_users FOR UPDATE USING (id = auth.uid()::uuid);

DROP POLICY IF EXISTS "Admins can manage admin permissions" ON public.admin_permissions;
CREATE POLICY "Admins can manage admin permissions" ON public.admin_permissions
  FOR ALL USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can manage all influencers" ON public.influencers;
DROP POLICY IF EXISTS "Influencers can manage own profile" ON public.influencers;
DROP POLICY IF EXISTS "Influencers can insert own profile" ON public.influencers;
DROP POLICY IF EXISTS "Influencers can update own profile" ON public.influencers;
DROP POLICY IF EXISTS "Influencers can select own profile" ON public.influencers;
DROP POLICY IF EXISTS "Service role can access all" ON public.influencers;
DROP POLICY IF EXISTS "Public can read influencer display data" ON public.influencers;
DROP POLICY IF EXISTS "Allow reading influencer data for live sessions" ON public.influencers;

-- Updated influencer policies (fixed infinite recursion)
CREATE POLICY "Influencers can manage own profile" ON public.influencers
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Service role can access all" ON public.influencers
  FOR ALL USING (auth.role() = 'service_role');

-- Allow public reading of influencer data for live sessions (safe policy without recursion)
CREATE POLICY "Public can read influencer display data" ON public.influencers
  FOR SELECT USING (true);

-- Updated admin_users policies for email-based verification
DROP POLICY IF EXISTS "Admin users can view own record" ON public.admin_users;
DROP POLICY IF EXISTS "Admin users can update own record" ON public.admin_users;
DROP POLICY IF EXISTS "Service role can access admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Allow admin verification" ON public.admin_users;

CREATE POLICY "Service role can access admin users" ON public.admin_users
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow admin verification" ON public.admin_users
  FOR SELECT USING (true); 
      WHERE au.id = auth.uid() 
      AND au.is_active = true
    )
  );

-- Product policies
DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;
DROP POLICY IF EXISTS "Wholesalers can manage own products" ON public.products;
DROP POLICY IF EXISTS "Influencers can manage own products" ON public.products;

CREATE POLICY "Anyone can view active products" ON public.products FOR SELECT USING (is_active = true);
CREATE POLICY "Influencers can manage own products" ON public.products FOR ALL USING (
  influencer_id IN (SELECT id FROM public.influencers WHERE user_id = auth.uid())
);

DROP POLICY IF EXISTS "Anyone can view live products" ON public.live_products;
DROP POLICY IF EXISTS "Influencers can manage own live products" ON public.live_products;

CREATE POLICY "Anyone can view live products" ON public.live_products FOR SELECT USING (status = 'available');
CREATE POLICY "Influencers can manage own live products" ON public.live_products FOR ALL USING (
  influencer_id IN (SELECT id FROM public.influencers WHERE user_id = auth.uid())
);

-- Commerce policies
DROP POLICY IF EXISTS "Customers can manage own cart" ON public.cart;

CREATE POLICY "Customers can manage own cart" ON public.cart FOR ALL USING (
  customer_id IN (SELECT id FROM public.customers WHERE user_id = auth.uid())
);

DROP POLICY IF EXISTS "Customers can view own orders" ON public.orders;

CREATE POLICY "Customers can view own orders" ON public.orders FOR SELECT USING (
  customer_id IN (SELECT id FROM public.customers WHERE user_id = auth.uid())
);

-- Live streaming policies (updated for viewer access)
DROP POLICY IF EXISTS "Anyone can view live sessions" ON public.live_stream_sessions;
DROP POLICY IF EXISTS "Influencers can manage own sessions" ON public.live_stream_sessions;
DROP POLICY IF EXISTS "Service role can access all sessions" ON public.live_stream_sessions;

CREATE POLICY "Anyone can view live sessions" ON public.live_stream_sessions 
  FOR SELECT USING (status = 'live' OR status = 'scheduled');

CREATE POLICY "Influencers can manage own sessions" ON public.live_stream_sessions 
  FOR ALL USING (auth.uid() = (SELECT user_id FROM public.influencers WHERE id = influencer_id));

CREATE POLICY "Service role can access all sessions" ON public.live_stream_sessions
  FOR ALL USING (auth.role() = 'service_role');

-- Influencer dashboard policies
DROP POLICY IF EXISTS "Influencers can manage own achievements" ON public.influencer_achievements;
DROP POLICY IF EXISTS "Influencers can manage own goals" ON public.influencer_goals;
DROP POLICY IF EXISTS "Influencers can view own earnings" ON public.influencer_earnings;

CREATE POLICY "Influencers can manage own achievements" ON public.influencer_achievements FOR ALL USING (
  influencer_id IN (SELECT id FROM public.influencers WHERE user_id = auth.uid())
);

CREATE POLICY "Influencers can manage own goals" ON public.influencer_goals FOR ALL USING (
  influencer_id IN (SELECT id FROM public.influencers WHERE user_id = auth.uid())
);

CREATE POLICY "Influencers can view own earnings" ON public.influencer_earnings FOR SELECT USING (
  influencer_id IN (SELECT id FROM public.influencers WHERE user_id = auth.uid())
);

-- =============================================================================
-- TRIGGERS AND FUNCTIONS
-- =============================================================================

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
DROP TRIGGER IF EXISTS handle_updated_at ON public.customers;
DROP TRIGGER IF EXISTS handle_updated_at ON public.influencers;
DROP TRIGGER IF EXISTS handle_updated_at ON public.products;
DROP TRIGGER IF EXISTS handle_updated_at ON public.live_products;
DROP TRIGGER IF EXISTS handle_updated_at ON public.orders;
DROP TRIGGER IF EXISTS handle_updated_at ON public.live_stream_sessions;

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.influencers FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.live_products FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.live_stream_sessions FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function to generate order numbers
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number = 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(NEXTVAL('order_sequence')::TEXT, 6, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create sequence and trigger for order numbers
CREATE SEQUENCE IF NOT EXISTS order_sequence START 1;

DROP TRIGGER IF EXISTS generate_order_number ON public.orders;
CREATE TRIGGER generate_order_number BEFORE INSERT ON public.orders FOR EACH ROW EXECUTE FUNCTION public.generate_order_number();

-- Function to generate session codes
CREATE OR REPLACE FUNCTION generate_session_code() RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result TEXT := 'LIVE-';
  i INTEGER;
BEGIN
  FOR i IN 1..8 LOOP
    result := result || substr(chars, floor(random() * length(chars))::integer + 1, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to auto-generate session code
CREATE OR REPLACE FUNCTION set_session_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.session_code IS NULL THEN
    NEW.session_code := generate_session_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_session_code ON public.live_stream_sessions;
CREATE TRIGGER trigger_set_session_code
  BEFORE INSERT ON public.live_stream_sessions
  FOR EACH ROW EXECUTE FUNCTION set_session_code();

-- =============================================================================
-- USEFUL VIEWS
-- =============================================================================

-- Product catalog view combining bulk and live products
CREATE OR REPLACE VIEW public.product_catalog AS
SELECT 
  'bulk' as product_type,
  p.id,
  p.name,
  p.description,
  p.retail_price as price,
  p.images,
  p.is_active,
  c.name as category_name,
  i.display_name as seller_name
FROM public.products p
LEFT JOIN public.categories c ON p.category_id = c.id
LEFT JOIN public.influencers i ON p.influencer_id = i.id
WHERE p.is_active = true

UNION ALL

SELECT 
  'live' as product_type,
  lp.id,
  lp.name,
  lp.description,
  lp.price,
  lp.images,
  CASE WHEN lp.status = 'available' THEN true ELSE false END as is_active,
  c.name as category_name,
  i.display_name as seller_name
FROM public.live_products lp
LEFT JOIN public.categories c ON lp.category_id = c.id
LEFT JOIN public.influencers i ON lp.influencer_id = i.id
WHERE lp.status = 'available';

-- Live sessions with influencer details
CREATE OR REPLACE VIEW public.live_sessions_with_details AS
SELECT 
  ls.*,
  i.display_name,
  i.followers_count,
  COUNT(lp.id) as products_count
FROM public.live_stream_sessions ls
JOIN public.influencers i ON ls.influencer_id = i.id
LEFT JOIN public.live_products lp ON ls.id = lp.session_id
GROUP BY ls.id, i.display_name, i.followers_count;

-- =============================================================================

SELECT 'Indexes, triggers, and policies applied successfully!' as status;

-- Grant access and execute permissions (from admin-auth-schema-safe.sql)
GRANT ALL ON public.admin_users TO authenticated;
GRANT SELECT ON public.admin_users TO anon;
GRANT ALL ON public.admin_permissions TO authenticated;
GRANT SELECT ON public.influencer_analytics_admin TO authenticated;
GRANT EXECUTE ON FUNCTION public.verify_admin_credentials TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.create_admin_user TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.update_admin_last_login TO anon, authenticated;