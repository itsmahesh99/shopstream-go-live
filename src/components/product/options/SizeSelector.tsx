
import React from "react";

interface SizeSelectorProps {
  sizes: string[];
  selectedSize: string;
  setSelectedSize: (size: string) => void;
}

const SizeSelector = ({ sizes, selectedSize, setSelectedSize }: SizeSelectorProps) => {
  return (
    <div className="py-4 border-b">
      <h3 className="font-medium mb-3 text-sm">Size</h3>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => setSelectedSize(size)}
            className={`h-10 px-4 rounded-md flex items-center justify-center ${
              selectedSize === size 
              ? 'bg-kein-blue text-white' 
              : 'bg-gray-100 text-gray-800'
            } ${
              size === 'XXL' || size === 'XXXL' ? 'bg-gray-100/50 text-gray-400' : ''
            }`}
            disabled={size === 'XXL' || size === 'XXXL'}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SizeSelector;
