
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data
const cartItems = [
  {
    id: "1",
    title: "Women solid top and jeans",
    price: 999,
    discountPrice: 499,
    discountPercentage: 50,
    image: "/lovable-uploads/37fa901f-5b94-426f-ac68-07a4249941e7.png",
    color: "Pink",
    size: "M",
    quantity: 1,
  },
  {
    id: "2",
    title: "Women solid top and jeans",
    price: 999,
    discountPrice: 499,
    discountPercentage: 50,
    image: "/lovable-uploads/f8d1a83b-970d-4d3a-966a-e0e1deaddb20.png",
    color: "Pink",
    size: "Select size",
    quantity: 1,
  },
];

const wishlistItems = [
  {
    id: "3",
    title: "Women solid top and jeans",
    price: 999,
    image: "/lovable-uploads/d9b61dc1-74ba-423d-8b21-9e83e8e1ff97.png",
    color: "Pink",
    size: "M",
  },
  {
    id: "4",
    title: "Women solid top and jeans",
    price: 999,
    image: "/lovable-uploads/7c48c057-d4b0-4193-9473-be6c8eee605c.png",
    color: "Pink",
    size: "M",
  },
];

const CartPage = () => {
  const { toast } = useToast();
  const [items, setItems] = useState(cartItems);
  
  const calculateTotal = () => {
    return items.reduce((total, item) => total + (item.discountPrice || item.price) * item.quantity, 0);
  };
  
  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
    toast({
      title: "Item removed",
      description: "Item has been removed from your cart",
    });
  };
  
  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setItems(items.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };
  
  const handleCheckout = () => {
    toast({
      title: "Proceeding to checkout",
      description: "Taking you to the payment page",
    });
  };
  
  const handleAddToCart = (id: string) => {
    toast({
      title: "Added to cart",
      description: "Item has been added to your cart",
    });
  };

  return (
    <div className="pb-28">
      <div className="px-4 py-4 border-b">
        <h1 className="text-2xl font-bold flex items-center">
          Cart <span className="ml-2 text-sm bg-gray-200 rounded-full h-5 w-5 flex items-center justify-center">{items.length}</span>
        </h1>
      </div>
      
      {items.length > 0 ? (
        <>
          {/* Shipping address */}
          <div className="px-4 py-4 border-b flex items-center justify-between">
            <div>
              <h3 className="font-medium mb-1">Shipping Address</h3>
              <p className="text-sm text-gray-600">
                Magadi Main Rd, next to Prasanna Theatre, Cholourpalya, Bengaluru, Karnataka 560023
              </p>
            </div>
            <button className="p-1 rounded-full bg-blue-50">
              <ChevronRight className="h-5 w-5 text-kein-blue" />
            </button>
          </div>
          
          {/* Cart items */}
          <div className="px-4 py-4">
            {items.map(item => (
              <div key={item.id} className="flex py-4 border-b">
                <div className="w-1/4">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full aspect-square object-cover rounded-md"
                  />
                  <button 
                    className="mt-2 w-full flex items-center justify-center"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
                
                <div className="ml-4 flex-1">
                  <h3 className="font-medium text-sm mb-1 line-clamp-2">{item.title}</h3>
                  
                  <div className="flex gap-2 mb-3">
                    <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
                      {item.color}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      item.size === 'Select size' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {item.size}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center">
                        {item.discountPrice && (
                          <>
                            <span className="line-through text-xs text-gray-400 mr-2">₹{item.price}</span>
                            <span className="text-xs bg-red-100 text-red-800 px-1 rounded">-{item.discountPercentage}%</span>
                          </>
                        )}
                      </div>
                      <div className="font-bold">₹{item.discountPrice || item.price}</div>
                    </div>
                    
                    <div className="flex items-center">
                      <button
                        className="h-8 w-8 rounded-full border border-gray-300 flex items-center justify-center"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        className="h-8 w-8 rounded-full border border-gray-300 flex items-center justify-center"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Wishlist items */}
          {wishlistItems.length > 0 && (
            <div className="px-4 py-4">
              <h3 className="font-medium mb-3">From Your Wishlist</h3>
              
              {wishlistItems.map(item => (
                <div key={item.id} className="flex py-4 border-b">
                  <div className="w-1/4">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full aspect-square object-cover rounded-md"
                    />
                    <button 
                      className="mt-2 w-full flex items-center justify-center"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                  
                  <div className="ml-4 flex-1">
                    <h3 className="font-medium text-sm mb-1">{item.title}</h3>
                    
                    <div className="flex gap-2 mb-3">
                      <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
                        {item.color}
                      </span>
                      <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
                        {item.size}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="font-bold">₹{item.price}</div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 border-kein-blue text-kein-blue"
                        onClick={() => handleAddToCart(item.id)}
                      >
                        <ShoppingBag className="h-3 w-3 mr-1" />
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Checkout bar */}
          <div className="fixed bottom-16 left-0 right-0 bg-white border-t px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total</p>
              <p className="font-bold text-lg">₹{calculateTotal()}</p>
            </div>
            
            <Button 
              className="px-8 bg-kein-blue"
              onClick={handleCheckout}
            >
              Checkout
            </Button>
          </div>
        </>
      ) : (
        // Empty cart state
        <div className="flex flex-col items-center justify-center px-4 py-10">
          <div className="bg-gray-100 rounded-full p-6 mb-4">
            <ShoppingBag className="h-10 w-10 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-gray-600 text-center mb-6">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link to="/home">
            <Button className="bg-kein-blue">Continue Shopping</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default CartPage;

// Helper component
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
