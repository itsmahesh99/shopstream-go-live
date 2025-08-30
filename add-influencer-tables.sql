-- Add Only New Influencer Dashboard Tables
-- This script only creates the new tables that don't exist yet
-- Safe to run multiple times

-- Enable UUID extension (safe to run multiple times)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- CREATE INFLUENCER DASHBOARD TABLES (NEW TABLES ONLY)
-- =============================================================================

DO $$
BEGIN
    -- 1. Create INFLUENCER_ACHIEVEMENTS table if it doesn't exist
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'influencer_achievements') THEN
        CREATE TABLE public.influencer_achievements (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            influencer_id UUID REFERENCES public.influencers(id) ON DELETE CASCADE NOT NULL,
            
            -- Achievement Details
            achievement_type VARCHAR(50) NOT NULL,
            title VARCHAR(100) NOT NULL,
            description TEXT,
            criteria JSONB,
            
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
        
        RAISE NOTICE 'Created influencer_achievements table';
    ELSE
        RAISE NOTICE 'influencer_achievements table already exists, skipping';
    END IF;

    -- 2. Create INFLUENCER_GOALS table if it doesn't exist
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'influencer_goals') THEN
        CREATE TABLE public.influencer_goals (
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
        
        RAISE NOTICE 'Created influencer_goals table';
    ELSE
        RAISE NOTICE 'influencer_goals table already exists, skipping';
    END IF;

    -- 3. Create INFLUENCER_EARNINGS table if it doesn't exist
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'influencer_earnings') THEN
        CREATE TABLE public.influencer_earnings (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            influencer_id UUID REFERENCES public.influencers(id) ON DELETE CASCADE NOT NULL,
            live_session_id UUID REFERENCES public.live_sessions(id) ON DELETE SET NULL,
            
            -- Earning Details
            earning_type VARCHAR(50) NOT NULL,
            amount DECIMAL(12,2) NOT NULL,
            commission_rate DECIMAL(5,2),
            gross_sales DECIMAL(12,2),
            
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
        
        RAISE NOTICE 'Created influencer_earnings table';
    ELSE
        RAISE NOTICE 'influencer_earnings table already exists, skipping';
    END IF;

    -- 4. Create INFLUENCER_ANALYTICS table if it doesn't exist
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'influencer_analytics') THEN
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
            average_watch_time DECIMAL(8,2) DEFAULT 0.00,
            
            -- Sales Metrics
            total_sales DECIMAL(12,2) DEFAULT 0.00,
            total_orders INTEGER DEFAULT 0,
            conversion_rate DECIMAL(5,2) DEFAULT 0.00,
            average_order_value DECIMAL(10,2) DEFAULT 0.00,
            
            -- Growth Metrics
            new_followers INTEGER DEFAULT 0,
            total_followers_end INTEGER DEFAULT 0,
            follower_growth_rate DECIMAL(5,2) DEFAULT 0.00,
            
            -- Earnings
            total_earnings DECIMAL(12,2) DEFAULT 0.00,
            
            -- Timestamps
            created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
            
            -- Ensure unique period per influencer
            UNIQUE(influencer_id, period_type, period_start, period_end)
        );
        
        RAISE NOTICE 'Created influencer_analytics table';
    ELSE
        RAISE NOTICE 'influencer_analytics table already exists, skipping';
    END IF;

    -- 5. Create INFLUENCER_NOTIFICATIONS table if it doesn't exist
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'influencer_notifications') THEN
        CREATE TABLE public.influencer_notifications (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            influencer_id UUID REFERENCES public.influencers(id) ON DELETE CASCADE NOT NULL,
            
            -- Notification Details
            title VARCHAR(255) NOT NULL,
            message TEXT NOT NULL,
            type VARCHAR(50) NOT NULL,
            priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
            
            -- Status
            is_read BOOLEAN DEFAULT false,
            is_deleted BOOLEAN DEFAULT false,
            
            -- Related Data (optional)
            related_type VARCHAR(50),
            related_id UUID,
            
            -- Action URL (optional)
            action_url VARCHAR(500),
            action_text VARCHAR(100),
            
            -- Timestamps
            created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
            read_at TIMESTAMP WITH TIME ZONE,
            deleted_at TIMESTAMP WITH TIME ZONE
        );
        
        RAISE NOTICE 'Created influencer_notifications table';
    ELSE
        RAISE NOTICE 'influencer_notifications table already exists, skipping';
    END IF;

    -- 6. Create INFLUENCER_SETTINGS table if it doesn't exist
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'influencer_settings') THEN
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
        
        RAISE NOTICE 'Created influencer_settings table';
    ELSE
        RAISE NOTICE 'influencer_settings table already exists, skipping';
    END IF;

END $$;

-- =============================================================================
-- CREATE INDEXES (Only if tables were created)
-- =============================================================================

-- Create indexes safely
DO $$
BEGIN
    -- Achievements indexes
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE tablename = 'influencer_achievements' AND indexname = 'idx_influencer_achievements_influencer_id') THEN
        CREATE INDEX idx_influencer_achievements_influencer_id ON public.influencer_achievements(influencer_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE tablename = 'influencer_achievements' AND indexname = 'idx_influencer_achievements_type') THEN
        CREATE INDEX idx_influencer_achievements_type ON public.influencer_achievements(achievement_type);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE tablename = 'influencer_achievements' AND indexname = 'idx_influencer_achievements_completed') THEN
        CREATE INDEX idx_influencer_achievements_completed ON public.influencer_achievements(is_completed);
    END IF;

    -- Goals indexes
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE tablename = 'influencer_goals' AND indexname = 'idx_influencer_goals_influencer_id') THEN
        CREATE INDEX idx_influencer_goals_influencer_id ON public.influencer_goals(influencer_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE tablename = 'influencer_goals' AND indexname = 'idx_influencer_goals_period') THEN
        CREATE INDEX idx_influencer_goals_period ON public.influencer_goals(period_type, start_date, end_date);
    END IF;

    -- Earnings indexes
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE tablename = 'influencer_earnings' AND indexname = 'idx_influencer_earnings_influencer_id') THEN
        CREATE INDEX idx_influencer_earnings_influencer_id ON public.influencer_earnings(influencer_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE tablename = 'influencer_earnings' AND indexname = 'idx_influencer_earnings_earned_at') THEN
        CREATE INDEX idx_influencer_earnings_earned_at ON public.influencer_earnings(earned_at);
    END IF;

    -- Analytics indexes
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE tablename = 'influencer_analytics' AND indexname = 'idx_influencer_analytics_influencer_id') THEN
        CREATE INDEX idx_influencer_analytics_influencer_id ON public.influencer_analytics(influencer_id);
    END IF;

    -- Notifications indexes
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE tablename = 'influencer_notifications' AND indexname = 'idx_influencer_notifications_influencer_id') THEN
        CREATE INDEX idx_influencer_notifications_influencer_id ON public.influencer_notifications(influencer_id);
    END IF;

    RAISE NOTICE 'Created indexes for new tables';
END $$;

-- =============================================================================
-- ENABLE ROW LEVEL SECURITY
-- =============================================================================

DO $$
BEGIN
    -- Enable RLS on new tables
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'influencer_achievements') THEN
        ALTER TABLE public.influencer_achievements ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'influencer_goals') THEN
        ALTER TABLE public.influencer_goals ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'influencer_earnings') THEN
        ALTER TABLE public.influencer_earnings ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'influencer_analytics') THEN
        ALTER TABLE public.influencer_analytics ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'influencer_notifications') THEN
        ALTER TABLE public.influencer_notifications ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'influencer_settings') THEN
        ALTER TABLE public.influencer_settings ENABLE ROW LEVEL SECURITY;
    END IF;

    RAISE NOTICE 'Enabled RLS on new tables';
END $$;

-- =============================================================================
-- CREATE RLS POLICIES
-- =============================================================================

-- Create policies only if tables exist
DO $$
BEGIN
    -- Achievements policies
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'influencer_achievements') THEN
        DROP POLICY IF EXISTS "Influencers can view own achievements" ON public.influencer_achievements;
        CREATE POLICY "Influencers can view own achievements" ON public.influencer_achievements FOR SELECT USING (
            influencer_id IN (SELECT id FROM public.influencers WHERE user_id = auth.uid())
        );
        
        DROP POLICY IF EXISTS "Influencers can manage own achievements" ON public.influencer_achievements;
        CREATE POLICY "Influencers can manage own achievements" ON public.influencer_achievements FOR ALL USING (
            influencer_id IN (SELECT id FROM public.influencers WHERE user_id = auth.uid())
        );
    END IF;

    -- Goals policies
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'influencer_goals') THEN
        DROP POLICY IF EXISTS "Influencers can view own goals" ON public.influencer_goals;
        CREATE POLICY "Influencers can view own goals" ON public.influencer_goals FOR SELECT USING (
            influencer_id IN (SELECT id FROM public.influencers WHERE user_id = auth.uid())
        );
        
        DROP POLICY IF EXISTS "Influencers can manage own goals" ON public.influencer_goals;
        CREATE POLICY "Influencers can manage own goals" ON public.influencer_goals FOR ALL USING (
            influencer_id IN (SELECT id FROM public.influencers WHERE user_id = auth.uid())
        );
    END IF;

    -- Earnings policies
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'influencer_earnings') THEN
        DROP POLICY IF EXISTS "Influencers can view own earnings" ON public.influencer_earnings;
        CREATE POLICY "Influencers can view own earnings" ON public.influencer_earnings FOR SELECT USING (
            influencer_id IN (SELECT id FROM public.influencers WHERE user_id = auth.uid())
        );
    END IF;

    -- Analytics policies
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'influencer_analytics') THEN
        DROP POLICY IF EXISTS "Influencers can view own analytics" ON public.influencer_analytics;
        CREATE POLICY "Influencers can view own analytics" ON public.influencer_analytics FOR SELECT USING (
            influencer_id IN (SELECT id FROM public.influencers WHERE user_id = auth.uid())
        );
        
        DROP POLICY IF EXISTS "Influencers can manage own analytics" ON public.influencer_analytics;
        CREATE POLICY "Influencers can manage own analytics" ON public.influencer_analytics FOR ALL USING (
            influencer_id IN (SELECT id FROM public.influencers WHERE user_id = auth.uid())
        );
    END IF;

    -- Notifications policies
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'influencer_notifications') THEN
        DROP POLICY IF EXISTS "Influencers can view own notifications" ON public.influencer_notifications;
        CREATE POLICY "Influencers can view own notifications" ON public.influencer_notifications FOR SELECT USING (
            influencer_id IN (SELECT id FROM public.influencers WHERE user_id = auth.uid())
        );
        
        DROP POLICY IF EXISTS "Influencers can manage own notifications" ON public.influencer_notifications;
        CREATE POLICY "Influencers can manage own notifications" ON public.influencer_notifications FOR ALL USING (
            influencer_id IN (SELECT id FROM public.influencers WHERE user_id = auth.uid())
        );
    END IF;

    -- Settings policies
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'influencer_settings') THEN
        DROP POLICY IF EXISTS "Influencers can view own settings" ON public.influencer_settings;
        CREATE POLICY "Influencers can view own settings" ON public.influencer_settings FOR SELECT USING (
            influencer_id IN (SELECT id FROM public.influencers WHERE user_id = auth.uid())
        );
        
        DROP POLICY IF EXISTS "Influencers can manage own settings" ON public.influencer_settings;
        CREATE POLICY "Influencers can manage own settings" ON public.influencer_settings FOR ALL USING (
            influencer_id IN (SELECT id FROM public.influencers WHERE user_id = auth.uid())
        );
    END IF;

    RAISE NOTICE 'Created RLS policies for new tables';
END $$;

-- =============================================================================
-- CREATE UPDATE TRIGGERS (Only if function exists)
-- =============================================================================

DO $$
BEGIN
    -- Check if update function exists
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'handle_updated_at') THEN
        -- Create triggers for new tables
        IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'influencer_achievements') THEN
            DROP TRIGGER IF EXISTS handle_updated_at_influencer_achievements ON public.influencer_achievements;
            CREATE TRIGGER handle_updated_at_influencer_achievements BEFORE UPDATE ON public.influencer_achievements FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
        END IF;
        
        IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'influencer_goals') THEN
            DROP TRIGGER IF EXISTS handle_updated_at_influencer_goals ON public.influencer_goals;
            CREATE TRIGGER handle_updated_at_influencer_goals BEFORE UPDATE ON public.influencer_goals FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
        END IF;
        
        IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'influencer_earnings') THEN
            DROP TRIGGER IF EXISTS handle_updated_at_influencer_earnings ON public.influencer_earnings;
            CREATE TRIGGER handle_updated_at_influencer_earnings BEFORE UPDATE ON public.influencer_earnings FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
        END IF;
        
        IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'influencer_analytics') THEN
            DROP TRIGGER IF EXISTS handle_updated_at_influencer_analytics ON public.influencer_analytics;
            CREATE TRIGGER handle_updated_at_influencer_analytics BEFORE UPDATE ON public.influencer_analytics FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
        END IF;
        
        IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'influencer_settings') THEN
            DROP TRIGGER IF EXISTS handle_updated_at_influencer_settings ON public.influencer_settings;
            CREATE TRIGGER handle_updated_at_influencer_settings BEFORE UPDATE ON public.influencer_settings FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
        END IF;

        RAISE NOTICE 'Created update triggers for new tables';
    ELSE
        RAISE NOTICE 'handle_updated_at function not found, skipping triggers';
    END IF;
END $$;

RAISE NOTICE 'Migration completed successfully!';
