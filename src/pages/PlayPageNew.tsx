import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Users, Filter, Grid, List, Bell, Play, Calendar, Clock, Eye, ThumbsUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import LiveBadge from "@/components/common/LiveBadge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

// Mock data
const liveStreams = [
  {
    id: "1",
    title: "Summer Fashion Launch - Latest Collection 2025",
    host: "Sophie Davis",
    viewers: 1534,
    likes: 342,
    thumbnail: "/lovable-uploads/f8d1a83b-970d-4d3a-966a-e0e1deaddb20.png",
    hostAvatar: "/lovable-uploads/f8d1a83b-970d-4d3a-966a-e0e1deaddb20.png",
    category: "Fashion",
    duration: "45:30",
    description: "Explore the latest summer fashion trends with exclusive discounts up to 70% off.",
    tags: ["Fashion", "Summer", "Sale", "Trendy"],
  },
  {
    id: "2",
    title: "Tech Gadgets Review - Must Have Electronics",
    host: "Mike Chen",
    viewers: 856,
    likes: 198,
    thumbnail: "/lovable-uploads/7c48c057-d4b0-4193-9473-be6c8eee605c.png",
    hostAvatar: "/lovable-uploads/a758d528-4f86-47ab-8952-b84d3f2e2b2c.png",
    category: "Electronics",
    duration: "32:15",
    description: "Comprehensive review of the latest tech gadgets and smart devices.",
    tags: ["Electronics", "Tech", "Review", "Gadgets"],
  },
  {
    id: "3",
    title: "Vintage Collection Sale - Rare Finds",
    host: "Art Vintage",
    viewers: 743,
    likes: 156,
    thumbnail: "/lovable-uploads/d9b61dc1-74ba-423d-8b21-9e83e8e1ff97.png",
    hostAvatar: "/lovable-uploads/4448d6cf-1254-4262-a2a2-cb90ffd97796.png",
    category: "Fashion",
    duration: "28:42",
    description: "Discover unique vintage pieces and collectibles at amazing prices.",
    tags: ["Vintage", "Fashion", "Collectibles", "Rare"],
  },
  {
    id: "4",
    title: "Home Decor Ideas - Transform Your Space",
    host: "Emma Lou",
    viewers: 612,
    likes: 89,
    thumbnail: "/lovable-uploads/bcb73b7f-2144-4a7d-aaca-a22c1dce107d.png",
    hostAvatar: "/lovable-uploads/bcb73b7f-2144-4a7d-aaca-a22c1dce107d.png",
    category: "Home",
    duration: "38:20",
    description: "Creative home decoration ideas and furniture shopping guide.",
    tags: ["Home", "Decor", "Interior", "DIY"],
  },
  {
    id: "5",
    title: "Beauty Masterclass - Skincare Routine",
    host: "Jessica Taylor",
    viewers: 924,
    likes: 267,
    thumbnail: "/lovable-uploads/521c827c-efca-4963-a702-2af0e528830c.png",
    hostAvatar: "/lovable-uploads/521c827c-efca-4963-a702-2af0e528830c.png",
    category: "Beauty",
    duration: "41:10",
    description: "Learn professional skincare routines and product recommendations.",
    tags: ["Beauty", "Skincare", "Tutorial", "Tips"],
  },
  {
    id: "6",
    title: "Sports Equipment Sale - Fitness Gear",
    host: "David Kim",
    viewers: 445,
    likes: 78,
    thumbnail: "/lovable-uploads/b919bc4e-ae0e-4d85-9cba-1168285b252c.png",
    hostAvatar: "/lovable-uploads/0652f2bb-af03-464d-856b-32325f54b8c6.png",
    category: "Sports",
    duration: "35:55",
    description: "Best sports equipment and fitness gear for your workout routine.",
    tags: ["Sports", "Fitness", "Equipment", "Health"],
  },
];

const categories = [
  { id: "1", name: "All", icon: "🌟", count: liveStreams.length },
  { id: "2", name: "Fashion", icon: "👕", count: liveStreams.filter(s => s.category === "Fashion").length },
  { id: "3", name: "Electronics", icon: "📱", count: liveStreams.filter(s => s.category === "Electronics").length },
  { id: "4", name: "Beauty", icon: "💄", count: liveStreams.filter(s => s.category === "Beauty").length },
  { id: "5", name: "Home", icon: "🏠", count: liveStreams.filter(s => s.category === "Home").length },
  { id: "6", name: "Sports", icon: "🏀", count: liveStreams.filter(s => s.category === "Sports").length },
];

const upcomingStreams = [
  {
    id: "1",
    title: "Beauty Products Review - Korean Skincare",
    host: "Jessica Taylor",
    date: "Apr 9, 7:30 PM",
    reminder: false,
    thumbnail: "/lovable-uploads/37fa901f-5b94-426f-ac68-07a4249941e7.png",
    hostAvatar: "/lovable-uploads/521c827c-efca-4963-a702-2af0e528830c.png",
    category: "Beauty",
    expectedViewers: "800+",
    description: "Comprehensive review of trending Korean skincare products.",
  },
  {
    id: "2",
    title: "Kitchen Gadgets Sale - Smart Appliances",
    host: "David Kim",
    date: "Apr 10, 6:00 PM",
    reminder: false,
    thumbnail: "/lovable-uploads/b919bc4e-ae0e-4d85-9cba-1168285b252c.png",
    hostAvatar: "/lovable-uploads/0652f2bb-af03-464d-856b-32325f54b8c6.png",
    category: "Home",
    expectedViewers: "600+",
    description: "Latest kitchen gadgets and smart home appliances showcase.",
  },
  {
    id: "3",
    title: "Winter Fashion Preview - Cozy Collection",
    host: "Sophie Davis",
    date: "Apr 11, 8:00 PM",
    reminder: false,
    thumbnail: "/lovable-uploads/f8d1a83b-970d-4d3a-966a-e0e1deaddb20.png",
    hostAvatar: "/lovable-uploads/f8d1a83b-970d-4d3a-966a-e0e1deaddb20.png",
    category: "Fashion",
    expectedViewers: "1200+",
    description: "Preview of upcoming winter fashion collection with early bird offers.",
  },
];

const PlayPage = () => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState("1");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState("");
  const [upcomingReminders, setUpcomingReminders] = useState<string[]>([]);

  const filteredStreams = liveStreams.filter(stream => {
    const categoryMatch = selectedCategory === "1" || stream.category === categories.find(c => c.id === selectedCategory)?.name;
    const searchMatch = stream.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                       stream.host.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });

  const handleReminderToggle = (streamId: string) => {
    setUpcomingReminders(prev => 
      prev.includes(streamId) 
        ? prev.filter(id => id !== streamId)
        : [...prev, streamId]
    );
    
    const isAdding = !upcomingReminders.includes(streamId);
    toast({
      title: isAdding ? "Reminder set" : "Reminder removed",
      description: isAdding ? "You'll be notified when the stream starts" : "Reminder has been removed",
    });
  };

  return (
    <div className="min-h-screen pb-20 md:pb-8 bg-gray-50">
      {/* Mobile Header */}
      <div className="md:hidden bg-white px-4 py-4 border-b">
        <h1 className="text-xl font-bold mb-3">Kein Live</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search livestreams..."
            className="pl-10 py-2 w-full rounded-full bg-gray-50 border-gray-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block max-w-7xl mx-auto px-4 py-8">
        {/* Desktop Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Kein Live</h1>
              <p className="text-gray-600">Discover amazing live shopping experiences</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search livestreams, hosts, or categories..."
                  className="pl-10 pr-4 py-3 rounded-lg border-gray-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex items-center border rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="h-8 px-3"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="h-8 px-3"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button 
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"} 
                className={`rounded-full px-4 py-2 ${
                  selectedCategory === category.id ? "bg-kein-blue" : "border-gray-300 hover:border-kein-blue"
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
                <Badge variant="secondary" className="ml-2 text-xs">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="live" className="w-full">
          <TabsList className="grid grid-cols-2 w-96 bg-gray-100 p-1 mb-6">
            <TabsTrigger value="live" className="flex items-center">
              <Play className="h-4 w-4 mr-2" />
              Live Now ({filteredStreams.length})
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Upcoming ({upcomingStreams.length})
            </TabsTrigger>
          </TabsList>
          
          {/* Live Streams */}
          <TabsContent value="live">
            {filteredStreams.length > 0 ? (
              <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}`}>
                {filteredStreams.map((stream) => (
                  <Link to={`/livestream/${stream.id}`} key={stream.id}>
                    {viewMode === 'grid' ? (
                      /* Grid View */
                      <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                        <CardContent className="p-0">
                          <div className="relative aspect-video overflow-hidden rounded-t-lg">
                            <img 
                              src={stream.thumbnail} 
                              alt={stream.title} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            
                            <div className="absolute top-3 left-3">
                              <LiveBadge />
                            </div>
                            
                            <div className="absolute top-3 right-3 bg-black/60 rounded-full px-2 py-1">
                              <span className="text-white text-sm font-medium">{stream.duration}</span>
                            </div>
                            
                            <div className="absolute bottom-3 right-3 flex space-x-2">
                              <div className="bg-black/60 rounded-full px-2 py-1 flex items-center">
                                <Eye className="h-3 w-3 text-white mr-1" />
                                <span className="text-white text-sm">{stream.viewers}</span>
                              </div>
                              <div className="bg-black/60 rounded-full px-2 py-1 flex items-center">
                                <ThumbsUp className="h-3 w-3 text-white mr-1" />
                                <span className="text-white text-sm">{stream.likes}</span>
                              </div>
                            </div>
                            
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              <div className="bg-white/90 rounded-full p-3">
                                <Play className="h-6 w-6 text-kein-blue" />
                              </div>
                            </div>
                          </div>
                          
                          <div className="p-4">
                            <div className="flex items-start space-x-3">
                              <img 
                                src={stream.hostAvatar} 
                                alt={stream.host} 
                                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">{stream.title}</h3>
                                <p className="text-gray-600 text-sm mb-2">{stream.host}</p>
                                <p className="text-gray-500 text-xs line-clamp-2 mb-3">{stream.description}</p>
                                
                                <div className="flex flex-wrap gap-1 mb-3">
                                  {stream.tags.slice(0, 2).map((tag) => (
                                    <Badge key={tag} variant="secondary" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                                
                                <Badge className="bg-kein-blue/10 text-kein-blue hover:bg-kein-blue/20">
                                  {stream.category}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      /* List View */
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex space-x-4">
                            <div className="relative w-48 h-28 flex-shrink-0">
                              <img 
                                src={stream.thumbnail} 
                                alt={stream.title} 
                                className="w-full h-full object-cover rounded-lg"
                              />
                              <div className="absolute top-2 left-2">
                                <LiveBadge size="sm" />
                              </div>
                              <div className="absolute top-2 right-2 bg-black/60 rounded px-1 py-0.5">
                                <span className="text-white text-xs">{stream.duration}</span>
                              </div>
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h3 className="font-semibold text-lg text-gray-900 mb-1">{stream.title}</h3>
                                  <div className="flex items-center space-x-2 mb-2">
                                    <img 
                                      src={stream.hostAvatar} 
                                      alt={stream.host} 
                                      className="w-6 h-6 rounded-full object-cover"
                                    />
                                    <span className="text-gray-600">{stream.host}</span>
                                    <Badge className="bg-kein-blue/10 text-kein-blue">
                                      {stream.category}
                                    </Badge>
                                  </div>
                                  <p className="text-gray-500 text-sm mb-3 line-clamp-2">{stream.description}</p>
                                  
                                  <div className="flex flex-wrap gap-1">
                                    {stream.tags.map((tag) => (
                                      <Badge key={tag} variant="outline" className="text-xs">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                
                                <div className="text-right">
                                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                                    <div className="flex items-center">
                                      <Eye className="h-4 w-4 mr-1" />
                                      {stream.viewers}
                                    </div>
                                    <div className="flex items-center">
                                      <ThumbsUp className="h-4 w-4 mr-1" />
                                      {stream.likes}
                                    </div>
                                  </div>
                                  <Button className="bg-kein-blue hover:bg-kein-blue/90">
                                    Join Live
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">No live streams found</h3>
                <p className="text-gray-500">Try adjusting your search or category filters</p>
              </div>
            )}
          </TabsContent>
          
          {/* Upcoming Streams */}
          <TabsContent value="upcoming">
            <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}`}>
              {upcomingStreams.map((stream) => (
                <Card key={stream.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="relative aspect-video overflow-hidden rounded-t-lg">
                      <img 
                        src={stream.thumbnail} 
                        alt={stream.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 bg-kein-coral text-white text-sm px-3 py-1 rounded-full flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {stream.date}
                      </div>
                      
                      <div className="absolute bottom-3 right-3 bg-black/60 rounded-full px-2 py-1">
                        <span className="text-white text-sm">{stream.expectedViewers} expected</span>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="flex items-start space-x-3">
                        <img 
                          src={stream.hostAvatar} 
                          alt={stream.host} 
                          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">{stream.title}</h3>
                          <p className="text-gray-600 text-sm mb-2">{stream.host}</p>
                          <p className="text-gray-500 text-xs line-clamp-2 mb-3">{stream.description}</p>
                          
                          <div className="flex items-center justify-between">
                            <Badge className="bg-kein-blue/10 text-kein-blue">
                              {stream.category}
                            </Badge>
                            <Button 
                              variant={upcomingReminders.includes(stream.id) ? "default" : "outline"}
                              size="sm" 
                              onClick={(e) => {
                                e.preventDefault();
                                handleReminderToggle(stream.id);
                              }}
                              className={`h-8 text-xs ${
                                upcomingReminders.includes(stream.id) 
                                  ? "bg-kein-blue" 
                                  : "border-kein-blue text-kein-blue hover:bg-kein-blue hover:text-white"
                              }`}
                            >
                              <Bell className="h-3 w-3 mr-1" />
                              {upcomingReminders.includes(stream.id) ? "Reminded" : "Remind Me"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Mobile Categories */}
      <div className="md:hidden px-4 py-3 overflow-x-auto scrollbar-hide">
        <div className="flex space-x-3">
          {categories.map((category) => (
            <Button 
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"} 
              className={`rounded-full px-4 py-1 text-sm whitespace-nowrap ${
                selectedCategory === category.id ? "bg-kein-blue" : "border-gray-300"
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <span className="mr-1">{category.icon}</span>
              {category.name}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Mobile Content */}
      <div className="md:hidden px-4 py-2">
        <Tabs defaultValue="live" className="w-full">
          <TabsList className="grid grid-cols-2 w-full bg-gray-100 p-1 mb-3">
            <TabsTrigger value="live" className="text-sm">Live Now</TabsTrigger>
            <TabsTrigger value="upcoming" className="text-sm">Upcoming</TabsTrigger>
          </TabsList>
          
          <TabsContent value="live" className="space-y-4">
            {filteredStreams.map((stream) => (
              <Link to={`/livestream/${stream.id}`} key={stream.id} className="block">
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
                    <div className="flex-1">
                      <h3 className="font-medium text-sm line-clamp-1">{stream.title}</h3>
                      <p className="text-gray-600 text-xs mt-0.5">{stream.host}</p>
                      <Button 
                        variant={upcomingReminders.includes(stream.id) ? "default" : "outline"}
                        size="sm" 
                        className="mt-2 h-7 text-xs border-kein-blue text-kein-blue"
                        onClick={() => handleReminderToggle(stream.id)}
                      >
                        <Bell className="h-3 w-3 mr-1" />
                        {upcomingReminders.includes(stream.id) ? "Reminded" : "Set reminder"}
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
