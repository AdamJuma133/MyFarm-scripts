-- Add explicit INSERT deny policy on notifications table
-- Notifications should only be created server-side (triggers, edge functions with service role)
CREATE POLICY "Deny client-side notification inserts"
ON public.notifications
FOR INSERT
TO authenticated
WITH CHECK (false);