-- Fix overly permissive RLS policies
-- Drop the overly permissive insert policy for moderation_logs
DROP POLICY IF EXISTS "System can insert moderation logs" ON public.moderation_logs;

-- Create a more restrictive policy - only authenticated users can insert (actual enforcement will be in code)
CREATE POLICY "Authenticated users can insert moderation logs"
ON public.moderation_logs
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Also tighten notifications insert policy
DROP POLICY IF EXISTS "System can insert notifications" ON public.notifications;

-- Create policy that allows authenticated users to insert notifications
CREATE POLICY "Authenticated users can insert notifications"
ON public.notifications
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);