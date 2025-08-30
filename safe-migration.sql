-- Safe Migration Script - Only creates tables that don't exist
-- Run this instead of the complete schema if tables already exist

-- Enable UUID extension (safe to run multiple times)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- SAFE TABLE CREATION - Only creates if table doesn't exist
-- =============================================================================

-- Function to create tables safely
DO $$
BEGIN
    -- 1. Create CUSTOMERS table if it doesn't exist
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'customers') THEN
        CREATE TABLE public.customers (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
            first_name VARCHAR(50),
            last_name VARCHAR(50),
            email VARCHAR(255) NOT NULL,
            phone VARCHAR(20),
            date_of_birth DATE,
            gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
            
            -- Address Information
            address_line_1 TEXT,
            address_line_2 TEXT,
            city VARCHAR(100),
            state VARCHAR(100),
            postal_code VARCHAR(20),
            country VARCHAR(100) DEFAULT 'India',
            
            -- Preferences
            preferred_language VARCHAR(10) DEFAULT 'en',
            notification_preferences JSONB DEFAULT '{"email": true, "sms": false, "push": true}',
            
            -- Status and Metadata
            is_active BOOLEAN DEFAULT true,
            customer_tier VARCHAR(20) DEFAULT 'bronze' CHECK (customer_tier IN ('bronze', 'silver', 'gold', 'platinum')),
            total_orders INTEGER DEFAULT 0,
            total_spent DECIMAL(12,2) DEFAULT 0.00,
            
            -- Timestamps
            created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
        );
        
        RAISE NOTICE 'Created customers table';
    ELSE
        RAISE NOTICE 'customers table already exists, skipping';
    END IF;

    -- 2. Create WHOLESALERS table if it doesn't exist
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'wholesalers') THEN
        CREATE TABLE public.wholesalers (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
            business_name VARCHAR(255) NOT NULL,
            contact_person_name VARCHAR(100),
            email VARCHAR(255) NOT NULL,
            phone VARCHAR(20),
            
            -- Business Information
            business_registration_number VARCHAR(100),
            gst_number VARCHAR(20),
            pan_number VARCHAR(20),
            business_type VARCHAR(50),
            
            -- Address Information
            business_address_line_1 TEXT,
            business_address_line_2 TEXT,
            city VARCHAR(100),
            state VARCHAR(100),
            postal_code VARCHAR(20),
            country VARCHAR(100) DEFAULT 'India',
            
            -- Banking Information
            bank_account_number VARCHAR(50),
            bank_name VARCHAR(100),
            bank_branch VARCHAR(100),
            ifsc_code VARCHAR(20),
            
            -- Business Metrics
            total_products INTEGER DEFAULT 0,
            total_sales DECIMAL(12,2) DEFAULT 0.00,
            commission_rate DECIMAL(5,2) DEFAULT 10.00,
            
            -- Status and Verification
            is_verified BOOLEAN DEFAULT false,
            is_active BOOLEAN DEFAULT true,
            verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
            verification_date TIMESTAMP WITH TIME ZONE,
            
            -- Timestamps
            created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
        );
        
        RAISE NOTICE 'Created wholesalers table';
    ELSE
        RAISE NOTICE 'wholesalers table already exists, skipping';
    END IF;

    -- 3. Create INFLUENCERS table if it doesn't exist
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'influencers') THEN
        CREATE TABLE public.influencers (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
            first_name VARCHAR(50),
            last_name VARCHAR(50),
            display_name VARCHAR(100),
            email VARCHAR(255) NOT NULL,
            phone VARCHAR(20),
            
            -- Social Media Information
            instagram_handle VARCHAR(100),
            youtube_channel VARCHAR(100),
            tiktok_handle VARCHAR(100),
            followers_count INTEGER DEFAULT 0,
            
            -- Professional Information
            bio TEXT,
            category VARCHAR(50),
            experience_years INTEGER DEFAULT 0,
            
            -- Live Streaming
            total_live_sessions INTEGER DEFAULT 0,
            total_viewers INTEGER DEFAULT 0,
            average_session_duration INTEGER DEFAULT 0,
            
            -- Financial Information
            commission_rate DECIMAL(5,2) DEFAULT 15.00,
            total_earnings DECIMAL(12,2) DEFAULT 0.00,
            
            -- Status and Verification
            is_verified BOOLEAN DEFAULT false,
            is_active BOOLEAN DEFAULT true,
            verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
            
            -- Timestamps
            created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
        );
        
        RAISE NOTICE 'Created influencers table';
    ELSE
        RAISE NOTICE 'influencers table already exists, skipping';
    END IF;

END $$;

-- =============================================================================
-- CREATE REMAINING TABLES SAFELY
-- =============================================================================

-- Continue with other tables...
DO $$
BEGIN
    -- 4. Create PRODUCTS table if it doesn't exist
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'products') THEN
        CREATE TABLE public.products (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            wholesaler_id UUID REFERENCES public.wholesalers(id) ON DELETE CASCADE NOT NULL,
            
            -- Basic Product Information
            name VARCHAR(255) NOT NULL,
            description TEXT,
            short_description TEXT,
            sku VARCHAR(100) UNIQUE,
            barcode VARCHAR(100),
            
            -- Categorization
            category VARCHAR(100),
            subcategory VARCHAR(100),
            brand VARCHAR(100),
            tags TEXT[],
            
            -- Pricing
            wholesale_price DECIMAL(10,2) NOT NULL,
            retail_price DECIMAL(10,2) NOT NULL,
            sale_price DECIMAL(10,2),
            discount_percentage DECIMAL(5,2) DEFAULT 0.00,
            
            -- Inventory
            stock_quantity INTEGER DEFAULT 0,
            min_stock_level INTEGER DEFAULT 10,
            max_stock_level INTEGER DEFAULT 1000,
            
            -- Physical Properties
            weight DECIMAL(8,3),
            dimensions JSONB,
            color VARCHAR(50),
            size VARCHAR(50),
            
            -- Media
            images JSONB,
            videos JSONB,
            
            -- SEO and Marketing
            meta_title VARCHAR(255),
            meta_description TEXT,
            keywords TEXT[],
            
            -- Status and Flags
            is_active BOOLEAN DEFAULT true,
            is_featured BOOLEAN DEFAULT false,
            is_live_stream_eligible BOOLEAN DEFAULT true,
            status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'out_of_stock', 'discontinued')),
            
            -- Ratings and Reviews
            average_rating DECIMAL(3,2) DEFAULT 0.00,
            total_reviews INTEGER DEFAULT 0,
            total_sales INTEGER DEFAULT 0,
            
            -- Timestamps
            created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
        );
        
        RAISE NOTICE 'Created products table';
    ELSE
        RAISE NOTICE 'products table already exists, skipping';
    END IF;

    -- Continue with other core tables...
    -- Add remaining tables here following the same pattern
    
END $$;
