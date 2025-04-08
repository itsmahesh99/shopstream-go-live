
import React from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import LiveBadge from "./LiveBadge";

interface InfluencerAvatarProps {
  src: string;
  name: string;
  isLive?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const InfluencerAvatar: React.FC<InfluencerAvatarProps> = ({
  src,
  name,
  isLive = false,
  className,
  size = "md"
}) => {
  const sizeClasses = {
    sm: "h-12 w-12",
    md: "h-16 w-16",
    lg: "h-20 w-20"
  };

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className={cn("relative flex flex-col items-center", className)}>
      <div className={cn("relative rounded-full overflow-hidden", isLive && "ring-2 ring-kein-coral")}>
        <Avatar className={cn(sizeClasses[size])}>
          <AvatarImage src={src} alt={name} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        {isLive && (
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
            <LiveBadge size="sm" />
          </div>
        )}
      </div>
      <span className="text-xs mt-2 font-medium text-center max-w-full truncate">
        {name}
      </span>
    </div>
  );
};

export default InfluencerAvatar;
