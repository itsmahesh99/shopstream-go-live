import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { 
  LiveSession, 
  LiveSessionProduct, 
  CreateLiveSessionData, 
  UpdateLiveSessionData,
  LiveStreamMetrics 
} from '../types/liveStream';

// Hook for managing live sessions
export const useLiveSessions = () => {
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userProfile } = useAuth();

  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!userProfile?.profile?.id) {
        throw new Error('No influencer profile found');
      }

      const { data, error } = await supabase
        .from('live_sessions')
        .select('*')
        .eq('influencer_id', userProfile.profile.id)
        .order('scheduled_start_time', { ascending: false });

      if (error) throw error;

      setSessions(data || []);
    } catch (err: any) {
      console.error('Error fetching live sessions:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createSession = async (sessionData: CreateLiveSessionData) => {
    try {
      if (!userProfile?.profile?.id) {
        throw new Error('No influencer profile found');
      }

      const { data, error } = await supabase
        .from('live_sessions')
        .insert({
          influencer_id: userProfile.profile.id,
          title: sessionData.title,
          description: sessionData.description,
          scheduled_start_time: sessionData.scheduled_start_time,
          status: 'scheduled'
        })
        .select()
        .single();

      if (error) throw error;

      // Add products to the session if provided
      if (sessionData.product_ids && sessionData.product_ids.length > 0) {
        const productInserts = sessionData.product_ids.map((productId, index) => ({
          live_session_id: data.id,
          product_id: productId,
          display_order: index + 1
        }));

        const { error: productError } = await supabase
          .from('live_session_products')
          .insert(productInserts);

        if (productError) {
          console.warn('Warning: Failed to add products to session:', productError);
        }
      }

      await fetchSessions();
      return { data, error: null };
    } catch (err: any) {
      console.error('Error creating live session:', err);
      return { data: null, error: err.message };
    }
  };

  const updateSession = async (sessionId: string, updates: UpdateLiveSessionData) => {
    try {
      const { data, error } = await supabase
        .from('live_sessions')
        .update(updates)
        .eq('id', sessionId)
        .select()
        .single();

      if (error) throw error;

      await fetchSessions();
      return { data, error: null };
    } catch (err: any) {
      console.error('Error updating live session:', err);
      return { data: null, error: err.message };
    }
  };

  const deleteSession = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from('live_sessions')
        .delete()
        .eq('id', sessionId);

      if (error) throw error;

      await fetchSessions();
      return { error: null };
    } catch (err: any) {
      console.error('Error deleting live session:', err);
      return { error: err.message };
    }
  };

  const startSession = async (sessionId: string) => {
    return await updateSession(sessionId, {
      status: 'live',
      actual_start_time: new Date().toISOString()
    });
  };

  const endSession = async (sessionId: string, metrics?: Partial<LiveStreamMetrics>) => {
    const updates: UpdateLiveSessionData = {
      status: 'ended',
      end_time: new Date().toISOString()
    };

    if (metrics) {
      if (metrics.peak_viewers) updates.peak_viewers = metrics.peak_viewers;
      if (metrics.total_unique_viewers) updates.total_unique_viewers = metrics.total_unique_viewers;
      if (metrics.duration_minutes) updates.duration_minutes = metrics.duration_minutes;
    }

    return await updateSession(sessionId, updates);
  };

  useEffect(() => {
    if (userProfile?.profile?.id) {
      fetchSessions();
    }
  }, [userProfile?.profile?.id]);

  return {
    sessions,
    loading,
    error,
    createSession,
    updateSession,
    deleteSession,
    startSession,
    endSession,
    refetch: fetchSessions
  };
};

// Hook for managing session products
export const useSessionProducts = (sessionId: string) => {
  const [products, setProducts] = useState<LiveSessionProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('live_session_products')
        .select(`
          *,
          product:products(
            id,
            name,
            retail_price,
            images,
            description
          )
        `)
        .eq('live_session_id', sessionId)
        .order('display_order');

      if (error) throw error;

      setProducts(data || []);
    } catch (err: any) {
      console.error('Error fetching session products:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (productId: string, specialPrice?: number, isFeatured?: boolean) => {
    try {
      const maxOrder = Math.max(...products.map(p => p.display_order), 0);

      const { data, error } = await supabase
        .from('live_session_products')
        .insert({
          live_session_id: sessionId,
          product_id: productId,
          display_order: maxOrder + 1,
          special_price: specialPrice,
          is_featured: isFeatured || false
        })
        .select()
        .single();

      if (error) throw error;

      await fetchProducts();
      return { data, error: null };
    } catch (err: any) {
      console.error('Error adding product to session:', err);
      return { data: null, error: err.message };
    }
  };

  const removeProduct = async (sessionProductId: string) => {
    try {
      const { error } = await supabase
        .from('live_session_products')
        .delete()
        .eq('id', sessionProductId);

      if (error) throw error;

      await fetchProducts();
      return { error: null };
    } catch (err: any) {
      console.error('Error removing product from session:', err);
      return { error: err.message };
    }
  };

  const updateProductOrder = async (sessionProductId: string, newOrder: number) => {
    try {
      const { error } = await supabase
        .from('live_session_products')
        .update({ display_order: newOrder })
        .eq('id', sessionProductId);

      if (error) throw error;

      await fetchProducts();
      return { error: null };
    } catch (err: any) {
      console.error('Error updating product order:', err);
      return { error: err.message };
    }
  };

  useEffect(() => {
    if (sessionId) {
      fetchProducts();
    }
  }, [sessionId]);

  return {
    products,
    loading,
    error,
    addProduct,
    removeProduct,
    updateProductOrder,
    refetch: fetchProducts
  };
};

// Hook for live stream metrics and real-time updates
export const useLiveStreamMetrics = (sessionId: string, isLive: boolean) => {
  const [metrics, setMetrics] = useState<LiveStreamMetrics | null>(null);
  const [loading, setLoading] = useState(false);

  const updateMetrics = async (newMetrics: Partial<LiveStreamMetrics>) => {
    try {
      setLoading(true);

      const updates: UpdateLiveSessionData = {};
      if (newMetrics.peak_viewers) updates.peak_viewers = newMetrics.peak_viewers;
      if (newMetrics.total_unique_viewers) updates.total_unique_viewers = newMetrics.total_unique_viewers;

      const { error } = await supabase
        .from('live_sessions')
        .update(updates)
        .eq('id', sessionId);

      if (error) throw error;

      // Update local metrics state
      setMetrics(prev => prev ? { ...prev, ...newMetrics } : null);
    } catch (err: any) {
      console.error('Error updating metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentMetrics = async () => {
    try {
      const { data, error } = await supabase
        .from('live_sessions')
        .select('peak_viewers, total_unique_viewers, duration_minutes, total_sales_generated')
        .eq('id', sessionId)
        .single();

      if (error) throw error;

      if (data) {
        setMetrics({
          session_id: sessionId,
          current_viewers: 0, // This would come from real-time streaming service
          peak_viewers: data.peak_viewers,
          total_unique_viewers: data.total_unique_viewers,
          duration_minutes: data.duration_minutes || 0,
          products_showcased: 0, // Calculate from products table
          total_sales: data.total_sales_generated,
          engagement_rate: 0 // Calculate based on metrics
        });
      }
    } catch (err: any) {
      console.error('Error fetching metrics:', err);
    }
  };

  useEffect(() => {
    if (sessionId) {
      fetchCurrentMetrics();
    }
  }, [sessionId]);

  // Set up real-time updates when stream is live
  useEffect(() => {
    if (!isLive || !sessionId) return;

    // In a real implementation, you would connect to your streaming service
    // for real-time viewer count updates
    const interval = setInterval(() => {
      // Simulate real-time updates - replace with actual streaming service integration
      if (metrics) {
        const currentViewers = Math.floor(Math.random() * 100); // Simulate viewer count
        setMetrics(prev => prev ? {
          ...prev,
          current_viewers: currentViewers,
          peak_viewers: Math.max(prev.peak_viewers, currentViewers)
        } : null);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isLive, sessionId, metrics]);

  return {
    metrics,
    loading,
    updateMetrics,
    refetch: fetchCurrentMetrics
  };
};
