import { useEffect, useState } from "react";
import {
  selectIsConnectedToRoom,
  useHMSActions,
  useHMSStore
} from "@100mslive/react-sdk";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Video, AlertCircle, Info } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { hms100msService } from "../../services/hms100msService";
import HMSTokenService from "../../services/hmsTokenService";
import { getHMSAuthTokenViaEdge } from "../../services/hmsTokenClient";
import { LiveStreamingService } from "../../services/liveStreamingService";
import { extractRoomDetailsFromJWT, generateShortRoomCode } from "../../utils/jwtUtils";
import Conference from "./Conference";
import Footer from "./Footer";
import "./live-stream.css";

function LiveStream() {
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  const hmsActions = useHMSActions();
  const { user, userProfile } = useAuth();
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  
  // Database integration state
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [currentViewerId, setCurrentViewerId] = useState<string | null>(null);
  const [isInfluencer, setIsInfluencer] = useState(false);

  useEffect(() => {
    // Check if user is an influencer
    setIsInfluencer(userProfile?.role === 'influencer');
  }, [userProfile]);

  // Create database session for influencers when joining as host
  const createDatabaseSession = async (authToken: string, actualRoomId: string) => {
    if (!user?.id || !isInfluencer || !userProfile?.profile) return null;

    try {
      const influencerId = (userProfile.profile as any).id;
      const influencerName = (userProfile.profile as any)?.display_name || 
                           (userProfile.profile as any)?.first_name || 
                           'Live Stream';

      console.log('Creating database session for influencer:', influencerId);

      // Extract room details from JWT if it's a token, otherwise use the provided room ID
      let roomId = actualRoomId;
      let roomCode = actualRoomId; // Store the full room ID, not shortened version
      
      if (authToken.includes('.')) {
        // It's a JWT token, extract room details
        const roomDetails = extractRoomDetailsFromJWT(authToken);
        if (roomDetails.roomId) {
          roomId = roomDetails.roomId;
          roomCode = roomDetails.roomId; // Use full room ID for 100ms compatibility
          console.log('Extracted room details:', { roomId, roomCode });
        }
      }

      const { data: session, error } = await LiveStreamingService.createSession({
        influencerId,
        title: `${influencerName}'s Live Stream`,
        description: 'Live streaming session',
        visibility: 'public'
      });

      if (error) {
        console.error('Failed to create database session:', error);
        return null;
      }

      if (session) {
        // Start the session in the database with proper room details
        const { data: startedSession, error: startError } = await LiveStreamingService.startSession(session.id, {
          roomId: roomId,
          roomCode: roomCode.substring(0, 99), // Ensure it fits the VARCHAR(100) constraint
          streamKey: '',
          streamUrl: '',
          hlsUrl: '',
          rtmpUrl: ''
        });

        if (startError) {
          console.error('Failed to start database session:', startError);
          return session;
        }

        console.log('Database session created and started:', startedSession);
        return startedSession || session;
      }
    } catch (error) {
      console.error('Error creating database session:', error);
    }
    
    return null;
  };

  // Create viewer record when joining
  const createViewerRecord = async (sessionId: string) => {
    if (!user?.id) return null;

    try {
      console.log('Creating viewer record for session:', sessionId);

      const { data: viewer, error } = await LiveStreamingService.addViewer({
        sessionId,
        userId: user.id,
        viewerType: userProfile?.role || 'customer'
      });

      if (error) {
        console.error('Failed to create viewer record:', error);
        return null;
      }

      console.log('Viewer record created:', viewer);
      return viewer;
    } catch (error) {
      console.error('Error creating viewer record:', error);
    }

    return null;
  };

  // Find existing session for viewers
  const findExistingSession = async (authToken: string, actualRoomId: string) => {
    try {
      // Extract room details from JWT if it's a token
      let roomId = actualRoomId;
      
      if (authToken.includes('.')) {
        const roomDetails = extractRoomDetailsFromJWT(authToken);
        if (roomDetails.roomId) {
          roomId = roomDetails.roomId;
        }
      }

      // Try to find an existing live session with this room ID
      const { data: sessions, error } = await LiveStreamingService.getLiveSessions();
      
      if (!error && sessions) {
        const activeSession = sessions.find(s => 
          (s.room_id === roomId || s.room_code?.includes(roomId.substring(roomId.length - 8))) 
          && s.status === 'live'
        );
        if (activeSession) {
          console.log('Found existing session for room ID:', activeSession);
          return activeSession;
        }
      }

      console.log('No existing session found for room ID:', roomId);
      return null;
    } catch (error) {
      console.error('Error finding session:', error);
      return null;
    }
  };

  // Clean up database records when leaving
  const cleanupDatabaseRecords = async () => {
    try {
      if (currentViewerId) {
        console.log('Updating viewer status on leave...');
        // Calculate watch duration (simplified - in real app you'd track this properly)
        await LiveStreamingService.updateViewerStatus(currentViewerId, 0);
      }
      
      if (currentSessionId && isInfluencer) {
        console.log('Ending database session...');
        await LiveStreamingService.endSession(currentSessionId);
      }
    } catch (error) {
      console.error('Error cleaning up database records:', error);
    }
  };

  const joinRoom = async () => {
    if (!user?.id) return;
    
    setIsJoining(true);
    setError(null);

    try {
      // Get influencer name
      const influencerName = userProfile?.role === 'influencer' 
        ? (userProfile.profile as any)?.display_name || (userProfile.profile as any)?.first_name || 'Influencer'
        : 'Influencer';

      // For now, redirect to manual entry since room creation needs to be done via 100ms dashboard
      setShowManualEntry(true);
      setError('Please create a room in your 100ms dashboard first, then enter the room code here to start streaming.');
      
    } catch (err: any) {
      console.error('Failed to join room:', err);
      setError(err.message || 'Failed to start live stream. Please check your connection and try again.');
      // Fallback to manual entry
      setShowManualEntry(true);
    } finally {
      setIsJoining(false);
    }
  };

  const joinWithRoomCode = async () => {
    const input = roomCode.trim();

    if (!input) {
      setError('Please enter a room ID or auth token');
      return;
    }

    if (!user?.id) {
      setError('User authentication required');
      return;
    }

    setIsJoining(true);
    setError(null);

    try {
      const userName = userProfile?.role === 'influencer'
        ? (userProfile.profile as any)?.display_name || (userProfile.profile as any)?.first_name || 'Influencer'
        : userProfile?.profile ? (userProfile.profile as any)?.first_name || 'Viewer' : 'Anonymous';

      console.log('Attempting to join with input:', input);

      // If input looks like a JWT (three parts separated by '.'), use it directly
      const looksLikeJWT = input.split('.').length === 3;
      let authToken: string;
      
      if (looksLikeJWT) {
        authToken = input;
      } else {
        // Prefer server-minted token if Supabase is configured; fallback to local dev mint
        try {
          const role = isInfluencer ? 'broadcaster' : 'viewer-realtime';
          authToken = await getHMSAuthTokenViaEdge(input, role, user.id);
        } catch (e) {
          console.warn('Edge mint failed, falling back to local token generation', e);
          const role = isInfluencer ? 'broadcaster' : 'viewer-realtime';
          authToken = await HMSTokenService.generateAuthToken(input, user.id, role);
        }
      }

      console.log('Using auth token to join room');

      // Join the 100ms room first
      await hmsActions.join({
        userName,
        authToken,
        settings: {
          isAudioMuted: false,
          isVideoMuted: false,
        },
      });

      console.log('Successfully joined 100ms room');

      // Now handle database integration
      try {
        if (isInfluencer) {
          // For influencers: create a new session
          console.log('Creating database session for influencer...');
          const session = await createDatabaseSession(authToken, input);
          if (session) {
            setCurrentSessionId(session.id);
            console.log('Database session created:', session.id);
          }
        } else {
          // For viewers: find existing session
          console.log('Looking for existing session for viewer...');
          const existingSession = await findExistingSession(authToken, input);
          
          if (existingSession) {
            setCurrentSessionId(existingSession.id);
            // Create viewer record
            const viewer = await createViewerRecord(existingSession.id);
            if (viewer) {
              setCurrentViewerId(viewer.id);
              console.log('Viewer record created:', viewer.id);
            }
          } else {
            console.log('No existing session found, joining as anonymous viewer');
          }
        }
      } catch (dbError) {
        console.error('Database integration failed, but 100ms connection successful:', dbError);
        // Don't fail the entire join process if database fails
      }

    } catch (err: any) {
      console.error('Failed to join room:', err);

      if (err.message?.includes('invalid room id')) {
        setError('Invalid room ID. In 100ms Dashboard, open the room and copy its "Room ID" (not the room code). You can also paste a pre-generated auth token.');
      } else if (err.message?.includes('401') || err.message?.includes('Unauthorized')) {
        setError('Authentication failed. Verify your 100ms access key/secret and that the token is valid for this room/role.');
      } else {
        setError(err.message || 'Failed to join room. Please check the room ID or auth token and try again.');
      }
    } finally {
      setIsJoining(false);
    }
  };

  // Handle cleanup when leaving
  useEffect(() => {
    const handleUnload = async () => {
      if (isConnected) {
        await cleanupDatabaseRecords();
        hmsActions.leave();
      }
    };

    window.addEventListener('beforeunload', handleUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      // Also cleanup when component unmounts
      if (isConnected) {
        cleanupDatabaseRecords();
      }
    };
  }, [hmsActions, isConnected, currentSessionId, currentViewerId, isInfluencer]);

  if (isConnected) {
    return (
      <div className="live-stream-container">
        <Conference />
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <Video className="w-6 h-6" />
            Live Stream
          </CardTitle>
          <p className="text-muted-foreground">
            {isInfluencer ? 'Start your live streaming session' : 'Join a live stream'}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!showManualEntry ? (
            <div className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  {isInfluencer 
                    ? 'Start your live stream and connect with your audience in real-time.'
                    : 'Enter a room code to join an ongoing live stream.'
                  }
                </AlertDescription>
              </Alert>
              
              <Button 
                onClick={joinRoom} 
                disabled={isJoining || !user}
                className="w-full"
                size="lg"
              >
                {isJoining ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {isInfluencer ? 'Starting Stream...' : 'Connecting...'}
                  </>
                ) : (
                  isInfluencer ? 'Start Live Stream' : 'Join Stream'
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="roomCode">Room ID or Auth Token</Label>
                <Input
                  id="roomCode"
                  placeholder="Enter Room ID (e.g., 66b045e4e40bf3e3b54d5fef) or auth token"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                  disabled={isJoining}
                />
              </div>
              
              <Button 
                onClick={joinWithRoomCode} 
                disabled={isJoining || !roomCode.trim()}
                className="w-full"
                size="lg"
              >
                {isJoining ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Joining Room...
                  </>
                ) : (
                  'Join Room'
                )}
              </Button>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  {isInfluencer ? (
                    <>
                      Create a room in your <a href="https://dashboard.100ms.live" className="underline text-blue-600" target="_blank" rel="noopener noreferrer">100ms Dashboard</a> first, then enter the Room ID here.
                    </>
                  ) : (
                    'Get the room code from the streamer to join their live session.'
                  )}
                </AlertDescription>
              </Alert>
            </div>
          )}

          {!user && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please sign in to join live streams.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default LiveStream;
