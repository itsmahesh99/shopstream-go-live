
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Heart, Minus, Plus, Percent, Tag } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import CountdownTimer from "@/components/product/CountdownTimer";
import ProductOptionsSheet from "@/components/product/ProductOptionsSheet";

// Mock data for the limited-time deal
const limitedDeal = {
  id: "flash-deal-1",
  title: "Women solid top and jeans - Flash Deal",
  price: 999,
  discountPrice: 399,
  discountPercentage: 60,
  description: "Limited time flash deal! This stylish women's outfit features a comfortable solid top paired with well-fitted jeans. Perfect for casual outings or everyday wear.",
  endTime: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
  images: [
    "/lovable-uploads/37fa901f-5b94-426f-ac68-07a4249941e7.png",
    "/lovable-uploads/f8d1a83b-970d-4d3a-966a-e0e1deaddb20.png",
    "/lovable-uploads/a758d528-4f86-47ab-8952-b84d3f2e2b2c.png",
    "/lovable-uploads/0652f2bb-af03-464d-856b-32325f54b8c6.png",
  ],
  colors: ["Pink", "Yellow", "Red", "Purple"],
  sizes: ["S", "M", "L", "XL"],
  rating: 4.5,
  reviews: 128,
  specifications: {
    material: "Cotton 95%, Nylon 5%",
    origin: "EU",
    care: "Machine wash, tumble dry low",
    fit: "Regular fit"
  },
  stock: 42
};

const LimitedDealPage = () => {
  const { toast } = useToast();
  const [selectedColor, setSelectedColor] = useState("Pink");
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  
  const handleLike = () => {
    setIsLiked(!isLiked);
    toast({
      title: isLiked ? "Removed from wishlist" : "Added to wishlist",
      description: isLiked ? "Product removed from your wishlist" : "Product added to your wishlist",
    });
  };
  
  const handleAddToCart = () => {
    toast({
      title: "Added to cart",
      description: `${limitedDeal.title} (${selectedColor}, ${selectedSize}) has been added to your cart`,
    });
  };
  
  const handleBuyNow = () => {
    toast({
      title: "Proceeding to checkout",
      description: "Taking you to the checkout page",
    });
  };
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleDealEnded = () => {
    toast({
      title: "Deal has ended",
      description: "This limited-time offer is no longer available",
    });
  };

  return (
    <div className="pb-20">
      {/* Header with flash deal badge */}
      <div className="bg-kein-coral py-2 px-4 flex items-center justify-between text-white">
        <div className="flex items-center">
          <Link to="/home" className="mr-2">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <span className="font-medium">Limited Time Deal</span>
        </div>
        <div className="flex items-center">
          <Tag className="h-4 w-4 mr-1" />
          <span className="text-sm font-bold">{limitedDeal.discountPercentage}% OFF</span>
        </div>
      </div>
      
      {/* Product image carousel */}
      <div className="relative">
        <Carousel className="w-full">
          <CarouselContent>
            {limitedDeal.images.map((image, index) => (
              <CarouselItem key={index}>
                <div className="aspect-square w-full">
                  <img 
                    src={image} 
                    alt={`${limitedDeal.title} - Image ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        
        {/* Countdown overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-4 py-2">
          <CountdownTimer endTime={limitedDeal.endTime} onComplete={handleDealEnded} />
        </div>
      </div>
      
      {/* Product info with discount tag */}
      <div className="px-4 py-4 bg-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-lg font-semibold">{limitedDeal.title}</h1>
            <div className="flex items-center mt-1 space-x-2">
              <span className="text-xl font-bold text-kein-coral">₹{limitedDeal.discountPrice}</span>
              <span className="text-sm text-gray-500 line-through">₹{limitedDeal.price}</span>
              <div className="bg-kein-coral text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center">
                <Percent className="h-3 w-3 mr-0.5" />
                {limitedDeal.discountPercentage}% OFF
              </div>
            </div>
          </div>
          <button
            className={`p-2 rounded-full border ${isLiked ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'}`}
            onClick={handleLike}
          >
            <Heart className={`h-5 w-5 ${isLiked ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
          </button>
        </div>
        
        {/* Stock counter */}
        <div className="mt-2 bg-kein-lightblue py-1 px-2 rounded-md inline-flex items-center">
          <span className="text-xs text-kein-blue font-medium">
            Only {limitedDeal.stock} left in stock!
          </span>
        </div>
      </div>
      
      {/* Color options */}
      <div className="px-4 py-4 border-t">
        <h3 className="font-medium mb-3">Color Options</h3>
        <div className="flex space-x-3">
          {limitedDeal.colors.map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`w-16 h-16 rounded-md overflow-hidden ${selectedColor === color ? 'ring-2 ring-kein-coral ring-offset-2' : 'border border-gray-200'}`}
            >
              <img 
                src={limitedDeal.images[limitedDeal.colors.indexOf(color) % limitedDeal.images.length]} 
                alt={color} 
                className="w-full h-full object-cover"
              />
              {selectedColor === color && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="h-6 w-6 bg-kein-coral rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
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
      <div className="px-4 pb-4">
        <h3 className="font-medium mb-3">Size</h3>
        <div className="flex flex-wrap gap-2">
          {limitedDeal.sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`h-10 px-4 rounded-md flex items-center justify-center ${
                selectedSize === size 
                ? 'bg-kein-coral text-white' 
                : 'bg-gray-100 text-gray-800'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
      
      {/* Quantity selector */}
      <div className="px-4 pb-5 border-t pt-4">
        <h3 className="font-medium mb-3">Quantity</h3>
        <div className="flex items-center">
          <button
            onClick={decreaseQuantity}
            className="h-10 w-10 rounded-full border border-kein-coral flex items-center justify-center text-kein-coral"
          >
            <Minus className="h-4 w-4" />
          </button>
          <div className="h-10 w-16 flex items-center justify-center text-lg font-medium mx-2 bg-gray-50 rounded">
            {quantity}
          </div>
          <button
            onClick={increaseQuantity}
            className="h-10 w-10 rounded-full border border-kein-coral flex items-center justify-center text-kein-coral"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {/* Quick sheet for options */}
      <div className="px-4 py-3 mb-4">
        <ProductOptionsSheet
          product={{
            id: limitedDeal.id,
            title: limitedDeal.title,
            price: limitedDeal.price,
            discountPrice: limitedDeal.discountPrice,
            images: limitedDeal.images,
            colors: limitedDeal.colors,
            sizes: limitedDeal.sizes,
          }}
          triggerButton={
            <Button className="w-full bg-kein-blue">
              Choose Options
            </Button>
          }
        />
      </div>
      
      {/* Action buttons */}
      <div className="fixed bottom-0 left-0 right-0 px-4 py-3 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] flex space-x-2">
        <Button
          variant="outline"
          className="flex-1 border-kein-coral text-kein-coral h-12"
          onClick={handleAddToCart}
        >
          Add to cart
        </Button>
        <Button
          className="flex-1 bg-kein-coral text-white h-12"
          onClick={handleBuyNow}
        >
          Buy now
        </Button>
      </div>
    </div>
  );
};

export default LimitedDealPage;
