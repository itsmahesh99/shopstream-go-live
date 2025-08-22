
import React, { useState } from "react";
import { Trash2, ShoppingBag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Mock data
const wishlistItems = [
  {
    id: "1",
    title: "Women solid top and jeans",
    price: 999,
    image: "/lovable-uploads/37fa901f-5b94-426f-ac68-07a4249941e7.png",
    color: "Pink",
    availableColors: ["Pink", "Blue", "Black"],
    size: "M",
    availableSizes: ["S", "M", "L", "XL"],
  },
  {
    id: "2",
    title: "Men's casual shirt",
    price: 1200,
    image: "/lovable-uploads/f8d1a83b-970d-4d3a-966a-e0e1deaddb20.png",
    color: "Blue",
    availableColors: ["Blue", "White", "Black"],
    size: "L",
    availableSizes: ["M", "L", "XL"],
  },
  {
    id: "3",
    title: "Women's summer dress",
    price: 2700,
    image: "/lovable-uploads/d9b61dc1-74ba-423d-8b21-9e83e8e1ff97.png",
    color: "Green",
    availableColors: ["Green", "Yellow", "Pink"],
    size: "S",
    availableSizes: ["XS", "S", "M"],
  },
  {
    id: "4",
    title: "Denim jacket",
    price: 1900,
    image: "/lovable-uploads/7c48c057-d4b0-4193-9473-be6c8eee605c.png",
    color: "Blue",
    availableColors: ["Blue", "Black", "Gray"],
    size: "XL",
    availableSizes: ["L", "XL", "XXL"],
  },
  {
    id: "5",
    title: "Casual T-shirt",
    price: 999,
    image: "/lovable-uploads/bcb73b7f-2144-4a7d-aaca-a22c1dce107d.png",
    color: "White",
    availableColors: ["White", "Black", "Gray", "Blue"],
    size: "M",
    availableSizes: ["S", "M", "L", "XL"],
  },
];

const WishlistPage = () => {
  const { toast } = useToast();
  const { addToCart } = useCart();
  const [items, setItems] = useState(wishlistItems);
  
  const handleRemoveFromWishlist = (id: string) => {
    setItems(items.filter(item => item.id !== id));
    toast({
      title: "Removed from wishlist",
      description: "Item has been removed from your wishlist",
    });
  };
  
  const handleAddToCart = (item: typeof items[0]) => {
    // Add the item to cart using the CartContext
    addToCart({
      id: item.id,
      title: item.title,
      price: item.price,
      image: item.image,
      color: item.color,
      size: item.size,
      quantity: 1
    });
    
    toast({
      title: "Added to cart",
      description: `${item.title} has been added to your cart`,
    });
  };

  const handleClearWishlist = () => {
    setItems([]);
    toast({
      title: "Wishlist cleared",
      description: "All items have been removed from your wishlist",
    });
  };

  const handleSizeChange = (id: string, newSize: string) => {
    setItems(
      items.map(item => 
        item.id === id ? { ...item, size: newSize } : item
      )
    );
  };

  const handleColorChange = (id: string, newColor: string) => {
    setItems(
      items.map(item => 
        item.id === id ? { ...item, color: newColor } : item
      )
    );
  };

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      <div className="sticky top-0 z-30 bg-white border-b">
        <div className="px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">My Wishlist</h1>
          {items.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-kein-coral hover:text-kein-coral/80 hover:bg-transparent px-2"
              onClick={handleClearWishlist}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Clear all
            </Button>
          )}
        </div>
      </div>
      
      <div className="px-4 py-4">
        {items.length > 0 ? (
          <div className="space-y-4">
            {items.map(item => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="flex p-3">
                  <div className="w-24 h-24 relative rounded-md overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between">
                      <h3 className="text-sm font-medium line-clamp-2">{item.title}</h3>
                      <button 
                        className="text-gray-400 hover:text-gray-600"
                        onClick={() => handleRemoveFromWishlist(item.id)}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="mt-1 font-bold text-kein-coral">₹{item.price}</div>
                    
                    {/* Size Selection */}
                    <div className="mt-2">
                      <p className="text-xs text-gray-500 mb-1">Size:</p>
                      <div className="flex flex-wrap gap-1">
                        {item.availableSizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => handleSizeChange(item.id, size)}
                            className={`h-6 w-8 text-xs rounded-md flex items-center justify-center ${
                              item.size === size 
                              ? 'bg-kein-blue text-white' 
                              : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Color Selection */}
                    <div className="mt-2">
                      <p className="text-xs text-gray-500 mb-1">Color:</p>
                      <div className="flex flex-wrap gap-1">
                        {item.availableColors.map((color) => (
                          <button
                            key={color}
                            onClick={() => handleColorChange(item.id, color)}
                            className={`h-6 px-2 text-xs rounded-md flex items-center justify-center ${
                              item.color === color 
                              ? 'bg-kein-blue text-white' 
                              : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {color}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <Button 
                        variant="default" 
                        size="sm" 
                        className="h-8 rounded-full w-full bg-kein-blue"
                        onClick={() => handleAddToCart(item)}
                      >
                        <ShoppingBag className="h-3 w-3 mr-2" />
                        Add to cart
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Your wishlist is empty</h3>
            <p className="text-gray-500 mb-6">Items added to your wishlist will appear here</p>
            <Button 
              className="bg-kein-blue hover:bg-kein-blue/90"
              onClick={() => window.location.href = '/home'}
            >
              Continue shopping
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
