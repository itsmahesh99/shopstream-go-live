import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Video, Calendar, BarChart3, User } from 'lucide-react';

interface MobileBottomNavProps {
  userType: 'influencer' | 'wholesaler';
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ userType }) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  const influencerItems = [
    { path: `/influencer/dashboard`, label: 'Dashboard', icon: Home },
    { path: `/influencer/live`, label: 'Go Live', icon: Video },
    { path: `/influencer/profile`, label: 'Profile', icon: User }
  ];

  const wholesalerItems = [
    { path: `/wholesaler/dashboard`, label: 'Dashboard', icon: Home },
    { path: `/wholesaler/products`, label: 'Products', icon: Video },
    { path: `/wholesaler/orders`, label: 'Orders', icon: Calendar },
    { path: `/wholesaler/analytics`, label: 'Analytics', icon: BarChart3 },
  ];

  const items = userType === 'influencer' ? influencerItems : wholesalerItems;
  const accentColor = userType === 'influencer' ? 'purple' : 'green';

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="flex justify-around items-center h-16 px-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center w-full h-full py-1 transition-colors duration-200 ${
                active 
                  ? `text-${accentColor}-600` 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className={`h-5 w-5 mb-1 ${
                active 
                  ? `text-${accentColor}-600` 
                  : 'text-gray-400'
              }`} />
              <span className={`text-xs font-medium truncate ${
                active 
                  ? `text-${accentColor}-600` 
                  : 'text-gray-500'
              }`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
