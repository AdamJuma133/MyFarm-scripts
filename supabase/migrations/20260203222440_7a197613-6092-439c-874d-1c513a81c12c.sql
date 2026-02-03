-- First remove the duplicate/conflicting profiles SELECT policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile only" ON public.profiles;

-- Create a single clean policy for profiles
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- IMPORTANT: Also allow users to view basic profile info of forum post authors
-- This is needed for the forum to work (showing author names on posts)
-- But we restrict it to only the fields needed
CREATE POLICY "Users can view public profile info"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

-- Note: The above is still too permissive. Let's use a different approach.
-- We'll keep the restrictive policy but the Forum components will need to
-- fetch author info through a join with the posts they can already see.

-- Actually, let's drop the permissive policy and keep only the restrictive one
DROP POLICY IF EXISTS "Users can view public profile info" ON public.profiles;

-- For scan_history, the existing policy is correct (users can only see their own)
-- Just verify by checking if any permissive policies exist - they don't
-- The warning is just advisory, the data is protected

-- For notifications - we need to allow service role to insert via triggers
-- The trigger uses SECURITY DEFINER so it bypasses RLS
-- We should NOT create a user INSERT policy, that's correct behavior
-- But we shouldn't have a DENY policy either - just leave no INSERT policy for users
-- The trigger will work because it's SECURITY DEFINER
DROP POLICY IF EXISTS "Users cannot insert notifications" ON public.notifications;