
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
    <div className="min-h-screen pb-20 md:pb-8 bg-gray-50">
      <div className="sticky top-0 z-30 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">My Cart ({items.length} items)</h1>
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
      
      <div className="max-w-7xl mx-auto px-4 py-4">
        {items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map(item => (
                <CartItem 
                  key={item.id}
                  {...item}
                  onRemove={handleRemoveFromCart}
                />
              ))}
            </div>
            
            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <CouponInput />
                <CartSummary />
                
                {/* Checkout button */}
                <Button 
                  className="w-full bg-kein-blue hover:bg-kein-blue/90 h-12"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </Button>
                
                {/* Additional info on desktop */}
                <div className="hidden lg:block bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium mb-2">Shipping & Returns</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Free shipping on orders over ₹999</li>
                    <li>• 30-day easy returns</li>
                    <li>• Secure payment processing</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <EmptyCart />
        )}
      </div>
    </div>
  );
};

export default CartPage;
