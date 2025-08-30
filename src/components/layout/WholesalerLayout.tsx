import React from 'react';
import { Outlet } from 'react-router-dom';
import WholesalerSidebar from '@/components/layout/WholesalerSidebar';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import Footer from '@/components/layout/Footer';
import { useIsMobile } from '@/hooks/use-mobile';

const WholesalerLayout = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex flex-1">
        {/* Sidebar - Only show on desktop */}
        {!isMobile && (
          <WholesalerSidebar 
            isOpen={true}
            isMobile={false}
          />
        )}

        {/* Main Content */}
        <main className={`
          flex-1 min-h-full
          ${isMobile ? 'w-full pb-16' : 'lg:ml-64'}
        `}>
          <div className="h-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Footer - Only show on desktop */}
      {!isMobile && (
        <div className="lg:ml-64">
          <Footer />
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      {isMobile && <MobileBottomNav userType="wholesaler" />}
    </div>
  );
};

export default WholesalerLayout;
