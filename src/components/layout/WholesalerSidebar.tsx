import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Package, 
  BarChart3, 
  ShoppingCart, 
  Settings, 
  TrendingUp,
  DollarSign,
  LogOut,
  Home,
  Users,
  FileText,
  Plus
} from 'lucide-react';

const WholesalerSidebar = () => {
  const { userProfile, signOut } = useAuth();
  const location = useLocation();

  const getUserDisplayName = () => {
    if (!userProfile?.profile) return 'Wholesaler';
    const profile = userProfile.profile as any;
    return profile.business_name || profile.contact_person_name || 'Wholesaler';
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  const sidebarItems = [
    { 
      path: "/wholesaler/dashboard", 
      label: "Dashboard", 
      icon: Home,
      description: "Overview & stats"
    },
    { 
      path: "/wholesaler/products", 
      label: "Products", 
      icon: Package,
      description: "Manage inventory"
    },
    { 
      path: "/wholesaler/orders", 
      label: "Orders", 
      icon: ShoppingCart,
      description: "Process orders"
    },
    { 
      path: "/wholesaler/analytics", 
      label: "Analytics", 
      icon: BarChart3,
      description: "Sales insights"
    },
    { 
      path: "/wholesaler/customers", 
      label: "Customers", 
      icon: Users,
      description: "Customer management"
    },
    { 
      path: "/wholesaler/earnings", 
      label: "Earnings", 
      icon: DollarSign,
      description: "Revenue tracking"
    },
    { 
      path: "/wholesaler/reports", 
      label: "Reports", 
      icon: FileText,
      description: "Business reports"
    }
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg border-r z-40">
      {/* Header */}
      <div className="p-6 border-b">
        <Link to="/wholesaler/dashboard" className="flex items-center space-x-3">
          <img 
            src="/keinlogo.png" 
            alt="Kein Logo" 
            className="h-8 w-auto"
          />
          <div>
            <h2 className="font-semibold text-gray-900">Business Hub</h2>
          </div>
        </Link>
      </div>

      {/* User Info */}
      <div className="p-4 border-b bg-green-50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white font-medium">
              {getUserDisplayName().charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900 text-sm">{getUserDisplayName()}</p>
            <p className="text-sm text-green-600">Wholesaler</p>
          </div>
        </div>
      </div>

      {/* Quick Action */}
      <div className="p-4 border-b">
        <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 group ${
                active
                  ? "bg-green-100 text-green-700 border border-green-200"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon className={`h-5 w-5 ${active ? "text-green-600" : "text-gray-400 group-hover:text-gray-600"}`} />
              <div className="flex-1">
                <p className={`font-medium ${active ? "text-green-700" : "text-gray-700 group-hover:text-gray-900"}`}>
                  {item.label}
                </p>
                <p className={`text-xs ${active ? "text-green-600" : "text-gray-500 group-hover:text-gray-600"}`}>
                  {item.description}
                </p>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t space-y-2">
        <Link to="/wholesaler/settings">
          <Button variant="ghost" className="w-full justify-start">
            <Settings className="mr-3 h-4 w-4" />
            Settings
          </Button>
        </Link>
        
        <Button
          variant="ghost"
          onClick={signOut}
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="mr-3 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default WholesalerSidebar;
