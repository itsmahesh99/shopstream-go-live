import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Eye,
  Users,
  Play,
  Clock,
  Radio,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  ShoppingBag
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import ViewerHMSService, { LiveStreamWithHMSCredentials } from '@/services/viewerHMSService';
import { formatDistanceToNow } from 'date-fns';

const CustomerLivePageEnhanced = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [liveStreams, setLiveStreams] = useState<LiveStreamWithHMSCredentials[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLiveStreams();
  }, []);

  const loadLiveStreams = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await ViewerHMSService.getLiveStreamsWithHMSCredentials('live');

      if (fetchError) {
        console.error('Error fetching live streams:', fetchError);
        setError('Failed to load live streams');
        return;
      }

      setLiveStreams(data || []);
    } catch (err) {
      console.error('Error in loadLiveStreams:', err);
      setError('Failed to load live streams');
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

  const getCredentialStatus = (stream: LiveStreamWithHMSCredentials) => {
    const hasViewerCredentials = !!(stream.hms_viewer_room_code && stream.hms_viewer_auth_token);
    const hasRoomCode = !!(stream.hms_viewer_room_code || stream.room_code);

    return {
      hasViewerCredentials,
      hasRoomCode,
      canWatch: hasViewerCredentials && hasRoomCode
    };
  };

  const handleWatchStream = (streamId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/live-stream/${streamId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading live streams...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Error Loading Streams</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={loadLiveStreams} className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Live Shopping</h1>
              <p className="text-gray-600 text-lg">Discover amazing live shopping experiences from top creators</p>
              {liveStreams.length > 0 && (
                <div className="flex items-center gap-4 mt-3">
                  <Badge className="bg-red-50 text-red-700 border-red-200">
                    <Radio className="w-3 h-3 mr-1" />
                    {liveStreams.length} Live Now
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {liveStreams.reduce((total, stream) => total + (stream.current_viewers || 0), 0)} total viewers
                  </span>
                </div>
              )}
            </div>
            <Button onClick={loadLiveStreams} variant="outline" className="shadow-sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Authentication prompt */}
        {!user && (
          <Alert className="mb-8 border-blue-200 bg-blue-50">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              Please <Link to="/login" className="underline text-blue-600 font-semibold hover:text-blue-800">sign in</Link> to watch live streams and interact with hosts.
            </AlertDescription>
          </Alert>
        )}

        {/* Live streams grid */}
        {liveStreams.length === 0 ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <Radio className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Live Streams</h3>
              <p className="text-gray-600">
                There are no live streams at the moment. Check back later!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {liveStreams.map((stream) => {
              const credentialStatus = getCredentialStatus(stream);

              return (
                <div
                  key={stream.id}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group border border-gray-100"
                  onClick={() => handleWatchStream(stream.id)}
                >
                  {/* Thumbnail Container */}
                  <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-900 to-gray-700 overflow-hidden">
                    <img
                      src={stream.thumbnail_url || '/api/placeholder/320/240'}
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
                      {/* Live badge */}
                      <div className="flex items-center gap-2">
                        <Badge className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-md shadow-lg">
                          <div className="w-1.5 h-1.5 bg-white rounded-full mr-1.5 animate-pulse" />
                          LIVE
                        </Badge>
                      </div>

                      {/* Viewer count */}
                      <Badge className="bg-black/70 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
                        <Eye className="w-3 h-3 mr-1" />
                        {formatViewerCount(stream.current_viewers || 0)}
                      </Badge>
                    </div>

                    {/* Host avatar - positioned at bottom left */}
                    <div className="absolute bottom-2 left-2">
                      <Avatar className="w-8 h-8 border-2 border-white shadow-lg">
                        <AvatarImage src={stream.influencer?.avatar_url} />
                        <AvatarFallback className="bg-blue-500 text-white text-xs font-semibold">
                          {stream.influencer?.display_name?.charAt(0) || 'H'}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    {/* Status indicator - bottom right */}
                    <div className="absolute bottom-2 right-2">
                      {credentialStatus.canWatch ? (
                        <div className="w-3 h-3 bg-green-400 rounded-full border-2 border-white shadow-lg" />
                      ) : (
                        <div className="w-3 h-3 bg-red-400 rounded-full border-2 border-white shadow-lg" />
                      )}
                    </div>

                    {/* Play button overlay - only visible on hover */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleWatchStream(stream.id);
                        }}
                        disabled={!user || !credentialStatus.canWatch}
                        size="sm"
                        className="bg-white/95 text-black hover:bg-white shadow-lg backdrop-blur-sm"
                      >
                        <Play className="w-4 h-4 mr-1.5" />
                        Watch
                      </Button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-3">
                    {/* Title */}
                    <h3 className="font-semibold text-sm leading-tight mb-1 text-gray-900 line-clamp-2 min-h-[2.5rem]">
                      {stream.title}
                    </h3>

                    {/* Host name */}
                    <Link
                      to={`/influencer/${stream.influencer_id}`}
                      className="text-gray-600 hover:text-blue-600 text-xs font-medium transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {stream.influencer?.display_name || 'Unknown Host'}
                    </Link>

                    {/* Category/Tags */}
                    <div className="flex items-center gap-2 mt-2">
                      {stream.is_products_showcase && (
                        <Badge variant="outline" className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 border-blue-200">
                          <ShoppingBag className="w-2.5 h-2.5 mr-1" />
                          Shopping
                        </Badge>
                      )}

                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(stream.actual_start_time!), { addSuffix: true })}
                      </span>
                    </div>

                    {/* Description - only show if there's space */}
                    {stream.description && (
                      <p className="text-xs text-gray-600 mt-2 line-clamp-2 leading-relaxed">
                        {stream.description}
                      </p>
                    )}

                    {/* Bottom action area */}
                    <div className="mt-3 pt-2 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          {credentialStatus.canWatch ? (
                            <div className="flex items-center gap-1 text-green-600">
                              <CheckCircle className="w-3 h-3" />
                              <span className="text-xs font-medium">Ready to watch</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-red-600">
                              <XCircle className="w-3 h-3" />
                              <span className="text-xs font-medium">Limited access</span>
                            </div>
                          )}
                        </div>

                        {stream.influencer?.followers_count && (
                          <div className="flex items-center gap-1 text-gray-500">
                            <Users className="w-3 h-3" />
                            <span className="text-xs">{formatViewerCount(stream.influencer.followers_count)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerLivePageEnhanced;