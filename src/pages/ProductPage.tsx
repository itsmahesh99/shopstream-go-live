import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Heart, Minus, Plus, Star, Truck, Package, Clock, MessageSquare } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductCard from "@/components/common/ProductCard";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import ProductOptionsSheet from "@/components/product/ProductOptionsSheet";
import PaymentOptionsSheet from "@/components/payment/PaymentOptionsSheet";

// Mock data
const product = {
  id: "1",
  title: "Women solid top and jeans",
  price: 999,
  discountPrice: 499,
  discountPercentage: 50,
  description: "This stylish women's outfit features a comfortable solid top paired with well-fitted jeans. Perfect for casual outings or everyday wear. The breathable fabric ensures comfort throughout the day.",
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
    care: "Machine wash, tumble dry low",
    fit: "Regular fit"
  },
  delivery: {
    standard: "3-5 business days",
    express: "1-2 business days (additional charges apply)",
    return: "30-day easy returns"
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

const popularProducts = [
  {
    id: "6",
    title: "Stylish Summer Dress",
    price: 799,
    discountPrice: 599,
    image: "/lovable-uploads/f8d1a83b-970d-4d3a-966a-e0e1deaddb20.png",
    category: "Clothing"
  },
  {
    id: "7",
    title: "Casual Denim Jacket",
    price: 1299,
    image: "/lovable-uploads/b919bc4e-ae0e-4d85-9cba-1168285b252c.png",
    category: "Clothing"
  },
  {
    id: "8",
    title: "Trendy Handbag",
    price: 899,
    discountPrice: 699,
    image: "/lovable-uploads/d9b61dc1-74ba-423d-8b21-9e83e8e1ff97.png",
    category: "Accessories"
  },
  {
    id: "9",
    title: "Floral Print Skirt",
    price: 599,
    image: "/lovable-uploads/a758d528-4f86-47ab-8952-b84d3f2e2b2c.png",
    category: "Clothing"
  },
];

const reviewsData = [
  {
    id: "1",
    user: "Sarah J.",
    rating: 5,
    date: "March 15, 2023",
    comment: "Love this outfit! The material is so comfortable and the fit is perfect. Will definitely buy more colors."
  },
  {
    id: "2",
    user: "Michael T.",
    rating: 4,
    date: "February 28, 2023",
    comment: "Bought this for my wife and she loves it. Good quality for the price."
  },
  {
    id: "3",
    user: "Emma L.",
    rating: 5,
    date: "January 10, 2023",
    comment: "The top and jeans combo is exactly as pictured. Very happy with my purchase!"
  }
];

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [selectedColor, setSelectedColor] = useState("Pink");
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  
  const { addToCart } = useCart();
  
  const handleLike = () => {
    setIsLiked(!isLiked);
    toast({
      title: isLiked ? "Removed from wishlist" : "Added to wishlist",
      description: isLiked ? "Product removed from your wishlist" : "Product added to your wishlist",
    });
  };
  
  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      discountPrice: product.discountPrice,
      image: product.images[product.colors.indexOf(selectedColor) % product.images.length],
      color: selectedColor,
      size: selectedSize,
      quantity: quantity
    });
    
    toast({
      title: "Added to cart",
      description: `${product.title} (${selectedColor}, ${selectedSize}) has been added to your cart`,
    });
  };
  
  const handleBuyNow = () => {
    // First add to cart
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      discountPrice: product.discountPrice,
      image: product.images[product.colors.indexOf(selectedColor) % product.images.length],
      color: selectedColor,
      size: selectedSize,
      quantity: quantity
    });
    
    // Then toast notification
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

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half-star" className="h-4 w-4 text-yellow-400" />);
    }
    
    const remainingStars = 5 - stars.length;
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-star-${i}`} className="h-4 w-4 text-gray-300" />);
    }
    
    return stars;
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
      
      {/* Title and rating */}
      <div className="px-4 py-2">
        <h1 className="text-xl font-semibold">{product.title}</h1>
        <div className="flex items-center mt-1">
          <div className="flex mr-2">
            {renderStars(product.rating)}
          </div>
          <span className="text-sm text-gray-600">{product.rating} ({product.reviews} reviews)</span>
        </div>
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
      
      {/* Delivery options */}
      <div className="px-4 pb-5 bg-gray-50 pt-5">
        <h3 className="font-medium mb-3">Delivery Options</h3>
        <div className="space-y-3">
          <div className="flex items-center">
            <Truck className="h-5 w-5 text-kein-blue mr-3" />
            <div>
              <p className="text-sm font-medium">Standard Delivery</p>
              <p className="text-xs text-gray-500">{product.delivery.standard}</p>
            </div>
          </div>
          <div className="flex items-center">
            <Package className="h-5 w-5 text-kein-blue mr-3" />
            <div>
              <p className="text-sm font-medium">Express Delivery</p>
              <p className="text-xs text-gray-500">{product.delivery.express}</p>
            </div>
          </div>
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-kein-blue mr-3" />
            <div>
              <p className="text-sm font-medium">Return Policy</p>
              <p className="text-xs text-gray-500">{product.delivery.return}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="px-4 py-5 flex space-x-2">
        <ProductOptionsSheet
          product={product}
          triggerButton={
            <Button
              variant="outline"
              className="flex-1 border-kein-blue text-kein-blue h-12"
            >
              Add to cart
            </Button>
          }
          onAddToCart={({ color, size, quantity }) => {
            addToCart({
              id: product.id,
              title: product.title,
              price: product.price,
              discountPrice: product.discountPrice,
              image: product.images[product.colors.indexOf(color) % product.images.length],
              color,
              size,
              quantity
            });
            
            toast({
              title: "Added to cart",
              description: `${product.title} (${color}, ${size}) has been added to your cart`,
            });
          }}
          onBuyNow={() => {}}
        />
        
        <PaymentOptionsSheet
          triggerButton={
            <Button
              className="flex-1 bg-kein-blue text-white h-12"
            >
              Buy now
            </Button>
          }
        />
      </div>
      
      {/* Product details tabs */}
      <div className="px-4 pb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-3 bg-gray-100">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specs">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({reviewsData.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="pt-4">
            <p className="text-sm text-gray-700 leading-relaxed">
              {product.description}
            </p>
          </TabsContent>
          <TabsContent value="specs" className="pt-4">
            <div className="space-y-3">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between border-b pb-2">
                  <span className="text-sm text-gray-500 capitalize">{key}</span>
                  <span className="text-sm font-medium">{value}</span>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="pt-4">
            <div className="space-y-4">
              {reviewsData.map((review) => (
                <div key={review.id} className="border-b pb-3">
                  <div className="flex justify-between">
                    <h4 className="font-medium">{review.user}</h4>
                    <span className="text-xs text-gray-500">{review.date}</span>
                  </div>
                  <div className="flex mt-1 mb-2">
                    {renderStars(review.rating)}
                  </div>
                  <p className="text-sm text-gray-700">{review.comment}</p>
                </div>
              ))}
              <Button variant="outline" className="w-full" size="sm">
                <MessageSquare className="h-4 w-4 mr-2" />
                Write a Review
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Most Popular section */}
      <div className="px-4 pb-8">
        <h3 className="font-medium mb-4">Most Popular</h3>
        <Carousel className="w-full">
          <CarouselContent>
            {popularProducts.map((product) => (
              <CarouselItem key={product.id} className="basis-1/2 md:basis-1/3">
                <ProductCard product={product} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-0" />
          <CarouselNext className="right-0" />
        </Carousel>
      </div>
      
      {/* You Might Like section */}
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
