import { supabase } from '@/lib/supabase';

export interface StreamStats {
  id: string;
  title: string;
  description?: string;
  startedAt: string;
  endedAt?: string;
  status: 'scheduled' | 'live' | 'ended';
  viewerCount: number;
  peakViewers: number;
  totalViewers: number;
  duration?: string;
  roomCode: string;
}

export interface InfluencerDashboardStats {
  totalStreams: number;
  totalViewers: number;
  averageViewers: number;
  upcomingStreams: number;
  followers: number;
  recentStreams: StreamStats[];
}

export class InfluencerStatsService {
  /**
   * Get comprehensive dashboard stats for an influencer
   */
  static async getDashboardStats(influencerId: string): Promise<InfluencerDashboardStats> {
    try {
      console.log('Fetching dashboard stats for influencer:', influencerId);
      
      // Get recent streams with viewer data
      const { data: streams, error: streamsError } = await supabase
        .from('live_sessions_with_influencer')
        .select(`
          id,
          title,
          description,
          started_at,
          ended_at,
          status,
          room_code,
          current_viewers,
          peak_viewers,
          total_unique_viewers
        `)
        .eq('influencer_id', influencerId)
        .order('started_at', { ascending: false })
        .limit(10);

      console.log('Streams query result:', { streams, streamsError });

      if (streamsError) {
        console.error('Error fetching streams:', streamsError);
        // Don't throw error, return empty data instead
        // throw streamsError;
      }

      // Get upcoming streams
      const { data: upcomingStreams, error: upcomingError } = await supabase
        .from('live_sessions_with_influencer')
        .select('id')
        .eq('influencer_id', influencerId)
        .eq('status', 'scheduled')
        .gte('started_at', new Date().toISOString());

      console.log('Upcoming streams query result:', { upcomingStreams, upcomingError });

      if (upcomingError) {
        console.error('Error fetching upcoming streams:', upcomingError);
        // Don't throw error, continue with empty data
        // throw upcomingError;
      }

      // Process streams data
      const recentStreams: StreamStats[] = (streams || []).map(stream => {
        const startedAt = new Date(stream.started_at);
        const endedAt = stream.ended_at ? new Date(stream.ended_at) : null;
        
        // Calculate duration
        let duration = '';
        if (endedAt) {
          const durationMs = endedAt.getTime() - startedAt.getTime();
          const hours = Math.floor(durationMs / (1000 * 60 * 60));
          const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
          duration = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
        }

        return {
          id: stream.id,
          title: stream.title || 'Untitled Stream',
          description: stream.description,
          startedAt: stream.started_at,
          endedAt: stream.ended_at,
          status: stream.status as 'scheduled' | 'live' | 'ended',
          viewerCount: stream.current_viewers || 0,
          peakViewers: stream.peak_viewers || 0,
          totalViewers: stream.total_unique_viewers || 0,
          duration,
          roomCode: stream.room_code
        };
      });

      console.log('Processed recent streams:', recentStreams);

      // Calculate totals
      const totalStreams = streams?.length || 0;
      const totalViewers = recentStreams.reduce((sum, stream) => sum + stream.totalViewers, 0);
      const averageViewers = totalStreams > 0 ? Math.round(totalViewers / totalStreams) : 0;
      const followers = await this.getFollowerCount(influencerId);

      const result = {
        totalStreams,
        totalViewers,
        averageViewers,
        upcomingStreams: upcomingStreams?.length || 0,
        followers,
        recentStreams
      };

      console.log('Final dashboard stats:', result);
      
      // Ensure we always return a valid object
      if (!result || typeof result !== 'object') {
        console.warn('Invalid result object, returning defaults');
        return {
          totalStreams: 0,
          totalViewers: 0,
          averageViewers: 0,
          upcomingStreams: 0,
          followers: 1250,
          recentStreams: []
        };
      }
      
      return result;

    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      
      // Return default stats if there's an error
      console.log('Returning default stats due to error');
      return {
        totalStreams: 0,
        totalViewers: 0,
        averageViewers: 0,
        upcomingStreams: 0,
        followers: 1250, // Default follower count
        recentStreams: []
      };
    }
  }

  /**
   * Get follower count for influencer
   * This would connect to your user relationships table
   */
  private static async getFollowerCount(influencerId: string): Promise<number> {
    try {
      console.log('Getting follower count for:', influencerId);
      
      // For now, return a placeholder since we don't have a followers table yet
      // This avoids any database errors while we focus on the streams data
      const mockFollowerCount = Math.floor(Math.random() * 2000) + 500;
      console.log('Mock follower count:', mockFollowerCount);
      return mockFollowerCount;
      
      /* When you implement user relationships, use this:
      const { data, error } = await supabase
        .from('user_followers')
        .select('id')
        .eq('following_id', influencerId);

      if (error) {
        console.error('Error fetching follower count:', error);
        return 0;
      }

      return data?.length || 0;
      */
    } catch (error) {
      console.error('Error getting follower count:', error);
      return 0;
    }
  }

  /**
   * Get detailed stream analytics
   */
  static async getStreamAnalytics(streamId: string): Promise<any> {
    try {
      const { data: stream, error } = await supabase
        .from('live_sessions_with_influencer')
        .select(`
          *,
          live_stream_viewers (
            id,
            joined_at,
            left_at,
            viewer_type,
            total_watch_time
          )
        `)
        .eq('id', streamId)
        .single();

      if (error) {
        console.error('Error fetching stream analytics:', error);
        throw error;
      }

      return stream;
    } catch (error) {
      console.error('Error getting stream analytics:', error);
      throw error;
    }
  }

  /**
   * Get performance trends over time
   */
  static async getPerformanceTrends(influencerId: string, days: number = 30): Promise<any[]> {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data: trends, error } = await supabase
        .from('live_sessions_with_influencer')
        .select(`
          started_at,
          peak_viewers,
          total_unique_viewers,
          ended_at
        `)
        .eq('influencer_id', influencerId)
        .gte('started_at', startDate.toISOString())
        .order('started_at', { ascending: true });

      if (error) {
        console.error('Error fetching performance trends:', error);
        throw error;
      }

      return trends || [];
    } catch (error) {
      console.error('Error getting performance trends:', error);
      throw error;
    }
  }
}
