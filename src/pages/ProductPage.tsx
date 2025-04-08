
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Heart, Minus, Plus } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductCard from "@/components/common/ProductCard";
import { useToast } from "@/hooks/use-toast";

// Mock data
const product = {
  id: "1",
  title: "Women solid top and jeans",
  price: 999,
  discountPrice: 499,
  discountPercentage: 50,
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam arcu mauris, pretium pulvinar sapien.",
  images: [
    "/lovable-uploads/37fa901f-5b94-426f-ac68-07a4249941e7.png",
    "/lovable-uploads/f8d1a83b-970d-4d3a-966a-e0e1deaddb20.png",
    "/lovable-uploads/a758d528-4f86-47ab-8952-b84d3f2e2b2c.png",
    "/lovable-uploads/0652f2bb-af03-464d-856b-32325f54b8c6.png",
  ],
  colors: ["Pink", "Yellow", "Red", "Purple"],
  sizes: ["S", "M", "L", "XL", "XXL", "XXXL"],
  rating: 4.5,
  reviews: 5,
  specifications: {
    material: "Cotton 95%, Nylon 5%",
    origin: "EU",
  },
  category: "Clothing",
};

const relatedProducts = [
  {
    id: "2",
    title: "Women solid top and jeans",
    price: 999,
    image: "/lovable-uploads/521c827c-efca-4963-a702-2af0e528830c.png",
    category: "Clothing"
  },
  {
    id: "3",
    title: "Women solid top and jeans",
    price: 999,
    image: "/lovable-uploads/d9b61dc1-74ba-423d-8b21-9e83e8e1ff97.png",
    category: "Clothing"
  },
  {
    id: "4",
    title: "Women solid top and jeans",
    price: 999,
    image: "/lovable-uploads/7c48c057-d4b0-4193-9473-be6c8eee605c.png",
    category: "Clothing"
  },
  {
    id: "5",
    title: "Women solid top and jeans",
    price: 999,
    image: "/lovable-uploads/bcb73b7f-2144-4a7d-aaca-a22c1dce107d.png",
    category: "Clothing"
  },
];

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
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
      description: `${product.title} (${selectedColor}, ${selectedSize}) has been added to your cart`,
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

  return (
    <div className="pb-20">
      {/* Product image carousel */}
      <div className="relative">
        <Carousel className="w-full">
          <CarouselContent>
            {product.images.map((image, index) => (
              <CarouselItem key={index}>
                <div className="aspect-square w-full">
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
        
        <div className="absolute top-4 left-4 z-10">
          <Link to="/home" className="p-2 rounded-full bg-white shadow-md">
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </div>
      </div>
      
      {/* Quick product info panel */}
      <div className="bg-white rounded-t-3xl -mt-6 relative z-10 px-4 pt-6 flex items-start justify-between">
        <div className="flex items-center">
          <img
            src={product.images[0]}
            alt={product.title}
            className="h-12 w-12 rounded-md object-cover mr-3"
          />
          <div>
            <span className="font-bold text-2xl">₹{product.discountPrice}</span>
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
        
        <button
          className={`p-2 rounded-full border ${isLiked ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'}`}
          onClick={handleLike}
        >
          <Heart className={`h-5 w-5 ${isLiked ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
        </button>
      </div>
      
      {/* Color options */}
      <div className="px-4 py-5">
        <h3 className="font-medium mb-3">Color Options</h3>
        <div className="flex space-x-3">
          {product.colors.map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`w-16 h-16 rounded-md overflow-hidden ${selectedColor === color ? 'ring-2 ring-kein-blue ring-offset-2' : 'border border-gray-200'}`}
            >
              <img 
                src={product.images[product.colors.indexOf(color) % product.images.length]} 
                alt={color} 
                className="w-full h-full object-cover"
              />
              {selectedColor === color && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="h-6 w-6 bg-kein-blue rounded-full flex items-center justify-center">
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
      <div className="px-4 pb-5">
        <h3 className="font-medium mb-3">Size</h3>
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
      <div className="px-4 pb-5">
        <h3 className="font-medium mb-3">Quantity</h3>
        <div className="flex items-center">
          <button
            onClick={decreaseQuantity}
            className="h-12 w-12 rounded-full border border-kein-blue flex items-center justify-center text-kein-blue"
          >
            <Minus className="h-5 w-5" />
          </button>
          <div className="h-12 w-16 flex items-center justify-center text-lg font-medium mx-2 bg-blue-50 rounded">
            {quantity}
          </div>
          <button
            onClick={increaseQuantity}
            className="h-12 w-12 rounded-full border border-kein-blue flex items-center justify-center text-kein-blue"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="px-4 pb-6 flex space-x-2">
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
      
      {/* Related products */}
      <div className="px-4 pb-8">
        <h3 className="font-medium mb-4">You Might Like</h3>
        <div className="grid grid-cols-2 gap-4">
          {relatedProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
