
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Heart, Play, ShoppingBag, User, ShoppingCart } from "lucide-react";

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
          to="/shop"
          className={`flex flex-col items-center justify-center w-full h-full ${
            isActive("/shop") ? "text-kein-blue" : "text-gray-500"
          }`}
        >
          <ShoppingCart className="h-5 w-5" />
          <span className="text-xs mt-1">Shop</span>
        </Link>
        
        <Link
          to="/live"
          className={`flex flex-col items-center justify-center w-full h-full ${
            location.pathname.includes("/live") ? "text-kein-blue" : "text-gray-500"
          }`}
        >
          <div className="bg-kein-blue rounded-full p-3 -mt-5 mb-1">
            <Play className="h-5 w-5 text-white" fill="white" />
          </div>
          <span className="text-xs">Live</span>
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
