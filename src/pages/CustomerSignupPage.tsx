import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Eye, EyeOff, ArrowLeft } from 'lucide-react';

const CustomerSignupPage = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: ''
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
      const result = await signUp(formData.email, formData.password, 'customer', {
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone
      });
      
      if (!result.error) {
        if ((result as any).requiresEmailConfirmation) {
          // Show email confirmation message instead of redirecting
          setShowEmailConfirmation(true);
        } else {
          // Navigate to customer home page (for auto-confirmed users)
          navigate('/home');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4 py-8">
      <div className="max-w-md mx-auto">
        {showEmailConfirmation ? (
          // Email Confirmation Screen
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Check Your Email</h2>
                <p className="text-gray-600 mb-6">
                  We've sent a confirmation link to <strong>{formData.email}</strong>
                </p>
                <p className="text-sm text-gray-500 mb-8">
                  Click the link in your email to verify your account and complete the signup process.
                </p>
                <div className="space-y-4">
                  <button
                    onClick={() => window.open('https://gmail.com', '_blank')}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
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
          // Regular Signup Form
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h1>
              <p className="text-gray-600">Join Kein and start shopping with live shows</p>
            </div>

            {/* Back Button */}
            <div className="mb-6">
              <Button 
                variant="outline" 
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 border-gray-300 hover:bg-gray-50"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </div>

            {/* Signup Form */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl text-gray-900">Customer Registration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-gray-700 font-medium">
                        First Name *
                      </Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        placeholder="Enter first name"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-gray-700 font-medium">
                        Last Name *
                      </Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        required
                        placeholder="Enter last name"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 font-medium">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-700 font-medium">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-700 font-medium">
                      Password *
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                      Confirm Password *
                    </Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating Account...
                      </div>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </form>

                {/* Login Link */}
                <div className="text-center pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-500 font-medium hover:underline">
                      Sign in here
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default CustomerSignupPage;
