
import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const ServicesSection = () => {
  return (
    <div className="px-4 mb-6">
      <div className="bg-white rounded-lg overflow-hidden">
        <h3 className="font-medium p-4 border-b">Services</h3>
        
        <div className="divide-y">
          <Link to="/help-center" className="flex items-center justify-between p-4">
            <span className="text-sm">Help Center</span>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </Link>
          <Link to="/payment-methods" className="flex items-center justify-between p-4">
            <span className="text-sm">Payment Methods</span>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </Link>
          <Link to="/shipping-delivery" className="flex items-center justify-between p-4">
            <span className="text-sm">Shipping & Delivery</span>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServicesSection;
