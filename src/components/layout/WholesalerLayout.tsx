import React from 'react';
import { Outlet } from 'react-router-dom';
import WholesalerSidebar from '@/components/layout/WholesalerSidebar';
import Footer from '@/components/layout/Footer';

const WholesalerLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex flex-1">
        <WholesalerSidebar />
        <main className="flex-1 ml-64">
          <Outlet />
        </main>
      </div>
      <div className="ml-64">
        <Footer />
      </div>
    </div>
  );
};

export default WholesalerLayout;
