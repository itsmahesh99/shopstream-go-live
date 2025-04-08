
import React from "react";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import CartItem from "@/components/cart/CartItem";
import CouponInput from "@/components/cart/CouponInput";
import CartSummary from "@/components/cart/CartSummary";
import EmptyCart from "@/components/cart/EmptyCart";

const CartPage = () => {
  const { toast } = useToast();
  const { items, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  
  const handleRemoveFromCart = (id: string) => {
    removeFromCart(id);
    toast({
      title: "Removed from cart",
      description: "Item has been removed from your cart",
    });
  };

  const handleClearCart = () => {
    clearCart();
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
    // In a real app, this would navigate to a checkout page
  };

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
              <CartItem 
                key={item.id}
                {...item}
                onRemove={handleRemoveFromCart}
              />
            ))}
            
            <CouponInput />
            <CartSummary />
            
            {/* Checkout button */}
            <Button 
              className="w-full bg-kein-blue hover:bg-kein-blue/90 h-12"
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </Button>
          </div>
        ) : (
          <EmptyCart />
        )}
      </div>
    </div>
  );
};

export default CartPage;
