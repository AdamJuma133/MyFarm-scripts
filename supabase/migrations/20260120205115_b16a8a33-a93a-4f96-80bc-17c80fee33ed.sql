-- Create user roles enum and table for moderator privileges
CREATE TYPE public.app_role AS ENUM ('user', 'moderator', 'admin');

CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    granted_at timestamp with time zone NOT NULL DEFAULT now(),
    granted_by uuid REFERENCES auth.users(id),
    UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to check if user can moderate (moderator, admin, or 100+ reputation)
CREATE OR REPLACE FUNCTION public.can_moderate(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('moderator', 'admin')
  ) OR EXISTS (
    SELECT 1 FROM public.profiles WHERE user_id = _user_id AND reputation_score >= 100
  )
$$;

-- Function to check if user can pin posts (50+ reputation or moderator/admin)
CREATE OR REPLACE FUNCTION public.can_pin_posts(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('moderator', 'admin')
  ) OR EXISTS (
    SELECT 1 FROM public.profiles WHERE user_id = _user_id AND reputation_score >= 50
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view all roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage roles"
ON public.user_roles
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Allow experts to pin posts (update is_pinned)
CREATE POLICY "Experts can pin posts"
ON public.forum_posts
FOR UPDATE
USING (
  public.can_pin_posts(auth.uid())
);

-- Allow moderators to delete any posts
CREATE POLICY "Moderators can delete posts"
ON public.forum_posts
FOR DELETE
USING (
  public.can_moderate(auth.uid())
);

-- Allow moderators to delete any replies
CREATE POLICY "Moderators can delete replies"
ON public.forum_replies
FOR DELETE
USING (
  public.can_moderate(auth.uid())
);

-- Enable pg_cron and pg_net extensions for scheduled tasks
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;