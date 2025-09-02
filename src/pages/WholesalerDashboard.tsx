import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Package, 
  TrendingUp, 
  DollarSign, 
  Users,
  ShoppingCart,
  AlertCircle,
  Plus,
  BarChart3
} from 'lucide-react';

const WholesalerDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-6 md:mb-8 text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Welcome, {user?.user_metadata?.businessName || 'Wholesaler'}!
          </h1>
          <p className="text-gray-600 mt-2 text-sm md:text-base">
            Manage your products and track your business performance
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          <Button className="h-auto p-3 md:p-4 bg-blue-500 hover:bg-blue-600 text-sm md:text-base">
            <Plus className="mr-2 h-4 w-4 md:h-5 md:w-5" />
            Add Product
          </Button>
          <Button variant="outline" className="h-auto p-3 md:p-4 text-sm md:text-base">
            <Package className="mr-2 h-4 w-4 md:h-5 md:w-5" />
            Manage Inventory
          </Button>
          <Button variant="outline" className="h-auto p-3 md:p-4 text-sm md:text-base">
            <ShoppingCart className="mr-2 h-4 w-4 md:h-5 md:w-5" />
            View Orders
          </Button>
          <Button variant="outline" className="h-auto p-3 md:p-4 text-sm md:text-base">
            <BarChart3 className="mr-2 h-4 w-4 md:h-5 md:w-5" />
            Analytics
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center">
                <DollarSign className="h-6 w-6 md:h-8 md:w-8 text-green-500" />
                <div className="ml-3 md:ml-4">
                  <p className="text-xs md:text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-xl md:text-2xl font-bold text-gray-900">$12,450</p>
                  <p className="text-xs md:text-sm text-green-600">+12.5% from last month</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center">
                <Package className="h-6 w-6 md:h-8 md:w-8 text-blue-500" />
                <div className="ml-3 md:ml-4">
                  <p className="text-xs md:text-sm font-medium text-gray-600">Products Listed</p>
                  <p className="text-xl md:text-2xl font-bold text-gray-900">247</p>
                  <p className="text-xs md:text-sm text-blue-600">15 added this month</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center">
                <ShoppingCart className="h-6 w-6 md:h-8 md:w-8 text-purple-500" />
                <div className="ml-3 md:ml-4">
                  <p className="text-xs md:text-sm font-medium text-gray-600">Orders</p>
                  <p className="text-xl md:text-2xl font-bold text-gray-900">89</p>
                  <p className="text-xs md:text-sm text-purple-600">23 pending</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center">
                <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-orange-500" />
                <div className="ml-3 md:ml-4">
                  <p className="text-xs md:text-sm font-medium text-gray-600">Conversion Rate</p>
                  <p className="text-xl md:text-2xl font-bold text-gray-900">3.2%</p>
                  <p className="text-xs md:text-sm text-orange-600">+0.8% improvement</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center text-base md:text-lg">
                    <ShoppingCart className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                    Recent Orders
                  </span>
                  <Button size="sm" className="text-xs md:text-sm">View All</Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 md:p-6">
                <div className="space-y-3 md:space-y-4">
                  {[
                    { id: 'ORD-001', customer: 'John Doe', amount: '$299.99', status: 'Processing', items: 3 },
                    { id: 'ORD-002', customer: 'Sarah Smith', amount: '$189.50', status: 'Shipped', items: 2 },
                    { id: 'ORD-003', customer: 'Mike Johnson', amount: '$450.00', status: 'Delivered', items: 5 },
                    { id: 'ORD-004', customer: 'Emma Wilson', amount: '$125.75', status: 'Processing', items: 1 }
                  ].map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 md:p-4 border rounded-lg hover:bg-gray-50">
                      <div>
                        <p className="font-medium text-sm md:text-base">{order.id}</p>
                        <p className="text-xs md:text-sm text-gray-600">{order.customer}</p>
                        <p className="text-xs md:text-sm text-gray-600">{order.items} items</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm md:text-base">{order.amount}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-600' :
                          order.status === 'Shipped' ? 'bg-blue-100 text-blue-600' :
                          'bg-yellow-100 text-yellow-600'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Low Stock Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-orange-600">
                  <AlertCircle className="mr-2 h-5 w-5" />
                  Low Stock Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'Wireless Headphones', stock: 3 },
                    { name: 'Gaming Mouse', stock: 5 },
                    { name: 'USB-C Cable', stock: 2 }
                  ].map((product, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-orange-600">{product.stock} units left</p>
                      </div>
                      <Button size="sm" variant="outline">
                        Restock
                      </Button>
                    </div>
                  ))}
                </div>
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
                    { name: 'Bluetooth Speaker', sales: 45, revenue: '$2,250' },
                    { name: 'Smartphone Case', sales: 38, revenue: '$950' },
                    { name: 'Laptop Stand', sales: 29, revenue: '$1,450' }
                  ].map((product, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <p className="font-medium text-sm">{product.name}</p>
                      <div className="flex justify-between text-xs text-gray-600 mt-1">
                        <span>{product.sales} sold</span>
                        <span>{product.revenue}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Revenue Growth</span>
                    <span className="text-sm font-medium text-green-600">+12.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">New Products</span>
                    <span className="text-sm font-medium">15</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Customer Rating</span>
                    <span className="text-sm font-medium">4.8/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Response Time</span>
                    <span className="text-sm font-medium">2.3 hours</span>
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

export default WholesalerDashboard;
