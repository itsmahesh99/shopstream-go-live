import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Video, Eye, EyeOff, ArrowLeft, Star, Users, Camera } from 'lucide-react';

const InfluencerSignupPage = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  
  const [formData, setFormData] = useState({
    // Auth fields only
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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

    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      console.log('Starting influencer signup with form data:', formData);
      
      // For initial signup, only send email (no profile data)
      const basicProfileData = {
        email: formData.email.trim()
      };

      console.log('Basic profile data for initial signup:', basicProfileData);

      const result = await signUp(formData.email, formData.password, 'influencer', basicProfileData);
      
      if (!result.error) {
        if ((result as any).requiresEmailConfirmation) {
          // Show email confirmation message instead of redirecting
          setShowEmailConfirmation(true);
        } else {
          // Navigate to influencer dashboard (for auto-confirmed users)
          navigate('/influencer/dashboard');
        }
      }
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message || 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 px-4 py-8">
      <div className="max-w-md mx-auto">
        {showEmailConfirmation ? (
          // Email Confirmation Screen
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Check Your Email</h2>
                <p className="text-gray-600 mb-6">
                  We've sent a confirmation link to <strong>{formData.email}</strong>
                </p>
                <p className="text-sm text-gray-500 mb-8">
                  Click the link in your email to verify your account and access your influencer dashboard.
                </p>
                <div className="space-y-4">
                  <button
                    onClick={() => window.open('https://gmail.com', '_blank')}
                    className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                  >
                    Open Gmail
                  </button>
                  <button
                    onClick={() => setShowEmailConfirmation(false)}
                    className="w-full text-gray-600 py-2 px-4 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                  >
                    Back to Signup
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
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

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Account Information
                </h3>
                
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="mt-1"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              {/* Account Security */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Account Security</h3>
                
                <div>
                  <Label htmlFor="password">Password *</Label>
                  <div className="relative mt-1">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="pr-10"
                      placeholder="Create a strong password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
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
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="mt-1"
                    placeholder="Confirm your password"
                  />
                </div>
              </div>

              {/* Info about what comes next */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Star className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-purple-900">Next: Complete Your Creator Profile</h4>
                    <p className="text-sm text-purple-700 mt-1">
                      After email verification, you'll complete your creator profile with personal details, bio, social media, and content preferences.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating Account...
                    </>
                  ) : (
                    'Create Influencer Account'
                  )}
                </Button>
              </div>
            </form>

            <div className="text-center pt-6">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-purple-500 font-medium hover:underline">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Benefits Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
            <Camera className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">Live Streaming</h3>
            <p className="text-sm text-gray-600">Showcase products in real-time</p>
          </div>
          <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
            <Star className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">Earn Commissions</h3>
            <p className="text-sm text-gray-600">Get paid for every sale</p>
          </div>
          <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
            <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">Build Audience</h3>
            <p className="text-sm text-gray-600">Grow your following</p>
          </div>
        </div>
          </>
        )}
      </div>
    </div>
  );
};

export default InfluencerSignupPage;
