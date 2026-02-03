-- Fix CRITICAL: Restrict moderation logs INSERT to actual moderators only
DROP POLICY IF EXISTS "Authenticated users can insert moderation logs" ON public.moderation_logs;

CREATE POLICY "Only moderators can insert moderation logs"
ON public.moderation_logs
FOR INSERT
TO authenticated
WITH CHECK (public.can_moderate(auth.uid()));