
import React from "react";
import { Link } from "react-router-dom";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import InfluencerAvatar from "@/components/common/InfluencerAvatar";
import LiveBadge from "@/components/common/LiveBadge";
import { ArrowRight, ExternalLink, Play } from "lucide-react";

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

const liveEvents = [
  {
    id: "1",
    title: "Fashion Week Special",
    description: "Summer trends with top designers",
    image: "/lovable-uploads/f8d1a83b-970d-4d3a-966a-e0e1deaddb20.png",
    date: "Live Now",
  },
  {
    id: "2",
    title: "Tech Review Marathon",
    description: "Latest gadgets and electronics",
    image: "/lovable-uploads/7c48c057-d4b0-4193-9473-be6c8eee605c.png",
    date: "Tomorrow, 7PM",
  },
  {
    id: "3",
    title: "Beauty Masterclass",
    description: "Professional makeup techniques",
    image: "/lovable-uploads/d9b61dc1-74ba-423d-8b21-9e83e8e1ff97.png",
    date: "Apr 15, 6PM",
  },
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
];

const shortVideos = [
  {
    id: "1",
    title: "Quick Review: New Headphones",
    thumbnail: "/lovable-uploads/a758d528-4f86-47ab-8952-b84d3f2e2b2c.png",
    duration: "0:45",
  },
  {
    id: "2",
    title: "Styling Tips: Summer Outfits",
    thumbnail: "/lovable-uploads/bcb73b7f-2144-4a7d-aaca-a22c1dce107d.png",
    duration: "1:20",
  },
  {
    id: "3",
    title: "Unboxing: Limited Edition Items",
    thumbnail: "/lovable-uploads/521c827c-efca-4963-a702-2af0e528830c.png",
    duration: "0:58",
  },
];

const categories = [
  { id: "1", name: "Fashion", icon: "👕" },
  { id: "2", name: "Electronics", icon: "📱" },
  { id: "3", name: "Beauty", icon: "💄" },
  { id: "4", name: "Home", icon: "🏠" },
  { id: "5", name: "Sports", icon: "🏀" },
  { id: "6", name: "Toys", icon: "🧸" },
  { id: "7", name: "Books", icon: "📚" },
  { id: "8", name: "Food", icon: "🍔" },
];

const trendingShows = [
  {
    id: "1",
    title: "Fashion Week Highlights",
    thumbnail: "/lovable-uploads/f8d1a83b-970d-4d3a-966a-e0e1deaddb20.png",
    views: "42K",
    host: "Sophie Lin",
  },
  {
    id: "2",
    title: "Tech Talk Live",
    thumbnail: "/lovable-uploads/7c48c057-d4b0-4193-9473-be6c8eee605c.png",
    views: "38K",
    host: "Mike Chen",
  },
];

const MobileLandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Influencer stories */}
      <div className="pt-4 pb-2 overflow-x-auto scrollbar-hide flex space-x-4 px-4">
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
      
      {/* Hero carousel for live events */}
      <div className="mb-8">
        <Carousel className="w-full">
          <CarouselContent>
            {liveEvents.map((event) => (
              <CarouselItem key={event.id}>
                <div className="p-1">
                  <div className="relative aspect-[16/9] rounded-lg overflow-hidden">
                    <img 
                      src={event.image} 
                      alt={event.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center mb-1">
                        {event.date === "Live Now" ? (
                          <LiveBadge className="mb-2" />
                        ) : (
                          <span className="text-white text-xs bg-black/50 px-2 py-1 rounded-full mb-2">{event.date}</span>
                        )}
                      </div>
                      <h3 className="text-white font-bold text-xl">{event.title}</h3>
                      <p className="text-white/80 text-sm">{event.description}</p>
                      <Button variant="outline" size="sm" className="mt-2 bg-white/20 text-white border-white/30 hover:bg-white/30">
                        Watch Now
                      </Button>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
      
      {/* Live streaming section */}
      <div className="px-4 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Live now</h2>
          <Link to="/live" className="text-sm text-kein-blue flex items-center">
            See all <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {liveStreams.map((stream) => (
            <Link to={`/live/${stream.id}`} key={stream.id} className="block">
              <div className="relative rounded-lg overflow-hidden aspect-[3/4]">
                <img 
                  src={stream.thumbnail} 
                  alt={stream.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2">
                  <LiveBadge size="sm" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                  <p className="text-white text-xs">{stream.influencer}</p>
                  <h3 className="text-white text-sm font-medium line-clamp-2">{stream.title}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Upcoming streams section */}
      <div className="px-4 mb-8">
        <h2 className="text-xl font-bold mb-4">Upcoming streams</h2>
        <div className="space-y-3">
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
      
      {/* Short product videos */}
      <div className="px-4 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Quick product videos</h2>
          <Link to="/shorts" className="text-sm text-kein-blue flex items-center">
            See all <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        
        <div className="flex overflow-x-auto space-x-3 pb-2 scrollbar-hide">
          {shortVideos.map((video) => (
            <div key={video.id} className="flex-shrink-0 w-32">
              <div className="relative rounded-lg overflow-hidden aspect-[9/16]">
                <img 
                  src={video.thumbnail} 
                  alt={video.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="bg-white/30 backdrop-blur-sm rounded-full p-2">
                    <Play className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                  {video.duration}
                </div>
              </div>
              <h3 className="text-xs font-medium mt-1 line-clamp-2">{video.title}</h3>
            </div>
          ))}
        </div>
      </div>
      
      {/* Category grid */}
      <div className="px-4 mb-8">
        <h2 className="text-xl font-bold mb-4">Shop by category</h2>
        <div className="grid grid-cols-4 gap-3">
          {categories.map((category) => (
            <Link to={`/category/${category.id}`} key={category.id} className="block">
              <div className="bg-white rounded-lg p-3 shadow-sm flex flex-col items-center">
                <div className="text-2xl mb-1">{category.icon}</div>
                <span className="text-xs text-center">{category.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Trending shows */}
      <div className="px-4 mb-8">
        <h2 className="text-xl font-bold mb-4">Trending shows</h2>
        <div className="space-y-4">
          {trendingShows.map((show) => (
            <div key={show.id} className="bg-white rounded-lg overflow-hidden shadow-sm">
              <div className="relative aspect-video">
                <img 
                  src={show.thumbnail} 
                  alt={show.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                  {show.views} views
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-bold text-sm">{show.title}</h3>
                <p className="text-xs text-gray-600 mt-1">Hosted by {show.host}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-kein-blue text-white py-8 px-4">
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-4">Kein</h3>
          <p className="text-sm text-white/80 mb-4">
            Kein is a livestream shopping platform that connects customers with their favorite brands and influencers in real-time.
          </p>
          <div className="flex space-x-4 mb-6">
            <a href="#" className="text-white/80 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
            <a href="#" className="text-white/80 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a href="#" className="text-white/80 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
              </svg>
            </a>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h4 className="font-bold text-sm mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li><a href="#" className="hover:text-white">About Us</a></li>
              <li><a href="#" className="hover:text-white">Careers</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-sm mb-3">Support</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li><a href="#" className="hover:text-white">FAQ</a></li>
              <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="bg-kein-blue/30 rounded-lg p-4 mb-6">
          <h4 className="font-bold text-sm mb-2">Get the Kein app</h4>
          <p className="text-xs text-white/80 mb-3">
            Download our app for the best experience. Available on iOS and Android.
          </p>
          <div className="flex space-x-3">
            <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/20 text-xs">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-1">
                <path d="M18 21H6a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3Z"></path>
                <path d="m15 9-6 6"></path>
                <path d="m9 9 6 6"></path>
              </svg>
              App Store
            </Button>
            <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/20 text-xs">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-1">
                <path d="m12 3-1.9 5.8a2 2 0 0 1-1.9 1.2H3l5 3.5a2 2 0 0 1 .7 2.2L7 21l5-3.5a2 2 0 0 1 2.1 0l5 3.5-1.7-5.2a2 2 0 0 1 .7-2.2L23 10h-5.2a2 2 0 0 1-1.9-1.2L14 3Z"></path>
              </svg>
              Play Store
            </Button>
          </div>
        </div>
        
        <div className="text-center text-xs text-white/60 pt-4 border-t border-white/20">
          <p>© {new Date().getFullYear()} Kein. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default MobileLandingPage;
