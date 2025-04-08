
import React, { useState, useRef, useEffect } from "react";
import { Heart, MessageCircle, Share2, ShoppingBag, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// Mock data for the play feed
const playFeedData = [
  {
    id: "1",
    influencer: {
      id: "inf1",
      name: "Sophie Davis",
      avatar: "/lovable-uploads/f8d1a83b-970d-4d3a-966a-e0e1deaddb20.png",
      followers: "450K"
    },
    video: "/lovable-uploads/f8d1a83b-970d-4d3a-966a-e0e1deaddb20.png", // Using image as placeholder for video
    description: "Check out this amazing summer collection! Perfect for beach days ☀️ #SummerFashion #BeachVibes",
    likes: 15400,
    comments: 342,
    shares: 89,
    product: {
      id: "prod1",
      name: "Summer Floral Dress",
      price: 2499,
      discountPrice: 1799,
      image: "/lovable-uploads/f8d1a83b-970d-4d3a-966a-e0e1deaddb20.png"
    }
  },
  {
    id: "2",
    influencer: {
      id: "inf2",
      name: "Mike Chen",
      avatar: "/lovable-uploads/a758d528-4f86-47ab-8952-b84d3f2e2b2c.png",
      followers: "1.2M"
    },
    video: "/lovable-uploads/7c48c057-d4b0-4193-9473-be6c8eee605c.png", // Using image as placeholder for video
    description: "This gadget changed my workflow completely! Super easy to use and the battery lasts all day 🔋 #TechReview #Gadgets",
    likes: 32100,
    comments: 765,
    shares: 213,
    product: {
      id: "prod2",
      name: "Wireless Earbuds Pro",
      price: 9999,
      discountPrice: 7999,
      image: "/lovable-uploads/7c48c057-d4b0-4193-9473-be6c8eee605c.png"
    }
  },
  {
    id: "3",
    influencer: {
      id: "inf3",
      name: "Emma Lou",
      avatar: "/lovable-uploads/bcb73b7f-2144-4a7d-aaca-a22c1dce107d.png",
      followers: "780K"
    },
    video: "/lovable-uploads/d9b61dc1-74ba-423d-8b21-9e83e8e1ff97.png", // Using image as placeholder for video
    description: "These vintage-inspired pieces are absolutely gorgeous! The quality is amazing 😍 #VintageStyle #FashionFind",
    likes: 25600,
    comments: 532,
    shares: 178,
    product: {
      id: "prod3",
      name: "Vintage Collection Set",
      price: 3599,
      discountPrice: 2899,
      image: "/lovable-uploads/d9b61dc1-74ba-423d-8b21-9e83e8e1ff97.png"
    }
  }
];

// Component for a single video in the feed
const VideoItem = ({ item, isActive, onVideoEnd }) => {
  const videoRef = useRef(null);
  const [liked, setLiked] = useState(false);
  
  // Simulating video controls - in a real app, use proper video player
  useEffect(() => {
    if (isActive && videoRef.current) {
      // Play the "video" when it's active in the viewport
      console.log("Video playing:", item.id);
      
      // Simulate video ending after 10 seconds (for demo purposes)
      const timeout = setTimeout(() => {
        onVideoEnd();
      }, 10000);
      
      return () => clearTimeout(timeout);
    }
  }, [isActive, item.id, onVideoEnd]);

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num;
  };

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden snap-start">
      {/* Video content (using image as placeholder) */}
      <div ref={videoRef} className="absolute inset-0 flex items-center justify-center">
        <img 
          src={item.video} 
          alt={item.description}
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Influencer info */}
      <div className="absolute bottom-32 left-4 z-10 flex items-center">
        <img 
          src={item.influencer.avatar} 
          alt={item.influencer.name}
          className="w-10 h-10 rounded-full border-2 border-white" 
        />
        <div className="ml-2">
          <h3 className="text-white font-semibold text-sm">{item.influencer.name}</h3>
          <p className="text-white text-xs opacity-80">{item.influencer.followers} followers</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="ml-2 h-7 text-xs border-white text-white bg-transparent hover:bg-white/20"
        >
          Follow
        </Button>
      </div>
      
      {/* Description */}
      <div className="absolute bottom-20 left-4 right-20 z-10">
        <p className="text-white text-sm line-clamp-2">{item.description}</p>
      </div>
      
      {/* Interaction buttons */}
      <div className="absolute right-4 bottom-40 flex flex-col items-center space-y-6 z-10">
        <div className="flex flex-col items-center">
          <button 
            className="w-12 h-12 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-sm mb-1"
            onClick={() => setLiked(!liked)}
          >
            <Heart className={`h-6 w-6 ${liked ? 'text-red-500 fill-red-500' : 'text-white'}`} />
          </button>
          <span className="text-white text-xs">{formatNumber(item.likes)}</span>
        </div>
        
        <div className="flex flex-col items-center">
          <button className="w-12 h-12 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-sm mb-1">
            <MessageCircle className="h-6 w-6 text-white" />
          </button>
          <span className="text-white text-xs">{formatNumber(item.comments)}</span>
        </div>
        
        <div className="flex flex-col items-center">
          <button className="w-12 h-12 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-sm mb-1">
            <Share2 className="h-6 w-6 text-white" />
          </button>
          <span className="text-white text-xs">{formatNumber(item.shares)}</span>
        </div>
      </div>
      
      {/* Product card overlay */}
      <div className="absolute bottom-4 left-4 right-4 z-10">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 flex items-center">
          <img 
            src={item.product.image} 
            alt={item.product.name}
            className="w-16 h-16 rounded-md object-cover" 
          />
          <div className="ml-3 flex-1">
            <h3 className="font-medium text-sm line-clamp-1">{item.product.name}</h3>
            <div className="flex items-center mt-1">
              <span className="font-bold text-kein-coral">₹{item.product.discountPrice}</span>
              <span className="text-gray-400 text-xs line-through ml-2">₹{item.product.price}</span>
            </div>
          </div>
          <Button 
            className="bg-kein-blue text-white px-4 h-9"
          >
            <ShoppingBag className="h-4 w-4 mr-1" />
            Shop
          </Button>
        </div>
      </div>
    </div>
  );
};

const PlayFeedPage = () => {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);

  const handleScroll = (e) => {
    // Get the viewport height
    const viewportHeight = window.innerHeight;
    // Determine which video should be active based on scroll position
    const scrollTop = e.target.scrollTop;
    const index = Math.round(scrollTop / viewportHeight);
    
    if (index !== activeVideoIndex) {
      setActiveVideoIndex(index);
    }
  };

  const handleVideoEnd = () => {
    // Move to the next video when current one ends
    setActiveVideoIndex((prev) => 
      prev < playFeedData.length - 1 ? prev + 1 : 0
    );
  };

  // Auto-scroll to active video when activeVideoIndex changes
  useEffect(() => {
    const container = document.getElementById('video-container');
    if (container) {
      container.scrollTo({
        top: activeVideoIndex * window.innerHeight,
        behavior: 'smooth'
      });
    }
  }, [activeVideoIndex]);

  return (
    <div className="h-screen w-full bg-black overflow-hidden">
      {/* Back button */}
      <div className="absolute top-4 left-4 z-20">
        <Link to="/home">
          <Button 
            variant="ghost" 
            size="icon" 
            className="bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 rounded-full"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
      </div>
      
      <div 
        id="video-container"
        className="h-full overflow-y-auto snap-y snap-mandatory"
        onScroll={handleScroll}
      >
        {playFeedData.map((video, index) => (
          <VideoItem 
            key={video.id} 
            item={video} 
            isActive={index === activeVideoIndex}
            onVideoEnd={handleVideoEnd}
          />
        ))}
      </div>
    </div>
  );
};

export default PlayFeedPage;
