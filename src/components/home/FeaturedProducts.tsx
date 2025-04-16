
import React from "react";
import { Link } from "react-router-dom";
import ProductCard from "@/components/common/ProductCard";

interface Product {
  id: string;
  title: string;
  price: number;
  discountPrice: number;
  discountPercentage: number;
  image: string;
  category: string;
}

interface FeaturedProductsProps {
  products: Product[];
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ products }) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Featured Products</h2>
        <Link to="/search?tag=featured" className="text-sm text-gray-600">
          Show All
        </Link>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default FeaturedProducts;
