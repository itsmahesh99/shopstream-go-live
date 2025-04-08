
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, ChevronLeft } from "lucide-react";
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
    image: "/lovable-uploads/37fa901f-5b94-426f-ac68-07a4249941e7.png",
    category: "Clothing",
  },
  {
    id: "2",
    title: "Men's Casual T-Shirt",
    price: 599,
    image: "/lovable-uploads/f8d1a83b-970d-4d3a-966a-e0e1deaddb20.png",
    category: "Clothing",
  },
  {
    id: "6",
    title: "Denim Jacket",
    price: 1999,
    image: "/lovable-uploads/b919bc4e-ae0e-4d85-9cba-1168285b252c.png",
    category: "Clothing",
  },
  {
    id: "9",
    title: "Women's Blouse",
    price: 899,
    discountPrice: 699,
    discountPercentage: 22,
    image: "/lovable-uploads/37fa901f-5b94-426f-ac68-07a4249941e7.png",
    category: "Clothing",
  },
  {
    id: "10",
    title: "Men's Hoodie",
    price: 1499,
    image: "/lovable-uploads/f8d1a83b-970d-4d3a-966a-e0e1deaddb20.png",
    category: "Clothing",
  },
  {
    id: "11",
    title: "Casual Shirt",
    price: 799,
    image: "/lovable-uploads/b919bc4e-ae0e-4d85-9cba-1168285b252c.png",
    category: "Clothing",
  },
];

const ClothingPage = () => {
  const [selectedSubcategory, setSelectedSubcategory] = useState("1");
  const [searchQuery, setSearchQuery] = useState("");

  // Handle subcategory selection
  const handleSubcategoryClick = (subcategoryId: string) => {
    setSelectedSubcategory(subcategoryId);
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

  return (
    <div className="pb-20">
      {/* Top navigation */}
      <div className="sticky top-0 z-30 bg-white">
        {/* Header */}
        <div className="flex items-center px-4 py-3 border-b">
          <Link to="/shop" className="mr-2">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-bold flex-1">Clothing</h1>
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
              className="pl-10 py-2 w-full rounded-full"
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
      </div>

      {/* Products list */}
      <div className="px-4 py-4">
        <div className="mb-4">
          <p className="text-sm text-gray-500">
            {filteredProducts.length} products found
          </p>
        </div>
        
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                showAddToCart={false}
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
