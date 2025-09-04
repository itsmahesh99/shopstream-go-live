import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/contexts/AuthContext'

const AuthCallbackPage = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { createRoleProfileWithSession } = useAuth()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          toast({
            title: 'Authentication failed',
            description: error.message,
            variant: 'destructive'
          })
          navigate('/login')
          return
        }

        if (data.session) {
          // Get user role from metadata to redirect appropriately
          const userRole = data.session.user.user_metadata?.role
          const profileData = data.session.user.user_metadata?.profile_data
          
          console.log('User confirmed email:', userRole, 'with profile data:', profileData)
          
          // Create profile if it doesn't exist and we have profile data
          if (profileData && userRole) {
            try {
              // First check if profile already exists
              const tableName = userRole === 'customer' ? 'customers' : 'influencers'
              
              const { data: existingProfile } = await supabase
                .from(tableName)
                .select('id')
                .eq('user_id', data.session.user.id)
                .single()
              
              if (!existingProfile) {
                // Only create if profile doesn't exist
                const result = await createRoleProfileWithSession(userRole, profileData, data.session.user)
                if (result.error) {
                  console.warn('Could not create profile after email confirmation:', result.error)
                  // Don't fail the login process, user can create profile later
                } else {
                  console.log('Profile created successfully after email confirmation')
                }
              } else {
                console.log('Profile already exists, skipping creation')
              }
            } catch (error) {
              console.warn('Error handling profile after email confirmation:', error)
              // Don't fail the login process
            }
          }
          
          toast({
            title: 'Welcome!',
            description: 'You have been successfully signed in'
          })
          
          // Role-based redirection after email confirmation
          switch (userRole) {
            case 'customer':
              navigate('/home')
              break
            case 'influencer':
              navigate('/influencer/profile-completion')
              break
            default:
              navigate('/home')
          }
        } else {
          navigate('/login')
        }
      } catch (error) {
        console.error('Unexpected error:', error)
        navigate('/login')
      } finally {
        setLoading(false)
      }
    }

    handleAuthCallback()
  }, [navigate, toast])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-kein-blue mx-auto"></div>
          <p className="mt-4 text-gray-600">Completing sign in...</p>
        </div>
      </div>
    )
  }

  return null
}

export default AuthCallbackPage
