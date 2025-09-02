import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Search, 
  Filter, 
  MessageCircle, 
  Heart, 
  Star,
  TrendingUp,
  Mail,
  UserPlus,
  UserMinus,
  MoreVertical,
  Eye,
  Calendar,
  Gift
} from 'lucide-react';

const InfluencerAudience = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Mock audience data
  const audienceStats = {
    totalFollowers: 12450,
    weeklyGrowth: 8.5,
    monthlyGrowth: 23.2,
    engagementRate: 4.2,
    topFans: 156,
    newFollowers: 89
  };

  const followers = [
    {
      id: 1,
      username: 'fashionlover23',
      displayName: 'Sarah Miller',
      avatar: '/lovable-uploads/f8d1a83b-970d-4d3a-966a-e0e1deaddb20.png',
      followedDate: '2024-11-15',
      engagement: 'high',
      totalViews: 2340,
      comments: 45,
      likes: 123,
      isTopFan: true,
      location: 'New York, USA',
      lastActive: '2 hours ago'
    },
    {
      id: 2,
      username: 'stylequeen',
      displayName: 'Emma Johnson',
      avatar: '/lovable-uploads/2840b6e9-4e3c-4070-8eb6-13ed21836285.png',
      followedDate: '2024-10-22',
      engagement: 'medium',
      totalViews: 1560,
      comments: 28,
      likes: 89,
      isTopFan: false,
      location: 'London, UK',
      lastActive: '1 day ago'
    },
    {
      id: 3,
      username: 'trendwatcher',
      displayName: 'Alex Chen',
      avatar: '/lovable-uploads/37fa901f-5b94-426f-ac68-07a4249941e7.png',
      followedDate: '2024-12-01',
      engagement: 'high',
      totalViews: 3120,
      comments: 67,
      likes: 201,
      isTopFan: true,
      location: 'Toronto, Canada',
      lastActive: '30 minutes ago'
    },
    {
      id: 4,
      username: 'beautyexpert',
      displayName: 'Maria Rodriguez',
      avatar: '/lovable-uploads/4448d6cf-1254-4262-a2a2-cb90ffd97796.png',
      followedDate: '2024-09-18',
      engagement: 'medium',
      totalViews: 1890,
      comments: 34,
      likes: 76,
      isTopFan: false,
      location: 'Los Angeles, USA',
      lastActive: '3 hours ago'
    },
    {
      id: 5,
      username: 'shopaholic_jane',
      displayName: 'Jane Wilson',
      avatar: '/lovable-uploads/5238184c-1188-4352-a959-30046823f005.png',
      followedDate: '2024-11-30',
      engagement: 'low',
      totalViews: 780,
      comments: 12,
      likes: 34,
      isTopFan: false,
      location: 'Sydney, Australia',
      lastActive: '1 week ago'
    }
  ];

  const engagementInsights = [
    {
      metric: 'Most Active Hours',
      value: '7:00 PM - 9:00 PM',
      trend: '+12%',
      description: 'Peak engagement time for your audience'
    },
    {
      metric: 'Top Interaction Type',
      value: 'Comments',
      trend: '+8%',
      description: 'Your audience prefers commenting over likes'
    },
    {
      metric: 'Average Session',
      value: '8.5 minutes',
      trend: '+15%',
      description: 'Time spent watching your streams'
    },
    {
      metric: 'Return Viewers',
      value: '68%',
      trend: '+5%',
      description: 'Followers who watch multiple streams'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'follow',
      user: 'newuser123',
      action: 'Started following you',
      time: '2 minutes ago'
    },
    {
      id: 2,
      type: 'comment',
      user: 'fashionlover23',
      action: 'Commented on your latest stream',
      time: '15 minutes ago'
    },
    {
      id: 3,
      type: 'like',
      user: 'trendwatcher',
      action: 'Liked your stream',
      time: '1 hour ago'
    },
    {
      id: 4,
      type: 'follow',
      user: 'styleenthusiast',
      action: 'Started following you',
      time: '2 hours ago'
    },
    {
      id: 5,
      type: 'comment',
      user: 'beautyexpert',
      action: 'Left a comment',
      time: '3 hours ago'
    }
  ];

  const getEngagementColor = (engagement: string) => {
    switch (engagement) {
      case 'high':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'follow':
        return <UserPlus className="h-4 w-4 text-blue-500" />;
      case 'comment':
        return <MessageCircle className="h-4 w-4 text-green-500" />;
      case 'like':
        return <Heart className="h-4 w-4 text-red-500" />;
      default:
        return <Eye className="h-4 w-4 text-gray-500" />;
    }
  };

  const filteredFollowers = followers.filter(follower => {
    const matchesSearch = follower.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         follower.displayName.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === 'all') return matchesSearch;
    if (selectedFilter === 'top-fans') return matchesSearch && follower.isTopFan;
    if (selectedFilter === 'high-engagement') return matchesSearch && follower.engagement === 'high';
    if (selectedFilter === 'recent') {
      const followDate = new Date(follower.followedDate);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return matchesSearch && followDate > thirtyDaysAgo;
    }
    
    return matchesSearch;
  });

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Audience Management</h1>
        <p className="text-gray-600 mt-2">
          Understand and engage with your community
        </p>
      </div>

      {/* Audience Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Total Followers</p>
                <p className="text-2xl font-bold">{audienceStats.totalFollowers.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Weekly Growth</p>
                <p className="text-2xl font-bold text-green-600">+{audienceStats.weeklyGrowth}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Engagement Rate</p>
                <p className="text-2xl font-bold">{audienceStats.engagementRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Top Fans</p>
                <p className="text-2xl font-bold">{audienceStats.topFans}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <UserPlus className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">New Followers</p>
                <p className="text-2xl font-bold text-blue-600">+{audienceStats.newFollowers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Monthly Growth</p>
                <p className="text-2xl font-bold text-green-600">+{audienceStats.monthlyGrowth}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="followers" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="followers">Followers</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="followers" className="space-y-6">
          {/* Search and Filter */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search followers by username or name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <select
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="all">All Followers</option>
                    <option value="top-fans">Top Fans</option>
                    <option value="high-engagement">High Engagement</option>
                    <option value="recent">Recent Followers</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Followers List */}
          <Card>
            <CardHeader>
              <CardTitle>Followers ({filteredFollowers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredFollowers.map((follower) => (
                  <div key={follower.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <img
                        src={follower.avatar}
                        alt={follower.displayName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-gray-900">{follower.displayName}</h3>
                          {follower.isTopFan && (
                            <Badge className="bg-yellow-100 text-yellow-800">
                              <Star className="w-3 h-3 mr-1" />
                              Top Fan
                            </Badge>
                          )}
                          <Badge className={getEngagementColor(follower.engagement)}>
                            {follower.engagement}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">@{follower.username}</p>
                        <p className="text-xs text-gray-500">{follower.location} • {follower.lastActive}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <div className="text-center">
                        <p className="font-medium">{follower.totalViews}</p>
                        <p className="text-xs">Views</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium">{follower.comments}</p>
                        <p className="text-xs">Comments</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium">{follower.likes}</p>
                        <p className="text-xs">Likes</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Mail className="h-4 w-4 mr-1" />
                          Message
                        </Button>
                        <Button variant="outline" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          {/* Engagement Insights */}
          <Card>
            <CardHeader>
              <CardTitle>Engagement Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {engagementInsights.map((insight, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900">{insight.metric}</h3>
                      <Badge variant="outline" className="text-green-600">
                        {insight.trend}
                      </Badge>
                    </div>
                    <div className="text-2xl font-bold text-purple-600 mb-1">{insight.value}</div>
                    <p className="text-sm text-gray-600">{insight.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Audience Demographics Chart Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Audience Demographics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Demographic charts will be displayed here</p>
                  <p className="text-sm text-gray-400">Integration with chart library required</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                    <div className="flex-shrink-0">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">@{activity.user}</span>{' '}
                        <span className="text-gray-600">{activity.action}</span>
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Engagement Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button className="h-auto p-4 flex flex-col items-center space-y-2">
                  <Gift className="h-6 w-6" />
                  <span>Send Thank You</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                  <Mail className="h-6 w-6" />
                  <span>Broadcast Message</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                  <Star className="h-6 w-6" />
                  <span>Highlight Top Fans</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                  <TrendingUp className="h-6 w-6" />
                  <span>Growth Analysis</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InfluencerAudience;
