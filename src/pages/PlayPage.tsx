
import React, { useState, useRef, useEffect } from "react";
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import InfluencerAvatar from "@/components/common/InfluencerAvatar";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const [saved, setSaved] = useState<{ [key: string]: boolean }>({});
  const videoRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Initialize the refs array
  useEffect(() => {
    videoRefs.current = videoRefs.current.slice(0, reviewVideos.length);
  }, []);

  // Handle intersection observer for videos
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Find the index of the video that is in view
            const index = videoRefs.current.findIndex(
              (ref) => ref === entry.target
            );
            if (index !== -1) {
              setCurrentVideoIndex(index);
              // If we had real videos, we would play the current video here
              console.log(`Video ${index} is now playing`);
            }
          }
        });
      },
      { threshold: 0.6 } // When 60% of the video is visible
    );

    // Observe all video elements
    videoRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      videoRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);
  
  const toggleLike = (videoId: string) => {
    setLiked((prev) => ({
      ...prev,
      [videoId]: !prev[videoId]
    }));
  };
  
  const toggleSave = (videoId: string) => {
    setSaved((prev) => ({
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
    <div className="h-screen overflow-hidden bg-black">
      <ScrollArea className="h-screen w-full snap-y snap-mandatory pb-16">
        {reviewVideos.map((video, index) => (
          <div 
            key={video.id}
            ref={(el) => (videoRefs.current[index] = el)}
            className="relative h-screen w-full snap-start snap-always"
          >
            {/* Video (using image as placeholder) */}
            <img 
              src={video.video} 
              alt={`${video.influencer.name}'s video`}
              className="h-full w-full object-cover"
            />
            
            {/* Content Overlay */}
            <div className="absolute inset-0 flex flex-col justify-between p-4">
              {/* Top Section - Influencer Info */}
              <div className="flex items-center">
                <InfluencerAvatar 
                  src={video.influencer.image} 
                  name={video.influencer.name}
                  size="sm"
                  className="mr-3"
                />
                <div className="text-white">
                  <h3 className="font-medium text-sm">{video.influencer.name}</h3>
                  <Button variant="outline" size="sm" className="mt-1 h-6 text-xs text-white bg-transparent border-white hover:bg-white/20">
                    Follow
                  </Button>
                </div>
              </div>
              
              {/* Middle Section - Empty for video visibility */}
              <div className="flex-1"></div>
              
              {/* Bottom Section - Description, Actions, Product */}
              <div className="flex items-end">
                {/* Left side - Video info */}
                <div className="flex-1 text-white pr-4">
                  <p className="text-sm mb-3 line-clamp-2">
                    {video.description}
                  </p>
                </div>
                
                {/* Right side - Action buttons */}
                <div className="flex flex-col items-center gap-6 mr-2">
                  <button 
                    className="flex flex-col items-center" 
                    onClick={() => toggleLike(video.id)}
                  >
                    <Heart className={`w-7 h-7 ${liked[video.id] ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                    <span className="text-white text-xs mt-1">{formatCount(video.likes)}</span>
                  </button>
                  
                  <button className="flex flex-col items-center">
                    <MessageCircle className="w-7 h-7 text-white" />
                    <span className="text-white text-xs mt-1">{formatCount(video.comments)}</span>
                  </button>
                  
                  <button className="flex flex-col items-center">
                    <Share2 className="w-7 h-7 text-white" />
                    <span className="text-white text-xs mt-1">{formatCount(video.shares)}</span>
                  </button>
                  
                  <button 
                    className="flex flex-col items-center"
                    onClick={() => toggleSave(video.id)}
                  >
                    <Bookmark className={`w-7 h-7 ${saved[video.id] ? 'fill-white text-white' : 'text-white'}`} />
                    <span className="text-white text-xs mt-1">Save</span>
                  </button>
                </div>
              </div>
              
              {/* Product card overlay */}
              <Card className="mt-4 p-3 flex items-center bg-white/90 backdrop-blur-sm">
                <img 
                  src={video.product.image} 
                  alt={video.product.title}
                  className="w-16 h-16 object-cover rounded-md mr-3"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-sm line-clamp-1">{video.product.title}</h3>
                  <div className="flex items-center mt-1">
                    {video.product.discountPrice ? (
                      <>
                        <span className="font-bold text-kein-coral">₹{video.product.discountPrice}</span>
                        <span className="text-gray-400 text-xs line-through ml-2">₹{video.product.price}</span>
                      </>
                    ) : (
                      <span className="font-bold">₹{video.product.price}</span>
                    )}
                  </div>
                </div>
                <Button size="sm" className="bg-kein-blue text-white">
                  Shop
                </Button>
              </Card>
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
};

export default PlayPage;
