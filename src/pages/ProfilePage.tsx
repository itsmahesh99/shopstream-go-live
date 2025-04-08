
import React from "react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Bell, ChevronRight, Settings, Package, CreditCard, Star, MessageCircle, ShoppingBag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import KeinLogo from "@/components/common/KeinLogo";

// Mock data
const user = {
  name: "Romina",
  image: "/lovable-uploads/f8d1a83b-970d-4d3a-966a-e0e1deaddb20.png",
};

const ProfilePage = () => {
  const { toast } = useToast();
  
  const handleBecomeSeller = () => {
    toast({
      title: "Become a seller",
      description: "Taking you to the seller onboarding page",
    });
  };

  return (
    <div className="pb-20 bg-gray-50">
      {/* Profile header */}
      <div className="flex items-center justify-between px-4 py-4 bg-white">
        <div className="flex items-center">
          <img
            src={user.image}
            alt={user.name}
            className="h-10 w-10 rounded-full object-cover mr-3"
          />
          <h1 className="text-xl font-bold">Hello, {user.name}!</h1>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline"
            size="sm"
            className="border-kein-blue text-kein-blue h-8"
            onClick={handleBecomeSeller}
          >
            Become seller
          </Button>
          <Link to="/settings" className="text-gray-500">
            <Settings className="h-5 w-5" />
          </Link>
        </div>
      </div>
      
      {/* Announcements */}
      <div className="px-4 mt-4 mb-4">
        <div className="bg-kein-lightblue rounded-lg px-4 py-3 flex items-start justify-between">
          <div>
            <h3 className="font-medium text-sm">Announcement</h3>
            <p className="text-xs text-gray-600 mt-1">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt labore et dolore
            </p>
          </div>
          <Button size="icon" variant="ghost" className="h-5 w-5 text-gray-400">
            <Bell className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* User activity menu */}
      <div className="px-4 mb-6">
        <div className="bg-white rounded-lg overflow-hidden">
          <div className="grid grid-cols-4 text-center">
            <Link to="/orders" className="flex flex-col items-center justify-center p-3">
              <div className="bg-kein-lightblue rounded-full p-2 mb-1">
                <Package className="h-5 w-5 text-kein-blue" />
              </div>
              <span className="text-xs">Orders</span>
            </Link>
            <Link to="/payments" className="flex flex-col items-center justify-center p-3">
              <div className="bg-kein-lightblue rounded-full p-2 mb-1">
                <CreditCard className="h-5 w-5 text-kein-blue" />
              </div>
              <span className="text-xs">Payments</span>
            </Link>
            <Link to="/reviews" className="flex flex-col items-center justify-center p-3">
              <div className="bg-kein-lightblue rounded-full p-2 mb-1">
                <Star className="h-5 w-5 text-kein-blue" />
              </div>
              <span className="text-xs">Reviews</span>
            </Link>
            <Link to="/chat" className="flex flex-col items-center justify-center p-3">
              <div className="bg-kein-lightblue rounded-full p-2 mb-1">
                <MessageCircle className="h-5 w-5 text-kein-blue" />
              </div>
              <span className="text-xs">Chat</span>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Order status tabs */}
      <div className="px-4 mb-6">
        <h3 className="font-medium mb-3">My Orders</h3>
        <Tabs defaultValue="to-pay" className="w-full">
          <TabsList className="grid grid-cols-4 w-full bg-gray-100 p-1">
            <TabsTrigger value="to-pay" className="text-xs">To Pay</TabsTrigger>
            <TabsTrigger value="to-ship" className="text-xs">To Ship</TabsTrigger>
            <TabsTrigger value="to-receive" className="text-xs">To Receive</TabsTrigger>
            <TabsTrigger value="to-review" className="text-xs">To Review</TabsTrigger>
          </TabsList>
          <TabsContent value="to-pay" className="mt-2">
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="flex flex-col items-center justify-center py-6">
                <ShoppingBag className="h-12 w-12 text-gray-300 mb-2" />
                <p className="text-gray-500 text-sm">No orders waiting for payment</p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="to-ship" className="mt-2">
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="flex flex-col items-center justify-center py-6">
                <ShoppingBag className="h-12 w-12 text-gray-300 mb-2" />
                <p className="text-gray-500 text-sm">No orders waiting to ship</p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="to-receive" className="mt-2">
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="flex flex-col items-center justify-center py-6">
                <ShoppingBag className="h-12 w-12 text-gray-300 mb-2" />
                <p className="text-gray-500 text-sm">No orders to receive</p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="to-review" className="mt-2">
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="flex flex-col items-center justify-center py-6">
                <ShoppingBag className="h-12 w-12 text-gray-300 mb-2" />
                <p className="text-gray-500 text-sm">No orders to review</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Services */}
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
      
      {/* About */}
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
      
      {/* Footer */}
      <div className="mt-8 bg-gray-100 pt-6 pb-20">
        <div className="container mx-auto px-4">
          <div className="mb-4 flex items-center justify-between">
            <KeinLogo className="h-8" variant="full" />
            <Button variant="outline" size="sm" className="text-sm border-kein-blue text-kein-blue">
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
    </div>
  );
};

export default ProfilePage;
