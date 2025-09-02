import React, { useEffect, useState } from "react";
import {
  selectIsConnectedToRoom,
  selectPeers,
  selectLocalPeer,
  useHMSActions,
  useHMSStore,
  useVideo
} from "@100mslive/react-sdk";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, 
  Eye, 
  Heart, 
  MessageCircle, 
  Share, 
  Volume2, 
  VolumeX,
  Maximize,
  ArrowLeft,
  AlertCircle
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { getHMSAuthTokenViaEdge } from "../../services/hmsTokenClient";
import HMSTokenService from "../../services/hmsTokenService";
import { LiveStreamingService } from "../../services/liveStreamingService";
import { getRoomIdForJoining } from "../../utils/roomCodeUtils";

// Custom video component for full-screen viewing
const HostVideo = ({ peer }: { peer: any }) => {
  const { videoRef } = useVideo({
    trackId: peer.videoTrack
  });

  return (
    <video
      ref={videoRef}
      className="w-full h-full object-cover"
      autoPlay
      muted={false} // Don't mute the host for viewers
      playsInline
    />
  );
};

interface LiveStreamViewerProps {
  roomCode: string;
  streamTitle?: string;
  influencerName?: string;
  sessionId?: string;
  onBack?: () => void;
}

function LiveStreamViewer({ roomCode, streamTitle, influencerName, sessionId, onBack }: LiveStreamViewerProps) {
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  const peers = useHMSStore(selectPeers);
  const localPeer = useHMSStore(selectLocalPeer);
  const hmsActions = useHMSActions();
  const { user } = useAuth();
  
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  const [currentViewerId, setCurrentViewerId] = useState<string | null>(null);

  useEffect(() => {
    console.log("useEffect triggered with:", { roomCode, isConnected, isJoining });
    
    if (roomCode && !isConnected && !isJoining) {
      console.log("Conditions met, calling joinAsViewer");
      joinAsViewer();
    } else {
      console.log("Conditions not met for joining:", {
        hasRoomCode: !!roomCode,
        isNotConnected: !isConnected,
        isNotJoining: !isJoining
      });
    }

    return () => {
      if (isConnected) {
        console.log("Cleaning up: leaving HMS room");
        hmsActions.leave();
      }
      // Clean up viewer record when leaving
      if (currentViewerId) {
        console.log("Cleaning up: updating viewer status");
        LiveStreamingService.updateViewerStatus(currentViewerId, 0).catch(console.error);
      }
    };
  }, [roomCode, isConnected, isJoining]); // Added dependencies to prevent multiple calls

  useEffect(() => {
    // Update viewer count (exclude the host/broadcaster)
    const viewers = peers.filter(peer => 
      peer.roleName?.toLowerCase().includes('viewer') || 
      peer.roleName?.toLowerCase().includes('audience') ||
      peer.roleName === 'viewer-realtime' ||
      peer.roleName === 'viewer-near-realtime' ||
      peer.roleName === 'viewer-on-stage'
    );
    setViewerCount(viewers.length);
  }, [peers]);

  const joinAsViewer = async () => {
    console.log("joinAsViewer called with user:", user?.email, "roomCode:", roomCode);
    
    if (!user?.email || !roomCode) {
      console.error("Missing user email or roomCode");
      setError("Unable to join stream. Please try again.");
      return;
    }

    console.log("Setting isJoining to true");
    setIsJoining(true);
    setError(null);

    try {
      // Ensure we have the correct room ID format for 100ms
      const actualRoomId = getRoomIdForJoining(roomCode);
      console.log("Joining as viewer with room code:", roomCode, "Actual room ID:", actualRoomId);
      
      // Get viewer token with fallback approach
      let authToken: string;
      try {
        // Try edge function first (use actual room ID)
        console.log("Attempting edge function token generation...");
        authToken = await getHMSAuthTokenViaEdge(actualRoomId, 'viewer-realtime', user.id);
        console.log("Got token from edge function");
      } catch (edgeError) {
        console.warn('Edge function failed, falling back to local token generation:', edgeError);
        // Fallback to local token generation (use actual room ID)
        console.log("Attempting local token generation...");
        authToken = await HMSTokenService.generateAuthToken(actualRoomId, user.id, 'viewer-realtime');
        console.log("Got token from local service");
      }

      if (!authToken) {
        throw new Error("Failed to get authentication token from both edge and local services");
      }

      console.log("Got viewer auth token, joining room...");
      
      const userName = user.email.split('@')[0];
      console.log("About to call hmsActions.join with userName:", userName);
      
      // Add timeout to prevent hanging
      const joinPromise = hmsActions.join({
        userName,
        authToken,
        settings: {
          isAudioMuted: true, // Viewers start muted
          isVideoMuted: true  // Viewers don't share video
        }
      });

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Connection timeout after 15 seconds')), 15000);
      });

      await Promise.race([joinPromise, timeoutPromise]);

      console.log("hmsActions.join completed successfully");

      // Create viewer record in database if sessionId is provided
      if (sessionId) {
        try {
          console.log("Creating viewer record for sessionId:", sessionId);
          const { data: viewer, error } = await LiveStreamingService.addViewer({
            sessionId: sessionId,
            userId: user.id,
            viewerType: 'customer'
          });

          if (error) {
            console.error('Failed to create viewer record:', error);
          } else {
            console.log('Viewer record created:', viewer);
            setCurrentViewerId(viewer?.id || null);
          }
        } catch (dbError) {
          console.error('Error creating viewer record:', dbError);
        }
      }

    } catch (err) {
      console.error("Error joining as viewer:", err);
      
      // Handle specific error cases
      if (err instanceof Error) {
        if (err.message.includes('invalid room id')) {
          setError("This live stream is no longer available. The host may have ended the stream or there may be a connection issue. Please try refreshing or check back later.");
        } else {
          setError(err.message);
        }
      } else {
        setError("Failed to join live stream. Please try again.");
      }
    } finally {
      console.log("Join process finished, setting isJoining to false");
      setIsJoining(false);
    }
  };

  // Monitor connection status changes
  useEffect(() => {
    console.log("Connection status changed:", isConnected);
    if (isConnected) {
      console.log("Successfully connected to HMS room");
      setIsJoining(false);
      setError(null);
    }
  }, [isConnected]);

  const toggleMute = () => {
    if (localPeer) {
      hmsActions.setLocalAudioEnabled(isMuted);
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleLeave = () => {
    hmsActions.leave();
    if (onBack) {
      onBack();
    }
  };

  // Find the host/broadcaster peer
  const hostPeer = peers.find(peer => 
    peer.roleName?.toLowerCase().includes('broadcaster') || 
    peer.roleName?.toLowerCase().includes('host')
  );

  if (isJoining) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
          <p className="text-lg">Joining live stream...</p>
          <p className="text-sm text-gray-400">Connecting to {influencerName || 'host'}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Connection Failed</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="space-y-2">
              <Button 
                onClick={() => window.location.reload()} 
                className="w-full"
              >
                Try Again
              </Button>
              {onBack && (
                <Button 
                  variant="outline" 
                  onClick={onBack} 
                  className="w-full"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Live Streams
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Connecting to live stream...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50' : 'h-screen'} bg-black`}>
      {/* Top bar with stream info */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBack && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLeave}
                className="text-white hover:bg-white/20"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            
            <div>
              <h1 className="text-white font-semibold">
                {streamTitle || 'Live Stream'}
              </h1>
              <p className="text-gray-300 text-sm">
                by {influencerName || 'Host'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge className="bg-red-500 text-white">
              • LIVE
            </Badge>
            <Badge variant="secondary" className="bg-black/50 text-white">
              <Eye className="w-3 h-3 mr-1" />
              {viewerCount} watching
            </Badge>
          </div>
        </div>
      </div>

      {/* Main video area */}
      <div className="h-full flex items-center justify-center">
        {hostPeer ? (
          <div className="w-full h-full relative">
            <HostVideo peer={hostPeer} />
          </div>
        ) : (
          <div className="text-center text-white">
            <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-4">
              <Eye className="w-8 h-8" />
            </div>
            <p className="text-lg">Waiting for host to start streaming...</p>
            <p className="text-gray-400">Stay tuned!</p>
          </div>
        )}
      </div>

      {/* Bottom controls */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/80 to-transparent p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Viewer controls (minimal) */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMute}
              className="text-white hover:bg-white/20"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {/* Interaction buttons */}
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <Heart className="w-5 h-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <MessageCircle className="w-5 h-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <Share className="w-5 h-5" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFullscreen}
              className="text-white hover:bg-white/20"
            >
              <Maximize className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Chat overlay could go here */}
      {/* This would be a side panel or overlay for live chat */}
    </div>
  );
}

export default LiveStreamViewer;
