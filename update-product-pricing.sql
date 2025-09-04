-- ===============================================================================
-- UPDATE PRODUCT PRICING SCHEMA
-- Remove wholesale_price column and add compare_price column
-- ===============================================================================

-- Add compare_price column to products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS compare_price DECIMAL(10,2);

-- Copy any existing wholesale_price data to compare_price if needed
-- (This step is optional and can be customized based on business logic)
UPDATE public.products 
SET compare_price = wholesale_price 
WHERE wholesale_price IS NOT NULL AND compare_price IS NULL;

-- Drop the wholesale_price column
ALTER TABLE public.products 
DROP COLUMN IF EXISTS wholesale_price;

-- Add a comment to the compare_price column
COMMENT ON COLUMN public.products.compare_price IS 'Compare at price for showing discounts - typically the original or MSRP price';

-- Update any existing functions or views that might reference wholesale_price
-- (Add any custom business logic here if needed)

COMMIT;
