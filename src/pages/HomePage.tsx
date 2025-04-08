
import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import InfluencerAvatar from "@/components/common/InfluencerAvatar";
import LiveBadge from "@/components/common/LiveBadge";
import ProductCard from "@/components/common/ProductCard";
import { Button } from "@/components/ui/button";

// Mock data
const influencers = [
  { id: "1", name: "Sophie Lin", image: "/lovable-uploads/f8d1a83b-970d-4d3a-966a-e0e1deaddb20.png", isLive: true },
  { id: "2", name: "Alex Wang", image: "/lovable-uploads/9f9465c9-14a1-4b53-b185-257751bc97c5.png", isLive: true },
  { id: "3", name: "Art vintage", image: "/lovable-uploads/4448d6cf-1254-4262-a2a2-cb90ffd97796.png", isLive: false },
  { id: "4", name: "Mike Chen", image: "/lovable-uploads/a758d528-4f86-47ab-8952-b84d3f2e2b2c.png", isLive: false },
  { id: "5", name: "Ryan Lee", image: "/lovable-uploads/0652f2bb-af03-464d-856b-32325f54b8c6.png", isLive: false },
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

const products = [
  {
    id: "1",
    title: "Women solid top and jeans",
    price: 999,
    discountPrice: 499,
    discountPercentage: 50,
    image: "/lovable-uploads/37fa901f-5b94-426f-ac68-07a4249941e7.png",
    category: "Clothing"
  },
  {
    id: "2",
    title: "Premium headphones with noise cancellation",
    price: 2499,
    discountPrice: 1999,
    discountPercentage: 20,
    image: "/lovable-uploads/7c48c057-d4b0-4193-9473-be6c8eee605c.png",
    category: "Electronics"
  },
  {
    id: "3",
    title: "Stylish sunglasses UV protection",
    price: 1299,
    discountPrice: 999,
    discountPercentage: 23,
    image: "/lovable-uploads/521c827c-efca-4963-a702-2af0e528830c.png",
    category: "Accessories"
  },
  {
    id: "4",
    title: "Casual summer dress floral pattern",
    price: 1499,
    discountPrice: 1199,
    discountPercentage: 20,
    image: "/lovable-uploads/d9b61dc1-74ba-423d-8b21-9e83e8e1ff97.png",
    category: "Clothing"
  },
];

const categories = [
  { id: "1", name: "Clothing", count: 359, image: "/lovable-uploads/f8d1a83b-970d-4d3a-966a-e0e1deaddb20.png" },
  { id: "2", name: "Shoes", count: 230, image: "/lovable-uploads/bcb73b7f-2144-4a7d-aaca-a22c1dce107d.png" },
  { id: "3", name: "Bags", count: 87, image: "/lovable-uploads/2840b6e9-4e3c-4070-8eb6-13ed21836285.png" },
  { id: "4", name: "Lingerie", count: 218, image: "/lovable-uploads/1842d9df-d938-4f42-b696-292518197638.png" },
  { id: "5", name: "Watch", count: 234, image: "/lovable-uploads/5238184c-1188-4352-a959-30046823f005.png" },
  { id: "6", name: "Hoodies", count: 218, image: "/lovable-uploads/b919bc4e-ae0e-4d85-9cba-1168285b252c.png" },
  { id: "7", name: "Mobile phones", count: 87, image: "/lovable-uploads/5112d7a4-a073-42da-9f08-2f9ad3a1c2ce.png" },
  { id: "8", name: "Laptops", count: 218, image: "/lovable-uploads/7954c3c0-a433-4e95-9d0e-e746eb76a920.png" },
];

const HomePage = () => {
  return (
    <div className="container mx-auto px-4 pb-20">
      {/* Influencers scrollable row */}
      <div className="pt-4 pb-2 overflow-x-auto scrollbar-hide flex space-x-4">
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
      
      {/* Welcome banner */}
      <h1 className="text-2xl font-bold mt-4 mb-4">Welcome to Kein!</h1>
      
      {/* Hero carousel */}
      <Carousel className="w-full mb-6">
        <CarouselContent>
          <CarouselItem>
            <div className="bg-kein-yellow rounded-xl p-6 h-40 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-1/2 h-full">
                <img
                  src="/lovable-uploads/f8d1a83b-970d-4d3a-966a-e0e1deaddb20.png"
                  alt="Kein Live"
                  className="h-full object-cover object-center"
                />
              </div>
              <div className="w-1/2">
                <h2 className="text-2xl font-bold mb-2">Kein Live</h2>
                <p className="text-sm">
                  Watch live streams of your favorite influencers and shop instantly with just one click!
                </p>
              </div>
            </div>
          </CarouselItem>
          <CarouselItem>
            <div className="bg-kein-lightblue rounded-xl p-6 h-40 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-1/2 h-full">
                <img
                  src="/lovable-uploads/7c48c057-d4b0-4193-9473-be6c8eee605c.png"
                  alt="Tech Sales"
                  className="h-full object-cover object-center"
                />
              </div>
              <div className="w-1/2">
                <h2 className="text-2xl font-bold mb-2">Tech Sales</h2>
                <p className="text-sm">
                  Exclusive discounts on the latest gadgets! Shop during live streams for extra perks.
                </p>
              </div>
            </div>
          </CarouselItem>
        </CarouselContent>
        <div className="flex justify-center mt-4">
          <div className="flex space-x-2">
            <div className="w-2 h-2 rounded-full bg-kein-blue"></div>
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          </div>
        </div>
      </Carousel>
      
      {/* Live shopping section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Live shopping</h2>
          <Link to="/live/featured" className="text-sm text-gray-600">
            Show All
          </Link>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
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
      
      {/* Categories section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Categories</h2>
        <div className="grid grid-cols-4 gap-4">
          {categories.slice(0, 8).map((category) => (
            <Link
              to={`/search?category=${category.name}`}
              key={category.id}
              className="flex flex-col items-center"
            >
              <div className="w-full aspect-square rounded-md overflow-hidden mb-2">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-sm font-medium">{category.name}</span>
              <span className="text-xs text-gray-500">{category.count}</span>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Big show banners */}
      <div className="mb-8">
        <div className="grid grid-cols-2 gap-4">
          <Link
            to="/live/special1"
            className="bg-gray-100 rounded-lg p-4 flex flex-col justify-between h-24"
          >
            <h3 className="font-bold text-sm">BIG SHOW PART 2</h3>
            <p className="text-xs">Non Stop Givey's</p>
            <span className="text-xs text-gray-500">Electronics</span>
          </Link>
          
          <Link
            to="/search?tag=vintage"
            className="bg-gray-100 rounded-lg p-4 flex flex-col justify-between h-24"
          >
            <h3 className="font-bold text-sm">FS VINTAGE SWEATSHIRTS</h3>
            <p className="text-xs">Limited Collection</p>
            <span className="text-xs text-gray-500">Clothing</span>
          </Link>
        </div>
      </div>
      
      {/* Featured products section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Featured Products</h2>
          <Link to="/search?tag=featured" className="text-sm text-gray-600">
            Show All
          </Link>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
      
      {/* Upcoming show banners */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Upcoming Shows</h2>
        <div className="space-y-4">
          <Link
            to="/live/upcoming1"
            className="bg-gray-100 rounded-lg p-4 flex flex-col justify-between h-24"
          >
            <div className="flex justify-between">
              <h3 className="font-bold text-sm">🔥 BLOWOUT SALE! 🔥</h3>
              <span className="text-xs text-gray-500">Clothing</span>
            </div>
            <p className="text-xs">DEALS & STEALS Show with John & Jane Moore</p>
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">Tomorrow, 8PM</span>
              <Button variant="ghost" size="sm" className="text-xs h-6 px-2 py-0 text-kein-blue hover:text-kein-blue hover:bg-blue-50">
                Remind me
              </Button>
            </div>
          </Link>
          
          <Link
            to="/live/upcoming2"
            className="bg-gray-100 rounded-lg p-4 flex flex-col justify-between h-24"
          >
            <div className="flex justify-between">
              <h3 className="font-bold text-sm">VEGAS BABY VEGAS!</h3>
              <span className="text-xs text-gray-500">Fashion</span>
            </div>
            <p className="text-xs">Vegas Deal Specials with Sarah</p>
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">Apr 10, 7PM</span>
              <Button variant="ghost" size="sm" className="text-xs h-6 px-2 py-0 text-kein-blue hover:text-kein-blue hover:bg-blue-50">
                Remind me
              </Button>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
