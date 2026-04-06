ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Create storage bucket for avatars
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Set up Row Level Security (RLS) for storage
-- Using a DO block to prevent "already exists" errors if run multiple times
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Avatar images are publicly accessible.'
    ) THEN
        CREATE POLICY "Avatar images are publicly accessible."
        ON storage.objects FOR SELECT
        USING ( bucket_id = 'avatars' );
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Anyone can upload an avatar.'
    ) THEN
        CREATE POLICY "Anyone can upload an avatar."
        ON storage.objects FOR INSERT
        WITH CHECK ( bucket_id = 'avatars' );
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Anyone can update an avatar.'
    ) THEN
        CREATE POLICY "Anyone can update an avatar."
        ON storage.objects FOR UPDATE
        WITH CHECK ( bucket_id = 'avatars' );
    END IF;
END $$;
