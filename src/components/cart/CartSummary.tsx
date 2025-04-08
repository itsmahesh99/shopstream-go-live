
import React from "react";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";

const CartSummary = () => {
  const { items } = useCart();
  
  // Calculate subtotal
  const subtotal = items.reduce((total, item) => {
    const price = item.discountPrice || item.price;
    return total + (price * item.quantity);
  }, 0);
  
  const shipping = items.length > 0 ? 99 : 0;
  const discount = items.length > 0 ? -199 : 0;
  const total = subtotal + shipping + discount;

  return (
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
  );
};

export default CartSummary;
