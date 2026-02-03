-- Fix 1: CRITICAL - Restrict profiles SELECT policy to only allow viewing own profile
-- This prevents any logged-in user from seeing all other users' personal data
DROP POLICY IF EXISTS "Profiles are viewable by all authenticated users" ON public.profiles;

CREATE POLICY "Users can view their own profile only"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Fix 2: Make moderation_logs immutable (prevent UPDATE/DELETE)
-- Add explicit policies to prevent tampering with audit logs
CREATE POLICY "Moderation logs cannot be updated"
ON public.moderation_logs
FOR UPDATE
TO authenticated
USING (false);

CREATE POLICY "Moderation logs cannot be deleted"
ON public.moderation_logs
FOR DELETE
TO authenticated
USING (false);

-- Fix 3: Make reply_acceptance_history immutable
-- Only system (triggers) should write to this table
CREATE POLICY "Acceptance history cannot be inserted by users"
ON public.reply_acceptance_history
FOR INSERT
TO authenticated
WITH CHECK (false);

CREATE POLICY "Acceptance history cannot be updated"
ON public.reply_acceptance_history
FOR UPDATE
TO authenticated
USING (false);

CREATE POLICY "Acceptance history cannot be deleted"
ON public.reply_acceptance_history
FOR DELETE
TO authenticated
USING (false);

-- Fix 4: Prevent user-initiated notification inserts
CREATE POLICY "Users cannot insert notifications"
ON public.notifications
FOR INSERT
TO authenticated
WITH CHECK (false);