
import React from "react";
import { Minus, Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";

interface CartItemProps {
  id: string;
  title: string;
  image: string;
  price: number;
  discountPrice?: number;
  color: string;
  size: string;
  quantity: number;
  onRemove: (id: string) => void;
}

const CartItem = ({
  id,
  title,
  image,
  price,
  discountPrice,
  color,
  size,
  quantity,
  onRemove
}: CartItemProps) => {
  const { updateQuantity } = useCart();
  
  const handleQuantityChange = (change: number) => {
    updateQuantity(id, quantity + change);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="flex p-3">
        <div className="w-24 h-24 relative rounded-md overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="ml-3 flex-1">
          <div className="flex justify-between">
            <h3 className="text-sm font-medium line-clamp-2">{title}</h3>
            <button 
              className="text-gray-400 hover:text-gray-600"
              onClick={() => onRemove(id)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <div className="mt-1 font-bold text-kein-coral">
            ₹{discountPrice || price}
          </div>
          
          <div className="flex space-x-2 mt-2">
            <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-200">
              {size}
            </Badge>
            <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-200">
              {color}
            </Badge>
          </div>
          
          <div className="flex justify-between items-center mt-3">
            <div className="flex items-center border rounded-full">
              <button 
                className="px-2 py-1"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="px-2 text-sm">{quantity}</span>
              <button 
                className="px-2 py-1"
                onClick={() => handleQuantityChange(1)}
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
            <span className="font-bold">
              ₹{(discountPrice || price) * quantity}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
