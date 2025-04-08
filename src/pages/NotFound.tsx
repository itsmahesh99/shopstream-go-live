
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-8">
      <div className="text-center">
        <div className="flex flex-col items-center">
          <div className="bg-kein-blue rounded-full p-5 mb-6">
            <ShoppingBag className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-6xl font-bold mb-4 text-kein-blue">404</h1>
        </div>
        <p className="text-xl text-gray-600 mb-8">Oops! We couldn't find that page</p>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link to="/home">
          <Button className="bg-kein-blue text-white px-8">
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
