
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ProductCard, { Product } from "@/components/common/ProductCard";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

// Mock data
const promotions = [{
  id: "1",
  title: "Welcome to Kein!",
  description: "Watch live streams from your favorite influencers and shop your desired products with just one click!",
  color: "bg-gradient-to-r from-kein-blue to-blue-400",
  image: "/lovable-uploads/f570e76e-9e2b-48d1-b582-8f7c2732629c.png",
  buttonText: "Watch Now",
  buttonLink: "/kein-live"
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
  image: "/lovable-uploads/37fa901f-5b94-426f-ac68-07a4249941e7.png",
  category: "Clothing"
}, {
  id: "2",
  title: "Men's Casual T-Shirt",
  price: 599,
  image: "/lovable-uploads/f8d1a83b-970d-4d3a-966a-e0e1deaddb20.png",
  category: "Clothing"
}, {
  id: "3",
  title: "Wireless Earbuds",
  price: 2499,
  discountPrice: 1999,
  discountPercentage: 20,
  image: "/lovable-uploads/d9b61dc1-74ba-423d-8b21-9e83e8e1ff97.png",
  category: "Electronics"
}, {
  id: "4",
  title: "Running Shoes",
  price: 3499,
  discountPrice: 2999,
  discountPercentage: 14,
  image: "/lovable-uploads/7c48c057-d4b0-4193-9473-be6c8eee605c.png",
  category: "Shoes"
}, {
  id: "5",
  title: "Smart Watch",
  price: 4999,
  image: "/lovable-uploads/bcb73b7f-2144-4a7d-aaca-a22c1dce107d.png",
  category: "Electronics"
}, {
  id: "6",
  title: "Denim Jacket",
  price: 1999,
  image: "/lovable-uploads/b919bc4e-ae0e-4d85-9cba-1168285b252c.png",
  category: "Clothing"
}];

const ShopPage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>("1");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSlide, setActiveSlide] = useState(0);
  
  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };
  
  const handleWatchNowClick = (link: string) => (event: React.MouseEvent) => {
    event.preventDefault();
    navigate(link);
  };
  
  const filteredSubcategories = subcategories.filter(subcat => subcat.categoryId === selectedCategory);
  const selectedCategoryName = categories.find(cat => cat.id === selectedCategory)?.name;
  const filteredProducts = products.filter(product => product.category.toLowerCase() === selectedCategoryName?.toLowerCase());
  
  return <div className="pb-20">
      {/* Search bar */}
      <div className="sticky top-0 z-20 bg-white px-4 py-3 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search products..." className="pl-10 py-2 w-full rounded-full bg-gray-50 border-gray-200" />
        </div>
      </div>

      <div className="px-4 py-4">
        {/* Promotions carousel */}
        <div className="mb-6">
          <Carousel className="w-full" opts={{
          loop: true
        }} onSelect={(api) => {
          if (api) {
            setActiveSlide(api.selectedScrollSnap());
          }
        }}>
            <CarouselContent>
              {promotions.map(promo => <CarouselItem key={promo.id} className="pl-1">
                  <div className={`rounded-lg p-6 ${promo.color} text-white h-44 relative overflow-hidden`}>
                    <div className="relative z-10 max-w-[70%]">
                      <h3 className="text-xl font-bold">{promo.title}</h3>
                      <p className="mt-1 text-white/90 mb-3 text-xs">{promo.description}</p>
                      <Button 
                        variant="secondary" 
                        className="mt-2 bg-white text-blue-600 hover:bg-gray-100 font-bold text-lg"
                        onClick={handleWatchNowClick(promo.buttonLink)}
                      >
                        {promo.buttonText}
                      </Button>
                    </div>
                    <img src={promo.image} alt={promo.title} className="absolute right-0 bottom-0 h-full opacity-90 object-cover object-right" />
                  </div>
                </CarouselItem>)}
            </CarouselContent>
            <CarouselPrevious className="left-1" />
            <CarouselNext className="right-1" />
            <div className="flex justify-center gap-1 mt-3">
              {promotions.map((_, index) => <div key={index} className={`h-1.5 w-5 rounded-full transition-colors duration-300 ${index === activeSlide ? "bg-kein-blue" : "bg-gray-300"}`} />)}
            </div>
          </Carousel>
        </div>

        {/* Categories grid */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3">Categories</h2>
          <div className="grid grid-cols-3 gap-3">
            {categories.map(category => <Link key={category.id} to={category.link} className={`p-4 rounded-lg flex flex-col items-center justify-center transition-all ${selectedCategory === category.id ? "bg-kein-lightblue text-kein-blue border border-kein-blue/30" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`} onClick={() => handleCategoryClick(category.id)}>
                <span className="text-2xl mb-1">{category.icon}</span>
                <span className="text-sm font-medium">{category.name}</span>
              </Link>)}
          </div>
        </div>

        {/* Subcategories */}
        {filteredSubcategories.length > 0 && <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-bold">
                {selectedCategoryName} Categories
              </h2>
              <Link to="#" className="text-kein-blue text-sm flex items-center">
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            <div className="flex overflow-x-auto pb-2 space-x-3 scrollbar-hide">
              {filteredSubcategories.map(subcategory => <div key={subcategory.id} className="bg-gray-100 px-4 py-2 rounded-full text-gray-700 whitespace-nowrap">
                  {subcategory.name}
                </div>)}
            </div>
          </div>}

        {/* Products list */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold">Popular {selectedCategoryName}</h2>
            <Link to={categories.find(cat => cat.id === selectedCategory)?.link || "#"} className="text-kein-blue text-sm flex items-center">
              View All
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {filteredProducts.map(product => <ProductCard key={product.id} product={product} showAddToCart={true} />)}
          </div>
        </div>
      </div>
    </div>;
};
export default ShopPage;
