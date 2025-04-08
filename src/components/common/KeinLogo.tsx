
import React from "react";

interface KeinLogoProps {
  className?: string;
  variant?: "full" | "icon";
}

const KeinLogo: React.FC<KeinLogoProps> = ({ className = "", variant = "full" }) => {
  if (variant === "icon") {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <rect width="120" height="120" rx="40" fill="#003366" />
          <path d="M41.5 42H35V78H41.5V62.5L57.5 78H66L46 58L65 42H57L41.5 57V42Z" fill="white" />
          <rect x="70" y="42" width="6.5" height="36" fill="white" />
          <rect x="81" y="42" width="6.5" height="36" fill="white" />
        </svg>
      </div>
    );
  }

  return (
    <div className={`flex items-center ${className}`}>
      <svg viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full">
        <path d="M19.5 4H13V40H19.5V24.5L35.5 40H44L24 20L43 4H35L19.5 19V4Z" fill="#003366" />
        <path d="M50 4H56.5V40H50V4Z" fill="#003366" />
        <path d="M63 4H69.5V40H63V4Z" fill="#003366" />
        <path d="M76 4H107V10.5H96V40H89.5V10.5H76V4Z" fill="#003366" />
      </svg>
    </div>
  );
};

export default KeinLogo;
