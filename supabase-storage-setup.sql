-- Supabase Storage Setup for CookBook App
-- Run this in your Supabase SQL Editor

-- Create storage bucket for recipe media
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'recipe-media',
  'recipe-media',
  true,
  104857600, -- 100MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'video/ogg']
);

-- Set up storage policies for recipe media
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'recipe-media');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'recipe-media' AND auth.role() = 'authenticated');

-- Allow users to update their own uploads
CREATE POLICY "Users can update own uploads" ON storage.objects FOR UPDATE 
USING (bucket_id = 'recipe-media' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to delete their own uploads
CREATE POLICY "Users can delete own uploads" ON storage.objects FOR DELETE 
USING (bucket_id = 'recipe-media' AND auth.uid()::text = (storage.foldername(name))[1]);

-- For development, allow all operations (remove in production)
CREATE POLICY "Allow all operations for development" ON storage.objects FOR ALL 
USING (bucket_id = 'recipe-media');

-- Create a function to generate unique file names
CREATE OR REPLACE FUNCTION generate_unique_filename(original_name TEXT)
RETURNS TEXT AS $$
DECLARE
  file_ext TEXT;
  unique_name TEXT;
BEGIN
  -- Extract file extension
  file_ext := CASE 
    WHEN original_name LIKE '%.%' THEN '.' || split_part(original_name, '.', -1)
    ELSE ''
  END;
  
  -- Generate unique name with timestamp and random string
  unique_name := 'recipe_' || extract(epoch from now())::TEXT || '_' || 
                 substr(md5(random()::text), 1, 8) || file_ext;
  
  RETURN unique_name;
END;
$$ LANGUAGE plpgsql;
