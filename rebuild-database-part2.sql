-- ===============================================================================
-- COMPLETE DATABASE REBUILD SCRIPT - PART 2
-- Indexes, Policies, Triggers, Functions, and Sample Data
-- Run this AFTER rebuild-database-part1.sql
-- ===============================================================================

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================

DO $$ BEGIN RAISE NOTICE 'Creating indexes for optimal performance...'; END $$;

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

-- Influencer dashboard indexes
CREATE INDEX idx_influencer_achievements_influencer_id ON public.influencer_achievements(influencer_id);
CREATE INDEX idx_influencer_achievements_type ON public.influencer_achievements(achievement_type);
CREATE INDEX idx_influencer_achievements_completed ON public.influencer_achievements(is_completed);

CREATE INDEX idx_influencer_goals_influencer_id ON public.influencer_goals(influencer_id);
CREATE INDEX idx_influencer_goals_period ON public.influencer_goals(period_type, start_date, end_date);
CREATE INDEX idx_influencer_goals_status ON public.influencer_goals(status);

CREATE INDEX idx_influencer_earnings_influencer_id ON public.influencer_earnings(influencer_id);
CREATE INDEX idx_influencer_earnings_session_id ON public.influencer_earnings(live_session_id);
CREATE INDEX idx_influencer_earnings_status ON public.influencer_earnings(status);
CREATE INDEX idx_influencer_earnings_earned_at ON public.influencer_earnings(earned_at);

CREATE INDEX idx_influencer_analytics_influencer_id ON public.influencer_analytics(influencer_id);
CREATE INDEX idx_influencer_analytics_period ON public.influencer_analytics(period_type, period_start);

CREATE INDEX idx_influencer_notifications_influencer_id ON public.influencer_notifications(influencer_id);
CREATE INDEX idx_influencer_notifications_unread ON public.influencer_notifications(is_read) WHERE is_read = false;
CREATE INDEX idx_influencer_notifications_type ON public.influencer_notifications(type);

DO $$ BEGIN RAISE NOTICE 'Indexes created successfully'; END $$;

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

DO $$ BEGIN RAISE NOTICE 'Setting up Row Level Security policies...'; END $$;

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
ALTER TABLE public.influencer_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencer_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencer_earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencer_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencer_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencer_settings ENABLE ROW LEVEL SECURITY;

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

-- Influencer dashboard policies
CREATE POLICY "Influencers can view own achievements" ON public.influencer_achievements FOR SELECT USING (
  influencer_id IN (SELECT id FROM public.influencers WHERE user_id = auth.uid())
);
CREATE POLICY "Influencers can manage own achievements" ON public.influencer_achievements FOR ALL USING (
  influencer_id IN (SELECT id FROM public.influencers WHERE user_id = auth.uid())
);

CREATE POLICY "Influencers can view own goals" ON public.influencer_goals FOR SELECT USING (
  influencer_id IN (SELECT id FROM public.influencers WHERE user_id = auth.uid())
);
CREATE POLICY "Influencers can manage own goals" ON public.influencer_goals FOR ALL USING (
  influencer_id IN (SELECT id FROM public.influencers WHERE user_id = auth.uid())
);

CREATE POLICY "Influencers can view own earnings" ON public.influencer_earnings FOR SELECT USING (
  influencer_id IN (SELECT id FROM public.influencers WHERE user_id = auth.uid())
);

CREATE POLICY "Influencers can view own analytics" ON public.influencer_analytics FOR SELECT USING (
  influencer_id IN (SELECT id FROM public.influencers WHERE user_id = auth.uid())
);
CREATE POLICY "Influencers can manage own analytics" ON public.influencer_analytics FOR ALL USING (
  influencer_id IN (SELECT id FROM public.influencers WHERE user_id = auth.uid())
);

CREATE POLICY "Influencers can view own notifications" ON public.influencer_notifications FOR SELECT USING (
  influencer_id IN (SELECT id FROM public.influencers WHERE user_id = auth.uid())
);
CREATE POLICY "Influencers can manage own notifications" ON public.influencer_notifications FOR ALL USING (
  influencer_id IN (SELECT id FROM public.influencers WHERE user_id = auth.uid())
);

CREATE POLICY "Influencers can view own settings" ON public.influencer_settings FOR SELECT USING (
  influencer_id IN (SELECT id FROM public.influencers WHERE user_id = auth.uid())
);
CREATE POLICY "Influencers can manage own settings" ON public.influencer_settings FOR ALL USING (
  influencer_id IN (SELECT id FROM public.influencers WHERE user_id = auth.uid())
);

DO $$ BEGIN RAISE NOTICE 'RLS policies created successfully'; END $$;

-- =============================================================================
-- TRIGGERS AND FUNCTIONS
-- =============================================================================

DO $$ BEGIN RAISE NOTICE 'Creating functions and triggers...'; END $$;

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
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.influencer_achievements FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.influencer_goals FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.influencer_earnings FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.influencer_analytics FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.influencer_settings FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

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

-- Function to update influencer goals progress
CREATE OR REPLACE FUNCTION update_influencer_goal_progress()
RETURNS TRIGGER AS $$
BEGIN
  -- Update monthly streams goal
  UPDATE public.influencer_goals 
  SET current_value = (
    SELECT COUNT(*) 
    FROM public.live_sessions 
    WHERE influencer_id = NEW.influencer_id 
    AND status = 'ended'
    AND actual_start_time >= (SELECT start_date FROM public.influencer_goals WHERE id = public.influencer_goals.id)
    AND actual_start_time <= (SELECT end_date FROM public.influencer_goals WHERE id = public.influencer_goals.id)
  ),
  completion_percentage = LEAST(100, (current_value / target_value) * 100)
  WHERE influencer_id = NEW.influencer_id 
  AND goal_type = 'monthly_streams'
  AND status = 'active';
  
  -- Update earnings goals when earnings are added
  IF TG_TABLE_NAME = 'influencer_earnings' THEN
    UPDATE public.influencer_goals 
    SET current_value = (
      SELECT COALESCE(SUM(amount), 0)
      FROM public.influencer_earnings 
      WHERE influencer_id = NEW.influencer_id 
      AND earned_at >= (SELECT start_date FROM public.influencer_goals WHERE id = public.influencer_goals.id)
      AND earned_at <= (SELECT end_date FROM public.influencer_goals WHERE id = public.influencer_goals.id)
    ),
    completion_percentage = LEAST(100, (current_value / target_value) * 100)
    WHERE influencer_id = NEW.influencer_id 
    AND goal_type = 'monthly_earnings'
    AND status = 'active';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update goals when live sessions end
CREATE TRIGGER update_goals_on_session_end 
AFTER UPDATE ON public.live_sessions 
FOR EACH ROW 
WHEN (OLD.status != 'ended' AND NEW.status = 'ended')
EXECUTE FUNCTION update_influencer_goal_progress();

-- Trigger to update goals when earnings are added
CREATE TRIGGER update_goals_on_earnings 
AFTER INSERT ON public.influencer_earnings 
FOR EACH ROW 
EXECUTE FUNCTION update_influencer_goal_progress();

-- Function to check and complete achievements
CREATE OR REPLACE FUNCTION check_influencer_achievements()
RETURNS TRIGGER AS $$
BEGIN
  -- Check Stream Master achievement (10+ successful streams)
  UPDATE public.influencer_achievements 
  SET is_completed = true,
      completed_at = NOW(),
      progress_value = target_value
  WHERE influencer_id = NEW.influencer_id 
  AND achievement_type = 'stream_master'
  AND is_completed = false
  AND NEW.total_live_sessions >= 10;
  
  -- Check Audience Builder achievement (1000+ followers)
  UPDATE public.influencer_achievements 
  SET is_completed = true,
      completed_at = NOW(),
      progress_value = target_value
  WHERE influencer_id = NEW.influencer_id 
  AND achievement_type = 'audience_builder'
  AND is_completed = false
  AND NEW.followers_count >= 1000;
  
  -- Check Revenue Generator achievement ($500+ in a month)
  UPDATE public.influencer_achievements 
  SET is_completed = true,
      completed_at = NOW(),
      progress_value = target_value
  WHERE influencer_id = NEW.influencer_id 
  AND achievement_type = 'revenue_generator'
  AND is_completed = false
  AND NEW.total_earnings >= 500;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to check achievements when influencer data is updated
CREATE TRIGGER check_achievements_on_influencer_update 
AFTER UPDATE ON public.influencers 
FOR EACH ROW 
EXECUTE FUNCTION check_influencer_achievements();

DO $$ BEGIN RAISE NOTICE 'Functions and triggers created successfully'; END $$;

-- =============================================================================
-- HELPER FUNCTIONS FOR INFLUENCER SETUP
-- =============================================================================

-- Function to create default achievements for a new influencer
CREATE OR REPLACE FUNCTION create_default_influencer_achievements(p_influencer_id UUID)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.influencer_achievements (
    influencer_id, achievement_type, title, description, target_value, icon_name, badge_color, points_awarded
  ) VALUES 
  (p_influencer_id, 'stream_master', 'Stream Master', 'Completed 10+ successful streams', 10, 'video', 'green', 100),
  (p_influencer_id, 'audience_builder', 'Audience Builder', 'Reached 1,000 followers', 1000, 'users', 'blue', 200),
  (p_influencer_id, 'revenue_generator', 'Revenue Generator', 'Earned $500+ in a month', 500, 'dollar-sign', 'yellow', 300);
END;
$$ LANGUAGE plpgsql;

-- Function to create default goals for a new influencer
CREATE OR REPLACE FUNCTION create_default_influencer_goals(p_influencer_id UUID)
RETURNS VOID AS $$
DECLARE
  current_month_start DATE := DATE_TRUNC('month', CURRENT_DATE);
  current_month_end DATE := DATE_TRUNC('month', CURRENT_DATE + INTERVAL '1 month') - INTERVAL '1 day';
BEGIN
  INSERT INTO public.influencer_goals (
    influencer_id, goal_type, title, description, period_type, start_date, end_date, target_value, unit
  ) VALUES 
  (p_influencer_id, 'monthly_streams', 'Monthly Streams', 'Complete 20 live streams this month', 'monthly', current_month_start, current_month_end, 20, 'streams'),
  (p_influencer_id, 'monthly_earnings', 'Monthly Earnings', 'Earn $800 this month', 'monthly', current_month_start, current_month_end, 800, 'dollars'),
  (p_influencer_id, 'monthly_followers', 'New Followers', 'Gain 150 new followers this month', 'monthly', current_month_start, current_month_end, 150, 'followers');
END;
$$ LANGUAGE plpgsql;

-- Function to create default settings for a new influencer
CREATE OR REPLACE FUNCTION create_default_influencer_settings(p_influencer_id UUID)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.influencer_settings (influencer_id) VALUES (p_influencer_id);
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- USEFUL VIEWS
-- =============================================================================

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

-- =============================================================================
-- DOCUMENTATION COMMENTS
-- =============================================================================

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
COMMENT ON TABLE public.influencer_achievements IS 'Achievement system for influencers to track milestones';
COMMENT ON TABLE public.influencer_goals IS 'Goal tracking system for influencers (monthly, weekly targets)';
COMMENT ON TABLE public.influencer_earnings IS 'Detailed earnings tracking for influencers';
COMMENT ON TABLE public.influencer_analytics IS 'Analytics data aggregated by time periods';
COMMENT ON TABLE public.influencer_notifications IS 'Notification system for influencers';
COMMENT ON TABLE public.influencer_settings IS 'Personalization and preference settings for influencers';

-- =============================================================================
-- FINAL VERIFICATION AND COMPLETION
-- =============================================================================

-- Show created tables
DO $$ 
BEGIN
    RAISE NOTICE '====================================================';
    RAISE NOTICE 'DATABASE REBUILD COMPLETED SUCCESSFULLY!';
    RAISE NOTICE '====================================================';
END $$;

-- Display created objects
SELECT 
    'Created table: ' || tablename as result,
    'Tables' as category
FROM pg_tables 
WHERE schemaname = 'public'

UNION ALL

SELECT 
    'Created view: ' || viewname as result,
    'Views' as category
FROM pg_views 
WHERE schemaname = 'public'

UNION ALL

SELECT 
    'Created function: ' || proname as result,
    'Functions' as category
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
AND proname NOT LIKE 'pg_%'

ORDER BY category, result;

DO $$ 
BEGIN
    RAISE NOTICE '====================================================';
    RAISE NOTICE 'READY FOR INFLUENCER DASHBOARD INTEGRATION!';
    RAISE NOTICE '====================================================';
    RAISE NOTICE 'Tables Created: 16 main tables + 6 influencer dashboard tables';
    RAISE NOTICE 'Features: RLS, Triggers, Auto-updates, Achievement system, Goals tracking';
    RAISE NOTICE 'Next Steps: Set up Supabase integration in React app';
    RAISE NOTICE '====================================================';
END $$;
