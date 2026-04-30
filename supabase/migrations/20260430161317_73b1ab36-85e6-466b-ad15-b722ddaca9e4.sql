-- Create private storage bucket for scan images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'scan-images',
  'scan-images',
  false,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- RLS: users can view their own scan images
CREATE POLICY "Users can view their own scan images"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'scan-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- RLS: users can upload their own scan images
CREATE POLICY "Users can upload their own scan images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'scan-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- RLS: users can update their own scan images
CREATE POLICY "Users can update their own scan images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'scan-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- RLS: users can delete their own scan images
CREATE POLICY "Users can delete their own scan images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'scan-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Add storage_path column to scan_history for new bucket-based storage
ALTER TABLE public.scan_history
ADD COLUMN IF NOT EXISTS storage_path TEXT;