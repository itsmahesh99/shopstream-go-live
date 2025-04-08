
import React from "react";
import { cn } from "@/lib/utils";

interface LiveBadgeProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const LiveBadge: React.FC<LiveBadgeProps> = ({ 
  className,
  size = "md" 
}) => {
  const sizeClasses = {
    sm: "text-[10px] px-1.5 py-0.5",
    md: "text-xs px-2 py-0.5",
    lg: "text-sm px-2.5 py-1"
  };

  return (
    <span className={cn(
      "inline-flex items-center justify-center rounded-full bg-kein-coral text-white font-medium animate-pulse-live",
      sizeClasses[size],
      className
    )}>
      LIVE
    </span>
  );
};

export default LiveBadge;
