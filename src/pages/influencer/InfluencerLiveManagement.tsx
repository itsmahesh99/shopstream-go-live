import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Video, Calendar, BarChart3, Settings, CheckCircle, Play, Square, Loader2, Zap, Users, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import LiveStream from '../../components/live-stream/LiveStream';

interface StreamSession {
  id: string;
  title: string;
  description: string;
  status: 'scheduled' | 'live' | 'ended';
  startTime?: Date;
  endTime?: Date;
  viewerCount?: number;
}

const InfluencerLiveManagement = () => {
  const [activeView, setActiveView] = useState<'dashboard' | 'quick-setup' | 'streaming'>('dashboard');
  const [streamTitle, setStreamTitle] = useState('');
  const [isCreatingStream, setIsCreatingStream] = useState(false);
  const [currentStream, setCurrentStream] = useState<StreamSession | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { userProfile } = useAuth();

  console.log('InfluencerLiveManagement rendered with userProfile:', userProfile?.role);

  // Auto-generate stream title
  React.useEffect(() => {
    try {
      const now = new Date();
      const influencerName = userProfile?.role === 'influencer' 
        ? (userProfile.profile as any)?.display_name || (userProfile.profile as any)?.first_name || 'Influencer'
        : 'Influencer';
      const defaultTitle = `${influencerName}'s Live Stream - ${now.toLocaleDateString()} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      setStreamTitle(defaultTitle);
    } catch (err) {
      console.error('Error setting stream title:', err);
      setStreamTitle('Live Stream');
    }
  }, [userProfile]);

  const startQuickStream = async () => {
    if (!streamTitle.trim()) {
      setError('Please enter a stream title');
      return;
    }

    setIsCreatingStream(true);
    setError(null);

    try {
      // Simulate room creation (in production, this would call real 100ms API)
      await new Promise(resolve => setTimeout(resolve, 2000));

      const streamSession: StreamSession = {
        id: Date.now().toString(),
        title: streamTitle,
        description: 'Auto-created live stream',
        status: 'live',
        startTime: new Date(),
        viewerCount: 0
      };

      setCurrentStream(streamSession);
      setActiveView('streaming');
    } catch (err) {
      setError('Failed to create stream. Please try again.');
    } finally {
      setIsCreatingStream(false);
    }
  };

  const endStream = () => {
    if (currentStream) {
      setCurrentStream({ ...currentStream, status: 'ended', endTime: new Date() });
      setTimeout(() => {
        setCurrentStream(null);
        setActiveView('dashboard');
        setError(null);
        // Reset title
        const now = new Date();
        const influencerName = userProfile?.role === 'influencer' 
          ? (userProfile.profile as any)?.display_name || (userProfile.profile as any)?.first_name || 'Influencer'
          : 'Influencer';
        const defaultTitle = `${influencerName}'s Live Stream - ${now.toLocaleDateString()} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        setStreamTitle(defaultTitle);
      }, 3000);
    }
  };

  // Streaming View
  if (activeView === 'streaming' && currentStream) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-3 sm:p-6">
          {/* Mobile-optimized Stream Header */}
          <Card className="mb-4 sm:mb-6">
            <CardHeader className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                <div className="min-w-0">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <Video className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 shrink-0" />
                    <span className="truncate">{currentStream.title}</span>
                    <Badge className="bg-red-500 text-white animate-pulse text-xs px-2 py-1 shrink-0">🔴 LIVE</Badge>
                  </CardTitle>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    <span className="inline sm:hidden">Started: {currentStream.startTime?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span className="hidden sm:inline">Started: {currentStream.startTime?.toLocaleTimeString()} • Viewers: {currentStream.viewerCount || 0}</span>
                    <span className="inline sm:hidden block">Viewers: {currentStream.viewerCount || 0}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <Button 
                    onClick={() => setActiveView('dashboard')}
                    variant="outline"
                    size="sm"
                    className="text-xs sm:text-sm"
                  >
                    <span className="hidden sm:inline">← Back to Dashboard</span>
                    <span className="sm:hidden">← Back</span>
                  </Button>
                  <Button 
                    onClick={endStream}
                    variant="destructive"
                    size="sm"
                    className="text-xs sm:text-sm"
                  >
                    <Square className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    End Stream
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Mobile-optimized Live Stream Interface */}
          <div className="bg-white rounded-lg border overflow-hidden">
            <LiveStream />
          </div>
        </div>
      </div>
    );
  }

  // Quick Setup View
  if (activeView === 'quick-setup') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto p-3 sm:p-6">
          <div className="mb-4 sm:mb-6">
            <Button 
              onClick={() => setActiveView('dashboard')}
              variant="outline"
              className="mb-4 text-xs sm:text-sm"
            >
              ← Back
            </Button>
            <h1 className="text-xl sm:text-3xl font-bold text-gray-900 mb-2">Quick Live Setup</h1>
            <p className="text-sm sm:text-base text-gray-600">Start streaming instantly - no complex configuration needed!</p>
          </div>

          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-blue-900 text-base sm:text-lg">
                <Zap className="h-4 w-4 sm:h-5 sm:w-5" />
                Instant Stream Setup
              </CardTitle>
              <p className="text-blue-700 text-sm sm:text-base">
                Just enter a title and go live! We handle all the technical setup automatically.
              </p>
            </CardHeader>
            <CardContent className="space-y-4 p-4 sm:p-6">
              <div className="space-y-2">
                <Label htmlFor="streamTitle" className="text-blue-900 text-sm sm:text-base">Stream Title</Label>
                <Input
                  id="streamTitle"
                  value={streamTitle}
                  onChange={(e) => setStreamTitle(e.target.value)}
                  placeholder="Enter your stream title..."
                  className="border-blue-300 focus:border-blue-500 text-sm sm:text-base"
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-xs sm:text-sm">{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                onClick={startQuickStream}
                disabled={isCreatingStream || !streamTitle.trim()}
                className="w-full bg-red-600 hover:bg-red-700 text-white text-sm sm:text-lg py-4 sm:py-6"
              >
                {isCreatingStream ? (
                  <>
                    <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 mr-2 animate-spin" />
                    <span className="text-sm sm:text-base">Creating Stream...</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    <span className="text-sm sm:text-base">Start Live Stream Now</span>
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Mobile-optimized Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
            <Card>
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="bg-green-100 rounded-full p-2 sm:p-3 w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Zero Configuration</h3>
                <p className="text-sm text-gray-600">
                  No room codes, no complex setup. Just enter a title and go live instantly.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="bg-blue-100 rounded-full p-3 w-12 h-12 mx-auto mb-4">
                  <Video className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Professional Quality</h3>
                <p className="text-sm text-gray-600">
                  HD video streaming with automatic quality optimization and low latency.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="bg-purple-100 rounded-full p-3 w-12 h-12 mx-auto mb-4">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Audience Ready</h3>
                <p className="text-sm text-gray-600">
                  Support for multiple viewers with interactive features.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Main Dashboard View
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-3 sm:p-6">
        {/* Mobile-optimized Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-3xl font-bold text-gray-900 mb-2">Live Stream Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage your live streams and engage with your audience</p>
          
          {/* Authentication Status */}
          <Card className="mt-4 bg-green-50 border-green-200">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-green-800">✅ Ready to Stream</p>
                  <p className="text-xs text-green-600 truncate">
                    Welcome {userProfile?.role === 'influencer' 
                      ? (userProfile.profile as any)?.display_name || (userProfile.profile as any)?.first_name || 'Influencer'
                      : 'Influencer'}! Your streaming setup is ready.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mobile-optimized Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 border-red-200 bg-red-50" onClick={() => setActiveView('quick-setup')}>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 sm:p-3 bg-red-100 rounded-lg shrink-0">
                  <Video className="h-6 w-6 sm:h-8 sm:w-8 text-red-600" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-red-900 text-sm sm:text-lg">Go Live</h3>
                  <p className="text-xs sm:text-sm text-red-700">Start streaming instantly</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 border-blue-200 bg-blue-50" onClick={() => setActiveView('streaming')}>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 sm:p-3 bg-blue-100 rounded-lg shrink-0">
                  <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-blue-900 text-sm sm:text-lg">Schedule</h3>
                  <p className="text-xs sm:text-sm text-blue-700">Plan your streams</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 border-green-200 bg-green-50">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 sm:p-3 bg-green-100 rounded-lg shrink-0">
                  <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-green-900 text-sm sm:text-lg">Analytics</h3>
                  <p className="text-xs sm:text-sm text-green-700">View performance</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 border-purple-200 bg-purple-50">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 sm:p-3 bg-purple-100 rounded-lg shrink-0">
                  <Settings className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-purple-900 text-sm sm:text-lg">Settings</h3>
                  <p className="text-xs sm:text-sm text-purple-700">Stream config</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mobile-optimized Stream Status */}
        {currentStream && currentStream.status === 'ended' && (
          <Card className="border-green-200 bg-green-50 mb-6 sm:mb-8">
            <CardContent className="p-4 sm:p-6 text-center">
              <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-semibold mb-2 text-green-900">Stream Ended Successfully</h3>
              <p className="text-sm sm:text-base text-green-700 mb-2">
                Your stream "{currentStream.title}" has ended. Thank you for streaming!
              </p>
              <p className="text-xs sm:text-sm text-green-600">
                Stream duration: {currentStream.endTime && currentStream.startTime ? 
                Math.round((currentStream.endTime.getTime() - currentStream.startTime.getTime()) / 60000) : 0} minutes
              </p>
            </CardContent>
          </Card>
        )}

        {/* Mobile-optimized Recent Activity */}
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="text-center py-6 sm:py-8">
              <TrendingUp className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
              <p className="text-gray-600 mb-2 text-sm sm:text-base">No recent streams</p>
              <p className="text-xs sm:text-sm text-gray-500 mb-4">Your streaming activity will appear here</p>
              <Button 
                onClick={() => setActiveView('quick-setup')}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-sm sm:text-base"
              >
                <Play className="h-4 w-4 mr-2" />
                Start Your First Stream
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InfluencerLiveManagement;
