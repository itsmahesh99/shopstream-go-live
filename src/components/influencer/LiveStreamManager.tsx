import React, { useState } from 'react';
import { Plus, Calendar, Play, Square, Edit, Trash2, Users, Clock, TrendingUp, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useLiveSessions } from '../../hooks/useLiveStream';
import { LiveSession } from '../../types/liveStream';
import { CreateStreamModal } from './CreateStreamModal';
import { EditStreamModal } from './EditStreamModal';
import { StreamControlPanel } from './StreamControlPanel';
import LiveStream from '../live-stream/LiveStream';
import { format, isToday, isPast, isFuture } from 'date-fns';

export const LiveStreamManager: React.FC = () => {
  const { sessions, loading, error, deleteSession, startSession, endSession, updateSession } = useLiveSessions();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingSession, setEditingSession] = useState<LiveSession | null>(null);
  const [activeSession, setActiveSession] = useState<LiveSession | null>(null);
  const [broadcastingSession, setBroadcastingSession] = useState<LiveSession | null>(null);

  const getStatusBadge = (session: LiveSession) => {
    const now = new Date();
    const scheduledTime = session.scheduled_start_time ? new Date(session.scheduled_start_time) : null;

    switch (session.status) {
      case 'live':
        return <Badge className="bg-red-500 text-white">🔴 LIVE</Badge>;
      case 'ended':
        return <Badge variant="secondary">Ended</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      case 'scheduled':
        if (scheduledTime && isPast(scheduledTime)) {
          return <Badge className="bg-orange-500 text-white">Ready to Start</Badge>;
        }
        return <Badge className="bg-blue-500 text-white">Scheduled</Badge>;
      default:
        return <Badge variant="outline">{session.status}</Badge>;
    }
  };

  const getTimeDisplay = (session: LiveSession) => {
    if (session.status === 'live' && session.actual_start_time) {
      const startTime = new Date(session.actual_start_time);
      const duration = Math.floor((Date.now() - startTime.getTime()) / 1000 / 60);
      return `Live for ${duration} minutes`;
    }

    if (session.status === 'ended' && session.duration_minutes) {
      return `Duration: ${session.duration_minutes} minutes`;
    }

    if (session.scheduled_start_time) {
      const scheduledTime = new Date(session.scheduled_start_time);
      if (isToday(scheduledTime)) {
        return `Today at ${format(scheduledTime, 'HH:mm')}`;
      }
      return format(scheduledTime, 'MMM dd, yyyy HH:mm');
    }

    return 'No schedule set';
  };

  const canStartStream = (session: LiveSession) => {
    if (session.status !== 'scheduled') return false;
    if (!session.scheduled_start_time) return true; // Can start anytime if no schedule
    
    const scheduledTime = new Date(session.scheduled_start_time);
    const now = new Date();
    const timeDiff = scheduledTime.getTime() - now.getTime();
    
    // Allow starting 5 minutes before scheduled time
    return timeDiff <= 5 * 60 * 1000;
  };

  const handleStartStream = async (session: LiveSession) => {
    const result = await startSession(session.id);
    if (!result.error) {
      const updatedSession = { ...session, status: 'live' as const, actual_start_time: new Date().toISOString() };
      setActiveSession(updatedSession);
      setBroadcastingSession(updatedSession);
    }
  };

  const handleEndStream = async (session: LiveSession) => {
    const result = await endSession(session.id);
    if (!result.error) {
      setActiveSession(null);
      setBroadcastingSession(null);
    }
  };

  const handleStreamUpdate = async (sessionId: string, updates: Partial<LiveSession>) => {
    if (updateSession) {
      await updateSession(sessionId, updates);
    }
    
    // Update local state
    if (broadcastingSession && broadcastingSession.id === sessionId) {
      setBroadcastingSession(prev => prev ? { ...prev, ...updates } : null);
    }
    if (activeSession && activeSession.id === sessionId) {
      setActiveSession(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (window.confirm('Are you sure you want to delete this stream? This action cannot be undone.')) {
      await deleteSession(sessionId);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">Error loading streams: {error}</p>
      </div>
    );
  }

  const upcomingStreams = sessions.filter(s => s.status === 'scheduled');
  const liveStreams = sessions.filter(s => s.status === 'live');
  const pastStreams = sessions.filter(s => s.status === 'ended');

  // If broadcasting, show the broadcast interface
  if (broadcastingSession) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => setBroadcastingSession(null)}
            variant="outline"
            size="sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Live Broadcasting</h1>
            <p className="text-gray-600">{broadcastingSession.title}</p>
          </div>
        </div>
        
        <LiveStream />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Live Stream Management</h1>
          <p className="text-gray-600">Create, schedule, and manage your live streams</p>
        </div>
        <div className="flex space-x-3">
          <Button onClick={() => setShowCreateModal(true)} className="bg-purple-600 hover:bg-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            Create Stream
          </Button>
          <Button 
            onClick={() => {
              // Create quick live stream
              const quickSession: LiveSession = {
                id: 'quick-' + Date.now(),
                influencer_id: 'temp',
                title: 'Quick Live Stream',
                description: 'Live stream started immediately',
                status: 'live',
                actual_start_time: new Date().toISOString(),
                peak_viewers: 0,
                total_unique_viewers: 0,
                total_products_showcased: 0,
                total_sales_generated: 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              };
              setBroadcastingSession(quickSession);
            }}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            <Play className="h-4 w-4 mr-2" />
            Go Live Now
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Streams</p>
                <p className="text-2xl font-bold text-gray-900">{sessions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Play className="h-8 w-8 text-red-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Live Now</p>
                <p className="text-2xl font-bold text-gray-900">{liveStreams.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold text-gray-900">{upcomingStreams.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">
                  {sessions.reduce((sum, s) => sum + s.total_unique_viewers, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Streams */}
      {liveStreams.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Play className="h-5 w-5 text-red-600 mr-2" />
              Live Streams
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {liveStreams.map((session) => (
                <div key={session.id} className="border border-red-200 bg-red-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{session.title}</h3>
                        {getStatusBadge(session)}
                      </div>
                      <p className="text-gray-600 mb-2">{session.description}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {getTimeDisplay(session)}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setActiveSession(session)}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Control Panel
                      </Button>
                      <Button
                        onClick={() => handleEndStream(session)}
                        size="sm"
                        variant="destructive"
                      >
                        <Square className="h-4 w-4 mr-1" />
                        End Stream
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Streams */}
      {upcomingStreams.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 text-blue-600 mr-2" />
              Upcoming Streams
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingStreams.map((session) => (
                <div key={session.id} className="border p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{session.title}</h3>
                        {getStatusBadge(session)}
                      </div>
                      <p className="text-gray-600 mb-2">{session.description}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {getTimeDisplay(session)}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {canStartStream(session) && (
                        <Button
                          onClick={() => handleStartStream(session)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Start Stream
                        </Button>
                      )}
                      <Button
                        onClick={() => setEditingSession(session)}
                        size="sm"
                        variant="outline"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteSession(session.id)}
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Past Streams */}
      {pastStreams.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Past Streams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pastStreams.slice(0, 5).map((session) => (
                <div key={session.id} className="border p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{session.title}</h3>
                        {getStatusBadge(session)}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Duration:</span>
                          <span className="ml-1 font-medium">{session.duration_minutes || 0} min</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Peak Viewers:</span>
                          <span className="ml-1 font-medium">{session.peak_viewers}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Total Viewers:</span>
                          <span className="ml-1 font-medium">{session.total_unique_viewers}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Sales:</span>
                          <span className="ml-1 font-medium">₹{session.total_sales_generated}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {sessions.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Play className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No streams yet</h3>
            <p className="text-gray-600 mb-6">Create your first live stream to get started!</p>
            <Button onClick={() => setShowCreateModal(true)} className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Stream
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      <CreateStreamModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      {editingSession && (
        <EditStreamModal
          session={editingSession}
          isOpen={!!editingSession}
          onClose={() => setEditingSession(null)}
        />
      )}

      {activeSession && (
        <StreamControlPanel
          session={activeSession}
          isOpen={!!activeSession}
          onClose={() => setActiveSession(null)}
        />
      )}
    </div>
  );
};
