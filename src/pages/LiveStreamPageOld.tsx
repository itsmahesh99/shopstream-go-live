
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Send, Heart, Share2, ShoppingBag, X, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LiveBadge from "@/components/common/LiveBadge";
import { useToast } from "@/hooks/use-toast";

// Mock data
const streamer = {
  id: "1",
  name: "Disha Bhola",
  image: "/lovable-uploads/f8d1a83b-970d-4d3a-966a-e0e1deaddb20.png",
  followers: 45600,
};

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
];

const chatMessages = [
  { id: "1", user: "amysmith15", message: "Just joined! What's the giveaway today?", time: "2m ago" },
  { id: "2", user: "alex_styles", message: "I bought that top last week and it's amazing! Highly recommend.", time: "1m ago" },
  { id: "3", user: "rositaflores", message: "💕💕💕", time: "1m ago" },
];

const LiveStreamPage = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [currentProduct, setCurrentProduct] = useState(products[0]);
  const [message, setMessage] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [viewCount, setViewCount] = useState(2530);
  
  const handleLike = () => {
    setIsLiked(!isLiked);
    if (!isLiked) {
      toast({
        title: "Liked stream",
        description: "You liked Disha's stream",
      });
    }
  };
  
  const handleAddToCart = () => {
    toast({
      title: "Added to cart",
      description: `${currentProduct.title} has been added to your cart`,
    });
  };
  
  const handleBuyNow = () => {
    toast({
      title: "Proceeding to checkout",
      description: "Taking you to the checkout page",
    });
  };
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      toast({
        title: "Message sent",
        description: "Your message has been sent to the chat",
      });
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Video and streamer info */}
      <div className="relative w-full bg-pink-100">
        <div className="aspect-[9/16] max-h-[60vh] overflow-hidden">
          <img 
            src="/lovable-uploads/f570e76e-9e2b-48d1-b582-8f7c2732629c.png" 
            alt="Live stream" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="absolute top-0 left-0 right-0 flex justify-between items-start p-4">
          <Link to="/home" className="p-1 rounded-full bg-black/30">
            <ChevronLeft className="h-6 w-6 text-white" />
          </Link>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 bg-black/30 rounded-full px-2 py-1">
              <div className="h-2 w-2 rounded-full bg-red-500"></div>
              <span className="text-white text-xs">{viewCount.toLocaleString()}</span>
            </div>
            
            <button className="p-1 rounded-full bg-black/30">
              <Share2 className="h-5 w-5 text-white" />
            </button>
            
            <button 
              className="p-1 rounded-full bg-black/30"
              onClick={() => setIsChatOpen(!isChatOpen)}
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
        
        <div className="absolute top-0 left-0 mt-16 ml-4 flex items-center space-x-2">
          <img 
            src={streamer.image} 
            alt={streamer.name} 
            className="h-10 w-10 rounded-full border-2 border-white object-cover"
          />
          <div>
            <div className="flex items-center">
              <h2 className="text-white text-sm font-bold mr-2">{streamer.name}</h2>
              <LiveBadge size="sm" />
            </div>
            <p className="text-white/80 text-xs">Apr 2, 2025 at 7PM</p>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="flex items-center space-x-1">
                <span className="text-red-500 font-bold text-sm">00:58</span>
                <span className="text-white font-bold text-sm">Women solid top #08</span>
              </div>
              <div className="flex space-x-4 text-xs">
                <div className="text-white/80">
                  <span className="line-through">MRP: ₹999/-</span>
                </div>
                <div className="text-white/80">
                  <span>Discount: -50%</span>
                </div>
              </div>
              <div className="text-xs text-white/80 mt-1">
                As shown, no cancellation
              </div>
              <div className="text-xs flex items-center">
                <span className="text-white/80">Shippable to your pincode:</span>
                <span className="text-green-400 ml-2 font-bold">₹499/-</span>
              </div>
            </div>
            <button
              className={`p-2 rounded-full ${isLiked ? 'bg-red-500' : 'bg-black/30'}`}
              onClick={handleLike}
            >
              <Heart className={`h-6 w-6 ${isLiked ? 'text-white fill-current' : 'text-white'}`} />
            </button>
          </div>
          <Button 
            className="w-full bg-kein-blue hover:bg-kein-blue/90 text-white"
            onClick={handleAddToCart}
          >
            Add to cart
          </Button>
        </div>
      </div>
      
      {/* Chat and Products tabs */}
      <div className="flex-grow overflow-hidden">
        <Tabs defaultValue="chat" className="w-full h-full">
          <TabsList className="w-full h-12 grid grid-cols-2">
            <TabsTrigger value="chat" className="text-sm">Chat</TabsTrigger>
            <TabsTrigger value="products" className="text-sm">Products</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chat" className="h-[calc(100%-3rem)] flex flex-col">
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
              {chatMessages.map((msg) => (
                <div key={msg.id} className="flex items-start space-x-2">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-gray-200"></div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm">{msg.user}</span>
                      <span className="text-xs text-gray-400">{msg.time}</span>
                    </div>
                    <p className="text-sm">{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <form 
              onSubmit={handleSendMessage}
              className="p-4 border-t flex items-center space-x-2"
            >
              <Input
                placeholder="Say something..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-grow"
              />
              <Button type="submit" size="icon" className="bg-kein-blue">
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="products" className="h-[calc(100%-3rem)] overflow-y-auto p-4">
            <div className="space-y-4">
              <h3 className="font-bold text-lg">BIG SHOW PART 2 Non Stop Givey's</h3>
              
              <div className="flex space-x-3 pb-3 border-b">
                <button className="text-sm font-medium text-kein-blue border-b-2 border-kein-blue pb-1">Products</button>
                <button className="text-sm text-gray-500">Buy Now</button>
                <button className="text-sm text-gray-500">Giveaways</button>
                <button className="text-sm text-gray-500">Sold</button>
              </div>
              
              <div className="flex border rounded-full overflow-hidden p-1">
                <Input
                  placeholder="Search products..."
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
              
              <div className="text-sm text-gray-500">3,178 Products</div>
              
              <div className="space-y-4">
                {products.map((product) => (
                  <div key={product.id} className="flex border-b pb-4">
                    <div className="w-1/4">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full aspect-square object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1 ml-4">
                      <h4 className="font-medium text-sm line-clamp-2">{product.title}</h4>
                      <div className="flex items-center mt-1">
                        <span className="text-sm font-medium mr-2">₹{product.discountPrice}</span>
                        <span className="text-xs text-gray-500 line-through">₹{product.price}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">1 Available</div>
                      <div className="text-xs text-gray-500 mt-1">
                        No cancellations. Please watch live show for details on item, sizing and colors.
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LiveStreamPage;
