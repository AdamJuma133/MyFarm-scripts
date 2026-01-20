-- Add email digest preference to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email_digest_enabled boolean NOT NULL DEFAULT true;

-- Create a policy allowing post authors to mark replies as accepted
-- First we need a function to check if user is post author
CREATE OR REPLACE FUNCTION public.is_post_author(_user_id uuid, _post_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.forum_posts
    WHERE id = _post_id
      AND user_id = _user_id
  )
$$;

-- Allow post authors to update is_accepted on replies to their posts
CREATE POLICY "Post authors can accept replies"
ON public.forum_replies
FOR UPDATE
USING (
  public.is_post_author(auth.uid(), post_id)
)
WITH CHECK (
  public.is_post_author(auth.uid(), post_id)
);