import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Heart, MessageCircle, Share, MoreVertical, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Reel {
  id: string;
  influencer: {
    name: string;
    username: string;
    avatar: string;
    isVerified: boolean;
  };
  video: {
    url: string;
    thumbnail: string;
    duration: number;
  };
  description: string;
  likes: number;
  comments: number;
  shares: number;
  products: Array<{
    id: string;
    name: string;
    price: number;
    image: string;
  }>;
  isLiked: boolean;
  isFollowing: boolean;
}

// Mock reels data
const mockReels: Reel[] = [
  {
    id: "1",
    influencer: {
      name: "Emma Style",
      username: "@emmastyle",
      avatar: "/lovable-uploads/37fa901f-5b94-426f-ac68-07a4249941e7.png",
      isVerified: true
    },
    video: {
      url: "/videos/reel1.mp4",
      thumbnail: "/lovable-uploads/521c827c-efca-4963-a702-2af0e528830c.png",
      duration: 30
    },
    description: "Summer vibes with this amazing floral dress! 🌸 Perfect for beach days ☀️ #SummerStyle #BeachVibes",
    likes: 1234,
    comments: 89,
    shares: 45,
    products: [
      {
        id: "1",
        name: "Floral Summer Dress",
        price: 89.99,
        image: "/lovable-uploads/521c827c-efca-4963-a702-2af0e528830c.png"
      }
    ],
    isLiked: false,
    isFollowing: false
  },
  {
    id: "2",
    influencer: {
      name: "Alex Fashion",
      username: "@alexfashion",
      avatar: "/lovable-uploads/68ddc85b-2fc9-4bc2-b503-2a1a3b95821b.png",
      isVerified: true
    },
    video: {
      url: "/videos/reel2.mp4",
      thumbnail: "/lovable-uploads/b70ed579-11af-4d52-af36-34b2f78386c0.png",
      duration: 25
    },
    description: "Sneaker game strong! 👟 These new arrivals are fire 🔥 #Sneakers #StreetStyle",
    likes: 2156,
    comments: 156,
    shares: 78,
    products: [
      {
        id: "2",
        name: "Premium Sneakers",
        price: 159.99,
        image: "/lovable-uploads/b70ed579-11af-4d52-af36-34b2f78386c0.png"
      }
    ],
    isLiked: true,
    isFollowing: true
  },
  {
    id: "3",
    influencer: {
      name: "Sophia Trends",
      username: "@sophiatrends",
      avatar: "/lovable-uploads/7954c3c0-a433-4e95-9d0e-e746eb76a920.png",
      isVerified: false
    },
    video: {
      url: "/videos/reel3.mp4",
      thumbnail: "/lovable-uploads/bcb73b7f-2144-4a7d-aaca-a22c1dce107d.png",
      duration: 35
    },
    description: "Cozy sweater weather! 🧥 Perfect for autumn days 🍂 #CozyVibes #AutumnFashion",
    likes: 856,
    comments: 67,
    shares: 23,
    products: [
      {
        id: "3",
        name: "Cozy Knit Sweater",
        price: 69.99,
        image: "/lovable-uploads/bcb73b7f-2144-4a7d-aaca-a22c1dce107d.png"
      }
    ],
    isLiked: false,
    isFollowing: false
  }
];

interface ReelPlayerProps {
  reel: Reel;
  isActive: boolean;
  onLike: (reelId: string) => void;
  onFollow: (username: string) => void;
  onProductClick: (productId: string) => void;
}

const ReelPlayer: React.FC<ReelPlayerProps> = ({ reel, isActive, onLike, onFollow, onProductClick }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showProducts, setShowProducts] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isActive && isPlaying) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [isActive, isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  const formatCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <div className="relative w-full h-full bg-black rounded-lg overflow-hidden group">
      {/* Video */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        poster={reel.video.thumbnail}
        loop
        muted={isMuted}
        playsInline
        onClick={togglePlay}
        onError={() => {
          // Fallback: Hide video and show thumbnail
          if (videoRef.current) {
            videoRef.current.style.display = 'none';
          }
        }}
      >
        <source src={reel.video.url} type="video/mp4" />
      </video>

      {/* Fallback thumbnail when video fails to load */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${reel.video.thumbnail})`,
          zIndex: -1
        }}
      />

      {/* Play/Pause overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <Button
            variant="ghost"
            size="icon"
            className="w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 text-white"
            onClick={togglePlay}
          >
            <Play className="h-8 w-8 ml-1" />
          </Button>
        </div>
      )}

      {/* Top gradient overlay */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/50 to-transparent" />
      
      {/* Bottom gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/70 to-transparent" />

      {/* Influencer info */}
      <div className="absolute top-4 left-4 flex items-center space-x-3">
        <Avatar className="w-10 h-10 border-2 border-white">
          <AvatarImage src={reel.influencer.avatar} />
          <AvatarFallback>{reel.influencer.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center space-x-1">
            <span className="text-white font-semibold text-sm">{reel.influencer.name}</span>
            {reel.influencer.isVerified && (
              <Badge className="bg-blue-500 text-white text-xs px-1 py-0">✓</Badge>
            )}
          </div>
          <span className="text-white/80 text-xs">{reel.influencer.username}</span>
        </div>
        {!reel.isFollowing && (
          <Button
            size="sm"
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-black text-xs px-3 py-1"
            onClick={() => onFollow(reel.influencer.username)}
          >
            Follow
          </Button>
        )}
      </div>

      {/* Controls */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2">
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white"
          onClick={toggleMute}
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>

      {/* Actions sidebar */}
      <div className="absolute right-4 bottom-20 flex flex-col space-y-4">
        <div className="flex flex-col items-center">
          <Button
            variant="ghost"
            size="icon"
            className="w-12 h-12 rounded-full bg-black/30 hover:bg-black/50 text-white"
            onClick={() => onLike(reel.id)}
          >
            <Heart className={`h-6 w-6 ${reel.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
          <span className="text-white text-xs mt-1">{formatCount(reel.likes)}</span>
        </div>
        
        <div className="flex flex-col items-center">
          <Button
            variant="ghost"
            size="icon"
            className="w-12 h-12 rounded-full bg-black/30 hover:bg-black/50 text-white"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
          <span className="text-white text-xs mt-1">{formatCount(reel.comments)}</span>
        </div>
        
        <div className="flex flex-col items-center">
          <Button
            variant="ghost"
            size="icon"
            className="w-12 h-12 rounded-full bg-black/30 hover:bg-black/50 text-white"
          >
            <Share className="h-6 w-6" />
          </Button>
          <span className="text-white text-xs mt-1">{formatCount(reel.shares)}</span>
        </div>
      </div>

      {/* Description and products */}
      <div className="absolute bottom-4 left-4 right-20">
        <p className="text-white text-sm mb-3 line-clamp-2">{reel.description}</p>
        
        {/* Products */}
        {reel.products.length > 0 && (
          <div className="space-y-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 text-xs px-2 py-1"
              onClick={() => setShowProducts(!showProducts)}
            >
              🛍️ {reel.products.length} Product{reel.products.length > 1 ? 's' : ''}
            </Button>
            
            {showProducts && (
              <div className="space-y-2">
                {reel.products.map((product) => (
                  <Card
                    key={product.id}
                    className="bg-black/70 border-white/20 p-2 cursor-pointer hover:bg-black/80"
                    onClick={() => onProductClick(product.id)}
                  >
                    <div className="flex items-center space-x-2">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-8 h-8 rounded object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-medium truncate">{product.name}</p>
                        <p className="text-white/80 text-xs">${product.price}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

interface ReelsProps {
  onClose: () => void;
}

const Reels: React.FC<ReelsProps> = ({ onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reels, setReels] = useState(mockReels);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % reels.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + reels.length) % reels.length);
  };

  const handleLike = (reelId: string) => {
    setReels(prev => prev.map(reel => 
      reel.id === reelId 
        ? { 
            ...reel, 
            isLiked: !reel.isLiked, 
            likes: reel.isLiked ? reel.likes - 1 : reel.likes + 1 
          }
        : reel
    ));
  };

  const handleFollow = (username: string) => {
    setReels(prev => prev.map(reel => 
      reel.influencer.username === username 
        ? { ...reel, isFollowing: !reel.isFollowing }
        : reel
    ));
  };

  const handleProductClick = (productId: string) => {
    // Navigate to product page
    window.location.href = `/product/${productId}`;
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        handlePrevious();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* Close button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
        onClick={onClose}
      >
        ✕
      </Button>

      {/* Navigation arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-1/2 left-4 -translate-y-1/2 z-10 text-white hover:bg-white/20"
        onClick={handlePrevious}
        disabled={currentIndex === 0}
      >
        <ChevronUp className="h-6 w-6" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute top-1/2 right-4 -translate-y-1/2 z-10 text-white hover:bg-white/20"
        onClick={handleNext}
        disabled={currentIndex === reels.length - 1}
      >
        <ChevronDown className="h-6 w-6" />
      </Button>

      {/* Reel player */}
      <div className="w-full max-w-sm h-full max-h-[800px] mx-4">
        <ReelPlayer
          reel={reels[currentIndex]}
          isActive={true}
          onLike={handleLike}
          onFollow={handleFollow}
          onProductClick={handleProductClick}
        />
      </div>

      {/* Progress indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
        {reels.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-white' : 'bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Reels;
