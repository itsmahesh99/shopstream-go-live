import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Users,
  Video,
  Settings,
  RefreshCw,
  Eye,
  Calendar,
  TrendingUp,
  UserCheck,
  UserX,
  Key,
  BarChart3
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AdminService } from '@/services/adminServiceSimple';
import { AdminAuthService } from '@/services/adminAuthService';
import { TokenInputModal } from '@/components/admin/TokenInputModal';
import AdminDebugTest from '@/components/admin/AdminDebugTest';
import { toast } from 'sonner';

interface InfluencerData {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  display_name?: string;
  role: string;
  hms_room_code?: string;
  hms_viewer_room_code?: string;
  has_auth_token: boolean;
  has_viewer_auth_token: boolean;
  is_streaming_enabled: boolean;
  token_created_at?: string;
  profile_created_at: string;
  profile_updated_at: string;
  total_streams: number;
  total_viewers: number;
  avg_viewers_per_stream: number;
  max_peak_viewers: number;
  last_stream_date?: string;
  streams_last_30_days: number;
  currently_live_streams: number;
  verification_status?: string;
  is_verified: boolean;
  is_active: boolean;
}

const AdminPanel: React.FC = () => {
  const { userProfile } = useAuth();
  const [influencers, setInfluencers] = useState<InfluencerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInfluencer, setSelectedInfluencer] = useState<InfluencerData | null>(null);
  const [generatingToken, setGeneratingToken] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [currentAdmin, setCurrentAdmin] = useState(AdminAuthService.getCurrentAdmin());
  const [tokenModalOpen, setTokenModalOpen] = useState(false);
  const [selectedInfluencerForToken, setSelectedInfluencerForToken] = useState<InfluencerData | null>(null);

  // Check if user is admin - independent of regular user authentication
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        // Check if admin is logged in using admin auth system
        const isAdminLoggedIn = AdminAuthService.isAdminLoggedIn();
        if (!isAdminLoggedIn) {
          setIsAdmin(false);
          setCheckingAdmin(false);
          return;
        }

        // Verify admin session is valid
        const adminStatus = await AdminService.isUserAdmin();
        setIsAdmin(adminStatus);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setCheckingAdmin(false);
      }
    };

    // Always check admin status regardless of regular user login
    checkAdminStatus();
  }, []); // Remove userProfile dependency

  useEffect(() => {
    if (isAdmin) {
      loadInfluencers();
    }
  }, [isAdmin]);

  const loadInfluencers = async () => {
    try {
      setLoading(true);
      console.log('Admin Panel: Starting to load influencers...');
      
      const data = await AdminService.getAllInfluencers();
      console.log('Admin Panel: Received influencer data:', data);
      console.log('Admin Panel: Number of influencers:', data.length);
      
      setInfluencers(data);
    } catch (error) {
      console.error('Admin Panel: Error loading influencers:', error);
      toast.error(`Failed to load influencers: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const openTokenModal = (influencer: InfluencerData) => {
    setSelectedInfluencerForToken(influencer);
    setTokenModalOpen(true);
  };

  const handleManualTokenSubmit = async (
    authToken: string,
    roomCode?: string,
    viewerAuthToken?: string,
    viewerRoomCode?: string
  ) => {
    if (!selectedInfluencerForToken) return;

    try {
      setGeneratingToken(selectedInfluencerForToken.id);
      await AdminService.setManualAuthToken(
        selectedInfluencerForToken.id,
        authToken,
        roomCode,
        viewerAuthToken,
        viewerRoomCode
      );
      toast.success('HMS tokens saved successfully');
      loadInfluencers(); // Refresh data
    } catch (error) {
      console.error('Error saving auth tokens:', error);
      toast.error('Failed to save auth tokens');
      throw error; // Re-throw to let modal handle it
    } finally {
      setGeneratingToken(null);
    }
  };

  const toggleStreamingAccess = async (influencerId: string, enabled: boolean) => {
    try {
      await AdminService.updateStreamingAccess(influencerId, enabled);
      toast.success(`Streaming access ${enabled ? 'enabled' : 'disabled'}`);
      loadInfluencers(); // Refresh data
    } catch (error) {
      console.error('Error updating streaming access:', error);
      toast.error('Failed to update streaming access');
    }
  };



  const filteredInfluencers = influencers.filter(influencer =>
    influencer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    influencer.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${influencer.first_name} ${influencer.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statsCards = [
    {
      title: 'Total Influencers',
      value: influencers.length,
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Active Streamers',
      value: influencers.filter(i => i.streams_last_30_days > 0).length,
      icon: Video,
      color: 'text-green-600'
    },
    {
      title: 'Live Streams',
      value: influencers.reduce((sum, i) => sum + i.currently_live_streams, 0),
      icon: TrendingUp,
      color: 'text-red-600'
    },
    {
      title: 'With Broadcaster Tokens',
      value: influencers.filter(i => i.has_auth_token).length,
      icon: Key,
      color: 'text-purple-600'
    },
    {
      title: 'With Viewer Tokens',
      value: influencers.filter(i => i.has_viewer_auth_token).length,
      icon: Eye,
      color: 'text-green-600'
    }
  ];

  if (checkingAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Checking Access</h2>
              <p className="text-gray-600">Verifying admin permissions...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="text-center">
              <UserX className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
              <p className="text-gray-600">You don't have permission to access the admin panel.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Quick Actions Bar */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
          <p className="text-gray-600">Monitor and manage your streaming platform</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button onClick={loadInfluencers} disabled={loading} variant="outline">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="influencers" className="space-y-6">
        <TabsList>
          <TabsTrigger value="influencers">Influencers</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="influencers">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Influencer Management</CardTitle>
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Search influencers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
                  <p>Loading influencers...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredInfluencers.map((influencer) => (
                    <div key={influencer.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <span className="text-purple-600 font-medium">
                              {(influencer.display_name || influencer.first_name || 'U').charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-medium">
                              {influencer.display_name || `${influencer.first_name} ${influencer.last_name}`}
                            </h3>
                            <p className="text-sm text-gray-600">{influencer.email}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant={influencer.is_streaming_enabled ? "default" : "secondary"}>
                                {influencer.is_streaming_enabled ? 'Enabled' : 'Disabled'}
                              </Badge>
                              {influencer.has_auth_token && (
                                <Badge variant="outline" className="text-purple-600">
                                  <Key className="h-3 w-3 mr-1" />
                                  Broadcaster
                                </Badge>
                              )}
                              {influencer.has_viewer_auth_token && (
                                <Badge variant="outline" className="text-green-600">
                                  <Eye className="h-3 w-3 mr-1" />
                                  Viewer
                                </Badge>
                              )}
                              {influencer.currently_live_streams > 0 && (
                                <Badge variant="destructive">
                                  🔴 Live
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="text-right text-sm text-gray-600 mr-4">
                            <p>Streams: {influencer.total_streams}</p>
                            <p>Viewers: {influencer.total_viewers.toLocaleString()}</p>
                            <p>Broadcaster Room: {influencer.hms_room_code || 'Not assigned'}</p>
                            <p>Viewer Room: {influencer.hms_viewer_room_code || 'Not assigned'}</p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openTokenModal(influencer)}
                            disabled={generatingToken === influencer.id}
                          >
                            {generatingToken === influencer.id ? (
                              <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                              <Key className="h-4 w-4" />
                            )}
                            {influencer.has_auth_token ? 'Update' : 'Set'} Token
                          </Button>
                          <Button
                            variant={influencer.is_streaming_enabled ? "destructive" : "default"}
                            size="sm"
                            onClick={() => toggleStreamingAccess(influencer.id, !influencer.is_streaming_enabled)}
                          >
                            {influencer.is_streaming_enabled ? (
                              <>
                                <UserX className="h-4 w-4 mr-1" />
                                Disable
                              </>
                            ) : (
                              <>
                                <UserCheck className="h-4 w-4 mr-1" />
                                Enable
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredInfluencers.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No influencers found matching your search.
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Platform Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="text-center p-4 border rounded-lg">
                  <BarChart3 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{influencers.reduce((sum, i) => sum + i.total_streams, 0)}</p>
                  <p className="text-sm text-gray-600">Total Streams</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Eye className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{influencers.reduce((sum, i) => sum + i.total_viewers, 0).toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Total Viewers</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{influencers.reduce((sum, i) => sum + i.streams_last_30_days, 0)}</p>
                  <p className="text-sm text-gray-600">Streams (30 days)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <div className="space-y-6">
            {/* Debug Component */}
            <AdminDebugTest />
            
            <Card>
              <CardHeader>
                <CardTitle>Admin Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Auto-generate tokens for new influencers</h3>
                      <p className="text-sm text-gray-600">Automatically create auth tokens when influencers complete their profile</p>
                    </div>
                    <Button variant="outline">Configure</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Token expiration policy</h3>
                      <p className="text-sm text-gray-600">Set how long auth tokens remain valid</p>
                    </div>
                    <Button variant="outline">Configure</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Token Input Modal */}
      <TokenInputModal
        isOpen={tokenModalOpen}
        onClose={() => {
          setTokenModalOpen(false);
          setSelectedInfluencerForToken(null);
        }}
        onSubmit={handleManualTokenSubmit}
        influencer={selectedInfluencerForToken}
        isLoading={generatingToken === selectedInfluencerForToken?.id}
      />
    </div>
  );
};

export default AdminPanel;
