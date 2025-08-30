import { useState, useEffect } from 'react';
import InfluencerAPI from '@/services/influencerAPI';
import type { 
  Influencer, 
  InfluencerStats, 
  InfluencerAchievement, 
  InfluencerGoal, 
  LiveSession, 
  InfluencerEarning 
} from '@/types/influencer';

export function useInfluencer() {
  const [influencer, setInfluencer] = useState<Influencer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInfluencer = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await InfluencerAPI.getCurrentInfluencer();
      setInfluencer(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch influencer');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInfluencer();
  }, []);

  const createInfluencer = async (data: any) => {
    try {
      setLoading(true);
      setError(null);
      const newInfluencer = await InfluencerAPI.createInfluencer(data);
      setInfluencer(newInfluencer);
      return newInfluencer;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create influencer profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateInfluencer = async (data: any) => {
    try {
      setError(null);
      const updatedInfluencer = await InfluencerAPI.updateInfluencer(data);
      setInfluencer(updatedInfluencer);
      return updatedInfluencer;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update influencer profile');
      throw err;
    }
  };

  return {
    influencer,
    loading,
    error,
    fetchInfluencer,
    createInfluencer,
    updateInfluencer,
    hasProfile: !!influencer
  };
}

export function useInfluencerStats() {
  const [stats, setStats] = useState<InfluencerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await InfluencerAPI.getInfluencerStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  };
}

export function useInfluencerAchievements() {
  const [achievements, setAchievements] = useState<InfluencerAchievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await InfluencerAPI.getAchievements();
      setAchievements(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch achievements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  return {
    achievements,
    loading,
    error,
    refetch: fetchAchievements
  };
}

export function useInfluencerGoals() {
  const [goals, setGoals] = useState<InfluencerGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await InfluencerAPI.getGoals();
      setGoals(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch goals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  return {
    goals,
    loading,
    error,
    refetch: fetchGoals
  };
}

export function useLiveSessions() {
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await InfluencerAPI.getLiveSessions();
      setSessions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch live sessions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const createSession = async (sessionData: any) => {
    try {
      setError(null);
      const newSession = await InfluencerAPI.createLiveSession(sessionData);
      setSessions(prev => [newSession, ...prev]);
      return newSession;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create live session');
      throw err;
    }
  };

  return {
    sessions,
    loading,
    error,
    refetch: fetchSessions,
    createSession
  };
}

export function useRecentLiveSessions() {
  const [recentSessions, setRecentSessions] = useState<LiveSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecentSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await InfluencerAPI.getRecentLiveSessions();
      setRecentSessions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch recent sessions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentSessions();
  }, []);

  return {
    recentSessions,
    loading,
    error,
    refetch: fetchRecentSessions
  };
}

export function useUpcomingLiveSessions() {
  const [upcomingSessions, setUpcomingSessions] = useState<LiveSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUpcomingSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await InfluencerAPI.getUpcomingLiveSessions();
      setUpcomingSessions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch upcoming sessions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpcomingSessions();
  }, []);

  return {
    upcomingSessions,
    loading,
    error,
    refetch: fetchUpcomingSessions
  };
}

export function useInfluencerEarnings() {
  const [earnings, setEarnings] = useState<InfluencerEarning[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEarnings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await InfluencerAPI.getRecentEarnings();
      setEarnings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch earnings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarnings();
  }, []);

  return {
    earnings,
    loading,
    error,
    refetch: fetchEarnings
  };
}
