
import React from "react";
import { Link } from "react-router-dom";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import InfluencerAvatar from "@/components/common/InfluencerAvatar";
import LiveBadge from "@/components/common/LiveBadge";
import { Button } from "@/components/ui/button";

// Mock data
const influencers = [
  { id: "1", name: "Sophie Lin", image: "/lovable-uploads/f8d1a83b-970d-4d3a-966a-e0e1deaddb20.png", isLive: true },
  { id: "2", name: "Alex Wang", image: "/lovable-uploads/9f9465c9-14a1-4b53-b185-257751bc97c5.png", isLive: true },
  { id: "3", name: "Art vintage", image: "/lovable-uploads/4448d6cf-1254-4262-a2a2-cb90ffd97796.png", isLive: false },
  { id: "4", name: "Mike Chen", image: "/lovable-uploads/a758d528-4f86-47ab-8952-b84d3f2e2b2c.png", isLive: false },
  { id: "5", name: "Ryan Lee", image: "/lovable-uploads/0652f2bb-af03-464d-856b-32325f54b8c6.png", isLive: false },
  { id: "6", name: "Emma Lou", image: "/lovable-uploads/bcb73b7f-2144-4a7d-aaca-a22c1dce107d.png", isLive: true },
  { id: "7", name: "David Kim", image: "/lovable-uploads/521c827c-efca-4963-a702-2af0e528830c.png", isLive: false },
];

const liveStreams = [
  {
    id: "1",
    title: "Tech Review - Latest smartphones",
    influencer: "Mike Chen",
    thumbnail: "/lovable-uploads/7c48c057-d4b0-4193-9473-be6c8eee605c.png",
    viewCount: 2530,
    isLive: true,
  },
  {
    id: "2",
    title: "Women's Fashion Summer Collection",
    influencer: "Sophie Lin",
    thumbnail: "/lovable-uploads/f8d1a83b-970d-4d3a-966a-e0e1deaddb20.png",
    viewCount: 1845,
    isLive: true,
  },
  {
    id: "3",
    title: "Beauty Product Reviews",
    influencer: "Emma Lou",
    thumbnail: "/lovable-uploads/d9b61dc1-74ba-423d-8b21-9e83e8e1ff97.png",
    viewCount: 1267,
    isLive: true,
  },
];

const KeinLivePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Influencers scrollable row */}
      <div className="pt-4 pb-2 overflow-x-auto scrollbar-hide flex space-x-4 px-4">
        <div className="flex-shrink-0">
          <div className="flex flex-col items-center justify-center w-16 h-16 rounded-full bg-gray-100 border border-dashed border-gray-300">
            <span className="text-2xl text-gray-400">+</span>
          </div>
          <span className="text-xs mt-2 text-center">Follow</span>
        </div>
        
        {influencers.map((influencer) => (
          <div key={influencer.id} className="flex-shrink-0">
            <InfluencerAvatar
              src={influencer.image}
              name={influencer.name}
              isLive={influencer.isLive}
            />
          </div>
        ))}
      </div>
      
      {/* Hero banner */}
      <div className="bg-kein-blue text-white p-6 mb-6">
        <h1 className="text-2xl font-bold mb-2">Kein Live</h1>
        <p className="text-lg">Watch live streams and shop instantly</p>
      </div>
      
      {/* Live shopping section */}
      <div className="px-4 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Live shopping</h2>
          <Link to="/live/all" className="text-sm text-kein-blue">
            View all
          </Link>
        </div>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {liveStreams.map((stream) => (
            <Link to={`/live/${stream.id}`} key={stream.id} className="relative rounded-lg overflow-hidden aspect-[3/4] shadow-md">
              <img 
                src={stream.thumbnail} 
                alt={stream.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2">
                <LiveBadge />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                <div className="flex items-center mb-1">
                  <span className="text-white text-xs mr-2">
                    <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                    {stream.viewCount.toLocaleString()}
                  </span>
                </div>
                <h3 className="text-white font-medium text-sm line-clamp-2">
                  {stream.title}
                </h3>
                <p className="text-white/80 text-xs mt-1">
                  {stream.influencer}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Featured creators section */}
      <div className="px-4 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Featured creators</h2>
          <Link to="/creators" className="text-sm text-kein-blue">
            View all
          </Link>
        </div>
        
        <Carousel className="w-full">
          <CarouselContent>
            {influencers.filter(i => i.isLive).map((influencer) => (
              <CarouselItem key={influencer.id} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5">
                <div className="p-1">
                  <Link to={`/creator/${influencer.id}`} className="block">
                    <div className="relative aspect-square rounded-lg overflow-hidden">
                      <img 
                        src={influencer.image} 
                        alt={influencer.name} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-2 left-2">
                        <h3 className="text-white font-medium text-sm">{influencer.name}</h3>
                      </div>
                      {influencer.isLive && (
                        <div className="absolute top-2 right-2">
                          <LiveBadge size="sm" />
                        </div>
                      )}
                    </div>
                  </Link>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
      
      {/* Upcoming streams section */}
      <div className="px-4 mb-8">
        <h2 className="text-xl font-bold mb-4">Upcoming streams</h2>
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex justify-between">
              <h3 className="font-bold text-sm">Fashion Week Special</h3>
              <span className="text-xs text-gray-500">Fashion</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">Summer Collection Reveal with Sophie Lin</p>
            <div className="flex justify-between mt-2">
              <span className="text-xs text-gray-500">Tomorrow, 7PM</span>
              <Button variant="ghost" size="sm" className="text-xs h-6 px-2 py-0 text-kein-blue hover:text-kein-blue hover:bg-blue-50">
                Remind me
              </Button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex justify-between">
              <h3 className="font-bold text-sm">Tech Talk Live</h3>
              <span className="text-xs text-gray-500">Electronics</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">Latest Gadget Reviews with Mike Chen</p>
            <div className="flex justify-between mt-2">
              <span className="text-xs text-gray-500">Apr 12, 8PM</span>
              <Button variant="ghost" size="sm" className="text-xs h-6 px-2 py-0 text-kein-blue hover:text-kein-blue hover:bg-blue-50">
                Remind me
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeinLivePage;
