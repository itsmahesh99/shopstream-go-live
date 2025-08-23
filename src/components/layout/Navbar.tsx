
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, ShoppingBag, Home, Heart, Play, User, Menu, X, Bell, Store, Headphones } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const { totalItems } = useCart();
  const { user, userProfile } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Helper function to get user display name based on role
  const getUserDisplayName = () => {
    if (!userProfile?.profile) return user?.email?.split('@')[0] || 'User';
    
    const profile = userProfile.profile;
    const role = userProfile.role;
    
    switch (role) {
      case 'customer':
        const customer = profile as any;
        return customer.first_name || user?.email?.split('@')[0] || 'Customer';
      
      case 'wholesaler':
        const wholesaler = profile as any;
        return wholesaler.contact_person_name || wholesaler.business_name || user?.email?.split('@')[0] || 'Wholesaler';
      
      case 'influencer':
        const influencer = profile as any;
        return influencer.display_name || influencer.first_name || user?.email?.split('@')[0] || 'Influencer';
      
      default:
        return user?.email?.split('@')[0] || 'User';
    }
  };
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: "/home", label: "Home", icon: Home },
    { path: "/shop", label: "Shop", icon: Store },
    { path: "/play", label: "Live", icon: Play },
    { path: "/wishlist", label: "Wishlist", icon: Heart },
  ];
  
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/home" className="flex-shrink-0">
              <img 
                src="/keinlogo.png" 
                alt="Kein Logo" 
                className="h-10 w-auto"
              />
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 flex-1 justify-center">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link 
                  key={item.path}
                  to={item.path} 
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-50 ${
                    isActive(item.path) 
                      ? "text-kein-blue bg-kein-blue/5 border border-kein-blue/20" 
                      : "text-gray-600 hover:text-kein-blue"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

        
          
          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-gray-600" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                3
              </Badge>
            </Button>
            
            <Button variant="ghost" size="icon" className="relative">
              <Headphones className="h-5 w-5 text-gray-600" />
            </Button>
            
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingBag className="h-5 w-5 text-gray-600" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </Link>

            <div className="flex items-center space-x-2 border-l pl-4">
              {user ? (
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-kein-blue flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="hidden lg:block">
                    <Link to="/profile" className="hover:text-kein-blue transition-colors">
                      <p className="text-sm font-medium">{getUserDisplayName()}</p>
                    </Link>
                  </div>
                </div>
              ) : (
                <>
                  <Button variant="outline" size="sm" className="border-kein-blue text-kein-blue hover:bg-kein-blue hover:text-white" asChild>
                    <Link to="/login">Sign In</Link>
                  </Button>
                  <Button size="sm" className="bg-kein-blue hover:bg-kein-blue/90" asChild>
                    <Link to="/signup">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center space-x-2">
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingBag className="h-5 w-5 text-gray-600" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </Link>

            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5 text-gray-600" />
              ) : (
                <Menu className="h-5 w-5 text-gray-600" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden mt-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 w-full rounded-full border-gray-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t pt-4">
            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link 
                    key={item.path}
                    to={item.path} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive(item.path) 
                        ? "text-kein-blue bg-kein-blue/5" 
                        : "text-gray-600 hover:text-kein-blue hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            
            <div className="mt-4 pt-4 border-t space-y-2">
              {user ? (
                <div className="flex items-center space-x-3 px-3 py-2">
                  <div className="w-8 h-8 rounded-full bg-kein-blue flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-kein-blue transition-colors">
                      <p className="text-sm font-medium">{getUserDisplayName()}</p>
                    </Link>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
              ) : (
                <>
                  <Button variant="outline" className="w-full border-kein-blue text-kein-blue" asChild>
                    <Link to="/login">Sign In</Link>
                  </Button>
                  <Button className="w-full bg-kein-blue hover:bg-kein-blue/90" asChild>
                    <Link to="/signup">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
