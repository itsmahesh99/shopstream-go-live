
import React from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

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
  showAddToCart?: boolean;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  showAddToCart = true,
  className = "",
}) => {
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast({
      title: "Added to cart",
      description: `${product.title} has been added to your cart`,
    });
  };

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast({
      title: "Added to wishlist",
      description: `${product.title} has been added to your wishlist`,
    });
  };

  return (
    <Link to={`/product/${product.id}`} className={`block ${className}`}>
      <div className="bg-white rounded-lg overflow-hidden">
        <div className="relative">
          <img
            src={product.image}
            alt={product.title}
            className="w-full aspect-square object-cover"
          />
          <button
            onClick={handleAddToWishlist}
            className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-sm"
          >
            <Heart className="h-4 w-4 text-gray-400" />
          </button>
          
          {product.discountPercentage && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-medium px-1.5 py-0.5 rounded">
              -{product.discountPercentage}%
            </div>
          )}
        </div>
        
        <div className="p-2">
          <h3 className="text-sm font-medium line-clamp-2 mb-1">{product.title}</h3>
          <div className="flex items-center">
            {product.discountPrice ? (
              <>
                <span className="font-bold text-sm">${product.discountPrice}</span>
                <span className="ml-1 text-xs text-gray-500 line-through">${product.price}</span>
              </>
            ) : (
              <span className="font-bold text-sm">${product.price}</span>
            )}
          </div>
          
          {showAddToCart && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-2 h-8 text-xs border border-gray-200"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-3 w-3 mr-1" />
              Add to cart
            </Button>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
