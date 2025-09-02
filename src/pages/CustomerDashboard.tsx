import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Heart, 
  Clock, 
  Star,
  TrendingUp,
  Package,
  Play,
  User,
  Settings,
  CreditCard,
  Truck
} from 'lucide-react';

const CustomerDashboard = () => {
  const { user, userProfile } = useAuth();
  const [stats, setStats] = useState({
    totalOrders: 12,
    pendingDeliveries: 2,
    totalSpent: 45299
  });

  // Mock recent orders data - will be replaced with real data
  const recentOrders = [
    {
      id: '1',
      orderNumber: 'KN-2024-001',
      date: '2024-01-15',
      status: 'delivered',
      total: 1299.99,
      items: ['iPhone 15 Pro', 'AirPods Pro']
    },
    {
      id: '2', 
      orderNumber: 'KN-2024-002',
      date: '2024-01-20',
      status: 'shipped',
      total: 599.99,
      items: ['Samsung Galaxy Watch', 'Phone Case']
    }
  ];

  // Mock live streams data
  const recommendedStreams = [
    {
      id: '1',
      title: 'Tech Deals Live!',
      influencer: 'TechGuru Mike',
      viewers: 1234,
      thumbnail: '/lovable-uploads/7c48c057-d4b0-4193-9473-be6c8eee605c.png'
    },
    {
      id: '2',
      title: 'Fashion Friday',
      influencer: 'StyleSophie',
      viewers: 856,
      thumbnail: '/lovable-uploads/f8d1a83b-970d-4d3a-966a-e0e1deaddb20.png'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {
              userProfile?.role === 'customer' 
                ? (userProfile.profile as any)?.first_name 
                : userProfile?.role === 'influencer'
                ? (userProfile.profile as any)?.first_name
                : userProfile?.role === 'wholesaler'
                ? (userProfile.profile as any)?.contact_person_name
                : user?.user_metadata?.name || 'User'
            }!
          </h1>
          <p className="text-gray-600 mt-2">
            Discover amazing products and join live shopping experiences
          </p>
          <div className="mt-4 flex gap-4">
            <Link to="/shop/browse">
              <Button>
                <ShoppingBag className="h-4 w-4 mr-2" />
                Start Shopping
              </Button>
            </Link>
            <Link to="/play">
              <Button variant="outline">
                <Play className="h-4 w-4 mr-2" />
                Watch Live Streams
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <ShoppingBag className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Truck className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Deliveries</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingDeliveries}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CreditCard className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900">₹{stats.totalSpent.toLocaleString()}</p>
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
                <CardTitle className="text-lg">Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{order.orderNumber}</p>
                        <p className="text-sm text-gray-600">{order.items.join(', ')}</p>
                        <p className="text-xs text-gray-500">{order.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">₹{order.total}</p>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <Link to="/profile">
                  <Button variant="outline" className="w-full mt-4">
                    View All Orders
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Live Streams */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Live Streams</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recommendedStreams.map((stream) => (
                    <div key={stream.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <img 
                        src={stream.thumbnail} 
                        alt={stream.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{stream.title}</p>
                        <p className="text-xs text-gray-600">{stream.influencer}</p>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
                          <span className="text-xs text-gray-600">{stream.viewers} watching</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Link to="/play">
                  <Button variant="outline" size="sm" className="w-full mt-3">
                    View All Streams
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Link to="/account-settings">
                    <Button variant="ghost" className="w-full justify-start">
                      <Settings className="h-4 w-4 mr-2" />
                      Account Settings
                    </Button>
                  </Link>
                  <Link to="/cart">
                    <Button variant="ghost" className="w-full justify-start">
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Shopping Cart
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
