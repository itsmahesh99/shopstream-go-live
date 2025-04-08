
import React from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem,
  CarouselPrevious,
  CarouselNext
} from "@/components/ui/carousel";

import ProductInfoPanel from "./options/ProductInfoPanel";
import ColorSelector from "./options/ColorSelector";
import SizeSelector from "./options/SizeSelector";
import QuantitySelector from "./options/QuantitySelector";
import ActionButtons from "./options/ActionButtons";
import { useProductOptions, ProductOptionsHookProps } from "./options/useProductOptions";

interface ProductOptionsSheetProps extends ProductOptionsHookProps {
  triggerButton: React.ReactNode;
}

const ProductOptionsSheet = ({
  product,
  triggerButton,
  onAddToCart,
  onBuyNow,
}: ProductOptionsSheetProps) => {
  const {
    selectedColor,
    setSelectedColor,
    selectedSize,
    setSelectedSize,
    quantity,
    decreaseQuantity,
    increaseQuantity,
    handleAddToCart,
    handleBuyNow,
    getColorImage
  } = useProductOptions({ product, onAddToCart, onBuyNow });

  return (
    <Drawer>
      <DrawerTrigger asChild>
        {triggerButton}
      </DrawerTrigger>
      <DrawerContent className="max-h-[85vh]">
        <div className="px-4">
          {/* Image slider */}
          <div className="my-4">
            <Carousel className="w-full">
              <CarouselContent>
                {product.images?.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="aspect-square w-full rounded-xl overflow-hidden">
                      <img 
                        src={image} 
                        alt={`${product.title} - Image ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
          </div>
          
          {/* Quick product info panel */}
          <ProductInfoPanel 
            title={product.title}
            price={product.price}
            discountPrice={product.discountPrice}
            selectedColor={selectedColor}
            selectedSize={selectedSize}
            image={getColorImage(selectedColor)}
          />
          
          {/* Color options */}
          <ColorSelector 
            colors={product.colors}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            getColorImage={getColorImage}
          />
          
          {/* Size options */}
          <SizeSelector 
            sizes={product.sizes}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
          />
          
          {/* Quantity selector */}
          <QuantitySelector 
            quantity={quantity}
            decreaseQuantity={decreaseQuantity}
            increaseQuantity={increaseQuantity}
          />
        </div>
        
        {/* Action buttons */}
        <DrawerFooter className="px-4 py-4 border-t">
          <ActionButtons 
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
          />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ProductOptionsSheet;
