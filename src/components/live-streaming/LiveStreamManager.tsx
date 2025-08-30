// Live Stream Manager Component
// Comprehensive component for managing live streaming with database integration

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  Square, 
  Users, 
  MessageCircle, 
  TrendingUp, 
  Clock,
  Eye,
  DollarSign,
  Settings,
  Calendar,
  Radio
} from 'lucide-react';
import { useLiveStream, useInfluencerSessions } from '@/hooks/useLiveStreaming';
import { formatCurrency, formatNumber, formatDuration } from '@/utils/formatters';

interface LiveStreamManagerProps {
  influencerId: string;
  onSessionStart?: (sessionId: string) => void;
  onSessionEnd?: (sessionId: string) => void;
}

export const LiveStreamManager: React.FC<LiveStreamManagerProps> = ({
  influencerId,
  onSessionStart,
  onSessionEnd
}) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentSessionId, setCurrentSessionId] = useState<string | undefined>();
  
  // Live stream state management
  const liveStream = useLiveStream(currentSessionId);
  const { sessions, loading: sessionsLoading, refetch: refetchSessions } = useInfluencerSessions(influencerId);

  // New session form state
  const [newSessionForm, setNewSessionForm] = useState({
    title: '',
    description: '',
    scheduledStartTime: '',
    maxViewers: 1000,
    isRecordingEnabled: true,
    isChatEnabled: true,
    isProductsShowcase: true,
    visibility: 'public' as 'public' | 'private' | 'unlisted'
  });

  // Get active session
  const activeSession = sessions.find(s => s.status === 'live' || s.status === 'scheduled');

  // Handle session creation
  const handleCreateSession = async () => {
    if (!newSessionForm.title) return;

    const session = await liveStream.actions.createSession({
      influencerId,
      title: newSessionForm.title,
      description: newSessionForm.description,
      scheduledStartTime: newSessionForm.scheduledStartTime || undefined,
      maxViewers: newSessionForm.maxViewers,
      isRecordingEnabled: newSessionForm.isRecordingEnabled,
      isChatEnabled: newSessionForm.isChatEnabled,
      isProductsShowcase: newSessionForm.isProductsShowcase,
      visibility: newSessionForm.visibility
    });

    if (session) {
      setCurrentSessionId(session.id);
      setNewSessionForm({
        title: '',
        description: '',
        scheduledStartTime: '',
        maxViewers: 1000,
        isRecordingEnabled: true,
        isChatEnabled: true,
        isProductsShowcase: true,
        visibility: 'public'
      });
      refetchSessions();
    }
  };

  // Handle session start
  const handleStartSession = async (sessionId: string) => {
    // In real implementation, you would integrate with 100ms here
    const mockStreamingData = {
      roomId: `room_${sessionId}`,
      roomCode: `live_${Date.now()}`,
      streamKey: `key_${sessionId}`,
      streamUrl: `https://stream.example.com/${sessionId}`,
      hlsUrl: `https://hls.example.com/${sessionId}/playlist.m3u8`,
      rtmpUrl: `rtmp://rtmp.example.com/live/${sessionId}`
    };

    const updatedSession = await liveStream.actions.startSession(sessionId, mockStreamingData);
    
    if (updatedSession) {
      setCurrentSessionId(sessionId);
      refetchSessions();
      onSessionStart?.(sessionId);
    }
  };

  // Handle session end
  const handleEndSession = async (sessionId: string) => {
    const recordingUrl = `https://recordings.example.com/${sessionId}.mp4`;
    const updatedSession = await liveStream.actions.endSession(sessionId, recordingUrl);
    
    if (updatedSession) {
      setCurrentSessionId(undefined);
      refetchSessions();
      onSessionEnd?.(sessionId);
    }
  };

  // Live statistics
  const liveStats = liveStream.session ? {
    viewers: liveStream.session.current_viewers,
    peakViewers: liveStream.session.peak_viewers,
    totalViewers: liveStream.session.total_unique_viewers,
    messages: liveStream.session.total_messages,
    revenue: liveStream.session.total_revenue,
    duration: liveStream.session.actual_start_time 
      ? Math.floor((new Date().getTime() - new Date(liveStream.session.actual_start_time).getTime()) / 60000)
      : 0
  } : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Live Stream Manager</h2>
          <p className="text-gray-600">Manage your live streaming sessions and analytics</p>
        </div>
        
        {activeSession?.status === 'live' && (
          <Badge variant="destructive" className="animate-pulse">
            <Radio className="w-3 h-3 mr-1" />
            LIVE
          </Badge>
        )}
      </div>

      {/* Live Session Status */}
      {liveStream.session && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-red-600" />
                <CardTitle className="text-lg">{liveStream.session.title}</CardTitle>
                <Badge variant={liveStream.session.status === 'live' ? 'destructive' : 'secondary'}>
                  {liveStream.session.status.toUpperCase()}
                </Badge>
              </div>
              
              {liveStream.session.status === 'live' && (
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleEndSession(liveStream.session!.id)}
                >
                  <Square className="w-4 h-4 mr-1" />
                  End Stream
                </Button>
              )}
            </div>
          </CardHeader>
          
          {liveStats && (
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{formatNumber(liveStats.viewers)}</div>
                  <div className="text-sm text-gray-600">Current Viewers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{formatNumber(liveStats.peakViewers)}</div>
                  <div className="text-sm text-gray-600">Peak Viewers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{formatNumber(liveStats.totalViewers)}</div>
                  <div className="text-sm text-gray-600">Total Viewers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{formatNumber(liveStats.messages)}</div>
                  <div className="text-sm text-gray-600">Messages</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{formatCurrency(liveStats.revenue)}</div>
                  <div className="text-sm text-gray-600">Revenue</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{formatDuration(liveStats.duration)}</div>
                  <div className="text-sm text-gray-600">Duration</div>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!activeSession ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Stream Title</label>
                      <Input
                        placeholder="Enter stream title..."
                        value={newSessionForm.title}
                        onChange={(e) => setNewSessionForm(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Max Viewers</label>
                      <Input
                        type="number"
                        value={newSessionForm.maxViewers}
                        onChange={(e) => setNewSessionForm(prev => ({ ...prev, maxViewers: parseInt(e.target.value) }))}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <Textarea
                      placeholder="Describe your live stream..."
                      value={newSessionForm.description}
                      onChange={(e) => setNewSessionForm(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                  
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={newSessionForm.isRecordingEnabled}
                        onChange={(e) => setNewSessionForm(prev => ({ ...prev, isRecordingEnabled: e.target.checked }))}
                      />
                      Enable Recording
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={newSessionForm.isChatEnabled}
                        onChange={(e) => setNewSessionForm(prev => ({ ...prev, isChatEnabled: e.target.checked }))}
                      />
                      Enable Chat
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={newSessionForm.isProductsShowcase}
                        onChange={(e) => setNewSessionForm(prev => ({ ...prev, isProductsShowcase: e.target.checked }))}
                      />
                      Product Showcase
                    </label>
                  </div>
                  
                  <Button 
                    onClick={handleCreateSession}
                    disabled={!newSessionForm.title || liveStream.isLoading}
                    className="w-full"
                  >
                    Create Live Stream Session
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">{activeSession.title}</h3>
                    <p className="text-gray-600">{activeSession.description}</p>
                  </div>
                  
                  {activeSession.status === 'scheduled' && (
                    <Button 
                      onClick={() => handleStartSession(activeSession.id)}
                      size="lg"
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Start Live Stream
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {liveStream.messages.slice(0, 5).map((message) => (
                <div key={message.id} className="flex items-start gap-3 py-2 border-b last:border-0">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{message.username || 'Anonymous'}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(message.sent_at).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{message.message}</p>
                  </div>
                </div>
              ))}
              
              {liveStream.messages.length === 0 && (
                <p className="text-gray-500 text-center py-4">No messages yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sessions Tab */}
        <TabsContent value="sessions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>All Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold">{session.title}</h3>
                      <p className="text-sm text-gray-600">{session.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {formatNumber(session.total_unique_viewers)} viewers
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {formatCurrency(session.total_revenue)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(session.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        session.status === 'live' ? 'destructive' :
                        session.status === 'ended' ? 'secondary' :
                        session.status === 'scheduled' ? 'default' : 'outline'
                      }>
                        {session.status}
                      </Badge>
                      
                      {session.status === 'scheduled' && (
                        <Button 
                          size="sm"
                          onClick={() => handleStartSession(session.id)}
                        >
                          Start
                        </Button>
                      )}
                      
                      {session.status === 'live' && (
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleEndSession(session.id)}
                        >
                          End
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                
                {sessions.length === 0 && !sessionsLoading && (
                  <p className="text-gray-500 text-center py-8">No sessions found</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Schedule Tab */}
        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Schedule New Stream</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Stream Date</label>
                    <Input type="date" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Stream Time</label>
                    <Input type="time" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Stream Title</label>
                  <Input placeholder="Enter scheduled stream title..." />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <Textarea placeholder="Describe your upcoming stream..." />
                </div>
                
                <Button className="w-full">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Stream
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">{formatNumber(sessions.reduce((sum, s) => sum + s.total_unique_viewers, 0))}</p>
                    <p className="text-sm text-gray-600">Total Viewers</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">{formatCurrency(sessions.reduce((sum, s) => sum + s.total_revenue, 0))}</p>
                    <p className="text-sm text-gray-600">Total Revenue</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold">{sessions.length}</p>
                    <p className="text-sm text-gray-600">Total Sessions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold">{formatNumber(sessions.reduce((sum, s) => sum + s.total_messages, 0))}</p>
                    <p className="text-sm text-gray-600">Total Messages</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LiveStreamManager;
