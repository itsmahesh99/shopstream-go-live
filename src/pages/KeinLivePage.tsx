import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Calendar, ChevronLeft, ChevronRight, Clock, Heart, MessageCircle, Send, Share, ShoppingBag, ThumbsUp 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import LiveBadge from "@/components/common/LiveBadge";
import { useCart } from "@/contexts/CartContext";

const KeinLivePage = () => {
  const { toast } = useToast();
  const { addToCart } = useCart();
  const [isLiked, setIsLiked] = useState(false);
  const [viewCount, setViewCount] = useState(1534);
  const [message, setMessage] = useState("");
  
  // Mock data for products shown in livestream
  const liveProducts = [
    {
      id: "1",
      title: "Floral Summer Dress",
      price: 1299,
      discountPrice: 999,
      image: "/lovable-uploads/37fa901f-5b94-426f-ac68-07a4249941e7.png",
    },
    {
      id: "2",
      title: "Blue Denim Jacket",
      price: 1899,
      discountPrice: 1599,
      image: "/lovable-uploads/7c48c057-d4b0-4193-9473-be6c8eee605c.png",
    },
  ];
  
  // Mock data for chat messages
  const chatMessages = [
    { id: "1", user: "Sophie", message: "Love this collection! 😍", time: "2m ago" },
    { id: "2", user: "Mike", message: "Is the dress available in blue?", time: "1m ago" },
    { id: "3", user: "Jessica", message: "Just ordered the jacket! Can't wait to receive it", time: "Just now" },
  ];
  
  const handleLike = () => {
    setIsLiked(!isLiked);
    if (!isLiked) {
      setViewCount(viewCount + 1);
      toast({
        title: "Liked!",
        description: "You liked this livestream",
      });
    } else {
      setViewCount(viewCount - 1);
    }
  };
  
  const handleAddToCart = (productId: string) => {
    const product = liveProducts.find(p => p.id === productId);
    if (product) {
      addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        discountPrice: product.discountPrice,
        image: product.image,
        color: "Default", // Default color since we don't know from the live stream
        size: "M", // Default size since we don't know from the live stream
        quantity: 1
      });
      
      toast({
        title: "Added to cart",
        description: "Product has been added to your cart",
      });
    }
  };
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      toast({
        description: "Message sent",
      });
      setMessage("");
    }
  };

  return (
    <div className="relative h-screen flex flex-col bg-black">
      {/* Live stream video */}
      <div className="relative flex-grow">
        <img
          src="/lovable-uploads/f8d1a83b-970d-4d3a-966a-e0e1deaddb20.png"
          alt="Live stream"
          className="w-full h-full object-cover"
        />
        
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/play" className="mr-2">
              <ChevronLeft className="h-6 w-6 text-white" />
            </Link>
            <Avatar className="h-10 w-10 border-2 border-white">
              <AvatarImage src="/lovable-uploads/f8d1a83b-970d-4d3a-966a-e0e1deaddb20.png" />
              <AvatarFallback>SD</AvatarFallback>
            </Avatar>
            <div className="ml-2">
              <div className="flex items-center">
                <p className="text-white font-medium text-sm">Sophie Davis</p>
                <Button variant="ghost" size="sm" className="h-6 ml-2 px-2 py-0 text-xs rounded-full bg-white/20 text-white">
                  Follow
                </Button>
              </div>
              <div className="flex items-center text-white/80 text-xs">
                <LiveBadge size="xs" />
                <span className="ml-2">{viewCount} watching</span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="text-white">
            <Share className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Live indicator */}
        <div className="absolute top-4 right-4">
          <LiveBadge />
        </div>
        
        {/* Stream info overlay (bottom) */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent pt-20 pb-4 px-4">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-white text-lg font-bold">Summer Fashion Collection 2024</h1>
              <div className="flex items-center mt-1 text-white/80 text-xs">
                <Calendar className="h-3 w-3 mr-1" />
                <span>April 8, 2025</span>
                <Clock className="h-3 w-3 ml-3 mr-1" />
                <span>7:00 PM</span>
              </div>
            </div>
            <div className="flex space-x-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className="bg-black/30 text-white rounded-full"
                onClick={handleLike}
              >
                <ThumbsUp className={`h-5 w-5 ${isLiked ? "text-kein-blue fill-kein-blue" : ""}`} />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="bg-black/30 text-white rounded-full"
              >
                <Heart className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Products in stream */}
      <div className="bg-black px-4 py-2">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-white text-sm font-medium">Products in stream</h3>
          <Button variant="ghost" size="sm" className="h-7 text-xs text-white">
            View all
            <ChevronRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
        <div className="flex overflow-x-auto space-x-3 scrollbar-hide pb-2">
          {liveProducts.map((product) => (
            <div 
              key={product.id} 
              className="relative flex-shrink-0 w-[140px] bg-white/10 rounded-lg overflow-hidden"
            >
              <div className="h-20 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-2">
                <h4 className="text-white text-xs font-medium truncate">{product.title}</h4>
                <div className="flex items-center mt-1">
                  <span className="text-kein-coral text-xs font-bold">₹{product.discountPrice}</span>
                  <span className="text-white/60 text-xs line-through ml-1">₹{product.price}</span>
                </div>
                <Button 
                  size="sm" 
                  className="mt-2 w-full h-7 rounded-full bg-kein-blue text-xs"
                  onClick={() => handleAddToCart(product.id)}
                >
                  <ShoppingBag className="h-3 w-3 mr-1" />
                  Add to cart
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Chat section */}
      <div className="bg-white flex-grow overflow-hidden flex flex-col">
        <div className="p-3 border-b">
          <h3 className="font-medium text-sm">Live Chat</h3>
        </div>
        
        <div className="flex-grow overflow-y-auto p-3 space-y-3">
          {chatMessages.map((chat) => (
            <div key={chat.id} className="flex items-start">
              <Avatar className="h-6 w-6 mr-2">
                <AvatarFallback>{chat.user[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-xs">{chat.user}</span>
                  <span className="text-gray-400 text-[10px]">{chat.time}</span>
                </div>
                <p className="text-xs mt-0.5">{chat.message}</p>
              </div>
            </div>
          ))}
        </div>
        
        <form onSubmit={handleSendMessage} className="border-t p-3 flex items-center">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 text-sm border-0 focus:outline-none bg-transparent"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button type="submit" size="icon" variant="ghost" className="text-kein-blue">
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default KeinLivePage;
