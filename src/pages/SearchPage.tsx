
import React, { useState } from "react";
import { Search, X, Camera, Trash2, SlidersHorizontal, ArrowDownUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/common/ProductCard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data
const searchHistory = ["Red Dress", "Socks", "Sunglasses", "Summer Dress", "Denim"];
const recommendations = ["Trending", "Sale", "New Arrivals", "Summer Collection", "Winter"];

const trendingProducts = [
  {
    id: "1",
    title: "Summer Dress",
    price: 1299,
    discountPrice: 999,
    discountPercentage: 23,
    image: "/lovable-uploads/37fa901f-5b94-426f-ac68-07a4249941e7.png",
    category: "Clothing"
  },
  {
    id: "2",
    title: "Casual T-Shirt",
    price: 599,
    image: "/lovable-uploads/f8d1a83b-970d-4d3a-966a-e0e1deaddb20.png",
    category: "Clothing"
  },
  {
    id: "3",
    title: "Denim Jacket",
    price: 1999,
    image: "/lovable-uploads/b919bc4e-ae0e-4d85-9cba-1168285b252c.png",
    category: "Clothing"
  },
  {
    id: "4",
    title: "Leather Bag",
    price: 2499,
    image: "/lovable-uploads/d9b61dc1-74ba-423d-8b21-9e83e8e1ff97.png",
    category: "Accessories"
  },
  {
    id: "5",
    title: "Printed T-Shirt",
    price: 799,
    discountPrice: 499,
    discountPercentage: 37,
    image: "/lovable-uploads/f8d1a83b-970d-4d3a-966a-e0e1deaddb20.png",
    category: "Clothing"
  },
  {
    id: "6",
    title: "White Sneakers",
    price: 1699,
    image: "/lovable-uploads/b919bc4e-ae0e-4d85-9cba-1168285b252c.png",
    category: "Footwear"
  },
];

// Available sort options
const sortOptions = [
  { id: "newest", label: "Newest first" },
  { id: "price-low", label: "Price: Low to high" },
  { id: "price-high", label: "Price: High to low" },
  { id: "popularity", label: "Popularity" },
];

// Available categories/filters
const filterCategories = [
  { id: "all", label: "All" },
  { id: "clothing", label: "Clothing" },
  { id: "accessories", label: "Accessories" },
  { id: "footwear", label: "Footwear" },
];

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSort, setSelectedSort] = useState("newest");
  
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

  const handleCategoryFilter = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleSort = (sortId: string) => {
    setSelectedSort(sortId);
  };

  // Filter products based on search query and selected category
  const filteredProducts = trendingProducts.filter(product => {
    const matchesSearch = searchQuery ? 
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) : true;
    
    const matchesCategory = selectedCategory === "all" || 
      product.category.toLowerCase() === selectedCategory.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });

  // Sort products based on selected sort option
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (selectedSort) {
      case "price-low":
        return (a.discountPrice || a.price) - (b.discountPrice || b.price);
      case "price-high":
        return (b.discountPrice || b.price) - (a.discountPrice || a.price);
      case "newest":
      case "popularity":
      default:
        return 0; // In a real app, we'd have created_at or popularity fields
    }
  });

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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Shop – {searchQuery}</h2>
            <p className="text-sm text-gray-500">{sortedProducts.length} results</p>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {filterCategories.map(category => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  className="whitespace-nowrap"
                  onClick={() => handleCategoryFilter(category.id)}
                >
                  {category.label}
                </Button>
              ))}
            </div>
            
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <ArrowDownUp className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {sortOptions.map(option => (
                    <DropdownMenuItem 
                      key={option.id}
                      className={selectedSort === option.id ? "bg-gray-100" : ""}
                      onClick={() => handleSort(option.id)}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button variant="outline" size="icon">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {sortedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-10 text-center">
              <p className="text-gray-500">No products found for "{searchQuery}"</p>
              <p className="text-sm text-gray-400 mt-2">Try a different search or browse categories</p>
            </div>
          )}
        </div>
      ) : (
        // Initial search page
        <div className="px-4 py-4">
          {/* Search history */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">Search history</h3>
              <button onClick={handleClearHistory}>
                <Trash2 className="h-4 w-4 text-red-500" />
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
          
          {/* Discover - Trending products */}
          <div>
            <h3 className="font-medium mb-4">Discover</h3>
            <div className="overflow-x-auto pb-4">
              <div className="flex gap-4" style={{ minWidth: "min-content" }}>
                {trendingProducts.map(product => (
                  <div key={product.id} className="min-w-[160px] max-w-[160px]">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
