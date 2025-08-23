import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ShoppingBag, 
  Heart, 
  Clock, 
  Star,
  TrendingUp,
  Package
} from 'lucide-react';

const CustomerDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.user_metadata?.firstName || 'Customer'}!
          </h1>
          <p className="text-gray-600 mt-2">
            Discover amazing products and exclusive deals
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <ShoppingBag className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Heart className="h-8 w-8 text-red-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Wishlist Items</p>
                  <p className="text-2xl font-bold text-gray-900">8</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Star className="h-8 w-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Loyalty Points</p>
                  <p className="text-2xl font-bold text-gray-900">1,250</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Saved Amount</p>
                  <p className="text-2xl font-bold text-gray-900">$342</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="mr-2 h-5 w-5" />
                  Recent Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((order) => (
                    <div key={order} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                        <div>
                          <p className="font-medium">Order #KN00{order}</p>
                          <p className="text-sm text-gray-600">2 items • $89.99</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-green-600">Delivered</p>
                        <p className="text-sm text-gray-600">Dec {order + 10}, 2023</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View All Orders
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Live Streams & Deals */}
          <div className="space-y-6">
            {/* Live Streams */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Live Streams</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Fashion Show</span>
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">LIVE</span>
                    </div>
                    <p className="text-xs text-gray-600">@fashionista_jane</p>
                    <p className="text-xs text-gray-600">234 viewers</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Tech Reviews</span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Starting in 1h</span>
                    </div>
                    <p className="text-xs text-gray-600">@tech_guru</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  Explore Live Streams
                </Button>
              </CardContent>
            </Card>

            {/* Special Deals */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Special Deals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-medium text-blue-800">Flash Sale</p>
                    <p className="text-xs text-blue-600">Up to 70% off electronics</p>
                    <p className="text-xs text-blue-600">Ends in 2h 30m</p>
                  </div>
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm font-medium text-green-800">Free Shipping</p>
                    <p className="text-xs text-green-600">On orders over $50</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View All Deals
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
