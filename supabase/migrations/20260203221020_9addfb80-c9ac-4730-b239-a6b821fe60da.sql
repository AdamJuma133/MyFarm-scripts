-- Fix 1: Drop the overly permissive notifications INSERT policy if it still exists
DROP POLICY IF EXISTS "Authenticated users can insert notifications" ON public.notifications;

-- Fix 2: Add CHECK constraints to limit notification field lengths
-- This prevents DoS via oversized notification payloads
ALTER TABLE public.notifications
ADD CONSTRAINT notifications_title_length CHECK (length(title) <= 200);

ALTER TABLE public.notifications
ADD CONSTRAINT notifications_message_length CHECK (length(message) <= 1000);

ALTER TABLE public.notifications
ADD CONSTRAINT notifications_link_length CHECK (link IS NULL OR length(link) <= 500);