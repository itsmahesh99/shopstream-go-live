import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings, 
  User, 
  Bell, 
  Lock, 
  CreditCard,
  Camera,
  Globe,
  Shield,
  Smartphone,
  Mail,
  Eye,
  EyeOff,
  Save,
  Key,
  Trash2,
  Loader2
} from 'lucide-react';

const InfluencerSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  
  const [profile, setProfile] = useState({
    displayName: '',
    username: '',
    email: '',
    bio: '',
    location: '',
    phone: '',
    first_name: '',
    last_name: ''
  });

  const [originalProfile, setOriginalProfile] = useState({
    displayName: '',
    username: '',
    email: '',
    bio: '',
    location: '',
    phone: '',
    first_name: '',
    last_name: ''
  });

  // Load profile data from Supabase
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('influencers')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          toast({
            title: "Error",
            description: "Failed to load profile data",
            variant: "destructive",
          });
          return;
        }

        if (data) {
          const profileData = {
            displayName: data.display_name || '',
            username: data.display_name || '',
            email: user.email || '',
            bio: data.bio || '',
            location: data.location || '',
            phone: data.phone || '',
            first_name: data.first_name || '',
            last_name: data.last_name || ''
          };
          setProfile(profileData);
          setOriginalProfile(profileData);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user, toast]);

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    streamReminders: true,
    newFollowers: true,
    comments: true,
    directMessages: true,
    earnings: true,
    brandOffers: true,
    weeklyReports: false,
    marketingEmails: false
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    allowDirectMessages: true,
    requireFollowToMessage: false,
    blockAnonymousComments: false,
    autoModerateComments: true
  });

  const [streaming, setStreaming] = useState({
    defaultCategory: 'Fashion',
    autoRecord: true,
    chatModeration: 'moderate',
    allowGifts: true,
    maturityRating: 'general',
    streamQuality: 'high',
    enableScheduling: true,
    notifyFollowersSchedule: true
  });

  const connectedAccounts = [
    {
      platform: 'Instagram',
      username: '@creativestudio',
      connected: true,
      followers: '12.5K'
    },
    {
      platform: 'TikTok',
      username: '@creativestudio',
      connected: true,
      followers: '8.2K'
    },
    {
      platform: 'YouTube',
      username: 'Creative Studio',
      connected: false,
      followers: '0'
    },
    {
      platform: 'Twitter',
      username: '@creativestudio',
      connected: false,
      followers: '0'
    }
  ];

  const sessions = [
    {
      id: 1,
      device: 'Chrome on Windows',
      location: 'New York, USA',
      lastActive: '2 minutes ago',
      current: true
    },
    {
      id: 2,
      device: 'Mobile App on iPhone',
      location: 'New York, USA',
      lastActive: '1 hour ago',
      current: false
    },
    {
      id: 3,
      device: 'Safari on MacBook',
      location: 'New York, USA',
      lastActive: '2 days ago',
      current: false
    }
  ];

  const handleProfileUpdate = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to update your profile",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      // Validate required fields
      if (!profile.first_name?.trim() || !profile.last_name?.trim()) {
        toast({
          title: "Validation Error",
          description: "First name and last name are required",
          variant: "destructive",
        });
        return;
      }

      // Validate field lengths to match database constraints
      const validationErrors = [];
      if (profile.first_name.length > 50) validationErrors.push("First name must be 50 characters or less");
      if (profile.last_name.length > 50) validationErrors.push("Last name must be 50 characters or less");
      if (profile.displayName.length > 100) validationErrors.push("Display name must be 100 characters or less");
      if (profile.phone && profile.phone.length > 20) validationErrors.push("Phone number must be 20 characters or less");
      if (profile.bio && profile.bio.length > 1000) validationErrors.push("Bio must be 1000 characters or less");
      if (profile.location && profile.location.length > 100) validationErrors.push("Location must be 100 characters or less");

      if (validationErrors.length > 0) {
        toast({
          title: "Validation Error",
          description: validationErrors[0],
          variant: "destructive",
        });
        return;
      }

      // Prepare update data with proper sanitization
      const updateData = {
        first_name: profile.first_name.substring(0, 50).trim(),
        last_name: profile.last_name.substring(0, 50).trim(),
        display_name: profile.displayName.substring(0, 100).trim() || `${profile.first_name} ${profile.last_name}`.trim(),
        bio: profile.bio ? profile.bio.substring(0, 1000).trim() : null,
        location: profile.location ? profile.location.substring(0, 100).trim() : null,
        phone: profile.phone ? profile.phone.substring(0, 20).trim() : null,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('influencers')
        .update(updateData)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating profile:', error);
        console.error('Update data sent:', updateData);
        console.error('User ID:', user.id);
        console.error('Error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        
        // Handle specific database errors
        if (error.code === '23505') {
          toast({
            title: "Error",
            description: "Display name or username already exists. Please choose a different one.",
            variant: "destructive",
          });
        } else if (error.code === '23514') {
          toast({
            title: "Validation Error",
            description: "Please check that all fields meet the requirements.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: `Failed to update profile: ${error.message}`,
            variant: "destructive",
          });
        }
        return;
      }

      // Update the original profile state to reflect saved changes
      setOriginalProfile({...profile});
      
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while updating your profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setProfile({...originalProfile});
    toast({
      title: "Changes Discarded",
      description: "Your changes have been discarded",
    });
  };

  const handleNotificationUpdate = (key: string, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handlePrivacyUpdate = (key: string, value: boolean | string) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleStreamingUpdate = (key: string, value: boolean | string) => {
    setStreaming(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">
          Manage your account preferences and streaming settings
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading profile...</span>
        </div>
      ) : (
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="streaming">Streaming</TabsTrigger>
            <TabsTrigger value="connected">Connected</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Profile Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Picture */}
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <img
                    src="/lovable-uploads/f8d1a83b-970d-4d3a-966a-e0e1deaddb20.png"
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">Profile Picture</h3>
                  <p className="text-sm text-gray-600">Using default avatar</p>
                </div>
              </div>

              {/* Profile Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="first_name">First Name *</Label>
                  <Input
                    id="first_name"
                    value={profile.first_name}
                    onChange={(e) => setProfile({...profile, first_name: e.target.value})}
                    className="mt-1"
                    maxLength={50}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="last_name">Last Name *</Label>
                  <Input
                    id="last_name"
                    value={profile.last_name}
                    onChange={(e) => setProfile({...profile, last_name: e.target.value})}
                    className="mt-1"
                    maxLength={50}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={profile.displayName}
                    onChange={(e) => setProfile({...profile, displayName: e.target.value})}
                    className="mt-1"
                    maxLength={100}
                    placeholder="How you want to be displayed publicly"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    disabled
                    className="mt-1 bg-gray-50"
                    title="Email cannot be changed from settings"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed from here</p>
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    className="mt-1"
                    maxLength={20}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={profile.location}
                    onChange={(e) => setProfile({...profile, location: e.target.value})}
                    className="mt-1"
                    maxLength={100}
                    placeholder="New York, USA"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => setProfile({...profile, bio: e.target.value})}
                    rows={3}
                    className="mt-1"
                    maxLength={1000}
                    placeholder="Tell us about yourself and your content..."
                  />
                  <p className="text-xs text-gray-500 mt-1">{profile.bio.length}/1000 characters</p>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={handleCancel} disabled={loading}>
                  Cancel
                </Button>
                <Button onClick={handleProfileUpdate} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notification Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-gray-600">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={notifications.emailNotifications}
                    onCheckedChange={(checked) => handleNotificationUpdate('emailNotifications', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Push Notifications</h3>
                    <p className="text-sm text-gray-600">Receive push notifications on your devices</p>
                  </div>
                  <Switch
                    checked={notifications.pushNotifications}
                    onCheckedChange={(checked) => handleNotificationUpdate('pushNotifications', checked)}
                  />
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Stream Notifications</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Stream reminders</span>
                      <Switch
                        checked={notifications.streamReminders}
                        onCheckedChange={(checked) => handleNotificationUpdate('streamReminders', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">New followers</span>
                      <Switch
                        checked={notifications.newFollowers}
                        onCheckedChange={(checked) => handleNotificationUpdate('newFollowers', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Comments on streams</span>
                      <Switch
                        checked={notifications.comments}
                        onCheckedChange={(checked) => handleNotificationUpdate('comments', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Direct messages</span>
                      <Switch
                        checked={notifications.directMessages}
                        onCheckedChange={(checked) => handleNotificationUpdate('directMessages', checked)}
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Business Notifications</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Earnings updates</span>
                      <Switch
                        checked={notifications.earnings}
                        onCheckedChange={(checked) => handleNotificationUpdate('earnings', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Brand partnership offers</span>
                      <Switch
                        checked={notifications.brandOffers}
                        onCheckedChange={(checked) => handleNotificationUpdate('brandOffers', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Weekly performance reports</span>
                      <Switch
                        checked={notifications.weeklyReports}
                        onCheckedChange={(checked) => handleNotificationUpdate('weeklyReports', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Marketing emails</span>
                      <Switch
                        checked={notifications.marketingEmails}
                        onCheckedChange={(checked) => handleNotificationUpdate('marketingEmails', checked)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Privacy Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="profileVisibility">Profile Visibility</Label>
                  <select
                    id="profileVisibility"
                    value={privacy.profileVisibility}
                    onChange={(e) => handlePrivacyUpdate('profileVisibility', e.target.value)}
                    className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="public">Public</option>
                    <option value="followers">Followers Only</option>
                    <option value="private">Private</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Show Email Address</h3>
                    <p className="text-sm text-gray-600">Display your email on your public profile</p>
                  </div>
                  <Switch
                    checked={privacy.showEmail}
                    onCheckedChange={(checked) => handlePrivacyUpdate('showEmail', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Show Phone Number</h3>
                    <p className="text-sm text-gray-600">Display your phone number on your public profile</p>
                  </div>
                  <Switch
                    checked={privacy.showPhone}
                    onCheckedChange={(checked) => handlePrivacyUpdate('showPhone', checked)}
                  />
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Communication Settings</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Allow direct messages</span>
                      <Switch
                        checked={privacy.allowDirectMessages}
                        onCheckedChange={(checked) => handlePrivacyUpdate('allowDirectMessages', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Require follow to message</span>
                      <Switch
                        checked={privacy.requireFollowToMessage}
                        onCheckedChange={(checked) => handlePrivacyUpdate('requireFollowToMessage', checked)}
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Comment Moderation</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Block anonymous comments</span>
                      <Switch
                        checked={privacy.blockAnonymousComments}
                        onCheckedChange={(checked) => handlePrivacyUpdate('blockAnonymousComments', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Auto-moderate comments</span>
                      <Switch
                        checked={privacy.autoModerateComments}
                        onCheckedChange={(checked) => handlePrivacyUpdate('autoModerateComments', checked)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="streaming" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Camera className="h-5 w-5" />
                <span>Streaming Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="defaultCategory">Default Category</Label>
                  <select
                    id="defaultCategory"
                    value={streaming.defaultCategory}
                    onChange={(e) => handleStreamingUpdate('defaultCategory', e.target.value)}
                    className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="Fashion">Fashion</option>
                    <option value="Beauty">Beauty</option>
                    <option value="Technology">Technology</option>
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="streamQuality">Stream Quality</Label>
                  <select
                    id="streamQuality"
                    value={streaming.streamQuality}
                    onChange={(e) => handleStreamingUpdate('streamQuality', e.target.value)}
                    className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="high">High (1080p)</option>
                    <option value="medium">Medium (720p)</option>
                    <option value="low">Low (480p)</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="chatModeration">Chat Moderation</Label>
                  <select
                    id="chatModeration"
                    value={streaming.chatModeration}
                    onChange={(e) => handleStreamingUpdate('chatModeration', e.target.value)}
                    className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="strict">Strict</option>
                    <option value="moderate">Moderate</option>
                    <option value="relaxed">Relaxed</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="maturityRating">Maturity Rating</Label>
                  <select
                    id="maturityRating"
                    value={streaming.maturityRating}
                    onChange={(e) => handleStreamingUpdate('maturityRating', e.target.value)}
                    className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="general">General Audience</option>
                    <option value="teen">Teen</option>
                    <option value="mature">Mature</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Auto-record streams</h3>
                    <p className="text-sm text-gray-600">Automatically save recordings of your streams</p>
                  </div>
                  <Switch
                    checked={streaming.autoRecord}
                    onCheckedChange={(checked) => handleStreamingUpdate('autoRecord', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Allow gifts and tips</h3>
                    <p className="text-sm text-gray-600">Let viewers send you gifts during streams</p>
                  </div>
                  <Switch
                    checked={streaming.allowGifts}
                    onCheckedChange={(checked) => handleStreamingUpdate('allowGifts', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Enable stream scheduling</h3>
                    <p className="text-sm text-gray-600">Allow followers to see your scheduled streams</p>
                  </div>
                  <Switch
                    checked={streaming.enableScheduling}
                    onCheckedChange={(checked) => handleStreamingUpdate('enableScheduling', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Notify followers of scheduled streams</h3>
                    <p className="text-sm text-gray-600">Send notifications when you schedule new streams</p>
                  </div>
                  <Switch
                    checked={streaming.notifyFollowersSchedule}
                    onCheckedChange={(checked) => handleStreamingUpdate('notifyFollowersSchedule', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="connected" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <span>Connected Accounts</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {connectedAccounts.map((account, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Globe className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{account.platform}</h3>
                        <p className="text-sm text-gray-600">{account.username}</p>
                        {account.connected && (
                          <p className="text-xs text-gray-500">{account.followers} followers</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {account.connected ? (
                        <>
                          <Badge className="bg-green-100 text-green-800">Connected</Badge>
                          <Button variant="outline" size="sm">Disconnect</Button>
                        </>
                      ) : (
                        <Button size="sm">Connect</Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          {/* Password Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lock className="h-5 w-5" />
                <span>Password & Security</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative mt-1">
                    <Input
                      id="currentPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter current password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    className="mt-1"
                  />
                </div>
              </div>
              
              <Button>
                <Key className="mr-2 h-4 w-4" />
                Update Password
              </Button>
            </CardContent>
          </Card>

          {/* Active Sessions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Smartphone className="h-5 w-5" />
                <span>Active Sessions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">{session.device}</h3>
                      <p className="text-sm text-gray-600">{session.location}</p>
                      <p className="text-xs text-gray-500">{session.lastActive}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {session.current ? (
                        <Badge className="bg-green-100 text-green-800">Current Session</Badge>
                      ) : (
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4 mr-1" />
                          End Session
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Two-Factor Authentication */}
          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Authenticator App</h3>
                  <p className="text-sm text-gray-600">Use an authenticator app to generate verification codes</p>
                </div>
                <Button variant="outline">
                  Enable 2FA
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      )}
    </div>
  );
};

export default InfluencerSettings;
