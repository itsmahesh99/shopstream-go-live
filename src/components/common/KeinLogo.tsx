
import React from "react";
import { cn } from "@/lib/utils";
import { ShoppingBag, Play } from "lucide-react";

interface KeinLogoProps {
  className?: string;
  variant?: "full" | "icon";
}

const KeinLogo: React.FC<KeinLogoProps> = ({ 
  className, 
  variant = "full" 
}) => {
  if (variant === "icon") {
    return (
      <div className={cn("flex items-center justify-center rounded-full bg-kein-blue p-2", className)}>
        <div className="relative">
          <ShoppingBag className="h-6 w-6 text-white" />
          <Play className="h-3 w-3 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" fill="white" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center", className)}>
      <div className="flex items-center justify-center rounded-full bg-kein-blue p-1 mr-2">
        <div className="relative">
          <ShoppingBag className="h-5 w-5 text-white" />
          <Play className="h-2.5 w-2.5 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" fill="white" />
        </div>
      </div>
      <span className="font-bold text-kein-blue text-xl">Kein</span>
    </div>
  );
};

export default KeinLogo;
