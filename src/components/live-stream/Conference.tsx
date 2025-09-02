import { selectPeers, useHMSStore } from "@100mslive/react-sdk";
import Peer from "./Peer";
import { useAuth } from "../../contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Users, Eye, Radio } from "lucide-react";

function Conference() {
  const peers = useHMSStore(selectPeers);
  const { userProfile } = useAuth();
  
  const isInfluencer = userProfile?.role === 'influencer';
  
  // Filter peers based on user role
  const visiblePeers = isInfluencer 
    ? peers.filter(peer => peer.isLocal) // Only show influencer's own camera
    : peers; // Show all peers for viewers

  const viewerCount = peers.filter(peer => !peer.isLocal).length;

  return (
    <div className="conference-container min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header with live status and stats */}
      <div className="relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 animate-pulse"></div>
        
        <div className="relative p-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <Radio className="w-8 h-8 text-red-500 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
            </div>
            <h1 className="text-3xl font-bold text-white">
              {isInfluencer ? 'You\'re Live!' : 'Live Stream'}
            </h1>
          </div>
          
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Badge className="bg-red-500/90 text-white border-red-400 px-4 py-2 text-sm font-semibold">
              <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
              LIVE
            </Badge>
            
            <Badge className="bg-white/10 text-white border-white/20 px-4 py-2 backdrop-blur-sm">
              <Users className="w-4 h-4 mr-2" />
              {peers.length} {peers.length === 1 ? 'participant' : 'participants'}
            </Badge>
            
            {isInfluencer && viewerCount > 0 && (
              <Badge className="bg-purple-500/90 text-white border-purple-400 px-4 py-2">
                <Eye className="w-4 h-4 mr-2" />
                {viewerCount} watching
              </Badge>
            )}
          </div>
          
          {isInfluencer && (
            <p className="text-purple-200 mt-3 text-sm">
              Share your room code with viewers to let them join
            </p>
          )}
        </div>
      </div>

      {/* Main video area */}
      <div className="flex-1 p-4">
        {visiblePeers.length > 0 ? (
          <div className="peer-grid-modern">
            {visiblePeers.map((peer) => (
              <Peer key={peer.id} peer={peer} />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="relative mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  {isInfluencer ? (
                    <Radio className="w-12 h-12 text-white" />
                  ) : (
                    <Eye className="w-12 h-12 text-white" />
                  )}
                </div>
                <div className="absolute inset-0 w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto animate-ping opacity-20"></div>
              </div>
              
              <h3 className="text-xl font-semibold text-white mb-2">
                {isInfluencer 
                  ? "Ready to Stream" 
                  : "Waiting for Stream"
                }
              </h3>
              
              <p className="text-purple-200 max-w-md mx-auto leading-relaxed">
                {isInfluencer 
                  ? "Your camera will appear here once you enable video. Make sure your camera and microphone are working properly."
                  : "The host will appear here when they start streaming. Stay tuned!"
                }
              </p>
              
              {isInfluencer && (
                <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10 backdrop-blur-sm max-w-sm mx-auto">
                  <p className="text-sm text-purple-200">
                    💡 <strong>Tip:</strong> Check your camera and microphone settings before going live
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Conference;
