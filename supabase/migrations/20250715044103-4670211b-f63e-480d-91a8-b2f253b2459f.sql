-- Fix Socialify database to work with Clerk authentication
-- Step 1: Drop all existing RLS policies first

-- Drop existing RLS policies that reference auth.uid()
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can manage their own API keys" ON public.user_api_keys;
DROP POLICY IF EXISTS "Users can manage their own images" ON public.images;
DROP POLICY IF EXISTS "Users can manage their own captions" ON public.captions;
DROP POLICY IF EXISTS "Users can manage their own caption sessions" ON public.caption_sessions;

-- Drop storage policies
DROP POLICY IF EXISTS "Users can upload their own images" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own images" ON storage.objects;

-- Drop the auth.users trigger since we're using Clerk
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();