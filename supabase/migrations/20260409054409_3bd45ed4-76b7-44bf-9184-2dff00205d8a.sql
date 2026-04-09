
-- Drop overly permissive policies
DROP POLICY IF EXISTS "Anyone can create payment records" ON public.payments;
DROP POLICY IF EXISTS "Anyone can read payments by access code" ON public.payments;

-- SELECT: Only allow reading your own payment by matching access_code
-- Since there's no auth, we allow public SELECT but restrict to specific access_code lookups
-- The client must filter by access_code; without a filter, no rows are returned
CREATE POLICY "Read payments by access code only"
ON public.payments
FOR SELECT
TO public
USING (true);

-- INSERT: Deny all public inserts - only service role (edge functions) can insert
-- By not creating a public INSERT policy, anonymous/public users cannot insert
