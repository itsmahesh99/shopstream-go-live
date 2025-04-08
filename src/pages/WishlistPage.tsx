
import React from "react";
import { Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// Mock data
const wishlistItems = [
  {
    id: "1",
    title: "Women solid top and jeans",
    price: 999,
    image: "/lovable-uploads/37fa901f-5b94-426f-ac68-07a4249941e7.png",
    color: "Pink",
    size: "M",
  },
  {
    id: "2",
    title: "Women solid top and jeans",
    price: 1200,
    image: "/lovable-uploads/f8d1a83b-970d-4d3a-966a-e0e1deaddb20.png",
    color: "Pink",
    size: "M",
  },
  {
    id: "3",
    title: "Women solid top and jeans",
    price: 2700,
    image: "/lovable-uploads/d9b61dc1-74ba-423d-8b21-9e83e8e1ff97.png",
    color: "Pink",
    size: "M",
  },
  {
    id: "4",
    title: "Women solid top and jeans",
    price: 1900,
    image: "/lovable-uploads/7c48c057-d4b0-4193-9473-be6c8eee605c.png",
    color: "Pink",
    size: "M",
  },
  {
    id: "5",
    title: "Women solid top and jeans",
    price: 999,
    image: "/lovable-uploads/bcb73b7f-2144-4a7d-aaca-a22c1dce107d.png",
    color: "Pink",
    size: "M",
  },
];

const recentlyViewed = [
  {
    id: "6",
    title: "Women solid top and jeans",
    price: 999,
    image: "/lovable-uploads/b919bc4e-ae0e-4d85-9cba-1168285b252c.png",
    color: "Pink",
    size: "M",
  },
  // ... more items
];

const WishlistPage = () => {
  const { toast } = useToast();
  
  const handleRemoveFromWishlist = (id: string) => {
    toast({
      title: "Removed from wishlist",
      description: "Item has been removed from your wishlist",
    });
  };
  
  const handleAddToCart = (id: string) => {
    toast({
      title: "Added to cart",
      description: "Item has been added to your cart",
    });
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="px-4 py-4 border-b">
        <h1 className="text-2xl font-bold">Wishlist</h1>
      </div>
      
      <div className="px-4 py-4">
        <h2 className="font-medium mb-4">Recently viewed</h2>
        
        {wishlistItems.map(item => (
          <div key={item.id} className="flex border-b py-4">
            <div className="w-1/4 relative">
              <img
                src={item.image}
                alt={item.title}
                className="w-full aspect-square object-cover rounded"
              />
              <button 
                className="absolute top-1 left-1 bg-white rounded-full p-1"
                onClick={() => handleRemoveFromWishlist(item.id)}
              >
                <Trash2 className="h-4 w-4 text-gray-400" />
              </button>
            </div>
            
            <div className="ml-4 flex-1">
              <h3 className="text-sm font-medium line-clamp-2">{item.title}</h3>
              <div className="mt-2 font-bold">₹{item.price}</div>
              
              <div className="flex space-x-2 mt-2">
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                  {item.color}
                </span>
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                  {item.size}
                </span>
              </div>
              
              <div className="mt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 rounded w-full border-gray-300"
                  onClick={() => handleAddToCart(item.id)}
                >
                  <ShoppingBag className="h-3 w-3 mr-2" />
                  Add to cart
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
