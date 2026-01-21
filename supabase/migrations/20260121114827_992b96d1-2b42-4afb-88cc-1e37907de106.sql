-- Create moderation_logs table to track all moderator actions
CREATE TABLE public.moderation_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  moderator_id UUID NOT NULL,
  action_type TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id UUID NOT NULL,
  target_user_id UUID,
  reason TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on moderation_logs
ALTER TABLE public.moderation_logs ENABLE ROW LEVEL SECURITY;

-- Moderators and admins can view logs
CREATE POLICY "Moderators can view moderation logs"
ON public.moderation_logs
FOR SELECT
USING (can_moderate(auth.uid()));

-- System can insert logs (will be done via service role or edge function)
CREATE POLICY "System can insert moderation logs"
ON public.moderation_logs
FOR INSERT
WITH CHECK (true);

-- Create reports table for flagged content
CREATE TABLE public.reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID NOT NULL,
  target_type TEXT NOT NULL,
  target_id UUID NOT NULL,
  reason TEXT NOT NULL,
  details TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  reviewed_by UUID,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  resolution_note TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on reports
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Users can create reports
CREATE POLICY "Users can create reports"
ON public.reports
FOR INSERT
WITH CHECK (auth.uid() = reporter_id);

-- Users can view their own reports
CREATE POLICY "Users can view their own reports"
ON public.reports
FOR SELECT
USING (auth.uid() = reporter_id);

-- Moderators can view all reports
CREATE POLICY "Moderators can view all reports"
ON public.reports
FOR SELECT
USING (can_moderate(auth.uid()));

-- Moderators can update reports
CREATE POLICY "Moderators can update reports"
ON public.reports
FOR UPDATE
USING (can_moderate(auth.uid()));

-- Create index for faster queries
CREATE INDEX idx_moderation_logs_created_at ON public.moderation_logs(created_at DESC);
CREATE INDEX idx_moderation_logs_moderator_id ON public.moderation_logs(moderator_id);
CREATE INDEX idx_reports_status ON public.reports(status);
CREATE INDEX idx_reports_created_at ON public.reports(created_at DESC);