
import React from "react";
import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  onAddToCart: () => void;
  onBuyNow: () => void;
}

const ActionButtons = ({ onAddToCart, onBuyNow }: ActionButtonsProps) => {
  return (
    <div className="flex space-x-2">
      <Button
        variant="outline"
        className="flex-1 border-kein-blue text-kein-blue h-12"
        onClick={onAddToCart}
      >
        Add to cart
      </Button>
      <Button
        className="flex-1 bg-kein-blue text-white h-12"
        onClick={onBuyNow}
      >
        Buy now
      </Button>
    </div>
  );
};

export default ActionButtons;
