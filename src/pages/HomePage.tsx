import React, { useState, lazy, Suspense, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { ProductsService, Product, Category } from "@/services/productsService";
import { LiveStreamingService } from "@/services/liveStreamingService";
import { LiveStreamSession } from "@/types/live-streaming";
import { 
  Heart,
  ShoppingBag,
  Calendar,
  Star,
  Package,
  Filter,
  Search,
  Grid,
  List
} from "lucide-react";

// Loading component
const SectionLoader = () => (
  <div className="animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
    <div className="grid grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-48 bg-gray-200 rounded"></div>
      ))}
    </div>
  </div>
);

// Category icon mapping
const getCategoryIcon = (categoryName: string) => {
  const icons: { [key: string]: string } = {
    'Electronics': '📱',
    'Fashion': '👗',
    'Beauty': '💄',
    'Sports': '⚽',
    'Gaming': '🎮',
    'Home': '🏠',
    'Books': '📚',
    'Sneakers': '👟',
    'Home & Garden': '🏡'
  };
  return icons[categoryName] || '📦';
};

const HomePage = () => {
  const { user, userProfile } = useAuth();
  
  // State management
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [liveStories, setLiveStories] = useState<LiveStreamSession[]>([]);
  const [dbCategories, setDbCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        console.log('HomePage: Starting to fetch initial data...');
        setLoading(true);
        
        // Fetch products and categories first (critical data)
        const [productsData, categoriesData] = await Promise.all([
          ProductsService.getFeaturedProducts(12),
          ProductsService.getCategories()
        ]);
        
        console.log('HomePage: Critical data loaded:', {
          products: productsData?.length || 0,
          categories: categoriesData?.length || 0
        });
        
        console.log('Featured products before setState:', productsData);
        
        setFeaturedProducts(productsData);
        setDbCategories(categoriesData);
        setError(null);
        
        console.log('Featured products after setState (should trigger re-render):', productsData?.length || 0);
        
        // Try to fetch live stories for the top section (non-critical)
        try {
          console.log('Attempting to fetch live stories...');
          const { data: liveStoriesData, error: liveError } = await LiveStreamingService.getLiveSessions();
          
          if (liveError) {
            console.error('Error fetching live streams:', liveError);
            setLiveStories([]);
          } else if (liveStoriesData && liveStoriesData.length > 0) {
            console.log('Live stories loaded:', liveStoriesData.length);
            setLiveStories(liveStoriesData.slice(0, 5)); // Limit to 5 for the stories section
          } else {
            console.log('No live streams found');
            setLiveStories([]);
          }
        } catch (liveStoriesError) {
          console.warn('Failed to load live stories, continuing without them:', liveStoriesError);
          setLiveStories([]); // Set empty array so the UI doesn't show loading
        }
        
      } catch (err) {
        console.error('HomePage: Error fetching critical data:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Filter products by category
  const filterProductsByCategory = async (categoryId: string | null) => {
    try {
      setProductsLoading(true);
      setSelectedCategory(categoryId);
      setSearchQuery(''); // Clear search when filtering by category
      
      let products;
      if (categoryId) {
        products = await ProductsService.getProductsByCategory(categoryId, 12);
      } else {
        products = await ProductsService.getFeaturedProducts(12);
      }
      
      setFeaturedProducts(products);
    } catch (err) {
      console.error('Error filtering products:', err);
    } finally {
      setProductsLoading(false);
    }
  };

  // Search products
  const searchProducts = async (query: string) => {
    try {
      setProductsLoading(true);
      setSearchQuery(query);
      setSelectedCategory(null); // Clear category filter when searching
      
      if (query.trim()) {
        const products = await ProductsService.searchProducts(query, 12);
        setFeaturedProducts(products);
      } else {
        const products = await ProductsService.getFeaturedProducts(12);
        setFeaturedProducts(products);
      }
    } catch (err) {
      console.error('Error searching products:', err);
    } finally {
      setProductsLoading(false);
    }
  };

  // Fallback categories
  const fallbackCategories = [
    { id: "1", name: "Sneakers", icon: "👟" },
    { id: "2", name: "Electronics", icon: "📱" },
    { id: "3", name: "Fashion", icon: "👗" }, 
    { id: "4", name: "Beauty", icon: "💄" },
    { id: "5", name: "Sports", icon: "⚽" },
    { id: "6", name: "Gaming", icon: "🎮" },
    { id: "7", name: "Home", icon: "🏠" },
    { id: "8", name: "Books", icon: "📚" }
  ];

  // Component definitions
  const LiveStoryCard = ({ story }: { story: LiveStreamSession }) => (
    <div className="flex flex-col items-center space-y-3 cursor-pointer group min-w-[80px]">
      <div className="relative">
        {/* Profile Circle with Live Border */}
        <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-r from-red-500 via-pink-500 to-red-600">
          <div className="w-full h-full rounded-full overflow-hidden border-2 border-white bg-white">
            <img 
              src={story.thumbnail_url || '/placeholder.svg'} 
              alt={story.title || 'Live Stream'}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        {/* Live Badge */}
        {story.status === 'live' && (
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
              Live • {story.current_viewers || 0}
            </Badge>
          </div>
        )}
      </div>
      
      {/* Username */}
      <div className="text-center">
        <p className="text-xs font-medium text-gray-900 truncate max-w-[80px]">
          @{story.influencer_id ? story.influencer_id.slice(-8) : 'host'}
        </p>
        <p className="text-[10px] text-gray-500 truncate max-w-[80px]">
          {story.title?.slice(0, 15) || 'Live Stream'}
        </p>
      </div>
    </div>
  );

  const ProductCard = ({ product }: { product: Product }) => {
    const discountPercentage = product.compare_price 
      ? Math.round(((product.compare_price - product.retail_price) / product.compare_price) * 100)
      : 0;

    return (
      <Card className="group cursor-pointer overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl border-0 bg-white rounded-xl">
        <div className="relative">
          {product.images && product.images.length > 0 ? (
            <img 
              src={product.images[0]} 
              alt={product.name}
              className="w-full h-56 object-cover"
            />
          ) : (
            <div className="w-full h-56 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <Package className="h-16 w-16 text-gray-400" />
            </div>
          )}
          
          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-green-500 hover:bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-md">
                {discountPercentage}% OFF
              </Badge>
            </div>
          )}
          
          {/* Category Badge */}
          {product.category && (
            <div className="absolute top-3 right-3">
              <Badge variant="secondary" className="bg-white/90 text-gray-700 text-xs font-medium px-2 py-1 rounded-md backdrop-blur-sm">
                {product.category.name}
              </Badge>
            </div>
          )}
          
          {/* Wishlist Button */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full">
              <Heart className="h-4 w-4 text-gray-600" />
            </Button>
          </div>
        </div>
        
        <CardContent className="p-4">
          {/* Brand/Influencer */}
          <div className="mb-2">
            <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">
              {product.brand || (product.influencer ? `@${product.influencer.display_name || product.influencer.first_name}` : 'KEIN')}
            </p>
          </div>
          
          {/* Product Name */}
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-3 min-h-[2.5rem]">
            {product.name}
          </h3>
          
          {/* Rating */}
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-900">4.3</span>
              <div className="flex ml-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                  </svg>
                ))}
              </div>
              <span className="text-xs text-gray-500 ml-1">| {Math.floor(Math.random() * 500) + 100}</span>
            </div>
          </div>
          
          {/* Pricing */}
          <div className="mb-3">
            <div className="flex items-baseline space-x-2">
              <span className="text-lg font-bold text-gray-900">
                Rs. {product.retail_price.toLocaleString()}
              </span>
              {product.compare_price && (
                <span className="text-sm text-gray-500 line-through">
                  Rs. {product.compare_price.toLocaleString()}
                </span>
              )}
              {discountPercentage > 0 && (
                <span className="text-xs text-green-600 font-medium">
                  ({discountPercentage}% OFF)
                </span>
              )}
            </div>
          </div>
          
          {/* Stock Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Package className="w-3 h-3" />
              <span>{product.stock_quantity || 0} in stock</span>
            </div>
            <Button size="sm" className="h-8 px-4 text-xs font-medium bg-gray-900 hover:bg-gray-800 text-white rounded-md">
              <ShoppingBag className="w-3 h-3 mr-1" />
              Buy
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <SectionLoader />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Live Stories Section */}
        <Suspense fallback={<SectionLoader />}>
          <div className="mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
              Live Now
            </h2>
            {liveStories.length > 0 ? (
              <div className="flex space-x-3 sm:space-x-4 overflow-x-auto pb-2 scrollbar-hide">
                {liveStories.map((story) => (
                  <div key={story.id} className="flex-shrink-0">
                    <LiveStoryCard story={story} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">No live streams available right now</p>
              </div>
            )}
          </div>
        </Suspense>

        {/* Categories Filter Section */}
        <Suspense fallback={<SectionLoader />}>
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <h2 className="text-lg sm:text-xl font-bold">Shop by Category</h2>
                
                {/* Search Input */}
                <div className="relative flex-1 sm:max-w-md sm:ml-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => searchProducts(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>
              
              {/* Category Filters */}
              <div className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide pb-2">
                {/* All Products Filter */}
                <Button
                  variant={selectedCategory === null && !searchQuery ? "default" : "outline"}
                  onClick={() => filterProductsByCategory(null)}
                  className="flex-shrink-0 rounded-full px-4 sm:px-6 py-2 transition-all duration-300"
                  size="sm"
                >
                  <span className="text-xs sm:text-sm font-semibold whitespace-nowrap">All Products</span>
                </Button>
                
                {/* Category Filters */}
                {dbCategories.length > 0 ? (
                  dbCategories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      onClick={() => filterProductsByCategory(category.id)}
                      className="flex-shrink-0 rounded-full px-4 sm:px-6 py-2 transition-all duration-300"
                      size="sm"
                    >
                      <span className="text-sm sm:text-lg mr-1 sm:mr-2">{getCategoryIcon(category.name)}</span>
                      <span className="text-xs sm:text-sm font-semibold whitespace-nowrap">{category.name}</span>
                    </Button>
                  ))
                ) : (
                  fallbackCategories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      onClick={() => filterProductsByCategory(category.id)}
                      className="flex-shrink-0 rounded-full px-4 sm:px-6 py-2 transition-all duration-300"
                      size="sm"
                    >
                      <span className="text-sm sm:text-lg mr-1 sm:mr-2">{category.icon}</span>
                      <span className="text-xs sm:text-sm font-semibold whitespace-nowrap">{category.name}</span>
                    </Button>
                  ))
                )}
              </div>
            </div>
          </div>
        </Suspense>

        {/* Featured Products Section */}
        <Suspense fallback={<SectionLoader />}>
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
                  <Package className="w-5 sm:w-6 h-5 sm:h-6 mr-2 sm:mr-3 text-green-500" />
                  {searchQuery ? 'Search Results' : selectedCategory ? 'Filtered Products' : 'Featured Products'}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  {searchQuery 
                    ? `Showing results for "${searchQuery}"`
                    : selectedCategory 
                    ? 'Products in selected category' 
                    : 'Handpicked products just for you'
                  }
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
                <Link to="/shop">
                  <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                    Show All
                  </Button>
                </Link>
              </div>
            </div>
            {productsLoading ? (
              <SectionLoader />
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-gray-500">{error}</p>
              </div>
            ) : featuredProducts.length > 0 ? (
              <div className={`grid gap-4 sm:gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1 sm:grid-cols-2'
              }`}>
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">No products available</p>
                <p className="text-sm text-gray-400">
                  {searchQuery 
                    ? `No results found for "${searchQuery}". Try a different search term.`
                    : selectedCategory 
                    ? 'Try selecting a different category' 
                    : 'Check back soon for amazing deals!'
                  }
                </p>
                <p className="text-xs text-gray-300 mt-2">
                  Debug: Featured products count: {featuredProducts.length}
                </p>
              </div>
            )}
          </div>
        </Suspense>
      </div>
    </div>
  );
};

export default HomePage;
