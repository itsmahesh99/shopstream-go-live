import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter 
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Edit, Trash2, Package, Zap, ShoppingCart, Eye, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface BulkProduct {
  id: string;
  name: string;
  description?: string;
  retail_price: number;
  compare_price?: number;
  category_id?: string;
  sku?: string;
  stock_quantity?: number;
  images?: string[];
  brand?: string;
  tags?: string[];
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface LiveProduct {
  id: string;
  name: string;
  description?: string;
  price: number;
  compare_at_price?: number;
  category_id?: string;
  sku?: string;
  stock_quantity: number;
  original_stock: number;
  images?: string[];
  brand?: string;
  tags?: string[];
  status?: string;
  session_id?: string;
  created_at?: string;
  updated_at?: string;
}

interface Category {
  id: string;
  name: string;
}

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  retail_price: string;
  compare_price: string;
  compare_at_price: string;
  category_id: string;
  sku: string;
  stock_quantity: string;
  original_stock: string;
  images: string[];
  brand: string;
  tags: string;
  is_live_streamable: boolean;
  is_bulk_sale: boolean;
}

const initialFormData: ProductFormData = {
  name: '',
  description: '',
  price: '',
  retail_price: '',
  compare_price: '',
  compare_at_price: '',
  category_id: '',
  sku: '',
  stock_quantity: '',
  original_stock: '',
  images: [],
  brand: '',
  tags: '',
  is_live_streamable: false,
  is_bulk_sale: true
};

const ProductCatalogManager: React.FC = () => {
  const [bulkProducts, setBulkProducts] = useState<BulkProduct[]>([]);
  const [liveProducts, setLiveProducts] = useState<LiveProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [editingProduct, setEditingProduct] = useState<BulkProduct | LiveProduct | null>(null);
  const [editingType, setEditingType] = useState<'bulk' | 'live'>('bulk');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // Get influencer ID first
      const { data: influencerData, error: influencerError } = await supabase
        .from('influencers')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (influencerError) throw influencerError;
      
      // Fetch bulk products
      const { data: bulkData, error: bulkError } = await supabase
        .from('products')
        .select(`
          *,
          categories(name)
        `)
        .eq('influencer_id', influencerData.id)
        .order('created_at', { ascending: false });

      if (bulkError) throw bulkError;
      
      // Fetch live products
      const { data: liveData, error: liveError } = await supabase
        .from('live_products')
        .select(`
          *,
          categories(name)
        `)
        .eq('influencer_id', influencerData.id)
        .order('created_at', { ascending: false });

      if (liveError) throw liveError;
      
      setBulkProducts(bulkData || []);
      setLiveProducts(liveData || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to fetch products. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Get influencer ID first
      const { data: influencerData, error: influencerError } = await supabase
        .from('influencers')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (influencerError) throw influencerError;

      if (formData.is_bulk_sale) {
        // Save to products table for bulk sales
        const productData = {
          name: formData.name,
          description: formData.description,
          retail_price: parseFloat(formData.retail_price),
          compare_price: formData.compare_price ? parseFloat(formData.compare_price) : null,
          category_id: formData.category_id || null,
          sku: formData.sku || null,
          stock_quantity: parseInt(formData.stock_quantity) || 0,
          images: formData.images.length > 0 ? formData.images : null,
          brand: formData.brand || null,
          tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : null,
          influencer_id: influencerData.id,
          is_active: true,
        };

        if (editingProduct && editingType === 'bulk') {
          // Update existing bulk product
          const { error } = await supabase
            .from('products')
            .update(productData)
            .eq('id', editingProduct.id);

          if (error) throw error;
        } else {
          // Create new bulk product
          const { error } = await supabase
            .from('products')
            .insert([productData]);

          if (error) throw error;
        }
      }

      if (formData.is_live_streamable) {
        // Save to live_products table for live streaming
        const liveProductData = {
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price || formData.retail_price),
          compare_at_price: formData.compare_at_price ? parseFloat(formData.compare_at_price) : null,
          category_id: formData.category_id || null,
          sku: formData.sku || null,
          stock_quantity: parseInt(formData.stock_quantity) || 1,
          original_stock: parseInt(formData.original_stock || formData.stock_quantity) || 1,
          images: formData.images.length > 0 ? formData.images : null,
          brand: formData.brand || null,
          tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : null,
          influencer_id: influencerData.id,
          status: 'available',
        };

        if (editingProduct && editingType === 'live') {
          // Update existing live product
          const { error } = await supabase
            .from('live_products')
            .update(liveProductData)
            .eq('id', editingProduct.id);

          if (error) throw error;
        } else {
          // Create new live product
          const { error } = await supabase
            .from('live_products')
            .insert([liveProductData]);

          if (error) throw error;
        }
      }

      toast({
        title: "Success",
        description: `Product ${editingProduct ? 'updated' : 'created'} successfully!`,
      });

      setIsDialogOpen(false);
      setFormData(initialFormData);
      setEditingProduct(null);
      setEditingType('bulk');
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "Error",
        description: "Failed to save product. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (product: BulkProduct | LiveProduct, type: 'bulk' | 'live') => {
    setEditingProduct(product);
    setEditingType(type);
    
    if (type === 'bulk') {
      const bulkProduct = product as BulkProduct;
      setFormData({
        name: bulkProduct.name,
        description: bulkProduct.description || '',
        price: '',
        retail_price: bulkProduct.retail_price.toString(),
        compare_price: bulkProduct.compare_price?.toString() || '',
        compare_at_price: '',
        category_id: bulkProduct.category_id || '',
        sku: bulkProduct.sku || '',
        stock_quantity: bulkProduct.stock_quantity?.toString() || '0',
        original_stock: '',
        images: bulkProduct.images || [],
        brand: bulkProduct.brand || '',
        tags: bulkProduct.tags?.join(', ') || '',
        is_live_streamable: false,
        is_bulk_sale: true,
      });
    } else {
      const liveProduct = product as LiveProduct;
      setFormData({
        name: liveProduct.name,
        description: liveProduct.description || '',
        price: liveProduct.price.toString(),
        retail_price: '',
        compare_price: '',
        compare_at_price: liveProduct.compare_at_price?.toString() || '',
        category_id: liveProduct.category_id || '',
        sku: liveProduct.sku || '',
        stock_quantity: liveProduct.stock_quantity.toString(),
        original_stock: liveProduct.original_stock.toString(),
        images: liveProduct.images || [],
        brand: liveProduct.brand || '',
        tags: liveProduct.tags?.join(', ') || '',
        is_live_streamable: true,
        is_bulk_sale: false,
      });
    }
    setIsDialogOpen(true);
  };

  const handleDelete = async (productId: string, type: 'bulk' | 'live') => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const table = type === 'bulk' ? 'products' : 'live_products';
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', productId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Product deleted successfully!",
      });
      
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getAllProducts = () => {
    const bulk = bulkProducts.map(p => ({ ...p, type: 'bulk' as const }));
    const live = liveProducts.map(p => ({ ...p, type: 'live' as const }));
    return [...bulk, ...live];
  };

  const addSampleProducts = async () => {
    if (!confirm('This will add sample products to your catalog. Continue?')) return;

    try {
      // Get influencer ID first
      const { data: influencerData, error: influencerError } = await supabase
        .from('influencers')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (influencerError) throw influencerError;

      // Check if categories exist, if not create them
      const sampleCategories = [
        { name: 'Electronics', description: 'Electronic gadgets and devices' },
        { name: 'Fashion', description: 'Clothing and accessories' },
        { name: 'Home & Garden', description: 'Home decor and garden supplies' },
        { name: 'Sports', description: 'Sports and fitness equipment' },
        { name: 'Beauty', description: 'Beauty and personal care products' }
      ];

      // Create categories if they don't exist
      for (const category of sampleCategories) {
        const { data: existing } = await supabase
          .from('categories')
          .select('id')
          .eq('name', category.name)
          .single();

        if (!existing) {
          await supabase
            .from('categories')
            .insert([category]);
        }
      }

      // Fetch updated categories
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      const categoryMap = new Map(categoriesData?.map(cat => [cat.name, cat.id]) || []);

      // Sample products data
      const sampleProducts = [
        {
          name: 'Wireless Bluetooth Headphones',
          description: 'High-quality wireless headphones with noise cancellation and 24-hour battery life.',
          retail_price: 2999,
          compare_price: 3999,
          category_id: categoryMap.get('Electronics'),
          sku: 'WBH-001',
          stock_quantity: 50,
          brand: 'TechSound',
          tags: ['wireless', 'bluetooth', 'headphones', 'audio'],
          influencer_id: influencerData.id,
          is_active: true
        },
        {
          name: 'Smart Fitness Watch',
          description: 'Track your fitness goals with heart rate monitoring, GPS, and smartphone connectivity.',
          retail_price: 4999,
          compare_price: 6999,
          category_id: categoryMap.get('Sports'),
          sku: 'SFW-002',
          stock_quantity: 30,
          brand: 'FitTech',
          tags: ['fitness', 'smartwatch', 'health', 'sports'],
          influencer_id: influencerData.id,
          is_active: true
        },
        {
          name: 'Organic Face Serum',
          description: 'Natural anti-aging serum with vitamin C and hyaluronic acid for glowing skin.',
          retail_price: 1499,
          compare_price: 1999,
          category_id: categoryMap.get('Beauty'),
          sku: 'OFS-003',
          stock_quantity: 100,
          brand: 'GlowNaturals',
          tags: ['skincare', 'organic', 'serum', 'beauty'],
          influencer_id: influencerData.id,
          is_active: true
        },
        {
          name: 'Designer Cotton T-Shirt',
          description: 'Premium quality cotton t-shirt with trendy design and comfortable fit.',
          retail_price: 899,
          compare_price: 1299,
          category_id: categoryMap.get('Fashion'),
          sku: 'DCT-004',
          stock_quantity: 75,
          brand: 'StyleCo',
          tags: ['fashion', 'cotton', 'tshirt', 'casual'],
          influencer_id: influencerData.id,
          is_active: true
        },
        {
          name: 'LED Desk Lamp',
          description: 'Adjustable LED desk lamp with multiple brightness levels and USB charging port.',
          retail_price: 1299,
          compare_price: 1799,
          category_id: categoryMap.get('Home & Garden'),
          sku: 'LDL-005',
          stock_quantity: 40,
          brand: 'BrightHome',
          tags: ['lighting', 'desk', 'led', 'home'],
          influencer_id: influencerData.id,
          is_active: true
        }
      ];

      // Insert bulk products
      const { error: bulkError } = await supabase
        .from('products')
        .insert(sampleProducts);

      if (bulkError) throw bulkError;

      // Sample live products
      const sampleLiveProducts = [
        {
          name: 'Wireless Bluetooth Headphones',
          description: 'High-quality wireless headphones with noise cancellation and 24-hour battery life.',
          price: 2499,
          compare_at_price: 3999,
          category_id: categoryMap.get('Electronics'),
          sku: 'WBH-001-LIVE',
          stock_quantity: 25,
          original_stock: 25,
          brand: 'TechSound',
          tags: ['wireless', 'bluetooth', 'headphones', 'audio'],
          influencer_id: influencerData.id,
          status: 'available'
        },
        {
          name: 'Smart Fitness Watch',
          description: 'Track your fitness goals with heart rate monitoring, GPS, and smartphone connectivity.',
          price: 4499,
          compare_at_price: 6999,
          category_id: categoryMap.get('Sports'),
          sku: 'SFW-002-LIVE',
          stock_quantity: 15,
          original_stock: 15,
          brand: 'FitTech',
          tags: ['fitness', 'smartwatch', 'health', 'sports'],
          influencer_id: influencerData.id,
          status: 'available'
        },
        {
          name: 'Organic Face Serum',
          description: 'Natural anti-aging serum with vitamin C and hyaluronic acid for glowing skin.',
          price: 1299,
          compare_at_price: 1999,
          category_id: categoryMap.get('Beauty'),
          sku: 'OFS-003-LIVE',
          stock_quantity: 50,
          original_stock: 50,
          brand: 'GlowNaturals',
          tags: ['skincare', 'organic', 'serum', 'beauty'],
          influencer_id: influencerData.id,
          status: 'available'
        },
        {
          name: 'Designer Cotton T-Shirt',
          description: 'Premium quality cotton t-shirt with trendy design and comfortable fit.',
          price: 799,
          compare_at_price: 1299,
          category_id: categoryMap.get('Fashion'),
          sku: 'DCT-004-LIVE',
          stock_quantity: 40,
          original_stock: 40,
          brand: 'StyleCo',
          tags: ['fashion', 'cotton', 'tshirt', 'casual'],
          influencer_id: influencerData.id,
          status: 'available'
        },
        {
          name: 'LED Desk Lamp',
          description: 'Adjustable LED desk lamp with multiple brightness levels and USB charging port.',
          price: 1099,
          compare_at_price: 1799,
          category_id: categoryMap.get('Home & Garden'),
          sku: 'LDL-005-LIVE',
          stock_quantity: 20,
          original_stock: 20,
          brand: 'BrightHome',
          tags: ['lighting', 'desk', 'led', 'home'],
          influencer_id: influencerData.id,
          status: 'available'
        }
      ];

      // Insert live products
      const { error: liveError } = await supabase
        .from('live_products')
        .insert(sampleLiveProducts);

      if (liveError) throw liveError;

      toast({
        title: "Success",
        description: "Sample products added successfully! 5 bulk products and 5 live products have been created.",
      });

      // Refresh the products list
      fetchProducts();
      fetchCategories();
    } catch (error) {
      console.error('Error adding sample products:', error);
      toast({
        title: "Error",
        description: "Failed to add sample products. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredProducts = getAllProducts().filter(product => {
    switch (activeTab) {
      case 'live':
        return product.type === 'live';
      case 'bulk':
        return product.type === 'bulk';
      default:
        return true;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Enhanced Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                  <Package className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Product Catalog
                  </h1>
                  <p className="text-slate-600 text-lg">
                    Manage your products for live streaming and bulk sales
                  </p>
                </div>
              </div>
              
              {/* Stats Cards */}
              <div className="flex gap-6 mt-6">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <ShoppingCart className="h-6 w-6 text-green-600" />
                    <div>
                      <p className="text-sm text-green-600 font-medium">Bulk Products</p>
                      <p className="text-2xl font-bold text-green-700">{bulkProducts.length}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <Zap className="h-6 w-6 text-purple-600" />
                    <div>
                      <p className="text-sm text-purple-600 font-medium">Live Products</p>
                      <p className="text-2xl font-bold text-purple-700">{liveProducts.length}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <Eye className="h-6 w-6 text-blue-600" />
                    <div>
                      <p className="text-sm text-blue-600 font-medium">Total Products</p>
                      <p className="text-2xl font-bold text-blue-700">{bulkProducts.length + liveProducts.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button 
                size="lg"
                variant="outline"
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                onClick={addSampleProducts}
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Add Sample Products
              </Button>
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                    onClick={() => {
                      setEditingProduct(null);
                      setFormData(initialFormData);
                    }}
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    Add New Product
                  </Button>
                </DialogTrigger>
                
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingProduct ? 'Edit Product' : 'Add New Product'}
                    </DialogTitle>
                    <DialogDescription>
                      Create products that can be used in live streams and for bulk sales.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="retail_price">Retail Price (₹)</Label>
                  <Input
                    id="retail_price"
                    type="number"
                    step="0.01"
                    value={formData.retail_price}
                    onChange={(e) => setFormData({ ...formData, retail_price: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="compare_price">Compare Price (₹)</Label>
                  <Input
                    id="compare_price"
                    type="number"
                    step="0.01"
                    value={formData.compare_price}
                    onChange={(e) => setFormData({ ...formData, compare_price: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="stock_quantity">Stock Quantity</Label>
                  <Input
                    id="stock_quantity"
                    type="number"
                    value={formData.stock_quantity}
                    onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category_id} onValueChange={(value) => setFormData({ ...formData, category_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.is_live_streamable && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="price">Live Stream Price (₹)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required={formData.is_live_streamable}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="compare_at_price">Compare At Price (₹)</Label>
                    <Input
                      id="compare_at_price"
                      type="number"
                      step="0.01"
                      value={formData.compare_at_price}
                      onChange={(e) => setFormData({ ...formData, compare_at_price: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="original_stock">Original Stock</Label>
                    <Input
                      id="original_stock"
                      type="number"
                      value={formData.original_stock}
                      onChange={(e) => setFormData({ ...formData, original_stock: e.target.value })}
                      required={formData.is_live_streamable}
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="electronics, gadget, tech"
                />
              </div>
              
              <div className="space-y-3">
                <Label>Product Availability</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_live_streamable"
                      checked={formData.is_live_streamable}
                      onChange={(e) => setFormData({ ...formData, is_live_streamable: e.target.checked })}
                      className="rounded"
                    />
                    <Label htmlFor="is_live_streamable" className="flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      Available for Live Streaming
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_bulk_sale"
                      checked={formData.is_bulk_sale}
                      onChange={(e) => setFormData({ ...formData, is_bulk_sale: e.target.checked })}
                      className="rounded"
                    />
                    <Label htmlFor="is_bulk_sale" className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Available for Bulk Sales
                    </Label>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </Button>
              </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
        
        {/* Enhanced Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="border-b border-slate-200 bg-slate-50">
              <TabsList className="grid w-full grid-cols-3 bg-transparent p-2">
                <TabsTrigger 
                  value="all" 
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-slate-200 transition-all duration-200"
                >
                  <Package className="mr-2 h-4 w-4" />
                  All Products
                  <Badge variant="secondary" className="ml-2">
                    {bulkProducts.length + liveProducts.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger 
                  value="live" 
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-slate-200 transition-all duration-200"
                >
                  <Zap className="mr-2 h-4 w-4" />
                  Live Stream
                  <Badge variant="secondary" className="ml-2 bg-purple-100 text-purple-700">
                    {liveProducts.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger 
                  value="bulk" 
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-slate-200 transition-all duration-200"
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Bulk Sales
                  <Badge variant="secondary" className="ml-2 bg-green-100 text-green-700">
                    {bulkProducts.length}
                  </Badge>
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value={activeTab} className="p-6">
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
                    <p className="text-slate-600">Loading your products...</p>
                  </div>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-16">
                  <div className="mx-auto w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mb-6">
                    <Package className="h-12 w-12 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">No products found</h3>
                  <p className="text-slate-600 mb-8 max-w-md mx-auto">
                    Get started by adding your first product to the catalog. You can create products for both live streaming and bulk sales.
                  </p>
                  <Button 
                    onClick={() => setIsDialogOpen(true)}
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    Add Your First Product
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <Card 
                      key={product.id} 
                      className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-200 hover:border-slate-300 overflow-hidden bg-white"
                    >
                      <CardHeader className="relative">
                        {/* Product Image Placeholder */}
                        <div className="w-full h-48 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                          {product.images && product.images.length > 0 ? (
                            <img 
                              src={(product.images as string[])[0]} 
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="h-16 w-16 text-slate-400" />
                          )}
                          
                          {/* Product Type Badge */}
                          <div className="absolute top-3 left-3">
                            {product.type === 'live' ? (
                              <Badge className="bg-gradient-to-r from-purple-500 to-violet-500 text-white border-0 shadow-lg">
                                <Zap className="mr-1 h-3 w-3" />
                                Live Stream
                              </Badge>
                            ) : (
                              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg">
                                <ShoppingCart className="mr-1 h-3 w-3" />
                                Bulk Sales
                              </Badge>
                            )}
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                            <Button
                              variant="secondary"
                              size="sm"
                              className="bg-white/90 hover:bg-white shadow-lg backdrop-blur-sm"
                              onClick={() => handleEdit(product, product.type)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="secondary"
                              size="sm"
                              className="bg-white/90 hover:bg-white shadow-lg backdrop-blur-sm text-red-600 hover:text-red-700"
                              onClick={() => handleDelete(product.id, product.type)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                                {product.name}
                              </CardTitle>
                              <CardDescription className="text-sm text-slate-500">
                                SKU: {product.sku || 'N/A'}
                              </CardDescription>
                            </div>
                          </div>
                          
                          {product.brand && (
                            <Badge variant="outline" className="text-xs">
                              {product.brand}
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {product.description}
                      </p>
                      
                      <div className="flex items-center gap-2 flex-wrap">
                        {product.type === 'live' && (
                          <Badge variant="default" className="bg-purple-100 text-purple-800">
                            <Zap className="mr-1 h-3 w-3" />
                            Live Stream
                          </Badge>
                        )}
                        {product.type === 'bulk' && (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            <Package className="mr-1 h-3 w-3" />
                            Bulk Sales
                          </Badge>
                        )}
                        {product.brand && (
                          <Badge variant="secondary">{product.brand}</Badge>
                        )}
                      </div>
                      
                      <div className="space-y-1">
                        {product.type === 'bulk' ? (
                          <>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Retail Price:</span>
                              <span className="font-semibold">₹{(product as any).retail_price}</span>
                            </div>
                            {(product as any).compare_price && (
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Compare Price:</span>
                                <span className="font-semibold text-muted-foreground line-through">₹{(product as any).compare_price}</span>
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Live Price:</span>
                              <span className="font-semibold">₹{(product as any).price}</span>
                            </div>
                            {(product as any).compare_at_price && (
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Compare Price:</span>
                                <span className="text-muted-foreground line-through">₹{(product as any).compare_at_price}</span>
                              </div>
                            )}
                          </>
                        )}
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Stock:</span>
                          <span className={`font-semibold ${(product.stock_quantity || 0) < 10 ? 'text-red-600' : 'text-green-600'}`}>
                            {product.stock_quantity || 0} units
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
    </div>
  );
};

export default ProductCatalogManager;
