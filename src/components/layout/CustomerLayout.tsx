import React from 'react';
import { Outlet } from 'react-router-dom';
import CustomerNavbar from '@/components/layout/CustomerNavbar';
import Footer from '@/components/layout/Footer';
import BottomNav from '@/components/layout/BottomNav';

const CustomerLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <CustomerNavbar />
      <main className="pb-16 md:pb-0">
        <Outlet />
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
};

export default CustomerLayout;
