
import React from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingBag } from "lucide-react";
import KeinLogo from "../common/KeinLogo";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/home" className="mr-4">
            <KeinLogo variant="logo1" className="h-8" />
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link to="/search">
            <Search className="h-5 w-5 text-gray-600" />
          </Link>
          <Link to="/cart" className="relative">
            <ShoppingBag className="h-5 w-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 bg-kein-coral text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              2
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
