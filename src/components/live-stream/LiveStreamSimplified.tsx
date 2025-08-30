import { useEffect, useState } from "react";
import {
  selectIsConnectedToRoom,
  useHMSActions,
  useHMSStore
} from "@100mslive/react-sdk";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Video, AlertCircle, Info, CheckCircle, Settings } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { InfluencerStreamingService } from "../../services/influencerStreamingService";
import { LiveStreamingService } from "../../services/liveStreamingService";
import { getHMSAuthTokenViaEdge } from "../../services/hmsTokenClient";
import HMSTokenService from "../../services/hmsTokenService";
import { extractRoomDetailsFromJWT } from "../../utils/jwtUtils";
import Conference from "./Conference";
import Footer from "./Footer";
import "./live-stream.css";
import { toast } from "sonner";

function LiveStreamSimplified() {
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  const hmsActions = useHMSActions();
  const { user, userProfile } = useAuth();
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [streamingConfig, setStreamingConfig] = useState<any>(null);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [streamingStatus, setStreamingStatus] = useState<any>(null);

  // Manual fallback state
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualRoomCode, setManualRoomCode] = useState("");

  const isInfluencer = userProfile?.role === 'influencer';

  useEffect(() => {
    if (isInfluencer) {
      loadStreamingConfiguration();
    }
  }, [isInfluencer, userProfile]);

  const loadStreamingConfiguration = async () => {
    try {
      setLoadingConfig(true);

      // Check for existing live session first
      if (userProfile?.profile?.id) {
        const { hasActiveStream, activeStream } = await LiveStreamingService.checkActiveLiveStreams(userProfile.profile.id);

        if (hasActiveStream && activeStream) {
          console.log('Found existing live stream:', activeStream);
          setCurrentSessionId(activeStream.id);
          // Set a flag to show "rejoin" instead of "start"
          setStreamingStatus({
            ...streamingStatus,
            hasActiveSession: true,
            activeSession: activeStream
          });
        }
      }

      const [config, status] = await Promise.all([
        InfluencerStreamingService.getStreamingConfig(),
        InfluencerStreamingService.getStreamingStatus()
      ]);

      setStreamingConfig(config);
      // Merge with existing status if we found an active session
      setStreamingStatus((prevStatus: any) => ({
        ...status,
        ...prevStatus
      }));

      if (!config && userProfile) {
        // Auto-generate config if user doesn't have one
        try {
          await InfluencerStreamingService.autoGenerateStreamingConfig(user?.id || '');
          // Reload after generation
          const newConfig = await InfluencerStreamingService.getStreamingConfig();
          setStreamingConfig(newConfig);
          toast.success('Streaming configuration set up automatically!');
        } catch (error) {
          console.error('Error auto-generating config:', error);
          toast.error('Could not set up streaming automatically. Please contact support.');
        }
      }
    } catch (error) {
      console.error('Error loading streaming config:', error);
      setError('Failed to load streaming configuration');
    } finally {
      setLoadingConfig(false);
    }
  };

  const startStreamWithAutoToken = async () => {
    if (!streamingConfig || !isInfluencer) {
      setError('Streaming configuration not available');
      return;
    }

    if (!streamingConfig.isEnabled) {
      setError('Streaming is disabled for your account. Please contact support.');
      return;
    }

    setIsJoining(true);
    setError(null);

    try {
      console.log('Starting stream with auto-token...');

      const userName = (userProfile?.profile as any)?.display_name ||
        (userProfile?.profile as any)?.first_name ||
        'Influencer';

      // Use the pre-generated auth token
      const authToken = streamingConfig.authToken;
      const roomId = streamingConfig.roomCode;

      console.log('Using room:', roomId);

      // Create database session
      const session = await createDatabaseSession(authToken, roomId);
      if (session) {
        setCurrentSessionId(session.id);
      }

      // Join HMS room with broadcaster role
      await hmsActions.join({
        userName: userName,
        authToken: authToken,
        settings: {
          isAudioMuted: true,
          isVideoMuted: false,
        },
      });

      console.log('Successfully joined room as broadcaster');

    } catch (err: any) {
      console.error('Failed to start stream:', err);
      setError(err.message || 'Failed to start live stream. Please try again.');

      // Offer manual fallback
      setShowManualEntry(true);
    } finally {
      setIsJoining(false);
    }
  };

  const joinWithManualCode = async () => {
    const input = manualRoomCode.trim();

    if (!input) {
      setError('Please enter a room ID or auth token');
      return;
    }

    setIsJoining(true);
    setError(null);

    try {
      const userName = isInfluencer
        ? (userProfile?.profile as any)?.display_name || (userProfile?.profile as any)?.first_name || 'Influencer'
        : 'Viewer';

      // If input looks like a JWT, use directly, otherwise generate token
      const looksLikeJWT = input.split('.').length === 3;
      let authToken: string;

      if (looksLikeJWT) {
        authToken = input;
      } else {
        const role = isInfluencer ? 'broadcaster' : 'viewer-realtime';
        try {
          authToken = await getHMSAuthTokenViaEdge(input, role, user?.id || '');
        } catch (e) {
          console.warn('Edge mint failed, falling back to local token generation');
          authToken = await HMSTokenService.generateAuthToken(input, user?.id || '', role);
        }
      }

      // Create database session if influencer
      if (isInfluencer) {
        const session = await createDatabaseSession(authToken, input);
        if (session) {
          setCurrentSessionId(session.id);
        }
      }

      await hmsActions.join({
        userName: userName,
        authToken: authToken,
        settings: {
          isAudioMuted: true,
          isVideoMuted: false,
        },
      });

    } catch (err: any) {
      console.error('Failed to join with manual code:', err);
      setError(err.message || 'Failed to join. Please check your room code.');
    } finally {
      setIsJoining(false);
    }
  };

  const createDatabaseSession = async (authToken: string, roomId: string) => {
    if (!user?.id || !isInfluencer || !userProfile?.profile) return null;

    try {
      const influencerId = (userProfile.profile as any).id;
      const influencerName = (userProfile.profile as any)?.display_name ||
        (userProfile.profile as any)?.first_name ||
        'Live Stream';

      console.log('Creating database session for influencer:', influencerId);

      // Extract room details from JWT if needed
      let actualRoomId = roomId;
      if (authToken.includes('.')) {
        const roomDetails = extractRoomDetailsFromJWT(authToken);
        if (roomDetails.roomId) {
          actualRoomId = roomDetails.roomId;
        }
      }

      const { data: session, error } = await LiveStreamingService.createSession({
        influencerId,
        title: `${influencerName}'s Live Stream`,
        description: 'Live streaming session',
        visibility: 'public'
      });

      if (error || !session) {
        console.error('Failed to create database session:', error);
        return null;
      }

      // Start the session
      const { data: startedSession, error: startError } = await LiveStreamingService.startSession(session.id, {
        roomId: actualRoomId,
        roomCode: actualRoomId.substring(0, 99),
        streamKey: '',
        streamUrl: '',
        hlsUrl: '',
        rtmpUrl: ''
      });

      if (startError) {
        console.error('Failed to start database session:', startError);
        return session;
      }

      return startedSession || session;
    } catch (error) {
      console.error('Error creating database session:', error);
      return null;
    }
  };

  const rejoinExistingStream = async () => {
    if (!streamingConfig || !isInfluencer || !streamingStatus?.activeSession) {
      setError('Cannot rejoin stream - session not found');
      return;
    }

    setIsJoining(true);
    setError(null);

    try {
      console.log('Rejoining existing stream:', streamingStatus.activeSession.id);

      const userName = (userProfile?.profile as any)?.display_name ||
        (userProfile?.profile as any)?.first_name ||
        'Influencer';

      // Use the existing auth token and room
      const authToken = streamingConfig.authToken;
      const roomId = streamingConfig.roomCode;

      console.log('Rejoining room:', roomId);

      // Set the current session ID
      setCurrentSessionId(streamingStatus.activeSession.id);

      // Join HMS room with broadcaster role
      await hmsActions.join({
        userName: userName,
        authToken: authToken,
        settings: {
          isAudioMuted: true,
          isVideoMuted: false,
        },
      });

      toast.success('Rejoined your live stream successfully!');

    } catch (err: any) {
      console.error('Failed to rejoin stream:', err);
      setError(err.message || 'Failed to rejoin stream. Please try again.');
    } finally {
      setIsJoining(false);
    }
  };

  const leaveRoom = async () => {
    try {
      // Clean up database session for influencers
      if (currentSessionId && isInfluencer) {
        console.log('Ending live stream session:', currentSessionId);
        await LiveStreamingService.endSession(currentSessionId);
        setCurrentSessionId(null);
        setStreamingStatus(null);

        // Show success message
        toast("Stream ended successfully!", {
          description: "Your live stream has been ended and saved.",
        });
      }

      // Leave HMS room
      await hmsActions.leave();
      setError(null);

    } catch (error) {
      console.error('Error leaving room:', error);
      toast("Error ending stream", {
        description: "There was an issue ending your stream. Please try again.",
      });
    }
  };

  if (isConnected) {
    return (
      <div className="w-full h-screen">
        <Conference />
        <Footer onLeave={leaveRoom} />
      </div>
    );
  }

  if (loadingConfig && isInfluencer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96 border bg-white">
          <CardContent className="pt-8 pb-8">
            <div className="text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 rounded-full blur opacity-20" style={{ backgroundColor: 'hsl(270.74deg 91.01% 65.1%)' }}></div>
                <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-full" style={{ backgroundColor: 'hsl(270.74deg 91.01% 65.1%)' }}>
                  <Loader2 className="h-8 w-8 animate-spin text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Setting up your streaming</h3>
              <p className="text-gray-600">Preparing your live streaming configuration...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto p-4">


        {/* Main Content Card */}
        <Card className="border bg-white overflow-hidden">
          <CardContent className="p-0">
            {/* Auto-streaming for influencers */}
            {isInfluencer && streamingConfig && !showManualEntry && (
              <div className="p-6 space-y-6">
                {/* Status Section */}
                <div className="text-center">

                  {streamingStatus?.hasActiveSession ? (
                    <div className="relative">
                      <div className="absolute inset-0 rounded-lg blur opacity-20 bg-red-400"></div>
                      <div className="relative bg-red-50 border-2 border-red-200 rounded-lg p-6">
                        <div className="flex items-center justify-center space-x-3 mb-3">
                          <div className="relative">
                            <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                            <div className="absolute inset-0 w-4 h-4 bg-red-500 rounded-full animate-ping opacity-75"></div>
                          </div>
                          <span className="text-base font-bold text-red-800">LIVE NOW</span>
                        </div>
                        <p className="text-sm text-red-700 font-medium">
                          You have an active stream running
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="absolute inset-0 rounded-lg blur opacity-20 bg-green-400"></div>
                      <div className="relative bg-green-50 border-2 border-green-200 rounded-lg p-6">
                        <div className="flex items-center justify-center space-x-3 mb-3">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="text-base font-bold text-green-800">Ready to Stream!</span>
                        </div>
                        <div className="bg-green-100 rounded-lg px-4 py-2 inline-block">
                          <p className="text-sm text-green-700 font-mono font-semibold">
                            {streamingConfig.roomCode}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="text-center px-4">
                  <p className="text-gray-600 leading-relaxed">
                    {streamingStatus?.hasActiveSession
                      ? "You can rejoin your active live stream or end it to start a new one."
                      : "Your streaming is all set up! Click the button below to start your live stream."
                    }
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                  {streamingStatus?.hasActiveSession ? (
                    <>
                      {/* Active Stream Alert */}
                      <div className="relative overflow-hidden rounded-lg">
                        <div className="absolute inset-0 bg-green-500"></div>
                        <div className="relative p-6 text-white text-center">
                          <div className="flex items-center justify-center space-x-2 mb-3">
                            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                            <span className="font-bold">YOU ARE CURRENTLY LIVE!</span>
                          </div>
                          <p className="text-sm opacity-90 mb-1">
                            Stream: "{streamingStatus.activeSession?.title}"
                          </p>
                          <p className="text-xs opacity-75">
                            Click below to rejoin your live stream
                          </p>
                        </div>
                      </div>

                      {/* Rejoin Button */}
                      <Button
                        onClick={rejoinExistingStream}
                        disabled={isJoining}
                        className="w-full h-16 bg-green-600 hover:bg-green-700 text-white font-bold text-lg rounded-lg transform transition-all duration-200 hover:scale-105 disabled:transform-none"
                        size="lg"
                      >
                        {isJoining ? (
                          <>
                            <Loader2 className="h-6 w-6 mr-3 animate-spin" />
                            Rejoining Stream...
                          </>
                        ) : (
                          <>
                            <Video className="h-6 w-6 mr-3" />
                            Rejoin Live Stream
                          </>
                        )}
                      </Button>

                      {/* End Stream Button */}
                      <Button
                        onClick={async () => {
                          if (streamingStatus?.activeSession?.id) {
                            await LiveStreamingService.endSession(streamingStatus.activeSession.id);
                            setStreamingStatus(null);
                            setCurrentSessionId(null);
                            toast.success("Stream ended. You can now start a new one.");
                            loadStreamingConfiguration();
                          }
                        }}
                        variant="outline"
                        className="w-full h-14 border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-lg font-semibold"
                        size="lg"
                      >
                        End Current Stream
                      </Button>
                    </>
                  ) : (
                    <>
                      {/* Start Stream Button */}
                      <Button
                        onClick={startStreamWithAutoToken}
                        disabled={isJoining || !streamingConfig.isEnabled}
                        className="w-full h-16 text-white font-bold text-lg rounded-lg transform transition-all duration-200 hover:scale-105 disabled:transform-none disabled:opacity-50 hover:opacity-90"
                        style={{ backgroundColor: 'hsl(270.74deg 91.01% 65.1%)' }}
                        size="lg"
                      >
                        {isJoining ? (
                          <>
                            <Loader2 className="h-6 w-6 mr-3 animate-spin" />
                            Starting Stream...
                          </>
                        ) : (
                          <>
                            <Video className="h-6 w-6 mr-3" />
                            Start Live Stream
                          </>
                        )}
                      </Button>
                    </>
                  )}

                  {/* Disabled Account Alert */}
                  {!streamingConfig.isEnabled && (
                    <Alert className="border-amber-200 bg-amber-50 rounded-lg border-2">
                      <AlertCircle className="h-5 w-5 text-amber-600" />
                      <AlertDescription className="text-amber-800 font-medium">
                        Streaming is currently disabled for your account. Please contact support to enable it.
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Manual Entry Option */}
                  <Button
                    variant="ghost"
                    onClick={() => setShowManualEntry(true)}
                    className="w-full h-12 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg font-medium"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Use Manual Room Code Instead
                  </Button>
                </div>
              </div>
            )}

            {/* Manual entry fallback or for non-influencers */}
            {(!isInfluencer || !streamingConfig || showManualEntry) && (
              <div className="p-6 space-y-6">
                {showManualEntry && streamingConfig && (
                  <Alert className="rounded-lg border-2 border-blue-200 bg-blue-50">
                    <Info className="h-5 w-5 text-blue-600" />
                    <AlertDescription className="text-blue-800 font-medium">
                      Using manual room code. Your auto-generated room code is available above.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Manual Entry</h3>
                    <p className="text-gray-600 text-sm">Enter your room details manually</p>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="roomCode" className="text-base font-semibold text-gray-700">
                      Room ID or Auth Token
                    </Label>
                    <Input
                      id="roomCode"
                      type="text"
                      placeholder="Enter Room ID (e.g., 66b045e4e40bf3e3b54d5fef) or Auth Token"
                      value={manualRoomCode}
                      onChange={(e) => setManualRoomCode(e.target.value)}
                      disabled={isJoining}
                      className="h-14 rounded-lg border-2 text-base"
                    />
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {isInfluencer
                        ? 'Create a room in your 100ms dashboard first, then enter the room code here.'
                        : 'Enter the room code shared by the streamer.'
                      }
                    </p>
                  </div>

                  <Button
                    onClick={joinWithManualCode}
                    disabled={isJoining || !manualRoomCode.trim()}
                    className="w-full h-16 text-white font-bold text-lg rounded-lg transform transition-all duration-200 hover:scale-105 disabled:transform-none disabled:opacity-50 hover:opacity-90"
                    style={{ backgroundColor: 'hsl(270.74deg 91.01% 65.1%)' }}
                  >
                    {isJoining ? (
                      <>
                        <Loader2 className="h-6 w-6 mr-3 animate-spin" />
                        Joining...
                      </>
                    ) : (
                      <>
                        <Video className="h-6 w-6 mr-3" />
                        {isInfluencer ? 'Start Stream' : 'Join Stream'}
                      </>
                    )}
                  </Button>

                  {showManualEntry && streamingConfig && (
                    <Button
                      variant="outline"
                      onClick={() => setShowManualEntry(false)}
                      className="w-full h-12 border-2 rounded-lg font-semibold"
                    >
                      Back to Auto-Setup
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Error display */}
            {error && (
              <div className="p-6 pt-0">
                <Alert variant="destructive" className="rounded-lg border-2">
                  <AlertCircle className="h-5 w-5" />
                  <AlertDescription className="font-medium">{error}</AlertDescription>
                </Alert>
              </div>
            )}

            {/* Streaming status for users without config */}
            {isInfluencer && !streamingConfig && !loadingConfig && (
              <div className="p-6 pt-0">
                <Alert className="rounded-lg border-2 border-amber-200 bg-amber-50">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                  <AlertDescription className="text-amber-800 font-medium">
                    Streaming not yet set up for your account. Please contact support or use manual room entry.
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default LiveStreamSimplified;