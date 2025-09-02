import { supabase } from '@/lib/supabase';
import type { 
  Influencer, 
  InfluencerAchievement, 
  InfluencerGoal, 
  InfluencerEarning, 
  LiveSession, 
  InfluencerAnalytics,
  InfluencerSettings,
  CreateInfluencerData,
  UpdateInfluencerData,
  InfluencerStats
} from '@/types/influencer';

export class InfluencerAPI {
  // Get current influencer profile
  static async getCurrentInfluencer(): Promise<Influencer | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('influencers')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw error;
    }

    return data;
  }

  // Create influencer profile
  static async createInfluencer(influencerData: CreateInfluencerData): Promise<Influencer> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('influencers')
      .insert({
        user_id: user.id,
        ...influencerData,
        followers_count: 0,
        experience_years: 0,
        total_live_sessions: 0,
        total_viewers: 0,
        average_session_duration: 0,
        commission_rate: 15.00,
        total_earnings: 0.00,
        is_verified: false,
        is_active: true,
        verification_status: 'pending'
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Create default achievements, goals, and settings
    await this.createDefaultInfluencerData(data.id);

    return data;
  }

  // Update influencer profile
  static async updateInfluencer(updates: UpdateInfluencerData): Promise<Influencer> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('influencers')
      .update(updates)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  // Get influencer statistics
  static async getInfluencerStats(): Promise<InfluencerStats> {
    const influencer = await this.getCurrentInfluencer();
    
    if (!influencer) {
      throw new Error('Influencer profile not found');
    }

    // Get recent analytics for more detailed stats
    const { data: analytics } = await supabase
      .from('influencer_analytics')
      .select('*')
      .eq('influencer_id', influencer.id)
      .eq('period_type', 'monthly')
      .order('period_start', { ascending: false })
      .limit(1)
      .single();

    return {
      totalEarnings: influencer.total_earnings,
      totalStreams: influencer.total_live_sessions,
      totalViewers: influencer.total_viewers,
      averageViewers: analytics?.average_viewers || 0,
      followersCount: influencer.followers_count,
      conversionRate: analytics?.conversion_rate || 0
    };
  }

  // Get achievements
  static async getAchievements(): Promise<InfluencerAchievement[]> {
    const influencer = await this.getCurrentInfluencer();
    
    if (!influencer) {
      return [];
    }

    const { data, error } = await supabase
      .from('influencer_achievements')
      .select('*')
      .eq('influencer_id', influencer.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  }

  // Get goals
  static async getGoals(): Promise<InfluencerGoal[]> {
    const influencer = await this.getCurrentInfluencer();
    
    if (!influencer) {
      return [];
    }

    const { data, error } = await supabase
      .from('influencer_goals')
      .select('*')
      .eq('influencer_id', influencer.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  }

  // Get recent earnings
  static async getRecentEarnings(limit: number = 10): Promise<InfluencerEarning[]> {
    const influencer = await this.getCurrentInfluencer();
    
    if (!influencer) {
      return [];
    }

    const { data, error } = await supabase
      .from('influencer_earnings')
      .select('*')
      .eq('influencer_id', influencer.id)
      .order('earned_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    return data || [];
  }

  // Get live sessions
  static async getLiveSessions(limit?: number): Promise<LiveSession[]> {
    const influencer = await this.getCurrentInfluencer();
    
    if (!influencer) {
      return [];
    }

    let query = supabase
      .from('live_sessions')
      .select('*')
      .eq('influencer_id', influencer.id)
      .order('scheduled_start_time', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return data || [];
  }

  // Get recent live sessions
  static async getRecentLiveSessions(limit: number = 5): Promise<LiveSession[]> {
    const influencer = await this.getCurrentInfluencer();
    
    if (!influencer) {
      return [];
    }

    const { data, error } = await supabase
      .from('live_sessions')
      .select('*')
      .eq('influencer_id', influencer.id)
      .eq('status', 'ended')
      .order('end_time', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    return data || [];
  }

  // Get upcoming live sessions
  static async getUpcomingLiveSessions(limit: number = 5): Promise<LiveSession[]> {
    const influencer = await this.getCurrentInfluencer();
    
    if (!influencer) {
      return [];
    }

    const { data, error } = await supabase
      .from('live_sessions')
      .select('*')
      .eq('influencer_id', influencer.id)
      .eq('status', 'scheduled')
      .gte('scheduled_start_time', new Date().toISOString())
      .order('scheduled_start_time', { ascending: true })
      .limit(limit);

    if (error) {
      throw error;
    }

    return data || [];
  }

  // Create a new live session
  static async createLiveSession(sessionData: {
    title: string;
    description?: string;
    scheduled_start_time: string;
  }): Promise<LiveSession> {
    const influencer = await this.getCurrentInfluencer();
    
    if (!influencer) {
      throw new Error('Influencer profile not found');
    }

    const { data, error } = await supabase
      .from('live_sessions')
      .insert({
        influencer_id: influencer.id,
        ...sessionData,
        status: 'scheduled',
        peak_viewers: 0,
        total_unique_viewers: 0,
        total_products_showcased: 0,
        total_sales_generated: 0
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  // Get settings
  static async getSettings(): Promise<InfluencerSettings | null> {
    const influencer = await this.getCurrentInfluencer();
    
    if (!influencer) {
      return null;
    }

    const { data, error } = await supabase
      .from('influencer_settings')
      .select('*')
      .eq('influencer_id', influencer.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return data;
  }

  // Update settings
  static async updateSettings(settings: Partial<InfluencerSettings>): Promise<InfluencerSettings> {
    const influencer = await this.getCurrentInfluencer();
    
    if (!influencer) {
      throw new Error('Influencer profile not found');
    }

    const { data, error } = await supabase
      .from('influencer_settings')
      .update(settings)
      .eq('influencer_id', influencer.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  // Helper function to create default data for new influencers
  private static async createDefaultInfluencerData(influencerId: string): Promise<void> {
    try {
      // Call the database functions to create default data
      await supabase.rpc('create_default_influencer_achievements', {
        p_influencer_id: influencerId
      });

      await supabase.rpc('create_default_influencer_goals', {
        p_influencer_id: influencerId
      });

      await supabase.rpc('create_default_influencer_settings', {
        p_influencer_id: influencerId
      });
    } catch (error) {
      console.error('Error creating default influencer data:', error);
      // Don't throw error here as the main profile creation succeeded
    }
  }
}

export default InfluencerAPI;
