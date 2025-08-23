import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";

const ForgotPasswordPage = () => {
  const { resetPassword, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      return;
    }
    
    const { error } = await resetPassword(email);
    
    if (!error) {
      setIsSubmitted(true);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 px-4 py-8">
        <div className="max-w-md mx-auto pt-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Check your email</h1>
            <p className="text-gray-600 mb-8">
              We've sent a password reset link to {email}
            </p>
            <Link 
              to="/login" 
              className="text-kein-blue font-medium hover:underline"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 px-4 py-8">
      <div className="max-w-md mx-auto pt-16">
        <h1 className="text-4xl font-bold mb-1">Forgot Password</h1>
        <p className="text-gray-600 mb-8">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Input 
              type="email" 
              placeholder="Email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 bg-white/80"
              required
            />
          </div>

          <Button 
            type="submit"
            className="w-full bg-kein-blue hover:bg-kein-blue/90 text-white h-12"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>

        <div className="text-center mt-6">
          <Link 
            to="/login" 
            className="text-sm text-kein-blue font-medium hover:underline"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
