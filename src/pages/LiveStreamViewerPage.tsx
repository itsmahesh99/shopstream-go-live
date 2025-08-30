import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { LiveStreamingService } from '@/services/liveStreamingService';
import { LiveStreamSession } from '@/types/live-streaming';
import { LiveStreamViewer } from '@/components/live-stream';
import LiveStreamViewerEnhanced from '@/components/live-stream/LiveStreamViewerEnhanced';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowLeft, 
  Users, 
  Eye, 
  Heart, 
  MessageCircle, 
  Share, 
  Radio,
  Clock,
  AlertCircle,
  ShoppingBag,
  Play
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';

interface LiveStreamWithInfluencer extends LiveStreamSession {
  influencer?: {
    display_name: string;
    followers_count: number;
    avatar_url?: string;
  };
}

const LiveStreamViewerPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [session, setSession] = useState<LiveStreamWithInfluencer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isWatching, setIsWatching] = useState(false);

  useEffect(() => {
    if (id) {
      fetchSession(id);
    }
  }, [id]);

  // Auto-start watching if stream is live and user is authenticated
  useEffect(() => {
    if (session && session.status === 'live' && user && !isWatching) {
      // Small delay to ensure smooth transition
      const timer = setTimeout(() => {
        setIsWatching(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [session, user, isWatching]);

  const fetchSession = async (sessionId: string) => {
    try {
      setLoading(true);
      const { data, error } = await LiveStreamingService.getSession(sessionId);
      
      if (error) {
        console.error('Error fetching session:', error);
        setError('Failed to load live stream session');
        return;
      }

      if (!data) {
        setError('Live stream session not found');
        return;
      }

      setSession(data as LiveStreamWithInfluencer);
    } catch (err) {
      console.error('Error fetching session:', err);
      setError('Failed to load live stream session');
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'live':
        return (
          <Badge className="bg-red-500 text-white">
            <Radio className="w-3 h-3 mr-1" />
            LIVE
          </Badge>
        );
      case 'scheduled':
        return (
          <Badge variant="secondary" className="bg-blue-500 text-white">
            <Clock className="w-3 h-3 mr-1" />
            SCHEDULED
          </Badge>
        );
      case 'ended':
        return (
          <Badge variant="secondary" className="bg-gray-500 text-white">
            ENDED
          </Badge>
        );
      default:
        return null;
    }
  };

  const handleWatchStream = () => {
    setIsWatching(true);
  };

  const handleBackFromViewer = () => {
    setIsWatching(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading live stream...</p>
        </div>
      </div>
    );
  }

  // Show loading when auto-starting live stream
  if (session && session.status === 'live' && user && !isWatching && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg">Starting live stream...</p>
          <p className="text-sm text-gray-300">Connecting to {session.influencer?.display_name || 'host'}</p>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Stream Not Found</h2>
            <p className="text-gray-600 mb-4">
              {error || 'This live stream could not be found or may have ended.'}
            </p>
            <Button onClick={() => navigate('/play')} className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Live Streams
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If user is watching and stream is live, show the enhanced viewer component
  if (isWatching && session.status === 'live') {
    return (
      <LiveStreamViewerEnhanced
        sessionId={session.id}
        onBack={handleBackFromViewer}
      />
    );
  }

  // Show stream preview/details
  const influencerName = session.influencer?.display_name || 'Unknown Host';
  const followerCount = session.influencer?.followers_count || 0;
  const thumbnailUrl = session.thumbnail_url || '/placeholder.svg';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/play')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            
            <div className="flex-1">
              <h1 className="font-semibold text-lg">{session.title}</h1>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>by {influencerName}</span>
                {getStatusBadge(session.status)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Video preview */}
            <div className="relative aspect-video mb-6 bg-black rounded-lg overflow-hidden">
              <img
                src={thumbnailUrl}
                alt={session.title}
                className="w-full h-full object-cover"
              />
              
              {/* Status overlay */}
              <div className="absolute top-4 left-4">
                {getStatusBadge(session.status)}
              </div>

              {/* Viewer count for live streams */}
              {session.status === 'live' && (
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-black/70 text-white">
                    <Eye className="w-3 h-3 mr-1" />
                    {formatViewerCount(session.current_viewers || 0)} watching
                  </Badge>
                </div>
              )}

              {/* Play button / Watch button */}
              <div className="absolute inset-0 flex items-center justify-center">
                {session.status === 'live' ? (
                  <Button
                    onClick={handleWatchStream}
                    disabled={!user}
                    size="lg"
                    className="bg-red-500 hover:bg-red-600 text-white disabled:bg-gray-500"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    {!user ? 'Sign in to Watch' : 'Watch Live Stream'}
                  </Button>
                ) : session.status === 'scheduled' ? (
                  <div className="text-center text-white">
                    <Clock className="w-12 h-12 mx-auto mb-2" />
                    <p className="text-lg">Stream starts {formatDistanceToNow(new Date(session.scheduled_start_time!), { addSuffix: true })}</p>
                  </div>
                ) : (
                  <div className="text-center text-white">
                    <p className="text-lg">This stream has ended</p>
                  </div>
                )}
              </div>
            </div>

            {/* Stream info */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={session.influencer?.avatar_url} />
                    <AvatarFallback>{influencerName.charAt(0)}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <h2 className="font-semibold text-xl mb-1">{session.title}</h2>
                    <Link 
                      to={`/influencer/${session.influencer_id}`}
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      {influencerName}
                      <Users className="w-4 h-4" />
                      {formatViewerCount(followerCount)} followers
                    </Link>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Heart className="w-4 h-4 mr-1" />
                      {session.total_reactions || 0}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {session.description && (
                  <p className="text-gray-700 mb-4">{session.description}</p>
                )}

                {/* Stream stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {formatViewerCount(session.current_viewers || 0)}
                    </div>
                    <div className="text-sm text-gray-600">Current Viewers</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {formatViewerCount(session.peak_viewers || 0)}
                    </div>
                    <div className="text-sm text-gray-600">Peak Viewers</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">
                      {session.total_messages || 0}
                    </div>
                    <div className="text-sm text-gray-600">Messages</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-600">
                      {session.total_reactions || 0}
                    </div>
                    <div className="text-sm text-gray-600">Reactions</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stream status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Stream Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Status</span>
                    {getStatusBadge(session.status)}
                  </div>
                  
                  {session.actual_start_time && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Started</span>
                      <span className="text-sm">
                        {formatDistanceToNow(new Date(session.actual_start_time), { addSuffix: true })}
                      </span>
                    </div>
                  )}

                  {session.scheduled_start_time && session.status === 'scheduled' && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Scheduled</span>
                      <span className="text-sm">
                        {formatDistanceToNow(new Date(session.scheduled_start_time), { addSuffix: true })}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Visibility</span>
                    <Badge variant="outline">
                      {session.visibility?.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Products (if any) */}
            {session.is_products_showcase && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5" />
                    Featured Products
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    Products will be showcased during the live stream
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Authentication prompt */}
            {!user && session.status === 'live' && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Please <Link to="/login" className="underline text-blue-600">sign in</Link> to watch live streams and interact with the host.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveStreamViewerPage;
