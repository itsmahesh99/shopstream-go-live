
import React from "react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Product {
  id: string;
  title: string;
  price: number;
  discountPrice?: number;
  discountPercentage?: number;
  image: string;
  category: string;
}

interface ProductCardProps {
  product: Product;
  className?: string;
  variant?: "default" | "horizontal";
  showAddToCart?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  className,
  variant = "default",
  showAddToCart = false
}) => {
  const {
    id,
    title,
    price,
    discountPrice,
    discountPercentage,
    image,
    category
  } = product;

  const isHorizontal = variant === "horizontal";

  return (
    <div 
      className={cn(
        "product-card",
        isHorizontal ? "flex" : "flex flex-col",
        className
      )}
    >
      <div 
        className={cn(
          "relative overflow-hidden",
          isHorizontal ? "w-1/3" : "w-full aspect-square"
        )}
      >
        <Link to={`/product/${id}`}>
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
        </Link>
        <button className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-md">
          <Heart className="h-4 w-4 text-gray-500" />
        </button>
        {discountPercentage && (
          <div className="absolute top-2 left-2 bg-kein-coral text-white text-xs font-bold px-2 py-1 rounded">
            -{discountPercentage}%
          </div>
        )}
      </div>

      <div className={cn(
        "flex flex-col p-3",
        isHorizontal ? "w-2/3" : "w-full"
      )}>
        <span className="text-xs text-gray-500 mb-1">{category}</span>
        <Link to={`/product/${id}`} className="hover:text-kein-blue">
          <h3 className="font-medium text-sm line-clamp-2">{title}</h3>
        </Link>
        <div className="mt-2 flex items-center">
          {discountPrice ? (
            <>
              <span className="font-bold text-kein-coral">₹{discountPrice}</span>
              <span className="text-gray-400 text-sm line-through ml-2">₹{price}</span>
            </>
          ) : (
            <span className="font-bold">₹{price}</span>
          )}
        </div>

        {showAddToCart && (
          <div className="mt-3 flex gap-2">
            <Button variant="outline" size="sm" className="flex-1">
              Add to cart
            </Button>
            <Button size="sm" className="flex-1 bg-kein-blue text-white">
              Buy now
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
