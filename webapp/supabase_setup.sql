-- Create a table for public profiles
CREATE TABLE profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  bio TEXT,
  experience_level TEXT
);

-- Set up Row Level Security (RLS)
-- NOTE: For a production app tied to authentication, you would use auth.uid()
-- Since this is an open onboarding flow for demonstration without strict auth,
-- we'll allow public inserts/updates based on the email.
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all profiles
CREATE POLICY "Public profiles are viewable by everyone."
  ON profiles FOR SELECT
  USING ( true );

-- Allow public inserts (useful for the onboarding flow without forced login)
CREATE POLICY "Anyone can insert a profile."
  ON profiles FOR INSERT
  WITH CHECK ( true );

-- Allow updating profiles 
-- (in true production, this would ensure auth.uid() == user_id)
CREATE POLICY "Anyone can update a profile."
  ON profiles FOR UPDATE
  USING ( true );

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Create storage bucket for avatars
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Set up Row Level Security (RLS) for storage
CREATE POLICY "Avatar images are publicly accessible."
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'avatars' );

CREATE POLICY "Anyone can upload an avatar."
  ON storage.objects FOR INSERT
  WITH CHECK ( bucket_id = 'avatars' );

CREATE POLICY "Anyone can update an avatar."
  ON storage.objects FOR UPDATE
  WITH CHECK ( bucket_id = 'avatars' );
