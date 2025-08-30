
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Heart, Play, ShoppingBag, User, Square } from "lucide-react";

const BottomNav = () => {
  const location = useLocation();
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden">
      <div className="flex justify-around items-center h-16">
        <Link to="/home" className={`flex flex-col items-center justify-center w-full h-full ${isActive("/home") ? "text-kein-blue" : "text-gray-500"}`}>
          <Home className="h-5 w-5" />
          <span className="text-xs mt-1">Home</span>
        </Link>
        
        <Link to="/play" className={`flex flex-col items-center justify-center w-full h-full relative ${isActive("/play") ? "text-kein-blue" : "text-gray-500"}`}>
          <div className="bg-kein-blue rounded-full p-3 -mt-6 mb-1 shadow-md">
            <Play className="h-5 w-5 text-white" fill="white" />
          </div>
          <span className="text-xs">Live</span>
        </Link>
        
        <Link to="/play/feed" className={`flex flex-col items-center justify-center w-full h-full ${isActive("/play/feed") ? "text-kein-blue" : "text-gray-500"}`}>
          <div className="relative">
            <Square className="h-5 w-5" />
            <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
              <div className="w-2.5 h-2.5 text-white bg-gray-500" style={{ clipPath: 'polygon(0% 0%, 0% 100%, 100% 50%)' }}></div>
            </div>
          </div>
          <span className="text-xs mt-1">Shop</span>
        </Link>
        
        <Link to="/profile" className={`flex flex-col items-center justify-center w-full h-full ${isActive("/profile") ? "text-kein-blue" : "text-gray-500"}`}>
          <User className="h-5 w-5" />
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </div>
    </nav>;
};

export default BottomNav;
