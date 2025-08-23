import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { UserRole } from '@/types/database'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
  allowedRoles?: UserRole[]
  redirectTo?: string
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = true, 
  allowedRoles,
  redirectTo = '/login' 
}) => {
  const { userProfile, loading, user } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  if (requireAuth && !userProfile) {
    // Redirect to login page with return url
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  if (!requireAuth && userProfile) {
    // Redirect authenticated users away from auth pages to their appropriate dashboard
    const role = userProfile.role
    switch (role) {
      case 'customer':
        return <Navigate to="/home" replace />
      case 'influencer':
        return <Navigate to="/influencer/dashboard" replace />
      case 'wholesaler':
        return <Navigate to="/wholesaler/dashboard" replace />
      default:
        return <Navigate to="/home" replace />
    }
  }

  // Check role-based access
  if (requireAuth && allowedRoles && userProfile) {
    const userRole = userProfile.role
    if (!allowedRoles.includes(userRole)) {
      // Redirect to appropriate dashboard based on user role
      switch (userRole) {
        case 'customer':
          return <Navigate to="/home" replace />
        case 'influencer':
          return <Navigate to="/influencer/dashboard" replace />
        case 'wholesaler':
          return <Navigate to="/wholesaler/dashboard" replace />
        default:
          return <Navigate to="/home" replace />
      }
    }
  }

  return <>{children}</>
}

export default ProtectedRoute
