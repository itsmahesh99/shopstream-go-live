import React, { useState } from "react";
import { Trash2, ShoppingBag, X, Heart, Grid, List, ChevronLeft, Star, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";

// Mock data
const wishlistItems = [
  {
    id: "1",
    title: "Women solid top and jeans",
    price: 999,
    discountPrice: 499,
    discountPercentage: 50,
    image: "/lovable-uploads/37fa901f-5b94-426f-ac68-07a4249941e7.png",
    color: "Pink",
    availableColors: ["Pink", "Blue", "Black"],
    size: "M",
    availableSizes: ["S", "M", "L", "XL"],
    rating: 4.5,
    reviews: 24,
    inStock: true,
  },
  {
    id: "2",
    title: "Men's casual shirt premium quality cotton",
    price: 1200,
    discountPrice: 899,
    discountPercentage: 25,
    image: "/lovable-uploads/f8d1a83b-970d-4d3a-966a-e0e1deaddb20.png",
    color: "Blue",
    availableColors: ["Blue", "White", "Black"],
    size: "L",
    availableSizes: ["M", "L", "XL"],
    rating: 4.2,
    reviews: 18,
    inStock: true,
  },
  {
    id: "3",
    title: "Women's summer dress floral print",
    price: 2700,
    discountPrice: 1999,
    discountPercentage: 26,
    image: "/lovable-uploads/d9b61dc1-74ba-423d-8b21-9e83e8e1ff97.png",
    color: "Green",
    availableColors: ["Green", "Yellow", "Pink"],
    size: "S",
    availableSizes: ["XS", "S", "M"],
    rating: 4.8,
    reviews: 35,
    inStock: false,
  },
  {
    id: "4",
    title: "Denim jacket vintage style unisex",
    price: 1900,
    discountPrice: 1299,
    discountPercentage: 32,
    image: "/lovable-uploads/7c48c057-d4b0-4193-9473-be6c8eee605c.png",
    color: "Blue",
    availableColors: ["Blue", "Black", "Gray"],
    size: "XL",
    availableSizes: ["L", "XL", "XXL"],
    rating: 4.6,
    reviews: 42,
    inStock: true,
  },
  {
    id: "5",
    title: "Casual T-shirt comfortable fit",
    price: 999,
    discountPrice: 699,
    discountPercentage: 30,
    image: "/lovable-uploads/bcb73b7f-2144-4a7d-aaca-a22c1dce107d.png",
    color: "White",
    availableColors: ["White", "Black", "Gray", "Blue"],
    size: "M",
    availableSizes: ["S", "M", "L", "XL"],
    rating: 4.3,
    reviews: 28,
    inStock: true,
  },
  {
    id: "6",
    title: "Premium headphones with noise cancellation",
    price: 2499,
    discountPrice: 1999,
    discountPercentage: 20,
    image: "/lovable-uploads/68ddc85b-2fc9-4bc2-b503-2a1a3b95821b.png",
    color: "Black",
    availableColors: ["Black", "White", "Silver"],
    size: "One Size",
    availableSizes: ["One Size"],
    rating: 4.7,
    reviews: 156,
    inStock: true,
  },
];

const WishlistPage = () => {
  const { toast } = useToast();
  const { addToCart } = useCart();
  const [items, setItems] = useState(wishlistItems);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const handleRemoveFromWishlist = (id: string) => {
    setItems(items.filter(item => item.id !== id));
    toast({
      title: "Removed from wishlist",
      description: "Item has been removed from your wishlist",
    });
  };
  
  const handleAddToCart = (item: typeof items[0]) => {
    addToCart({
      id: item.id,
      title: item.title,
      price: item.price,
      discountPrice: item.discountPrice,
      image: item.image,
      color: item.color,
      size: item.size,
      quantity: 1
    });
    
    toast({
      title: "Added to cart",
      description: `${item.title} has been added to your cart`,
    });
  };

  const handleClearWishlist = () => {
    setItems([]);
    toast({
      title: "Wishlist cleared",
      description: "All items have been removed from your wishlist",
    });
  };

  const handleSizeChange = (id: string, newSize: string) => {
    setItems(
      items.map(item => 
        item.id === id ? { ...item, size: newSize } : item
      )
    );
  };

  const handleColorChange = (id: string, newColor: string) => {
    setItems(
      items.map(item => 
        item.id === id ? { ...item, color: newColor } : item
      )
    );
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="h-3 w-3 fill-yellow-400 text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half-star" className="h-3 w-3 text-yellow-400" />);
    }
    
    const remainingStars = 5 - stars.length;
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-star-${i}`} className="h-3 w-3 text-gray-300" />);
    }
    
    return stars;
  };

  return (
    <div className="min-h-screen pb-20 md:pb-8 bg-gray-50">
      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-30 bg-white border-b">
        <div className="px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">My Wishlist</h1>
          {items.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-kein-coral hover:text-kein-coral/80 hover:bg-transparent px-2"
              onClick={handleClearWishlist}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Clear all
            </Button>
          )}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block max-w-7xl mx-auto px-4 py-8">
        {/* Desktop Header */}
        <div className="mb-6">
          <Link to="/home" className="inline-flex items-center text-gray-600 hover:text-kein-blue mb-4">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Shopping
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
              <p className="text-gray-600 mt-1">{items.length} item{items.length !== 1 ? 's' : ''} saved</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center border rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="h-8 px-3"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="h-8 px-3"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
              
              {items.length > 0 && (
                <Button 
                  variant="outline" 
                  onClick={handleClearWishlist}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Content */}
        {items.length > 0 ? (
          <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}`}>
            {items.map(item => (
              <div key={item.id}>
                {viewMode === 'grid' ? (
                  /* Grid View */
                  <Card className="group hover:shadow-lg transition-shadow duration-200">
                    <CardContent className="p-0">
                      <div className="relative">
                        <div className="aspect-square overflow-hidden rounded-t-lg">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        </div>
                        
                        <button 
                          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                          onClick={() => handleRemoveFromWishlist(item.id)}
                        >
                          <Heart className="h-4 w-4 text-red-500 fill-current" />
                        </button>
                        
                        {item.discountPercentage > 0 && (
                          <Badge className="absolute top-3 left-3 bg-red-500 text-white">
                            {item.discountPercentage}% OFF
                          </Badge>
                        )}
                        
                        {!item.inStock && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-t-lg">
                            <Badge variant="destructive">Out of Stock</Badge>
                          </div>
                        )}
                      </div>
                      
                      <div className="p-4">
                        <h3 className="font-medium text-gray-900 line-clamp-2 mb-2">{item.title}</h3>
                        
                        <div className="flex items-center mb-2">
                          <div className="flex mr-2">
                            {renderStars(item.rating)}
                          </div>
                          <span className="text-sm text-gray-500">({item.reviews})</span>
                        </div>
                        
                        <div className="flex items-center space-x-2 mb-3">
                          <span className="text-lg font-bold text-kein-coral">₹{item.discountPrice}</span>
                          {item.discountPercentage > 0 && (
                            <span className="text-sm text-gray-500 line-through">₹{item.price}</span>
                          )}
                        </div>
                        
                        {/* Size Selection */}
                        <div className="mb-3">
                          <p className="text-xs text-gray-500 mb-1">Size: {item.size}</p>
                          <div className="flex flex-wrap gap-1">
                            {item.availableSizes.map((size) => (
                              <button
                                key={size}
                                onClick={() => handleSizeChange(item.id, size)}
                                className={`h-6 w-8 text-xs rounded border ${
                                  item.size === size 
                                  ? 'bg-kein-blue text-white border-kein-blue' 
                                  : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                                }`}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        {/* Color Selection */}
                        <div className="mb-4">
                          <p className="text-xs text-gray-500 mb-1">Color: {item.color}</p>
                          <div className="flex flex-wrap gap-1">
                            {item.availableColors.map((color) => (
                              <button
                                key={color}
                                onClick={() => handleColorChange(item.id, color)}
                                className={`h-6 px-2 text-xs rounded border ${
                                  item.color === color 
                                  ? 'bg-kein-blue text-white border-kein-blue' 
                                  : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                                }`}
                              >
                                {color}
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        <Button 
                          className="w-full bg-kein-blue hover:bg-kein-blue/90"
                          onClick={() => handleAddToCart(item)}
                          disabled={!item.inStock}
                        >
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  /* List View */
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex space-x-4">
                        <div className="relative w-32 h-32 flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                          {item.discountPercentage > 0 && (
                            <Badge className="absolute top-2 left-2 bg-red-500 text-white text-xs">
                              {item.discountPercentage}% OFF
                            </Badge>
                          )}
                          {!item.inStock && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                              <Badge variant="destructive" className="text-xs">Out of Stock</Badge>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium text-gray-900 line-clamp-2 mb-2">{item.title}</h3>
                            <button 
                              className="text-red-500 hover:text-red-700 p-1"
                              onClick={() => handleRemoveFromWishlist(item.id)}
                            >
                              <Heart className="h-5 w-5 fill-current" />
                            </button>
                          </div>
                          
                          <div className="flex items-center mb-2">
                            <div className="flex mr-2">
                              {renderStars(item.rating)}
                            </div>
                            <span className="text-sm text-gray-500">({item.reviews} reviews)</span>
                          </div>
                          
                          <div className="flex items-center space-x-2 mb-3">
                            <span className="text-xl font-bold text-kein-coral">₹{item.discountPrice}</span>
                            {item.discountPercentage > 0 && (
                              <span className="text-gray-500 line-through">₹{item.price}</span>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-500 mb-1">Size: {item.size}</p>
                              <div className="flex flex-wrap gap-1">
                                {item.availableSizes.map((size) => (
                                  <button
                                    key={size}
                                    onClick={() => handleSizeChange(item.id, size)}
                                    className={`h-7 w-10 text-xs rounded border ${
                                      item.size === size 
                                      ? 'bg-kein-blue text-white border-kein-blue' 
                                      : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                                    }`}
                                  >
                                    {size}
                                  </button>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <p className="text-sm text-gray-500 mb-1">Color: {item.color}</p>
                              <div className="flex flex-wrap gap-1">
                                {item.availableColors.map((color) => (
                                  <button
                                    key={color}
                                    onClick={() => handleColorChange(item.id, color)}
                                    className={`h-7 px-2 text-xs rounded border ${
                                      item.color === color 
                                      ? 'bg-kein-blue text-white border-kein-blue' 
                                      : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                                    }`}
                                  >
                                    {color}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex space-x-2">
                            <Button 
                              className="flex-1 bg-kein-blue hover:bg-kein-blue/90"
                              onClick={() => handleAddToCart(item)}
                              disabled={!item.inStock}
                            >
                              <ShoppingBag className="h-4 w-4 mr-2" />
                              {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                            </Button>
                            <Button variant="outline" size="icon">
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">Start adding items to your wishlist to keep track of products you love</p>
            <Button 
              className="bg-kein-blue hover:bg-kein-blue/90 px-8"
              onClick={() => window.location.href = '/home'}
            >
              Start Shopping
            </Button>
          </div>
        )}
      </div>
      
      {/* Mobile Content */}
      <div className="md:hidden px-4 py-4">
        {items.length > 0 ? (
          <div className="space-y-4">
            {items.map(item => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="flex p-3">
                  <div className="w-24 h-24 relative rounded-md overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    {item.discountPercentage > 0 && (
                      <Badge className="absolute top-1 left-1 bg-red-500 text-white text-xs px-1">
                        {item.discountPercentage}% OFF
                      </Badge>
                    )}
                  </div>
                  
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between">
                      <h3 className="text-sm font-medium line-clamp-2">{item.title}</h3>
                      <button 
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleRemoveFromWishlist(item.id)}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="flex items-center mt-1">
                      <div className="flex mr-1">
                        {renderStars(item.rating)}
                      </div>
                      <span className="text-xs text-gray-500">({item.reviews})</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="font-bold text-kein-coral">₹{item.discountPrice}</span>
                      {item.discountPercentage > 0 && (
                        <span className="text-xs text-gray-500 line-through">₹{item.price}</span>
                      )}
                    </div>
                    
                    {/* Size Selection */}
                    <div className="mt-2">
                      <p className="text-xs text-gray-500 mb-1">Size:</p>
                      <div className="flex flex-wrap gap-1">
                        {item.availableSizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => handleSizeChange(item.id, size)}
                            className={`h-6 w-8 text-xs rounded-md flex items-center justify-center ${
                              item.size === size 
                              ? 'bg-kein-blue text-white' 
                              : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Color Selection */}
                    <div className="mt-2">
                      <p className="text-xs text-gray-500 mb-1">Color:</p>
                      <div className="flex flex-wrap gap-1">
                        {item.availableColors.map((color) => (
                          <button
                            key={color}
                            onClick={() => handleColorChange(item.id, color)}
                            className={`h-6 px-2 text-xs rounded-md flex items-center justify-center ${
                              item.color === color 
                              ? 'bg-kein-blue text-white' 
                              : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {color}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <Button 
                        variant="default" 
                        size="sm" 
                        className="h-8 rounded-full w-full bg-kein-blue"
                        onClick={() => handleAddToCart(item)}
                        disabled={!item.inStock}
                      >
                        <ShoppingBag className="h-3 w-3 mr-2" />
                        {item.inStock ? 'Add to cart' : 'Out of stock'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Heart className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Your wishlist is empty</h3>
            <p className="text-gray-500 mb-6">Items added to your wishlist will appear here</p>
            <Button 
              className="bg-kein-blue hover:bg-kein-blue/90"
              onClick={() => window.location.href = '/home'}
            >
              Continue shopping
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
