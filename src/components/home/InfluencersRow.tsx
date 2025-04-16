
import React from "react";
import InfluencerAvatar from "@/components/common/InfluencerAvatar";

interface Influencer {
  id: string;
  name: string;
  image: string;
  isLive: boolean;
}

interface InfluencersRowProps {
  influencers: Influencer[];
}

const InfluencersRow: React.FC<InfluencersRowProps> = ({ influencers }) => {
  return (
    <div className="pt-4 pb-2 overflow-x-auto scrollbar-hide flex space-x-4">
      <div className="flex-shrink-0">
        <div className="flex flex-col items-center justify-center w-16 h-16 rounded-full bg-gray-100 border border-dashed border-gray-300">
          <span className="text-2xl text-gray-400">+</span>
        </div>
        <span className="text-xs mt-2 text-center">Follow</span>
      </div>
      
      {influencers.map((influencer) => (
        <div key={influencer.id} className="flex-shrink-0">
          <InfluencerAvatar
            src={influencer.image}
            name={influencer.name}
            isLive={influencer.isLive}
          />
        </div>
      ))}
    </div>
  );
};

export default InfluencersRow;
