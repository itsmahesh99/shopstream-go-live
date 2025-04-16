
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const UpcomingShows: React.FC = () => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Upcoming Shows</h2>
      <div className="space-y-4">
        <Link
          to="/live/upcoming1"
          className="bg-gray-100 rounded-lg p-4 flex flex-col justify-between h-24"
        >
          <div className="flex justify-between">
            <h3 className="font-bold text-sm">🔥 BLOWOUT SALE! 🔥</h3>
            <span className="text-xs text-gray-500">Clothing</span>
          </div>
          <p className="text-xs">DEALS & STEALS Show with John & Jane Moore</p>
          <div className="flex justify-between">
            <span className="text-xs text-gray-500">Tomorrow, 8PM</span>
            <Button variant="ghost" size="sm" className="text-xs h-6 px-2 py-0 text-kein-blue hover:text-kein-blue hover:bg-blue-50">
              Remind me
            </Button>
          </div>
        </Link>
        
        <Link
          to="/live/upcoming2"
          className="bg-gray-100 rounded-lg p-4 flex flex-col justify-between h-24"
        >
          <div className="flex justify-between">
            <h3 className="font-bold text-sm">VEGAS BABY VEGAS!</h3>
            <span className="text-xs text-gray-500">Fashion</span>
          </div>
          <p className="text-xs">Vegas Deal Specials with Sarah</p>
          <div className="flex justify-between">
            <span className="text-xs text-gray-500">Apr 10, 7PM</span>
            <Button variant="ghost" size="sm" className="text-xs h-6 px-2 py-0 text-kein-blue hover:text-kein-blue hover:bg-blue-50">
              Remind me
            </Button>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default UpcomingShows;
