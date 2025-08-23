import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Video, 
  Users, 
  DollarSign, 
  TrendingUp,
  Play,
  Eye,
  Heart,
  Share2,
  Calendar,
  BarChart3
} from 'lucide-react';

const InfluencerDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {user?.user_metadata?.name || user?.user_metadata?.username || 'Creator'}!
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your content and track your streaming performance
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Button className="h-auto p-4 bg-purple-500 hover:bg-purple-600">
            <Video className="mr-2 h-5 w-5" />
            Start Live Stream
          </Button>
          <Button variant="outline" className="h-auto p-4">
            <Calendar className="mr-2 h-5 w-5" />
            Schedule Stream
          </Button>
          <Button variant="outline" className="h-auto p-4">
            <BarChart3 className="mr-2 h-5 w-5" />
            View Analytics
          </Button>
          <Button variant="outline" className="h-auto p-4">
            <Users className="mr-2 h-5 w-5" />
            Audience Insights
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Followers</p>
                  <p className="text-2xl font-bold text-gray-900">12.5K</p>
                  <p className="text-sm text-purple-600">+245 this week</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Eye className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Views</p>
                  <p className="text-2xl font-bold text-gray-900">85.2K</p>
                  <p className="text-sm text-blue-600">+15% from last month</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Earnings</p>
                  <p className="text-2xl font-bold text-gray-900">$2,840</p>
                  <p className="text-sm text-green-600">+18.3% this month</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-orange-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Engagement Rate</p>
                  <p className="text-2xl font-bold text-gray-900">4.8%</p>
                  <p className="text-sm text-orange-600">Above average</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Streams */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Video className="mr-2 h-5 w-5" />
                    Recent Streams
                  </span>
                  <Button size="sm">View All</Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { 
                      title: 'Winter Fashion Haul', 
                      date: 'Dec 15, 2023', 
                      duration: '2h 15m', 
                      viewers: '1.2K',
                      revenue: '$340',
                      engagement: '5.2%'
                    },
                    { 
                      title: 'Tech Product Reviews', 
                      date: 'Dec 12, 2023', 
                      duration: '1h 45m', 
                      viewers: '890',
                      revenue: '$280',
                      engagement: '4.8%'
                    },
                    { 
                      title: 'Home Decor Tips', 
                      date: 'Dec 10, 2023', 
                      duration: '1h 30m', 
                      viewers: '650',
                      revenue: '$195',
                      engagement: '6.1%'
                    },
                    { 
                      title: 'Beauty & Skincare', 
                      date: 'Dec 8, 2023', 
                      duration: '2h 5m', 
                      viewers: '1.5K',
                      revenue: '$420',
                      engagement: '4.9%'
                    }
                  ].map((stream, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Play className="h-6 w-6 text-purple-500" />
                        </div>
                        <div>
                          <p className="font-medium">{stream.title}</p>
                          <p className="text-sm text-gray-600">{stream.date} • {stream.duration}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex space-x-4 text-sm">
                          <div>
                            <p className="text-gray-600">Viewers</p>
                            <p className="font-medium">{stream.viewers}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Revenue</p>
                            <p className="font-medium text-green-600">{stream.revenue}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Engagement</p>
                            <p className="font-medium">{stream.engagement}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Scheduled Streams */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Upcoming Streams
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { title: 'Holiday Gift Guide', date: 'Dec 18, 7:00 PM', products: 12 },
                    { title: 'Year-End Sale', date: 'Dec 20, 6:00 PM', products: 25 },
                    { title: 'New Year Prep', date: 'Dec 30, 8:00 PM', products: 8 }
                  ].map((stream, index) => (
                    <div key={index} className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                      <p className="font-medium text-sm">{stream.title}</p>
                      <p className="text-xs text-purple-600">{stream.date}</p>
                      <p className="text-xs text-gray-600">{stream.products} products featured</p>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  Schedule New Stream
                </Button>
              </CardContent>
            </Card>

            {/* Top Products */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Top Selling Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'Wireless Earbuds', commission: '$45.50', sales: 23 },
                    { name: 'Skincare Set', commission: '$38.20', sales: 18 },
                    { name: 'Smart Watch', commission: '$67.80', sales: 15 }
                  ].map((product, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <p className="font-medium text-sm">{product.name}</p>
                      <div className="flex justify-between text-xs text-gray-600 mt-1">
                        <span>{product.sales} sold</span>
                        <span className="text-green-600 font-medium">{product.commission}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Heart className="h-4 w-4 text-red-500" />
                    <div>
                      <p className="text-sm">+127 new likes</p>
                      <p className="text-xs text-gray-600">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="text-sm">+23 new followers</p>
                      <p className="text-xs text-gray-600">4 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Share2 className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="text-sm">Stream shared 45 times</p>
                      <p className="text-xs text-gray-600">6 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <DollarSign className="h-4 w-4 text-yellow-500" />
                    <div>
                      <p className="text-sm">Earned $89.40 commission</p>
                      <p className="text-xs text-gray-600">1 day ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfluencerDashboard;
