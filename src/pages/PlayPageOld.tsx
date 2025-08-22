
import React from "react";
import { Link } from "react-router-dom";
import { Search, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import LiveBadge from "@/components/common/LiveBadge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data
const liveStreams = [
  {
    id: "1",
    title: "Summer Fashion Launch",
    host: "Sophie Davis",
    viewers: 1534,
    thumbnail: "/lovable-uploads/f8d1a83b-970d-4d3a-966a-e0e1deaddb20.png",
    hostAvatar: "/lovable-uploads/f8d1a83b-970d-4d3a-966a-e0e1deaddb20.png",
    category: "Fashion",
  },
  {
    id: "2",
    title: "Tech Gadgets Review",
    host: "Mike Chen",
    viewers: 856,
    thumbnail: "/lovable-uploads/7c48c057-d4b0-4193-9473-be6c8eee605c.png",
    hostAvatar: "/lovable-uploads/a758d528-4f86-47ab-8952-b84d3f2e2b2c.png",
    category: "Electronics",
  },
  {
    id: "3",
    title: "Vintage Collection Sale",
    host: "Art Vintage",
    viewers: 743,
    thumbnail: "/lovable-uploads/d9b61dc1-74ba-423d-8b21-9e83e8e1ff97.png",
    hostAvatar: "/lovable-uploads/4448d6cf-1254-4262-a2a2-cb90ffd97796.png",
    category: "Fashion",
  },
  {
    id: "4",
    title: "Home Decor Ideas",
    host: "Emma Lou",
    viewers: 612,
    thumbnail: "/lovable-uploads/bcb73b7f-2144-4a7d-aaca-a22c1dce107d.png",
    hostAvatar: "/lovable-uploads/bcb73b7f-2144-4a7d-aaca-a22c1dce107d.png",
    category: "Home",
  },
];

const categories = [
  { id: "1", name: "All", icon: "🌟" },
  { id: "2", name: "Fashion", icon: "👕" },
  { id: "3", name: "Electronics", icon: "📱" },
  { id: "4", name: "Beauty", icon: "💄" },
  { id: "5", name: "Home", icon: "🏠" },
  { id: "6", name: "Sports", icon: "🏀" },
];

const upcomingStreams = [
  {
    id: "1",
    title: "Beauty Products Review",
    host: "Jessica Taylor",
    date: "Apr 9, 7:30 PM",
    thumbnail: "/lovable-uploads/37fa901f-5b94-426f-ac68-07a4249941e7.png",
    hostAvatar: "/lovable-uploads/521c827c-efca-4963-a702-2af0e528830c.png",
  },
  {
    id: "2",
    title: "Kitchen Gadgets Sale",
    host: "David Kim",
    date: "Apr 10, 6:00 PM",
    thumbnail: "/lovable-uploads/b919bc4e-ae0e-4d85-9cba-1168285b252c.png",
    hostAvatar: "/lovable-uploads/0652f2bb-af03-464d-856b-32325f54b8c6.png",
  },
];

const PlayPage = () => {
  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      {/* Header with search */}
      <div className="bg-white px-4 py-4 border-b">
        <h1 className="text-xl font-bold mb-3">Kein Live</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search livestreams..."
            className="pl-10 py-2 w-full rounded-full bg-gray-50 border-gray-200"
          />
        </div>
      </div>
      
      {/* Categories */}
      <div className="px-4 py-3 overflow-x-auto scrollbar-hide">
        <div className="flex space-x-3">
          {categories.map((category) => (
            <Button 
              key={category.id}
              variant={category.id === "1" ? "default" : "outline"} 
              className={`rounded-full px-4 py-1 text-sm whitespace-nowrap ${
                category.id === "1" ? "bg-kein-blue" : "border-gray-300"
              }`}
            >
              <span className="mr-1">{category.icon}</span>
              {category.name}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Content tabs */}
      <div className="px-4 py-2">
        <Tabs defaultValue="live" className="w-full">
          <TabsList className="grid grid-cols-2 w-full bg-gray-100 p-1 mb-3">
            <TabsTrigger value="live" className="text-sm">Live Now</TabsTrigger>
            <TabsTrigger value="upcoming" className="text-sm">Upcoming</TabsTrigger>
          </TabsList>
          
          <TabsContent value="live" className="space-y-4">
            {liveStreams.map((stream) => (
              <Link to={`/kein-live`} key={stream.id} className="block">
                <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                  <div className="relative aspect-video">
                    <img 
                      src={stream.thumbnail} 
                      alt={stream.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <LiveBadge />
                    </div>
                    
                    <div className="absolute bottom-2 right-2 bg-black/60 rounded-full px-2 py-0.5 flex items-center">
                      <Users className="h-3 w-3 text-white mr-1" />
                      <span className="text-white text-xs">{stream.viewers}</span>
                    </div>
                  </div>
                  
                  <div className="p-3">
                    <div className="flex items-start">
                      <img 
                        src={stream.hostAvatar} 
                        alt={stream.host} 
                        className="w-8 h-8 rounded-full object-cover mr-2"
                      />
                      <div>
                        <h3 className="font-medium text-sm line-clamp-1">{stream.title}</h3>
                        <p className="text-gray-600 text-xs mt-0.5">{stream.host}</p>
                        <div className="flex items-center mt-1">
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                            {stream.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </TabsContent>
          
          <TabsContent value="upcoming" className="space-y-4">
            {upcomingStreams.map((stream) => (
              <div key={stream.id} className="bg-white rounded-lg overflow-hidden shadow-sm">
                <div className="relative aspect-video">
                  <img 
                    src={stream.thumbnail} 
                    alt={stream.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-kein-coral text-white text-xs px-2 py-0.5 rounded-full">
                    {stream.date}
                  </div>
                </div>
                
                <div className="p-3">
                  <div className="flex items-start">
                    <img 
                      src={stream.hostAvatar} 
                      alt={stream.host} 
                      className="w-8 h-8 rounded-full object-cover mr-2"
                    />
                    <div>
                      <h3 className="font-medium text-sm line-clamp-1">{stream.title}</h3>
                      <p className="text-gray-600 text-xs mt-0.5">{stream.host}</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2 h-7 text-xs border-kein-blue text-kein-blue"
                      >
                        Set reminder
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PlayPage;
