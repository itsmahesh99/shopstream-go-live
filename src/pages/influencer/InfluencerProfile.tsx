import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  User,
  Mail,
  Phone,
  Users,
  Calendar,
  Edit,
  Verified,
  Star,
  TrendingUp,
  Eye,
  DollarSign,
  Award,
  Target,
  Clock,
  Video,
  Loader2,
  Settings,
  BarChart3,
  Activity,
  Globe
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { InfluencerService } from '../../services/influencerService';
import { Influencer, InfluencerStats } from '../../types/influencer';
import { toast } from 'sonner';

const InfluencerProfile: React.FC = () => {
  const { user, userProfile } = useAuth();
  const [influencer, setInfluencer] = useState<Influencer | null>(null);
  const [stats, setStats] = useState<InfluencerStats | null>(null);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [recentSessions, setRecentSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      loadInfluencerData();
    }
  }, [user?.id]);

  const loadInfluencerData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load influencer profile
      const { data: profileData, error: profileError } = await InfluencerService.getInfluencerProfile(user!.id);

      if (profileError || !profileData) {
        setError('Failed to load profile data');
        return;
      }

      setInfluencer(profileData);

      // Load additional data in parallel
      const [statsResult, achievementsResult, goalsResult, sessionsResult] = await Promise.all([
        InfluencerService.getInfluencerStats(profileData.id),
        InfluencerService.getInfluencerAchievements(profileData.id),
        InfluencerService.getInfluencerGoals(profileData.id),
        InfluencerService.getRecentLiveSessions(profileData.id, 3)
      ]);

      if (statsResult.data) setStats(statsResult.data);
      if (achievementsResult.data) setAchievements(achievementsResult.data);
      if (goalsResult.data) setGoals(goalsResult.data);
      if (sessionsResult.data) setRecentSessions(sessionsResult.data);

    } catch (error) {
      console.error('Error loading influencer data:', error);
      setError('Failed to load profile data');
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96 border bg-white">
          <CardContent className="pt-8 pb-8">
            <div className="text-center">
              <div className="relative mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full" style={{ backgroundColor: 'hsl(270.74deg 91.01% 65.1%)' }}>
                  <Loader2 className="h-8 w-8 animate-spin text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Loading Profile</h3>
              <p className="text-gray-600">Fetching your profile information...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !influencer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96 border bg-white">
          <CardContent className="pt-8 pb-8">
            <div className="text-center">
              <div className="text-red-500 mb-4">
                <User className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Profile Not Found</h3>
              <p className="text-gray-600 mb-4">{error || 'Unable to load profile data'}</p>
              <Button onClick={loadInfluencerData} variant="outline">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Mobile spacing */}
        <div className="lg:hidden pt-4"></div>

        {/* Header Section */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <Avatar className="w-24 h-24 border-4 border-gray-100">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${influencer.display_name || influencer.first_name}`} />
                <AvatarFallback className="text-xl font-bold text-white" style={{ backgroundColor: 'hsl(270.74deg 91.01% 65.1%)' }}>
                  {getInitials(influencer.display_name || `${influencer.first_name} ${influencer.last_name}` || 'IN')}
                </AvatarFallback>
              </Avatar>

              <div className="text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {influencer.display_name || `${influencer.first_name} ${influencer.last_name}`}
                  </h1>
                  {influencer.is_verified && (
                    <Verified className="h-6 w-6 text-blue-500" />
                  )}
                </div>
                <p className="text-gray-600 mb-3">{influencer.email}</p>
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  <Badge
                    variant={influencer.is_active ? 'default' : 'secondary'}
                    style={influencer.is_active ? { backgroundColor: 'hsl(270.74deg 91.01% 65.1%)' } : {}}
                  >
                    {influencer.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                  <Badge variant={influencer.verification_status === 'verified' ? 'default' : 'outline'}>
                    {influencer.verification_status}
                  </Badge>
                  {influencer.category && (
                    <Badge variant="outline">{influencer.category}</Badge>
                  )}
                </div>
                {influencer.bio && (
                  <p className="text-gray-700 mt-3 max-w-md leading-relaxed">
                    {influencer.bio}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </Button>
              <Button className="flex items-center gap-2" style={{ backgroundColor: 'hsl(270.74deg 91.01% 65.1%)' }}>
                <Edit className="h-4 w-4" />
                Edit Profile
              </Button>
            </div>
          </div>
        </div>

        {/* Analytics Overview */}
        {stats && (
          <Card className="border bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" style={{ color: 'hsl(270.74deg 91.01% 65.1%)' }} />
                Analytics Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                <div className="text-center p-4 rounded-lg bg-green-50 border border-green-100">
                  <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalEarnings)}</p>
                  <p className="text-sm text-gray-600">Total Earnings</p>
                </div>

                <div className="text-center p-4 rounded-lg border" style={{ backgroundColor: 'hsl(270.74deg 91.01% 95%)', borderColor: 'hsl(270.74deg 91.01% 85%)' }}>
                  <Video className="h-8 w-8 mx-auto mb-2" style={{ color: 'hsl(270.74deg 91.01% 65.1%)' }} />
                  <p className="text-2xl font-bold text-gray-900">{stats.totalStreams}</p>
                  <p className="text-sm text-gray-600">Total Streams</p>
                </div>

                <div className="text-center p-4 rounded-lg bg-blue-50 border border-blue-100">
                  <Eye className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{stats.totalViewers.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Total Viewers</p>
                </div>

                <div className="text-center p-4 rounded-lg bg-orange-50 border border-orange-100">
                  <TrendingUp className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{Math.round(stats.averageViewers)}</p>
                  <p className="text-sm text-gray-600">Avg Viewers</p>
                </div>

                <div className="text-center p-4 rounded-lg bg-indigo-50 border border-indigo-100">
                  <Users className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{stats.followersCount.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Followers</p>
                </div>

                <div className="text-center p-4 rounded-lg bg-yellow-50 border border-yellow-100">
                  <Star className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{(stats.conversionRate * 100).toFixed(1)}%</p>
                  <p className="text-sm text-gray-600">Conversion</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal Information */}
          <Card className="border bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" style={{ color: 'hsl(270.74deg 91.01% 65.1%)' }} />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Full Name</label>
                  <p className="text-gray-900 font-medium mt-1">
                    {`${influencer.first_name || ''} ${influencer.last_name || ''}`.trim() || 'Not provided'}
                  </p>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Display Name</label>
                  <p className="text-gray-900 font-medium mt-1">{influencer.display_name || 'Not provided'}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900 text-sm">{influencer.email}</span>
                </div>

                {influencer.phone && (
                  <div className="flex items-center gap-3 p-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900 text-sm">{influencer.phone}</span>
                  </div>
                )}

                <div className="flex items-center gap-3 p-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900 text-sm">Joined {formatDate(influencer.created_at)}</span>
                </div>

                <div className="flex items-center gap-3 p-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900 text-sm">{influencer.experience_years} years experience</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Media */}
          <Card className="border bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-600" />
                Social Media
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {influencer.instagram_handle && (
                <div className="flex items-center gap-3 p-3 bg-pink-50 rounded-lg border border-pink-100">
                  <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                    <Globe className="h-4 w-4 text-pink-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Instagram</p>
                    <p className="text-sm text-gray-600">@{influencer.instagram_handle}</p>
                  </div>
                </div>
              )}

              {influencer.youtube_channel && (
                <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <Video className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">YouTube</p>
                    <p className="text-sm text-gray-600">{influencer.youtube_channel}</p>
                  </div>
                </div>
              )}

              {influencer.tiktok_handle && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <Video className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">TikTok</p>
                    <p className="text-sm text-gray-600">@{influencer.tiktok_handle}</p>
                  </div>
                </div>
              )}

              {!influencer.instagram_handle && !influencer.youtube_channel && !influencer.tiktok_handle && (
                <div className="text-center py-8">
                  <Globe className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 mb-3">No social media accounts linked</p>
                  <Button variant="outline" size="sm">
                    Add Social Media
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-600" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Video className="h-4 w-4 mr-2" />
                Start Live Stream
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Account Settings
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Manage Followers
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Achievements and Goals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Achievements */}
          <Card className="border bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-600" />
                  Recent Achievements
                </div>
                <Badge variant="outline" className="text-xs">
                  {achievements.length} total
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {achievements.length > 0 ? (
                <div className="space-y-3">
                  {achievements.slice(0, 3).map((achievement) => (
                    <div key={achievement.id} className="flex items-start gap-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-100">
                      <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Award className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 mb-1">{achievement.title}</p>
                        <p className="text-sm text-gray-600 leading-relaxed">{achievement.description}</p>
                      </div>
                      {achievement.is_completed && (
                        <Badge className="bg-yellow-500 hover:bg-yellow-600 flex-shrink-0">
                          ✓ Done
                        </Badge>
                      )}
                    </div>
                  ))}
                  {achievements.length > 3 && (
                    <Button variant="ghost" className="w-full mt-2 text-sm">
                      View all {achievements.length} achievements
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="h-8 w-8 text-yellow-600" />
                  </div>
                  <p className="text-gray-900 font-medium mb-2">No achievements yet</p>
                  <p className="text-sm text-gray-500 mb-4">Start streaming to unlock your first achievement!</p>
                  <Button size="sm" style={{ backgroundColor: 'hsl(270.74deg 91.01% 65.1%)' }}>
                    Start Streaming
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Active Goals */}
          <Card className="border bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-600" />
                  Active Goals
                </div>
                <Badge variant="outline" className="text-xs">
                  {goals.length} active
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {goals.length > 0 ? (
                <div className="space-y-4">
                  {goals.slice(0, 3).map((goal) => (
                    <div key={goal.id} className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
                      <div className="flex items-center justify-between mb-3">
                        <p className="font-semibold text-gray-900">{goal.title}</p>
                        <Badge variant="secondary" className="text-xs">
                          {goal.period_type}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>{goal.current_value} / {goal.target_value} {goal.unit}</span>
                          <span className="font-medium">{Math.round(goal.completion_percentage)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(goal.completion_percentage, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {goals.length > 3 && (
                    <Button variant="ghost" className="w-full mt-2 text-sm">
                      View all {goals.length} goals
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="h-8 w-8 text-green-600" />
                  </div>
                  <p className="text-gray-900 font-medium mb-2">No active goals</p>
                  <p className="text-sm text-gray-500 mb-4">Set goals to track your progress and stay motivated!</p>
                  <Button variant="outline" size="sm">
                    Set Your First Goal
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Live Sessions */}
        {recentSessions.length > 0 && (
          <Card className="border bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Video className="h-5 w-5" style={{ color: 'hsl(270.74deg 91.01% 65.1%)' }} />
                  Recent Live Sessions
                </div>
                <Button variant="ghost" size="sm" className="text-sm">
                  View All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentSessions.map((session, index) => (
                  <div key={session.id} className="flex items-center gap-4 p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: 'hsl(270.74deg 91.01% 95%)' }}>
                      <Video className="h-5 w-5" style={{ color: 'hsl(270.74deg 91.01% 65.1%)' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 mb-1">{session.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{formatDate(session.created_at)}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {session.peak_viewers} peak viewers
                        </span>
                      </div>
                    </div>
                    <Badge
                      variant={session.status === 'live' ? 'destructive' : 'secondary'}
                      className={session.status === 'live' ? 'bg-red-500 hover:bg-red-600' : ''}
                    >
                      {session.status === 'live' ? '🔴 LIVE' : session.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default InfluencerProfile;