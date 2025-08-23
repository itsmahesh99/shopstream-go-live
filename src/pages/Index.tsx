
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [timeoutReached, setTimeoutReached] = useState(false);

  useEffect(() => {
    // Set a timeout fallback in case auth loading gets stuck
    const timeout = setTimeout(() => {
      console.log('Auth timeout reached, redirecting to home...');
      setTimeoutReached(true);
    }, 2000); // 2 seconds timeout

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!loading || timeoutReached) {
      console.log('Redirecting to home page...', { loading, timeoutReached });
      // Redirect all users to home page regardless of authentication status
      navigate("/home", { replace: true });
    }
  }, [loading, timeoutReached, navigate]);

  // Always show loading for max 2 seconds, then redirect
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">
          {timeoutReached ? "Redirecting..." : "Loading..."}
        </p>
      </div>
    </div>
  );
};

export default Index;
