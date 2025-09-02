-- Fixed Live Streaming Migration for Supabase
-- Run this SQL in your Supabase SQL Editor (Dashboard > SQL Editor)
-- This version fixes column name issues and includes better error handling

-- 1. Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create enhanced live stream sessions table
CREATE TABLE IF NOT EXISTS public.live_stream_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  influencer_id UUID NOT NULL,
  
  -- Session Identification
  session_code VARCHAR(20) UNIQUE,
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
  hls_url VARCHAR(500),
  rtmp_url VARCHAR(500),
  recording_url VARCHAR(500),
  
  -- 100ms Integration
  room_id VARCHAR(255),
  room_code VARCHAR(100),
  template_id VARCHAR(255),
  
  -- Session Configuration
  max_viewers INTEGER DEFAULT 1000,
  is_recording_enabled BOOLEAN DEFAULT true,
  is_chat_enabled BOOLEAN DEFAULT true,
  is_products_showcase BOOLEAN DEFAULT true,
  visibility VARCHAR(20) DEFAULT 'public' CHECK (visibility IN ('public', 'private', 'unlisted')),
  
  -- Performance Metrics
  current_viewers INTEGER DEFAULT 0,
  peak_viewers INTEGER DEFAULT 0,
  total_unique_viewers INTEGER DEFAULT 0,
  total_watch_time_minutes INTEGER DEFAULT 0,
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
  conversion_rate DECIMAL(5,2) DEFAULT 0.00,
  
  -- Quality Metrics
  stream_quality VARCHAR(20) DEFAULT 'auto',
  connection_issues_count INTEGER DEFAULT 0,
  buffering_events INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Add foreign key constraint only if influencers table exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'influencers') THEN
    ALTER TABLE public.live_stream_sessions 
    ADD CONSTRAINT fk_live_stream_sessions_influencer 
    FOREIGN KEY (influencer_id) REFERENCES public.influencers(id) ON DELETE CASCADE;
  END IF;
END $$;

-- 3. Create live stream viewers table
CREATE TABLE IF NOT EXISTS public.live_stream_viewers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES public.live_stream_sessions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID,
  
  -- Viewer Details
  viewer_type VARCHAR(20) DEFAULT 'customer' CHECK (viewer_type IN ('customer', 'influencer', 'wholesaler', 'anonymous')),
  ip_address INET,
  user_agent TEXT,
  country VARCHAR(100),
  city VARCHAR(100),
  device_type VARCHAR(50),
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
  connection_quality VARCHAR(20) DEFAULT 'good',
  buffering_time_seconds INTEGER DEFAULT 0,
  disconnections_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Add foreign key constraint to auth.users if it exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'auth' AND tablename = 'users') THEN
    ALTER TABLE public.live_stream_viewers 
    ADD CONSTRAINT fk_live_stream_viewers_user 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;
END $$;

-- 4. Create live stream schedule table
CREATE TABLE IF NOT EXISTS public.live_stream_schedule (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  influencer_id UUID NOT NULL,
  
  -- Schedule Details
  title VARCHAR(255) NOT NULL,
  description TEXT,
  thumbnail_url VARCHAR(500),
  
  -- Timing
  scheduled_date DATE NOT NULL,
  scheduled_start_time TIME NOT NULL,
  scheduled_end_time TIME NOT NULL,
  timezone VARCHAR(50) DEFAULT 'UTC',
  
  -- Recurrence
  is_recurring BOOLEAN DEFAULT false,
  recurrence_pattern VARCHAR(20) CHECK (recurrence_pattern IN ('daily', 'weekly', 'monthly', 'custom')),
  recurrence_end_date DATE,
  days_of_week INTEGER[],
  
  -- Pre-stream Configuration
  products_to_showcase UUID[],
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
  
  -- Session Link
  created_session_id UUID REFERENCES public.live_stream_sessions(id),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Add foreign key constraint to influencers if it exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'influencers') THEN
    ALTER TABLE public.live_stream_schedule 
    ADD CONSTRAINT fk_live_stream_schedule_influencer 
    FOREIGN KEY (influencer_id) REFERENCES public.influencers(id) ON DELETE CASCADE;
  END IF;
END $$;

-- 5. Create live stream chat table
CREATE TABLE IF NOT EXISTS public.live_stream_chat (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES public.live_stream_sessions(id) ON DELETE CASCADE NOT NULL,
  viewer_id UUID REFERENCES public.live_stream_viewers(id) ON DELETE CASCADE,
  user_id UUID,
  
  -- Message Details
  message TEXT NOT NULL,
  message_type VARCHAR(20) DEFAULT 'chat' CHECK (message_type IN ('chat', 'reaction', 'system', 'product_highlight')),
  
  -- Metadata
  username VARCHAR(100),
  avatar_url VARCHAR(500),
  is_influencer BOOLEAN DEFAULT false,
  is_moderator BOOLEAN DEFAULT false,
  
  -- Moderation
  is_deleted BOOLEAN DEFAULT false,
  is_flagged BOOLEAN DEFAULT false,
  deleted_by UUID,
  deletion_reason TEXT,
  
  -- Engagement
  reactions JSONB DEFAULT '{}',
  replies_count INTEGER DEFAULT 0,
  parent_message_id UUID REFERENCES public.live_stream_chat(id),
  
  -- Timestamps
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  edited_at TIMESTAMP WITH TIME ZONE,
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Add foreign key constraints for auth.users
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'auth' AND tablename = 'users') THEN
    ALTER TABLE public.live_stream_chat 
    ADD CONSTRAINT fk_live_stream_chat_user 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;
    
    ALTER TABLE public.live_stream_chat 
    ADD CONSTRAINT fk_live_stream_chat_deleted_by 
    FOREIGN KEY (deleted_by) REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;
END $$;

-- 6. Create live stream products table
CREATE TABLE IF NOT EXISTS public.live_stream_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES public.live_stream_sessions(id) ON DELETE CASCADE NOT NULL,
  product_id UUID NOT NULL,
  
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

-- Add foreign key constraint to products if it exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'products') THEN
    ALTER TABLE public.live_stream_products 
    ADD CONSTRAINT fk_live_stream_products_product 
    FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;
  END IF;
END $$;

-- 7. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_live_stream_sessions_influencer_id ON public.live_stream_sessions(influencer_id);
CREATE INDEX IF NOT EXISTS idx_live_stream_sessions_status ON public.live_stream_sessions(status);
CREATE INDEX IF NOT EXISTS idx_live_stream_sessions_scheduled_start ON public.live_stream_sessions(scheduled_start_time);

CREATE INDEX IF NOT EXISTS idx_live_stream_viewers_session_id ON public.live_stream_viewers(session_id);
CREATE INDEX IF NOT EXISTS idx_live_stream_viewers_user_id ON public.live_stream_viewers(user_id);
CREATE INDEX IF NOT EXISTS idx_live_stream_viewers_joined_at ON public.live_stream_viewers(joined_at);

CREATE INDEX IF NOT EXISTS idx_live_stream_schedule_influencer_id ON public.live_stream_schedule(influencer_id);
CREATE INDEX IF NOT EXISTS idx_live_stream_schedule_date ON public.live_stream_schedule(scheduled_date);

CREATE INDEX IF NOT EXISTS idx_live_stream_chat_session_id ON public.live_stream_chat(session_id);
CREATE INDEX IF NOT EXISTS idx_live_stream_chat_sent_at ON public.live_stream_chat(sent_at);

CREATE INDEX IF NOT EXISTS idx_live_stream_products_session_id ON public.live_stream_products(session_id);
CREATE INDEX IF NOT EXISTS idx_live_stream_products_product_id ON public.live_stream_products(product_id);

-- 8. Create function to generate session codes
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

-- 9. Create trigger to auto-generate session codes
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

-- 10. Create function to update session metrics
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
    
    -- Update peak viewers
    UPDATE public.live_stream_sessions 
    SET peak_viewers = GREATEST(peak_viewers, current_viewers)
    WHERE id = NEW.session_id;
    
  ELSIF TG_OP = 'UPDATE' AND TG_TABLE_NAME = 'live_stream_viewers' 
    AND OLD.is_still_watching = true AND NEW.is_still_watching = false THEN
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
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- 11. Create triggers for real-time metrics updates
DROP TRIGGER IF EXISTS trigger_update_session_metrics_viewers ON public.live_stream_viewers;
CREATE TRIGGER trigger_update_session_metrics_viewers
  AFTER INSERT OR UPDATE ON public.live_stream_viewers
  FOR EACH ROW EXECUTE FUNCTION update_session_metrics();

DROP TRIGGER IF EXISTS trigger_update_session_metrics_chat ON public.live_stream_chat;
CREATE TRIGGER trigger_update_session_metrics_chat
  AFTER INSERT ON public.live_stream_chat
  FOR EACH ROW EXECUTE FUNCTION update_session_metrics();

-- 12. Enable Row Level Security
ALTER TABLE public.live_stream_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_stream_viewers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_stream_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_stream_chat ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_stream_products ENABLE ROW LEVEL SECURITY;

-- 13. Create RLS policies (only if influencers table exists)
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'influencers') THEN
    -- Sessions: Public can view live sessions, influencers can manage their own
    DROP POLICY IF EXISTS "Public can view live sessions" ON public.live_stream_sessions;
    CREATE POLICY "Public can view live sessions" ON public.live_stream_sessions
      FOR SELECT USING (status = 'live' OR visibility = 'public');

    DROP POLICY IF EXISTS "Influencers can manage their sessions" ON public.live_stream_sessions;
    CREATE POLICY "Influencers can manage their sessions" ON public.live_stream_sessions
      FOR ALL USING (
        influencer_id IN (
          SELECT id FROM public.influencers WHERE user_id = auth.uid()
        )
      );
  ELSE
    -- Basic policies if influencers table doesn't exist
    DROP POLICY IF EXISTS "Public can view live sessions" ON public.live_stream_sessions;
    CREATE POLICY "Public can view live sessions" ON public.live_stream_sessions
      FOR SELECT USING (status = 'live' OR visibility = 'public');
      
    DROP POLICY IF EXISTS "Authenticated users can manage sessions" ON public.live_stream_sessions;
    CREATE POLICY "Authenticated users can manage sessions" ON public.live_stream_sessions
      FOR ALL USING (auth.uid() IS NOT NULL);
  END IF;
END $$;

-- Viewers: Users can view their own records, anyone can create
DROP POLICY IF EXISTS "Users can view their viewer records" ON public.live_stream_viewers;
CREATE POLICY "Users can view their viewer records" ON public.live_stream_viewers
  FOR SELECT USING (user_id = auth.uid() OR user_id IS NULL);

DROP POLICY IF EXISTS "Anyone can create viewer records" ON public.live_stream_viewers;
CREATE POLICY "Anyone can create viewer records" ON public.live_stream_viewers
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update their viewer records" ON public.live_stream_viewers;
CREATE POLICY "Users can update their viewer records" ON public.live_stream_viewers
  FOR UPDATE USING (user_id = auth.uid() OR user_id IS NULL);

-- Chat: Users can view chat for public sessions, authenticated users can send messages
DROP POLICY IF EXISTS "Users can view chat for live sessions" ON public.live_stream_chat;
CREATE POLICY "Users can view chat for live sessions" ON public.live_stream_chat
  FOR SELECT USING (
    session_id IN (
      SELECT id FROM public.live_stream_sessions 
      WHERE status = 'live' OR visibility = 'public'
    )
  );

DROP POLICY IF EXISTS "Authenticated users can send chat" ON public.live_stream_chat;
CREATE POLICY "Authenticated users can send chat" ON public.live_stream_chat
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- 14. Create views for common queries (with proper column handling)
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'influencers') THEN
    -- Check if display_name column exists, otherwise use a fallback
    IF EXISTS (SELECT FROM information_schema.columns 
               WHERE table_schema = 'public' 
               AND table_name = 'influencers' 
               AND column_name = 'display_name') THEN
      
      CREATE OR REPLACE VIEW public.live_sessions_with_influencer AS
      SELECT 
        ls.*,
        i.display_name as stage_name,
        i.followers_count as follower_count
      FROM public.live_stream_sessions ls
      LEFT JOIN public.influencers i ON ls.influencer_id = i.id;

      CREATE OR REPLACE VIEW public.upcoming_streams AS
      SELECT 
        lss.*,
        i.display_name as stage_name,
        i.followers_count as follower_count,
        (scheduled_date + scheduled_start_time) as full_start_datetime,
        (scheduled_date + scheduled_end_time) as full_end_datetime
      FROM public.live_stream_schedule lss
      LEFT JOIN public.influencers i ON lss.influencer_id = i.id
      WHERE lss.status = 'scheduled' 
        AND (scheduled_date + scheduled_start_time) > NOW()
      ORDER BY (scheduled_date + scheduled_start_time);
        
    ELSE
      -- Fallback view without influencer details
      CREATE OR REPLACE VIEW public.live_sessions_with_influencer AS
      SELECT 
        ls.*,
        'Unknown' as stage_name,
        0 as follower_count
      FROM public.live_stream_sessions ls;

      CREATE OR REPLACE VIEW public.upcoming_streams AS
      SELECT 
        lss.*,
        'Unknown' as stage_name,
        0 as follower_count,
        (scheduled_date + scheduled_start_time) as full_start_datetime,
        (scheduled_date + scheduled_end_time) as full_end_datetime
      FROM public.live_stream_schedule lss
      WHERE lss.status = 'scheduled' 
        AND (scheduled_date + scheduled_start_time) > NOW()
      ORDER BY (scheduled_date + scheduled_start_time);
    END IF;
  ELSE
    -- Basic views without influencers table
    CREATE OR REPLACE VIEW public.live_sessions_with_influencer AS
    SELECT 
      ls.*,
      'Unknown' as stage_name,
      0 as follower_count
    FROM public.live_stream_sessions ls;

    CREATE OR REPLACE VIEW public.upcoming_streams AS
    SELECT 
      lss.*,
      'Unknown' as stage_name,
      0 as follower_count,
      (scheduled_date + scheduled_start_time) as full_start_datetime,
      (scheduled_date + scheduled_end_time) as full_end_datetime
    FROM public.live_stream_schedule lss
    WHERE lss.status = 'scheduled' 
      AND (scheduled_date + scheduled_start_time) > NOW()
    ORDER BY (scheduled_date + scheduled_start_time);
  END IF;
END $$;

-- 15. Add comments for documentation
COMMENT ON TABLE public.live_stream_sessions IS 'Live streaming sessions with comprehensive metrics and 100ms integration';
COMMENT ON TABLE public.live_stream_viewers IS 'Individual viewer tracking for analytics and engagement';
COMMENT ON TABLE public.live_stream_schedule IS 'Scheduled future streams with recurring event support';
COMMENT ON TABLE public.live_stream_chat IS 'Real-time chat messages during live sessions';
COMMENT ON TABLE public.live_stream_products IS 'Products showcased during live sessions with performance tracking';

-- 16. Insert test data (optional - only if influencers table exists)
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'influencers') THEN
    INSERT INTO public.live_stream_sessions (
      influencer_id,
      title,
      description,
      status,
      visibility
    ) 
    SELECT 
      i.id,
      'Welcome to Live Streaming!',
      'Your enhanced live streaming platform is ready. Create engaging sessions, track viewer analytics, and showcase products in real-time.',
      'scheduled',
      'public'
    FROM public.influencers i 
    LIMIT 1
    ON CONFLICT DO NOTHING;
  ELSE
    -- Create a simple test session without foreign key constraint
    INSERT INTO public.live_stream_sessions (
      influencer_id,
      title,
      description,
      status,
      visibility
    ) VALUES (
      uuid_generate_v4(),
      'Test Live Streaming Session',
      'This is a test session created during database migration.',
      'scheduled',
      'public'
    ) ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Success message
SELECT 'Fixed Live Streaming Database Schema Applied Successfully! 🎉' as status,
       'All tables created with proper error handling and column compatibility' as details;
