
-- Fix 1: forum_posts UPDATE policy has a bug in WITH CHECK
-- forum_replies.post_id = forum_replies.id should be forum_replies.post_id = forum_posts.id
DROP POLICY IF EXISTS "Users can update their own posts" ON public.forum_posts;

CREATE POLICY "Users can update their own posts"
ON public.forum_posts
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (
  (auth.uid() = user_id) AND (
    (is_solved = false) OR (
      EXISTS (
        SELECT 1 FROM forum_replies
        WHERE forum_replies.post_id = forum_posts.id
          AND forum_replies.is_accepted = true
      )
    )
  )
);

-- Fix 2: Remove redundant "Users can view their own profile" SELECT policy
-- since "Authenticated users can view all profiles" already covers it
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
