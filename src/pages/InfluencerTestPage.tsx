import React from 'react';
import { useInfluencer, useInfluencerStats, useInfluencerAchievements, useInfluencerGoals } from '@/hooks/useInfluencer';
import InfluencerProfileSetup from '@/components/influencer/InfluencerProfileSetup';
import AchievementsDisplay from '@/components/influencer/AchievementsDisplay';
import GoalsTracker from '@/components/influencer/GoalsTracker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  User, 
  BarChart3, 
  Trophy, 
  Target,
  RefreshCw,
  Database
} from 'lucide-react';

const InfluencerTestPage = () => {
  const { influencer, loading: profileLoading, hasProfile, fetchInfluencer } = useInfluencer();
  const { stats, loading: statsLoading } = useInfluencerStats();
  const { achievements, loading: achievementsLoading } = useInfluencerAchievements();
  const { goals, loading: goalsLoading } = useInfluencerGoals();

  const allLoading = profileLoading || statsLoading || achievementsLoading || goalsLoading;

  // If no profile exists, show setup
  if (!hasProfile && !profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Influencer Dashboard Test
            </h1>
            <p className="text-lg text-gray-600">
              Testing database integration with Supabase
            </p>
          </div>
          <InfluencerProfileSetup onProfileCreated={fetchInfluencer} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Influencer Dashboard Test
            </h1>
            <p className="text-lg text-gray-600">
              Database Integration Status: 
              <Badge className="ml-2" variant={hasProfile ? "default" : "destructive"}>
                <Database className="h-3 w-3 mr-1" />
                {hasProfile ? "Connected" : "Not Connected"}
              </Badge>
            </p>
          </div>
          <Button onClick={fetchInfluencer} disabled={allLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${allLoading ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
        </div>

        {/* Profile Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            {profileLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-4 w-32" />
              </div>
            ) : influencer ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Display Name</p>
                  <p className="text-lg font-semibold">{influencer.display_name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-lg">{influencer.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Full Name</p>
                  <p className="text-lg">{influencer.first_name} {influencer.last_name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Category</p>
                  <p className="text-lg">{influencer.category || 'Not specified'}</p>
                </div>
                {influencer.bio && (
                  <div className="md:col-span-2">
                    <p className="text-sm font-medium text-gray-500">Bio</p>
                    <p className="text-gray-700">{influencer.bio}</p>
                  </div>
                )}
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-gray-500">Social Media</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {influencer.instagram_handle && (
                      <Badge variant="outline">Instagram: {influencer.instagram_handle}</Badge>
                    )}
                    {influencer.youtube_channel && (
                      <Badge variant="outline">YouTube: {influencer.youtube_channel}</Badge>
                    )}
                    {influencer.tiktok_handle && (
                      <Badge variant="outline">TikTok: {influencer.tiktok_handle}</Badge>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No profile data found</p>
            )}
          </CardContent>
        </Card>

        {/* Stats */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="text-center">
                    <Skeleton className="h-8 w-16 mx-auto mb-2" />
                    <Skeleton className="h-4 w-20 mx-auto" />
                  </div>
                ))}
              </div>
            ) : stats ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{stats.totalStreams}</p>
                  <p className="text-sm text-gray-600">Total Streams</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{stats.totalViewers.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Total Viewers</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">{stats.averageViewers}</p>
                  <p className="text-sm text-gray-600">Avg Viewers</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">{stats.followersCount.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-teal-600">{(stats.conversionRate * 100).toFixed(1)}%</p>
                  <p className="text-sm text-gray-600">Conversion Rate</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No stats data found</p>
            )}
          </CardContent>
        </Card>

        {/* Achievements and Goals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AchievementsDisplay />
          <GoalsTracker />
        </div>

        {/* Debug Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Debug Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>Profile Loading:</strong> {profileLoading ? 'Yes' : 'No'}</p>
              <p><strong>Has Profile:</strong> {hasProfile ? 'Yes' : 'No'}</p>
              <p><strong>Stats Loading:</strong> {statsLoading ? 'Yes' : 'No'}</p>
              <p><strong>Achievements Count:</strong> {achievements.length}</p>
              <p><strong>Goals Count:</strong> {goals.length}</p>
              <p><strong>Achievements Loading:</strong> {achievementsLoading ? 'Yes' : 'No'}</p>
              <p><strong>Goals Loading:</strong> {goalsLoading ? 'Yes' : 'No'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InfluencerTestPage;
