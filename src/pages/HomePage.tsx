import React, { useState, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Play, 
  Users, 
  Clock, 
  Heart,
  ShoppingBag,
  Zap,
  Calendar,
  Star,
  Eye
} from "lucide-react";

// Lazy load heavy components
const InfluencersRow = lazy(() => import("@/components/home/InfluencersRow"));
const HeroCarousel = lazy(() => import("@/components/home/HeroCarousel"));
const LiveNowCarousel = lazy(() => import("@/components/home/LiveNowCarousel"));
const CategoriesSection = lazy(() => import("@/components/home/CategoriesSection"));
const LiveShoppingSection = lazy(() => import("@/components/home/LiveShoppingSection"));
const BigShowBanners = lazy(() => import("@/components/home/BigShowBanners"));
const FeaturedProducts = lazy(() => import("@/components/home/FeaturedProducts"));
const UpcomingShows = lazy(() => import("@/components/home/UpcomingShows"));
const PromotionsCarousel = lazy(() => import("@/components/common/PromotionsCarousel"));
const Reels = lazy(() => import("@/components/shop/Reels"));

// Simple loading component for sections
const SectionLoader = () => (
  <div className="flex items-center justify-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
  </div>
);

const HomePage = () => {
  const { user, userProfile } = useAuth();

  // Mock data inspired by Whatnot
  const liveStreams = [
    {
      id: "1",
      title: "🔥 SNEAKER DROP - JORDAN RETRO COLLECTION",
      influencer: "culturedinsoles",
      thumbnail: "/lovable-uploads/7c48c057-d4b0-4193-9473-be6c8eee605c.png",
      viewCount: 208,
      category: "Sneakers",
      isLive: true,
      price: "₹12,999",
      originalPrice: "₹15,999"
    },
    {
      id: "2", 
      title: "📱 TECH SHOWCASE - Latest Electronics",
      influencer: "techwithsid",
      thumbnail: "/lovable-uploads/9f9465c9-14a1-4b53-b185-257751bc97c5.png",
      viewCount: 156,
      category: "Electronics",
      isLive: true,
      price: "₹8,999",
      originalPrice: "₹11,999"
    },
    {
      id: "3",
      title: "👗 FASHION FRIDAY - Designer Wear",
      influencer: "fashionista_maya", 
      thumbnail: "/lovable-uploads/f8d1a83b-970d-4d3a-966a-e0e1deaddb20.png",
      viewCount: 342,
      category: "Fashion",
      isLive: true,
      price: "₹2,499",
      originalPrice: "₹4,999"
    },
    {
      id: "4",
      title: "⚽ SPORTS GEAR - Authentic Jerseys",
      influencer: "sportscentral",
      thumbnail: "/lovable-uploads/4448d6cf-1254-4262-a2a2-cb90ffd97796.png", 
      viewCount: 89,
      category: "Sports",
      isLive: true,
      price: "₹1,999",
      originalPrice: "₹3,499"
    }
  ];

  const upcomingStreams = [
    {
      id: "1",
      title: "🎮 GAMING SETUP GIVEAWAY",
      influencer: "gamingpro_raj",
      thumbnail: "/lovable-uploads/a758d528-4f86-47ab-8952-b84d3f2e2b2c.png",
      scheduledTime: "Today 2:00 PM",
      category: "Gaming",
      expectedViewers: 500
    },
    {
      id: "2", 
      title: "💄 BEAUTY HAUL - Korean Skincare",
      influencer: "beautybypriya",
      thumbnail: "/lovable-uploads/b70ed579-11af-4d52-af36-34b2f78386c0.png",
      scheduledTime: "Today 8:00 PM", 
      category: "Beauty",
      expectedViewers: 300
    },
    {
      id: "3",
      title: "🏠 HOME DECOR - Festive Collection",
      influencer: "homedecor_expert",
      thumbnail: "/lovable-uploads/5238184c-1188-4352-a959-30046823f005.png",
      scheduledTime: "Tomorrow 6:30 PM",
      category: "Home",
      expectedViewers: 250
    }
  ];

  const categories = [
    { name: "Sneakers", color: "from-orange-500 to-red-600", icon: "👟", bgClass: "bg-gradient-to-br from-orange-500 to-red-600" },
    { name: "Electronics", color: "from-blue-500 to-purple-600", icon: "📱", bgClass: "bg-gradient-to-br from-blue-500 to-purple-600" },
    { name: "Fashion", color: "from-pink-500 to-purple-600", icon: "👗", bgClass: "bg-gradient-to-br from-pink-500 to-purple-600" }, 
    { name: "Beauty", color: "from-rose-500 to-pink-600", icon: "💄", bgClass: "bg-gradient-to-br from-rose-500 to-pink-600" },
    { name: "Sports", color: "from-emerald-500 to-teal-600", icon: "⚽", bgClass: "bg-gradient-to-br from-emerald-500 to-teal-600" },
    { name: "Gaming", color: "from-purple-500 to-indigo-600", icon: "🎮", bgClass: "bg-gradient-to-br from-purple-500 to-indigo-600" },
    { name: "Home", color: "from-amber-500 to-orange-600", icon: "🏠", bgClass: "bg-gradient-to-br from-amber-500 to-orange-600" },
    { name: "Books", color: "from-cyan-500 to-blue-600", icon: "📚", bgClass: "bg-gradient-to-br from-cyan-500 to-blue-600" }
  ];

  // Live stories data for circular story-like updates
  const liveStories = [
    {
      id: "1",
      title: "🔥 SNEAKER DROP",
      influencer: "culturedinsoles",
      thumbnail: "/lovable-uploads/7c48c057-d4b0-4193-9473-be6c8eee605c.png",
      isLive: true,
      category: "Sneakers"
    },
    {
      id: "2",
      title: "📱 TECH SHOW",
      influencer: "techwithsid", 
      thumbnail: "/lovable-uploads/9f9465c9-14a1-4b53-b185-257751bc97c5.png",
      isLive: true,
      category: "Electronics"
    },
    {
      id: "3",
      title: "👗 FASHION",
      influencer: "fashionista_maya",
      thumbnail: "/lovable-uploads/f8d1a83b-970d-4d3a-966a-e0e1deaddb20.png",
      isLive: true,
      category: "Fashion"
    },
    {
      id: "4",
      title: "💄 BEAUTY",
      influencer: "beautybypriya",
      thumbnail: "/lovable-uploads/b70ed579-11af-4d52-af36-34b2f78386c0.png",
      isLive: true,
      category: "Beauty"
    },
    {
      id: "5",
      title: "⚽ SPORTS",
      influencer: "sportscentral",
      thumbnail: "/lovable-uploads/4448d6cf-1254-4262-a2a2-cb90ffd97796.png",
      isLive: true,
      category: "Sports"
    }
  ];

  const LiveStoryCard = ({ story }: { story: any }) => (
    <div className="flex flex-col items-center space-y-2 cursor-pointer group">
      <div className="relative">
        <div className="w-16 h-16 rounded-full p-1 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500">
          <div className="w-full h-full rounded-full overflow-hidden border-2 border-white">
            <img 
              src={story.thumbnail} 
              alt={story.influencer}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        {story.isLive && (
          <div className="absolute -bottom-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
            LIVE
          </div>
        )}
      </div>
      <div className="text-center">
        <p className="text-xs font-medium text-gray-900 truncate w-16">{story.category}</p>
        <p className="text-xs text-gray-500 truncate w-16">@{story.influencer}</p>
      </div>
    </div>
  );

  const LiveStreamCard = ({ stream }: { stream: any }) => (
    <Card className="group cursor-pointer overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl">
      <div className="relative">
        <img 
          src={stream.thumbnail} 
          alt={stream.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 left-2">
          <Badge className="bg-red-600 text-white px-2 py-1 text-xs font-bold">
            <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
            Live • {stream.viewCount}
          </Badge>
        </div>
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="text-xs">
            {stream.category}
          </Badge>
        </div>
        <div className="absolute bottom-2 left-2 right-2">
          <div className="bg-black/70 rounded-lg p-2 text-white">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold">{stream.price}</span>
              <span className="text-sm line-through text-gray-300">{stream.originalPrice}</span>
            </div>
          </div>
        </div>
      </div>
      <CardContent className="p-3">
        <h3 className="font-semibold text-sm line-clamp-2 mb-1">{stream.title}</h3>
        <p className="text-xs text-gray-600 mb-2">@{stream.influencer}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <Eye className="w-3 h-3" />
            <span>{stream.viewCount} watching</span>
          </div>
          <Button size="sm" className="h-6 px-2 text-xs">
            <Play className="w-3 h-3 mr-1" />
            Watch
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const UpcomingStreamCard = ({ stream }: { stream: any }) => (
    <Card className="group cursor-pointer overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg">
      <div className="relative">
        <img 
          src={stream.thumbnail} 
          alt={stream.title}
          className="w-full h-32 object-cover"
        />
        <div className="absolute top-2 left-2">
          <Badge className="bg-blue-600 text-white px-2 py-1 text-xs font-bold">
            <Clock className="w-3 h-3 mr-1" />
            {stream.scheduledTime}
          </Badge>
        </div>
        <div className="absolute bottom-2 right-2">
          <Button size="sm" variant="secondary" className="h-6 px-2 text-xs">
            <Heart className="w-3 h-3 mr-1" />
            Remind
          </Button>
        </div>
      </div>
      <CardContent className="p-3">
        <h4 className="font-semibold text-sm line-clamp-2 mb-1">{stream.title}</h4>
        <p className="text-xs text-gray-600 mb-1">@{stream.influencer}</p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{stream.expectedViewers} expected</span>
          <Badge variant="outline" className="text-xs">{stream.category}</Badge>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Live Stories Section */}
        <Suspense fallback={<SectionLoader />}>
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
              Live Now
            </h2>
            <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
              {liveStories.map((story) => (
                <div key={story.id} className="flex-shrink-0">
                  <LiveStoryCard story={story} />
                </div>
              ))}
            </div>
          </div>
        </Suspense>

        {/* Categories Section with Lazy Loading */}
        <Suspense fallback={<SectionLoader />}>
          <div className="mb-8">
            {/* Filter Pills */}
            
            
            <h2 className="text-xl font-bold mb-4">Categories You Might Like</h2>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
              {categories.map((category) => (
                <Link key={category.name} to={`/shop/category/${category.name.toLowerCase()}`}>
                  <div className="flex-shrink-0 border border-gray-300 rounded-full px-6 py-3 flex items-center gap-2 text-gray-700 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-gray-400 cursor-pointer bg-white">
                    <span className="text-lg">{category.icon}</span>
                    <span className="text-sm font-semibold whitespace-nowrap">{category.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </Suspense>

        {/* Featured Live Streams Section */}
        <Suspense fallback={<SectionLoader />}>
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center">
                <Zap className="w-5 h-5 mr-2 text-red-500" />
                Featured Live Streams
              </h2>
              <Link to="/play">
                <Button variant="outline" size="sm">Show All</Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {liveStreams.map((stream) => (
                <LiveStreamCard key={stream.id} stream={stream} />
              ))}
            </div>
          </div>
        </Suspense>

        {/* Upcoming Section with Lazy Loading */}
        <Suspense fallback={<SectionLoader />}>
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                Upcoming Shows
              </h2>
              <Link to="/schedule">
                <Button variant="outline" size="sm">Show All</Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingStreams.map((stream) => (
                <UpcomingStreamCard key={stream.id} stream={stream} />
              ))}
            </div>
          </div>
        </Suspense>

        {/* For You Section with Lazy Loading */}
        <Suspense fallback={<SectionLoader />}>
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Star className="w-5 h-5 mr-2 text-yellow-500" />
              For You
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Mix of live and upcoming for personalized feed */}
              {[...liveStreams.slice(0, 2), ...upcomingStreams.slice(0, 2)].map((stream, index) => (
                index < 2 ? 
                  <LiveStreamCard key={`foryou-${stream.id}`} stream={stream} /> :
                  <UpcomingStreamCard key={`foryou-${stream.id}`} stream={stream} />
              ))}
            </div>
          </div>
        </Suspense>

        {/* Quick Actions with Lazy Loading */}
        <Suspense fallback={<SectionLoader />}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white">
              <CardContent className="p-6 text-center">
                <Users className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Become an Influencer</h3>
                <p className="mb-4">Start your own live shows and earn money</p>
                <Link to="/signup/influencer">
                  <Button variant="secondary">Get Started</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
              <CardContent className="p-6 text-center">
                <ShoppingBag className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Sell Your Products</h3>
                <p className="mb-4">Join as a wholesaler and reach thousands</p>
                <Link to="/signup/wholesaler">
                  <Button variant="secondary">Start Selling</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white">
              <CardContent className="p-6 text-center">
                <Heart className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Join the Community</h3>
                <p className="mb-4">Connect with sellers and buyers worldwide</p>
                <Link to="/signup/customer">
                  <Button variant="secondary">Join Now</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </Suspense>
      </div>
    </div>
  );
};

export default HomePage;
