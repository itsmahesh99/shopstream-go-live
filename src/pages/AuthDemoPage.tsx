import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth, UserRole } from '@/contexts/AuthContext'
import { ArrowLeft, User, Mail, Lock, RefreshCw } from 'lucide-react'
import { Link } from 'react-router-dom'

const AuthDemoPage = () => {
  const { 
    user, 
    userProfile,
    profile, 
    session, 
    loading, 
    signUp, 
    signIn, 
    signOut, 
    resetPassword, 
    updateUser, 
    updateProfile, 
    getUser 
  } = useAuth()

  const [demoData, setDemoData] = useState<{
    email: string;
    password: string;
    name: string;
    role: UserRole;
  }>({
    email: 'demo@example.com',
    password: 'demopass123',
    name: 'Demo User',
    role: 'customer'
  })

  const [responses, setResponses] = useState<any[]>([])

  const addResponse = (method: string, response: any) => {
    setResponses(prev => [
      { method, response, timestamp: new Date().toLocaleTimeString() },
      ...prev.slice(0, 9) // Keep only last 10 responses
    ])
  }

  const handleDemoSignUp = async () => {
    const result = await signUp(demoData.email, demoData.password, demoData.role, { 
      name: demoData.name
    })
    addResponse('signUp', result)
  }

  const handleDemoSignIn = async () => {
    const result = await signIn(demoData.email, demoData.password)
    addResponse('signIn', result)
  }

  const handleDemoSignOut = async () => {
    const result = await signOut()
    addResponse('signOut', result)
  }

  const handleDemoResetPassword = async () => {
    const result = await resetPassword(demoData.email)
    addResponse('resetPassword', result)
  }

  const handleDemoUpdateUser = async () => {
    const result = await updateUser({ 
      data: { demo_updated: true, last_demo_update: new Date().toISOString() }
    })
    addResponse('updateUser', result)
  }

  const handleDemoUpdateProfile = async () => {
    const result = await updateProfile({ 
      name: `${demoData.name} (Updated ${new Date().getHours()}:${new Date().getMinutes()})`
    })
    addResponse('updateProfile', result)
  }

  const handleDemoGetUser = async () => {
    const result = await getUser()
    addResponse('getUser', result)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center mb-6">
          <Link to="/home" className="mr-4">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Supabase Auth Demo</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current User State */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Current User State
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Loading</Label>
                  <div className={`p-2 rounded ${loading ? 'bg-yellow-100' : 'bg-green-100'}`}>
                    {loading ? 'Loading...' : 'Ready'}
                  </div>
                </div>
                
                <div>
                  <Label>User</Label>
                  <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-32">
                    {JSON.stringify(user, null, 2)}
                  </pre>
                </div>
                
                <div>
                  <Label>User Profile (Role-based)</Label>
                  <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-32">
                    {JSON.stringify(userProfile, null, 2)}
                  </pre>
                </div>
                
                <div>
                  <Label>Profile (Legacy)</Label>
                  <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-32">
                    {JSON.stringify(profile, null, 2)}
                  </pre>
                </div>
                
                <div>
                  <Label>Session</Label>
                  <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-32">
                    {JSON.stringify(session ? { 
                      access_token: session.access_token.substring(0, 20) + '...', 
                      user: session.user.email,
                      expires_at: session.expires_at 
                    } : null, null, 2)}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Demo Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5" />
                Auth Methods Demo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-2">
                  <Label>Demo Data</Label>
                  <Input
                    placeholder="Email"
                    value={demoData.email}
                    onChange={(e) => setDemoData(prev => ({ ...prev, email: e.target.value }))}
                  />
                  <Input
                    placeholder="Password"
                    type="password"
                    value={demoData.password}
                    onChange={(e) => setDemoData(prev => ({ ...prev, password: e.target.value }))}
                  />
                  <Input
                    placeholder="Name"
                    value={demoData.name}
                    onChange={(e) => setDemoData(prev => ({ ...prev, name: e.target.value }))}
                  />
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={demoData.role}
                    onChange={(e) => setDemoData(prev => ({ ...prev, role: e.target.value as UserRole }))}
                  >
                    <option value="customer">Customer</option>
                    <option value="wholesaler">Wholesaler</option>
                    <option value="influencer">Influencer</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button size="sm" onClick={handleDemoSignUp} disabled={loading}>
                    Sign Up
                  </Button>
                  <Button size="sm" onClick={handleDemoSignIn} disabled={loading}>
                    Sign In
                  </Button>
                  <Button size="sm" onClick={handleDemoSignOut} disabled={loading}>
                    Sign Out
                  </Button>
                  <Button size="sm" onClick={handleDemoResetPassword} disabled={loading}>
                    Reset Password
                  </Button>
                  <Button size="sm" onClick={handleDemoGetUser} disabled={loading}>
                    Get User
                  </Button>
                  <Button size="sm" onClick={handleDemoUpdateUser} disabled={loading || !user}>
                    Update User
                  </Button>
                  <Button size="sm" onClick={handleDemoUpdateProfile} disabled={loading || !user}>
                    Update Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Response Log */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                API Response Log
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-auto">
                {responses.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    No API calls yet. Try the demo buttons above!
                  </p>
                ) : (
                  responses.map((response, index) => (
                    <div key={index} className="border rounded p-3 bg-gray-50">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-sm">{response.method}</span>
                        <span className="text-xs text-gray-500">{response.timestamp}</span>
                      </div>
                      <pre className="text-xs overflow-auto">
                        {JSON.stringify(response.response, null, 2)}
                      </pre>
                    </div>
                  ))
                )}
              </div>
              {responses.length > 0 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setResponses([])}
                  className="mt-4 w-full"
                >
                  Clear Log
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Code Examples */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Code Examples
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>Sign Up</Label>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
{`const { error } = await signUp(
  'user@example.com', 
  'password123', 
  'customer', // role: 'customer' | 'wholesaler' | 'influencer'
  { name: 'User Name' }
)`}
                </pre>
              </div>
              
              <div>
                <Label>Sign In</Label>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
{`const { user, error } = await signIn('user@example.com', 'password123')
// Returns user object for role-based routing`}
                </pre>
              </div>
              
              <div>
                <Label>Update User</Label>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
{`const { error } = await updateUser({
  email: 'new@email.com',
  password: 'newpassword',
  data: { custom: 'metadata' }
})`}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AuthDemoPage
