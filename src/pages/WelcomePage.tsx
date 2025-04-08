
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import KeinLogo from "@/components/common/KeinLogo";

const WelcomePage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-blue-50 px-4">
      <div className="w-full max-w-md flex flex-col items-center">
        <div className="flex flex-col items-center justify-center mb-12">
          <KeinLogo className="h-32 w-32" variant="icon" />
          <h1 className="text-5xl font-bold text-gray-900 mt-6">welcome!</h1>
          <p className="text-gray-600 mt-2 text-lg">Shop Live, buy Instant!</p>
        </div>

        <div className="w-full space-y-4">
          <Link to="/signup" className="w-full block">
            <Button className="w-full bg-kein-blue hover:bg-kein-blue/90 text-white py-6 text-lg">
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
