
import React from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import PaymentMethodSelector from "./PaymentMethodSelector";
import DeliveryAddressForm from "./DeliveryAddressForm";
import OrderSummary from "./OrderSummary";
import CheckoutButton from "./CheckoutButton";
import usePaymentOptions from "./usePaymentOptions";

interface PaymentOptionsSheetProps {
  triggerButton: React.ReactNode;
}

const PaymentOptionsSheet = ({ triggerButton }: PaymentOptionsSheetProps) => {
  const { toast } = useToast();
  const { items, totalItems } = useCart();
  const { paymentMethod, deliveryAddress, handleCheckout } = usePaymentOptions();

  // Calculate totals
  const subtotal = items.reduce(
    (total, item) => total + (item.discountPrice || item.price) * item.quantity,
    0
  );
  const deliveryFee = 40;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + deliveryFee + tax;

  return (
    <Drawer>
      <DrawerTrigger asChild>{triggerButton}</DrawerTrigger>
      <DrawerContent className="max-h-[85vh]">
        <div className="px-4 pt-4 overflow-y-auto max-h-[calc(85vh-80px)]">
          <h2 className="text-lg font-semibold mb-4">Checkout</h2>
          
          {/* Payment method selection */}
          <PaymentMethodSelector 
            selectedMethod={paymentMethod.type}
            onSelectMethod={(method) => paymentMethod.setType(method)}
          />
          
          {/* Delivery address */}
          <DeliveryAddressForm 
            address={deliveryAddress.address}
            onAddressChange={(address) => deliveryAddress.setAddress(address)}
          />
          
          {/* Order summary */}
          <OrderSummary 
            items={items}
            subtotal={subtotal}
            deliveryFee={deliveryFee}
            tax={tax}
            total={total}
          />
        </div>
        
        {/* Checkout button */}
        <DrawerFooter className="px-4 py-4 border-t">
          <CheckoutButton 
            total={total}
            itemCount={totalItems}
            onCheckout={() => handleCheckout({
              items,
              paymentMethod: paymentMethod.type,
              deliveryAddress: deliveryAddress.address,
              subtotal,
              deliveryFee,
              tax,
              total
            })}
          />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default PaymentOptionsSheet;
