
import React from "react";
import { Button } from "@/components/ui/button";

interface CheckoutButtonProps {
  total: number;
  itemCount: number;
  onCheckout: () => void;
}

const CheckoutButton = ({ total, itemCount, onCheckout }: CheckoutButtonProps) => {
  return (
    <Button
      className="w-full h-12 bg-kein-blue"
      onClick={onCheckout}
    >
      Pay ₹{total} for {itemCount} {itemCount === 1 ? 'item' : 'items'}
    </Button>
  );
};

export default CheckoutButton;
