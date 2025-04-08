
import React from "react";
import { DeliveryAddressType } from "./usePaymentOptions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface DeliveryAddressFormProps {
  address: DeliveryAddressType;
  onAddressChange: (address: DeliveryAddressType) => void;
}

const DeliveryAddressForm = ({ address, onAddressChange }: DeliveryAddressFormProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onAddressChange({
      ...address,
      [name]: value,
    });
  };

  return (
    <div className="py-4 border-b">
      <h3 className="font-medium mb-3">Delivery Address</h3>
      <div className="space-y-3">
        <div className="grid gap-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            value={address.name}
            onChange={handleChange}
            placeholder="Enter your full name"
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="street">Street Address</Label>
          <Input
            id="street"
            name="street"
            value={address.street}
            onChange={handleChange}
            placeholder="Enter street address"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="grid gap-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              name="city"
              value={address.city}
              onChange={handleChange}
              placeholder="City"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              name="state"
              value={address.state}
              onChange={handleChange}
              placeholder="State"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="grid gap-2">
            <Label htmlFor="postalCode">Postal Code</Label>
            <Input
              id="postalCode"
              name="postalCode"
              value={address.postalCode}
              onChange={handleChange}
              placeholder="Postal code"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              value={address.phone}
              onChange={handleChange}
              placeholder="Phone number"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryAddressForm;
