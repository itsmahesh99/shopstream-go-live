
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, ChevronLeft, ArrowDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ProductCard, { Product } from "@/components/common/ProductCard";

// Mock data for clothing subcategories
const clothingSubcategories = [
  { id: "1", name: "All" },
  { id: "2", name: "T-shirts" },
  { id: "3", name: "Dresses" },
  { id: "4", name: "Jackets" },
  { id: "5", name: "Jeans" },
  { id: "6", name: "Shirts" },
  { id: "7", name: "Hoodies" },
  { id: "8", name: "Sweaters" },
];

// Mock products data
const clothingProducts: Product[] = [
  {
    id: "1",
    title: "Women's Summer Dress",
    price: 1299,
    discountPrice: 999,
    discountPercentage: 23,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop&crop=center",
    category: "Clothing",
  },
  {
    id: "2",
    title: "Men's Casual T-Shirt",
    price: 599,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center",
    category: "Clothing",
  },
  {
    id: "6",
    title: "Denim Jacket",
    price: 1999,
    image: "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=400&h=400&fit=crop&crop=center",
    category: "Clothing",
  },
  {
    id: "9",
    title: "Women's Blouse",
    price: 899,
    discountPrice: 699,
    discountPercentage: 22,
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center",
    category: "Clothing",
  },
  {
    id: "10",
    title: "Men's Hoodie",
    price: 1499,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center",
    category: "Clothing",
  },
  {
    id: "11",
    title: "Casual Shirt",
    price: 799,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop&crop=center",
    category: "Clothing",
  },
];

const ClothingPage = () => {
  const [selectedSubcategory, setSelectedSubcategory] = useState("1");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [sortBy, setSortBy] = useState("popular");

  // Handle subcategory selection
  const handleSubcategoryClick = (subcategoryId: string) => {
    setSelectedSubcategory(subcategoryId);
  };

  // Toggle sort options
  const toggleSortOptions = () => {
    setShowSortOptions(!showSortOptions);
  };

  // Handle sort option selection
  const handleSortOptionClick = (option: string) => {
    setSortBy(option);
    setShowSortOptions(false);
  };

  // Filter products based on search and selected subcategory
  const filteredProducts = clothingProducts.filter((product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    
    if (selectedSubcategory === "1") {
      // "All" subcategory selected
      return matchesSearch;
    }
    
    // For demonstration purposes, we're using a simple filter
    // In a real app, products would have subcategory IDs
    const subcategory = clothingSubcategories.find(
      (subcat) => subcat.id === selectedSubcategory
    )?.name.toLowerCase();
    
    return (
      matchesSearch && 
      product.title.toLowerCase().includes(subcategory || "")
    );
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") {
      const priceA = a.discountPrice || a.price;
      const priceB = b.discountPrice || b.price;
      return priceA - priceB;
    } else if (sortBy === "price-high") {
      const priceA = a.discountPrice || a.price;
      const priceB = b.discountPrice || b.price;
      return priceB - priceA;
    } else if (sortBy === "newest") {
      // In a real app, you would sort by date
      return 0;
    }
    // Default: sort by popularity (which in a real app would be based on ratings/sales)
    return 0;
  });

  return (
    <div className="pb-20">
      {/* Top navigation */}
      <div className="sticky top-0 z-30 bg-white">
        {/* Header */}
        <div className="flex items-center px-4 py-3 border-b">
          <Link to="/shop" className="mr-2">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-semibold flex-1">Clothing</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 border-gray-200"
            >
              <Filter className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Search bar */}
        <div className="px-4 py-2 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search clothing..."
              className="pl-10 py-2 w-full rounded-full bg-gray-50 border-gray-200"
            />
          </div>
        </div>

        {/* Subcategories scroll */}
        <div className="px-4 py-2 border-b">
          <div className="flex overflow-x-auto space-x-2 pb-2 scrollbar-hide">
            {clothingSubcategories.map((subcategory) => (
              <button
                key={subcategory.id}
                className={`px-4 py-2 whitespace-nowrap rounded-full transition-colors ${
                  selectedSubcategory === subcategory.id
                    ? "bg-kein-blue text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
                onClick={() => handleSubcategoryClick(subcategory.id)}
              >
                {subcategory.name}
              </button>
            ))}
          </div>
        </div>

        {/* Sort by section */}
        <div className="px-4 py-2 border-b">
          <button
            onClick={toggleSortOptions}
            className="flex items-center text-sm text-gray-600"
          >
            Sort by: <span className="font-medium ml-1">{sortBy === "popular" ? "Most Popular" : sortBy === "price-low" ? "Price: Low to High" : sortBy === "price-high" ? "Price: High to Low" : "Newest"}</span>
            <ArrowDown className="h-4 w-4 ml-1" />
          </button>
          
          {showSortOptions && (
            <div className="mt-2 bg-white shadow-lg rounded-md border border-gray-200 p-2 absolute z-40 left-4 right-4">
              <button
                className={`block w-full text-left px-3 py-2 rounded ${sortBy === "popular" ? "bg-kein-lightblue text-kein-blue" : "hover:bg-gray-50"}`}
                onClick={() => handleSortOptionClick("popular")}
              >
                Most Popular
              </button>
              <button
                className={`block w-full text-left px-3 py-2 rounded ${sortBy === "price-low" ? "bg-kein-lightblue text-kein-blue" : "hover:bg-gray-50"}`}
                onClick={() => handleSortOptionClick("price-low")}
              >
                Price: Low to High
              </button>
              <button
                className={`block w-full text-left px-3 py-2 rounded ${sortBy === "price-high" ? "bg-kein-lightblue text-kein-blue" : "hover:bg-gray-50"}`}
                onClick={() => handleSortOptionClick("price-high")}
              >
                Price: High to Low
              </button>
              <button
                className={`block w-full text-left px-3 py-2 rounded ${sortBy === "newest" ? "bg-kein-lightblue text-kein-blue" : "hover:bg-gray-50"}`}
                onClick={() => handleSortOptionClick("newest")}
              >
                Newest
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Products list */}
      <div className="px-4 py-4">
        <div className="mb-4">
          <p className="text-sm text-gray-500">
            {sortedProducts.length} products found
          </p>
        </div>
        
        {sortedProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                showAddToCart={true}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-gray-500 text-center">
              No products found. Try different filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClothingPage;
