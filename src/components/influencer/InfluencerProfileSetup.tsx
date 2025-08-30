import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useInfluencer } from '@/hooks/useInfluencer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Star, 
  User, 
  Instagram, 
  Youtube, 
  Twitter,
  ArrowRight,
  Loader2,
  Camera
} from 'lucide-react';

interface InfluencerProfileSetupProps {
  onProfileCreated: () => void;
}

const InfluencerProfileSetup: React.FC<InfluencerProfileSetupProps> = ({ onProfileCreated }) => {
  const { user } = useAuth();
  const { createInfluencer, loading } = useInfluencer();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    display_name: '',
    email: user?.email || '',
    phone: '',
    bio: '',
    category: '',
    instagram_handle: '',
    youtube_channel: '',
    tiktok_handle: '',
    website_url: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const profileData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        display_name: formData.display_name,
        email: formData.email,
        phone: formData.phone || undefined,
        bio: formData.bio || undefined,
        category: formData.category || undefined,
        instagram_handle: formData.instagram_handle || undefined,
        youtube_channel: formData.youtube_channel || undefined,
        tiktok_handle: formData.tiktok_handle || undefined,
        website_url: formData.website_url || undefined
      };

      await createInfluencer(profileData);
      onProfileCreated();
    } catch (error) {
      console.error('Error creating influencer profile:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const popularNiches = [
    'Fashion', 'Beauty', 'Lifestyle', 'Tech', 'Gaming', 
    'Fitness', 'Food', 'Travel', 'Business', 'Education'
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <Star className="h-12 w-12 text-purple-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Creator Dashboard
          </h1>
          <p className="text-gray-600">
            Let's set up your influencer profile to get started with live streaming
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              Create Your Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="display_name">Display Name *</Label>
                  <Input
                    id="display_name"
                    value={formData.display_name}
                    onChange={(e) => handleInputChange('display_name', e.target.value)}
                    placeholder="Your creator name"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="first_name">First Name *</Label>
                    <Input
                      id="first_name"
                      value={formData.first_name}
                      onChange={(e) => handleInputChange('first_name', e.target.value)}
                      placeholder="Enter your first name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="last_name">Last Name *</Label>
                    <Input
                      id="last_name"
                      value={formData.last_name}
                      onChange={(e) => handleInputChange('last_name', e.target.value)}
                      placeholder="Enter your last name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Tell us about yourself and what you create..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    placeholder="e.g., Fashion, Tech, Gaming"
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {popularNiches.map((niche) => (
                      <Badge
                        key={niche}
                        variant="outline"
                        className="cursor-pointer hover:bg-purple-50"
                        onClick={() => handleInputChange('category', niche)}
                      >
                        {niche}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Social Media (Optional)</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="instagram_handle" className="flex items-center">
                      <Instagram className="mr-2 h-4 w-4" />
                      Instagram
                    </Label>
                    <Input
                      id="instagram_handle"
                      value={formData.instagram_handle}
                      onChange={(e) => handleInputChange('instagram_handle', e.target.value)}
                      placeholder="@username"
                    />
                  </div>

                  <div>
                    <Label htmlFor="youtube_channel" className="flex items-center">
                      <Youtube className="mr-2 h-4 w-4" />
                      YouTube
                    </Label>
                    <Input
                      id="youtube_channel"
                      value={formData.youtube_channel}
                      onChange={(e) => handleInputChange('youtube_channel', e.target.value)}
                      placeholder="Channel URL or @handle"
                    />
                  </div>

                  <div>
                    <Label htmlFor="tiktok_handle" className="flex items-center">
                      <Camera className="mr-2 h-4 w-4" />
                      TikTok
                    </Label>
                    <Input
                      id="tiktok_handle"
                      value={formData.tiktok_handle}
                      onChange={(e) => handleInputChange('tiktok_handle', e.target.value)}
                      placeholder="@username"
                    />
                  </div>

                  <div>
                    <Label htmlFor="website_url">Website</Label>
                    <Input
                      id="website_url"
                      value={formData.website_url}
                      onChange={(e) => handleInputChange('website_url', e.target.value)}
                      placeholder="https://yourwebsite.com"
                      type="url"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={loading || !formData.display_name}
                  className="min-w-[140px]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      Create Profile
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InfluencerProfileSetup;
