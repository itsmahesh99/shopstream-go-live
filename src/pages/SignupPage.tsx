
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const SignupPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Account created",
      description: "Welcome to Kein!",
    });
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 px-4 py-8">
      <div className="max-w-md mx-auto pt-8">
        <h1 className="text-4xl font-bold mb-1">Sign up</h1>
        <p className="text-gray-600 mb-8">Get started on Kein!</p>

        <div className="space-y-6">
          <Button 
            variant="outline" 
            className="w-full justify-start h-12 px-4 text-black bg-white"
            onClick={() => {
              toast({
                title: "Google signup",
                description: "This would connect to Google authentication",
              });
              navigate("/home");
            }}
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

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Input 
                type="text" 
                placeholder="Full Name" 
                className="h-12 bg-white/80"
              />
            </div>
            <div className="space-y-2">
              <Input 
                type="email" 
                placeholder="Email" 
                className="h-12 bg-white/80"
              />
            </div>
            <div className="space-y-2">
              <Input 
                type="password" 
                placeholder="Password" 
                className="h-12 bg-white/80"
              />
            </div>
            <div className="flex">
              <div className="flex border rounded-l h-12 items-center px-3 bg-white/80">
                <span className="text-sm">🇬🇧</span>
                <span className="ml-2">+44</span>
              </div>
              <Input 
                type="tel" 
                placeholder="Your number" 
                className="h-12 rounded-l-none bg-white/80"
              />
            </div>

            <div className="text-xs text-gray-600">
              By continuing, you agree to our <Link to="#" className="text-kein-blue">Terms of service</Link> and <Link to="#" className="text-kein-blue">Privacy policy</Link>
            </div>

            <Button 
              type="submit"
              className="w-full bg-kein-blue hover:bg-kein-blue/90 text-white h-12"
            >
              Sign up
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account? <Link to="/login" className="text-kein-blue font-medium">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
