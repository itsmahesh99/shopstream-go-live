// React hooks for Live Streaming functionality
import { useState, useEffect, useCallback, useRef } from 'react';
import { LiveStreamingService } from '@/services/liveStreamingService';
import type { 
  LiveStreamSession, 
  LiveStreamViewer,
  LiveStreamChat,
  LiveStreamProduct,
  SessionAnalytics,
  StreamState,
  CreateLiveStreamSessionInput,
  StartLiveStreamInput
} from '@/types/live-streaming';

// =============================================================================
// LIVE STREAM SESSION HOOKS
// =============================================================================

/**
 * Hook for managing live stream sessions
 */
export const useLiveStreamSession = (sessionId?: string) => {
  const [session, setSession] = useState<LiveStreamSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSession = useCallback(async (id: string) => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await LiveStreamingService.getSession(id);
      
      if (error) {
        setError(error.message || 'Failed to fetch session');
      } else {
        setSession(data);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error fetching session:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createSession = useCallback(async (sessionData: CreateLiveStreamSessionInput) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await LiveStreamingService.createSession(sessionData);
      
      if (error) {
        setError(error.message || 'Failed to create session');
        return null;
      } else {
        setSession(data);
        return data;
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error creating session:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const startSession = useCallback(async (id: string, streamingData: StartLiveStreamInput) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await LiveStreamingService.startSession(id, streamingData);
      
      if (error) {
        setError(error.message || 'Failed to start session');
        return null;
      } else {
        setSession(data);
        return data;
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error starting session:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const endSession = useCallback(async (id: string, recordingUrl?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await LiveStreamingService.endSession(id, recordingUrl);
      
      if (error) {
        setError(error.message || 'Failed to end session');
        return null;
      } else {
        setSession(data);
        return data;
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error ending session:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (sessionId) {
      fetchSession(sessionId);
    }
  }, [sessionId, fetchSession]);

  return {
    session,
    loading,
    error,
    createSession,
    startSession,
    endSession,
    refetch: () => sessionId && fetchSession(sessionId)
  };
};

/**
 * Hook for managing influencer's live stream sessions
 */
export const useInfluencerSessions = (influencerId: string, status?: string) => {
  const [sessions, setSessions] = useState<LiveStreamSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = useCallback(async () => {
    if (!influencerId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await LiveStreamingService.getSessionsByInfluencer(influencerId, status);
      
      if (error) {
        setError(error.message || 'Failed to fetch sessions');
      } else {
        setSessions(data || []);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error fetching sessions:', err);
    } finally {
      setLoading(false);
    }
  }, [influencerId, status]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  return {
    sessions,
    loading,
    error,
    refetch: fetchSessions
  };
};

/**
 * Hook for getting currently live sessions
 */
export const useLiveSessions = () => {
  const [sessions, setSessions] = useState<LiveStreamSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLiveSessions = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await LiveStreamingService.getLiveSessions();
      
      if (error) {
        setError(error.message || 'Failed to fetch live sessions');
      } else {
        setSessions(data || []);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error fetching live sessions:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveSessions();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchLiveSessions, 30000);
    
    return () => clearInterval(interval);
  }, [fetchLiveSessions]);

  return {
    sessions,
    loading,
    error,
    refetch: fetchLiveSessions
  };
};

// =============================================================================
// VIEWER MANAGEMENT HOOKS
// =============================================================================

/**
 * Hook for managing viewer session
 */
export const useViewerSession = (sessionId: string, userId?: string) => {
  const [viewer, setViewer] = useState<LiveStreamViewer | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [watchStartTime] = useState(Date.now());

  const joinSession = useCallback(async (viewerData: {
    viewerType?: 'customer' | 'influencer' | 'wholesaler' | 'anonymous';
    deviceType?: string;
    browser?: string;
  } = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await LiveStreamingService.addViewer({
        sessionId,
        userId,
        viewerType: viewerData.viewerType || 'anonymous',
        deviceType: viewerData.deviceType || 'desktop',
        browser: viewerData.browser || 'unknown'
      });
      
      if (error) {
        setError(error.message || 'Failed to join session');
      } else {
        setViewer(data);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error joining session:', err);
    } finally {
      setLoading(false);
    }
  }, [sessionId, userId]);

  const leaveSession = useCallback(async () => {
    if (!viewer) return;
    
    const watchDuration = Math.floor((Date.now() - watchStartTime) / 60000); // minutes
    
    try {
      await LiveStreamingService.updateViewerStatus(viewer.id, watchDuration);
      setViewer(null);
    } catch (err) {
      console.error('Error leaving session:', err);
    }
  }, [viewer, watchStartTime]);

  useEffect(() => {
    // Auto-leave on component unmount
    return () => {
      if (viewer) {
        leaveSession();
      }
    };
  }, [viewer, leaveSession]);

  return {
    viewer,
    loading,
    error,
    joinSession,
    leaveSession
  };
};

/**
 * Hook for getting session viewers
 */
export const useSessionViewers = (sessionId: string) => {
  const [viewers, setViewers] = useState<LiveStreamViewer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchViewers = useCallback(async () => {
    if (!sessionId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await LiveStreamingService.getSessionViewers(sessionId);
      
      if (error) {
        setError(error.message || 'Failed to fetch viewers');
      } else {
        setViewers(data || []);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error fetching viewers:', err);
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    fetchViewers();
  }, [fetchViewers]);

  return {
    viewers,
    loading,
    error,
    refetch: fetchViewers
  };
};

// =============================================================================
// CHAT MANAGEMENT HOOKS
// =============================================================================

/**
 * Hook for managing live stream chat
 */
export const useLiveStreamChat = (sessionId: string) => {
  const [messages, setMessages] = useState<LiveStreamChat[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    if (!sessionId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await LiveStreamingService.getChatMessages(sessionId);
      
      if (error) {
        setError(error.message || 'Failed to fetch messages');
      } else {
        setMessages((data || []).reverse()); // Reverse to show latest first
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  const sendMessage = useCallback(async (messageData: {
    message: string;
    messageType?: 'chat' | 'reaction' | 'system' | 'product_highlight';
    username?: string;
    avatarUrl?: string;
    isInfluencer?: boolean;
  }) => {
    try {
      const { data, error } = await LiveStreamingService.sendChatMessage({
        sessionId,
        ...messageData
      });
      
      if (error) {
        setError(error.message || 'Failed to send message');
        return false;
      } else {
        // Add message to local state immediately for better UX
        if (data) {
          setMessages(prev => [...prev, data]);
        }
        return true;
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error sending message:', err);
      return false;
    }
  }, [sessionId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return {
    messages,
    loading,
    error,
    sendMessage,
    refetch: fetchMessages
  };
};

// =============================================================================
// PRODUCT SHOWCASE HOOKS
// =============================================================================

/**
 * Hook for managing stream products
 */
export const useStreamProducts = (sessionId: string) => {
  const [products, setProducts] = useState<LiveStreamProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    if (!sessionId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await LiveStreamingService.getStreamProducts(sessionId);
      
      if (error) {
        setError(error.message || 'Failed to fetch products');
      } else {
        setProducts(data || []);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  const addProduct = useCallback(async (productData: {
    productId: string;
    displayOrder?: number;
    liveStreamPrice?: number;
    discountPercentage?: number;
    limitedQuantity?: number;
  }) => {
    try {
      const { data, error } = await LiveStreamingService.addProductToStream({
        sessionId,
        ...productData
      });
      
      if (error) {
        setError(error.message || 'Failed to add product');
        return false;
      } else {
        fetchProducts(); // Refresh list
        return true;
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error adding product:', err);
      return false;
    }
  }, [sessionId, fetchProducts]);

  const updateProductMetrics = useCallback(async (productId: string, metrics: {
    clicks?: number;
    addToCart?: number;
    orders?: number;
    revenue?: number;
  }) => {
    try {
      const { data, error } = await LiveStreamingService.updateProductMetrics(sessionId, productId, metrics);
      
      if (error) {
        setError(error.message || 'Failed to update product metrics');
        return false;
      } else {
        fetchProducts(); // Refresh list
        return true;
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error updating product metrics:', err);
      return false;
    }
  }, [sessionId, fetchProducts]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    addProduct,
    updateProductMetrics,
    refetch: fetchProducts
  };
};

// =============================================================================
// ANALYTICS HOOKS
// =============================================================================

/**
 * Hook for session analytics
 */
export const useSessionAnalytics = (sessionId: string) => {
  const [analytics, setAnalytics] = useState<SessionAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    if (!sessionId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await LiveStreamingService.getSessionAnalytics(sessionId);
      
      if (error) {
        setError(error.message || 'Failed to fetch analytics');
      } else {
        setAnalytics(data);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    fetchAnalytics();
    
    // Refresh analytics every minute during live sessions
    const interval = setInterval(fetchAnalytics, 60000);
    
    return () => clearInterval(interval);
  }, [fetchAnalytics]);

  return {
    analytics,
    loading,
    error,
    refetch: fetchAnalytics
  };
};

// =============================================================================
// REAL-TIME HOOKS
// =============================================================================

/**
 * Hook for real-time session updates
 */
export const useRealTimeSession = (sessionId: string) => {
  const [session, setSession] = useState<LiveStreamSession | null>(null);
  const subscriptionRef = useRef<any>(null);

  useEffect(() => {
    if (!sessionId) return;

    // Subscribe to real-time updates
    subscriptionRef.current = LiveStreamingService.subscribeToSessionUpdates(
      sessionId,
      (payload) => {
        if (payload.eventType === 'UPDATE') {
          setSession(payload.new);
        }
      }
    );

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, [sessionId]);

  return session;
};

/**
 * Hook for real-time chat updates
 */
export const useRealTimeChat = (sessionId: string) => {
  const [messages, setMessages] = useState<LiveStreamChat[]>([]);
  const subscriptionRef = useRef<any>(null);

  useEffect(() => {
    if (!sessionId) return;

    // Subscribe to real-time chat updates
    subscriptionRef.current = LiveStreamingService.subscribeToChatMessages(
      sessionId,
      (payload) => {
        if (payload.eventType === 'INSERT') {
          setMessages(prev => [...prev, payload.new]);
        }
      }
    );

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, [sessionId]);

  return messages;
};

/**
 * Hook for real-time viewer updates
 */
export const useRealTimeViewers = (sessionId: string) => {
  const [viewerCount, setViewerCount] = useState(0);
  const subscriptionRef = useRef<any>(null);

  useEffect(() => {
    if (!sessionId) return;

    // Subscribe to real-time viewer updates
    subscriptionRef.current = LiveStreamingService.subscribeToViewerUpdates(
      sessionId,
      (payload) => {
        // Update viewer count based on joins/leaves
        if (payload.eventType === 'INSERT') {
          setViewerCount(prev => prev + 1);
        } else if (payload.eventType === 'UPDATE' && payload.new.is_still_watching === false) {
          setViewerCount(prev => Math.max(0, prev - 1));
        }
      }
    );

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, [sessionId]);

  return viewerCount;
};

// =============================================================================
// COMPOUND HOOKS
// =============================================================================

/**
 * Complete hook for live streaming state management
 */
export const useLiveStream = (sessionId?: string) => {
  const sessionHook = useLiveStreamSession(sessionId);
  const chatHook = useLiveStreamChat(sessionId || '');
  const productsHook = useStreamProducts(sessionId || '');
  const viewersHook = useSessionViewers(sessionId || '');
  const analyticsHook = useSessionAnalytics(sessionId || '');

  const streamState: StreamState = {
    isLoading: sessionHook.loading || chatHook.loading || productsHook.loading,
    isStreaming: sessionHook.session?.status === 'live',
    isPaused: sessionHook.session?.status === 'paused',
    error: sessionHook.error || chatHook.error || productsHook.error,
    session: sessionHook.session,
    viewers: viewersHook.viewers,
    messages: chatHook.messages,
    products: productsHook.products,
    stats: {
      viewers: sessionHook.session?.current_viewers || 0,
      peakViewers: sessionHook.session?.peak_viewers || 0,
      duration: 0, // Calculate based on start time
      messages: sessionHook.session?.total_messages || 0,
      engagement: 0, // Calculate engagement rate
      revenue: sessionHook.session?.total_revenue || 0,
      quality: sessionHook.session?.stream_quality || 'auto'
    }
  };

  return {
    ...streamState,
    actions: {
      createSession: sessionHook.createSession,
      startSession: sessionHook.startSession,
      endSession: sessionHook.endSession,
      sendMessage: chatHook.sendMessage,
      addProduct: productsHook.addProduct,
      updateProductMetrics: productsHook.updateProductMetrics
    }
  };
};
