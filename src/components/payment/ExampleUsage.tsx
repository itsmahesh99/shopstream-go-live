
import React from "react";
import { Button } from "@/components/ui/button";
import PaymentOptionsSheet from "./PaymentOptionsSheet";

const ExampleUsage = () => {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Payment Options Example</h1>
      
      <PaymentOptionsSheet
        triggerButton={
          <Button className="w-full">
            Proceed to Checkout
          </Button>
        }
      />
    </div>
  );
};

export default ExampleUsage;
