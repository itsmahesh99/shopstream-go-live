
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, X, Camera } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/common/ProductCard";

// Mock data
const searchHistory = ["Socks", "Red Dress", "Sunglasses", "Mustard Pants", "80-s Skirt"];
const recommendations = ["Skirt", "Accessories", "Black T-Shirt", "Jeans", "White Shoes"];

const discoveryProducts = [
  {
    id: "1",
    title: "Women solid top and jeans",
    price: 1250,
    image: "/lovable-uploads/37fa901f-5b94-426f-ac68-07a4249941e7.png",
    category: "Clothing"
  },
  {
    id: "2",
    title: "Women solid top and jeans",
    price: 320,
    image: "/lovable-uploads/f8d1a83b-970d-4d3a-966a-e0e1deaddb20.png",
    category: "Clothing"
  },
  {
    id: "3",
    title: "Women solid top and jeans",
    price: 2100,
    image: "/lovable-uploads/d9b61dc1-74ba-423d-8b21-9e83e8e1ff97.png",
    category: "Clothing"
  },
];

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearching(true);
    }
  };
  
  const handleClearSearch = () => {
    setSearchQuery("");
    setIsSearching(false);
  };
  
  const handleClearHistory = () => {
    // In a real app, this would clear the search history
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="px-4 py-4 border-b sticky top-0 bg-white z-10">
        <h1 className="text-2xl font-bold mb-4">Search</h1>
        
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for products..."
            className="pl-10 pr-10 py-2 w-full rounded-full"
          />
          {searchQuery && (
            <button 
              type="button"
              onClick={handleClearSearch}
              className="absolute right-10 top-1/2 transform -translate-y-1/2"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          )}
          <button 
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            <Camera className="h-4 w-4 text-gray-400" />
          </button>
        </form>
      </div>
      
      {isSearching ? (
        // Search results
        <div className="px-4 py-4">
          <div className="mb-4">
            <h3 className="font-medium mb-2">Results for "{searchQuery}"</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              <Button variant="outline" size="sm" className="text-xs">All</Button>
              <Button variant="outline" size="sm" className="text-xs">Clothing</Button>
              <Button variant="outline" size="sm" className="text-xs">Accessories</Button>
              <Button variant="outline" size="sm" className="text-xs">Electronics</Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {discoveryProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      ) : (
        // Initial search page
        <div className="px-4 py-4">
          {/* Search history */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">Search history</h3>
              <button onClick={handleClearHistory}>
                <Trash className="h-4 w-4 text-red-500" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {searchHistory.map((term, index) => (
                <button
                  key={index}
                  className="bg-gray-100 px-3 py-2 rounded-full text-sm"
                  onClick={() => {
                    setSearchQuery(term);
                    setIsSearching(true);
                  }}
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
          
          {/* Recommendations */}
          <div className="mb-6">
            <h3 className="font-medium mb-2">Recommendations</h3>
            <div className="flex flex-wrap gap-2">
              {recommendations.map((term, index) => (
                <button
                  key={index}
                  className="bg-gray-100 px-3 py-2 rounded-full text-sm"
                  onClick={() => {
                    setSearchQuery(term);
                    setIsSearching(true);
                  }}
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
          
          {/* Discover */}
          <div>
            <h3 className="font-medium mb-4">Discover</h3>
            <div className="grid grid-cols-2 gap-4">
              {discoveryProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;

// Helper component
const Trash = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </svg>
);
