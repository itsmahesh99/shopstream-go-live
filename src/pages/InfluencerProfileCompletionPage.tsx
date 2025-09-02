import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { toast } from '@/hooks/use-toast'

const InfluencerProfileCompletionPage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    display_name: '',
    phone: '',
    bio: '',
    category: '',
    instagram_handle: '',
    youtube_channel: '',
    tiktok_handle: '',
    experience_years: 1,
    followers_count: 0
  })

  useEffect(() => {
    if (!user) {
      navigate('/auth/signin')
      return
    }
    
    // Check if user has already completed profile
    checkProfileCompletion()
  }, [user, navigate])

  const checkProfileCompletion = async () => {
    if (!user) return
    
    try {
      const { data: profile, error } = await supabase
        .from('influencers')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking profile:', error)
        return
      }

      if (profile) {
        // Check if profile is complete (has required fields filled)
        const isProfileComplete = profile.bio && profile.category && profile.first_name && profile.last_name
        
        if (isProfileComplete) {
          console.log('Profile is already complete, redirecting to dashboard')
          navigate('/influencer/dashboard')
          return
        }
        
        // Pre-fill form with existing data (profile may be partially complete)
        setFormData({
          first_name: profile.first_name || '',
          last_name: profile.last_name || '',
          display_name: profile.display_name || '',
          phone: profile.phone || '',
          bio: profile.bio || '',
          category: profile.category || '',
          instagram_handle: profile.instagram_handle || '',
          youtube_channel: profile.youtube_channel || '',
          tiktok_handle: profile.tiktok_handle || '',
          experience_years: profile.experience_years || 1,
          followers_count: profile.followers_count || 0
        })
      } else {
        console.log('No existing profile found - this should not happen after signup')
      }
    } catch (error) {
      console.error('Error checking profile completion:', error)
    }
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    // Validate required fields
    if (!formData.first_name || !formData.last_name || !formData.display_name || !formData.bio || !formData.category) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields (First Name, Last Name, Display Name, Bio, and Category).",
        variant: "destructive"
      })
      return
    }

    // Additional validation for field content
    if (formData.first_name.trim().length === 0 || formData.last_name.trim().length === 0) {
      toast({
        title: "Validation Error",
        description: "First name and last name cannot be empty.",
        variant: "destructive"
      })
      return
    }

    if (formData.display_name.trim().length === 0) {
      toast({
        title: "Validation Error",
        description: "Display name cannot be empty.",
        variant: "destructive"
      })
      return
    }

    // Validate field lengths to match database constraints
    if (formData.first_name.length > 50) {
      toast({
        title: "Validation Error",
        description: "First name must be 50 characters or less.",
        variant: "destructive"
      })
      return
    }

    if (formData.last_name.length > 50) {
      toast({
        title: "Validation Error", 
        description: "Last name must be 50 characters or less.",
        variant: "destructive"
      })
      return
    }

    if (formData.display_name.length > 100) {
      toast({
        title: "Validation Error",
        description: "Display name must be 100 characters or less.",
        variant: "destructive"
      })
      return
    }

    if (formData.phone && formData.phone.length > 20) {
      toast({
        title: "Validation Error",
        description: "Phone number must be 20 characters or less.",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)

    try {
      console.log('Updating influencer profile with data:', {
        first_name: formData.first_name,
        last_name: formData.last_name,
        display_name: formData.display_name,
        phone: formData.phone || null,
        bio: formData.bio,
        category: formData.category,
        instagram_handle: formData.instagram_handle || null,
        youtube_channel: formData.youtube_channel || null,
        tiktok_handle: formData.tiktok_handle || null,
        experience_years: Number(formData.experience_years),
        followers_count: Number(formData.followers_count)
      })

      // Prepare clean data for update
      const updateData = {
        first_name: formData.first_name.trim().substring(0, 50),
        last_name: formData.last_name.trim().substring(0, 50),
        display_name: formData.display_name.trim().substring(0, 100),
        phone: formData.phone?.trim().substring(0, 20) || null,
        bio: formData.bio.trim(),
        category: formData.category,
        instagram_handle: formData.instagram_handle?.trim().substring(0, 100) || null,
        youtube_channel: formData.youtube_channel?.trim().substring(0, 100) || null,
        tiktok_handle: formData.tiktok_handle?.trim().substring(0, 100) || null,
        experience_years: Math.max(0, Math.min(50, Number(formData.experience_years) || 1)),
        followers_count: Math.max(0, Number(formData.followers_count) || 0),
        updated_at: new Date().toISOString()
      }

      // Remove empty strings and replace with null for optional fields
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === '' && ['phone', 'instagram_handle', 'youtube_channel', 'tiktok_handle'].includes(key)) {
          updateData[key] = null
        }
      })

      console.log('Clean update data being sent:', updateData)

      // Try the update first
      const { data, error } = await supabase
        .from('influencers')
        .update(updateData)
        .eq('user_id', user.id)
        .select('*')
        .single()

      if (error) {
        console.error('Profile update error details:', {
          error,
          user_id: user.id,
          formData,
          errorCode: error.code,
          errorMessage: error.message,
          errorDetails: error.details
        })
        
        // If update fails because no row exists, try to create one
        if (error.code === 'PGRST116' || error.message.includes('No rows found')) {
          console.log('No existing profile found, attempting to create one...')
          
          const { data: createData, error: createError } = await supabase
            .from('influencers')
            .insert({
              user_id: user.id,
              email: user.email || '',
              ...updateData
            })
            .select('*')
            .single()
          
          if (createError) {
            console.error('Profile creation error:', createError)
            let errorMessage = "Failed to create profile. Please try again."
            if (createError.message.includes('duplicate key')) {
              errorMessage = "Profile already exists. Please try refreshing the page."
            } else if (createError.message.includes('violates check constraint')) {
              errorMessage = "Please check your input values and try again."
            }
            
            toast({
              title: "Error",
              description: errorMessage,
              variant: "destructive"
            })
            return
          }
          
          console.log('Profile created successfully:', createData)
          
          toast({
            title: "Success!",
            description: "Your profile has been created successfully."
          })

          navigate('/influencer/dashboard')
          return
        }
        
        let errorMessage = "Failed to complete profile. Please try again."
        if (error.message.includes('violates check constraint')) {
          errorMessage = "Please check your input values and try again."
        } else if (error.message.includes('duplicate key')) {
          errorMessage = "Display name already exists. Please choose a different one."
        }
        
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive"
        })
        return
      }

      console.log('Profile updated successfully:', data)

      toast({
        title: "Success!",
        description: "Your profile has been completed successfully."
      })

      navigate('/influencer/dashboard')
    } catch (error) {
      console.error('Unexpected error during profile update:', error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const categories = [
    "Fashion & Style",
    "Beauty & Makeup",
    "Fitness & Health",
    "Food & Cooking",
    "Travel & Lifestyle",
    "Technology",
    "Gaming",
    "Music & Entertainment",
    "Art & Design",
    "Business & Finance",
    "Education",
    "Sports",
    "Home & Garden",
    "Parenting & Family",
    "Photography",
    "Other"
  ]

  if (!user) {
    return <div>Redirecting...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Complete Your Creator Profile
            </CardTitle>
            <CardDescription className="text-lg">
              Tell us more about yourself to get started on ShopStream
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="first_name">First Name *</Label>
                    <Input
                      id="first_name"
                      value={formData.first_name}
                      onChange={(e) => handleInputChange('first_name', e.target.value)}
                      placeholder="Your first name"
                      maxLength={50}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="last_name">Last Name *</Label>
                    <Input
                      id="last_name"
                      value={formData.last_name}
                      onChange={(e) => handleInputChange('last_name', e.target.value)}
                      placeholder="Your last name"
                      maxLength={50}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Creator Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Creator Profile</h3>
                
                {/* Display Name */}
                <div className="space-y-2">
                  <Label htmlFor="display_name">Creator Display Name *</Label>
                  <Input
                    id="display_name"
                    value={formData.display_name}
                    onChange={(e) => handleInputChange('display_name', e.target.value)}
                    placeholder="Your creator name"
                    maxLength={100}
                    required
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Your phone number"
                    maxLength={20}
                  />
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio *</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Tell us about yourself and your content style..."
                    className="min-h-[100px]"
                    required
                  />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category">Content Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your main content category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Social Media Handles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="instagram_handle">Instagram Handle</Label>
                  <Input
                    id="instagram_handle"
                    value={formData.instagram_handle}
                    onChange={(e) => handleInputChange('instagram_handle', e.target.value)}
                    placeholder="@username"
                    maxLength={100}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="youtube_channel">YouTube Channel</Label>
                  <Input
                    id="youtube_channel"
                    value={formData.youtube_channel}
                    onChange={(e) => handleInputChange('youtube_channel', e.target.value)}
                    placeholder="Channel name or URL"
                    maxLength={100}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tiktok_handle">TikTok Handle</Label>
                <Input
                  id="tiktok_handle"
                  value={formData.tiktok_handle}
                  onChange={(e) => handleInputChange('tiktok_handle', e.target.value)}
                  placeholder="@username"
                  maxLength={100}
                />
              </div>

              {/* Experience and Followers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="experience_years">Years of Experience</Label>
                  <Select 
                    value={formData.experience_years.toString()} 
                    onValueChange={(value) => handleInputChange('experience_years', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year} {year === 1 ? 'Year' : 'Years'}
                        </SelectItem>
                      ))}
                      <SelectItem key="10+" value="10">10+ Years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="followers_count">Total Followers</Label>
                  <Input
                    id="followers_count"
                    type="number"
                    min="0"
                    value={formData.followers_count}
                    onChange={(e) => handleInputChange('followers_count', parseInt(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                disabled={isLoading}
              >
                {isLoading ? 'Completing Profile...' : 'Complete Profile & Continue'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default InfluencerProfileCompletionPage
