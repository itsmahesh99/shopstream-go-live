import { supabase } from '../lib/supabase';
import { Influencer, InfluencerStats, CreateInfluencerData, UpdateInfluencerData } from '../types/influencer';

export class InfluencerService {
  /**
   * Get influencer profile by user ID
   */
  static async getInfluencerProfile(userId: string): Promise<{ data: Influencer | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('influencers')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching influencer profile:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error in getInfluencerProfile:', error);
      return { data: null, error };
    }
  }

  /**
   * Get influencer profile by influencer ID
   */
  static async getInfluencerById(influencerId: string): Promise<{ data: Influencer | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('influencers')
        .select('*')
        .eq('id', influencerId)
        .single();

      if (error) {
        console.error('Error fetching influencer by ID:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error in getInfluencerById:', error);
      return { data: null, error };
    }
  }

  /**
   * Update influencer profile
   */
  static async updateInfluencerProfile(
    userId: string, 
    updates: UpdateInfluencerData
  ): Promise<{ data: Influencer | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('influencers')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error updating influencer profile:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error in updateInfluencerProfile:', error);
      return { data: null, error };
    }
  }

  /**
   * Get influencer statistics
   */
  static async getInfluencerStats(influencerId: string): Promise<{ data: InfluencerStats | null; error: any }> {
    try {
      // Get basic influencer data
      const { data: influencer, error: influencerError } = await supabase
        .from('influencers')
        .select('total_earnings, total_live_sessions, total_viewers, followers_count')
        .eq('id', influencerId)
        .single();

      if (influencerError) {
        return { data: null, error: influencerError };
      }

      // Get recent analytics for average viewers and conversion rate
      const { data: analytics, error: analyticsError } = await supabase
        .from('influencer_analytics')
        .select('average_viewers, conversion_rate')
        .eq('influencer_id', influencerId)
        .order('period_start', { ascending: false })
        .limit(1)
        .single();

      const stats: InfluencerStats = {
        totalEarnings: influencer.total_earnings || 0,
        totalStreams: influencer.total_live_sessions || 0,
        totalViewers: influencer.total_viewers || 0,
        averageViewers: analytics?.average_viewers || 0,
        followersCount: influencer.followers_count || 0,
        conversionRate: analytics?.conversion_rate || 0
      };

      return { data: stats, error: null };
    } catch (error) {
      console.error('Error in getInfluencerStats:', error);
      return { data: null, error };
    }
  }

  /**
   * Get influencer achievements
   */
  static async getInfluencerAchievements(influencerId: string) {
    try {
      const { data, error } = await supabase
        .from('influencer_achievements')
        .select('*')
        .eq('influencer_id', influencerId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching achievements:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error in getInfluencerAchievements:', error);
      return { data: null, error };
    }
  }

  /**
   * Get influencer goals
   */
  static async getInfluencerGoals(influencerId: string) {
    try {
      const { data, error } = await supabase
        .from('influencer_goals')
        .select('*')
        .eq('influencer_id', influencerId)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching goals:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error in getInfluencerGoals:', error);
      return { data: null, error };
    }
  }

  /**
   * Get recent live sessions
   */
  static async getRecentLiveSessions(influencerId: string, limit: number = 5) {
    try {
      const { data, error } = await supabase
        .from('live_sessions')
        .select('*')
        .eq('influencer_id', influencerId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching recent sessions:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error in getRecentLiveSessions:', error);
      return { data: null, error };
    }
  }

  /**
   * Create influencer profile
   */
  static async createInfluencerProfile(
    userId: string, 
    profileData: CreateInfluencerData
  ): Promise<{ data: Influencer | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('influencers')
        .insert({
          user_id: userId,
          ...profileData,
          followers_count: 0,
          experience_years: 0,
          total_live_sessions: 0,
          total_viewers: 0,
          average_session_duration: 0,
          commission_rate: 10, // Default 10%
          total_earnings: 0,
          is_verified: false,
          is_active: true,
          verification_status: 'pending'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating influencer profile:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error in createInfluencerProfile:', error);
      return { data: null, error };
    }
  }
}