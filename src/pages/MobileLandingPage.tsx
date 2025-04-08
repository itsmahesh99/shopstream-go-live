import React from "react";
import { Link } from "react-router-dom";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import InfluencerAvatar from "@/components/common/InfluencerAvatar";
import LiveBadge from "@/components/common/LiveBadge";
import { ArrowRight, ChevronRight, Play, Search, ShoppingBag } from "lucide-react";
import KeinLogo from "@/components/common/KeinLogo";

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

const featuredProducts = [
  {
    id: "1",
    title: "Women solid top and jeans",
    price: 999,
    discountPrice: 499,
    image: "/lovable-uploads/37fa901f-5b94-426f-ac68-07a4249941e7.png",
    category: "Clothing"
  },
  {
    id: "2",
    title: "Premium headphones with noise cancellation",
    price: 2499,
    discountPrice: 1999,
    image: "/lovable-uploads/7c48c057-d4b0-4193-9473-be6c8eee605c.png",
    category: "Electronics"
  },
  {
    id: "3",
    title: "Stylish sunglasses UV protection",
    price: 1299,
    discountPrice: 999,
    image: "/lovable-uploads/521c827c-efca-4963-a702-2af0e528830c.png",
    category: "Accessories"
  },
  {
    id: "4",
    title: "Leather handbag",
    price: 1999,
    discountPrice: 1499,
    image: "/lovable-uploads/d9b61dc1-74ba-423d-8b21-9e83e8e1ff97.png",
    category: "Accessories"
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

const MobileLandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header with Search */}
      <div className="bg-white p-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <KeinLogo className="h-10" />
        <div className="flex items-center">
          <Link to="/search" className="p-2">
            <Search className="h-5 w-5 text-gray-600" />
          </Link>
          <Link to="/cart" className="p-2 relative">
            <ShoppingBag className="h-5 w-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 bg-kein-coral text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              2
            </span>
          </Link>
        </div>
      </div>
      
      {/* Influencer stories */}
      <div className="pt-4 pb-2 overflow-x-auto scrollbar-hide flex space-x-4 px-4">
        {influencers.map((influencer) => (
          <div key={influencer.id} className="flex-shrink-0">
            <InfluencerAvatar
              src={influencer.image}
              name={influencer.name}
              isLive={influencer.isLive}
              size="md"
            />
          </div>
        ))}
      </div>
      
      {/* Hero Banner */}
      <div className="px-4 mb-8">
        <div className="relative rounded-lg overflow-hidden aspect-[16/9]">
          <img 
            src="/lovable-uploads/f570e76e-9e2b-48d1-b582-8f7c2732629c.png" 
            alt="Kein Fashion" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-white font-bold text-xl">Spring Collection</h3>
            <p className="text-white/80 text-sm mb-2">Discover the latest trends for this season</p>
            <Button size="sm" className="bg-kein-blue text-white">
              Shop Now
            </Button>
          </div>
        </div>
      </div>
      
      {/* Live streaming section */}
      <div className="px-4 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Live now</h2>
          <Link to="/play" className="text-sm text-kein-blue flex items-center">
            See all <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {liveStreams.map((stream) => (
            <Link to={`/livestream/${stream.id}`} key={stream.id} className="block">
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
      
      {/* Category grid */}
      <div className="px-4 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Categories</h2>
          <Link to="/categories" className="text-sm text-kein-blue flex items-center">
            See all <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {categories.slice(0, 8).map((category) => (
            <Link to={`/category/${category.id}`} key={category.id} className="block">
              <div className="bg-white rounded-lg p-3 shadow-sm flex flex-col items-center">
                <div className="text-2xl mb-1">{category.icon}</div>
                <span className="text-xs text-center">{category.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Featured Products */}
      <div className="px-4 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Featured Products</h2>
          <Link to="/products" className="text-sm text-kein-blue flex items-center">
            See all <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {featuredProducts.map((product) => (
            <Link to={`/product/${product.id}`} key={product.id} className="block">
              <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                <div className="relative aspect-square">
                  <img 
                    src={product.image} 
                    alt={product.title} 
                    className="w-full h-full object-cover"
                  />
                  {product.discountPrice && (
                    <div className="absolute top-2 left-2 bg-kein-coral text-white text-xs px-1.5 py-0.5 rounded">
                      {Math.round((1 - product.discountPrice / product.price) * 100)}% OFF
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-sm line-clamp-2">{product.title}</h3>
                  <div className="flex items-center mt-1">
                    {product.discountPrice ? (
                      <>
                        <span className="font-bold text-kein-coral">₹{product.discountPrice}</span>
                        <span className="text-gray-400 text-xs line-through ml-2">₹{product.price}</span>
                      </>
                    ) : (
                      <span className="font-bold">₹{product.price}</span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Featured Influencer */}
      <div className="px-4 mb-8">
        <div className="relative rounded-lg overflow-hidden bg-kein-lightblue">
          <div className="p-4 flex items-center">
            <img 
              src="/lovable-uploads/f8d1a83b-970d-4d3a-966a-e0e1deaddb20.png" 
              alt="Featured Influencer" 
              className="w-16 h-16 rounded-full object-cover border-2 border-white"
            />
            <div className="ml-4">
              <h3 className="font-bold text-lg">Sophie Lin</h3>
              <p className="text-sm text-gray-600">Fashion & Lifestyle</p>
              <Button size="sm" className="bg-kein-coral text-white">
                Follow
              </Button>
            </div>
          </div>
          <div className="px-4 pb-4 pt-2">
            <div className="flex space-x-2 overflow-x-auto scrollbar-hide pb-2">
              {featuredProducts.slice(0, 3).map((product) => (
                <div key={product.id} className="flex-shrink-0 w-24">
                  <img 
                    src={product.image} 
                    alt={product.title} 
                    className="w-full aspect-square object-cover rounded-md"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Banner for app download */}
      <div className="px-4 mb-8">
        <div className="bg-kein-blue rounded-lg p-4 text-white">
          <h3 className="font-bold text-lg">Get the Kein app</h3>
          <p className="text-sm text-white/80 mb-3">
            Download our app for the best experience
          </p>
          <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/20">
            Download Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileLandingPage;
