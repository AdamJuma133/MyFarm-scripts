DROP POLICY IF EXISTS "Users can view all roles" ON public.user_roles;
CREATE POLICY "Users can view own roles or moderators view all" ON public.user_roles FOR SELECT TO authenticated
USING (auth.uid() = user_id OR app_private.can_moderate(auth.uid()));

DROP POLICY IF EXISTS "Authenticated users can view all profiles" ON public.profiles;
CREATE POLICY "Signed-in members can view profiles" ON public.profiles FOR SELECT TO authenticated
USING (auth.uid() IS NOT NULL AND COALESCE((auth.jwt() ->> 'is_anonymous')::boolean, false) = false);

DROP POLICY IF EXISTS "Forum posts are viewable by all authenticated users" ON public.forum_posts;
CREATE POLICY "Forum posts are viewable by signed-in members" ON public.forum_posts FOR SELECT TO authenticated
USING (auth.uid() IS NOT NULL AND COALESCE((auth.jwt() ->> 'is_anonymous')::boolean, false) = false);

DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
CREATE POLICY "Users can list their own avatar files" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);