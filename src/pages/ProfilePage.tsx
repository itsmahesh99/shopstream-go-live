
import React from "react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Bell, ChevronRight, Settings } from "lucide-react";
import InfluencerAvatar from "@/components/common/InfluencerAvatar";
import ProductCard from "@/components/common/ProductCard";
import { useToast } from "@/hooks/use-toast";

// Mock data
const user = {
  name: "Romina",
  image: "/lovable-uploads/f8d1a83b-970d-4d3a-966a-e0e1deaddb20.png",
};

const following = [
  { id: "1", name: "Sophie Lin", image: "/lovable-uploads/f8d1a83b-970d-4d3a-966a-e0e1deaddb20.png", isLive: true },
  { id: "2", name: "Alex Wang", image: "/lovable-uploads/9f9465c9-14a1-4b53-b185-257751bc97c5.png", isLive: false },
  { id: "3", name: "Art vintage", image: "/lovable-uploads/4448d6cf-1254-4262-a2a2-cb90ffd97796.png", isLive: false },
  { id: "4", name: "Mike Chen", image: "/lovable-uploads/a758d528-4f86-47ab-8952-b84d3f2e2b2c.png", isLive: false },
  { id: "5", name: "Ryan Lee", image: "/lovable-uploads/0652f2bb-af03-464d-856b-32325f54b8c6.png", isLive: false },
];

const savedProducts = [
  {
    id: "1",
    title: "Women solid top and jeans",
    price: 999,
    image: "/lovable-uploads/37fa901f-5b94-426f-ac68-07a4249941e7.png",
    category: "Clothing"
  },
  {
    id: "2",
    title: "Women solid top and jeans",
    price: 999,
    image: "/lovable-uploads/f8d1a83b-970d-4d3a-966a-e0e1deaddb20.png",
    category: "Clothing"
  },
  {
    id: "3",
    title: "Women solid top and jeans",
    price: 999,
    image: "/lovable-uploads/d9b61dc1-74ba-423d-8b21-9e83e8e1ff97.png",
    category: "Clothing"
  },
  {
    id: "4",
    title: "Women solid top and jeans",
    price: 999,
    image: "/lovable-uploads/7c48c057-d4b0-4193-9473-be6c8eee605c.png",
    category: "Clothing"
  },
  {
    id: "5",
    title: "Women solid top and jeans",
    price: 999,
    image: "/lovable-uploads/bcb73b7f-2144-4a7d-aaca-a22c1dce107d.png",
    category: "Clothing"
  },
  {
    id: "6",
    title: "Women solid top and jeans",
    price: 999,
    image: "/lovable-uploads/b919bc4e-ae0e-4d85-9cba-1168285b252c.png",
    category: "Clothing"
  },
];

const ProfilePage = () => {
  const { toast } = useToast();
  
  const handleBecomeSeller = () => {
    toast({
      title: "Become a seller",
      description: "Taking you to the seller onboarding page",
    });
  };

  return (
    <div className="pb-20">
      {/* Profile header */}
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center">
          <img
            src={user.image}
            alt={user.name}
            className="h-10 w-10 rounded-full object-cover mr-3"
          />
          <h1 className="text-xl font-bold">Hello, {user.name}!</h1>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline"
            className="border-kein-blue text-kein-blue"
            onClick={handleBecomeSeller}
          >
            Become seller
          </Button>
          <Link to="/settings" className="text-gray-500">
            <Settings className="h-5 w-5" />
          </Link>
        </div>
      </div>
      
      {/* Announcements */}
      <div className="px-4 mb-4">
        <div className="bg-blue-50 rounded-lg px-4 py-3 flex items-start justify-between">
          <div>
            <h3 className="font-medium text-sm">Announcement</h3>
            <p className="text-xs text-gray-600 mt-1">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt labore et dolore
            </p>
          </div>
          <Button size="icon" variant="ghost" className="h-5 w-5 text-gray-400">
            <Bell className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Order status tabs */}
      <div className="px-4 mb-6">
        <h3 className="font-medium mb-3">My Orders</h3>
        <div className="flex justify-between bg-gray-100 rounded-lg p-1">
          <Link 
            to="/orders?status=to-pay"
            className="flex-1 py-2 px-1 text-center text-sm font-medium text-kein-blue"
          >
            To Pay
          </Link>
          <Link 
            to="/orders?status=to-receive"
            className="flex-1 py-2 px-1 text-center text-sm text-gray-600"
          >
            To Receive
          </Link>
          <Link 
            to="/orders?status=to-review"
            className="flex-1 py-2 px-1 text-center text-sm text-gray-600"
          >
            To Review
          </Link>
        </div>
      </div>
      
      {/* Following */}
      <div className="px-4 mb-6">
        <h3 className="font-medium mb-3">Following</h3>
        <div className="flex overflow-x-auto space-x-4 pb-2 scrollbar-hide">
          {following.map((influencer) => (
            <InfluencerAvatar
              key={influencer.id}
              src={influencer.image}
              name={influencer.name}
              isLive={influencer.isLive}
              size="sm"
            />
          ))}
        </div>
      </div>
      
      {/* Saved items */}
      <div className="px-4">
        <h3 className="font-medium mb-3">Saved</h3>
        <div className="grid grid-cols-2 gap-4">
          {savedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              className="mb-4"
            />
          ))}
        </div>
      </div>
      
      {/* Footer */}
      <div className="mt-8 bg-gray-100 pt-6 pb-20">
        <div className="container mx-auto px-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative">
                <div className="h-8 w-8 bg-kein-blue rounded-full flex items-center justify-center mr-2">
                  <ShoppingBag className="h-4 w-4 text-white" />
                </div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <Play className="h-2 w-2 text-white" fill="white" />
                </div>
              </div>
              <span className="font-bold text-kein-blue">Kein</span>
            </div>
            <Button variant="outline" size="sm" className="text-sm border-kein-blue text-kein-blue">
              Get the app
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-xs mb-6">
            <div>
              <h4 className="font-medium mb-2">Kein</h4>
              <ul className="space-y-2 text-gray-600">
                <li>Blog</li>
                <li>Careers</li>
                <li>About Us</li>
                <li>FAQ</li>
                <li>Seller Affiliates</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Get Help</h4>
              <ul className="space-y-2 text-gray-600">
                <li>Order Status</li>
                <li>Shipping and Returns</li>
                <li>Payment Options</li>
                <li>Contact Us</li>
              </ul>
            </div>
          </div>
          
          <div className="text-xs text-gray-500 text-center pt-4 border-t border-gray-200">
            <p>© 2024 Kein Inc.</p>
            <div className="flex justify-center space-x-4 mt-2">
              <span>Terms</span>
              <span>Privacy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

// Helper components
const ShoppingBag = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
    <path d="M3 6h18" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const Play = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);
