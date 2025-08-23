import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Video, Eye, EyeOff, ArrowLeft } from 'lucide-react';

const InfluencerSignupPage = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    username: '',
    phone: '',
    bio: '',
    socialMedia: {
      instagram: '',
      youtube: '',
      tiktok: '',
      facebook: ''
    },
    categories: '',
    experienceLevel: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.target.name.includes('socialMedia.')) {
      const platform = e.target.name.split('.')[1];
      setFormData({
        ...formData,
        socialMedia: {
          ...formData.socialMedia,
          [platform]: e.target.value
        }
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const result = await signUp(formData.email, formData.password, 'influencer', {
        first_name: formData.name.split(' ')[0] || '',
        last_name: formData.name.split(' ').slice(1).join(' ') || '',
        display_name: formData.username,
        phone: formData.phone,
        bio: formData.bio,
        instagram_handle: formData.socialMedia.instagram,
        youtube_channel: formData.socialMedia.youtube,
        tiktok_handle: formData.socialMedia.tiktok,
        category: formData.categories,
        experience_years: formData.experienceLevel ? parseInt(formData.experienceLevel) : undefined
      });
      
      if (!result.error) {
        // Navigate to influencer dashboard
        navigate('/influencer/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 px-4 py-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <img 
              src="/keinlogo.png" 
              alt="Kein Logo" 
              className="h-12 w-auto"
            />
          </div>
          <Button
            variant="ghost"
            onClick={() => navigate('/home')}
            className="mb-4 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-purple-500 flex items-center justify-center mb-4">
              <Video className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Join as Influencer</CardTitle>
            <p className="text-gray-600 mt-2">
              Create your creator account to start live streaming and earning commissions
            </p>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="@yourusername"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="categories">Content Categories</Label>
                <Input
                  id="categories"
                  name="categories"
                  type="text"
                  placeholder="e.g., Fashion, Tech, Beauty, Lifestyle"
                  value={formData.categories}
                  onChange={handleInputChange}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="experienceLevel">Experience Level</Label>
                <Input
                  id="experienceLevel"
                  name="experienceLevel"
                  type="text"
                  placeholder="e.g., Beginner, Intermediate, Expert"
                  value={formData.experienceLevel}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  placeholder="Tell us about yourself and your content"
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="mt-1"
                  rows={3}
                />
              </div>

              {/* Social Media Links */}
              <div className="space-y-3">
                <Label>Social Media Profiles (Optional)</Label>
                
                <div>
                  <Input
                    name="socialMedia.instagram"
                    type="url"
                    placeholder="Instagram URL"
                    value={formData.socialMedia.instagram}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Input
                    name="socialMedia.youtube"
                    type="url"
                    placeholder="YouTube URL"
                    value={formData.socialMedia.youtube}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Input
                    name="socialMedia.tiktok"
                    type="url"
                    placeholder="TikTok URL"
                    value={formData.socialMedia.tiktok}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Input
                    name="socialMedia.facebook"
                    type="url"
                    placeholder="Facebook URL"
                    value={formData.socialMedia.facebook}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className="mt-1"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                {loading ? 'Creating Account...' : 'Create Influencer Account'}
              </Button>
            </form>

            <div className="text-center pt-4">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-purple-500 font-medium hover:underline">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InfluencerSignupPage;
