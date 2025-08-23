import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

const AuthCallbackPage = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
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
          toast({
            title: 'Welcome!',
            description: 'You have been successfully signed in'
          })
          navigate('/home')
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
