import React from 'react';
import { useInfluencer } from '@/hooks/useInfluencer';
import InfluencerDashboardMain from '@/pages/influencer/InfluencerDashboardMain';
import InfluencerProfileSetup from '@/components/influencer/InfluencerProfileSetup';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

const InfluencerDashboardWrapper: React.FC = () => {
  const { influencer, loading, error, fetchInfluencer, hasProfile } = useInfluencer();

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
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-4 w-24 mb-4" />
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Show profile setup if no profile exists
  if (!hasProfile && !loading) {
    return <InfluencerProfileSetup onProfileCreated={fetchInfluencer} />;
  }

  // Show main dashboard
  return <InfluencerDashboardMain />;
};

export default InfluencerDashboardWrapper;
