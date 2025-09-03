import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useInfluencer } from '@/hooks/useInfluencer';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface ProfileCompletionGuardProps {
  children: React.ReactNode;
}

const ProfileCompletionGuard: React.FC<ProfileCompletionGuardProps> = ({ children }) => {
  const { influencer, loading, hasProfile } = useInfluencer();
  const navigate = useNavigate();
  const location = useLocation();

  // Don't guard the profile completion page itself
  const isProfileCompletionPage = location.pathname === '/influencer/profile-completion';

  useEffect(() => {
    if (!loading && !hasProfile && !isProfileCompletionPage) {
      navigate('/influencer/profile-completion');
    }
  }, [loading, hasProfile, isProfileCompletionPage, navigate]);

  // Show loading state
  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // If no profile and not on profile completion page, don't render anything
  // (useEffect will handle the redirect)
  if (!hasProfile && !isProfileCompletionPage) {
    return (
      <div className="p-6">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              Profile Setup Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Redirecting to profile completion page...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If profile exists or on profile completion page, render children
  return <>{children}</>;
};

export default ProfileCompletionGuard;
