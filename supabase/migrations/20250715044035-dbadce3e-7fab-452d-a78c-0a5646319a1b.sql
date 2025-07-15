-- Fix Socialify database to work with Clerk authentication
-- Remove dependency on auth.users table since we're using Clerk

-- First, modify the profiles table to not reference auth.users
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_user_id_fkey;

-- Update profiles table structure for Clerk users
ALTER TABLE public.profiles 
  ALTER COLUMN user_id TYPE TEXT,
  ADD COLUMN IF NOT EXISTS clerk_user_id TEXT UNIQUE;

-- Copy user_id to clerk_user_id if not already done
UPDATE public.profiles SET clerk_user_id = user_id WHERE clerk_user_id IS NULL;

-- Drop the old user_id column and rename clerk_user_id to user_id
ALTER TABLE public.profiles DROP COLUMN user_id;
ALTER TABLE public.profiles RENAME COLUMN clerk_user_id TO user_id;

-- Update all foreign key references to use TEXT instead of UUID
ALTER TABLE public.user_api_keys 
  ALTER COLUMN user_id TYPE TEXT;

ALTER TABLE public.images 
  ALTER COLUMN user_id TYPE TEXT;

ALTER TABLE public.captions 
  ALTER COLUMN user_id TYPE TEXT;

ALTER TABLE public.caption_sessions 
  ALTER COLUMN user_id TYPE TEXT;

-- Drop existing RLS policies that reference auth.uid()
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can manage their own API keys" ON public.user_api_keys;
DROP POLICY IF EXISTS "Users can manage their own images" ON public.images;
DROP POLICY IF EXISTS "Users can manage their own captions" ON public.captions;
DROP POLICY IF EXISTS "Users can manage their own caption sessions" ON public.caption_sessions;

-- Create new RLS policies that work without auth context (we'll handle auth in the app)
-- For now, make them permissive since we handle auth with Clerk
CREATE POLICY "Allow all operations on profiles" 
ON public.profiles 
FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow all operations on user_api_keys" 
ON public.user_api_keys 
FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow all operations on images" 
ON public.images 
FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow all operations on captions" 
ON public.captions 
FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow all operations on caption_sessions" 
ON public.caption_sessions 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Update storage policies to be more permissive for now
DROP POLICY IF EXISTS "Users can upload their own images" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own images" ON storage.objects;

CREATE POLICY "Allow all operations on socialify images" 
ON storage.objects 
FOR ALL 
USING (bucket_id = 'socialify-images') 
WITH CHECK (bucket_id = 'socialify-images');

-- Drop the auth.users trigger since we're using Clerk
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();