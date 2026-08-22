-- 1. Prevent moderators from attributing moderation actions to another moderator
DROP POLICY IF EXISTS "Only moderators can insert moderation logs" ON public.moderation_logs;
CREATE POLICY "Only moderators can insert moderation logs"
ON public.moderation_logs
FOR INSERT
TO authenticated
WITH CHECK (public.can_moderate(auth.uid()) AND moderator_id = auth.uid());

-- 2. Remove anonymous (public role) access from avatar storage policies
DROP POLICY IF EXISTS "Authenticated users can delete their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;

CREATE POLICY "Users can upload their own avatar"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars' AND (auth.uid())::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatar"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'avatars' AND (auth.uid())::text = (storage.foldername(name))[1])
WITH CHECK (bucket_id = 'avatars' AND (auth.uid())::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own avatar"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'avatars' AND (auth.uid())::text = (storage.foldername(name))[1]);

-- Avatars bucket is public, so avatar URLs keep working without an anonymous RLS policy
CREATE POLICY "Signed-in users can list avatars"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'avatars');

-- 3. Lock down direct execution of SECURITY DEFINER functions.
-- Trigger / cron-only functions: never called directly by clients.
REVOKE ALL ON FUNCTION public.handle_new_user() FROM anon, authenticated;
REVOKE ALL ON FUNCTION public.notify_matching_users() FROM anon, authenticated;
REVOKE ALL ON FUNCTION public.increment_reply_count() FROM anon, authenticated;
REVOKE ALL ON FUNCTION public.update_post_replies_count() FROM anon, authenticated;
REVOKE ALL ON FUNCTION public.update_reputation_on_accepted_answer() FROM anon, authenticated;
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM anon, authenticated;
REVOKE ALL ON FUNCTION public.cleanup_stale_device_tokens() FROM anon, authenticated;

-- Authorization helpers used inside RLS policies: signed-in users only, never anonymous.
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;
REVOKE ALL ON FUNCTION public.can_moderate(uuid) FROM anon;
REVOKE ALL ON FUNCTION public.can_pin_posts(uuid) FROM anon;
REVOKE ALL ON FUNCTION public.is_post_author(uuid, uuid) FROM anon;

GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.can_moderate(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.can_pin_posts(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_post_author(uuid, uuid) TO authenticated, service_role;