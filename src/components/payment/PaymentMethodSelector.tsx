
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, Wallet, BanknoteIcon, IndianRupee } from "lucide-react";
import { PaymentMethodType } from "./usePaymentOptions";

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethodType;
  onSelectMethod: (method: PaymentMethodType) => void;
}

const PaymentMethodSelector = ({ 
  selectedMethod, 
  onSelectMethod 
}: PaymentMethodSelectorProps) => {
  return (
    <div className="py-4 border-b">
      <h3 className="font-medium mb-3">Payment Method</h3>
      <RadioGroup 
        value={selectedMethod} 
        onValueChange={(value) => onSelectMethod(value as PaymentMethodType)}
        className="space-y-2"
      >
        <div className="flex items-center space-x-3 rounded-md border p-3">
          <RadioGroupItem value="card" id="card" />
          <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
            <CreditCard className="h-5 w-5 text-kein-blue" />
            <span>Credit/Debit Card</span>
          </Label>
        </div>
        
        <div className="flex items-center space-x-3 rounded-md border p-3">
          <RadioGroupItem value="upi" id="upi" />
          <Label htmlFor="upi" className="flex items-center gap-2 cursor-pointer">
            <IndianRupee className="h-5 w-5 text-kein-blue" />
            <span>UPI Payment</span>
          </Label>
        </div>
        
        <div className="flex items-center space-x-3 rounded-md border p-3">
          <RadioGroupItem value="wallet" id="wallet" />
          <Label htmlFor="wallet" className="flex items-center gap-2 cursor-pointer">
            <Wallet className="h-5 w-5 text-kein-blue" />
            <span>Wallet</span>
          </Label>
        </div>
        
        <div className="flex items-center space-x-3 rounded-md border p-3">
          <RadioGroupItem value="cod" id="cod" />
          <Label htmlFor="cod" className="flex items-center gap-2 cursor-pointer">
            <BanknoteIcon className="h-5 w-5 text-kein-blue" />
            <span>Cash on Delivery</span>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default PaymentMethodSelector;
