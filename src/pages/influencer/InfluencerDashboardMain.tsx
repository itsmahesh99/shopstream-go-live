import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Video, 
  Users, 
  DollarSign, 
  TrendingUp,
  Play,
  Eye,
  Calendar,
  BarChart3,
  Clock,
  Star
} from 'lucide-react';

const InfluencerDashboardMain = () => {
  const { userProfile } = useAuth();

  const getUserDisplayName = () => {
    if (!userProfile?.profile) return 'Creator';
    const profile = userProfile.profile as any;
    return profile.display_name || profile.first_name || 'Creator';
  };

  // Mock data for demonstration
  const stats = {
    totalStreams: 12,
    totalViewers: 2580,
    totalEarnings: 450.75,
    averageViewers: 215,
    upcomingStreams: 3,
    followers: 1250
  };

  const recentStreams = [
    {
      id: 1,
      title: "Fashion Haul & Styling Tips",
      date: "2024-12-20",
      viewers: 320,
      duration: "1h 25m",
      earnings: 85.50
    },
    {
      id: 2,
      title: "Winter Collection Review",
      date: "2024-12-18",
      viewers: 245,
      duration: "55m",
      earnings: 62.25
    },
    {
      id: 3,
      title: "Live Q&A with Audience",
      date: "2024-12-15",
      viewers: 180,
      duration: "1h 10m",
      earnings: 45.00
    }
  ];

  return (
    <div className="p-6">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {getUserDisplayName()}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here's what's happening with your content today.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Button className="h-auto p-4 bg-purple-500 hover:bg-purple-600 flex items-center justify-center space-x-2">
          <Video className="h-5 w-5" />
          <span>Start Live Stream</span>
        </Button>
        <Button variant="outline" className="h-auto p-4 flex items-center justify-center space-x-2">
          <Calendar className="h-5 w-5" />
          <span>Schedule Stream</span>
        </Button>
        <Button variant="outline" className="h-auto p-4 flex items-center justify-center space-x-2">
          <BarChart3 className="h-5 w-5" />
          <span>View Analytics</span>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Streams</CardTitle>
            <Video className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStreams}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Viewers</CardTitle>
            <Eye className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViewers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalEarnings}</div>
            <p className="text-xs text-muted-foreground">
              +8% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Viewers</CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageViewers}</div>
            <p className="text-xs text-muted-foreground">
              Per stream average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Followers</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.followers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +50 this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Calendar className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingStreams}</div>
            <p className="text-xs text-muted-foreground">
              Scheduled streams
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Streams */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Recent Streams</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentStreams.map((stream) => (
              <div key={stream.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Video className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{stream.title}</h3>
                    <p className="text-sm text-gray-500">{stream.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>{stream.viewers}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{stream.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-4 w-4" />
                      <span>${stream.earnings}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InfluencerDashboardMain;
