
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Heart, Play, ShoppingBag, User } from "lucide-react";

const BottomNav = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200">
      <div className="flex justify-around items-center h-16">
        <Link
          to="/home"
          className={`flex flex-col items-center justify-center w-full h-full ${
            isActive("/home") ? "text-kein-blue" : "text-gray-500"
          }`}
        >
          <Home className="h-5 w-5" />
          <span className="text-xs mt-1">Home</span>
        </Link>
        
        <Link
          to="/wishlist"
          className={`flex flex-col items-center justify-center w-full h-full ${
            isActive("/wishlist") ? "text-kein-blue" : "text-gray-500"
          }`}
        >
          <Heart className="h-5 w-5" />
          <span className="text-xs mt-1">Wishlist</span>
        </Link>
        
        <Link
          to="/play"
          className={`flex flex-col items-center justify-center w-full h-full relative ${
            isActive("/play") ? "text-kein-blue" : "text-gray-500"
          }`}
        >
          <div className="bg-kein-blue rounded-full p-3 -mt-6 mb-1 shadow-md">
            <Play className="h-5 w-5 text-white" fill="white" />
          </div>
          <span className="text-xs">Play</span>
        </Link>
        
        <Link
          to="/cart"
          className={`flex flex-col items-center justify-center w-full h-full ${
            isActive("/cart") ? "text-kein-blue" : "text-gray-500"
          }`}
        >
          <ShoppingBag className="h-5 w-5" />
          <span className="text-xs mt-1">Cart</span>
        </Link>
        
        <Link
          to="/profile"
          className={`flex flex-col items-center justify-center w-full h-full ${
            isActive("/profile") ? "text-kein-blue" : "text-gray-500"
          }`}
        >
          <User className="h-5 w-5" />
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </div>
    </nav>
  );
};

export default BottomNav;
