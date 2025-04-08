
import React from "react";

interface KeinLogoProps {
  className?: string;
  variant?: "full" | "icon";
}

const KeinLogo: React.FC<KeinLogoProps> = ({ className = "", variant = "full" }) => {
  if (variant === "icon") {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M30 20C30 25.5228 25.5228 30 20 30C14.4772 30 10 25.5228 10 20C10 14.4772 14.4772 10 20 10C25.5228 10 30 14.4772 30 20Z" 
            fill="#003366" fillOpacity="0.1" />
          <path d="M23.3333 20L16.6667 16.6667V23.3333L23.3333 20Z" fill="#003366" />
        </svg>
      </div>
    );
  }

  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex items-center">
        <div className="mr-2">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M30 20C30 25.5228 25.5228 30 20 30C14.4772 30 10 25.5228 10 20C10 14.4772 14.4772 10 20 10C25.5228 10 30 14.4772 30 20Z" 
              fill="#003366" fillOpacity="0.1" />
            <path d="M23.3333 20L16.6667 16.6667V23.3333L23.3333 20Z" fill="#003366" />
          </svg>
        </div>
        <div className="text-2xl font-bold text-[#003366]">kein</div>
      </div>
    </div>
  );
};

export default KeinLogo;
