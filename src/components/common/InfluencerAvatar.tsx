
import React from "react";
import LiveBadge from "./LiveBadge";

interface InfluencerAvatarProps {
  src: string;
  name: string;
  isLive?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const InfluencerAvatar: React.FC<InfluencerAvatarProps> = ({
  src,
  name,
  isLive = false,
  size = "md",
  className = "",
}) => {
  const sizeClasses = {
    sm: "w-14 h-14",
    md: "w-20 h-20",
    lg: "w-24 h-24",
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className={`relative ${sizeClasses[size]} mb-1`}>
        <img
          src={src}
          alt={name}
          className="w-full h-full rounded-full object-cover border border-gray-200"
        />
        {isLive && (
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/3">
            <LiveBadge size="sm" />
          </div>
        )}
      </div>
      <span className={`${textSizeClasses[size]} font-medium text-center line-clamp-1`}>
        {name}
      </span>
    </div>
  );
};

export default InfluencerAvatar;
