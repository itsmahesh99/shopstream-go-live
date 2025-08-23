import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Video, 
  BarChart3, 
  Users, 
  Calendar, 
  Settings, 
  TrendingUp,
  Eye,
  DollarSign,
  LogOut,
  Home
} from 'lucide-react';

const InfluencerSidebar = () => {
  const { userProfile, signOut } = useAuth();
  const location = useLocation();

  const getUserDisplayName = () => {
    if (!userProfile?.profile) return 'Influencer';
    const profile = userProfile.profile as any;
    return profile.display_name || profile.first_name || 'Influencer';
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  const sidebarItems = [
    { 
      path: "/influencer/dashboard", 
      label: "Dashboard", 
      icon: Home,
      description: "Overview & stats"
    },
    { 
      path: "/influencer/live", 
      label: "Live Streaming", 
      icon: Video,
      description: "Start & manage streams"
    },
    { 
      path: "/influencer/schedule", 
      label: "Schedule", 
      icon: Calendar,
      description: "Upcoming streams"
    },
    { 
      path: "/influencer/analytics", 
      label: "Analytics", 
      icon: BarChart3,
      description: "Performance insights"
    },
    { 
      path: "/influencer/audience", 
      label: "Audience", 
      icon: Users,
      description: "Follower management"
    },
    { 
      path: "/influencer/earnings", 
      label: "Earnings", 
      icon: DollarSign,
      description: "Commission tracking"
    }
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg border-r z-40">
      {/* Header */}
      <div className="p-6 border-b">
        <Link to="/influencer/dashboard" className="flex items-center space-x-3">
          <img 
            src="/keinlogo.png" 
            alt="Kein Logo" 
            className="h-8 w-auto"
          />
          <div>
            <h2 className="font-semibold text-gray-900">Creator Studio</h2>
          </div>
        </Link>
      </div>

      {/* User Info */}
      <div className="p-4 border-b bg-purple-50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white font-medium">
              {getUserDisplayName().charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900">{getUserDisplayName()}</p>
            <p className="text-sm text-purple-600">Influencer</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 group ${
                active
                  ? "bg-purple-100 text-purple-700 border border-purple-200"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon className={`h-5 w-5 ${active ? "text-purple-600" : "text-gray-400 group-hover:text-gray-600"}`} />
              <div className="flex-1">
                <p className={`font-medium ${active ? "text-purple-700" : "text-gray-700 group-hover:text-gray-900"}`}>
                  {item.label}
                </p>
                <p className={`text-xs ${active ? "text-purple-600" : "text-gray-500 group-hover:text-gray-600"}`}>
                  {item.description}
                </p>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t space-y-2">
        <Link to="/influencer/settings">
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

export default InfluencerSidebar;
