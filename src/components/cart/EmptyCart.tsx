
import React from "react";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const EmptyCart = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <ShoppingBag className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">Your cart is empty</h3>
      <p className="text-gray-500 mb-6">Items added to your cart will appear here</p>
      <Button 
        className="bg-kein-blue hover:bg-kein-blue/90"
        onClick={() => navigate('/home')}
      >
        Continue shopping
      </Button>
    </div>
  );
};

export default EmptyCart;
