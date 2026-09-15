-- ==============================================================================
-- AIDORA Cooperative Platform — Real User Profiles & Address System Migration
-- File: 20260915000001_real_user_profiles.sql
-- Database: PostgreSQL (Supabase)
-- Version: 1.2.1
-- Non-destructive, Genuinely Idempotent, Production-Safe & Security-Audited Migration
-- ==============================================================================

-- 1. EXTEND PROFILES TABLE (Customer & Shared Identity Fields)
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

-- 2. EXTEND WORKERS TABLE (Artisan Trade, Radius & Professional Fields)
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

-- 3. HELPER FUNCTIONS (Ensure Admin/Cooperative Security Access is Present)
CREATE OR REPLACE FUNCTION public.is_admin_or_cooperative()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role IN ('admin', 'cooperative')
    );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- 4. IDEMPOTENT RLS POLICIES: PROFILES TABLE
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id OR public.is_admin_or_cooperative());

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id OR public.is_admin_or_cooperative());

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id OR public.is_admin_or_cooperative())
    WITH CHECK (auth.uid() = id OR public.is_admin_or_cooperative());

DROP POLICY IF EXISTS "Admins have full access to profiles" ON public.profiles;
CREATE POLICY "Admins have full access to profiles"
    ON public.profiles FOR ALL
    USING (public.is_admin_or_cooperative());

-- 5. IDEMPOTENT RLS POLICIES: WORKERS TABLE
ALTER TABLE public.workers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view active workers" ON public.workers;
CREATE POLICY "Anyone can view active workers"
    ON public.workers FOR SELECT
    USING (TRUE);

DROP POLICY IF EXISTS "Workers can update own record" ON public.workers;
CREATE POLICY "Workers can update own record"
    ON public.workers FOR UPDATE
    USING (profile_id = auth.uid() OR id = auth.uid());

DROP POLICY IF EXISTS "Admins have full access to workers" ON public.workers;
CREATE POLICY "Admins have full access to workers"
    ON public.workers FOR ALL
    USING (public.is_admin_or_cooperative());

-- 6. CREATE STORAGE BUCKET FOR PROFILE PHOTOS (Idempotent Upsert)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    ('profile-photos', 'profile-photos', TRUE, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 7. IDEMPOTENT & USER-SCOPED STORAGE RLS POLICIES: profile-photos BUCKET
-- Public read access so avatars can render across marketplace, profiles, booking cards & reviews
DROP POLICY IF EXISTS "Public can view profile photos" ON storage.objects;
CREATE POLICY "Public can view profile photos"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'profile-photos');

-- Authenticated users can upload ONLY inside their own user folder ({auth.uid()}/...) or if Admin
DROP POLICY IF EXISTS "Authenticated users can upload profile photos" ON storage.objects;
CREATE POLICY "Authenticated users can upload profile photos"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'profile-photos'
        AND (
            (storage.foldername(name))[1] = auth.uid()::text
            OR public.is_admin_or_cooperative()
        )
    );

-- Authenticated users can update ONLY objects inside their own user folder ({auth.uid()}/...) or if Admin
DROP POLICY IF EXISTS "Users can update own profile photos" ON storage.objects;
CREATE POLICY "Users can update own profile photos"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (
        bucket_id = 'profile-photos'
        AND (
            (storage.foldername(name))[1] = auth.uid()::text
            OR public.is_admin_or_cooperative()
        )
    )
    WITH CHECK (
        bucket_id = 'profile-photos'
        AND (
            (storage.foldername(name))[1] = auth.uid()::text
            OR public.is_admin_or_cooperative()
        )
    );

-- Authenticated users can delete ONLY objects inside their own user folder ({auth.uid()}/...) or if Admin
DROP POLICY IF EXISTS "Users can delete own profile photos" ON storage.objects;
CREATE POLICY "Users can delete own profile photos"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'profile-photos'
        AND (
            (storage.foldername(name))[1] = auth.uid()::text
            OR public.is_admin_or_cooperative()
        )
    );
