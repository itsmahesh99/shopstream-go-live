
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
          <path fillRule="evenodd" clipRule="evenodd" d="M84 50C84 68.2254 69.2254 83 51 83C32.7746 83 18 68.2254 18 50C18 31.7746 32.7746 17 51 17C69.2254 17 84 31.7746 84 50ZM50 68C65.464 68 78 55.464 78 40C78 24.536 65.464 12 50 12C34.536 12 22 24.536 22 40C22 55.464 34.536 68 50 68Z" fill="#003366"/>
          <path d="M38 40L55 30V50L38 40Z" fill="#003366"/>
        </svg>
      </div>
    );
  }

  return (
    <div className={`flex items-center ${className}`}>
      <img
        src="/lovable-uploads/4ddbe42d-1f4d-429c-8684-768339decf0e.png"
        alt="Kein Logo"
        className="h-full w-auto max-h-14"
      />
    </div>
  );
};

export default KeinLogo;
