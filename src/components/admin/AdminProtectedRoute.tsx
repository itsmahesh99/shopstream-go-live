import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AdminAuthService } from '@/services/adminAuthService';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // Check if admin is logged in
        const isLoggedIn = AdminAuthService.isAdminLoggedIn();
        
        if (!isLoggedIn) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // Verify the session is still valid
        const isValidSession = await AdminAuthService.verifyAdminSession();
        setIsAuthenticated(isValidSession);
      } catch (error) {
        console.error('Error checking admin authentication:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;
