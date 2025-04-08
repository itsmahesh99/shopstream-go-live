
import React, { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useToast } from "@/hooks/use-toast";

interface ProductOptionsSheetProps {
  product: {
    id: string;
    title: string;
    images: string[];
    price: number;
    discountPrice?: number;
    colors: string[];
    sizes: string[];
  };
  triggerButton: React.ReactNode;
  onAddToCart?: (options: ProductOptions) => void;
  onBuyNow?: (options: ProductOptions) => void;
}

interface ProductOptions {
  color: string;
  size: string;
  quantity: number;
}

const ProductOptionsSheet = ({
  product,
  triggerButton,
  onAddToCart,
  onBuyNow,
}: ProductOptionsSheetProps) => {
  const { toast } = useToast();
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || "");
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  
  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart({ color: selectedColor, size: selectedSize, quantity });
    } else {
      toast({
        title: "Added to cart",
        description: `${product.title} (${selectedColor}, ${selectedSize}) has been added to your cart`,
      });
    }
  };
  
  const handleBuyNow = () => {
    if (onBuyNow) {
      onBuyNow({ color: selectedColor, size: selectedSize, quantity });
    } else {
      toast({
        title: "Proceeding to checkout",
        description: "Taking you to the checkout page",
      });
    }
  };
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const getColorImage = (color: string) => {
    const colorIndex = product.colors.indexOf(color);
    return product.images[colorIndex % product.images.length];
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        {triggerButton}
      </DrawerTrigger>
      <DrawerContent className="max-h-[85vh]">
        <div className="px-4">
          {/* Quick product info panel */}
          <div className="py-4 flex items-start justify-between border-b">
            <div className="flex items-center">
              <img
                src={getColorImage(selectedColor)}
                alt={product.title}
                className="h-16 w-16 rounded-md object-cover mr-3"
              />
              <div>
                <h3 className="font-medium text-base line-clamp-1">{product.title}</h3>
                <div className="flex space-x-2 mt-1 items-center">
                  <span className="font-bold">
                    ₹{product.discountPrice || product.price}
                  </span>
                  {product.discountPrice && (
                    <span className="text-sm text-gray-500 line-through">₹{product.price}</span>
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
          
          {/* Color options */}
          <div className="py-4 border-b">
            <h3 className="font-medium mb-3 text-sm">Color</h3>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-14 h-14 rounded-md overflow-hidden ${selectedColor === color ? 'ring-2 ring-kein-blue ring-offset-1' : 'border border-gray-200'}`}
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
          
          {/* Size options */}
          <div className="py-4 border-b">
            <h3 className="font-medium mb-3 text-sm">Size</h3>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
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
          
          {/* Quantity selector */}
          <div className="py-4 border-b">
            <h3 className="font-medium mb-3 text-sm">Quantity</h3>
            <div className="flex items-center">
              <button
                onClick={decreaseQuantity}
                className="h-10 w-10 rounded-full border border-kein-blue flex items-center justify-center text-kein-blue"
              >
                <Minus className="h-4 w-4" />
              </button>
              <div className="h-10 w-16 flex items-center justify-center text-lg font-medium mx-2 bg-blue-50 rounded">
                {quantity}
              </div>
              <button
                onClick={increaseQuantity}
                className="h-10 w-10 rounded-full border border-kein-blue flex items-center justify-center text-kein-blue"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Action buttons */}
        <DrawerFooter className="px-4 py-4 border-t">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              className="flex-1 border-kein-blue text-kein-blue h-12"
              onClick={handleAddToCart}
            >
              Add to cart
            </Button>
            <Button
              className="flex-1 bg-kein-blue text-white h-12"
              onClick={handleBuyNow}
            >
              Buy now
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ProductOptionsSheet;
