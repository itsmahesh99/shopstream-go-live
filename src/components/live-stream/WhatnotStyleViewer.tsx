import { useEffect, useState, useRef } from "react";
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
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Eye,
  Heart,
  Share,
  Volume2,
  VolumeX,
  ArrowLeft,
  AlertCircle,
  Send,
  Users
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { LiveStreamingService } from "../../services/liveStreamingService";
import ViewerHMSService from "../../services/viewerHMSService";
import "./live-stream.css";

// Custom video component for the host
const HostVideo = ({ peer }: { peer: any }) => {
  const { videoRef } = useVideo({
    trackId: peer.videoTrack
  });

  return (
    <video
      ref={videoRef}
      className="whatnot-video"
      autoPlay
      muted={false}
      playsInline
    />
  );
};

interface WhatnotStyleViewerProps {
  sessionId: string;
  onBack?: () => void;
}

function WhatnotStyleViewer({ sessionId, onBack }: WhatnotStyleViewerProps) {
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  const peers = useHMSStore(selectPeers);
  const localPeer = useHMSStore(selectLocalPeer);
  const hmsActions = useHMSActions();
  const { user } = useAuth();

  const [isJoining, setIsJoining] = useState(false);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  const [currentViewerId, setCurrentViewerId] = useState<string | null>(null);
  const [chatMessage, setChatMessage] = useState("");
  // Removed bidding-related state as this is a shopping platform, not auction

  // Refs to prevent multiple operations
  const joinAttemptRef = useRef(false);
  const hasJoinedRef = useRef(false);
  const isCleaningUpRef = useRef(false);

  // Session and HMS data
  const [sessionData, setSessionData] = useState<any>(null);
  const [hmsCredentials, setHmsCredentials] = useState<{
    roomCode: string | null;
    authToken: string | null;
    hasViewerCredentials: boolean;
  }>({
    roomCode: null,
    authToken: null,
    hasViewerCredentials: false
  });

  // Mock chat messages
  const [chatMessages] = useState([
    { id: 1, user: "sneakerhead23", message: "These are fire! 🔥", timestamp: "2m ago" },
    { id: 2, user: "collector_mike", message: "What size?", timestamp: "1m ago" },
    { id: 3, user: "kicks_daily", message: "Bidding $70!", timestamp: "30s ago" },
    { id: 4, user: "street_style", message: "Love the colorway", timestamp: "15s ago" },
  ]);

  // Removed viewers list as it's not needed in the new layout

  // Reset cleanup ref on mount
  useEffect(() => {
    isCleaningUpRef.current = false;
  }, []);

  // Load session data and HMS credentials
  useEffect(() => {
    loadSessionData();
  }, [sessionId]);

  // Join stream when credentials are ready
  useEffect(() => {
    const conditions = {
      hasSessionData: !!sessionData,
      hasRoomCode: !!hmsCredentials.roomCode,
      hasAuthToken: !!hmsCredentials.authToken,
      authTokenNotFallback: hmsCredentials.authToken !== 'fallback',
      notConnected: !isConnected,
      notJoining: !isJoining,
      noJoinAttempt: !joinAttemptRef.current,
      notJoined: !hasJoinedRef.current
    };

    const allConditionsMet = Object.values(conditions).every(Boolean);

    if (allConditionsMet) {
      joinAttemptRef.current = true;
      joinAsViewer();
    }
  }, [sessionData?.id, hmsCredentials.roomCode, hmsCredentials.authToken]);

  // Removed countdown timer as this is not an auction platform

  const loadSessionData = async () => {
    try {
      setIsLoadingSession(true);
      setError(null);

      const { data: session, error: sessionError } = await ViewerHMSService.getSessionWithHMSCredentials(sessionId);

      if (sessionError || !session) {
        setError('Failed to load live stream session');
        return;
      }

      setSessionData(session);

      if (session.status !== 'live') {
        setError(`This stream is ${session.status}. Only live streams can be watched.`);
        return;
      }

      const viewerRoomCode = ViewerHMSService.getViewerRoomCode(session);
      const viewerAuthToken = ViewerHMSService.getViewerAuthToken(session);

      if (!viewerRoomCode) {
        setError('No room code available for this stream. Please contact the host.');
        return;
      }

      if (!viewerAuthToken) {
        setError('No viewer authentication token available. Please contact the host to set up viewer access.');
        return;
      }

      setHmsCredentials({
        roomCode: viewerRoomCode,
        authToken: viewerAuthToken,
        hasViewerCredentials: !!(session.hms_viewer_room_code && session.hms_viewer_auth_token)
      });

    } catch (error) {
      setError('Failed to load stream data');
    } finally {
      setIsLoadingSession(false);
    }
  };

  const joinAsViewer = async () => {
    if (!user?.email || !hmsCredentials.roomCode) {
      setError("Unable to join stream. Missing authentication data.");
      return;
    }

    setIsJoining(true);
    setError(null);

    try {
      const userName = user.email.split('@')[0];
      let authToken = hmsCredentials.authToken;

      if (!hmsCredentials.hasViewerCredentials || authToken === 'fallback') {
        const { getHMSAuthTokenViaEdge } = await import('../../services/hmsTokenClient');
        const HMSTokenService = await import('../../services/hmsTokenService');

        try {
          authToken = await getHMSAuthTokenViaEdge(hmsCredentials.roomCode, 'viewer-realtime', user.id);
        } catch (edgeError) {
          authToken = await HMSTokenService.default.generateAuthToken(hmsCredentials.roomCode, user.id, 'viewer-realtime');
        }
      }

      const joinPromise = hmsActions.join({
        userName,
        authToken,
        settings: {
          isAudioMuted: true,
          isVideoMuted: true
        }
      });

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Connection timeout after 15 seconds')), 15000);
      });

      await Promise.race([joinPromise, timeoutPromise]);
      hasJoinedRef.current = true;

      try {
        const { data: viewer, error } = await LiveStreamingService.addViewer({
          sessionId: sessionId,
          userId: user.id,
          viewerType: 'customer'
        });

        if (!error && viewer) {
          setCurrentViewerId(viewer.id);
        }
      } catch (dbError) {
        console.error('Error creating viewer record:', dbError);
      }

    } catch (err) {
      hasJoinedRef.current = false;
      if (err instanceof Error) {
        if (err.message.includes('invalid room id') || err.message.includes('room not found')) {
          setError("This live stream is no longer available. The host may have ended the stream.");
        } else if (err.message.includes('timeout')) {
          setError("Connection timeout. Please check your internet connection and try again.");
        } else if (err.message.includes('token')) {
          setError("Authentication failed. The stream access may have expired.");
        } else {
          setError(err.message);
        }
      } else {
        setError("Failed to join live stream. Please try again.");
      }
    } finally {
      setIsJoining(false);
      joinAttemptRef.current = false;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isCleaningUpRef.current) return;
      isCleaningUpRef.current = true;

      if (hasJoinedRef.current && isConnected) {
        hmsActions.leave();
      }

      if (currentViewerId) {
        LiveStreamingService.updateViewerStatus(currentViewerId, 0).catch(console.error);
      }

      joinAttemptRef.current = false;
      hasJoinedRef.current = false;
    };
  }, []);

  // Update viewer count
  useEffect(() => {
    const viewers = peers.filter(peer =>
      peer.roleName?.toLowerCase().includes('viewer') ||
      peer.roleName?.toLowerCase().includes('audience') ||
      peer.roleName === 'viewer-realtime' ||
      peer.roleName === 'viewer-near-realtime' ||
      peer.roleName === 'viewer-on-stage'
    );
    setViewerCount(viewers.length);
  }, [peers]);

  const toggleMute = () => {
    if (localPeer) {
      hmsActions.setLocalAudioEnabled(isMuted);
      setIsMuted(!isMuted);
    }
  };

  const handleLeave = () => {
    isCleaningUpRef.current = true;
    if (hasJoinedRef.current && isConnected) {
      hmsActions.leave();
    }
    if (onBack) {
      onBack();
    }
  };

  const sendMessage = () => {
    if (chatMessage.trim()) {
      setChatMessage("");
    }
  };

  // Removed bidding functionality - replaced with add to cart

  // Find the host/broadcaster peer
  const hostPeer = peers.find(peer =>
    peer.roleName?.toLowerCase().includes('broadcaster') ||
    peer.roleName?.toLowerCase().includes('host')
  );

  // Loading session data
  if (isLoadingSession) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
          <p className="text-lg">Loading stream...</p>
        </div>
      </div>
    );
  }

  // Joining stream
  if (isJoining) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
          <p className="text-lg">Joining live stream...</p>
          <p className="text-sm text-gray-400">
            Connecting to {sessionData?.influencer?.display_name || 'host'}
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Unable to Join Stream</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="space-y-2">
              <Button onClick={() => window.location.reload()} className="w-full">
                Try Again
              </Button>
              {onBack && (
                <Button variant="outline" onClick={onBack} className="w-full">
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

  // Connecting state
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

  // Main shopping live stream viewer interface
  return (
    <div className="h-screen bg-gray-50 flex mobile-live-container">
      {/* Mobile Layout Container */}
      <div className="mobile-layout">
        {/* Video Section */}
        <div className="mobile-video-section bg-black relative">
          {/* Header with stream info */}
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
                    {sessionData?.title || 'Live Stream'}
                  </h1>
                  <p className="text-gray-300 text-sm">
                    by {sessionData?.influencer?.display_name || 'Host'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge className="bg-red-500 text-white px-3 py-1">
                  <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                  LIVE
                </Badge>
                <Badge variant="secondary" className="bg-black/50 text-white">
                  <Eye className="w-3 h-3 mr-1" />
                  {viewerCount} watching
                </Badge>
              </div>
            </div>
          </div>

          {/* Video Container */}
          <div className="w-full h-full flex items-center justify-center">
            {hostPeer ? (
              <HostVideo peer={hostPeer} />
            ) : (
              <div className="text-center text-white">
                <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-12 h-12 text-gray-600" />
                </div>
                <p className="text-lg">Waiting for host to start streaming...</p>
                <p className="text-gray-400">Stay tuned!</p>
              </div>
            )}
          </div>

          {/* Mobile Product Overlay - Only visible on mobile */}
          <div className="mobile-product-overlay">
            <div className="bg-black/40 backdrop-blur-sm rounded-lg border border-white/20 overflow-hidden shadow-lg">
              {/* Compact Product Content */}
              <div className="p-3">
                <div className="flex gap-3 items-center">
                  {/* Product Image */}
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                    <img
                      src="/api/placeholder/48/48"
                      alt="Featured Product"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%236b7280' font-family='Arial, sans-serif' font-size='8'%3EP%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-white text-xs mb-1 truncate">Nike Air Jordan 1 Retro High</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">$149.99</span>
                      <span className="text-xs text-gray-300 line-through">$179.99</span>
                    </div>
                  </div>

                  {/* Add to Cart Button - Compact */}
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-xs font-semibold rounded-md">
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom controls */}
          <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/80 to-transparent p-4 mobile-controls">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
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
                  <Share className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Product Section - Below video */}
        <div className="mobile-product-section">
          <div className="bg-white p-4">
            {/* Product Info */}
            <div className="flex gap-4 mb-4">
              {/* Product Image */}
              <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                <img
                  src="/api/placeholder/80/80"
                  alt="Featured Product"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%236b7280' font-family='Arial, sans-serif' font-size='10'%3EProduct%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>

              {/* Product Details */}
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">Nike Air Jordan 1 Retro High</h3>
                <p className="text-gray-600 text-sm mb-2">Classic basketball sneaker with premium leather construction</p>

                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl font-bold text-gray-900">$149.99</span>
                  <span className="text-sm text-gray-500 line-through">$179.99</span>
                  <Badge className="bg-green-100 text-green-800 text-xs">In Stock</Badge>
                </div>
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
              <select className="w-full p-3 border border-gray-300 rounded-lg text-base">
                <option>Select Size</option>
                <option>US 8</option>
                <option>US 9</option>
                <option>US 10</option>
                <option>US 11</option>
                <option>US 12</option>
              </select>
            </div>

            {/* Add to Cart Button */}
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg font-semibold rounded-lg">
              Add to Cart
            </Button>

            {/* Features Section */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-sm">Free Shipping</p>
                  <p className="text-xs text-gray-500">On orders over $50</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-sm">Easy Returns</p>
                  <p className="text-xs text-gray-500">30-day return policy</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-sm">Secure Payment</p>
                  <p className="text-xs text-gray-500">SSL encrypted checkout</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.944l7.071 7.071-7.071 7.071-7.071-7.071L12 2.944z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-sm">24/7 Support</p>
                  <p className="text-xs text-gray-500">Always here to help</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Video Area - Desktop only */}
      <div className="desktop-video-area flex-1 bg-black relative">
        {/* Header with stream info */}
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
                  {sessionData?.title || 'Live Stream'}
                </h1>
                <p className="text-gray-300 text-sm">
                  by {sessionData?.influencer?.display_name || 'Host'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge className="bg-red-500 text-white px-3 py-1">
                <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                LIVE
              </Badge>
              <Badge variant="secondary" className="bg-black/50 text-white">
                <Eye className="w-3 h-3 mr-1" />
                {viewerCount} watching
              </Badge>
            </div>
          </div>
        </div>

        {/* Video Container */}
        <div className="w-full h-full flex items-center justify-center">
          {hostPeer ? (
            <HostVideo peer={hostPeer} />
          ) : (
            <div className="text-center text-white">
              <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="w-12 h-12 text-gray-600" />
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
                <Share className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Right Sidebar - Product & Chat (Hidden on mobile) */}
      <div className="desktop-sidebar w-96 bg-white border-l border-gray-200 flex flex-col">
        {/* Product Card */}
        <div className="p-4 border-b border-gray-200">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Product Image */}
            <div className="aspect-square bg-gray-100 flex items-center justify-center">
              <img
                src="/api/placeholder/300/300"
                alt="Featured Product"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Crect width='300' height='300' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%236b7280' font-family='Arial, sans-serif' font-size='16'%3EProduct Image%3C/text%3E%3C/svg%3E";
                }}
              />
            </div>

            {/* Product Info */}
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">Nike Air Jordan 1 Retro High</h3>
              <p className="text-gray-600 text-sm mb-3">Classic basketball sneaker with premium leather construction</p>

              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-2xl font-bold text-gray-900">$149.99</span>
                  <span className="text-sm text-gray-500 line-through ml-2">$179.99</span>
                </div>
                <Badge className="bg-green-100 text-green-800">In Stock</Badge>
              </div>

              {/* Size Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                <select className="w-full p-2 border border-gray-300 rounded-md">
                  <option>Select Size</option>
                  <option>US 8</option>
                  <option>US 9</option>
                  <option>US 10</option>
                  <option>US 11</option>
                  <option>US 12</option>
                </select>
              </div>

              {/* Add to Cart Button */}
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold">
                Add to Cart
              </Button>

              {/* Quick Actions */}
              <div className="flex gap-2 mt-3">
                <Button variant="outline" className="flex-1">
                  <Heart className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button variant="outline" className="flex-1">
                  <Share className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Live Chat */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Live Chat</h3>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-500">{viewerCount} viewers</span>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.map((msg) => (
              <div key={msg.id} className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-blue-600">{msg.user}</span>
                  <span className="text-xs text-gray-500">{msg.timestamp}</span>
                </div>
                <p className="text-sm text-gray-700">{msg.message}</p>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                placeholder="Type a message..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button
                onClick={sendMessage}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WhatnotStyleViewer;