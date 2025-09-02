import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  Bell, 
  LogOut, 
  Shield, 
  Users, 
  BarChart3,
  RefreshCw
} from "lucide-react";
import { AdminAuthService } from "@/services/adminAuthService";
import { toast } from "sonner";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const currentAdmin = AdminAuthService.getCurrentAdmin();

  const handleLogout = () => {
    AdminAuthService.logout();
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  const getAdminInitials = () => {
    if (!currentAdmin) return 'A';
    const name = currentAdmin.full_name || currentAdmin.email;
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section - Logo and Title */}
          <div className="flex items-center space-x-4">
            <Link to="/admin" className="flex items-center space-x-3">
              <img 
                src="/keinlogo.png" 
                alt="Kein Logo" 
                className="h-8 w-auto"
              />
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
                <p className="text-sm text-gray-500">Management Dashboard</p>
              </div>
            </Link>
          </div>

          {/* Center Section - Quick Stats (Hidden on mobile) */}
          <div className="hidden lg:flex items-center space-x-6">
            <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50 rounded-lg">
              <Users className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Influencers</span>
            </div>
            <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 rounded-lg">
              <BarChart3 className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-900">Analytics</span>
            </div>
            <div className="flex items-center space-x-2 px-3 py-2 bg-purple-50 rounded-lg">
              <Settings className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-900">Settings</span>
            </div>
          </div>

          {/* Right Section - Admin Actions */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-gray-600" />
              <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                2
              </Badge>
            </Button>

            {/* Admin Profile */}
            <div className="flex items-center space-x-3 px-3 py-2 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium text-sm"
                   style={{ backgroundColor: 'hsl(270.74deg 91.01% 65.1%)' }}>
                <Shield className="h-4 w-4" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">
                  {currentAdmin?.full_name || 'Admin'}
                </p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>

            {/* Logout Button */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>

        {/* Mobile Admin Info */}
        <div className="sm:hidden mt-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Admin Panel</h1>
            <p className="text-sm text-gray-500">
              Welcome, {currentAdmin?.full_name || currentAdmin?.email || 'Admin'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;