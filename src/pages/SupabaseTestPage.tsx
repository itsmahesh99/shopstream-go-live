import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { testSupabaseConnection, testSupabaseAuth } from '@/test-supabase'
import { supabase } from '@/lib/supabase'

export default function SupabaseTestPage() {
  const [connectionResult, setConnectionResult] = useState<any>(null)
  const [authResult, setAuthResult] = useState<any>(null)
  const [signupResult, setSignupResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [testEmail, setTestEmail] = useState('test@example.com')
  const [testPassword, setTestPassword] = useState('testpassword123')

  const testConnection = async () => {
    setLoading(true)
    const result = await testSupabaseConnection()
    setConnectionResult(result)
    setLoading(false)
  }

  const testAuth = async () => {
    setLoading(true)
    const result = await testSupabaseAuth()
    setAuthResult(result)
    setLoading(false)
  }

  const testSignup = async () => {
    setLoading(true)
    try {
      console.log('Testing signup with:', { email: testEmail, password: testPassword })
      
      // Try to signup with auto-confirmation workaround
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
        options: {
          emailRedirectTo: undefined,
          captchaToken: undefined,
          data: { skip_confirmation: true }
        }
      })
      
      if (error) {
        console.error('Signup error:', error)
        
        // Check if it's specifically an email confirmation error
        if (error.message.includes('confirmation') || error.message.includes('email')) {
          setSignupResult({ 
            success: false, 
            error: error.message, 
            details: error,
            suggestion: `Email confirmation is required. For local Supabase:
            1. Access your local Supabase admin panel at: http://kein-supabase-3c6399-194-238-19-82.traefik.me
            2. Go to Authentication > Settings
            3. Disable "Enable email confirmations"
            OR run the SQL from 'disable-email-confirmation.sql' file`
          })
        } else {
          setSignupResult({ 
            success: false, 
            error: error.message, 
            details: error,
            suggestion: 'Check Supabase configuration and database schema.'
          })
        }
      } else {
        console.log('Signup success:', data)
        
        // Check if user was automatically confirmed
        if (data.user && !data.user.email_confirmed_at) {
          setSignupResult({ 
            success: true, 
            data,
            note: 'User created but needs email confirmation. This is expected for local Supabase with default settings.'
          })
        } else {
          setSignupResult({ 
            success: true, 
            data,
            note: 'User created and confirmed successfully!'
          })
        }
      }
    } catch (err) {
      console.error('Signup network error:', err)
      setSignupResult({ success: false, error: 'Network error', details: err })
    }
    setLoading(false)
  }

  useEffect(() => {
    // Display current environment variables
    console.log('Environment check:')
    console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL)
    console.log('VITE_SUPABASE_ANON_KEY exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY)
    console.log('VITE_SUPABASE_ANON_KEY length:', import.meta.env.VITE_SUPABASE_ANON_KEY?.length || 0)
  }, [])

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Supabase Connection Test</h1>
      
      {/* Environment Info */}
      <Card>
        <CardHeader>
          <CardTitle>Environment Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>Supabase URL:</strong> {import.meta.env.VITE_SUPABASE_URL || 'Not set'}</p>
            <p><strong>Anon Key:</strong> {import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set (Length: ' + import.meta.env.VITE_SUPABASE_ANON_KEY.length + ')' : 'Not set'}</p>
          </div>
        </CardContent>
      </Card>

      {/* Database Setup Help */}
      <Card>
        <CardHeader>
          <CardTitle>Database Setup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">Missing Profiles Table?</h4>
            <p className="text-yellow-700 text-sm mb-3">
              If you see "relation 'public.profiles' does not exist", you need to create the database schema.
            </p>
            <div className="space-y-2">
              <p className="text-sm font-medium">Steps to fix:</p>
              <ol className="text-sm text-yellow-700 list-decimal list-inside space-y-1">
                <li>Go to your Supabase project dashboard</li>
                <li>Navigate to SQL Editor</li>
                <li>Copy and paste the SQL from <code>supabase-schema.sql</code> file</li>
                <li>Run the query to create the profiles table</li>
                <li>Refresh this page and test again</li>
              </ol>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Email Confirmation Issues?</h4>
            <p className="text-blue-700 text-sm mb-3">
              If you see "Error sending confirmation email", disable email confirmation:
            </p>
            <div className="space-y-2">
              <p className="text-sm font-medium">Steps to fix:</p>
              <ol className="text-sm text-blue-700 list-decimal list-inside space-y-1">
                <li>Go to Supabase → Authentication → Settings</li>
                <li>Turn OFF "Enable email confirmations"</li>
                <li>Save settings</li>
                <li>Test signup again</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Connection Test */}
      <Card>
        <CardHeader>
          <CardTitle>Database Connection Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={testConnection} disabled={loading}>
            Test Database Connection
          </Button>
          
          {connectionResult && (
            <Alert variant={connectionResult.success ? 'default' : 'destructive'}>
              <AlertDescription>
                {connectionResult.success ? '✅ Connection successful' : `❌ ${connectionResult.error}`}
                <pre className="mt-2 text-xs">{JSON.stringify(connectionResult, null, 2)}</pre>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Auth Test */}
      <Card>
        <CardHeader>
          <CardTitle>Auth Endpoint Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={testAuth} disabled={loading}>
            Test Auth Endpoint
          </Button>
          
          {authResult && (
            <Alert variant={authResult.success ? 'default' : 'destructive'}>
              <AlertDescription>
                {authResult.success ? '✅ Auth endpoint accessible' : `❌ ${authResult.error}`}
                <pre className="mt-2 text-xs">{JSON.stringify(authResult, null, 2)}</pre>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Signup Test */}
      <Card>
        <CardHeader>
          <CardTitle>Signup Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input 
              type="email" 
              placeholder="Test email" 
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
            />
            <Input 
              type="password" 
              placeholder="Test password" 
              value={testPassword}
              onChange={(e) => setTestPassword(e.target.value)}
            />
          </div>
          
          <Button onClick={testSignup} disabled={loading}>
            Test Signup
          </Button>
          
          {signupResult && (
            <Alert variant={signupResult.success ? 'default' : 'destructive'}>
              <AlertDescription>
                {signupResult.success ? '✅ Signup successful' : `❌ ${signupResult.error}`}
                <pre className="mt-2 text-xs overflow-auto max-h-40">
                  {JSON.stringify(signupResult, null, 2)}
                </pre>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
