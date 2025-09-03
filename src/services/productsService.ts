import { supabase } from '@/lib/supabase';

export interface Product {
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
  influencer_id: string;
  created_at?: string;
  updated_at?: string;
  // Join data
  category?: {
    id: string;
    name: string;
  };
  influencer?: {
    id: string;
    display_name?: string;
    first_name?: string;
    user_id: string;
  };
}

export interface LiveProduct {
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
  influencer_id: string;
  created_at?: string;
  updated_at?: string;
  // Join data
  category?: {
    id: string;
    name: string;
  };
  influencer?: {
    id: string;
    display_name?: string;
    first_name?: string;
    user_id: string;
  };
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export class ProductsService {
  // Get all active products with category and influencer info
  static async getProducts(limit?: number): Promise<Product[]> {
    try {
      let query = supabase
        .from('products')
        .select(`
          *,
          category:categories(id, name),
          influencer:influencers(id, display_name, first_name, user_id)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Products service error:', error);
      throw error;
    }
  }

  // Get products by category
  static async getProductsByCategory(categoryId: string, limit?: number): Promise<Product[]> {
    try {
      let query = supabase
        .from('products')
        .select(`
          *,
          category:categories(id, name),
          influencer:influencers(id, display_name, first_name, user_id)
        `)
        .eq('is_active', true)
        .eq('category_id', categoryId)
        .order('created_at', { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching products by category:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Products by category service error:', error);
      throw error;
    }
  }

  // Get live products (for live streaming)
  static async getLiveProducts(limit?: number): Promise<LiveProduct[]> {
    try {
      let query = supabase
        .from('live_products')
        .select(`
          *,
          category:categories(id, name),
          influencer:influencers(id, display_name, first_name, user_id)
        `)
        .eq('status', 'available')
        .order('created_at', { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching live products:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Live products service error:', error);
      throw error;
    }
  }

  // Get all categories
  static async getCategories(): Promise<Category[]> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching categories:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Categories service error:', error);
      throw error;
    }
  }

  // Search products
  static async searchProducts(searchTerm: string, limit?: number): Promise<Product[]> {
    try {
      let query = supabase
        .from('products')
        .select(`
          *,
          category:categories(id, name),
          influencer:influencers(id, display_name, first_name, user_id)
        `)
        .eq('is_active', true)
        .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,brand.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error searching products:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Product search service error:', error);
      throw error;
    }
  }

  // Get featured products (example: recent or popular products)
  static async getFeaturedProducts(limit = 8): Promise<Product[]> {
    try {
      console.log('Fetching featured products from database...');
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(id, name),
          influencer:influencers(id, display_name, first_name, user_id)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching featured products:', error);
        throw error;
      }

      console.log('Featured products fetched:', data?.length || 0, 'products');
      return data || [];
    } catch (error) {
      console.error('Featured products service error:', error);
      throw error;
    }
  }
}
