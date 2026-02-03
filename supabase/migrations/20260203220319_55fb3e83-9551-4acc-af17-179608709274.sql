-- Fix 1: Drop the overly permissive notifications INSERT policy
-- Notifications should only be created by triggers (like notify_matching_users)
DROP POLICY IF EXISTS "Authenticated users can insert notifications" ON public.notifications;

-- Fix 2: Update avatar storage policies to require authentication for modifications
-- Drop existing policies first
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;

-- Recreate with proper auth checks
CREATE POLICY "Authenticated users can update their own avatar" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'avatars' AND 
  auth.uid() IS NOT NULL AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Authenticated users can delete their own avatar" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'avatars' AND
  auth.uid() IS NOT NULL AND
  auth.uid()::text = (storage.foldername(name))[1]
);