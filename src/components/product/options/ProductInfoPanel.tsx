
import React from "react";

interface ProductInfoPanelProps {
  title: string;
  price: number;
  discountPrice?: number;
  selectedColor: string;
  selectedSize: string;
  image: string;
}

const ProductInfoPanel = ({ 
  title, 
  price, 
  discountPrice, 
  selectedColor, 
  selectedSize,
  image
}: ProductInfoPanelProps) => {
  return (
    <div className="py-4 flex items-start justify-between border-b">
      <div className="flex items-center">
        <img
          src={image}
          alt={title}
          className="h-16 w-16 rounded-md object-cover mr-3"
        />
        <div>
          <h3 className="font-medium text-base line-clamp-1">{title}</h3>
          <div className="flex space-x-2 mt-1 items-center">
            <span className="font-bold">
              ₹{discountPrice || price}
            </span>
            {discountPrice && (
              <span className="text-sm text-gray-500 line-through">₹{price}</span>
            )}
          </div>
          <div className="flex space-x-2 mt-1">
            <span 
              className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded"
            >
              {selectedColor}
            </span>
            <span 
              className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded"
            >
              {selectedSize}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfoPanel;
