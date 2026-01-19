-- Create notifications table for personalized alerts
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  type TEXT NOT NULL DEFAULT 'forum_post',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  related_post_id UUID REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can only see their own notifications
CREATE POLICY "Users can view their own notifications"
ON public.notifications
FOR SELECT
USING (auth.uid() = user_id);

-- System can insert notifications for any user (via trigger)
CREATE POLICY "System can insert notifications"
ON public.notifications
FOR INSERT
WITH CHECK (true);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update their own notifications"
ON public.notifications
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own notifications
CREATE POLICY "Users can delete their own notifications"
ON public.notifications
FOR DELETE
USING (auth.uid() = user_id);

-- Add reputation columns to profiles for expert badges
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS reputation_score INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS accepted_answers INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_replies INTEGER NOT NULL DEFAULT 0;

-- Function to update reputation when reply is accepted
CREATE OR REPLACE FUNCTION public.update_reputation_on_accepted_answer()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_accepted = true AND (OLD.is_accepted = false OR OLD.is_accepted IS NULL) THEN
    -- Give 10 points for accepted answer
    UPDATE public.profiles 
    SET reputation_score = reputation_score + 10,
        accepted_answers = accepted_answers + 1
    WHERE user_id = NEW.user_id;
  ELSIF NEW.is_accepted = false AND OLD.is_accepted = true THEN
    -- Remove points if answer is unaccepted
    UPDATE public.profiles 
    SET reputation_score = GREATEST(0, reputation_score - 10),
        accepted_answers = GREATEST(0, accepted_answers - 1)
    WHERE user_id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trigger_update_reputation_accepted
AFTER UPDATE ON public.forum_replies
FOR EACH ROW
EXECUTE FUNCTION public.update_reputation_on_accepted_answer();

-- Function to increment reply count when user posts
CREATE OR REPLACE FUNCTION public.increment_reply_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles 
  SET total_replies = total_replies + 1,
      reputation_score = reputation_score + 1
  WHERE user_id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trigger_increment_replies
AFTER INSERT ON public.forum_replies
FOR EACH ROW
EXECUTE FUNCTION public.increment_reply_count();

-- Function to notify users when forum post matches their crops
CREATE OR REPLACE FUNCTION public.notify_matching_users()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert notifications for users whose crops match the new post's crop_type
  INSERT INTO public.notifications (user_id, type, title, message, link, related_post_id)
  SELECT DISTINCT p.user_id, 'forum_post', 
    'New question about ' || COALESCE(NEW.crop_type, 'your crops'),
    LEFT(NEW.title, 100),
    '/forum',
    NEW.id
  FROM public.profiles p
  WHERE p.user_id != NEW.user_id  -- Don't notify the post author
    AND NEW.crop_type IS NOT NULL
    AND NEW.crop_type = ANY(p.primary_crops);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trigger_notify_matching_users
AFTER INSERT ON public.forum_posts
FOR EACH ROW
EXECUTE FUNCTION public.notify_matching_users();

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;