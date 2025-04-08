
import React from "react";
import { Separator } from "@/components/ui/separator";
import { CartItem } from "@/contexts/CartContext";

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
}

const OrderSummary = ({ 
  items, 
  subtotal, 
  deliveryFee, 
  tax, 
  total 
}: OrderSummaryProps) => {
  return (
    <div className="py-4">
      <h3 className="font-medium mb-3">Order Summary</h3>
      
      <div className="mb-3">
        <h4 className="text-sm font-medium mb-2">Items ({items.length})</h4>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {items.map((item, index) => (
            <div key={`${item.id}-${item.color}-${item.size}`} className="flex items-center text-sm">
              <span className="flex-1 truncate">{item.title} ({item.color}, {item.size})</span>
              <span className="text-gray-500">x{item.quantity}</span>
              <span className="ml-2 font-medium">
                ₹{(item.discountPrice || item.price) * item.quantity}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      <Separator className="my-3" />
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Subtotal</span>
          <span>₹{subtotal}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Delivery Fee</span>
          <span>₹{deliveryFee}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Tax</span>
          <span>₹{tax}</span>
        </div>
        <Separator className="my-2" />
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
