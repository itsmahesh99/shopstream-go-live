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
  LogOut,
  Home,
  User,
  Package
} from 'lucide-react';

interface InfluencerSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isMobile?: boolean;
}

const InfluencerSidebar: React.FC<InfluencerSidebarProps> = ({ 
  isOpen = true, 
  onClose, 
  isMobile = false 
}) => {
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
      path: "/influencer/products", 
      label: "Product Catalog", 
      icon: Package,
      description: "Manage your products"
    },
    { 
      path: "/influencer/profile", 
      label: "Profile", 
      icon: User,
      description: "Manage your profile"
    }
    // { 
    //   path: "/influencer/analytics", 
    //   label: "Analytics", 
    //   icon: BarChart3,
    //   description: "Performance insights"
    // },
    // { 
    //   path: "/influencer/audience", 
    //   label: "Audience", 
    //   icon: Users,
    //   description: "Follower management"
    // }
  ];

  const handleLinkClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  const sidebarContent = (
    <>
      {/* Header */}
      <div className="p-6 border-b">
        <Link 
          to="/influencer/dashboard" 
          className="flex items-center space-x-3"
          onClick={handleLinkClick}
        >
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
      <div className="p-4 border-b" style={{ backgroundColor: 'hsl(270.74deg 91.01% 90%)' }}>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'hsl(270.74deg 91.01% 65.1%)' }}>
            <span className="text-white font-medium">
              {getUserDisplayName().charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900">{getUserDisplayName()}</p>
            <p className="text-sm" style={{ color: 'hsl(270.74deg 91.01% 65.1%)' }}>Influencer</p>
          </div>
        </div>
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
              onClick={handleLinkClick}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 group ${
                active
                  ? "border"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
              style={active ? { 
                backgroundColor: 'hsl(270.74deg 91.01% 90%)', 
                color: 'hsl(270.74deg 91.01% 45%)',
                borderColor: 'hsl(270.74deg 91.01% 75%)'
              } : {}}
            >
              <Icon 
                className={`h-5 w-5 ${active ? "" : "text-gray-400 group-hover:text-gray-600"}`}
                style={active ? { color: 'hsl(270.74deg 91.01% 55%)' } : {}}
              />
              <div className="flex-1">
                <p 
                  className={`font-medium ${active ? "" : "text-gray-700 group-hover:text-gray-900"}`}
                  style={active ? { color: 'hsl(270.74deg 91.01% 45%)' } : {}}
                >
                  {item.label}
                </p>
                <p 
                  className={`text-xs ${active ? "" : "text-gray-500 group-hover:text-gray-600"}`}
                  style={active ? { color: 'hsl(270.74deg 91.01% 55%)' } : {}}
                >
                  {item.description}
                </p>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t space-y-2">
        <Link to="/influencer/settings" onClick={handleLinkClick}>
          <Button variant="ghost" className="w-full justify-start">
            <Settings className="mr-3 h-4 w-4" />
            Settings
          </Button>
        </Link>
        
        <Button
          variant="ghost"
          onClick={() => {
            signOut();
            handleLinkClick();
          }}
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="mr-3 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </>
  );

  // Mobile version - overlay
  if (isMobile) {
    return (
      <>
        {/* Backdrop */}
        {isOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={onClose}
          />
        )}
        
        {/* Mobile Sidebar */}
        <div className={`
          fixed left-0 top-0 h-full w-80 bg-white border-r z-50 transform transition-transform duration-300 ease-in-out lg:hidden
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          {sidebarContent}
        </div>
      </>
    );
  }

  // Desktop version
  return (
    <div className="hidden lg:block fixed left-0 top-0 h-full w-64 bg-white border-r z-40">
      {sidebarContent}
    </div>
  );
};

export default InfluencerSidebar;
