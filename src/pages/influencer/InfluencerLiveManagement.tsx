import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Video, 
  Settings, 
  Users, 
  Eye,
  Mic,
  Camera,
  Monitor,
  Play,
  Square,
  Pause
} from 'lucide-react';

const InfluencerLiveManagement = () => {
  const [isLive, setIsLive] = useState(false);
  const [streamTitle, setStreamTitle] = useState('');
  const [streamDescription, setStreamDescription] = useState('');
  const [currentViewers, setCurrentViewers] = useState(0);

  const handleStartStream = () => {
    setIsLive(true);
    setCurrentViewers(Math.floor(Math.random() * 100) + 1);
  };

  const handleEndStream = () => {
    setIsLive(false);
    setCurrentViewers(0);
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Live Streaming</h1>
        <p className="text-gray-600 mt-2">
          Start your live stream and engage with your audience
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stream Setup */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Video className="h-5 w-5" />
                <span>Stream Setup</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="streamTitle">Stream Title</Label>
                <Input
                  id="streamTitle"
                  value={streamTitle}
                  onChange={(e) => setStreamTitle(e.target.value)}
                  placeholder="Enter an engaging title for your stream"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="streamDescription">Description</Label>
                <Textarea
                  id="streamDescription"
                  value={streamDescription}
                  onChange={(e) => setStreamDescription(e.target.value)}
                  placeholder="Describe what you'll be showing in this stream"
                  rows={3}
                  className="mt-1"
                />
              </div>

              {/* Stream Preview */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Camera Preview</h3>
                <p className="text-gray-600 mb-4">Your camera feed will appear here</p>
                <Button variant="outline" size="sm">
                  <Settings className="mr-2 h-4 w-4" />
                  Configure Camera
                </Button>
              </div>

              {/* Stream Controls */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Camera className="h-5 w-5 text-gray-600" />
                    <span className="text-sm text-gray-600">Camera: On</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mic className="h-5 w-5 text-gray-600" />
                    <span className="text-sm text-gray-600">Mic: On</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  {!isLive ? (
                    <Button
                      onClick={handleStartStream}
                      disabled={!streamTitle.trim()}
                      className="bg-red-500 hover:bg-red-600 text-white"
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Go Live
                    </Button>
                  ) : (
                    <div className="flex space-x-2">
                      <Button variant="outline">
                        <Pause className="mr-2 h-4 w-4" />
                        Pause
                      </Button>
                      <Button
                        onClick={handleEndStream}
                        variant="destructive"
                      >
                        <Square className="mr-2 h-4 w-4" />
                        End Stream
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stream Stats & Chat */}
        <div className="space-y-6">
          {/* Live Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {isLive && <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>}
                <span>{isLive ? 'Live Now' : 'Stream Offline'}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Eye className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-600">Viewers</span>
                </div>
                <span className="font-semibold">{currentViewers}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-600">Followers</span>
                </div>
                <span className="font-semibold">1,250</span>
              </div>

              {isLive && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800 font-medium">Stream is live!</p>
                  <p className="text-xs text-green-600">Streaming for 15 minutes</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Chat/Comments */}
          <Card>
            <CardHeader>
              <CardTitle>Live Chat</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {isLive ? (
                  <>
                    <div className="text-sm">
                      <span className="font-medium text-purple-600">@fashionista23:</span>
                      <span className="text-gray-700 ml-1">Love this outfit! 😍</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium text-blue-600">@styleseeker:</span>
                      <span className="text-gray-700 ml-1">Where is that top from?</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium text-green-600">@trendwatcher:</span>
                      <span className="text-gray-700 ml-1">Following for more content!</span>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <p className="text-sm">Chat will appear when you go live</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Stream Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Quick Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Monitor className="mr-2 h-4 w-4" />
                Screen Share
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Camera className="mr-2 h-4 w-4" />
                Camera Settings
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Mic className="mr-2 h-4 w-4" />
                Audio Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InfluencerLiveManagement;
