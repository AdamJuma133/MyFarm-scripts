-- Fix 1: Add server-side validation for avatar uploads
-- Update avatars bucket with file type and size constraints
UPDATE storage.buckets
SET 
  allowed_mime_types = ARRAY[
    'image/jpeg',
    'image/png', 
    'image/webp',
    'image/gif'
  ],
  file_size_limit = 2097152  -- 2MB in bytes
WHERE id = 'avatars';

-- Fix 2: Prevent reputation gaming via accept/unaccept cycling
-- Create audit table to track first-time acceptance
CREATE TABLE IF NOT EXISTS public.reply_acceptance_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reply_id uuid NOT NULL REFERENCES public.forum_replies(id) ON DELETE CASCADE,
  first_accepted_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(reply_id)
);

-- Enable RLS
ALTER TABLE public.reply_acceptance_history ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view acceptance history (needed for UI)
CREATE POLICY "Authenticated users can view acceptance history"
ON public.reply_acceptance_history
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Update the reputation trigger to only award points once per reply
CREATE OR REPLACE FUNCTION public.update_reputation_on_accepted_answer()
RETURNS TRIGGER AS $$
DECLARE
  already_awarded BOOLEAN;
BEGIN
  IF NEW.is_accepted = true AND (OLD.is_accepted = false OR OLD.is_accepted IS NULL) THEN
    -- Check if this reply was ever accepted before (already awarded)
    SELECT EXISTS(
      SELECT 1 FROM public.reply_acceptance_history WHERE reply_id = NEW.id
    ) INTO already_awarded;
    
    IF NOT already_awarded THEN
      -- Award points only on FIRST acceptance
      UPDATE public.profiles 
      SET reputation_score = reputation_score + 10,
          accepted_answers = accepted_answers + 1
      WHERE user_id = NEW.user_id;
      
      -- Record first acceptance
      INSERT INTO public.reply_acceptance_history (reply_id) VALUES (NEW.id);
    END IF;
  ELSIF NEW.is_accepted = false AND OLD.is_accepted = true THEN
    -- Only deduct points if this was the first acceptance (recorded in history)
    -- This prevents gaining points back on re-acceptance
    IF EXISTS(SELECT 1 FROM public.reply_acceptance_history WHERE reply_id = NEW.id) THEN
      UPDATE public.profiles 
      SET reputation_score = GREATEST(0, reputation_score - 10),
          accepted_answers = GREATEST(0, accepted_answers - 1)
      WHERE user_id = NEW.user_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Fix 3: Require accepted answer for solved status
-- Update the RLS policy to ensure is_solved can only be true if an answer is accepted
DROP POLICY IF EXISTS "Users can update their own posts" ON public.forum_posts;

CREATE POLICY "Users can update their own posts"
ON public.forum_posts
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id AND
  -- Only allow marking solved if an answer is actually accepted, or if not changing is_solved to true
  (is_solved = false OR 
   EXISTS(SELECT 1 FROM public.forum_replies WHERE post_id = id AND is_accepted = true))
);