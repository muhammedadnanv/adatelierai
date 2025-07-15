-- Step 2a: Drop all foreign key constraints that reference user_id

-- Drop foreign key constraints
ALTER TABLE public.user_api_keys DROP CONSTRAINT IF EXISTS user_api_keys_user_id_fkey;
ALTER TABLE public.images DROP CONSTRAINT IF EXISTS images_user_id_fkey;
ALTER TABLE public.captions DROP CONSTRAINT IF EXISTS captions_user_id_fkey;
ALTER TABLE public.caption_sessions DROP CONSTRAINT IF EXISTS caption_sessions_user_id_fkey;

-- Also drop image-related foreign keys temporarily
ALTER TABLE public.captions DROP CONSTRAINT IF EXISTS captions_image_id_fkey;
ALTER TABLE public.caption_sessions DROP CONSTRAINT IF EXISTS caption_sessions_image_id_fkey;