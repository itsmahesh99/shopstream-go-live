
import React from "react";

interface KeinLogoProps {
  className?: string;
  variant?: "full" | "icon";
}

const KeinLogo: React.FC<KeinLogoProps> = ({ className = "", variant = "full" }) => {
  if (variant === "icon") {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M50 12C34.536 12 22 24.536 22 40C22 55.464 34.536 68 50 68C65.464 68 78 55.464 78 40C78 24.536 65.464 12 50 12Z" fill="#003366" />
          <path d="M26 40L50 25L50 55L26 40Z" fill="white" />
        </svg>
      </div>
    );
  }

  return (
    <div className={`flex items-center ${className}`}>
      <svg width="100%" height="100%" viewBox="0 0 320 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M94.5 24C89.8 24 86 27.8 86 32.5V35.5H82C77.3 35.5 73.5 39.3 73.5 44V77.5C73.5 82.2 77.3 86 82 86H107C111.7 86 115.5 82.2 115.5 77.5V44C115.5 39.3 111.7 35.5 107 35.5H103V32.5C103 27.8 99.2 24 94.5 24Z" stroke="#003366" strokeWidth="5"/>
        <path d="M86 60L103 51.5V68.5L86 60Z" fill="#003366"/>
        
        <path d="M158 35L134 35L134 84.5L143 84.5L143 65L158 84.5L169.5 84.5L151 61L168 35L158 35Z" fill="#003366"/>
        <path d="M188 35C178.5 35 170.5 43 170.5 52.5C170.5 62 178.5 70 188 70C197.5 70 205.5 62 205.5 52.5C205.5 43 197.5 35 188 35ZM188 61.5C183.3 61.5 179.5 57.7 179.5 53C179.5 48.3 183.3 44.5 188 44.5C192.7 44.5 196.5 48.3 196.5 53C196.5 57.7 192.7 61.5 188 61.5Z" fill="#003366"/>
        <path d="M209 35H217.5V84.5H209V35Z" fill="#003366"/>
        <path d="M244 44.5V84.5H235.5V44.5H222.5V35H257V44.5H244Z" fill="#003366"/>
      </svg>
    </div>
  );
};

export default KeinLogo;
