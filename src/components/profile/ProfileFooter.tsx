
import React from "react";
import { Button } from "@/components/ui/button";
import KeinLogo from "@/components/common/KeinLogo";

const ProfileFooter = () => {
  return (
    <div className="mt-8 bg-gray-100 pt-6 pb-20">
      <div className="container mx-auto px-4">
        <div className="mb-4 flex items-center justify-between">
          <KeinLogo className="h-8" />
          <Button variant="outline" size="sm" className="text-sm border-[#003366] text-[#003366]">
            Get the app
          </Button>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-xs mb-6">
          <div>
            <h4 className="font-medium mb-2">Kein</h4>
            <ul className="space-y-2 text-gray-600">
              <li>Blog</li>
              <li>Careers</li>
              <li>About Us</li>
              <li>FAQ</li>
              <li>Seller Affiliates</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Get Help</h4>
            <ul className="space-y-2 text-gray-600">
              <li>Order Status</li>
              <li>Shipping and Returns</li>
              <li>Payment Options</li>
              <li>Contact Us</li>
            </ul>
          </div>
        </div>
        
        <div className="text-xs text-gray-500 text-center pt-4 border-t border-gray-200">
          <p>© 2024 Kein Inc.</p>
          <div className="flex justify-center space-x-4 mt-2">
            <span>Terms</span>
            <span>Privacy</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileFooter;
