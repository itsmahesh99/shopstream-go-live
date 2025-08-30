-- Enhanced Live Streaming Database Schema
-- Complete database structure for live streaming with analytics and scheduling
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- ENHANCED LIVE STREAMING TABLES
-- =============================================================================

-- 1. LIVE STREAM SESSIONS (Enhanced version)
CREATE TABLE IF NOT EXISTS public.live_stream_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  influencer_id UUID REFERENCES public.influencers(id) ON DELETE CASCADE NOT NULL,
  
  -- Session Identification
  session_code VARCHAR(20) UNIQUE NOT NULL, -- User-friendly session ID
  title VARCHAR(255) NOT NULL,
  description TEXT,
  thumbnail_url VARCHAR(500),
  
  -- Scheduling
  scheduled_start_time TIMESTAMP WITH TIME ZONE,
  scheduled_end_time TIMESTAMP WITH TIME ZONE,
  
  -- Actual Session Times
  actual_start_time TIMESTAMP WITH TIME ZONE,
  actual_end_time TIMESTAMP WITH TIME ZONE,
  
  -- Session Status
  status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN (
    'scheduled', 'live', 'paused', 'ended', 'cancelled', 'error'
  )),
  
  -- Technical Details
  stream_key VARCHAR(255),
  stream_url VARCHAR(500),
  hls_url VARCHAR(500), -- HLS playback URL
  rtmp_url VARCHAR(500), -- RTMP ingest URL
  recording_url VARCHAR(500),
  
  -- 100ms Integration
  room_id VARCHAR(255), -- 100ms room ID
  room_code VARCHAR(100), -- 100ms room code for viewers
  template_id VARCHAR(255), -- 100ms template ID
  
  -- Session Configuration
  max_viewers INTEGER DEFAULT 1000,
  is_recording_enabled BOOLEAN DEFAULT true,
  is_chat_enabled BOOLEAN DEFAULT true,
  is_products_showcase BOOLEAN DEFAULT true,
  visibility VARCHAR(20) DEFAULT 'public' CHECK (visibility IN ('public', 'private', 'unlisted')),
  
  -- Performance Metrics (Real-time updated)
  current_viewers INTEGER DEFAULT 0,
  peak_viewers INTEGER DEFAULT 0,
  total_unique_viewers INTEGER DEFAULT 0,
  total_watch_time_minutes INTEGER DEFAULT 0, -- Sum of all viewer watch times
  average_watch_time_minutes DECIMAL(10,2) DEFAULT 0,
  
  -- Engagement Metrics
  total_messages INTEGER DEFAULT 0,
  total_reactions INTEGER DEFAULT 0,
  total_shares INTEGER DEFAULT 0,
  
  -- Commercial Metrics
  total_products_showcased INTEGER DEFAULT 0,
  total_clicks INTEGER DEFAULT 0,
  total_orders INTEGER DEFAULT 0,
  total_revenue DECIMAL(12,2) DEFAULT 0.00,
  conversion_rate DECIMAL(5,2) DEFAULT 0.00, -- Clicks to orders percentage
  
  -- Quality Metrics
  stream_quality VARCHAR(20) DEFAULT 'auto', -- 'auto', '720p', '1080p', '4k'
  connection_issues_count INTEGER DEFAULT 0,
  buffering_events INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 2. LIVE STREAM VIEWERS (Track individual viewer sessions)
CREATE TABLE IF NOT EXISTS public.live_stream_viewers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES public.live_stream_sessions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- NULL for anonymous viewers
  
  -- Viewer Details
  viewer_type VARCHAR(20) DEFAULT 'customer' CHECK (viewer_type IN ('customer', 'influencer', 'wholesaler', 'anonymous')),
  ip_address INET,
  user_agent TEXT,
  country VARCHAR(100),
  city VARCHAR(100),
  device_type VARCHAR(50), -- 'desktop', 'mobile', 'tablet'
  browser VARCHAR(50),
  
  -- Session Tracking
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  left_at TIMESTAMP WITH TIME ZONE,
  watch_duration_minutes INTEGER DEFAULT 0,
  is_still_watching BOOLEAN DEFAULT true,
  
  -- Engagement
  messages_sent INTEGER DEFAULT 0,
  reactions_sent INTEGER DEFAULT 0,
  products_clicked INTEGER DEFAULT 0,
  orders_placed INTEGER DEFAULT 0,
  
  -- Quality Experience
  connection_quality VARCHAR(20) DEFAULT 'good', -- 'excellent', 'good', 'fair', 'poor'
  buffering_time_seconds INTEGER DEFAULT 0,
  disconnections_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 3. LIVE STREAM SCHEDULED SESSIONS (For future streams)
CREATE TABLE IF NOT EXISTS public.live_stream_schedule (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  influencer_id UUID REFERENCES public.influencers(id) ON DELETE CASCADE NOT NULL,
  
  -- Schedule Details
  title VARCHAR(255) NOT NULL,
  description TEXT,
  thumbnail_url VARCHAR(500),
  
  -- Timing
  scheduled_date DATE NOT NULL,
  scheduled_start_time TIME NOT NULL,
  scheduled_end_time TIME NOT NULL,
  timezone VARCHAR(50) DEFAULT 'UTC',
  
  -- Recurrence (for recurring streams)
  is_recurring BOOLEAN DEFAULT false,
  recurrence_pattern VARCHAR(20) CHECK (recurrence_pattern IN ('daily', 'weekly', 'monthly', 'custom')),
  recurrence_end_date DATE,
  days_of_week INTEGER[], -- Array for weekly recurrence [1,2,3,4,5] for Mon-Fri
  
  -- Pre-stream Configuration
  products_to_showcase UUID[], -- Array of product IDs
  stream_category VARCHAR(100),
  expected_duration_minutes INTEGER,
  target_audience TEXT,
  
  -- Promotion
  promotion_message TEXT,
  is_promoted BOOLEAN DEFAULT false,
  notification_sent BOOLEAN DEFAULT false,
  reminder_sent BOOLEAN DEFAULT false,
  
  -- Status
  status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'cancelled', 'completed')),
  
  -- Session Link (after creation)
  created_session_id UUID REFERENCES public.live_stream_sessions(id),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 4. LIVE STREAM ANALYTICS (Hourly/Daily aggregated data)
CREATE TABLE IF NOT EXISTS public.live_stream_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES public.live_stream_sessions(id) ON DELETE CASCADE NOT NULL,
  
  -- Time Period
  period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  period_type VARCHAR(20) NOT NULL CHECK (period_type IN ('minute', 'hour', 'day')),
  
  -- Viewer Metrics
  viewers_joined INTEGER DEFAULT 0,
  viewers_left INTEGER DEFAULT 0,
  peak_concurrent_viewers INTEGER DEFAULT 0,
  average_concurrent_viewers DECIMAL(10,2) DEFAULT 0,
  
  -- Engagement Metrics
  messages_sent INTEGER DEFAULT 0,
  reactions_sent INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  
  -- Commercial Metrics
  products_clicked INTEGER DEFAULT 0,
  orders_placed INTEGER DEFAULT 0,
  revenue_generated DECIMAL(12,2) DEFAULT 0.00,
  
  -- Quality Metrics
  average_connection_quality DECIMAL(3,2) DEFAULT 0, -- 1-5 scale
  total_buffering_time_seconds INTEGER DEFAULT 0,
  total_disconnections INTEGER DEFAULT 0,
  
  -- Geographic Data
  top_countries JSONB, -- {"US": 45, "IN": 30, "UK": 25}
  top_cities JSONB,
  
  -- Device Data
  device_breakdown JSONB, -- {"mobile": 60, "desktop": 35, "tablet": 5}
  browser_breakdown JSONB,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 5. LIVE STREAM CHAT MESSAGES
CREATE TABLE IF NOT EXISTS public.live_stream_chat (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES public.live_stream_sessions(id) ON DELETE CASCADE NOT NULL,
  viewer_id UUID REFERENCES public.live_stream_viewers(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- For registered users
  
  -- Message Details
  message TEXT NOT NULL,
  message_type VARCHAR(20) DEFAULT 'chat' CHECK (message_type IN ('chat', 'reaction', 'system', 'product_highlight')),
  
  -- Metadata
  username VARCHAR(100), -- Display name
  avatar_url VARCHAR(500),
  is_influencer BOOLEAN DEFAULT false,
  is_moderator BOOLEAN DEFAULT false,
  
  -- Moderation
  is_deleted BOOLEAN DEFAULT false,
  is_flagged BOOLEAN DEFAULT false,
  deleted_by UUID REFERENCES auth.users(id),
  deletion_reason TEXT,
  
  -- Engagement
  reactions JSONB DEFAULT '{}', -- {"like": 5, "love": 2, "wow": 1}
  replies_count INTEGER DEFAULT 0,
  parent_message_id UUID REFERENCES public.live_stream_chat(id),
  
  -- Timestamps
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  edited_at TIMESTAMP WITH TIME ZONE,
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- 6. LIVE STREAM PRODUCTS SHOWCASE (Enhanced)
CREATE TABLE IF NOT EXISTS public.live_stream_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES public.live_stream_sessions(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  
  -- Showcase Timing
  featured_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  featured_duration_minutes INTEGER DEFAULT 5,
  display_order INTEGER DEFAULT 0,
  
  -- Special Pricing
  original_price DECIMAL(10,2),
  live_stream_price DECIMAL(10,2),
  discount_percentage DECIMAL(5,2),
  limited_quantity INTEGER,
  sold_quantity INTEGER DEFAULT 0,
  
  -- Performance Metrics
  views INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  add_to_cart INTEGER DEFAULT 0,
  orders INTEGER DEFAULT 0,
  revenue DECIMAL(12,2) DEFAULT 0.00,
  
  -- Engagement
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  
  UNIQUE(session_id, product_id)
);

-- 7. LIVE STREAM NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.live_stream_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Target
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  influencer_id UUID REFERENCES public.influencers(id) ON DELETE CASCADE,
  session_id UUID REFERENCES public.live_stream_sessions(id) ON DELETE CASCADE,
  
  -- Notification Details
  type VARCHAR(50) NOT NULL CHECK (type IN (
    'stream_starting', 'stream_reminder', 'stream_ended', 
    'followed_influencer_live', 'product_featured', 'special_offer'
  )),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  action_url VARCHAR(500),
  
  -- Delivery
  is_read BOOLEAN DEFAULT false,
  is_sent BOOLEAN DEFAULT false,
  delivery_method VARCHAR(20) DEFAULT 'in_app' CHECK (delivery_method IN ('in_app', 'email', 'sms', 'push')),
  
  -- Timestamps
  scheduled_for TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  sent_at TIMESTAMP WITH TIME ZONE,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================

-- Live Stream Sessions Indexes
CREATE INDEX idx_live_stream_sessions_influencer_id ON public.live_stream_sessions(influencer_id);
CREATE INDEX idx_live_stream_sessions_status ON public.live_stream_sessions(status);
CREATE INDEX idx_live_stream_sessions_scheduled_start ON public.live_stream_sessions(scheduled_start_time);
CREATE INDEX idx_live_stream_sessions_actual_start ON public.live_stream_sessions(actual_start_time);
CREATE INDEX idx_live_stream_sessions_room_id ON public.live_stream_sessions(room_id);

-- Live Stream Viewers Indexes
CREATE INDEX idx_live_stream_viewers_session_id ON public.live_stream_viewers(session_id);
CREATE INDEX idx_live_stream_viewers_user_id ON public.live_stream_viewers(user_id);
CREATE INDEX idx_live_stream_viewers_joined_at ON public.live_stream_viewers(joined_at);
CREATE INDEX idx_live_stream_viewers_is_watching ON public.live_stream_viewers(is_still_watching);

-- Live Stream Schedule Indexes
CREATE INDEX idx_live_stream_schedule_influencer_id ON public.live_stream_schedule(influencer_id);
CREATE INDEX idx_live_stream_schedule_date ON public.live_stream_schedule(scheduled_date);
CREATE INDEX idx_live_stream_schedule_status ON public.live_stream_schedule(status);

-- Live Stream Analytics Indexes
CREATE INDEX idx_live_stream_analytics_session_id ON public.live_stream_analytics(session_id);
CREATE INDEX idx_live_stream_analytics_period ON public.live_stream_analytics(period_start, period_end);
CREATE INDEX idx_live_stream_analytics_period_type ON public.live_stream_analytics(period_type);

-- Live Stream Chat Indexes
CREATE INDEX idx_live_stream_chat_session_id ON public.live_stream_chat(session_id);
CREATE INDEX idx_live_stream_chat_user_id ON public.live_stream_chat(user_id);
CREATE INDEX idx_live_stream_chat_sent_at ON public.live_stream_chat(sent_at);
CREATE INDEX idx_live_stream_chat_parent_id ON public.live_stream_chat(parent_message_id);

-- Live Stream Products Indexes
CREATE INDEX idx_live_stream_products_session_id ON public.live_stream_products(session_id);
CREATE INDEX idx_live_stream_products_product_id ON public.live_stream_products(product_id);
CREATE INDEX idx_live_stream_products_featured_at ON public.live_stream_products(featured_at);

-- Live Stream Notifications Indexes
CREATE INDEX idx_live_stream_notifications_user_id ON public.live_stream_notifications(user_id);
CREATE INDEX idx_live_stream_notifications_type ON public.live_stream_notifications(type);
CREATE INDEX idx_live_stream_notifications_is_read ON public.live_stream_notifications(is_read);
CREATE INDEX idx_live_stream_notifications_scheduled_for ON public.live_stream_notifications(scheduled_for);

-- =============================================================================
-- FUNCTIONS AND TRIGGERS
-- =============================================================================

-- Function to update session metrics in real-time
CREATE OR REPLACE FUNCTION update_session_metrics()
RETURNS TRIGGER AS $$
BEGIN
  -- Update viewer counts when viewer joins/leaves
  IF TG_OP = 'INSERT' AND TG_TABLE_NAME = 'live_stream_viewers' THEN
    UPDATE public.live_stream_sessions 
    SET 
      current_viewers = current_viewers + 1,
      total_unique_viewers = total_unique_viewers + 1,
      updated_at = NOW()
    WHERE id = NEW.session_id;
    
    -- Update peak viewers if needed
    UPDATE public.live_stream_sessions 
    SET peak_viewers = GREATEST(peak_viewers, current_viewers)
    WHERE id = NEW.session_id;
    
  ELSIF TG_OP = 'UPDATE' AND TG_TABLE_NAME = 'live_stream_viewers' AND OLD.is_still_watching = true AND NEW.is_still_watching = false THEN
    UPDATE public.live_stream_sessions 
    SET 
      current_viewers = GREATEST(0, current_viewers - 1),
      total_watch_time_minutes = total_watch_time_minutes + COALESCE(NEW.watch_duration_minutes, 0),
      updated_at = NOW()
    WHERE id = NEW.session_id;
  END IF;
  
  -- Update chat metrics
  IF TG_OP = 'INSERT' AND TG_TABLE_NAME = 'live_stream_chat' THEN
    UPDATE public.live_stream_sessions 
    SET 
      total_messages = total_messages + 1,
      updated_at = NOW()
    WHERE id = NEW.session_id;
  END IF;
  
  -- Update product metrics
  IF TG_OP = 'UPDATE' AND TG_TABLE_NAME = 'live_stream_products' THEN
    UPDATE public.live_stream_sessions 
    SET 
      total_clicks = (SELECT SUM(clicks) FROM public.live_stream_products WHERE session_id = NEW.session_id),
      total_orders = (SELECT SUM(orders) FROM public.live_stream_products WHERE session_id = NEW.session_id),
      total_revenue = (SELECT SUM(revenue) FROM public.live_stream_products WHERE session_id = NEW.session_id),
      updated_at = NOW()
    WHERE id = NEW.session_id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER trigger_update_session_metrics_viewers
  AFTER INSERT OR UPDATE ON public.live_stream_viewers
  FOR EACH ROW EXECUTE FUNCTION update_session_metrics();

CREATE TRIGGER trigger_update_session_metrics_chat
  AFTER INSERT ON public.live_stream_chat
  FOR EACH ROW EXECUTE FUNCTION update_session_metrics();

CREATE TRIGGER trigger_update_session_metrics_products
  AFTER UPDATE ON public.live_stream_products
  FOR EACH ROW EXECUTE FUNCTION update_session_metrics();

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

CREATE TRIGGER trigger_set_session_code
  BEFORE INSERT ON public.live_stream_sessions
  FOR EACH ROW EXECUTE FUNCTION set_session_code();

-- =============================================================================
-- VIEWS FOR COMMON QUERIES
-- =============================================================================

-- View for live sessions with influencer details
CREATE OR REPLACE VIEW public.live_sessions_with_influencer AS
SELECT 
  ls.*,
  i.stage_name,
  i.profile_image_url,
  i.follower_count,
  i.total_streams,
  i.average_rating
FROM public.live_stream_sessions ls
JOIN public.influencers i ON ls.influencer_id = i.id;

-- View for session analytics summary
CREATE OR REPLACE VIEW public.session_analytics_summary AS
SELECT 
  session_id,
  COUNT(DISTINCT viewer_id) as total_unique_viewers,
  SUM(watch_duration_minutes) as total_watch_time,
  AVG(watch_duration_minutes) as avg_watch_time,
  COUNT(*) FILTER (WHERE is_still_watching = true) as current_viewers,
  SUM(messages_sent) as total_messages,
  SUM(reactions_sent) as total_reactions,
  SUM(products_clicked) as total_product_clicks,
  SUM(orders_placed) as total_orders
FROM public.live_stream_viewers
GROUP BY session_id;

-- View for upcoming scheduled streams
CREATE OR REPLACE VIEW public.upcoming_streams AS
SELECT 
  lss.*,
  i.stage_name,
  i.profile_image_url,
  i.follower_count,
  (scheduled_date + scheduled_start_time) as full_start_datetime,
  (scheduled_date + scheduled_end_time) as full_end_datetime
FROM public.live_stream_schedule lss
JOIN public.influencers i ON lss.influencer_id = i.id
WHERE lss.status = 'scheduled' 
  AND (scheduled_date + scheduled_start_time) > NOW()
ORDER BY (scheduled_date + scheduled_start_time);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================================

-- Enable RLS on tables
ALTER TABLE public.live_stream_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_stream_viewers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_stream_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_stream_chat ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_stream_notifications ENABLE ROW LEVEL SECURITY;

-- Policies for live_stream_sessions
CREATE POLICY "Public can view live sessions" ON public.live_stream_sessions
  FOR SELECT USING (status = 'live' OR visibility = 'public');

CREATE POLICY "Influencers can manage their sessions" ON public.live_stream_sessions
  FOR ALL USING (
    influencer_id IN (
      SELECT id FROM public.influencers WHERE user_id = auth.uid()
    )
  );

-- Policies for live_stream_viewers
CREATE POLICY "Users can view their own viewer records" ON public.live_stream_viewers
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Anyone can create viewer records" ON public.live_stream_viewers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own viewer records" ON public.live_stream_viewers
  FOR UPDATE USING (user_id = auth.uid());

-- Policies for live_stream_chat
CREATE POLICY "Users can view chat for live sessions" ON public.live_stream_chat
  FOR SELECT USING (
    session_id IN (
      SELECT id FROM public.live_stream_sessions 
      WHERE status = 'live' OR visibility = 'public'
    )
  );

CREATE POLICY "Authenticated users can send chat messages" ON public.live_stream_chat
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own messages" ON public.live_stream_chat
  FOR UPDATE USING (user_id = auth.uid());

-- =============================================================================
-- SAMPLE DATA AND FUNCTIONS FOR TESTING
-- =============================================================================

-- Function to create a test live session
CREATE OR REPLACE FUNCTION create_test_live_session(
  p_influencer_id UUID,
  p_title TEXT DEFAULT 'Test Live Session',
  p_description TEXT DEFAULT 'This is a test live session'
) RETURNS UUID AS $$
DECLARE
  session_id UUID;
BEGIN
  INSERT INTO public.live_stream_sessions (
    influencer_id,
    title,
    description,
    scheduled_start_time,
    status,
    room_code
  ) VALUES (
    p_influencer_id,
    p_title,
    p_description,
    NOW() + INTERVAL '1 hour',
    'scheduled',
    'test-' || substr(md5(random()::text), 1, 8)
  ) RETURNING id INTO session_id;
  
  RETURN session_id;
END;
$$ LANGUAGE plpgsql;

-- Function to simulate viewer joining
CREATE OR REPLACE FUNCTION simulate_viewer_join(
  p_session_id UUID,
  p_user_id UUID DEFAULT NULL,
  p_viewer_type TEXT DEFAULT 'anonymous'
) RETURNS UUID AS $$
DECLARE
  viewer_id UUID;
BEGIN
  INSERT INTO public.live_stream_viewers (
    session_id,
    user_id,
    viewer_type,
    device_type,
    browser
  ) VALUES (
    p_session_id,
    p_user_id,
    p_viewer_type,
    'desktop',
    'chrome'
  ) RETURNING id INTO viewer_id;
  
  RETURN viewer_id;
END;
$$ LANGUAGE plpgsql;

-- Comments for documentation
COMMENT ON TABLE public.live_stream_sessions IS 'Main table for live streaming sessions with comprehensive metrics and 100ms integration';
COMMENT ON TABLE public.live_stream_viewers IS 'Individual viewer tracking for analytics and engagement metrics';
COMMENT ON TABLE public.live_stream_schedule IS 'Scheduled future streams with recurring event support';
COMMENT ON TABLE public.live_stream_analytics IS 'Time-based aggregated analytics for performance tracking';
COMMENT ON TABLE public.live_stream_chat IS 'Real-time chat messages during live sessions';
COMMENT ON TABLE public.live_stream_products IS 'Products showcased during live sessions with performance tracking';
COMMENT ON TABLE public.live_stream_notifications IS 'Notification system for live streaming events';
