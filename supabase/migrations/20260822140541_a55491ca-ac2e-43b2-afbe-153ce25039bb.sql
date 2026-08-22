-- Private schema for authorization helpers so they are not exposed via the API
CREATE SCHEMA IF NOT EXISTS app_private;
GRANT USAGE ON SCHEMA app_private TO authenticated, service_role;

CREATE OR REPLACE FUNCTION app_private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION app_private.can_moderate(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('moderator', 'admin')
  ) OR EXISTS (
    SELECT 1 FROM public.profiles WHERE user_id = _user_id AND reputation_score >= 100
  )
$$;

CREATE OR REPLACE FUNCTION app_private.can_pin_posts(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('moderator', 'admin')
  ) OR EXISTS (
    SELECT 1 FROM public.profiles WHERE user_id = _user_id AND reputation_score >= 50
  )
$$;

CREATE OR REPLACE FUNCTION app_private.is_post_author(_user_id uuid, _post_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.forum_posts WHERE id = _post_id AND user_id = _user_id
  )
$$;

REVOKE ALL ON FUNCTION app_private.has_role(uuid, public.app_role) FROM PUBLIC;
REVOKE ALL ON FUNCTION app_private.can_moderate(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION app_private.can_pin_posts(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION app_private.is_post_author(uuid, uuid) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION app_private.has_role(uuid, public.app_role) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION app_private.can_moderate(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION app_private.can_pin_posts(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION app_private.is_post_author(uuid, uuid) TO authenticated, service_role;

-- Repoint every policy at the private helpers
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
CREATE POLICY "Admins can manage roles" ON public.user_roles
FOR ALL TO authenticated
USING (app_private.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (app_private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Experts can pin posts" ON public.forum_posts;
CREATE POLICY "Experts can pin posts" ON public.forum_posts
FOR UPDATE TO authenticated
USING (app_private.can_pin_posts(auth.uid()));

DROP POLICY IF EXISTS "Moderators can delete posts" ON public.forum_posts;
CREATE POLICY "Moderators can delete posts" ON public.forum_posts
FOR DELETE TO authenticated
USING (app_private.can_moderate(auth.uid()));

DROP POLICY IF EXISTS "Moderators can delete replies" ON public.forum_replies;
CREATE POLICY "Moderators can delete replies" ON public.forum_replies
FOR DELETE TO authenticated
USING (app_private.can_moderate(auth.uid()));

DROP POLICY IF EXISTS "Moderators can update reports" ON public.reports;
CREATE POLICY "Moderators can update reports" ON public.reports
FOR UPDATE TO authenticated
USING (app_private.can_moderate(auth.uid()));

DROP POLICY IF EXISTS "Moderators can view all reports" ON public.reports;
CREATE POLICY "Moderators can view all reports" ON public.reports
FOR SELECT TO authenticated
USING (app_private.can_moderate(auth.uid()));

DROP POLICY IF EXISTS "Moderators can view moderation logs" ON public.moderation_logs;
CREATE POLICY "Moderators can view moderation logs" ON public.moderation_logs
FOR SELECT TO authenticated
USING (app_private.can_moderate(auth.uid()));

DROP POLICY IF EXISTS "Post authors can accept replies" ON public.forum_replies;
CREATE POLICY "Post authors can accept replies" ON public.forum_replies
FOR UPDATE TO authenticated
USING (app_private.is_post_author(auth.uid(), post_id))
WITH CHECK (app_private.is_post_author(auth.uid(), post_id));

DROP POLICY IF EXISTS "Only moderators can insert moderation logs" ON public.moderation_logs;
CREATE POLICY "Only moderators can insert moderation logs" ON public.moderation_logs
FOR INSERT TO authenticated
WITH CHECK (app_private.can_moderate(auth.uid()) AND moderator_id = auth.uid());

-- Remove the API-exposed copies
DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);
DROP FUNCTION IF EXISTS public.can_moderate(uuid);
DROP FUNCTION IF EXISTS public.can_pin_posts(uuid);
DROP FUNCTION IF EXISTS public.is_post_author(uuid, uuid);

-- Trigger / cron-only functions must not be directly callable by API roles
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.notify_matching_users() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.increment_reply_count() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_post_replies_count() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_reputation_on_accepted_answer() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.cleanup_stale_device_tokens() FROM PUBLIC, anon, authenticated;