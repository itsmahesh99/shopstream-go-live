# 🗃️ Complete Database Schema Documentation

## Overview

This document describes the complete database schema for the Kein Shopstream e-commerce platform with live streaming features. The schema is designed to support:

- **Multi-user types**: Customers, Wholesalers, and Influencers
- **E-commerce functionality**: Products, Cart, Orders, Payments
- **Live streaming**: Live sessions with product showcasing
- **Customer support**: Query/ticket management system

## 🏗️ Architecture

### Authentication Layer
- Uses **Supabase Auth** (`auth.users` table) for user authentication
- All user types (customers, wholesalers, influencers) link to `auth.users` via `user_id`

### Data Layer
- **10 main tables** with proper relationships
- **Row Level Security (RLS)** enabled on all tables
- **Automatic triggers** for timestamps and business logic
- **Indexes** for optimal performance

## 📋 Table Structure

### 1. User Tables

#### `customers`
**Purpose**: Stores customer information and shopping preferences
```sql
Key Fields:
- user_id → auth.users(id)
- personal info (name, email, phone, address)
- preferences (language, notifications)
- metrics (total_orders, total_spent, customer_tier)
```

#### `wholesalers` 
**Purpose**: Stores supplier/vendor business information
```sql
Key Fields:
- user_id → auth.users(id)
- business info (name, registration, GST, PAN)
- banking details (account, IFSC)
- verification status and metrics
```

#### `influencers`
**Purpose**: Stores influencer profiles for live streaming
```sql
Key Fields:
- user_id → auth.users(id)
- social media handles (Instagram, YouTube, TikTok)
- performance metrics (followers, sessions, earnings)
- commission rates and verification status
```

### 2. Product Tables

#### `products`
**Purpose**: Complete product catalog with inventory management
```sql
Key Fields:
- wholesaler_id → wholesalers(id)
- product details (name, description, SKU, category)
- pricing (wholesale, retail, sale prices)
- inventory (stock levels, dimensions, weight)
- media (images, videos)
- SEO fields and ratings
```

### 3. Shopping Tables

#### `cart`
**Purpose**: Customer shopping cart with product variants
```sql
Key Fields:
- customer_id → customers(id)
- product_id → products(id)
- quantity, pricing, selected variants
- Unique constraint prevents duplicates
```

#### `orders`
**Purpose**: Customer orders with complete transaction details
```sql
Key Fields:
- customer_id → customers(id)
- influencer_id → influencers(id) [optional]
- auto-generated order_number
- pricing breakdown (subtotal, tax, shipping, discounts)
- shipping and billing addresses (JSONB)
- status tracking and payment info
```

#### `order_items`
**Purpose**: Individual items within each order
```sql
Key Fields:
- order_id → orders(id)
- product_id → products(id)
- product snapshot (name, SKU, variants)
- pricing and wholesaler commission
```

### 4. Support Table

#### `queries`
**Purpose**: Customer support tickets and communication
```sql
Key Fields:
- customer_id → customers(id)
- order_id → orders(id) [optional]
- categorized support requests
- status tracking and resolution metrics
- assignment and response handling
```

### 5. Live Streaming Tables

#### `live_sessions`
**Purpose**: Live streaming sessions by influencers
```sql
Key Fields:
- influencer_id → influencers(id)
- session scheduling and timing
- viewer metrics and performance data
- technical details (stream URLs)
```

#### `live_session_products`
**Purpose**: Products featured in live sessions
```sql
Key Fields:
- live_session_id → live_sessions(id)
- product_id → products(id)
- special pricing and display order
- performance tracking (clicks, orders, revenue)
```

## 🔐 Security & Permissions

### Row Level Security (RLS)
All tables have RLS enabled with appropriate policies:

- **Customers**: Can only access their own data
- **Wholesalers**: Can manage their own products and view relevant orders
- **Influencers**: Can manage their own live sessions and products
- **Products**: Public read access, owner write access
- **Orders**: Customers see their orders, wholesalers see relevant orders

### Data Privacy
- Sensitive data (banking info, personal details) protected by RLS
- Automatic user profile creation on signup
- Secure relationship management between tables

## ⚡ Performance Features

### Indexes
Strategic indexes on:
- Foreign key relationships
- Frequently queried fields (email, status, dates)
- Search fields (product categories, SKU)

### Triggers
Automatic handling of:
- `updated_at` timestamps
- Order number generation
- Customer statistics updates
- Business metrics calculations

### Views
Pre-built views for common queries:
- `customer_order_summary`
- `wholesaler_product_summary`

## 🚀 Usage Instructions

### 1. Database Setup
```sql
-- Run the complete schema
\i complete-database-schema.sql
```

### 2. TypeScript Integration
```typescript
import { Customer, Product, Order } from '@/types/database'
import { supabase } from '@/lib/supabase'

// Type-safe database operations
const { data: products } = await supabase
  .from('products')
  .select('*')
  .eq('is_active', true)
```

### 3. Common Operations

#### Create Customer Profile
```typescript
const { data, error } = await supabase
  .from('customers')
  .insert({
    user_id: user.id,
    first_name: 'John',
    last_name: 'Doe',
    email: user.email
  })
```

#### Add Product to Cart
```typescript
const { data, error } = await supabase
  .from('cart')
  .upsert({
    customer_id: customerId,
    product_id: productId,
    quantity: 2,
    unit_price: product.retail_price
  })
```

#### Create Order
```typescript
const { data, error } = await supabase
  .from('orders')
  .insert({
    customer_id: customerId,
    subtotal: 100.00,
    total_amount: 110.00,
    shipping_address: addressData,
    status: 'pending'
  })
```

## 📊 Business Logic

### User Roles
- **Customer**: Browse, cart, order, support queries
- **Wholesaler**: Product management, order fulfillment, sales analytics
- **Influencer**: Live sessions, product promotion, commission tracking

### Order Flow
1. Customer adds products to cart
2. Checkout creates order and order_items
3. Payment processing updates payment_status
4. Order fulfillment updates status
5. Delivery completion triggers customer stats update

### Live Streaming Flow
1. Influencer schedules live session
2. Products are added to session
3. Live session goes live
4. Orders track influencer_id for commission
5. Performance metrics are updated

### Commission System
- **Wholesalers**: Earn based on product sales
- **Influencers**: Earn commission on orders from their live sessions
- **Platform**: Takes percentage from both wholesaler and influencer commissions

## 🔧 Maintenance

### Regular Tasks
- Update customer tiers based on spending
- Archive old orders and sessions
- Clean up abandoned cart items
- Generate business reports

### Monitoring
- Track inventory levels
- Monitor order processing times
- Analyze live session performance
- Customer support response times

## 📈 Scalability

### Current Capacity
- Handles thousands of products
- Supports concurrent live sessions
- Efficient querying with proper indexing

### Future Enhancements
- Product reviews and ratings table
- Wishlist functionality
- Advanced analytics tables
- Multi-language content support
- Return/refund management

## 🎯 Next Steps

1. **Run the schema** in your Supabase project
2. **Update your .env.local** with database credentials
3. **Test the connections** using the test page
4. **Implement user onboarding** flows for each user type
5. **Build the core features** using the TypeScript interfaces

---

This schema provides a solid foundation for your e-commerce platform with live streaming features. All relationships are properly defined, security is handled, and the structure supports future growth and feature additions.
