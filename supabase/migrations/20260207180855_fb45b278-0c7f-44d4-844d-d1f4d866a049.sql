
-- Tighten all public table policies to only allow authenticated users
-- by recreating them with TO authenticated

-- ========== forum_likes ==========
DROP POLICY IF EXISTS "Forum likes are viewable by all authenticated users" ON public.forum_likes;
CREATE POLICY "Forum likes are viewable by all authenticated users"
ON public.forum_likes FOR SELECT TO authenticated
USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can create their own likes" ON public.forum_likes;
CREATE POLICY "Users can create their own likes"
ON public.forum_likes FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own likes" ON public.forum_likes;
CREATE POLICY "Users can delete their own likes"
ON public.forum_likes FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- ========== forum_posts ==========
DROP POLICY IF EXISTS "Forum posts are viewable by all authenticated users" ON public.forum_posts;
CREATE POLICY "Forum posts are viewable by all authenticated users"
ON public.forum_posts FOR SELECT TO authenticated
USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can create their own posts" ON public.forum_posts;
CREATE POLICY "Users can create their own posts"
ON public.forum_posts FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own posts" ON public.forum_posts;
CREATE POLICY "Users can delete their own posts"
ON public.forum_posts FOR DELETE TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own posts" ON public.forum_posts;
CREATE POLICY "Users can update their own posts"
ON public.forum_posts FOR UPDATE TO authenticated
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

DROP POLICY IF EXISTS "Experts can pin posts" ON public.forum_posts;
CREATE POLICY "Experts can pin posts"
ON public.forum_posts FOR UPDATE TO authenticated
USING (can_pin_posts(auth.uid()));

DROP POLICY IF EXISTS "Moderators can delete posts" ON public.forum_posts;
CREATE POLICY "Moderators can delete posts"
ON public.forum_posts FOR DELETE TO authenticated
USING (can_moderate(auth.uid()));

-- ========== forum_replies ==========
DROP POLICY IF EXISTS "Forum replies are viewable by all authenticated users" ON public.forum_replies;
CREATE POLICY "Forum replies are viewable by all authenticated users"
ON public.forum_replies FOR SELECT TO authenticated
USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can create their own replies" ON public.forum_replies;
CREATE POLICY "Users can create their own replies"
ON public.forum_replies FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own replies" ON public.forum_replies;
CREATE POLICY "Users can update their own replies"
ON public.forum_replies FOR UPDATE TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own replies" ON public.forum_replies;
CREATE POLICY "Users can delete their own replies"
ON public.forum_replies FOR DELETE TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Post authors can accept replies" ON public.forum_replies;
CREATE POLICY "Post authors can accept replies"
ON public.forum_replies FOR UPDATE TO authenticated
USING (is_post_author(auth.uid(), post_id))
WITH CHECK (is_post_author(auth.uid(), post_id));

DROP POLICY IF EXISTS "Moderators can delete replies" ON public.forum_replies;
CREATE POLICY "Moderators can delete replies"
ON public.forum_replies FOR DELETE TO authenticated
USING (can_moderate(auth.uid()));

-- ========== moderation_logs ==========
DROP POLICY IF EXISTS "Moderators can view moderation logs" ON public.moderation_logs;
CREATE POLICY "Moderators can view moderation logs"
ON public.moderation_logs FOR SELECT TO authenticated
USING (can_moderate(auth.uid()));

DROP POLICY IF EXISTS "Only moderators can insert moderation logs" ON public.moderation_logs;
CREATE POLICY "Only moderators can insert moderation logs"
ON public.moderation_logs FOR INSERT TO authenticated
WITH CHECK (can_moderate(auth.uid()));

DROP POLICY IF EXISTS "Moderation logs cannot be updated" ON public.moderation_logs;
CREATE POLICY "Moderation logs cannot be updated"
ON public.moderation_logs FOR UPDATE TO authenticated
USING (false);

DROP POLICY IF EXISTS "Moderation logs cannot be deleted" ON public.moderation_logs;
CREATE POLICY "Moderation logs cannot be deleted"
ON public.moderation_logs FOR DELETE TO authenticated
USING (false);

-- ========== notifications ==========
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
CREATE POLICY "Users can view their own notifications"
ON public.notifications FOR SELECT TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
CREATE POLICY "Users can update their own notifications"
ON public.notifications FOR UPDATE TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own notifications" ON public.notifications;
CREATE POLICY "Users can delete their own notifications"
ON public.notifications FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- ========== profiles ==========
DROP POLICY IF EXISTS "Authenticated users can view all profiles" ON public.profiles;
CREATE POLICY "Authenticated users can view all profiles"
ON public.profiles FOR SELECT TO authenticated
USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE TO authenticated
USING (auth.uid() = user_id);

-- ========== reply_acceptance_history ==========
DROP POLICY IF EXISTS "Authenticated users can view acceptance history" ON public.reply_acceptance_history;
CREATE POLICY "Authenticated users can view acceptance history"
ON public.reply_acceptance_history FOR SELECT TO authenticated
USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Acceptance history cannot be inserted by users" ON public.reply_acceptance_history;
CREATE POLICY "Acceptance history cannot be inserted by users"
ON public.reply_acceptance_history FOR INSERT TO authenticated
WITH CHECK (false);

DROP POLICY IF EXISTS "Acceptance history cannot be updated" ON public.reply_acceptance_history;
CREATE POLICY "Acceptance history cannot be updated"
ON public.reply_acceptance_history FOR UPDATE TO authenticated
USING (false);

DROP POLICY IF EXISTS "Acceptance history cannot be deleted" ON public.reply_acceptance_history;
CREATE POLICY "Acceptance history cannot be deleted"
ON public.reply_acceptance_history FOR DELETE TO authenticated
USING (false);

-- ========== reports ==========
DROP POLICY IF EXISTS "Users can create reports" ON public.reports;
CREATE POLICY "Users can create reports"
ON public.reports FOR INSERT TO authenticated
WITH CHECK (auth.uid() = reporter_id);

DROP POLICY IF EXISTS "Users can view their own reports" ON public.reports;
CREATE POLICY "Users can view their own reports"
ON public.reports FOR SELECT TO authenticated
USING (auth.uid() = reporter_id);

DROP POLICY IF EXISTS "Moderators can view all reports" ON public.reports;
CREATE POLICY "Moderators can view all reports"
ON public.reports FOR SELECT TO authenticated
USING (can_moderate(auth.uid()));

DROP POLICY IF EXISTS "Moderators can update reports" ON public.reports;
CREATE POLICY "Moderators can update reports"
ON public.reports FOR UPDATE TO authenticated
USING (can_moderate(auth.uid()));

-- ========== scan_history ==========
DROP POLICY IF EXISTS "Users can view their own scan history" ON public.scan_history;
CREATE POLICY "Users can view their own scan history"
ON public.scan_history FOR SELECT TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own scans" ON public.scan_history;
CREATE POLICY "Users can insert their own scans"
ON public.scan_history FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own scans" ON public.scan_history;
CREATE POLICY "Users can delete their own scans"
ON public.scan_history FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- ========== user_roles ==========
DROP POLICY IF EXISTS "Users can view all roles" ON public.user_roles;
CREATE POLICY "Users can view all roles"
ON public.user_roles FOR SELECT TO authenticated
USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
CREATE POLICY "Admins can manage roles"
ON public.user_roles FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));
