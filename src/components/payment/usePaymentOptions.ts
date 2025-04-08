
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export type PaymentMethodType = "card" | "upi" | "cod" | "wallet";
export type DeliveryAddressType = {
  name: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
};

export type CheckoutDataType = {
  items: any[];
  paymentMethod: PaymentMethodType;
  deliveryAddress: DeliveryAddressType;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
};

const usePaymentOptions = () => {
  const { clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Payment method state
  const [paymentMethodType, setPaymentMethodType] = useState<PaymentMethodType>("card");
  
  // Delivery address state with default values
  const [deliveryAddressData, setDeliveryAddressData] = useState<DeliveryAddressType>({
    name: "John Doe",
    street: "123 Main St",
    city: "Bangalore",
    state: "Karnataka",
    postalCode: "560001",
    phone: "9876543210"
  });
  
  // Handle checkout submission
  const handleCheckout = (checkoutData: CheckoutDataType) => {
    // This would typically call an API to process the payment
    console.log("Processing checkout:", checkoutData);
    
    // Simulate successful payment
    setTimeout(() => {
      toast({
        title: "Order placed successfully!",
        description: `Your order of ₹${checkoutData.total} has been placed successfully.`,
      });
      
      // Clear cart after successful order
      clearCart();
      
      // Redirect to order confirmation page
      navigate("/order-confirmation");
    }, 1500);
  };
  
  return {
    paymentMethod: {
      type: paymentMethodType,
      setType: setPaymentMethodType
    },
    deliveryAddress: {
      address: deliveryAddressData,
      setAddress: setDeliveryAddressData
    },
    handleCheckout
  };
};

export default usePaymentOptions;
