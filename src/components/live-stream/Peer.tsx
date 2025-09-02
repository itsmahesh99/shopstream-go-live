import { useVideo } from "@100mslive/react-sdk";
import { HMSPeer } from "@100mslive/react-sdk";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Video, VideoOff, Crown, User } from "lucide-react";

interface PeerProps {
  peer: HMSPeer;
}

function Peer({ peer }: PeerProps) {
  const { videoRef } = useVideo({
    trackId: peer.videoTrack
  });

  const isHost = peer.roleName?.toLowerCase().includes('broadcaster') || 
                 peer.roleName?.toLowerCase().includes('host');

  return (
    <div className="relative group">
      {/* Main video container */}
      <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10 transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-purple-500/20">
        
        {/* Video element */}
        <div className="relative aspect-video">
          {peer.videoTrack ? (
            <video
              ref={videoRef}
              className={`w-full h-full object-cover ${peer.isLocal ? "mirror" : ""}`}
              autoPlay
              muted={peer.isLocal}
              playsInline
            />
          ) : (
            // No video placeholder
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="w-8 h-8 text-white" />
                </div>
                <p className="text-white font-medium">{peer.name}</p>
                <p className="text-gray-400 text-sm">Camera off</p>
              </div>
            </div>
          )}
          
          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
        </div>

        {/* User info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Host badge */}
              {isHost && (
                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 px-2 py-1">
                  <Crown className="w-3 h-3 mr-1" />
                  Host
                </Badge>
              )}
              
              {/* User name */}
              <div className="bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium border border-white/20">
                {peer.name} {peer.isLocal ? "(You)" : ""}
              </div>
            </div>

            {/* Audio/Video status indicators */}
            <div className="flex items-center gap-2">
              {/* Audio indicator */}
              <div className={`p-2 rounded-full backdrop-blur-sm border transition-all duration-200 ${
                peer.audioTrack 
                  ? 'bg-green-500/80 border-green-400 text-white' 
                  : 'bg-red-500/80 border-red-400 text-white'
              }`}>
                {peer.audioTrack ? (
                  <Mic className="w-3 h-3" />
                ) : (
                  <MicOff className="w-3 h-3" />
                )}
              </div>

              {/* Video indicator */}
              <div className={`p-2 rounded-full backdrop-blur-sm border transition-all duration-200 ${
                peer.videoTrack 
                  ? 'bg-green-500/80 border-green-400 text-white' 
                  : 'bg-red-500/80 border-red-400 text-white'
              }`}>
                {peer.videoTrack ? (
                  <Video className="w-3 h-3" />
                ) : (
                  <VideoOff className="w-3 h-3" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Live indicator for local peer */}
        {peer.isLocal && (
          <div className="absolute top-4 left-4">
            <Badge className="bg-red-500/90 text-white border-red-400 animate-pulse">
              <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
              YOU'RE LIVE
            </Badge>
          </div>
        )}

        {/* Connection quality indicator */}
        <div className="absolute top-4 right-4">
          <div className="flex items-center gap-1">
            <div className="w-1 h-3 bg-green-400 rounded-full"></div>
            <div className="w-1 h-4 bg-green-400 rounded-full"></div>
            <div className="w-1 h-2 bg-green-400 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Peer;
