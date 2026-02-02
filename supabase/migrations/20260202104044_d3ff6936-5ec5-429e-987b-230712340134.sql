-- Fix 1: Allow all authenticated users to view profiles (needed for forum)
-- The current policy only allows users to view their own profile, breaking forum functionality

CREATE POLICY "Profiles are viewable by all authenticated users"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

-- Fix 2: Drop overly permissive notifications INSERT policy
-- Triggers with SECURITY DEFINER bypass RLS, so client-side INSERT is not needed
-- This prevents any authenticated user from creating notifications for other users

DROP POLICY IF EXISTS "Authenticated users can insert notifications" ON public.notifications;
DROP POLICY IF EXISTS "System can insert notifications" ON public.notifications;