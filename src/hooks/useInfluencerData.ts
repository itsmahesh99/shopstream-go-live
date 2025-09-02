import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { influencerApi, achievementsApi, goalsApi, earningsApi, liveSessionsApi, notificationsApi, settingsApi } from '@/lib/api/influencerApi';
import type { 
  Influencer, 
  InfluencerAchievement, 
  InfluencerGoal, 
  InfluencerEarning, 
  InfluencerNotification,
  InfluencerSettings,
  LiveSession 
} from '@/types/supabase';

interface InfluencerDashboardData {
  profile: Influencer | null;
  achievements: InfluencerAchievement[];
  goals: InfluencerGoal[];
  earnings: InfluencerEarning[];
  liveSessions: LiveSession[];
  notifications: InfluencerNotification[];
  settings: InfluencerSettings | null;
  dashboardStats: {
    totalEarnings: number;
    totalSessions: number;
    recentSessions: LiveSession[];
    goals: InfluencerGoal[];
    achievements: InfluencerAchievement[];
  };
}

interface InfluencerDataState {
  data: InfluencerDashboardData;
  loading: boolean;
  error: string | null;
}

export const useInfluencerData = () => {
  const { user } = useAuth();
  const [state, setState] = useState<InfluencerDataState>({
    data: {
      profile: null,
      achievements: [],
      goals: [],
      earnings: [],
      liveSessions: [],
      notifications: [],
      settings: null,
      dashboardStats: {
        totalEarnings: 0,
        totalSessions: 0,
        recentSessions: [],
        goals: [],
        achievements: []
      }
    },
    loading: true,
    error: null
  });

  // Load all influencer data
  const loadInfluencerData = useCallback(async () => {
    if (!user) {
      setState(prev => ({ ...prev, loading: false }));
      return;
    }

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      // First get the influencer profile
      const profile = await influencerApi.getCurrentInfluencer();
      
      if (!profile) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: 'Influencer profile not found'
        }));
        return;
      }

      // Load all data in parallel
      const [
        achievements,
        goals,
        earnings,
        liveSessions,
        notifications,
        settings,
        dashboardStats
      ] = await Promise.all([
        achievementsApi.getAchievements(profile.id),
        goalsApi.getGoals(profile.id),
        earningsApi.getEarnings(profile.id, 10),
        liveSessionsApi.getLiveSessions(profile.id, 10),
        notificationsApi.getNotifications(profile.id),
        settingsApi.getSettings(profile.id),
        influencerApi.getDashboardStats(profile.id)
      ]);

      setState({
        data: {
          profile,
          achievements,
          goals,
          earnings,
          liveSessions,
          notifications,
          settings,
          dashboardStats
        },
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Error loading influencer data:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to load influencer data'
      }));
    }
  }, [user]);

  // Refresh specific data sections
  const refreshProfile = useCallback(async () => {
    if (!user || !state.data.profile) return;
    
    const profile = await influencerApi.getCurrentInfluencer();
    if (profile) {
      setState(prev => ({
        ...prev,
        data: { ...prev.data, profile }
      }));
    }
  }, [user, state.data.profile]);

  const refreshAchievements = useCallback(async () => {
    if (!state.data.profile) return;
    
    const achievements = await achievementsApi.getAchievements(state.data.profile.id);
    setState(prev => ({
      ...prev,
      data: { ...prev.data, achievements }
    }));
  }, [state.data.profile]);

  const refreshGoals = useCallback(async () => {
    if (!state.data.profile) return;
    
    const goals = await goalsApi.getGoals(state.data.profile.id);
    setState(prev => ({
      ...prev,
      data: { ...prev.data, goals }
    }));
  }, [state.data.profile]);

  const refreshEarnings = useCallback(async () => {
    if (!state.data.profile) return;
    
    const earnings = await earningsApi.getEarnings(state.data.profile.id, 10);
    setState(prev => ({
      ...prev,
      data: { ...prev.data, earnings }
    }));
  }, [state.data.profile]);

  const refreshLiveSessions = useCallback(async () => {
    if (!state.data.profile) return;
    
    const liveSessions = await liveSessionsApi.getLiveSessions(state.data.profile.id, 10);
    setState(prev => ({
      ...prev,
      data: { ...prev.data, liveSessions }
    }));
  }, [state.data.profile]);

  const refreshNotifications = useCallback(async () => {
    if (!state.data.profile) return;
    
    const notifications = await notificationsApi.getNotifications(state.data.profile.id);
    setState(prev => ({
      ...prev,
      data: { ...prev.data, notifications }
    }));
  }, [state.data.profile]);

  const refreshDashboardStats = useCallback(async () => {
    if (!state.data.profile) return;
    
    const dashboardStats = await influencerApi.getDashboardStats(state.data.profile.id);
    setState(prev => ({
      ...prev,
      data: { ...prev.data, dashboardStats }
    }));
  }, [state.data.profile]);

  // Goal management actions
  const createGoal = useCallback(async (goalData: Omit<InfluencerGoal, 'id' | 'created_at' | 'updated_at'>) => {
    if (!state.data.profile) return null;

    const newGoal = await goalsApi.createGoal({
      ...goalData,
      influencer_id: state.data.profile.id
    });

    if (newGoal) {
      await refreshGoals();
      await refreshDashboardStats();
    }

    return newGoal;
  }, [state.data.profile, refreshGoals, refreshDashboardStats]);

  const updateGoal = useCallback(async (id: string, updates: Partial<InfluencerGoal>) => {
    const updatedGoal = await goalsApi.updateGoal(id, updates);

    if (updatedGoal) {
      await refreshGoals();
      await refreshDashboardStats();
    }

    return updatedGoal;
  }, [refreshGoals, refreshDashboardStats]);

  const deleteGoal = useCallback(async (id: string) => {
    const success = await goalsApi.deleteGoal(id);

    if (success) {
      await refreshGoals();
      await refreshDashboardStats();
    }

    return success;
  }, [refreshGoals, refreshDashboardStats]);

  // Live session actions
  const createLiveSession = useCallback(async (sessionData: Omit<LiveSession, 'id' | 'created_at' | 'updated_at'>) => {
    if (!state.data.profile) return null;

    const newSession = await liveSessionsApi.createLiveSession({
      ...sessionData,
      influencer_id: state.data.profile.id
    });

    if (newSession) {
      await refreshLiveSessions();
    }

    return newSession;
  }, [state.data.profile, refreshLiveSessions]);

  const startLiveSession = useCallback(async (id: string) => {
    const success = await liveSessionsApi.startLiveSession(id);

    if (success) {
      await refreshLiveSessions();
    }

    return success;
  }, [refreshLiveSessions]);

  const endLiveSession = useCallback(async (id: string, metrics?: { peak_viewers?: number; total_unique_viewers?: number; total_sales_generated?: number }) => {
    const success = await liveSessionsApi.endLiveSession(id, metrics);

    if (success) {
      await refreshLiveSessions();
      await refreshEarnings();
      await refreshDashboardStats();
    }

    return success;
  }, [refreshLiveSessions, refreshEarnings, refreshDashboardStats]);

  // Notification actions
  const markNotificationAsRead = useCallback(async (id: string) => {
    const success = await notificationsApi.markAsRead(id);

    if (success) {
      await refreshNotifications();
    }

    return success;
  }, [refreshNotifications]);

  const markAllNotificationsAsRead = useCallback(async () => {
    if (!state.data.profile) return false;

    const success = await notificationsApi.markAllAsRead(state.data.profile.id);

    if (success) {
      await refreshNotifications();
    }

    return success;
  }, [state.data.profile, refreshNotifications]);

  // Settings actions
  const updateSettings = useCallback(async (updates: Partial<InfluencerSettings>) => {
    if (!state.data.profile) return null;

    const updatedSettings = await settingsApi.updateSettings(state.data.profile.id, updates);

    if (updatedSettings) {
      setState(prev => ({
        ...prev,
        data: { ...prev.data, settings: updatedSettings }
      }));
    }

    return updatedSettings;
  }, [state.data.profile]);

  // Load data on mount and when user changes
  useEffect(() => {
    loadInfluencerData();
  }, [loadInfluencerData]);

  return {
    // Data
    ...state.data,
    loading: state.loading,
    error: state.error,

    // Refresh functions
    refreshAll: loadInfluencerData,
    refreshProfile,
    refreshAchievements,
    refreshGoals,
    refreshEarnings,
    refreshLiveSessions,
    refreshNotifications,
    refreshDashboardStats,

    // Goal actions
    createGoal,
    updateGoal,
    deleteGoal,

    // Live session actions
    createLiveSession,
    startLiveSession,
    endLiveSession,

    // Notification actions
    markNotificationAsRead,
    markAllNotificationsAsRead,

    // Settings actions
    updateSettings
  };
};
