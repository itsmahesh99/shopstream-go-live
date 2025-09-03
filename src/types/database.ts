// TypeScript interfaces for the complete database schema
// This file should be in src/types/database.ts

export interface DatabaseTables {
  customers: Customer
  wholesalers: Wholesaler
  influencers: Influencer
  products: Product
  cart: CartItem
  orders: Order
  order_items: OrderItem
  queries: Query
  live_sessions: LiveSession
  live_session_products: LiveSessionProduct
}

// =============================================================================
// USER INTERFACES
// =============================================================================

export interface Customer {
  id: string
  user_id: string
  first_name?: string
  last_name?: string
  email: string
  phone?: string
  date_of_birth?: string
  gender?: 'male' | 'female' | 'other'
  
  // Address Information
  address_line_1?: string
  address_line_2?: string
  city?: string
  state?: string
  postal_code?: string
  country?: string
  
  // Preferences
  preferred_language?: string
  notification_preferences?: {
    email: boolean
    sms: boolean
    push: boolean
  }
  
  // Status and Metadata
  is_active?: boolean
  customer_tier?: 'bronze' | 'silver' | 'gold' | 'platinum'
  total_orders?: number
  total_spent?: number
  
  // Timestamps
  created_at?: string
  updated_at?: string
}

export interface Wholesaler {
  id: string
  user_id: string
  business_name: string
  contact_person_name?: string
  email: string
  phone?: string
  
  // Business Information
  business_registration_number?: string
  gst_number?: string
  pan_number?: string
  business_type?: string
  
  // Address Information
  business_address_line_1?: string
  business_address_line_2?: string
  city?: string
  state?: string
  postal_code?: string
  country?: string
  
  // Banking Information
  bank_account_number?: string
  bank_name?: string
  bank_branch?: string
  ifsc_code?: string
  
  // Business Metrics
  total_products?: number
  total_sales?: number
  commission_rate?: number
  
  // Status and Verification
  is_verified?: boolean
  is_active?: boolean
  verification_status?: 'pending' | 'verified' | 'rejected'
  verification_date?: string
  
  // Timestamps
  created_at?: string
  updated_at?: string
}

export interface Influencer {
  id: string
  user_id: string
  first_name?: string
  last_name?: string
  display_name?: string
  email: string
  phone?: string
  
  // Social Media Information
  instagram_handle?: string
  youtube_channel?: string
  tiktok_handle?: string
  followers_count?: number
  
  // Professional Information
  bio?: string
  category?: string
  experience_years?: number
  
  // Live Streaming
  total_live_sessions?: number
  total_viewers?: number
  average_session_duration?: number
  
  // Financial Information
  commission_rate?: number
  total_earnings?: number
  
  // Status and Verification
  is_verified?: boolean
  is_active?: boolean
  verification_status?: 'pending' | 'verified' | 'rejected'
  
  // Timestamps
  created_at?: string
  updated_at?: string
}

// =============================================================================
// PRODUCT INTERFACES
// =============================================================================

export interface Product {
  id: string
  influencer_id: string  // Changed from wholesaler_id to influencer_id
  
  // Basic Product Information
  name: string
  description?: string
  short_description?: string
  sku?: string
  barcode?: string
  
  // Categorization
  category?: string
  subcategory?: string
  brand?: string
  tags?: string[]
  
  // Pricing
  compare_price?: number    // Compare at price for showing discounts
  retail_price: number     // Main selling price
  sale_price?: number
  discount_percentage?: number
  
  // Inventory
  stock_quantity?: number
  min_stock_level?: number
  max_stock_level?: number
  
  // Physical Properties
  weight?: number
  dimensions?: {
    length?: number
    width?: number
    height?: number
  }
  color?: string
  size?: string
  
  // Media
  images?: string[]
  videos?: string[]
  
  // SEO and Marketing
  meta_title?: string
  meta_description?: string
  keywords?: string[]
  
  // Status and Flags
  is_active?: boolean
  is_featured?: boolean
  is_live_streamable?: boolean   // Renamed for clarity
  is_bulk_sale?: boolean         // Added for bulk sales capability
  status?: 'active' | 'inactive' | 'out_of_stock' | 'discontinued'
  
  // Ratings and Reviews
  average_rating?: number
  total_reviews?: number
  total_sales?: number
  
  // Timestamps
  created_at?: string
  updated_at?: string
  
  // Relations (populated when needed)
  influencer?: Influencer  // Changed from wholesaler to influencer
}

// =============================================================================
// CART AND ORDER INTERFACES
// =============================================================================

export interface CartItem {
  id: string
  customer_id: string
  product_id: string
  
  // Cart Details
  quantity: number
  unit_price: number
  total_price?: number // Generated column
  
  // Product Variants
  selected_color?: string
  selected_size?: string
  product_options?: Record<string, any>
  
  // Timestamps
  added_at?: string
  updated_at?: string
  
  // Relations (populated when needed)
  product?: Product
  customer?: Customer
}

export interface Order {
  id: string
  customer_id?: string
  influencer_id?: string
  
  // Order Identification
  order_number: string
  
  // Pricing
  subtotal: number
  tax_amount?: number
  shipping_cost?: number
  discount_amount?: number
  total_amount: number
  
  // Order Status
  status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  payment_status?: 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded'
  
  // Shipping Information
  shipping_address: {
    line_1: string
    line_2?: string
    city: string
    state: string
    postal_code: string
    country: string
  }
  billing_address?: {
    line_1: string
    line_2?: string
    city: string
    state: string
    postal_code: string
    country: string
  }
  shipping_method?: string
  tracking_number?: string
  estimated_delivery_date?: string
  actual_delivery_date?: string
  
  // Payment Information
  payment_method?: string
  payment_reference?: string
  payment_gateway?: string
  
  // Live Stream Connection
  live_session_id?: string
  influencer_commission?: number
  
  // Additional Information
  notes?: string
  internal_notes?: string
  
  // Timestamps
  created_at?: string
  updated_at?: string
  
  // Relations (populated when needed)
  customer?: Customer
  influencer?: Influencer
  order_items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id?: string
  wholesaler_id?: string
  
  // Product Details (snapshot at time of order)
  product_name: string
  product_sku?: string
  selected_color?: string
  selected_size?: string
  
  // Pricing
  quantity: number
  unit_price: number
  total_price?: number // Generated column
  
  // Wholesaler Commission
  wholesaler_commission?: number
  
  // Timestamps
  created_at?: string
  
  // Relations (populated when needed)
  product?: Product
  wholesaler?: Wholesaler
  order?: Order
}

// =============================================================================
// SUPPORT AND LIVE STREAMING INTERFACES
// =============================================================================

export interface Query {
  id: string
  customer_id?: string
  order_id?: string
  
  // Query Details
  subject: string
  message: string
  category?: 'general' | 'order' | 'product' | 'payment' | 'shipping' | 'technical' | 'complaint'
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  
  // Status and Assignment
  status?: 'open' | 'in_progress' | 'resolved' | 'closed' | 'escalated'
  assigned_to?: string
  
  // Communication
  customer_email?: string
  customer_phone?: string
  response?: string
  internal_notes?: string
  
  // Resolution
  resolved_at?: string
  resolution_time_hours?: number
  
  // Timestamps
  created_at?: string
  updated_at?: string
  
  // Relations (populated when needed)
  customer?: Customer
  order?: Order
}

export interface LiveSession {
  id: string
  influencer_id: string
  
  // Session Details
  title: string
  description?: string
  scheduled_start_time?: string
  actual_start_time?: string
  end_time?: string
  duration_minutes?: number
  
  // Session Metrics
  peak_viewers?: number
  total_unique_viewers?: number
  total_products_showcased?: number
  total_sales_generated?: number
  
  // Status
  status?: 'scheduled' | 'live' | 'ended' | 'cancelled'
  
  // Technical Details
  stream_url?: string
  recording_url?: string
  
  // Timestamps
  created_at?: string
  updated_at?: string
  
  // Relations (populated when needed)
  influencer?: Influencer
  products?: LiveSessionProduct[]
}

export interface LiveSessionProduct {
  id: string
  live_session_id: string
  product_id: string
  
  // Display Details
  display_order?: number
  special_price?: number
  is_featured?: boolean
  
  // Performance Metrics
  clicks?: number
  orders_generated?: number
  revenue_generated?: number
  
  // Timestamps
  created_at?: string
  
  // Relations (populated when needed)
  live_session?: LiveSession
  product?: Product
}

// =============================================================================
// API RESPONSE TYPES
// =============================================================================

export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

// =============================================================================
// FORM TYPES FOR FRONTEND
// =============================================================================

export interface CustomerForm {
  first_name: string
  last_name: string
  email: string
  phone?: string
  date_of_birth?: string
  gender?: 'male' | 'female' | 'other'
  address_line_1?: string
  address_line_2?: string
  city?: string
  state?: string
  postal_code?: string
  country?: string
}

export interface WholesalerForm {
  business_name: string
  contact_person_name: string
  email: string
  phone: string
  business_registration_number?: string
  gst_number?: string
  pan_number?: string
  business_type?: string
  business_address_line_1: string
  business_address_line_2?: string
  city: string
  state: string
  postal_code: string
  country?: string
  bank_account_number?: string
  bank_name?: string
  bank_branch?: string
  ifsc_code?: string
}

export interface InfluencerForm {
  first_name: string
  last_name: string
  display_name: string
  email: string
  phone?: string
  instagram_handle?: string
  youtube_channel?: string
  tiktok_handle?: string
  followers_count?: number
  bio?: string
  category?: string
  experience_years?: number
}

export interface ProductForm {
  name: string
  description?: string
  short_description?: string
  sku?: string
  category: string
  subcategory?: string
  brand?: string
  tags?: string[]
  compare_price?: number
  retail_price: number
  sale_price?: number
  stock_quantity: number
  weight?: number
  dimensions?: {
    length?: number
    width?: number
    height?: number
  }
  color?: string
  size?: string
  images?: string[]
  videos?: string[]
  meta_title?: string
  meta_description?: string
  keywords?: string[]
}

export interface CartItemForm {
  product_id: string
  quantity: number
  selected_color?: string
  selected_size?: string
  product_options?: Record<string, any>
}

export interface OrderForm {
  subtotal: number
  tax_amount?: number
  shipping_cost?: number
  discount_amount?: number
  total_amount: number
  shipping_address: {
    line_1: string
    line_2?: string
    city: string
    state: string
    postal_code: string
    country: string
  }
  billing_address?: {
    line_1: string
    line_2?: string
    city: string
    state: string
    postal_code: string
    country: string
  }
  shipping_method?: string
  payment_method: string
  notes?: string
}

export interface QueryForm {
  subject: string
  message: string
  category: 'general' | 'order' | 'product' | 'payment' | 'shipping' | 'technical' | 'complaint'
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  customer_email?: string
  customer_phone?: string
  order_id?: string
}

export interface LiveSessionForm {
  title: string
  description?: string
  scheduled_start_time: string
  product_ids?: string[]
}

// =============================================================================
// UTILITY TYPES
// =============================================================================

export type UserRole = 'customer' | 'influencer' | 'admin'

export interface UserProfile {
  role: UserRole
  profile: Customer | Influencer
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded'
export type QueryStatus = 'open' | 'in_progress' | 'resolved' | 'closed' | 'escalated'
export type LiveSessionStatus = 'scheduled' | 'live' | 'ended' | 'cancelled'
export type VerificationStatus = 'pending' | 'verified' | 'rejected'

// =============================================================================
// SEARCH AND FILTER TYPES
// =============================================================================

export interface ProductFilter {
  category?: string
  subcategory?: string
  brand?: string
  min_price?: number
  max_price?: number
  in_stock?: boolean
  is_featured?: boolean
  search?: string
  sort_by?: 'name' | 'price' | 'created_at' | 'rating'
  sort_order?: 'asc' | 'desc'
}

export interface OrderFilter {
  status?: OrderStatus[]
  payment_status?: PaymentStatus[]
  date_from?: string
  date_to?: string
  customer_id?: string
  influencer_id?: string
  min_amount?: number
  max_amount?: number
}

export interface QueryFilter {
  status?: QueryStatus[]
  category?: string[]
  priority?: string[]
  date_from?: string
  date_to?: string
  customer_id?: string
  assigned_to?: string
}
