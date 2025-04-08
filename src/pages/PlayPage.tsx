
import React, { useState } from "react";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import InfluencerAvatar from "@/components/common/InfluencerAvatar";

// Mock data for review videos
const reviewVideos = [
  {
    id: "1",
    influencer: {
      id: "1",
      name: "Sophie Lin",
      image: "/lovable-uploads/f8d1a83b-970d-4d3a-966a-e0e1deaddb20.png",
    },
    video: "/lovable-uploads/7c48c057-d4b0-4193-9473-be6c8eee605c.png", // Using image as placeholder
    description: "Just got this amazing summer dress! Perfect for beach days ☀️ #SummerFashion #BeachOutfit",
    likes: 1452,
    comments: 89,
    shares: 32,
    product: {
      id: "1",
      title: "Summer Dress",
      price: 1299,
      discountPrice: 999,
      image: "/lovable-uploads/37fa901f-5b94-426f-ac68-07a4249941e7.png",
    }
  },
  {
    id: "2",
    influencer: {
      id: "2",
      name: "Alex Wang",
      image: "/lovable-uploads/9f9465c9-14a1-4b53-b185-257751bc97c5.png",
    },
    video: "/lovable-uploads/d9b61dc1-74ba-423d-8b21-9e83e8e1ff97.png", // Using image as placeholder
    description: "This new leather bag is GORGEOUS! 😍 The quality is amazing and it fits all my essentials. #FashionHaul #LeatherGoods",
    likes: 2105,
    comments: 134,
    shares: 56,
    product: {
      id: "4",
      title: "Leather Bag",
      price: 2499,
      image: "/lovable-uploads/d9b61dc1-74ba-423d-8b21-9e83e8e1ff97.png",
    }
  },
  {
    id: "3",
    influencer: {
      id: "6",
      name: "Emma Lou",
      image: "/lovable-uploads/bcb73b7f-2144-4a7d-aaca-a22c1dce107d.png",
    },
    video: "/lovable-uploads/b919bc4e-ae0e-4d85-9cba-1168285b252c.png", // Using image as placeholder
    description: "The colors on this jacket are so vibrant in person! Perfect for fall 🍁 #FallFashion #DenimJacket",
    likes: 985,
    comments: 67,
    shares: 23,
    product: {
      id: "3",
      title: "Denim Jacket",
      price: 1999,
      image: "/lovable-uploads/b919bc4e-ae0e-4d85-9cba-1168285b252c.png",
    }
  }
];

const PlayPage = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [liked, setLiked] = useState<{ [key: string]: boolean }>({});
  
  const currentVideo = reviewVideos[currentVideoIndex];
  
  const handleNextVideo = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % reviewVideos.length);
  };
  
  const handlePrevVideo = () => {
    setCurrentVideoIndex((prev) => (prev - 1 + reviewVideos.length) % reviewVideos.length);
  };
  
  const toggleLike = (videoId: string) => {
    setLiked((prev) => ({
      ...prev,
      [videoId]: !prev[videoId]
    }));
  };
  
  const formatCount = (count: number): string => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count.toString();
  };

  return (
    <div className="h-screen bg-black overflow-hidden pb-16">
      {/* Video Container */}
      <div className="relative h-full w-full">
        {/* Video (using image as placeholder) */}
        <img 
          src={currentVideo.video} 
          alt="Video content"
          className="h-full w-full object-cover"
        />
        
        {/* Overlay content */}
        <div className="absolute inset-0 flex flex-col justify-between p-4">
          {/* Top section - navigation gestures */}
          <div className="flex-1" onClick={handleNextVideo}></div>
          
          {/* Bottom section with content */}
          <div className="flex items-end">
            {/* Left side - Video info */}
            <div className="flex-1 text-white pr-4">
              <div className="flex items-center mb-3">
                <InfluencerAvatar 
                  src={currentVideo.influencer.image} 
                  name={currentVideo.influencer.name}
                  size="sm"
                  className="mr-3"
                />
                <Button variant="outline" size="sm" className="text-xs text-white bg-transparent border-white">
                  Follow
                </Button>
              </div>
              
              <p className="text-sm mb-3 line-clamp-2">
                {currentVideo.description}
              </p>
            </div>
            
            {/* Right side - Action buttons */}
            <div className="flex flex-col items-center gap-4">
              <button 
                className="flex flex-col items-center" 
                onClick={() => toggleLike(currentVideo.id)}
              >
                <Heart className={`w-7 h-7 ${liked[currentVideo.id] ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                <span className="text-white text-xs mt-1">{formatCount(currentVideo.likes)}</span>
              </button>
              
              <button className="flex flex-col items-center">
                <MessageCircle className="w-7 h-7 text-white" />
                <span className="text-white text-xs mt-1">{formatCount(currentVideo.comments)}</span>
              </button>
              
              <button className="flex flex-col items-center">
                <Share2 className="w-7 h-7 text-white" />
                <span className="text-white text-xs mt-1">{formatCount(currentVideo.shares)}</span>
              </button>
            </div>
          </div>
          
          {/* Product card overlay */}
          <Card className="mt-4 p-3 flex items-center bg-white/90 backdrop-blur-sm">
            <img 
              src={currentVideo.product.image} 
              alt={currentVideo.product.title}
              className="w-16 h-16 object-cover rounded-md mr-3"
            />
            <div className="flex-1">
              <h3 className="font-medium text-sm line-clamp-1">{currentVideo.product.title}</h3>
              <div className="flex items-center mt-1">
                {currentVideo.product.discountPrice ? (
                  <>
                    <span className="font-bold text-kein-coral">₹{currentVideo.product.discountPrice}</span>
                    <span className="text-gray-400 text-xs line-through ml-2">₹{currentVideo.product.price}</span>
                  </>
                ) : (
                  <span className="font-bold">₹{currentVideo.product.price}</span>
                )}
              </div>
            </div>
            <Button size="sm" className="bg-kein-blue text-white">
              Shop
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PlayPage;
