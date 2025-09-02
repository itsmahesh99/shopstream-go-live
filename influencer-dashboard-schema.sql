-- Influencer Dashboard Extended Schema
-- Additional tables to support influencer dashboard features
-- Run this AFTER the main complete-database-schema.sql

-- =============================================================================
-- INFLUENCER DASHBOARD SPECIFIC TABLES
-- =============================================================================

-- 1. INFLUENCER ACHIEVEMENTS TABLE
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

-- 2. INFLUENCER GOALS TABLE (Monthly/Weekly Goals)
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

-- 3. INFLUENCER EARNINGS TABLE (Detailed earnings tracking)
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

-- 4. INFLUENCER ANALYTICS TABLE (Daily/Weekly/Monthly analytics)
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

-- 5. INFLUENCER NOTIFICATIONS TABLE
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

-- 6. INFLUENCER SETTINGS TABLE
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

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================

-- Influencer Achievements indexes
CREATE INDEX idx_influencer_achievements_influencer_id ON public.influencer_achievements(influencer_id);
CREATE INDEX idx_influencer_achievements_type ON public.influencer_achievements(achievement_type);
CREATE INDEX idx_influencer_achievements_completed ON public.influencer_achievements(is_completed);

-- Influencer Goals indexes
CREATE INDEX idx_influencer_goals_influencer_id ON public.influencer_goals(influencer_id);
CREATE INDEX idx_influencer_goals_period ON public.influencer_goals(period_type, start_date, end_date);
CREATE INDEX idx_influencer_goals_status ON public.influencer_goals(status);

-- Influencer Earnings indexes
CREATE INDEX idx_influencer_earnings_influencer_id ON public.influencer_earnings(influencer_id);
CREATE INDEX idx_influencer_earnings_session_id ON public.influencer_earnings(live_session_id);
CREATE INDEX idx_influencer_earnings_status ON public.influencer_earnings(status);
CREATE INDEX idx_influencer_earnings_earned_at ON public.influencer_earnings(earned_at);

-- Influencer Analytics indexes
CREATE INDEX idx_influencer_analytics_influencer_id ON public.influencer_analytics(influencer_id);
CREATE INDEX idx_influencer_analytics_period ON public.influencer_analytics(period_type, period_start);

-- Influencer Notifications indexes
CREATE INDEX idx_influencer_notifications_influencer_id ON public.influencer_notifications(influencer_id);
CREATE INDEX idx_influencer_notifications_unread ON public.influencer_notifications(is_read) WHERE is_read = false;
CREATE INDEX idx_influencer_notifications_type ON public.influencer_notifications(type);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE public.influencer_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencer_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencer_earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencer_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencer_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencer_settings ENABLE ROW LEVEL SECURITY;

-- Achievements policies
CREATE POLICY "Influencers can view own achievements" ON public.influencer_achievements FOR SELECT USING (
  influencer_id IN (SELECT id FROM public.influencers WHERE user_id = auth.uid())
);

CREATE POLICY "Influencers can manage own achievements" ON public.influencer_achievements FOR ALL USING (
  influencer_id IN (SELECT id FROM public.influencers WHERE user_id = auth.uid())
);

-- Goals policies
CREATE POLICY "Influencers can view own goals" ON public.influencer_goals FOR SELECT USING (
  influencer_id IN (SELECT id FROM public.influencers WHERE user_id = auth.uid())
);

CREATE POLICY "Influencers can manage own goals" ON public.influencer_goals FOR ALL USING (
  influencer_id IN (SELECT id FROM public.influencers WHERE user_id = auth.uid())
);

-- Earnings policies
CREATE POLICY "Influencers can view own earnings" ON public.influencer_earnings FOR SELECT USING (
  influencer_id IN (SELECT id FROM public.influencers WHERE user_id = auth.uid())
);

-- Analytics policies
CREATE POLICY "Influencers can view own analytics" ON public.influencer_analytics FOR SELECT USING (
  influencer_id IN (SELECT id FROM public.influencers WHERE user_id = auth.uid())
);

CREATE POLICY "Influencers can manage own analytics" ON public.influencer_analytics FOR ALL USING (
  influencer_id IN (SELECT id FROM public.influencers WHERE user_id = auth.uid())
);

-- Notifications policies
CREATE POLICY "Influencers can view own notifications" ON public.influencer_notifications FOR SELECT USING (
  influencer_id IN (SELECT id FROM public.influencers WHERE user_id = auth.uid())
);

CREATE POLICY "Influencers can manage own notifications" ON public.influencer_notifications FOR ALL USING (
  influencer_id IN (SELECT id FROM public.influencers WHERE user_id = auth.uid())
);

-- Settings policies
CREATE POLICY "Influencers can view own settings" ON public.influencer_settings FOR SELECT USING (
  influencer_id IN (SELECT id FROM public.influencers WHERE user_id = auth.uid())
);

CREATE POLICY "Influencers can manage own settings" ON public.influencer_settings FOR ALL USING (
  influencer_id IN (SELECT id FROM public.influencers WHERE user_id = auth.uid())
);

-- =============================================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- =============================================================================

-- Update timestamps trigger (reuse existing function)
CREATE TRIGGER handle_updated_at_influencer_achievements BEFORE UPDATE ON public.influencer_achievements FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at_influencer_goals BEFORE UPDATE ON public.influencer_goals FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at_influencer_earnings BEFORE UPDATE ON public.influencer_earnings FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at_influencer_analytics BEFORE UPDATE ON public.influencer_analytics FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at_influencer_settings BEFORE UPDATE ON public.influencer_settings FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =============================================================================
-- FUNCTIONS FOR BUSINESS LOGIC
-- =============================================================================

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

-- =============================================================================
-- INITIAL DATA SETUP
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
-- COMMENTS FOR DOCUMENTATION
-- =============================================================================

COMMENT ON TABLE public.influencer_achievements IS 'Achievement system for influencers to track milestones';
COMMENT ON TABLE public.influencer_goals IS 'Goal tracking system for influencers (monthly, weekly targets)';
COMMENT ON TABLE public.influencer_earnings IS 'Detailed earnings tracking for influencers';
COMMENT ON TABLE public.influencer_analytics IS 'Analytics data aggregated by time periods';
COMMENT ON TABLE public.influencer_notifications IS 'Notification system for influencers';
COMMENT ON TABLE public.influencer_settings IS 'Personalization and preference settings for influencers';
