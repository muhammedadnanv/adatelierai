-- Step 2: Update table structure for Clerk user IDs

-- Remove foreign key constraint first
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_user_id_fkey;

-- Update profiles table structure for Clerk users (TEXT instead of UUID)
ALTER TABLE public.profiles ALTER COLUMN user_id TYPE TEXT;

-- Update all foreign key references to use TEXT instead of UUID
ALTER TABLE public.user_api_keys ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE public.images ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE public.captions ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE public.caption_sessions ALTER COLUMN user_id TYPE TEXT;