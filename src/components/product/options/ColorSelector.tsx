
import React from "react";

interface ColorSelectorProps {
  colors: string[];
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  getColorImage: (color: string) => string;
}

const ColorSelector = ({ 
  colors, 
  selectedColor, 
  setSelectedColor, 
  getColorImage 
}: ColorSelectorProps) => {
  return (
    <div className="py-4 border-b">
      <h3 className="font-medium mb-3 text-sm">Color</h3>
      <div className="flex flex-wrap gap-2">
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => setSelectedColor(color)}
            className={`w-14 h-14 rounded-md overflow-hidden ${
              selectedColor === color 
                ? 'ring-2 ring-kein-blue ring-offset-1' 
                : 'border border-gray-200'
            }`}
          >
            <img 
              src={getColorImage(color)} 
              alt={color} 
              className="w-full h-full object-cover"
            />
            {selectedColor === color && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="h-5 w-5 bg-kein-blue rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ColorSelector;
