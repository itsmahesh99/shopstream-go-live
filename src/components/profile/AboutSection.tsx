
import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const AboutSection = () => {
  return (
    <div className="px-4 mb-6">
      <div className="bg-white rounded-lg overflow-hidden">
        <h3 className="font-medium p-4 border-b">About</h3>
        
        <div className="divide-y">
          <Link to="/privacy-policy" className="flex items-center justify-between p-4">
            <span className="text-sm">Privacy Policy</span>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </Link>
          <Link to="/terms-conditions" className="flex items-center justify-between p-4">
            <span className="text-sm">Terms & Conditions</span>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </Link>
          <Link to="/about-us" className="flex items-center justify-between p-4">
            <span className="text-sm">About Us</span>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
