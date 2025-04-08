
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-12 text-center">
      <div className="max-w-md">
        <h1 className="text-9xl font-bold text-kein-blue">404</h1>
        <h2 className="text-2xl font-semibold mt-6 mb-2">Page not found</h2>
        <p className="text-gray-600 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col space-y-3">
          <Link to="/home">
            <Button className="w-full bg-kein-blue hover:bg-kein-blue/90">
              <Home className="h-4 w-4 mr-2" />
              Back to home
            </Button>
          </Link>
          
          <Link to="/search">
            <Button variant="outline" className="w-full border-gray-300">
              Search for products
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
