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
  Edit
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

// Mock data
const user = {
  name: "Romina",
  email: "romina@example.com",
  phone: "+1 234 567 8900",
  location: "New York, USA",
  joinDate: "Member since March 2023",
  image: "/lovable-uploads/f8d1a83b-970d-4d3a-966a-e0e1deaddb20.png",
  stats: {
    orders: 24,
    reviews: 12,
    wishlist: 8,
    points: 1250
  }
};

const orderStats = [
  { label: "To Pay", count: 0, color: "bg-red-50 text-red-600" },
  { label: "To Ship", count: 0, color: "bg-blue-50 text-blue-600" },
  { label: "To Receive", count: 0, color: "bg-yellow-50 text-yellow-600" },
  { label: "To Review", count: 0, color: "bg-green-50 text-green-600" },
];

const quickActions = [
  { icon: Package, label: "My Orders", link: "/orders", color: "text-blue-600" },
  { icon: Heart, label: "Wishlist", link: "/wishlist", color: "text-red-500" },
  { icon: CreditCard, label: "Payments", link: "/payments", color: "text-green-600" },
  { icon: Star, label: "Reviews", link: "/reviews", color: "text-yellow-500" },
  { icon: MessageCircle, label: "Messages", link: "/messages", color: "text-purple-600" },
  { icon: Gift, label: "Rewards", link: "/rewards", color: "text-pink-600" },
];

const services = [
  { icon: HelpCircle, label: "Help Center", description: "Get help with your orders and account" },
  { icon: CreditCard, label: "Payment Methods", description: "Manage your payment options" },
  { icon: Truck, label: "Shipping & Delivery", description: "Track your orders and delivery info" },
  { icon: Settings, label: "Account Settings", description: "Manage your account preferences" },
];

const ProfilePage = () => {
  const { toast } = useToast();
  const [activeOrderTab, setActiveOrderTab] = useState("to-pay");
  
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

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-8">
      {/* Mobile Layout */}
      <div className="md:hidden">
        {/* Mobile Header */}
        <div className="bg-white px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.image} alt={user.name} />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl font-bold">Hello, {user.name}!</h1>
              <p className="text-sm text-gray-500">{user.joinDate}</p>
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
                <AvatarImage src={user.image} alt={user.name} />
                <AvatarFallback className="text-2xl">{user.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Hello, {user.name}!</h1>
                <p className="text-gray-600 mt-1">{user.joinDate}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <Mail className="h-4 w-4 mr-1" />
                    {user.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-1" />
                    {user.location}
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
                    <div className="text-2xl font-bold text-blue-600">{user.stats.orders}</div>
                    <div className="text-sm text-blue-600">Total Orders</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{user.stats.reviews}</div>
                    <div className="text-sm text-green-600">Reviews</div>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{user.stats.wishlist}</div>
                    <div className="text-sm text-red-600">Wishlist Items</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{user.stats.points}</div>
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
                    <div key={service.label} className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                      <div className="flex items-start space-x-3">
                        <service.icon className="h-6 w-6 text-kein-blue flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{service.label}</h4>
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
