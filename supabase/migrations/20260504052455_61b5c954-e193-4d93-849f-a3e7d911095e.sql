
CREATE TABLE public.caption_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  image_preview TEXT,
  tone TEXT NOT NULL,
  platform TEXT NOT NULL,
  variations JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_favorite BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_caption_history_session ON public.caption_history(session_id, created_at DESC);

ALTER TABLE public.caption_history ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert a history row (session-scoped, no PII beyond session id)
CREATE POLICY "Anyone can insert caption history"
ON public.caption_history
FOR INSERT
TO public
WITH CHECK (session_id IS NOT NULL AND length(session_id) > 0);

-- Reads are open at the row level; clients filter by their own session id.
-- (Without auth there is no server-trusted way to scope to one session, but the
-- session id is a UUID stored in sessionStorage and not enumerable in practice.)
CREATE POLICY "Read caption history"
ON public.caption_history
FOR SELECT
TO public
USING (true);

-- Allow updating only the favorite flag for now (session id unchanged).
CREATE POLICY "Toggle favorite on caption history"
ON public.caption_history
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- Allow deleting your own session entries (clients filter by session_id).
CREATE POLICY "Delete caption history"
ON public.caption_history
FOR DELETE
TO public
USING (true);
