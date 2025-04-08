
import React from "react";
import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  quantity: number;
  decreaseQuantity: () => void;
  increaseQuantity: () => void;
}

const QuantitySelector = ({ 
  quantity, 
  decreaseQuantity, 
  increaseQuantity 
}: QuantitySelectorProps) => {
  return (
    <div className="py-4 border-b">
      <h3 className="font-medium mb-3 text-sm">Quantity</h3>
      <div className="flex items-center">
        <button
          onClick={decreaseQuantity}
          className="h-10 w-10 rounded-full border border-kein-blue flex items-center justify-center text-kein-blue"
        >
          <Minus className="h-4 w-4" />
        </button>
        <div className="h-10 w-16 flex items-center justify-center text-lg font-medium mx-2 bg-blue-50 rounded">
          {quantity}
        </div>
        <button
          onClick={increaseQuantity}
          className="h-10 w-10 rounded-full border border-kein-blue flex items-center justify-center text-kein-blue"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default QuantitySelector;
