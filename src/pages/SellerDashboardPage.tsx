
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight, Info, Search, Upload, Video } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data
const sellerProducts = [
  {
    id: "1",
    title: "1.5\" Satin Fabric Christmas Ribbon 36' White - Wondershop #4934",
    price: 499,
    image: "/lovable-uploads/d9b61dc1-74ba-423d-8b21-9e83e8e1ff97.png",
    available: 1,
    status: "Brand New. Please watch livestream for details. Open Box sold as is. No Can",
  },
  {
    id: "2",
    title: "1pc Blackout Textural Overlay Window Curtain Panel - Threshold™, 95\" #5583",
    price: 599,
    image: "/lovable-uploads/37fa901f-5b94-426f-ac68-07a4249941e7.png",
    available: 1,
    status: "No cancellations. Please watch live show for details on item, sizing and co",
  },
  {
    id: "3",
    title: "1pc Room Darkening Grommet Window Curtain Panel - Room Essentials™",
    price: 699,
    image: "/lovable-uploads/f8d1a83b-970d-4d3a-966a-e0e1deaddb20.png",
    available: 3,
    status: "Brand New. Please watch livestream for details.",
  },
];

const SellerDashboardPage = () => {
  const { toast } = useToast();
  const [streaming, setStreaming] = useState(false);
  
  const handleGoLive = () => {
    if (streaming) {
      setStreaming(false);
      toast({
        title: "Stream ended",
        description: "Your livestream has ended successfully",
      });
    } else {
      setStreaming(true);
      toast({
        title: "Going live!",
        description: "Your livestream has started successfully",
      });
    }
  };
  
  const handleAddProduct = () => {
    toast({
      title: "Add product",
      description: "Taking you to the product creation page",
    });
  };

  return (
    <div className="pb-20">
      {/* Profile banner */}
      <div className="bg-gradient-to-r from-pink-100 to-pink-200 px-4 pt-6 pb-4 relative">
        <div className="flex items-center">
          <img
            src="/lovable-uploads/f8d1a83b-970d-4d3a-966a-e0e1deaddb20.png"
            alt="Disha Bhola"
            className="h-12 w-12 rounded-full object-cover border-2 border-white mr-3"
          />
          <div>
            <h1 className="font-bold text-xl">Disha Bhola</h1>
            <p className="text-xs text-gray-600">Apr 2, 2025 at 7PM</p>
          </div>
          <button className="ml-auto p-1">
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>
      
      {/* Stream title */}
      <div className="px-4 py-4 bg-white border-b">
        <h2 className="font-bold text-lg">BIG SHOW PART 2 Non Stop Givey's</h2>
        
        <div className="flex space-x-4 mt-3 pb-2 overflow-x-auto">
          <Button
            variant="default"
            className={`rounded-full px-4 py-1 text-sm ${
              streaming ? "bg-red-500 hover:bg-red-600" : "bg-kein-blue"
            }`}
            onClick={handleGoLive}
          >
            {streaming ? "End Stream" : "Go Live"}
          </Button>
          <Button
            variant="outline"
            className="rounded-full px-4 py-1 text-sm border-gray-300"
          >
            Products
          </Button>
          <Button
            variant="outline"
            className="rounded-full px-4 py-1 text-sm border-gray-300"
          >
            Buy Now
          </Button>
          <Button
            variant="outline"
            className="rounded-full px-4 py-1 text-sm border-gray-300"
          >
            Giveaways
          </Button>
          <Button
            variant="outline"
            className="rounded-full px-4 py-1 text-sm border-gray-300"
          >
            Sold
          </Button>
        </div>
      </div>
      
      {/* Search and product count */}
      <div className="px-4 py-4">
        <div className="relative mb-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search products..."
            className="pl-10 pr-4 py-2 w-full rounded-full border-gray-300"
          />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">3,178 Products</span>
          <Button
            variant="outline"
            size="sm"
            className="text-kein-blue border-kein-blue"
            onClick={handleAddProduct}
          >
            Add Product
          </Button>
        </div>
      </div>
      
      {/* Products list */}
      <div className="px-4">
        {sellerProducts.map((product) => (
          <div key={product.id} className="border-b py-4 flex">
            <div className="w-1/4 h-24">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover rounded"
              />
            </div>
            <div className="ml-3 flex-1">
              <h3 className="font-medium text-sm line-clamp-2">{product.title}</h3>
              <div className="flex items-center mt-1">
                <span className="text-xs mr-2">{product.available} Available</span>
                <span className="text-xs text-gray-500">LOT</span>
              </div>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                {product.status}
              </p>
              <div className="flex items-center justify-between mt-2">
                <span className="font-bold text-sm">₹{product.price}</span>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 px-3 text-xs border-gray-300"
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="h-8 px-3 text-xs bg-kein-blue"
                    onClick={() => {
                      toast({
                        title: "Show during live",
                        description: `${product.title} will be shown during your stream`,
                      });
                    }}
                  >
                    Show Live
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Stream controls - visible when streaming */}
      {streaming && (
        <div className="fixed bottom-20 left-0 right-0 bg-white border-t border-gray-200 p-4 flex flex-col z-40">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Video className="h-5 w-5 text-red-500 mr-2" />
              <span className="font-medium">Live Streaming Controls</span>
            </div>
            <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full animate-pulse">
              LIVE
            </span>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              className="flex-1 border-gray-300 text-gray-600"
              onClick={() => {
                toast({
                  title: "Camera switched",
                  description: "Camera view has been switched",
                });
              }}
            >
              Switch Camera
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 border-gray-300 text-gray-600"
              onClick={() => {
                toast({
                  title: "Product spotlight",
                  description: "Showing product close-up view",
                });
              }}
            >
              Product View
            </Button>
            <Button 
              variant="default" 
              className="flex-1 bg-kein-blue"
              onClick={() => {
                toast({
                  title: "Buy button activated",
                  description: "Buy button is now visible to viewers",
                });
              }}
            >
              Show Buy Button
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerDashboardPage;
