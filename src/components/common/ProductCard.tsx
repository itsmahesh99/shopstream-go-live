
import React from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

export interface Product {
  id: string;
  title: string;
  price: number;
  discountPrice?: number;
  discountPercentage?: number;
  image: string;
  category?: string;
}

export interface ProductCardProps {
  product: Product;
  className?: string;
  showAddToCart?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  className = "",
  showAddToCart = false 
}) => {
  return (
    <Link to={`/product/${product.id}`} className={`block ${className}`}>
      <div className="bg-white rounded-lg overflow-hidden shadow-sm h-full">
        <div className="relative aspect-square">
          <img 
            src={product.image} 
            alt={product.title} 
            className="w-full h-full object-cover"
          />
          {product.discountPrice && (
            <div className="absolute top-2 left-2 bg-kein-coral text-white text-xs px-1.5 py-0.5 rounded">
              {Math.round((1 - product.discountPrice / product.price) * 100)}% OFF
            </div>
          )}
          <button className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-sm rounded-full">
            <Heart className="h-4 w-4 text-gray-500" />
          </button>
        </div>
        <div className="p-3">
          <h3 className="font-medium text-sm line-clamp-2">{product.title}</h3>
          <div className="flex items-center mt-1">
            {product.discountPrice ? (
              <>
                <span className="font-bold text-kein-coral">₹{product.discountPrice}</span>
                <span className="text-gray-400 text-xs line-through ml-2">₹{product.price}</span>
              </>
            ) : (
              <span className="font-bold">₹{product.price}</span>
            )}
          </div>
          {showAddToCart && (
            <button className="mt-2 w-full py-1.5 bg-kein-blue text-white text-xs rounded-md">
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
