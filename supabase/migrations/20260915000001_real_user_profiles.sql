-- ==============================================================================
-- AIDORA Cooperative Platform — Real User Profiles & Address System Migration
-- File: 20260915000001_real_user_profiles.sql
-- Database: PostgreSQL (Supabase)
-- Version: 1.2.0
-- Non-destructive, Idempotent, Production-Safe Migration
-- ==============================================================================

-- 1. EXTEND PROFILES TABLE
ALTER TABLE public.profiles
    ADD COLUMN IF NOT EXISTS dob TEXT,
    ADD COLUMN IF NOT EXISTS gender TEXT,
    ADD COLUMN IF NOT EXISTS locality TEXT,
    ADD COLUMN IF NOT EXISTS state TEXT DEFAULT 'Karnataka',
    ADD COLUMN IF NOT EXISTS pincode TEXT,
    ADD COLUMN IF NOT EXISTS preferred_language TEXT DEFAULT 'en',
    ADD COLUMN IF NOT EXISTS emergency_contact TEXT,
    ADD COLUMN IF NOT EXISTS saved_addresses JSONB NOT NULL DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS is_profile_completed BOOLEAN NOT NULL DEFAULT FALSE;

-- 2. EXTEND WORKERS TABLE
ALTER TABLE public.workers
    ADD COLUMN IF NOT EXISTS dob TEXT,
    ADD COLUMN IF NOT EXISTS gender TEXT,
    ADD COLUMN IF NOT EXISTS email TEXT,
    ADD COLUMN IF NOT EXISTS address TEXT NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS locality TEXT,
    ADD COLUMN IF NOT EXISTS city TEXT NOT NULL DEFAULT 'Bangalore',
    ADD COLUMN IF NOT EXISTS state TEXT NOT NULL DEFAULT 'Karnataka',
    ADD COLUMN IF NOT EXISTS pincode TEXT,
    ADD COLUMN IF NOT EXISTS service_radius_km INT NOT NULL DEFAULT 10,
    ADD COLUMN IF NOT EXISTS languages TEXT[] NOT NULL DEFAULT '{"English", "Hindi"}',
    ADD COLUMN IF NOT EXISTS bio TEXT NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS work_experience TEXT NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS is_profile_completed BOOLEAN NOT NULL DEFAULT FALSE;

-- 3. CREATE STORAGE BUCKET FOR PROFILE PHOTOS
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    ('profile-photos', 'profile-photos', TRUE, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage Policies for profile-photos (Public Read, Authenticated Upload/Update)
DO $$ BEGIN
    CREATE POLICY "Public can view profile photos"
        ON storage.objects FOR SELECT
        USING (bucket_id = 'profile-photos');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Authenticated users can upload profile photos"
        ON storage.objects FOR INSERT
        WITH CHECK (
            bucket_id = 'profile-photos'
            AND (auth.role() = 'authenticated')
        );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Users can update own profile photos"
        ON storage.objects FOR UPDATE
        USING (
            bucket_id = 'profile-photos'
            AND (auth.role() = 'authenticated')
        );
EXCEPTION WHEN duplicate_object THEN null; END $$;
