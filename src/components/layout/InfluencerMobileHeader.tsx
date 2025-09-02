import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Menu, 
  Bell, 
  Video,
  Sparkles,
  Zap
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import InfluencerSidebar from './InfluencerSidebar';

const InfluencerMobileHeader: React.FC = () => {
  const { userProfile } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const getUserDisplayName = () => {
    if (!userProfile?.profile) return 'Influencer';
    const profile = userProfile.profile as any;
    return profile.display_name || profile.first_name || 'Influencer';
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'Dashboard';
    if (path.includes('/live')) return 'Live Streaming';
    if (path.includes('/profile')) return 'My Profile';
    if (path.includes('/schedule')) return 'Schedule';
    if (path.includes('/settings')) return 'Settings';
    return 'Creator Studio';
  };

  const getPageIcon = () => {
    const path = location.pathname;
    if (path.includes('/live')) return <Video className="h-5 w-5 text-purple-600" />;
    if (path.includes('/profile')) return <Avatar className="w-5 h-5" />;
    return <Sparkles className="h-5 w-5 text-purple-600" />;
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const isLivePage = location.pathname.includes('/live');

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 h-16">
          {/* Left Section - Menu & Page Info */}
          <div className="flex items-center space-x-3 flex-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="p-2 hover:bg-purple-50"
            >
              <Menu className="h-5 w-5 text-gray-700" />
            </Button>
            
            <div className="flex items-center space-x-2 min-w-0">
              {getPageIcon()}
              <div className="min-w-0">
                <h1 className="text-lg font-bold text-gray-900 truncate">{getPageTitle()}</h1>
                {isLivePage && (
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-600 font-medium">Ready to stream</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Section - Actions & Profile */}
          <div className="flex items-center space-x-2">
            {/* Quick Go Live Button */}
            {!isLivePage && (
              <Link to="/influencer/live">
                <Button 
                  size="sm" 
                  className="text-white px-3 py-1.5 h-8 text-xs font-semibold hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: 'hsl(270.74deg 91.01% 65.1%)' }}
                >
                  <Zap className="h-3 w-3 mr-1" />
                  Go Live
                </Button>
              </Link>
            )}

            {/* Notifications */}
            <Button variant="ghost" size="sm" className="p-2 relative hover:bg-purple-50">
              <Bell className="h-5 w-5 text-gray-600" />
              <Badge className="absolute -top-1 -right-1 w-2 h-2 p-0 bg-red-500 border-white"></Badge>
            </Button>

            {/* Profile Avatar */}
            <Link to="/influencer/profile">
              <Avatar className="w-9 h-9 border-2 border-purple-200 hover:border-purple-300 transition-colors">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${getUserDisplayName()}`} />
                <AvatarFallback className="text-xs font-bold text-white" style={{ backgroundColor: 'hsl(270.74deg 91.01% 65.1%)' }}>
                  {getInitials(getUserDisplayName())}
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <InfluencerSidebar 
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
        isMobile={true}
      />
    </>
  );
};

export default InfluencerMobileHeader;