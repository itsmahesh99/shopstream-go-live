import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface RoleBasedRedirectProps {
  children?: React.ReactNode;
}

const RoleBasedRedirect: React.FC<RoleBasedRedirectProps> = ({ children }) => {
  const { userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-kein-blue"></div>
      </div>
    );
  }

  if (!userProfile) {
    return <Navigate to="/login" replace />;
  }

  // Redirect based on user role
  switch (userProfile.role) {
    case 'customer':
      return <Navigate to="/home" replace />;
    case 'influencer':
      return <Navigate to="/influencer/dashboard" replace />;
    case 'wholesaler':
      return <Navigate to="/wholesaler/dashboard" replace />;
    default:
      return <Navigate to="/home" replace />;
  }
};

export default RoleBasedRedirect;
