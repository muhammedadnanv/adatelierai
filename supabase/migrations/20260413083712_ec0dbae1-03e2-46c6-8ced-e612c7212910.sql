
CREATE POLICY "Allow public read of page views"
ON public.page_views
FOR SELECT
TO public
USING (true);
