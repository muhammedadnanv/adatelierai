
-- Create page_views table for analytics tracking
CREATE TABLE public.page_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_path TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  screen_width INTEGER,
  screen_height INTEGER,
  device_type TEXT DEFAULT 'desktop',
  session_id TEXT NOT NULL,
  duration_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (anonymous tracking, no auth required)
CREATE POLICY "Allow public page view inserts"
ON public.page_views
FOR INSERT
TO public
WITH CHECK (true);

-- No public SELECT - analytics data is read via service role only
-- Create index for querying by date and page
CREATE INDEX idx_page_views_created_at ON public.page_views (created_at DESC);
CREATE INDEX idx_page_views_page_path ON public.page_views (page_path);
CREATE INDEX idx_page_views_session ON public.page_views (session_id);
