import { supabase } from '@/lib/supabase';

export interface LiveStream {
  id: string;
  title: string;
  description?: string;
  influencer_id: string;
  category_id?: string;
  thumbnail_url?: string;
  viewer_count: number;
  start_time?: string;
  end_time?: string;
  status: 'scheduled' | 'live' | 'ended';
  room_id?: string;
  created_at?: string;
  updated_at?: string;
}

export class LiveStreamsService {
  // Get all live streams
  static async getLiveStreams(limit?: number): Promise<LiveStream[]> {
    try {
      console.log('Fetching live streams from database...');
      let query = supabase
        .from('live_stream_sessions')
        .select(`
          *
        `)
        .order('viewer_count', { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching live streams:', error);
        throw error;
      }

      console.log('Live streams fetched:', data?.length || 0, 'streams');
      return data || [];
    } catch (error) {
      console.error('Live streams service error:', error);
      throw error;
    }
  }

  // Get live streams by category
  static async getLiveStreamsByCategory(categoryId: string, limit?: number): Promise<LiveStream[]> {
    try {
      let query = supabase
        .from('live_stream_sessions')
        .select(`
          *
        `)
        .eq('category_id', categoryId)
        .order('viewer_count', { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching live streams by category:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Live streams by category service error:', error);
      throw error;
    }
  }

  // Get live streams by status
  static async getLiveStreamsByStatus(status: 'scheduled' | 'live' | 'ended', limit = 8): Promise<LiveStream[]> {
    try {
      console.log(`Fetching ${status} live streams...`);
      const { data, error } = await supabase
        .from('live_stream_sessions')
        .select(`
          *
        `)
        .eq('status', status)
        .order('viewer_count', { ascending: false })
        .limit(limit);

      if (error) {
        console.error(`Error fetching ${status} live streams:`, error);
        throw error;
      }

      console.log(`${status} live streams fetched:`, data?.length || 0, 'streams');
      return data || [];
    } catch (error) {
      console.error(`${status} live streams service error:`, error);
      throw error;
    }
  }

  // Get all live streams (no filters)
  static async getAllLiveStreams(limit = 8): Promise<LiveStream[]> {
    try {
      console.log('Fetching all live streams...');
      const { data, error } = await supabase
        .from('live_stream_sessions')
        .select(`
          *
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching all live streams:', error);
        throw error;
      }

      console.log('All live streams fetched:', data?.length || 0, 'streams');
      return data || [];
    } catch (error) {
      console.error('All live streams service error:', error);
      throw error;
    }
  }

  // Get featured live streams (high viewer count)
  static async getFeaturedLiveStreams(limit = 8): Promise<LiveStream[]> {
    try {
      console.log('Fetching featured live streams...');
      const { data, error } = await supabase
        .from('live_stream_sessions')
        .select(`
          *
        `)
        .order('viewer_count', { ascending: false })
        .order('viewer_count', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching featured live streams:', error);
        throw error;
      }

      console.log('Featured live streams fetched:', data?.length || 0, 'streams');
      return data || [];
    } catch (error) {
      console.error('Featured live streams service error:', error);
      throw error;
    }
  }

  // Search live streams
  static async searchLiveStreams(query: string, limit = 10): Promise<LiveStream[]> {
    try {
      const { data, error } = await supabase
        .from('live_stream_sessions')
        .select(`
          *
        `)
        .or(`title.ilike.%${query}%, description.ilike.%${query}%`)
        .order('viewer_count', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error searching live streams:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Live streams search service error:', error);
      throw error;
    }
  }
}
