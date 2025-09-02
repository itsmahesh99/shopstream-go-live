import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ProductCard, { Product } from "@/components/common/ProductCard";
import PromotionsCarousel from "@/components/common/PromotionsCarousel";
import Reels from "@/components/shop/Reels";

// Mock data
const promotions = [{
  id: "1",
  title: "Welcome to Kein!",
  description: "Watch live streams from your favorite influencers and shop your desired products with just one click!",
  color: "bg-gradient-to-r from-kein-blue to-blue-400",
  image: "/lovable-uploads/f570e76e-9e2b-48d1-b582-8f7c2732629c.png",
  buttonText: "Watch Now",
  buttonLink: "/play"
}, {
  id: "reels",
  title: "Influencer Reels",
  description: "Watch short videos from influencers showcasing trending products!",
  color: "bg-gradient-to-r from-purple-600 to-pink-600",
  image: "/lovable-uploads/521c827c-efca-4963-a702-2af0e528830c.png",
  buttonText: "Watch Reels",
  buttonLink: "#reels",
  isReels: true
}, {
  id: "2",
  title: "Big Sale",
  description: "Up to 50% off on all products",
  color: "bg-gradient-to-r from-kein-coral to-red-400",
  image: "/lovable-uploads/5112d7a4-a073-42da-9f08-2f9ad3a1c2ce.png",
  buttonText: "Shop Now",
  buttonLink: "/shop"
}, {
  id: "3",
  title: "New Arrivals",
  description: "Check out our latest collection",
  color: "bg-gradient-to-r from-kein-yellow to-yellow-400",
  image: "/lovable-uploads/2840b6e9-4e3c-4070-8eb6-13ed21836285.png",
  buttonText: "Explore",
  buttonLink: "/shop"
}, {
  id: "4",
  title: "Flash Deals",
  description: "Limited time offers",
  color: "bg-gradient-to-r from-purple-500 to-purple-300",
  image: "/lovable-uploads/b919bc4e-ae0e-4d85-9cba-1168285b252c.png",
  buttonText: "Shop Now",
  buttonLink: "/shop"
}];

const categories = [{
  id: "reels",
  name: "Reels",
  icon: "🎬",
  link: "#reels",
  isReels: true
}, {
  id: "1",
  name: "Clothing",
  icon: "👕",
  link: "/shop/clothing"
}, {
  id: "2",
  name: "Shoes",
  icon: "👟",
  link: "/shop"
}, {
  id: "3",
  name: "Electronics",
  icon: "📱",
  link: "/shop"
}, {
  id: "4",
  name: "Home",
  icon: "🏠",
  link: "/shop"
}, {
  id: "5",
  name: "Beauty",
  icon: "💄",
  link: "/shop"
}, {
  id: "6",
  name: "Sports",
  icon: "🏀",
  link: "/shop"
}];

const subcategories = [{
  id: "1",
  name: "T-shirts",
  categoryId: "1"
}, {
  id: "2",
  name: "Hoodies",
  categoryId: "1"
}, {
  id: "3",
  name: "Jeans",
  categoryId: "1"
}, {
  id: "4",
  name: "Sneakers",
  categoryId: "2"
}, {
  id: "5",
  name: "Boots",
  categoryId: "2"
}, {
  id: "6",
  name: "Sandals",
  categoryId: "2"
}, {
  id: "7",
  name: "Phones",
  categoryId: "3"
}, {
  id: "8",
  name: "Laptops",
  categoryId: "3"
}, {
  id: "9",
  name: "Accessories",
  categoryId: "3"
}];

const products: Product[] = [{
  id: "1",
  title: "Women's Summer Dress",
  price: 1299,
  discountPrice: 999,
  discountPercentage: 23,
  image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop&crop=center",
  category: "Clothing"
}, {
  id: "2",
  title: "Men's Casual T-Shirt",
  price: 599,
  image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center",
  category: "Clothing"
}, {
  id: "3",
  title: "Wireless Earbuds",
  price: 2499,
  discountPrice: 1999,
  discountPercentage: 20,
  image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400&h=400&fit=crop&crop=center",
  category: "Electronics"
}, {
  id: "4",
  title: "Running Shoes",
  price: 3499,
  discountPrice: 2999,
  discountPercentage: 14,
  image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop&crop=center",
  category: "Shoes"
}, {
  id: "5",
  title: "Smart Watch",
  price: 4999,
  image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&crop=center",
  category: "Electronics"
}, {
  id: "6",
  title: "Denim Jacket",
  price: 1999,
  image: "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=400&h=400&fit=crop&crop=center",
  category: "Clothing"
}];

const ShopPage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>("1");
  const [searchQuery, setSearchQuery] = useState("");
  const [showReels, setShowReels] = useState(false);
  
  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };
  
  const filteredSubcategories = subcategories.filter(subcat => subcat.categoryId === selectedCategory);
  const selectedCategoryName = categories.find(cat => cat.id === selectedCategory)?.name;
  const filteredProducts = products.filter(product => product.category.toLowerCase() === selectedCategoryName?.toLowerCase());

  return <div className="pb-20 md:pb-8">
      {/* Search bar */}
      <div className="sticky top-0 z-20 bg-white px-4 py-3 border-b">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search products..." className="pl-10 py-2 w-full rounded-full bg-gray-50 border-gray-200" />
        </div>
      </div>

      <div className="px-4 py-4 max-w-7xl mx-auto">
        {/* Promotions carousel */}
        <PromotionsCarousel 
          promotions={promotions} 
          onReelsClick={() => setShowReels(true)}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left sidebar on desktop */}
          <div className="lg:col-span-1">
            {/* Categories grid */}
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-3">Categories</h2>
              <div className="grid grid-cols-3 lg:grid-cols-1 gap-3">
                {categories.map(category => <div
                    key={category.id} 
                    className={`p-4 rounded-lg flex lg:flex-row flex-col items-center justify-center lg:justify-start transition-all cursor-pointer ${
                      selectedCategory === category.id ? "bg-kein-lightblue text-kein-blue border border-kein-blue/30" : 
                      category.isReels ? "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 hover:from-purple-200 hover:to-pink-200" :
                      "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`} 
                    onClick={(e) => {
                      e.preventDefault();
                      if (category.isReels) {
                        setShowReels(true);
                      } else if (category.id === "1") {
                        // For clothing, navigate directly to shop/clothing
                        navigate("/shop/clothing");
                      } else {
                        // For other categories, just select them
                        handleCategoryClick(category.id);
                      }
                    }}
                  >
                    <span className="text-2xl mb-1 lg:mb-0 lg:mr-3">{category.icon}</span>
                    <span className="text-sm font-medium">{category.name}</span>
                  </div>)}
              </div>
            </div>

            {/* Subcategories */}
            {filteredSubcategories.length > 0 && <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-bold">
                    {selectedCategoryName} Categories
                  </h2>
                  <Link to="#" className="text-kein-blue text-sm flex items-center lg:hidden">
                    View All
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
                <div className="flex lg:flex-col overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 space-x-3 lg:space-x-0 lg:space-y-2 scrollbar-hide">
                  {filteredSubcategories.map(subcategory => <div key={subcategory.id} className="bg-gray-100 px-4 py-2 rounded-full lg:rounded-md text-gray-700 whitespace-nowrap lg:whitespace-normal text-center lg:text-left">
                      {subcategory.name}
                    </div>)}
                </div>
              </div>}
          </div>

          {/* Main content area */}
          <div className="lg:col-span-3">
            {/* Products list */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-bold">Popular {selectedCategoryName}</h2>
                <Link to={categories.find(cat => cat.id === selectedCategory)?.link || "#"} className="text-kein-blue text-sm flex items-center">
                  View All
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map(product => <ProductCard key={product.id} product={product} showAddToCart={true} />)}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Reels Modal */}
      {showReels && (
        <Reels onClose={() => setShowReels(false)} />
      )}
    </div>;
};
export default ShopPage;
