import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import LiveStreamSimplified from '@/components/live-stream/LiveStreamSimplified';
import { useAuth } from '@/contexts/AuthContext';

const InfluencerLiveStreamPage: React.FC = () => {
  const { userProfile } = useAuth();

  if (userProfile?.role !== 'influencer') {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              <Alert variant="destructive">
                <Video className="h-4 w-4" />
                <AlertDescription>
                  This page is only accessible to influencers. Please log in with an influencer account.
                </AlertDescription>
              </Alert>
              <div className="mt-4">
                <Link to="/dashboard">
                  <Button variant="outline">
                    Back to Dashboard
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">


      {/* Main Content */}
      <div className="p-6">
        <LiveStreamSimplified />
      </div>
    </div>
  );
};

export default InfluencerLiveStreamPage;
