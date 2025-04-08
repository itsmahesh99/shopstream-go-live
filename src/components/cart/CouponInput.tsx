
import React from "react";
import { Button } from "@/components/ui/button";

const CouponInput = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center flex-1">
          <input
            type="text"
            placeholder="Enter coupon code"
            className="w-full border-0 focus:outline-none text-sm"
          />
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="border-kein-blue text-kein-blue"
        >
          Apply
        </Button>
      </div>
    </div>
  );
};

export default CouponInput;
