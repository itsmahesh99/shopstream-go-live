
import React from "react";
import { Link } from "react-router-dom";
import { Package, CreditCard, Star, MessageCircle } from "lucide-react";

const UserActivityMenu = () => {
  return (
    <div className="px-4 mb-6">
      <div className="bg-white rounded-lg overflow-hidden">
        <div className="grid grid-cols-4 text-center">
          <Link to="/orders" className="flex flex-col items-center justify-center p-3">
            <div className="bg-[#E5F0F9] rounded-full p-2 mb-1">
              <Package className="h-5 w-5 text-[#003366]" />
            </div>
            <span className="text-xs">Orders</span>
          </Link>
          <Link to="/payments" className="flex flex-col items-center justify-center p-3">
            <div className="bg-[#E5F0F9] rounded-full p-2 mb-1">
              <CreditCard className="h-5 w-5 text-[#003366]" />
            </div>
            <span className="text-xs">Payments</span>
          </Link>
          <Link to="/reviews" className="flex flex-col items-center justify-center p-3">
            <div className="bg-[#E5F0F9] rounded-full p-2 mb-1">
              <Star className="h-5 w-5 text-[#003366]" />
            </div>
            <span className="text-xs">Reviews</span>
          </Link>
          <Link to="/chat" className="flex flex-col items-center justify-center p-3">
            <div className="bg-[#E5F0F9] rounded-full p-2 mb-1">
              <MessageCircle className="h-5 w-5 text-[#003366]" />
            </div>
            <span className="text-xs">Chat</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserActivityMenu;
