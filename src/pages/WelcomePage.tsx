
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import KeinLogo from "@/components/common/KeinLogo";
import { useIsMobile } from "@/hooks/use-mobile";

const WelcomePage = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  useEffect(() => {
    // If not mobile, redirect to role selection page
    if (isMobile === false) {
      navigate("/signup", { replace: true });
    }
  }, [isMobile, navigate]);

  // Show loading state while determining mobile status
  if (isMobile === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <KeinLogo className="h-16 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Only render welcome page on mobile
  if (!isMobile) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="w-full max-w-md flex flex-col items-center">
        <div className="flex flex-col items-center justify-center mb-16">
          <KeinLogo className="h-20" />
          <h1 className="text-5xl font-bold text-gray-900 mt-6">welcome!</h1>
          <p className="text-gray-600 mt-2 text-lg">Shop Live, buy Instant!</p>
        </div>

        <div className="w-full space-y-4">
          <Link to="/signup" className="w-full block">
            <Button className="w-full bg-kein-blue hover:bg-kein-darkblue text-white py-6 text-lg">
              Let's get started
            </Button>
          </Link>
          
          <Link to="/login" className="w-full block">
            <Button variant="outline" className="w-full text-kein-blue border-kein-blue py-6 text-lg">
              I already have an account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
