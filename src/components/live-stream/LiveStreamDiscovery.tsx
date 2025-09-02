import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LiveStreamingService } from '@/services/liveStreamingService';
import { LiveStreamSession, LiveStreamSchedule } from '@/types/live-streaming';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Calendar, 
  Clock, 
  Eye, 
  Users, 
  PlayCircle, 
  Radio,
  Heart,
  MessageCircle,
  Grid3X3,
  List
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface LiveStreamWithInfluencer extends LiveStreamSession {
  influencer?: {
    display_name: string;
    followers_count: number;
    avatar_url?: string;
  };
}

interface ScheduledStreamWithInfluencer extends LiveStreamSchedule {
  influencer?: {
    display_name: string;
    followers_count: number;
    avatar_url?: string;
  };
}

const LiveStreamDiscovery = () => {
  const [liveStreams, setLiveStreams] = useState<LiveStreamWithInfluencer[]>([]);
  const [scheduledStreams, setScheduledStreams] = useState<ScheduledStreamWithInfluencer[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'live' | 'upcoming'>('live');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    fetchStreams();
  }, []);

  const fetchStreams = async () => {
    try {
      setLoading(true);
      
      // Fetch live streams
      const { data: liveSessions, error: liveError } = await LiveStreamingService.getLiveSessions();
      if (!liveError && liveSessions) {
        setLiveStreams(liveSessions as LiveStreamWithInfluencer[]);
      }

      // Fetch upcoming scheduled streams
      const { data: upcomingStreams, error: upcomingError } = await LiveStreamingService.getUpcomingStreams();
      if (!upcomingError && upcomingStreams) {
        setScheduledStreams(upcomingStreams as ScheduledStreamWithInfluencer[]);
      }
    } catch (error) {
      console.error('Error fetching streams:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatViewerCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const formatDateTime = (dateTime: string) => {
    return formatDistanceToNow(new Date(dateTime), { addSuffix: true });
  };

  const StreamCard = ({ stream, isLive = true }: { 
    stream: LiveStreamWithInfluencer | ScheduledStreamWithInfluencer, 
    isLive?: boolean 
  }) => {
    const influencerName = stream.influencer?.display_name || 'Unknown Host';
    const followerCount = stream.influencer?.followers_count || 0;
    const thumbnailUrl = stream.thumbnail_url || '/api/placeholder/320/240';
    
    return (
      <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group border border-gray-100">
        {/* Thumbnail Container */}
        <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-900 to-gray-700 overflow-hidden">
          <img
            src={thumbnailUrl}
            alt={stream.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='240' viewBox='0 0 320 240'%3E%3Crect width='320' height='240' fill='%23374151'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23ffffff' font-family='Arial, sans-serif' font-size='16'%3ELive Stream%3C/text%3E%3C/svg%3E";
            }}
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
          
          {/* Top badges */}
          <div className="absolute top-2 left-2 right-2 flex items-start justify-between">
            {/* Live badge or scheduled time */}
            <div className="flex items-center gap-2">
              {isLive ? (
                <Badge className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-md shadow-lg">
                  <div className="w-1.5 h-1.5 bg-white rounded-full mr-1.5 animate-pulse" />
                  LIVE
                </Badge>
              ) : (
                <Badge className="bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-md shadow-lg">
                  <Clock className="w-3 h-3 mr-1" />
                  {formatDateTime((stream as ScheduledStreamWithInfluencer).scheduled_start_time || '')}
                </Badge>
              )}
            </div>

            {/* Viewer count for live streams */}
            {isLive && (
              <Badge className="bg-black/70 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
                <Eye className="w-3 h-3 mr-1" />
                {formatViewerCount((stream as LiveStreamWithInfluencer).current_viewers || 0)}
              </Badge>
            )}
          </div>

          {/* Host avatar - positioned at bottom left */}
          <div className="absolute bottom-2 left-2">
            <Avatar className="w-8 h-8 border-2 border-white shadow-lg">
              <AvatarImage src={stream.influencer?.avatar_url} />
              <AvatarFallback className="bg-blue-500 text-white text-xs font-semibold">
                {influencerName.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Duration badge - bottom right */}
          {isLive && (stream as LiveStreamWithInfluencer).actual_start_time && (
            <div className="absolute bottom-2 right-2">
              <Badge className="bg-black/70 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
                {formatDateTime((stream as LiveStreamWithInfluencer).actual_start_time!)}
              </Badge>
            </div>
          )}

          {/* Play button overlay - only visible on hover */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="bg-white/95 text-black px-4 py-2 rounded-lg shadow-lg backdrop-blur-sm flex items-center gap-2">
              <PlayCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Watch</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-2 md:p-3">
          {/* Title */}
          <h3 className="font-semibold text-xs md:text-sm leading-tight mb-1 text-gray-900 line-clamp-2 min-h-[2rem] md:min-h-[2.5rem]">
            {stream.title}
          </h3>
          
          {/* Host name */}
          <p className="text-gray-600 text-[10px] md:text-xs font-medium mb-1 md:mb-2">
            {influencerName}
          </p>

          {/* Stats row */}
          <div className="flex items-center justify-between text-[10px] md:text-xs text-gray-500">
            <div className="flex items-center gap-2 md:gap-3">
              <span className="flex items-center gap-1">
                <Users className="w-2.5 h-2.5 md:w-3 md:h-3" />
                {formatViewerCount(followerCount)}
              </span>
              
              {isLive && (
                <>
                  <span className="flex items-center gap-1">
                    <Heart className="w-2.5 h-2.5 md:w-3 md:h-3" />
                    {(stream as LiveStreamWithInfluencer).total_reactions || 0}
                  </span>
                  <span className="flex items-center gap-1 hidden sm:flex">
                    <MessageCircle className="w-2.5 h-2.5 md:w-3 md:h-3" />
                    {(stream as LiveStreamWithInfluencer).total_messages || 0}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Description - only show on larger screens */}
          {stream.description && (
            <p className="text-[10px] md:text-xs text-gray-600 mt-1 md:mt-2 line-clamp-1 md:line-clamp-2 leading-relaxed hidden sm:block">
              {stream.description}
            </p>
          )}
        </div>
      </div>
    );
  };

  const StreamList = ({ stream, isLive = true }: { 
    stream: LiveStreamWithInfluencer | ScheduledStreamWithInfluencer, 
    isLive?: boolean 
  }) => {
    const influencerName = stream.influencer?.display_name || 'Unknown Host';
    const thumbnailUrl = stream.thumbnail_url || '/placeholder.svg';

    return (
      <div className="flex gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer group">
        <div className="relative flex-shrink-0">
          <img
            src={thumbnailUrl}
            alt={stream.title}
            className="w-24 h-16 object-cover rounded-lg group-hover:scale-105 transition-transform"
          />
          
          {isLive ? (
            <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1">
              LIVE
            </Badge>
          ) : (
            <Badge className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs px-1">
              SOON
            </Badge>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm mb-1 overflow-hidden" style={{ 
            display: '-webkit-box', 
            WebkitLineClamp: 2, 
            WebkitBoxOrient: 'vertical' 
          }}>
            {stream.title}
          </h3>
          
          <p className="text-gray-600 text-xs mb-1">
            {influencerName}
          </p>
          
          <div className="flex items-center gap-3 text-xs text-gray-500">
            {isLive ? (
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {formatViewerCount((stream as LiveStreamWithInfluencer).current_viewers || 0)} watching
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDateTime((stream as ScheduledStreamWithInfluencer).scheduled_start_time || '')}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center">
          <PlayCircle className="w-6 h-6 text-gray-400 group-hover:text-blue-500 transition-colors" />
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading live streams...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 md:px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">Kein Live</h1>
        <p className="text-gray-600 text-lg">Discover amazing live shopping experiences</p>
        {(liveStreams.length > 0 || scheduledStreams.length > 0) && (
          <div className="flex items-center gap-4 mt-3">
            {liveStreams.length > 0 && (
              <Badge className="bg-red-50 text-red-700 border-red-200">
                <Radio className="w-3 h-3 mr-1" />
                {liveStreams.length} Live Now
              </Badge>
            )}
            {scheduledStreams.length > 0 && (
              <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                <Calendar className="w-3 h-3 mr-1" />
                {scheduledStreams.length} Upcoming
              </Badge>
            )}
            {liveStreams.length > 0 && (
              <span className="text-sm text-gray-500">
                {liveStreams.reduce((total, stream) => total + (stream.current_viewers || 0), 0)} total viewers
              </span>
            )}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-8">
        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-xl p-1 shadow-sm">
          <Button
            variant={activeTab === 'live' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('live')}
            className={`relative rounded-lg ${activeTab === 'live' ? 'shadow-sm' : ''}`}
          >
            <Radio className="w-4 h-4 mr-2" />
            Live Now ({liveStreams.length})
          </Button>
          <Button
            variant={activeTab === 'upcoming' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('upcoming')}
            className={`rounded-lg ${activeTab === 'upcoming' ? 'shadow-sm' : ''}`}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Upcoming ({scheduledStreams.length})
          </Button>
        </div>

        {/* View Mode Toggle */}
        <div className="flex bg-gray-100 rounded-xl p-1 shadow-sm">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className={`rounded-lg ${viewMode === 'grid' ? 'shadow-sm' : ''}`}
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
            className={`rounded-lg ${viewMode === 'list' ? 'shadow-sm' : ''}`}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'live' && (
        <div>
          {liveStreams.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Radio className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Live Streams</h3>
              <p className="text-gray-500 text-lg">No one is streaming right now. Check back later!</p>
            </div>
          ) : (
            <div className={
              viewMode === 'grid' 
                ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3'
                : 'space-y-2'
            }>
              {liveStreams.map((stream) => (
                <Link
                  key={stream.id}
                  to={`/livestream/${stream.id}`}
                  className="block"
                >
                  {viewMode === 'grid' ? (
                    <StreamCard stream={stream} isLive={true} />
                  ) : (
                    <StreamList stream={stream} isLive={true} />
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'upcoming' && (
        <div>
          {scheduledStreams.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Upcoming Streams</h3>
              <p className="text-gray-500 text-lg">No streams are scheduled. Follow your favorite influencers to get notified!</p>
            </div>
          ) : (
            <div className={
              viewMode === 'grid' 
                ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3'
                : 'space-y-2'
            }>
              {scheduledStreams.map((stream) => (
                <div key={stream.id} className="block">
                  {viewMode === 'grid' ? (
                    <StreamCard stream={stream} isLive={false} />
                  ) : (
                    <StreamList stream={stream} isLive={false} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LiveStreamDiscovery;
