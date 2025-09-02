import { supabase } from '@/lib/supabase';
import type { 
  Influencer, 
  InfluencerAchievement, 
  InfluencerGoal, 
  InfluencerEarning, 
  InfluencerNotification,
  InfluencerSettings,
  LiveSession,
  InsertInfluencer,
  InsertInfluencerGoal,
  InsertLiveSession,
  UpdateInfluencer,
  UpdateInfluencerGoal,
  UpdateLiveSession
} from '@/types/supabase';

// Influencer Profile Management
export const influencerApi = {
  // Get current influencer profile
  async getCurrentInfluencer(): Promise<Influencer | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('influencers')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching influencer profile:', error);
      return null;
    }

    return data;
  },

  // Create influencer profile
  async createInfluencer(influencerData: InsertInfluencer): Promise<Influencer | null> {
    const { data, error } = await supabase
      .from('influencers')
      .insert(influencerData)
      .select()
      .single();

    if (error) {
      console.error('Error creating influencer profile:', error);
      return null;
    }

    // Create default achievements, goals, and settings
    if (data) {
      await Promise.all([
        supabase.rpc('create_default_influencer_achievements', { p_influencer_id: data.id }),
        supabase.rpc('create_default_influencer_goals', { p_influencer_id: data.id }),
        supabase.rpc('create_default_influencer_settings', { p_influencer_id: data.id })
      ]);
    }

    return data;
  },

  // Update influencer profile
  async updateInfluencer(id: string, updates: UpdateInfluencer): Promise<Influencer | null> {
    const { data, error } = await supabase
      .from('influencers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating influencer profile:', error);
      return null;
    }

    return data;
  },

  // Get influencer dashboard stats
  async getDashboardStats(influencerId: string) {
    try {
      const [
        { data: goals },
        { data: earnings },
        { data: sessions },
        { data: achievements }
      ] = await Promise.all([
        supabase
          .from('influencer_goals')
          .select('*')
          .eq('influencer_id', influencerId)
          .eq('status', 'active'),
        supabase
          .from('influencer_earnings')
          .select('amount, earned_at')
          .eq('influencer_id', influencerId)
          .gte('earned_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()), // Last 30 days
        supabase
          .from('live_sessions')
          .select('*')
          .eq('influencer_id', influencerId)
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('influencer_achievements')
          .select('*')
          .eq('influencer_id', influencerId)
          .eq('is_completed', true)
          .order('completed_at', { ascending: false })
          .limit(3)
      ]);

      const totalEarnings = earnings?.reduce((sum, earning) => sum + earning.amount, 0) || 0;
      const totalSessions = sessions?.length || 0;

      return {
        goals: goals || [],
        totalEarnings,
        totalSessions,
        recentSessions: sessions || [],
        achievements: achievements || []
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        goals: [],
        totalEarnings: 0,
        totalSessions: 0,
        recentSessions: [],
        achievements: []
      };
    }
  }
};

// Achievements Management
export const achievementsApi = {
  // Get all achievements for influencer
  async getAchievements(influencerId: string): Promise<InfluencerAchievement[]> {
    const { data, error } = await supabase
      .from('influencer_achievements')
      .select('*')
      .eq('influencer_id', influencerId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching achievements:', error);
      return [];
    }

    return data || [];
  },

  // Update achievement progress
  async updateAchievementProgress(id: string, progressValue: number): Promise<boolean> {
    const { error } = await supabase
      .from('influencer_achievements')
      .update({ progress_value: progressValue })
      .eq('id', id);

    if (error) {
      console.error('Error updating achievement progress:', error);
      return false;
    }

    return true;
  }
};

// Goals Management
export const goalsApi = {
  // Get all goals for influencer
  async getGoals(influencerId: string): Promise<InfluencerGoal[]> {
    const { data, error } = await supabase
      .from('influencer_goals')
      .select('*')
      .eq('influencer_id', influencerId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching goals:', error);
      return [];
    }

    return data || [];
  },

  // Create new goal
  async createGoal(goalData: InsertInfluencerGoal): Promise<InfluencerGoal | null> {
    const { data, error } = await supabase
      .from('influencer_goals')
      .insert(goalData)
      .select()
      .single();

    if (error) {
      console.error('Error creating goal:', error);
      return null;
    }

    return data;
  },

  // Update goal
  async updateGoal(id: string, updates: UpdateInfluencerGoal): Promise<InfluencerGoal | null> {
    const { data, error } = await supabase
      .from('influencer_goals')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating goal:', error);
      return null;
    }

    return data;
  },

  // Delete goal
  async deleteGoal(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('influencer_goals')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting goal:', error);
      return false;
    }

    return true;
  }
};

// Earnings Management
export const earningsApi = {
  // Get earnings for influencer
  async getEarnings(influencerId: string, limit?: number): Promise<InfluencerEarning[]> {
    let query = supabase
      .from('influencer_earnings')
      .select('*')
      .eq('influencer_id', influencerId)
      .order('earned_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching earnings:', error);
      return [];
    }

    return data || [];
  },

  // Get earnings summary
  async getEarningsSummary(influencerId: string) {
    try {
      const { data, error } = await supabase
        .from('influencer_earnings')
        .select('amount, earning_type, earned_at, status')
        .eq('influencer_id', influencerId);

      if (error) throw error;

      const earnings = data || [];
      const totalEarnings = earnings.reduce((sum, earning) => sum + earning.amount, 0);
      const pendingEarnings = earnings
        .filter(e => e.status === 'pending')
        .reduce((sum, earning) => sum + earning.amount, 0);
      const thisMonthEarnings = earnings
        .filter(e => new Date(e.earned_at).getMonth() === new Date().getMonth())
        .reduce((sum, earning) => sum + earning.amount, 0);

      return {
        totalEarnings,
        pendingEarnings,
        thisMonthEarnings,
        earningsCount: earnings.length
      };
    } catch (error) {
      console.error('Error fetching earnings summary:', error);
      return {
        totalEarnings: 0,
        pendingEarnings: 0,
        thisMonthEarnings: 0,
        earningsCount: 0
      };
    }
  }
};

// Live Sessions Management
export const liveSessionsApi = {
  // Get live sessions for influencer
  async getLiveSessions(influencerId: string, limit?: number): Promise<LiveSession[]> {
    let query = supabase
      .from('live_sessions')
      .select('*')
      .eq('influencer_id', influencerId)
      .order('created_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching live sessions:', error);
      return [];
    }

    return data || [];
  },

  // Create new live session
  async createLiveSession(sessionData: InsertLiveSession): Promise<LiveSession | null> {
    const { data, error } = await supabase
      .from('live_sessions')
      .insert(sessionData)
      .select()
      .single();

    if (error) {
      console.error('Error creating live session:', error);
      return null;
    }

    return data;
  },

  // Update live session
  async updateLiveSession(id: string, updates: UpdateLiveSession): Promise<LiveSession | null> {
    const { data, error } = await supabase
      .from('live_sessions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating live session:', error);
      return null;
    }

    return data;
  },

  // Start live session
  async startLiveSession(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('live_sessions')
      .update({
        status: 'live',
        actual_start_time: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error('Error starting live session:', error);
      return false;
    }

    return true;
  },

  // End live session
  async endLiveSession(id: string, metrics?: { peak_viewers?: number; total_unique_viewers?: number; total_sales_generated?: number }): Promise<boolean> {
    const updates: UpdateLiveSession = {
      status: 'ended',
      end_time: new Date().toISOString()
    };

    if (metrics) {
      Object.assign(updates, metrics);
    }

    const { error } = await supabase
      .from('live_sessions')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('Error ending live session:', error);
      return false;
    }

    return true;
  }
};

// Notifications Management
export const notificationsApi = {
  // Get notifications for influencer
  async getNotifications(influencerId: string, unreadOnly = false): Promise<InfluencerNotification[]> {
    let query = supabase
      .from('influencer_notifications')
      .select('*')
      .eq('influencer_id', influencerId)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false });

    if (unreadOnly) {
      query = query.eq('is_read', false);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }

    return data || [];
  },

  // Mark notification as read
  async markAsRead(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('influencer_notifications')
      .update({ 
        is_read: true, 
        read_at: new Date().toISOString() 
      })
      .eq('id', id);

    if (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }

    return true;
  },

  // Mark all notifications as read
  async markAllAsRead(influencerId: string): Promise<boolean> {
    const { error } = await supabase
      .from('influencer_notifications')
      .update({ 
        is_read: true, 
        read_at: new Date().toISOString() 
      })
      .eq('influencer_id', influencerId)
      .eq('is_read', false);

    if (error) {
      console.error('Error marking all notifications as read:', error);
      return false;
    }

    return true;
  }
};

// Settings Management
export const settingsApi = {
  // Get settings for influencer
  async getSettings(influencerId: string): Promise<InfluencerSettings | null> {
    const { data, error } = await supabase
      .from('influencer_settings')
      .select('*')
      .eq('influencer_id', influencerId)
      .single();

    if (error) {
      console.error('Error fetching settings:', error);
      return null;
    }

    return data;
  },

  // Update settings
  async updateSettings(influencerId: string, updates: Partial<InfluencerSettings>): Promise<InfluencerSettings | null> {
    const { data, error } = await supabase
      .from('influencer_settings')
      .update(updates)
      .eq('influencer_id', influencerId)
      .select()
      .single();

    if (error) {
      console.error('Error updating settings:', error);
      return null;
    }

    return data;
  }
};
