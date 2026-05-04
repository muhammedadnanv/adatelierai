
-- Lock down payments: remove permissive public SELECT.
-- Reads will go through an edge function using service_role.
DROP POLICY IF EXISTS "Read payments by access code only" ON public.payments;

-- Defensive: ensure no public INSERT/UPDATE/DELETE policies exist.
-- (No INSERT policy exists today — inserts happen via service role in edge function.)

-- Tighten page_views: keep public INSERT for anonymous tracking, but
-- restrict SELECT to authenticated users only (analytics dashboard
-- can be wrapped in auth, or moved to an edge function later).
DROP POLICY IF EXISTS "Allow public read of page views" ON public.page_views;

CREATE POLICY "Authenticated users can read page views"
ON public.page_views
FOR SELECT
TO authenticated
USING (true);
