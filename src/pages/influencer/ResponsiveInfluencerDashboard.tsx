import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import ResponsivePageContainer from '@/components/common/ResponsivePageContainer';
import ResponsiveGrid from '@/components/common/ResponsiveGrid';
import ResponsiveCard from '@/components/common/ResponsiveCard';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Video, 
  Users, 
  TrendingUp,
  Eye,
  Calendar,
  BarChart3,
  Clock,
  Star,
  Bell,
  Settings
} from 'lucide-react';

const ResponsiveInfluencerDashboard = () => {
  const { userProfile } = useAuth();
  const isMobile = useIsMobile();

  const getUserDisplayName = () => {
    if (!userProfile?.profile) return 'Creator';
    const profile = userProfile.profile as any;
    return profile.display_name || profile.first_name || 'Creator';
  };

  // Mock data for demonstration
  const stats = {
    totalStreams: 12,
    totalViewers: 2580,
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
      duration: "1h 25m"
    },
    {
      id: 2,
      title: "Winter Collection Review", 
      date: "2024-12-18",
      viewers: 245,
      duration: "55m"
    },
    {
      id: 3,
      title: "Live Q&A with Audience",
      date: "2024-12-15",
      viewers: 180,
      duration: "1h 10m"
    }
  ];

  return (
    <ResponsivePageContainer>
      {/* Welcome Header */}
      <div className={`mb-6 ${isMobile ? 'text-center' : 'flex justify-between items-start'}`}>
        <div>
          <h1 className={`font-bold text-gray-900 ${isMobile ? 'text-2xl mb-2' : 'text-3xl'}`}>
            Welcome back, {getUserDisplayName()}!
          </h1>
          <p className={`text-gray-600 ${isMobile ? 'text-sm' : 'text-base'}`}>
            Here's what's happening with your content today.
          </p>
        </div>
        {!isMobile && (
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
            <Link to="/influencer/settings">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <ResponsiveGrid 
          columns={{ mobile: 1, tablet: 2, desktop: 2 }} 
          gap={isMobile ? "sm" : "md"}
        >
          <Link to="/influencer/live">
            <Button className={`w-full h-auto ${isMobile ? 'p-3' : 'p-4'} bg-purple-500 hover:bg-purple-600 flex items-center justify-center space-x-2`}>
              <Video className="h-5 w-5" />
              <span>Start Live Stream</span>
            </Button>
          </Link>
          <Link to="/influencer/schedule">
            <Button variant="outline" className={`w-full h-auto ${isMobile ? 'p-3' : 'p-4'} flex items-center justify-center space-x-2`}>
              <Calendar className="h-5 w-5" />
              <span>Schedule Stream</span>
            </Button>
          </Link>
        </ResponsiveGrid>
      </div>

      {/* Stats Grid */}
      <div className="mb-8">
        <ResponsiveGrid 
          columns={{ mobile: 1, tablet: 2, desktop: 3 }} 
          gap={isMobile ? "sm" : "lg"}
        >
          <ResponsiveCard padding={isMobile ? "sm" : "md"}>
            <div className="flex items-center justify-between mb-2">
              <span className={`font-medium text-gray-600 ${isMobile ? 'text-sm' : 'text-base'}`}>
                Total Streams
              </span>
              <Video className="h-4 w-4 text-purple-600" />
            </div>
            <div className={`font-bold text-gray-900 ${isMobile ? 'text-xl' : 'text-2xl'}`}>
              {stats.totalStreams}
            </div>
            <p className="text-xs text-gray-500">+2 from last month</p>
          </ResponsiveCard>

          <ResponsiveCard padding={isMobile ? "sm" : "md"}>
            <div className="flex items-center justify-between mb-2">
              <span className={`font-medium text-gray-600 ${isMobile ? 'text-sm' : 'text-base'}`}>
                Total Viewers
              </span>
              <Eye className="h-4 w-4 text-blue-600" />
            </div>
            <div className={`font-bold text-gray-900 ${isMobile ? 'text-xl' : 'text-2xl'}`}>
              {stats.totalViewers.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500">+12% from last month</p>
          </ResponsiveCard>

          <ResponsiveCard padding={isMobile ? "sm" : "md"}>
            <div className="flex items-center justify-between mb-2">
              <span className={`font-medium text-gray-600 ${isMobile ? 'text-sm' : 'text-base'}`}>
                Avg. Viewers
              </span>
              <Users className="h-4 w-4 text-orange-600" />
            </div>
            <div className={`font-bold text-gray-900 ${isMobile ? 'text-xl' : 'text-2xl'}`}>
              {stats.averageViewers}
            </div>
            <p className="text-xs text-gray-500">Per stream average</p>
          </ResponsiveCard>

          <ResponsiveCard padding={isMobile ? "sm" : "md"}>
            <div className="flex items-center justify-between mb-2">
              <span className={`font-medium text-gray-600 ${isMobile ? 'text-sm' : 'text-base'}`}>
                Followers
              </span>
              <Star className="h-4 w-4 text-yellow-600" />
            </div>
            <div className={`font-bold text-gray-900 ${isMobile ? 'text-xl' : 'text-2xl'}`}>
              {stats.followers.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500">+50 this week</p>
          </ResponsiveCard>

          <ResponsiveCard padding={isMobile ? "sm" : "md"}>
            <div className="flex items-center justify-between mb-2">
              <span className={`font-medium text-gray-600 ${isMobile ? 'text-sm' : 'text-base'}`}>
                Upcoming
              </span>
              <Calendar className="h-4 w-4 text-indigo-600" />
            </div>
            <div className={`font-bold text-gray-900 ${isMobile ? 'text-xl' : 'text-2xl'}`}>
              {stats.upcomingStreams}
            </div>
            <p className="text-xs text-gray-500">Scheduled streams</p>
          </ResponsiveCard>
        </ResponsiveGrid>
      </div>

      {/* Recent Streams */}
      <ResponsiveCard 
        title="Recent Streams" 
        padding={isMobile ? "sm" : "md"}
      >
        <div className="space-y-4">
          {recentStreams.map((stream) => (
            <div key={stream.id} className={`flex items-center justify-between ${isMobile ? 'p-3' : 'p-4'} border rounded-lg hover:bg-gray-50 transition-colors`}>
              <div className="flex items-center space-x-4">
                <div className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} bg-purple-100 rounded-lg flex items-center justify-center`}>
                  <Video className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6'} text-purple-600`} />
                </div>
                <div>
                  <h3 className={`font-medium text-gray-900 ${isMobile ? 'text-sm' : 'text-base'}`}>
                    {stream.title}
                  </h3>
                  <p className="text-xs text-gray-500">{stream.date}</p>
                </div>
              </div>
              <div className="text-right">
                <div className={`flex ${isMobile ? 'flex-col space-y-1' : 'items-center space-x-4'} text-sm text-gray-600`}>
                  <div className="flex items-center space-x-1">
                    <Eye className="h-4 w-4" />
                    <span>{stream.viewers}</span>
                  </div>
                  {!isMobile && (
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{stream.duration}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ResponsiveCard>
    </ResponsivePageContainer>
  );
};

export default ResponsiveInfluencerDashboard;
