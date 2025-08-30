import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, AuthError, Session } from '@supabase/supabase-js'
import { supabase, Profile, Customer, Wholesaler, Influencer } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'
import { handleLogoutWithFallback, analyzeNetworkError } from '@/utils/networkErrorHandler'

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
  createRoleProfileWithSession: (role: UserRole, profileData: any, authUser: any) => Promise<{ data?: any; error: Error | null }>
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

      // For influencers, create default achievements, goals, and settings
      if (role === 'influencer' && data) {
        try {
          // Create default achievements
          await supabase.rpc('create_default_influencer_achievements', { 
            p_influencer_id: data.id 
          })

          // Create default goals
          await supabase.rpc('create_default_influencer_goals', { 
            p_influencer_id: data.id 
          })

          // Create default settings
          await supabase.rpc('create_default_influencer_settings', { 
            p_influencer_id: data.id 
          })

          console.log('Default influencer data created successfully')
        } catch (setupError) {
          console.error('Error creating default influencer data:', setupError)
          // Don't fail the entire signup process if this fails
        }
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

  // New function that handles profile creation with proper session management
  const createRoleProfileWithSession = async (role: UserRole, profileData: any, authUser: any) => {
    try {
      console.log('Creating role profile for:', role, 'with user:', authUser.id)
      
      let tableName: string
      let insertData: any

      switch (role) {
        case 'customer':
          tableName = 'customers'
          insertData = {
            user_id: authUser.id,
            email: authUser.email,
            first_name: profileData.first_name || '',
            last_name: profileData.last_name || '',
            phone: profileData.phone || null
          }
          console.log('Creating customer profile with data:', insertData)
          break
        case 'wholesaler':
          tableName = 'wholesalers'
          insertData = {
            user_id: authUser.id,
            email: authUser.email,
            business_name: profileData.business_name || '',
            contact_person_name: profileData.contact_person_name || '',
            phone: profileData.phone || null,
            business_address_line_1: profileData.business_address_line_1 || null,
            business_type: profileData.business_type || null,
            business_registration_number: profileData.business_registration_number || null,
            description: profileData.description || null
          }
          break
        case 'influencer':
          tableName = 'influencers'
          insertData = {
            user_id: authUser.id,
            email: authUser.email,
            // For initial signup, create minimal profile
            first_name: profileData.first_name || '',
            last_name: profileData.last_name || '',
            display_name: profileData.display_name || 'New Creator',
            phone: profileData.phone || null,
            bio: profileData.bio || null,
            category: profileData.category || null,
            instagram_handle: profileData.instagram_handle || null,
            youtube_channel: profileData.youtube_channel || null,
            tiktok_handle: profileData.tiktok_handle || null,
            experience_years: profileData.experience_years || 0,
            followers_count: profileData.followers_count || 0
          }
          break
        default:
          return { error: new Error('Invalid role') }
      }

      console.log(`Creating ${role} profile with data:`, insertData)

      // Use upsert to avoid conflicts if profile already exists
      const { data, error } = await supabase
        .from(tableName)
        .upsert(insertData, { 
          onConflict: 'user_id',
          ignoreDuplicates: false 
        })
        .select()
        .single()

      if (error) {
        console.error(`Error creating ${role} profile:`, error)
        console.error(`Attempted to insert data:`, insertData)
        console.error(`Into table:`, tableName)
        
        // Provide more detailed error information
        let errorMessage = `Failed to create ${role} profile: ${error.message}`
        if (error.message.includes('duplicate key')) {
          errorMessage = `Profile already exists for this user`
        } else if (error.message.includes('violates foreign key')) {
          errorMessage = `User authentication issue. Please try signing up again.`
        }
        
        return { error: new Error(errorMessage) }
      }

      console.log(`${role} profile created successfully:`, data)

      // For influencers, try to create default achievements, goals, and settings (optional)
      if (role === 'influencer' && data) {
        try {
          console.log('Attempting to create default influencer data...')
          
          // Create default achievements
          await supabase.rpc('create_default_influencer_achievements', { 
            p_influencer_id: data.id 
          })

          // Create default goals
          await supabase.rpc('create_default_influencer_goals', { 
            p_influencer_id: data.id 
          })

          // Create default settings
          await supabase.rpc('create_default_influencer_settings', { 
            p_influencer_id: data.id 
          })

          console.log('Default influencer data created successfully')
        } catch (setupError) {
          console.warn('Warning: Could not create default data for influencer (RPC functions may not exist):', setupError)
          // Don't fail the profile creation if default data setup fails
        }
      }

      // Update the user profile state if we have user context
      if (user) {
        setUserProfile({
          role,
          profile: data,
          legacyProfile: userProfile?.legacyProfile || null
        })
      }

      return { data, error: null }
    } catch (error: any) {
      console.error(`Error in createRoleProfileWithSession:`, error)
      return { error: new Error(`Failed to create profile: ${error.message}`) }
    }
  }

  const signUp = async (email: string, password: string, role: UserRole, profileData?: any) => {
    setLoading(true)
    try {
      console.log('Starting signup process for:', email, 'role:', role)
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { 
            role,
            profile_data: profileData // Store profile data in user metadata for later use
          },
          emailRedirectTo: `${window.location.protocol}//${window.location.hostname}:${window.location.port}/auth/callback`,
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
        return { error, requiresEmailConfirmation: false }
      }

      console.log('Supabase auth signup successful:', data)

      if (data.user && profileData) {
        console.log('User created, now creating profile with data:', profileData)
        
        // Check if user is confirmed (no email confirmation required) or we have a session
        if (data.session) {
          console.log('Session available immediately:', data.session.user.id)
          // Update user state with the authenticated user
          setUser(data.session.user)
          
          // Create the role-specific profile using the session user
          const profileResult = await createRoleProfileWithSession(role, profileData, data.session.user)
          if (profileResult.error) {
            console.error('Profile creation error:', profileResult.error)
            toast({
              title: 'Profile creation failed',
              description: profileResult.error.message,
              variant: 'destructive'
            })
            return { error: profileResult.error, requiresEmailConfirmation: false }
          }
          console.log('Profile created successfully:', profileResult.data)
        } else {
          console.log('Email confirmation required - user will need to verify email before full access')
          // For email confirmation cases, we'll create the profile when they sign in after confirmation
          toast({
            title: 'Account created!',
            description: 'Please check your email to verify your account before signing in.',
            variant: 'default'
          })
          return { error: null, requiresEmailConfirmation: true }
        }
      }

      console.log('Signup success:', data)
      toast({
        title: 'Account created successfully!',
        description: `Welcome to Kein! Your ${role} account has been set up.`
      })

      return { error: null, requiresEmailConfirmation: false }
    } catch (error: any) {
      console.error('Signup process error:', error)
      toast({
        title: 'Signup failed',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive'
      })
      return { error: error, requiresEmailConfirmation: false }
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
      } 
      
      if (data.user) {
        // Check if user has a profile, if not, try to create one from user metadata
        const userMetadata = data.user.user_metadata
        console.log('User signed in with metadata:', userMetadata)
        
        if (userMetadata?.role && userMetadata?.profile_data) {
          console.log('Checking for existing profile for user:', data.user.id, 'role:', userMetadata.role)
          
          // Try to fetch existing profile using the role from metadata
          let hasExistingProfile = false
          try {
            const tableName = userMetadata.role === 'customer' ? 'customers' : 
                             userMetadata.role === 'wholesaler' ? 'wholesalers' : 'influencers'
            
            const { data: existingProfile, error: fetchError } = await supabase
              .from(tableName)
              .select('id')
              .eq('user_id', data.user.id)
              .single()
            
            if (fetchError) {
              console.log('Profile fetch error or not found:', fetchError.message)
              hasExistingProfile = false
            } else {
              console.log('Existing profile found:', existingProfile)
              hasExistingProfile = !!existingProfile
            }
          } catch (error) {
            console.log('Exception checking for existing profile:', error)
            hasExistingProfile = false
          }
          
          if (!hasExistingProfile) {
            console.log('No existing profile found, creating from metadata:', userMetadata.profile_data)
            
            // Create profile from stored metadata
            const profileResult = await createRoleProfileWithSession(
              userMetadata.role, 
              userMetadata.profile_data, 
              data.user
            )
            
            if (profileResult.error) {
              console.warn('Could not create profile on sign-in:', profileResult.error)
              // Don't fail the sign-in, just warn
            } else {
              console.log('Profile created successfully on sign-in:', profileResult.data)
            }
          } else {
            console.log('User already has a profile, skipping creation')
          }
        } else {
          console.log('No role or profile data in user metadata')
        }
        
        toast({
          title: 'Welcome back!',
          description: 'You have successfully signed in'
        })
        return { user: data.user, error: null }
      }
      
      return { user: null, error: new Error('No user data received') }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      const result = await handleLogoutWithFallback(() => supabase.auth.signOut());
      
      if (result.error && !result.wasGracefulFallback) {
        toast({
          title: 'Sign out failed',
          description: result.error.message,
          variant: 'destructive'
        })
      } else {
        // Clear local session data for both successful and graceful fallback logouts
        setUser(null)
        setUserProfile(null)
        setSession(null)
        
        if (result.wasGracefulFallback) {
          toast({
            title: 'Signed out locally',
            description: 'You have been signed out locally. Server logout may have failed due to network issues.',
            variant: 'default'
          })
        } else {
          toast({
            title: 'Signed out',
            description: 'You have been signed out successfully'
          })
        }
      }

      return { error: result.error }
    } catch (error: any) {
      const networkError = analyzeNetworkError(error);
      
      toast({
        title: 'Sign out error',
        description: networkError.userMessage,
        variant: 'destructive'
      })
      
      return { error: error as AuthError }
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
    createRoleProfileWithSession,
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
