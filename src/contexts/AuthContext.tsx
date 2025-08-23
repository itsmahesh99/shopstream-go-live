import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, AuthError, Session } from '@supabase/supabase-js'
import { supabase, Profile, Customer, Wholesaler, Influencer } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

export type UserRole = 'customer' | 'wholesaler' | 'influencer'

export interface UserProfileData {
  role: UserRole
  profile: Customer | Wholesaler | Influencer | null
  legacyProfile: Profile | null // For backward compatibility
}

interface AuthContextType {
  user: User | null
  userProfile: UserProfileData | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, role: UserRole, metadata?: any) => Promise<{ error: AuthError | null }>
  signIn: (email: string, password: string) => Promise<{ user: User | null; error: AuthError | null }>
  signOut: () => Promise<{ error: AuthError | null }>
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>
  updateUser: (updates: { email?: string; password?: string; data?: any }) => Promise<{ error: AuthError | null }>
  updateProfile: (updates: any) => Promise<{ error: Error | null }>
  createRoleProfile: (role: UserRole, profileData: any) => Promise<{ error: Error | null }>
  getUser: () => Promise<{ user: User | null; error: AuthError | null }>
  // Legacy support
  profile: Profile | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  // Legacy support
  const profile = userProfile?.legacyProfile || null

  useEffect(() => {
    let mounted = true

    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (!mounted) return

      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        fetchUserProfile(session.user.id).finally(() => {
          if (mounted) setLoading(false)
        })
      } else {
        setLoading(false)
      }
    }).catch((error) => {
      console.error('Auth session error:', error)
      if (mounted) setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return

        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          // Don't await - update profile in background
          fetchUserProfile(session.user.id)
        } else {
          setUserProfile(null)
        }
        
        // Only set loading to false for initial session
        if (event === 'INITIAL_SESSION') {
          setLoading(false)
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const fetchUserProfile = async (userId: string) => {
    try {
      // Use a more efficient approach - check user metadata first for role
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      const userRole = currentUser?.user_metadata?.role as UserRole
      
      if (userRole) {
        // If we know the role, query only the relevant table
        let roleProfile: Customer | Wholesaler | Influencer | null = null
        
        switch (userRole) {
          case 'customer':
            const { data: customerData } = await supabase
              .from('customers')
              .select('*')
              .eq('user_id', userId)
              .single()
            roleProfile = customerData
            break
            
          case 'wholesaler':
            const { data: wholesalerData } = await supabase
              .from('wholesalers')
              .select('*')
              .eq('user_id', userId)
              .single()
            roleProfile = wholesalerData
            break
            
          case 'influencer':
            const { data: influencerData } = await supabase
              .from('influencers')
              .select('*')
              .eq('user_id', userId)
              .single()
            roleProfile = influencerData
            break
        }
        
        setUserProfile({
          role: userRole,
          profile: roleProfile,
          legacyProfile: null
        })
        return
      }

      // Fallback: If no role in metadata, check all tables (only for legacy users)
      const [
        { data: customerData },
        { data: wholesalerData }, 
        { data: influencerData },
        { data: legacyProfile }
      ] = await Promise.all([
        supabase.from('customers').select('*').eq('user_id', userId).maybeSingle(),
        supabase.from('wholesalers').select('*').eq('user_id', userId).maybeSingle(),
        supabase.from('influencers').select('*').eq('user_id', userId).maybeSingle(),
        supabase.from('profiles').select('*').eq('id', userId).maybeSingle()
      ])

      let role: UserRole = 'customer' // Default role
      let roleProfile: Customer | Wholesaler | Influencer | null = null

      if (customerData) {
        role = 'customer'
        roleProfile = customerData
      } else if (wholesalerData) {
        role = 'wholesaler'
        roleProfile = wholesalerData
      } else if (influencerData) {
        role = 'influencer'
        roleProfile = influencerData
      }

      setUserProfile({
        role,
        profile: roleProfile,
        legacyProfile: legacyProfile || null
      })

    } catch (error) {
      console.error('Error fetching user profile:', error)
      setUserProfile({
        role: 'customer',
        profile: null,
        legacyProfile: null
      })
    }
  }
  const createRoleProfile = async (role: UserRole, profileData: any) => {
    if (!user) {
      return { error: new Error('User not authenticated') }
    }

    try {
      let tableName: string
      let insertData: any

      switch (role) {
        case 'customer':
          tableName = 'customers'
          insertData = {
            user_id: user.id,
            email: user.email,
            first_name: profileData.first_name || '',
            last_name: profileData.last_name || '',
            phone: profileData.phone || '',
            ...profileData
          }
          break
        case 'wholesaler':
          tableName = 'wholesalers'
          insertData = {
            user_id: user.id,
            email: user.email,
            business_name: profileData.business_name || '',
            contact_person_name: profileData.contact_person_name || '',
            phone: profileData.phone || '',
            ...profileData
          }
          break
        case 'influencer':
          tableName = 'influencers'
          insertData = {
            user_id: user.id,
            email: user.email,
            first_name: profileData.first_name || '',
            last_name: profileData.last_name || '',
            display_name: profileData.display_name || '',
            phone: profileData.phone || '',
            ...profileData
          }
          break
        default:
          return { error: new Error('Invalid role') }
      }

      const { data, error } = await supabase
        .from(tableName)
        .insert(insertData)
        .select()
        .single()

      if (error) {
        console.error(`Error creating ${role} profile:`, error)
        return { error: new Error(`Failed to create ${role} profile: ${error.message}`) }
      }

      // Update the user profile state
      setUserProfile({
        role,
        profile: data,
        legacyProfile: userProfile?.legacyProfile || null
      })

      toast({
        title: 'Profile created successfully!',
        description: `Your ${role} profile has been set up.`
      })

      return { error: null }
    } catch (error) {
      console.error('Error creating role profile:', error)
      return { error: error as Error }
    }
  }

  const signUp = async (email: string, password: string, role: UserRole, profileData?: any) => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { role },
          emailRedirectTo: undefined,
          captchaToken: undefined
        }
      })

      if (error) {
        console.error('Signup error:', error)
        toast({
          title: 'Sign up failed',
          description: error.message,
          variant: 'destructive'
        })
        return { error }
      }

      if (data.user && profileData) {
        // Wait a moment for the user to be properly created
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Set the user manually for profile creation
        setUser(data.user)
        
        // Create the role-specific profile
        const profileResult = await createRoleProfile(role, profileData)
        if (profileResult.error) {
          console.error('Profile creation error:', profileResult.error)
          toast({
            title: 'Profile creation failed',
            description: profileResult.error.message,
            variant: 'destructive'
          })
          return { error: profileResult.error }
        }
      }

      console.log('Signup success:', data)
      toast({
        title: 'Account created successfully!',
        description: `Welcome to Kein! Your ${role} account has been set up.`
      })

      return { error: null }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        toast({
          title: 'Sign in failed',
          description: error.message,
          variant: 'destructive'
        })
        return { user: null, error }
      } else {
        toast({
          title: 'Welcome back!',
          description: 'You have successfully signed in'
        })
        return { user: data.user, error: null }
      }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        toast({
          title: 'Sign out failed',
          description: error.message,
          variant: 'destructive'
        })
      } else {
        toast({
          title: 'Signed out',
          description: 'You have been signed out successfully'
        })
      }

      return { error }
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (error) {
        toast({
          title: 'Password reset failed',
          description: error.message,
          variant: 'destructive'
        })
      } else {
        toast({
          title: 'Password reset email sent',
          description: 'Please check your email for password reset instructions'
        })
      }

      return { error }
    } catch (error) {
      const authError = error as AuthError
      toast({
        title: 'Password reset failed',
        description: authError.message,
        variant: 'destructive'
      })
      return { error: authError }
    }
  }

  const updateProfile = async (updates: any) => {
    if (!user || !userProfile) {
      return { error: new Error('No user logged in or profile not found') }
    }

    try {
      // Update the appropriate role-specific table
      const tableName = userProfile.role === 'customer' ? 'customers' : 
                       userProfile.role === 'wholesaler' ? 'wholesalers' : 'influencers'

      const { error } = await (supabase as any)
        .from(tableName)
        .update(updates)
        .eq('user_id', user.id)

      if (error) {
        toast({
          title: 'Profile update failed',
          description: error.message,
          variant: 'destructive'
        })
        return { error: new Error(error.message) }
      } else {
        // Refresh profile data
        await fetchUserProfile(user.id)
        toast({
          title: 'Profile updated',
          description: 'Your profile has been updated successfully'
        })
        return { error: null }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      toast({
        title: 'Profile update failed',
        description: errorMessage,
        variant: 'destructive'
      })
      return { error: new Error(errorMessage) }
    }
  }

  const updateUser = async (updates: { email?: string; password?: string; data?: any }) => {
    if (!user) {
      const error = new Error('No user logged in') as AuthError
      return { error }
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser(updates)

      if (error) {
        toast({
          title: 'User update failed',
          description: error.message,
          variant: 'destructive'
        })
      } else {
        toast({
          title: 'User updated',
          description: 'Your account has been updated successfully'
        })
      }

      return { error }
    } finally {
      setLoading(false)
    }
  }

  const getUser = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      return { user, error }
    } catch (error) {
      return { user: null, error: error as AuthError }
    }
  }

  const value: AuthContextType = {
    user,
    userProfile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateUser,
    updateProfile,
    createRoleProfile,
    getUser,
    // Legacy support
    profile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
