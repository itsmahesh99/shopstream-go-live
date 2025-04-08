
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Mock data
const cartItems = [
  {
    id: "1",
    title: "Women solid top and jeans",
    price: 999,
    image: "/lovable-uploads/37fa901f-5b94-426f-ac68-07a4249941e7.png",
    color: "Pink",
    size: "M",
    quantity: 1,
  },
  {
    id: "2",
    title: "Men's casual shirt",
    price: 1200,
    image: "/lovable-uploads/f8d1a83b-970d-4d3a-966a-e0e1deaddb20.png",
    color: "Blue",
    size: "L",
    quantity: 2,
  },
];

const CartPage = () => {
  const { toast } = useToast();
  const [items, setItems] = useState(cartItems);
  
  const handleRemoveFromCart = (id: string) => {
    setItems(items.filter(item => item.id !== id));
    toast({
      title: "Removed from cart",
      description: "Item has been removed from your cart",
    });
  };
  
  const handleQuantityChange = (id: string, change: number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + change);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const handleClearCart = () => {
    setItems([]);
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart",
    });
  };
  
  const handleCheckout = () => {
    toast({
      title: "Checkout",
      description: "Proceeding to checkout",
    });
  };
  
  // Calculate subtotal
  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = items.length > 0 ? 99 : 0;
  const discount = -199;
  const total = subtotal + shipping + discount;

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      <div className="sticky top-0 z-30 bg-white border-b">
        <div className="px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">My Cart</h1>
          {items.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-kein-coral hover:text-kein-coral/80 hover:bg-transparent px-2"
              onClick={handleClearCart}
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
                        onClick={() => handleRemoveFromCart(item.id)}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="mt-1 font-bold text-kein-coral">₹{item.price}</div>
                    
                    <div className="flex space-x-2 mt-2">
                      <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-200">
                        {item.size}
                      </Badge>
                      <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-200">
                        {item.color}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex items-center border rounded-full">
                        <button 
                          className="px-2 py-1"
                          onClick={() => handleQuantityChange(item.id, -1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-2 text-sm">{item.quantity}</span>
                        <button 
                          className="px-2 py-1"
                          onClick={() => handleQuantityChange(item.id, 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <span className="font-bold">₹{item.price * item.quantity}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Coupon code */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center flex-1">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    className="w-full border-0 focus:outline-none text-sm"
                  />
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-kein-blue text-kein-blue"
                >
                  Apply
                </Button>
              </div>
            </div>
            
            {/* Price breakdown */}
            <div className="bg-white rounded-lg shadow-sm p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping fee</span>
                <span className="font-medium">₹{shipping}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Discount</span>
                <span className="font-medium text-kein-coral">₹{discount}</span>
              </div>
              <Separator />
              <div className="flex justify-between pt-1">
                <span className="font-bold">Total</span>
                <span className="font-bold text-kein-blue">₹{total}</span>
              </div>
            </div>
            
            {/* Checkout button */}
            <Button 
              className="w-full bg-kein-blue hover:bg-kein-blue/90 h-12"
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Your cart is empty</h3>
            <p className="text-gray-500 mb-6">Items added to your cart will appear here</p>
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

export default CartPage;
