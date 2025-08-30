-- Fix the influencer achievements trigger function
-- The issue is that the trigger is trying to use NEW.influencer_id 
-- but the influencers table has a column called 'id', not 'influencer_id'

-- Drop and recreate the function with the correct column reference
CREATE OR REPLACE FUNCTION check_influencer_achievements()
RETURNS TRIGGER AS $$
BEGIN
  -- Check Stream Master achievement (10+ successful streams)
  UPDATE public.influencer_achievements 
  SET is_completed = true,
      completed_at = NOW(),
      progress_value = target_value
  WHERE influencer_id = NEW.id  -- Changed from NEW.influencer_id to NEW.id
  AND achievement_type = 'stream_master'
  AND is_completed = false
  AND NEW.total_live_sessions >= 10;
  
  -- Check Audience Builder achievement (1000+ followers)
  UPDATE public.influencer_achievements 
  SET is_completed = true,
      completed_at = NOW(),
      progress_value = target_value
  WHERE influencer_id = NEW.id  -- Changed from NEW.influencer_id to NEW.id
  AND achievement_type = 'audience_builder'
  AND is_completed = false
  AND NEW.followers_count >= 1000;
  
  -- Check Revenue Generator achievement ($500+ in a month)
  UPDATE public.influencer_achievements 
  SET is_completed = true,
      completed_at = NOW(),
      progress_value = target_value
  WHERE influencer_id = NEW.id  -- Changed from NEW.influencer_id to NEW.id
  AND achievement_type = 'revenue_generator'
  AND is_completed = false
  AND NEW.total_earnings >= 500;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Also create a backup function to handle the goal progress update
CREATE OR REPLACE FUNCTION update_influencer_goal_progress()
RETURNS TRIGGER AS $$
BEGIN
  -- Update follower-related goals
  UPDATE public.influencer_goals 
  SET current_value = NEW.followers_count,
      progress_percentage = LEAST(100, (NEW.followers_count::DECIMAL / target_value * 100)),
      is_completed = (NEW.followers_count >= target_value),
      completed_at = CASE 
        WHEN NEW.followers_count >= target_value AND completed_at IS NULL THEN NOW()
        ELSE completed_at
      END
  WHERE influencer_id = NEW.id  -- Changed from NEW.influencer_id to NEW.id
  AND goal_type IN ('followers', 'audience_growth');
  
  -- Update revenue-related goals
  UPDATE public.influencer_goals 
  SET current_value = NEW.total_earnings,
      progress_percentage = LEAST(100, (NEW.total_earnings::DECIMAL / target_value * 100)),
      is_completed = (NEW.total_earnings >= target_value),
      completed_at = CASE 
        WHEN NEW.total_earnings >= target_value AND completed_at IS NULL THEN NOW()
        ELSE completed_at
      END
  WHERE influencer_id = NEW.id  -- Changed from NEW.influencer_id to NEW.id
  AND goal_type IN ('revenue', 'earnings');
  
  -- Update stream-related goals
  UPDATE public.influencer_goals 
  SET current_value = NEW.total_live_sessions,
      progress_percentage = LEAST(100, (NEW.total_live_sessions::DECIMAL / target_value * 100)),
      is_completed = (NEW.total_live_sessions >= target_value),
      completed_at = CASE 
        WHEN NEW.total_live_sessions >= target_value AND completed_at IS NULL THEN NOW()
        ELSE completed_at
      END
  WHERE influencer_id = NEW.id  -- Changed from NEW.influencer_id to NEW.id
  AND goal_type IN ('streaming', 'live_sessions');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

SELECT 'Trigger functions fixed successfully!' as result;
