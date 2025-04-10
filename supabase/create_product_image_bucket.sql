
-- Create a storage bucket for product images if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
SELECT 'product-images', 'Product Images', true
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'product-images');

-- Set up policy to allow authenticated users to upload their own product images
CREATE POLICY "Users can upload product images" ON storage.objects
FOR INSERT TO authenticated USING (bucket_id = 'product-images');

-- Set up policy to allow public read access to product images
CREATE POLICY "Public can view product images" ON storage.objects
FOR SELECT USING (bucket_id = 'product-images');

-- Allow authenticated users to update their own images
CREATE POLICY "Users can update their own product images" ON storage.objects
FOR UPDATE TO authenticated USING (
  auth.uid() = owner AND bucket_id = 'product-images'
);

-- Allow authenticated users to delete their own images
CREATE POLICY "Users can delete their own product images" ON storage.objects
FOR DELETE TO authenticated USING (
  auth.uid() = owner AND bucket_id = 'product-images'
);
