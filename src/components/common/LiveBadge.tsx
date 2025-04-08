
import React from "react";

interface LiveBadgeProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const LiveBadge: React.FC<LiveBadgeProps> = ({ size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "text-xs px-1.5 py-0.5",
    md: "text-sm px-2 py-0.5",
    lg: "text-base px-3 py-1",
  };

  return (
    <div className={`inline-flex items-center bg-red-500 text-white font-medium rounded-full ${sizeClasses[size]} ${className}`}>
      <div className="h-1.5 w-1.5 bg-white rounded-full mr-1 animate-pulse"></div>
      <span>LIVE</span>
    </div>
  );
};

export default LiveBadge;
