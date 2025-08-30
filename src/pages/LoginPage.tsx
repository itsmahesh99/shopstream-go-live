
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { signIn, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    try {
      const { user, error } = await signIn(email, password);
      
      if (error) {
        setError(error.message);
        return;
      }

      if (user) {
        // Role-based routing after successful login
        const userRole = user.user_metadata?.role;
        
        switch (userRole) {
          case 'customer':
            navigate('/home');
            break;
          case 'wholesaler':
            navigate('/wholesaler/dashboard');
            break;
          case 'influencer':
            navigate('/influencer/dashboard');
            break;
          default:
            navigate('/home');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
    }
  };

  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth with Supabase
    console.log("Google login not yet implemented");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 px-4 py-8">
      <div className="max-w-md mx-auto pt-8">
        <h1 className="text-4xl font-bold mb-1">Login</h1>
        <p className="text-gray-600 mb-8">Welcome back to Kein!</p>

        <div className="space-y-6">
          <Button 
            variant="outline" 
            className="w-full justify-start h-12 px-4 text-black bg-white border-gray-300"
            onClick={handleGoogleLogin}
          >
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" alt="Google" className="w-5 h-5 mr-2" />
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gradient-to-b from-white to-blue-50 text-gray-500">Or via Email</span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Input 
                type="email" 
                placeholder="Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 bg-white/80"
              />
            </div>
            
            <div className="space-y-2 relative">
              <Input 
                type={showPassword ? "text" : "password"}
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 bg-white/80 pr-10"
              />
              <button 
                type="button" 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me
                </label>
              </div>
              <Link to="/forgot-password" className="text-sm text-kein-blue">
                Forgot password?
              </Link>
            </div>

            <Button 
              type="submit"
              className="w-full bg-kein-blue hover:bg-kein-blue/90 text-white h-12"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Login"}
            </Button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Don't have an account? <Link to="/signup" className="text-kein-blue font-medium">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
