import React, { useState, useRef, useEffect } from 'react';
import { Camera, Mic, MicOff, Video, VideoOff, Monitor, Settings, Users, Eye, Heart, MessageCircle, Square, Play, Pause } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { LiveSession } from '../../types/liveStream';
import { useLiveStreamMetrics } from '../../hooks/useLiveStream';

interface LiveStreamBroadcastProps {
  session: LiveSession;
  onEndStream: () => void;
  onStreamUpdate: (updates: Partial<LiveSession>) => void;
}

export const LiveStreamBroadcast: React.FC<LiveStreamBroadcastProps> = ({
  session,
  onEndStream,
  onStreamUpdate
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isScreenShare, setIsScreenShare] = useState(false);
  const [streamStartTime, setStreamStartTime] = useState<Date | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      username: 'fashionlover23',
      message: 'Hey! Excited for this stream! 😍',
      timestamp: new Date(Date.now() - 2 * 60000),
      isHighlighted: false
    },
    {
      id: 2,
      username: 'styleseeker',
      message: 'Love your content!',
      timestamp: new Date(Date.now() - 1 * 60000),
      isHighlighted: true
    }
  ]);

  const { metrics, loading: metricsLoading } = useLiveStreamMetrics(session.id, session.status === 'live');

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isStreaming && streamStartTime) {
      interval = setInterval(() => {
        // Simulate live viewer updates
        const viewers = Math.floor(Math.random() * 50) + metrics.total_unique_viewers;
        onStreamUpdate({ 
          current_viewers: viewers,
          duration_minutes: Math.floor((Date.now() - streamStartTime.getTime()) / 60000)
        });
      }, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isStreaming, streamStartTime, metrics.total_unique_viewers, onStreamUpdate]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720, facingMode: 'user' },
        audio: true
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const toggleCamera = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCameraOn(videoTrack.enabled);
      }
    }
  };

  const toggleMicrophone = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicOn(audioTrack.enabled);
      }
    }
  };

  const startScreenShare = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = screenStream;
      }
      
      setIsScreenShare(true);
      
      // Handle screen share end
      screenStream.getVideoTracks()[0].onended = () => {
        setIsScreenShare(false);
        startCamera();
      };
    } catch (error) {
      console.error('Error starting screen share:', error);
    }
  };

  const startBroadcast = () => {
    setIsStreaming(true);
    setStreamStartTime(new Date());
    onStreamUpdate({ 
      status: 'live',
      actual_start_time: new Date().toISOString()
    });
  };

  const stopBroadcast = () => {
    setIsStreaming(false);
    setStreamStartTime(null);
    onEndStream();
  };

  const sendChatMessage = () => {
    if (chatMessage.trim()) {
      const newMessage = {
        id: chatMessages.length + 1,
        username: 'StreamHost',
        message: chatMessage,
        timestamp: new Date(),
        isHighlighted: true
      };
      setChatMessages(prev => [...prev, newMessage]);
      setChatMessage('');
    }
  };

  const formatDuration = (startTime: Date) => {
    const duration = Math.floor((Date.now() - startTime.getTime()) / 1000);
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Broadcast Area */}
      <div className="lg:col-span-2 space-y-4">
        {/* Stream Status */}
        {isStreaming && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <Badge className="bg-red-500 text-white">LIVE</Badge>
                  </div>
                  <div className="text-sm text-red-700">
                    <strong>{session.current_viewers || 0}</strong> viewers
                  </div>
                  {streamStartTime && (
                    <div className="text-sm text-red-700">
                      Duration: {formatDuration(streamStartTime)}
                    </div>
                  )}
                </div>
                <Button
                  onClick={stopBroadcast}
                  variant="destructive"
                  size="sm"
                >
                  <Square className="mr-2 h-4 w-4" />
                  End Stream
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Video Preview/Broadcast */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{isStreaming ? 'Live Stream' : 'Stream Preview'}</span>
              <div className="flex items-center space-x-2">
                {isScreenShare && (
                  <Badge variant="secondary">
                    <Monitor className="h-3 w-3 mr-1" />
                    Screen Share
                  </Badge>
                )}
                {isStreaming && (
                  <Badge className="bg-red-500 text-white">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-1"></div>
                    BROADCASTING
                  </Badge>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              
              {!isCameraOn && !isScreenShare && (
                <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                  <div className="text-center text-white">
                    <VideoOff className="h-12 w-12 mx-auto mb-2" />
                    <p>Camera is off</p>
                  </div>
                </div>
              )}

              {/* Stream Info Overlay */}
              <div className="absolute top-4 left-4 space-y-2">
                <div className="bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm">
                  {session.title}
                </div>
                {isStreaming && (
                  <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-2"></div>
                    LIVE
                  </div>
                )}
              </div>

              {/* Controls Overlay */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <div className="flex items-center space-x-3 bg-black bg-opacity-60 rounded-full px-4 py-2">
                  <Button
                    size="sm"
                    variant={isCameraOn ? "secondary" : "destructive"}
                    onClick={toggleCamera}
                    className="rounded-full w-10 h-10 p-0"
                  >
                    {isCameraOn ? <Camera className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                  </Button>
                  
                  <Button
                    size="sm"
                    variant={isMicOn ? "secondary" : "destructive"}
                    onClick={toggleMicrophone}
                    className="rounded-full w-10 h-10 p-0"
                  >
                    {isMicOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={startScreenShare}
                    className="rounded-full w-10 h-10 p-0"
                    disabled={isScreenShare}
                  >
                    <Monitor className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="secondary"
                    className="rounded-full w-10 h-10 p-0"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Stream Controls */}
            <div className="mt-4 flex justify-center">
              {!isStreaming ? (
                <Button
                  onClick={startBroadcast}
                  className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 text-lg"
                  disabled={!isCameraOn && !isScreenShare}
                >
                  <Play className="mr-2 h-5 w-5" />
                  Start Live Stream
                </Button>
              ) : (
                <div className="flex space-x-3">
                  <Button variant="outline" className="px-6">
                    <Pause className="mr-2 h-4 w-4" />
                    Pause
                  </Button>
                  <Button
                    onClick={stopBroadcast}
                    variant="destructive"
                    className="px-6"
                  >
                    <Square className="mr-2 h-4 w-4" />
                    End Stream
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Stats & Chat Sidebar */}
      <div className="space-y-4">
        {/* Live Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {isStreaming && <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>}
              <span>Live Metrics</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4 text-gray-600" />
                <span className="text-sm text-gray-600">Viewers</span>
              </div>
              <span className="font-semibold text-lg">{session.current_viewers || 0}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-gray-600" />
                <span className="text-sm text-gray-600">Peak Viewers</span>
              </div>
              <span className="font-semibold">{metrics.peak_viewers || 0}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Heart className="h-4 w-4 text-gray-600" />
                <span className="text-sm text-gray-600">Likes</span>
              </div>
              <span className="font-semibold">{metrics.total_likes || 0}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-4 w-4 text-gray-600" />
                <span className="text-sm text-gray-600">Comments</span>
              </div>
              <span className="font-semibold">{metrics.total_comments || 0}</span>
            </div>

            {isStreaming && streamStartTime && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800 font-medium">Stream Duration</p>
                <p className="text-lg font-bold text-green-900">{formatDuration(streamStartTime)}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Live Chat */}
        <Card>
          <CardHeader>
            <CardTitle>Live Chat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto mb-4">
              {chatMessages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`text-sm p-2 rounded ${
                    msg.isHighlighted ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50'
                  }`}
                >
                  <span className="font-medium text-purple-600">@{msg.username}:</span>
                  <span className="text-gray-700 ml-1">{msg.message}</span>
                  <div className="text-xs text-gray-500 mt-1">
                    {msg.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex space-x-2">
              <Input
                placeholder="Type a message..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                className="flex-1"
              />
              <Button size="sm" onClick={sendChatMessage}>
                Send
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
