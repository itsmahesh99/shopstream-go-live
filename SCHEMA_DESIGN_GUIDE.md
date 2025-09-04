# ShopStream Final Database Schema Design Guide

## Overview
This document outlines the final consolidated database schema design for ShopStream, an e-commerce platform that integrates live selling capabilities with traditional wholesale operations.

## Architecture Philosophy

### Multi-User System
The platform supports four distinct user types:
- **Customers**: End consumers who purchase products
- **Wholesalers**: Suppliers who manage bulk inventory 
- **Influencers**: Content creators who host live selling sessions
- **Admin Users**: Platform administrators and support staff

### Streamlined Product Architecture
The system implements an optimized dual product model:

#### 1. Wholesale Products (`products` table)
- **Purpose**: Traditional e-commerce catalog with bulk inventory
- **Management**: Controlled by wholesalers
- **Characteristics**: 
  - Large stock quantities
  - Stable pricing
  - Always available in catalog
  - Standard e-commerce features

#### 2. Live Products (`live_products` table)  
- **Purpose**: Limited-time offerings during live streams
- **Management**: Curated by influencers
- **Characteristics**:
  - Small, limited stock quantities
  - Dynamic pricing with flash sales
  - Time-sensitive availability
  - Enhanced engagement tracking
  - **STREAMLINED**: Single table replaces previous redundant tables

### Integration Strategy
Both product types integrate seamlessly through:
- **Unified Cart System**: Customers can add both wholesale and live products
- **Consolidated Orders**: Single checkout process for mixed product types
- **Shared Categories**: Common categorization system
- **Cross-Reference Links**: Live products can reference wholesale products as source
- **Optimized Architecture**: Eliminated redundant `live_session_products` and `live_stream_products` tables

## Key Design Decisions

### 1. Streamlined Live Product Architecture
**Problem**: Previous schema had redundant tables (`live_session_products`, `live_stream_products`, `live_products`)
**Solution**: Consolidated into single `live_products` table with session references
**Benefits**:
- Reduced complexity
- Better performance
- Easier maintenance
- Cleaner relationships

### 2. Dual Product Support in Commerce
**Implementation**: Cart and order items support both product types through nullable foreign keys
```sql
-- Cart can reference either product type
cart (
  product_id UUID REFERENCES products(id),
  live_product_id UUID REFERENCES live_products(id),
  CHECK ((product_id IS NOT NULL AND live_product_id IS NULL) OR 
         (product_id IS NULL AND live_product_id IS NOT NULL))
)
```

### 3. Comprehensive Influencer Dashboard
**Features**:
- **Achievements**: Gamification system with progress tracking
- **Goals**: Time-based targets (weekly/monthly/quarterly)
- **Earnings**: Detailed commission and payment tracking
- **Analytics**: Performance metrics and insights
- **Notifications**: Real-time alerts and updates

### 4. Scalable Live Streaming System
**Components**:
- **Sessions**: Core streaming functionality with 100ms integration
- **Viewers**: Individual viewer tracking for analytics
- **Chat**: Real-time messaging system
- **Analytics**: Time-based performance aggregation

## Database Structure

### Core Tables (18 Total)

#### User Management (4 tables)
- `customers` - Customer profiles and preferences
- `wholesalers` - Business information and verification
- `influencers` - Creator profiles and metrics
- `admin_users` - Administrative access control

#### Product System (3 tables)
- `categories` - Hierarchical product categorization
- `products` - Wholesale inventory catalog
- `live_products` - Live stream limited offerings

#### Commerce System (4 tables)
- `cart` - Shopping cart with dual product support
- `orders` - Unified order management
- `order_items` - Line items with product type flexibility
- `queries` - Customer support system

#### Live Streaming (3 tables)
- `live_stream_sessions` - Core streaming functionality
- `live_stream_viewers` - Viewer tracking and analytics
- `live_stream_chat` - Real-time messaging

#### Influencer Dashboard (4 tables)
- `influencer_achievements` - Gamification system
- `influencer_goals` - Target tracking
- `influencer_earnings` - Commission management
- `influencer_notifications` - Alert system

## Performance Optimizations

### Indexing Strategy
- **User lookups**: Indexed on user_id for all profile tables
- **Product searches**: Category, status, and text search indexes
- **Commerce queries**: Customer, order, and date-based indexes
- **Live streaming**: Session, viewer, and time-based indexes
- **Analytics**: Influencer and period-based indexes

### Row Level Security (RLS)
- **User isolation**: Users can only access their own data
- **Product visibility**: Public read access for active products
- **Order privacy**: Customers see only their orders
- **Influencer data**: Dashboard data restricted to owner
- **Admin access**: Controlled through role-based policies

### Automated Triggers
- **Timestamps**: Auto-update `updated_at` fields
- **Order numbers**: Auto-generate unique order identifiers
- **Session codes**: Auto-generate live stream session codes
- **Metrics**: Real-time updates for viewer counts and analytics

## Integration Points

### Supabase Integration
- **Authentication**: Links to `auth.users` table
- **Real-time**: Optimized for Supabase real-time subscriptions
- **RLS**: Native Supabase Row Level Security
- **Functions**: PostgreSQL functions for business logic

### 100ms Live Streaming
- **Room management**: Session codes and room IDs
- **Viewer tracking**: Real-time viewer join/leave events
- **Quality metrics**: Connection and streaming quality data

### Payment Processing
- **Order tracking**: Payment status and reference fields
- **Commission calculation**: Automated influencer earnings
- **Refund handling**: Status tracking for returns

## Migration Strategy

### From Previous Schema
1. **Drop redundant tables**: Remove `live_session_products` and `live_stream_products`
2. **Update references**: Modify queries to use `live_products` table
3. **Add constraints**: Implement dual product support in cart/orders
4. **Update indexes**: Optimize for new table structure
5. **Migrate data**: Transfer existing data to consolidated tables

### Fresh Installation
1. Run `final-consolidated-schema.sql`
2. Run `final-schema-indexes-triggers.sql`
3. Optionally run `sample-data-and-queries.sql`

## Security Considerations

### Data Protection
- **PII encryption**: Sensitive customer data protection
- **Payment security**: No direct payment data storage
- **Admin access**: Role-based permission system
- **API security**: RLS policies prevent unauthorized access

### Business Logic Security
- **Stock validation**: Prevent overselling through constraints
- **Price integrity**: Audit trails for price changes
- **Commission accuracy**: Automated calculation prevents manipulation
- **Session security**: Secure live stream access control

## Scalability Features

### Horizontal Scaling
- **Partitioning ready**: Time-based partitioning for analytics tables
- **Read replicas**: Optimized for read-heavy workloads
- **Caching friendly**: Structured for Redis/Memcached integration

### Performance Monitoring
- **Query optimization**: Comprehensive indexing strategy
- **Connection pooling**: Efficient database connection management
- **Monitoring hooks**: Built-in performance tracking points

## Future Enhancements

### Planned Features
- **Multi-language support**: Internationalization fields
- **Advanced analytics**: Machine learning integration points
- **Mobile optimization**: App-specific performance tuning
- **Third-party integrations**: Extensible webhook system

### Scalability Roadmap
- **Microservices**: Service-oriented architecture support
- **Event sourcing**: Audit trail and event replay capabilities
- **Global distribution**: Multi-region deployment support
- **Real-time sync**: Cross-platform data synchronization

This schema provides a solid foundation for a modern e-commerce platform with live selling capabilities, optimized for performance, security, and scalability.