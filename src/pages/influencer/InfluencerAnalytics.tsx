import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Eye, 
  Heart, 
  MessageCircle,
  Clock,
  Calendar,
  Download,
  Filter
} from 'lucide-react';

const InfluencerAnalytics = () => {
  const [timeRange, setTimeRange] = useState('7d');

  // Mock analytics data
  const overviewStats = {
    totalViews: 156780,
    totalFollowers: 12450,
    avgEngagement: 4.2,
    growthViews: 12.5,
    growthFollowers: 8.3,
    growthEngagement: -2.1
  };

  const streamAnalytics = [
    {
      id: 1,
      title: 'Fashion Haul & Styling Tips',
      date: '2024-12-20',
      duration: '2h 15m',
      views: 2580,
      uniqueViewers: 1840,
      peakViewers: 320,
      likes: 450,
      comments: 128,
      shares: 32,
      revenue: 485.50,
      engagement: 5.8,
      products: 8
    },
    {
      id: 2,
      title: 'Winter Collection Review',
      date: '2024-12-18',
      duration: '1h 45m',
      views: 1920,
      uniqueViewers: 1560,
      peakViewers: 245,
      likes: 320,
      comments: 95,
      shares: 18,
      revenue: 340.25,
      engagement: 4.9,
      products: 6
    },
    {
      id: 3,
      title: 'Q&A with Audience',
      date: '2024-12-15',
      duration: '1h 30m',
      views: 1456,
      uniqueViewers: 1245,
      peakViewers: 180,
      likes: 285,
      comments: 142,
      shares: 25,
      revenue: 125.75,
      engagement: 6.2,
      products: 3
    }
  ];

  const audienceData = {
    demographics: {
      ageGroups: [
        { range: '18-24', percentage: 35 },
        { range: '25-34', percentage: 42 },
        { range: '35-44', percentage: 18 },
        { range: '45+', percentage: 5 }
      ],
      gender: {
        female: 78,
        male: 20,
        other: 2
      },
      topLocations: [
        { country: 'United States', percentage: 45 },
        { country: 'United Kingdom', percentage: 22 },
        { country: 'Canada', percentage: 15 },
        { country: 'Australia', percentage: 12 },
        { country: 'Others', percentage: 6 }
      ]
    },
    engagement: {
      bestTimes: [
        { time: '7:00 PM', engagement: 8.5 },
        { time: '8:00 PM', engagement: 9.2 },
        { time: '9:00 PM', engagement: 7.8 },
        { time: '2:00 PM', engagement: 6.1 }
      ],
      bestDays: [
        { day: 'Thursday', engagement: 8.8 },
        { day: 'Friday', engagement: 9.1 },
        { day: 'Saturday', engagement: 8.2 },
        { day: 'Sunday', engagement: 7.5 }
      ]
    }
  };

  const productPerformance = [
    {
      id: 1,
      name: 'Wireless Earbuds Pro',
      category: 'Electronics',
      streams: 5,
      views: 8520,
      clicks: 342,
      conversions: 28,
      revenue: 980.50,
      conversionRate: 8.2
    },
    {
      id: 2,
      name: 'Designer Handbag',
      category: 'Fashion',
      streams: 3,
      views: 5240,
      clicks: 285,
      conversions: 18,
      revenue: 1250.00,
      conversionRate: 6.3
    },
    {
      id: 3,
      name: 'Skincare Set',
      category: 'Beauty',
      streams: 4,
      views: 6780,
      clicks: 198,
      conversions: 22,
      revenue: 780.25,
      conversionRate: 11.1
    }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Track your performance and grow your audience
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>
          <Button size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="streams">Stream Analytics</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                <Eye className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overviewStats.totalViews.toLocaleString()}</div>
                <div className="flex items-center text-xs text-green-600 mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +{overviewStats.growthViews}% from last period
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Followers</CardTitle>
                <Users className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overviewStats.totalFollowers.toLocaleString()}</div>
                <div className="flex items-center text-xs text-green-600 mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +{overviewStats.growthFollowers}% from last period
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Engagement</CardTitle>
                <Heart className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overviewStats.avgEngagement}%</div>
                <div className="flex items-center text-xs text-red-600 mt-1">
                  <TrendingUp className="h-3 w-3 mr-1 rotate-180" />
                  {overviewStats.growthEngagement}% from last period
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Chart Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Performance chart will be displayed here</p>
                  <p className="text-sm text-gray-400">Integration with chart library required</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Achievements */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-green-800">Milestone Reached!</p>
                    <p className="text-sm text-green-600">You've gained 1,000 new followers this month</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="streams" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Stream Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {streamAnalytics.map((stream) => (
                  <div key={stream.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{stream.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <span>{stream.date}</span>
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {stream.duration}
                          </span>
                          <Badge variant="secondary">{stream.products} products</Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">{stream.engagement}% engagement</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Total Views</p>
                        <p className="font-medium">{stream.views.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Peak Viewers</p>
                        <p className="font-medium">{stream.peakViewers}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Likes</p>
                        <p className="font-medium">{stream.likes}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Comments</p>
                        <p className="font-medium">{stream.comments}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audience" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Demographics */}
            <Card>
              <CardHeader>
                <CardTitle>Audience Demographics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Age Groups</h4>
                  <div className="space-y-2">
                    {audienceData.demographics.ageGroups.map((group) => (
                      <div key={group.range} className="flex justify-between items-center">
                        <span className="text-sm">{group.range}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-purple-500 h-2 rounded-full" 
                              style={{ width: `${group.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{group.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Gender Distribution</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Female</span>
                      <span className="text-sm font-medium">{audienceData.demographics.gender.female}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Male</span>
                      <span className="text-sm font-medium">{audienceData.demographics.gender.male}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Other</span>
                      <span className="text-sm font-medium">{audienceData.demographics.gender.other}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Engagement Insights */}
            <Card>
              <CardHeader>
                <CardTitle>Engagement Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Best Times to Stream</h4>
                  <div className="space-y-2">
                    {audienceData.engagement.bestTimes.map((time) => (
                      <div key={time.time} className="flex justify-between items-center">
                        <span className="text-sm">{time.time}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: `${(time.engagement / 10) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{time.engagement}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Best Days to Stream</h4>
                  <div className="space-y-2">
                    {audienceData.engagement.bestDays.map((day) => (
                      <div key={day.day} className="flex justify-between items-center">
                        <span className="text-sm">{day.day}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full" 
                              style={{ width: `${(day.engagement / 10) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{day.engagement}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Locations */}
          <Card>
            <CardHeader>
              <CardTitle>Top Audience Locations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {audienceData.demographics.topLocations.map((location) => (
                  <div key={location.country} className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{location.percentage}%</div>
                    <div className="text-sm text-gray-600">{location.country}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {productPerformance.map((product) => (
                  <div key={product.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{product.name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline">{product.category}</Badge>
                          <span className="text-sm text-gray-600">{product.streams} streams</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">{product.conversionRate}% conversion</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Views</p>
                        <p className="font-medium">{product.views.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Clicks</p>
                        <p className="font-medium">{product.clicks}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Conversions</p>
                        <p className="font-medium">{product.conversions}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">CTR</p>
                        <p className="font-medium">{((product.clicks / product.views) * 100).toFixed(1)}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InfluencerAnalytics;
