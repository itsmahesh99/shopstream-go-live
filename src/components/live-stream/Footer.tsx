import { useAVToggle, useHMSActions } from "@100mslive/react-sdk";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Video, VideoOff, PhoneOff, Settings, Share2, MessageCircle } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

interface FooterProps {
  onLeave?: () => Promise<void>;
}

function Footer({ onLeave }: FooterProps) {
  const {
    isLocalAudioEnabled,
    isLocalVideoEnabled,
    toggleAudio,
    toggleVideo
  } = useAVToggle();
  
  const hmsActions = useHMSActions();
  const { userProfile } = useAuth();
  const isInfluencer = userProfile?.role === 'influencer';

  const handleLeave = async () => {
    try {
      // If parent component provides onLeave handler (for proper cleanup), use it
      if (onLeave) {
        await onLeave();
      } else {
        // Fallback: just leave HMS room (for viewers)
        await hmsActions.leave();
      }
    } catch (error) {
      console.error('Error leaving room:', error);
    }
  };

  return (
    <div className="relative">
      {/* Background with blur effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent backdrop-blur-md"></div>
      
      <div className="relative p-6">
        <div className="max-w-4xl mx-auto">
          {/* Main controls */}
          <div className="flex items-center justify-center gap-4 mb-4">
            {/* Audio control */}
            <Button
              variant="ghost"
              size="lg"
              onClick={toggleAudio}
              className={`relative group h-14 w-14 rounded-full transition-all duration-200 hover:scale-110 ${
                isLocalAudioEnabled 
                  ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20' 
                  : 'bg-red-500/90 hover:bg-red-600 text-white border border-red-400'
              }`}
            >
              {isLocalAudioEnabled ? (
                <Mic className="w-6 h-6" />
              ) : (
                <MicOff className="w-6 h-6" />
              )}
              
              {/* Tooltip */}
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {isLocalAudioEnabled ? 'Mute' : 'Unmute'}
              </div>
            </Button>

            {/* Video control */}
            <Button
              variant="ghost"
              size="lg"
              onClick={toggleVideo}
              className={`relative group h-14 w-14 rounded-full transition-all duration-200 hover:scale-110 ${
                isLocalVideoEnabled 
                  ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20' 
                  : 'bg-red-500/90 hover:bg-red-600 text-white border border-red-400'
              }`}
            >
              {isLocalVideoEnabled ? (
                <Video className="w-6 h-6" />
              ) : (
                <VideoOff className="w-6 h-6" />
              )}
              
              {/* Tooltip */}
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {isLocalVideoEnabled ? 'Stop Video' : 'Start Video'}
              </div>
            </Button>

            {/* Leave button */}
            <Button
              variant="ghost"
              size="lg"
              onClick={handleLeave}
              className="relative group h-14 w-14 rounded-full bg-red-500/90 hover:bg-red-600 text-white border border-red-400 transition-all duration-200 hover:scale-110"
            >
              <PhoneOff className="w-6 h-6" />
              
              {/* Tooltip */}
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {isInfluencer ? 'End Stream' : 'Leave'}
              </div>
            </Button>
          </div>

          {/* Secondary controls */}
          <div className="flex items-center justify-center gap-3">
            {isInfluencer && (
              <>
                {/* Share button for influencers */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative group h-10 px-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full transition-all duration-200"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  <span className="text-sm">Share</span>
                </Button>

                {/* Settings button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative group h-10 px-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full transition-all duration-200"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  <span className="text-sm">Settings</span>
                </Button>
              </>
            )}

            {!isInfluencer && (
              /* Chat button for viewers */
              <Button
                variant="ghost"
                size="sm"
                className="relative group h-10 px-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full transition-all duration-200"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                <span className="text-sm">Chat</span>
              </Button>
            )}
          </div>

          {/* Status indicator */}
          <div className="text-center mt-4">
            <div className="inline-flex items-center gap-2 text-white/70 text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Connected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
