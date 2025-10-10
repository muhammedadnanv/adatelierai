-- Create table for payment records and access codes
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  razorpay_payment_id TEXT UNIQUE NOT NULL,
  razorpay_order_id TEXT NOT NULL,
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  access_code TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  verified_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert payment records
CREATE POLICY "Anyone can create payment records"
ON public.payments
FOR INSERT
WITH CHECK (true);

-- Create policy to allow anyone to read their own payment by access code
CREATE POLICY "Anyone can read payments by access code"
ON public.payments
FOR SELECT
USING (true);

-- Create index on access_code for faster lookups
CREATE INDEX idx_payments_access_code ON public.payments(access_code);

-- Create index on razorpay_payment_id for faster lookups
CREATE INDEX idx_payments_razorpay_payment_id ON public.payments(razorpay_payment_id);

-- Function to generate secure random access code
CREATE OR REPLACE FUNCTION public.generate_access_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  code TEXT;
  exists BOOLEAN;
BEGIN
  LOOP
    -- Generate a 16-character alphanumeric code (uppercase)
    code := UPPER(SUBSTRING(MD5(RANDOM()::TEXT || CLOCK_TIMESTAMP()::TEXT) FROM 1 FOR 8) || 
                  SUBSTRING(MD5(RANDOM()::TEXT || CLOCK_TIMESTAMP()::TEXT) FROM 1 FOR 8));
    
    -- Format as XXXX-XXXX-XXXX-XXXX
    code := SUBSTRING(code FROM 1 FOR 4) || '-' || 
            SUBSTRING(code FROM 5 FOR 4) || '-' || 
            SUBSTRING(code FROM 9 FOR 4) || '-' || 
            SUBSTRING(code FROM 13 FOR 4);
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM public.payments WHERE access_code = code) INTO exists;
    
    -- Exit loop if code is unique
    EXIT WHEN NOT exists;
  END LOOP;
  
  RETURN code;
END;
$$;
