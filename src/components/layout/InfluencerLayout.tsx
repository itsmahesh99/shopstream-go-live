import React from 'react';
import { Outlet } from 'react-router-dom';
import InfluencerSidebar from '@/components/layout/InfluencerSidebar';
import InfluencerMobileHeader from '@/components/layout/InfluencerMobileHeader';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import { useIsMobile } from '@/hooks/use-mobile';

const InfluencerLayout = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      {isMobile && <InfluencerMobileHeader />}

      <div className="flex">
        {/* Sidebar - Only show on desktop */}
        {!isMobile && (
          <InfluencerSidebar 
            isOpen={true}
            isMobile={false}
          />
        )}

        {/* Main Content */}
        <main className={`
          flex-1 min-h-screen
          ${isMobile ? 'w-full pt-16 pb-16' : 'lg:ml-64'}
        `}>
          <div className="h-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      {isMobile && <MobileBottomNav userType="influencer" />}
    </div>
  );
};

export default InfluencerLayout;
