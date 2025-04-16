
import React from "react";
import { Link } from "react-router-dom";
import LiveBadge from "@/components/common/LiveBadge";

interface LiveStream {
  id: string;
  title: string;
  influencer: string;
  thumbnail: string;
  viewCount: number;
  isLive: boolean;
}

interface LiveShoppingSectionProps {
  streams: LiveStream[];
}

const LiveShoppingSection: React.FC<LiveShoppingSectionProps> = ({ streams }) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Live shopping</h2>
        <Link to="/live/featured" className="text-sm text-gray-600">
          Show All
        </Link>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {streams.map((stream) => (
          <Link to={`/live/${stream.id}`} key={stream.id} className="relative rounded-lg overflow-hidden aspect-[3/4] shadow-md">
            <img 
              src={stream.thumbnail} 
              alt={stream.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-2">
              <LiveBadge />
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
              <div className="flex items-center mb-1">
                <span className="text-white text-xs mr-2">
                  <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                  {stream.viewCount.toLocaleString()}
                </span>
              </div>
              <h3 className="text-white font-medium text-sm line-clamp-2">
                {stream.title}
              </h3>
              <p className="text-white/80 text-xs mt-1">
                {stream.influencer}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LiveShoppingSection;
