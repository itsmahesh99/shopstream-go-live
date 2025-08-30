import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Settings, 
  Package, 
  CreditCard, 
  Star, 
  MessageCircle, 
  ShoppingBag, 
  ChevronRight,
  Bell,
  Heart,
  Gift,
  HelpCircle,
  Truck,
  User,
  MapPin,
  Phone,
  Mail,
  Edit,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

// Mock data for order stats - this would come from API in real app

const orderStats = [
  { label: "To Pay", count: 0, color: "bg-red-50 text-red-600" },
  { label: "To Ship", count: 0, color: "bg-blue-50 text-blue-600" },
  { label: "To Receive", count: 0, color: "bg-yellow-50 text-yellow-600" },
  { label: "To Review", count: 0, color: "bg-green-50 text-green-600" },
];

const quickActions = [
  { icon: Package, label: "My Orders", link: "/orders", color: "text-blue-600" },
  { icon: CreditCard, label: "Payments", link: "/payments", color: "text-green-600" },
  { icon: Star, label: "Reviews", link: "/reviews", color: "text-yellow-500" },
  { icon: MessageCircle, label: "Messages", link: "/messages", color: "text-purple-600" },
  { icon: Gift, label: "Rewards", link: "/rewards", color: "text-pink-600" },
];

const services = [
  { icon: HelpCircle, label: "Help Center", description: "Get help with your orders and account", link: "/help" },
  { icon: CreditCard, label: "Payment Methods", description: "Manage your payment options", link: "/payment-methods" },
  { icon: Truck, label: "Shipping & Delivery", description: "Track your orders and delivery info", link: "/shipping" },
  { icon: Settings, label: "Account Settings", description: "Manage your account preferences", link: "/account-settings" },
  { icon: LogOut, label: "Logout", description: "Sign out of your account", action: "logout" },
];

const ProfilePage = () => {
  const { toast } = useToast();
  const { user, userProfile, loading, signOut } = useAuth();
  const [activeOrderTab, setActiveOrderTab] = useState("to-pay");
  
  // Show loading state while authentication is being checked
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }
  
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

  // Use actual user data or fallback to defaults
  const userData = {
    name: getUserDisplayName(),
    email: user?.email || "",
    phone: "+1 234 567 8900", // This would come from profile data
    location: "Location not set", // This would come from profile data  
    joinDate: `Member since ${new Date(user?.created_at || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}`,
    image: "/lovable-uploads/f8d1a83b-970d-4d3a-966a-e0e1deaddb20.png",
    stats: {
      orders: 24,
      reviews: 12,
      points: 1250
    }
  };
  
  const handleBecomeSeller = () => {
    toast({
      title: "Become a seller",
      description: "Taking you to the seller onboarding page",
    });
  };

  const handleEditProfile = () => {
    toast({
      title: "Edit Profile",
      description: "Opening profile editor",
    });
  };

  const handleLogout = async () => {
    try {
      const { error } = await signOut();
      if (error) {
        toast({
          title: "Logout Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Logged Out",
          description: "You have been successfully logged out",
        });
      }
    } catch (error) {
      toast({
        title: "Logout Failed", 
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-8">
      {/* Mobile Layout */}
      <div className="md:hidden">
        {/* Mobile Header */}
        <div className="bg-white px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={userData.image} alt={userData.name} />
              <AvatarFallback>{userData.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl font-bold">Hello, {userData.name}!</h1>
              <p className="text-sm text-gray-500">{userData.joinDate}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline"
              size="sm"
              className="border-kein-blue text-kein-blue"
              onClick={handleBecomeSeller}
            >
              Become seller
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Announcement Card */}
        <div className="px-4 py-2">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-blue-900">Announcement</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt labore et dolore
                  </p>
                </div>
                <Bell className="h-5 w-5 text-blue-600 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="px-4 py-2">
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-4 gap-4">
                {quickActions.slice(0, 4).map((action) => (
                  <Link key={action.label} to={action.link} className="flex flex-col items-center">
                    <div className="bg-gray-50 rounded-full p-3 mb-2">
                      <action.icon className={`h-5 w-5 ${action.color}`} />
                    </div>
                    <span className="text-xs text-center">{action.label}</span>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders Section */}
        <div className="px-4 py-2">
          <h3 className="font-medium mb-3">My Orders</h3>
          <Card>
            <CardContent className="p-4">
              <Tabs value={activeOrderTab} onValueChange={setActiveOrderTab}>
                <TabsList className="grid grid-cols-4 w-full">
                  {orderStats.map((stat) => (
                    <TabsTrigger key={stat.label.toLowerCase().replace(' ', '-')} value={stat.label.toLowerCase().replace(' ', '-')} className="text-xs">
                      {stat.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {orderStats.map((stat) => (
                  <TabsContent key={stat.label.toLowerCase().replace(' ', '-')} value={stat.label.toLowerCase().replace(' ', '-')} className="mt-4">
                    <div className="text-center py-8">
                      <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No orders waiting for {stat.label.toLowerCase()}</p>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Services */}
        <div className="px-4 py-2">
          <h3 className="font-medium mb-3">Services</h3>
          <Card>
            <CardContent className="p-0">
              {services.map((service, index) => (
                <div key={service.label} className={`flex items-center justify-between p-4 ${index !== services.length - 1 ? 'border-b' : ''}`}>
                  <div className="flex items-center space-x-3">
                    <service.icon className="h-5 w-5 text-gray-600" />
                    <span className="text-sm">{service.label}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block max-w-7xl mx-auto px-4 py-8">
        {/* Desktop Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={userData.image} alt={userData.name} />
                <AvatarFallback className="text-2xl">{userData.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Hello, {userData.name}!</h1>
                <p className="text-gray-600 mt-1">{userData.joinDate}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <Mail className="h-4 w-4 mr-1" />
                    {userData.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-1" />
                    {userData.location}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={handleEditProfile}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
              <Button onClick={handleBecomeSeller} className="bg-kein-blue hover:bg-kein-blue/90">
                Become Seller
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Stats & Quick Actions */}
          <div className="lg:col-span-1 space-y-6">
            {/* User Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Account Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{userData.stats.orders}</div>
                    <div className="text-sm text-blue-600">Total Orders</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{userData.stats.reviews}</div>
                    <div className="text-sm text-green-600">Reviews</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{userData.stats.points}</div>
                    <div className="text-sm text-yellow-600">Reward Points</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {quickActions.map((action) => (
                    <Link key={action.label} to={action.link}>
                      <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-4 text-center">
                          <action.icon className={`h-8 w-8 mx-auto mb-2 ${action.color}`} />
                          <div className="text-sm font-medium">{action.label}</div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Announcement */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-blue-900">Announcements</CardTitle>
                  <Bell className="h-5 w-5 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-blue-700">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt labore et dolore
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Orders & Services */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <Card>
              <CardHeader>
                <CardTitle>Order Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4 mb-6">
                  {orderStats.map((stat) => (
                    <div key={stat.label} className="text-center">
                      <div className={`rounded-lg p-4 ${stat.color.replace('text-', 'bg-').replace('-600', '-50')}`}>
                        <div className={`text-2xl font-bold ${stat.color}`}>
                          {stat.count}
                        </div>
                        <div className={`text-sm ${stat.color}`}>
                          {stat.label}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Tabs value={activeOrderTab} onValueChange={setActiveOrderTab}>
                  <TabsList className="grid grid-cols-4 w-full">
                    {orderStats.map((stat) => (
                      <TabsTrigger key={stat.label.toLowerCase().replace(' ', '-')} value={stat.label.toLowerCase().replace(' ', '-')}>
                        {stat.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {orderStats.map((stat) => (
                    <TabsContent key={stat.label.toLowerCase().replace(' ', '-')} value={stat.label.toLowerCase().replace(' ', '-')} className="mt-6">
                      <div className="text-center py-12">
                        <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                        <p className="text-gray-500">No orders waiting for {stat.label.toLowerCase()}</p>
                        <Button className="mt-4" variant="outline">
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          Start Shopping
                        </Button>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>

            {/* Services & Support */}
            <Card>
              <CardHeader>
                <CardTitle>Services & Support</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.map((service) => (
                    <div 
                      key={service.label} 
                      className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => {
                        if (service.action === "logout") {
                          handleLogout();
                        } else if (service.link) {
                          // Handle navigation to link (could add router navigation here)
                          console.log(`Navigate to ${service.link}`);
                        }
                      }}
                    >
                      <div className="flex items-start space-x-3">
                        <service.icon className={`h-6 w-6 flex-shrink-0 mt-0.5 ${service.action === "logout" ? "text-red-500" : "text-kein-blue"}`} />
                        <div className="flex-1">
                          <h4 className={`font-medium ${service.action === "logout" ? "text-red-600" : "text-gray-900"}`}>{service.label}</h4>
                          <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
