import React from 'react';
import { Outlet } from 'react-router-dom';
import InfluencerSidebar from '@/components/layout/InfluencerSidebar';
import Footer from '@/components/layout/Footer';

const InfluencerLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex flex-1">
        <InfluencerSidebar />
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

export default InfluencerLayout;
