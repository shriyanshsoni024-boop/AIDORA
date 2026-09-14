-- ==============================================================================
-- AIDORA Cooperative Platform — Master Database Schema & Security Definition
-- Database: PostgreSQL (Supabase)
-- Version: 1.1.0
-- Architecture: Multi-Tenant Indian Consumer Services Cooperative
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUMS
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('customer', 'worker', 'admin', 'cooperative');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE booking_status AS ENUM (
        'REQUESTED',
        'MATCHED',
        'ACCEPTED',
        'ON_THE_WAY',
        'IN_PROGRESS',
        'COMPLETED',
        'CANCELLED'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE verification_status AS ENUM (
        'PENDING',
        'UNDER_REVIEW',
        'VERIFIED',
        'REJECTED'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE worker_availability AS ENUM (
        'AVAILABLE',
        'BUSY',
        'NOT_AVAILABLE'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE service_tier AS ENUM ('SMALL', 'MEDIUM', 'LARGE');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE urgency_level AS ENUM ('NORMAL', 'EMERGENCY');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 3. UTILITY FUNCTIONS
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. CORE TABLES

-- 4.1 PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'customer',
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    avatar_url TEXT,
    address TEXT NOT NULL DEFAULT '',
    city TEXT NOT NULL DEFAULT 'Bangalore',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 4.2 WORKERS
CREATE TABLE IF NOT EXISTS public.workers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    name_hi TEXT,
    phone TEXT NOT NULL,
    avatar TEXT,
    trade TEXT NOT NULL,
    professions TEXT[] NOT NULL DEFAULT '{}',
    skills TEXT[] NOT NULL DEFAULT '{}',
    experience_years INT NOT NULL DEFAULT 1,
    experience_level TEXT NOT NULL DEFAULT 'Intermediate' CHECK (experience_level IN ('Beginner', 'Intermediate', 'Advanced')),
    rating NUMERIC(3, 2) NOT NULL DEFAULT 5.00 CHECK (rating >= 0 AND rating <= 5.00),
    review_count INT NOT NULL DEFAULT 0,
    completed_jobs INT NOT NULL DEFAULT 0,
    distance_km NUMERIC(4, 1) NOT NULL DEFAULT 1.0,
    availability worker_availability NOT NULL DEFAULT 'AVAILABLE',
    emergency_ready BOOLEAN NOT NULL DEFAULT FALSE,
    verification_status verification_status NOT NULL DEFAULT 'PENDING',
    cooperative_branch TEXT NOT NULL DEFAULT 'AIDORA Central Federation',
    zone TEXT NOT NULL DEFAULT 'Indiranagar / East Bangalore',
    aadhaar_masked TEXT,
    pan_masked TEXT,
    certificates_data JSONB NOT NULL DEFAULT '[]'::jsonb,
    training_completed TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS update_workers_updated_at ON public.workers;
CREATE TRIGGER update_workers_updated_at
    BEFORE UPDATE ON public.workers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_workers_availability ON public.workers(availability);
CREATE INDEX IF NOT EXISTS idx_workers_verification ON public.workers(verification_status);
CREATE INDEX IF NOT EXISTS idx_workers_emergency ON public.workers(emergency_ready);
CREATE INDEX IF NOT EXISTS idx_workers_zone ON public.workers(zone);

-- 4.3 SERVICES
CREATE TABLE IF NOT EXISTS public.services (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    name_hi TEXT NOT NULL,
    category TEXT NOT NULL,
    category_id TEXT NOT NULL,
    base_price INT NOT NULL CHECK (base_price >= 0),
    original_price INT NOT NULL DEFAULT 0,
    emergency_available BOOLEAN NOT NULL DEFAULT FALSE,
    duration TEXT NOT NULL DEFAULT '45-60 mins',
    duration_hi TEXT NOT NULL DEFAULT '45-60 मिनट',
    description TEXT NOT NULL DEFAULT '',
    description_hi TEXT NOT NULL DEFAULT '',
    icon TEXT NOT NULL DEFAULT 'Wrench',
    image_url TEXT,
    skills TEXT[] NOT NULL DEFAULT '{}',
    popular BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_services_category ON public.services(category_id);
CREATE INDEX IF NOT EXISTS idx_services_emergency ON public.services(emergency_available);

-- 4.4 BOOKINGS
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token TEXT UNIQUE NOT NULL,
    customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    worker_id UUID REFERENCES public.workers(id) ON DELETE SET NULL,
    service_id TEXT REFERENCES public.services(id) ON DELETE SET NULL,
    service_name TEXT NOT NULL,
    service_category TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    lat NUMERIC(9, 6),
    lng NUMERIC(9, 6),
    scheduled_date DATE NOT NULL DEFAULT CURRENT_DATE,
    scheduled_time TEXT NOT NULL DEFAULT 'Immediate Dispatch',
    urgency urgency_level NOT NULL DEFAULT 'NORMAL',
    tier service_tier NOT NULL DEFAULT 'MEDIUM',
    estimated_price INT NOT NULL CHECK (estimated_price >= 0),
    connection_fee INT NOT NULL DEFAULT 25 CHECK (connection_fee >= 0),
    total_price INT NOT NULL CHECK (total_price >= 0),
    worker_payout INT NOT NULL CHECK (worker_payout >= 0),
    status booking_status NOT NULL DEFAULT 'REQUESTED',
    otp TEXT NOT NULL DEFAULT '4829',
    payment_status TEXT NOT NULL DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'PAID')),
    customer_rating NUMERIC(2, 1) CHECK (customer_rating >= 1 AND customer_rating <= 5),
    customer_review TEXT,
    worker_rating NUMERIC(2, 1) CHECK (worker_rating >= 1 AND worker_rating <= 5),
    worker_review TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

DROP TRIGGER IF EXISTS update_bookings_updated_at ON public.bookings;
CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON public.bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_bookings_token ON public.bookings(token);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_customer ON public.bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_worker ON public.bookings(worker_id);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON public.bookings(created_at DESC);

-- 4.5 BOOKING STATUS HISTORY
CREATE TABLE IF NOT EXISTS public.booking_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    status booking_status NOT NULL,
    note TEXT,
    changed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_status_history_booking ON public.booking_status_history(booking_id);

CREATE OR REPLACE FUNCTION log_booking_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') OR (OLD.status IS DISTINCT FROM NEW.status) THEN
        INSERT INTO public.booking_status_history (booking_id, status, note, timestamp)
        VALUES (
            NEW.id,
            NEW.status,
            CASE
                WHEN NEW.status = 'REQUESTED' THEN 'Booking requested by customer'
                WHEN NEW.status = 'MATCHED' THEN 'Artisan matched via cooperative dispatch'
                WHEN NEW.status = 'ACCEPTED' THEN 'Artisan accepted the job request'
                WHEN NEW.status = 'ON_THE_WAY' THEN 'Artisan is en route to customer location'
                WHEN NEW.status = 'IN_PROGRESS' THEN 'Customer 4-digit OTP verified. Work started.'
                WHEN NEW.status = 'COMPLETED' THEN 'Work finished & verified. 30-day warranty activated.'
                WHEN NEW.status = 'CANCELLED' THEN 'Booking was cancelled.'
                ELSE 'Status updated to ' || NEW.status
            END,
            NOW()
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_log_booking_status ON public.bookings;
CREATE TRIGGER trigger_log_booking_status
    AFTER INSERT OR UPDATE OF status ON public.bookings
    FOR EACH ROW
    EXECUTE FUNCTION log_booking_status_change();

-- 4.6 PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    booking_token TEXT NOT NULL,
    customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL DEFAULT 'Customer',
    worker_id UUID REFERENCES public.workers(id) ON DELETE SET NULL,
    amount INT NOT NULL CHECK (amount >= 0),
    currency TEXT NOT NULL DEFAULT 'INR',
    payment_method TEXT NOT NULL DEFAULT 'Razorpay / UPI Escrow',
    payment_status TEXT NOT NULL DEFAULT 'PAID' CHECK (payment_status IN ('PENDING', 'PAID', 'FAILED', 'REFUNDED')),
    razorpay_payment_id TEXT,
    razorpay_order_id TEXT,
    razorpay_signature TEXT,
    notes JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS update_payments_updated_at ON public.payments;
CREATE TRIGGER update_payments_updated_at
    BEFORE UPDATE ON public.payments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON public.payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_customer_id ON public.payments(customer_id);
CREATE INDEX IF NOT EXISTS idx_payments_worker_id ON public.payments(worker_id);
CREATE INDEX IF NOT EXISTS idx_payments_razorpay_id ON public.payments(razorpay_payment_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(payment_status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON public.payments(created_at DESC);

-- 4.7 WORKER EARNINGS
CREATE TABLE IF NOT EXISTS public.worker_earnings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    worker_id UUID NOT NULL REFERENCES public.workers(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    booking_token TEXT NOT NULL,
    service_name TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    amount INT NOT NULL CHECK (amount >= 0),
    platform_fee INT NOT NULL DEFAULT 25 CHECK (platform_fee >= 0),
    net_payout INT NOT NULL CHECK (net_payout >= 0),
    status TEXT NOT NULL DEFAULT 'PAID' CHECK (status IN ('PAID', 'PENDING')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_worker_earnings_worker ON public.worker_earnings(worker_id);
CREATE INDEX IF NOT EXISTS idx_worker_earnings_booking ON public.worker_earnings(booking_id);

-- Auto Earnings Trigger on Booking Completion
CREATE OR REPLACE FUNCTION record_worker_earnings_on_completion()
RETURNS TRIGGER AS $$
BEGIN
    IF (NEW.status = 'COMPLETED' AND (OLD.status IS DISTINCT FROM 'COMPLETED') AND NEW.worker_id IS NOT NULL) THEN
        INSERT INTO public.worker_earnings (
            worker_id,
            booking_id,
            booking_token,
            service_name,
            customer_name,
            amount,
            platform_fee,
            net_payout,
            status,
            created_at
        )
        VALUES (
            NEW.worker_id,
            NEW.id,
            NEW.token,
            NEW.service_name,
            NEW.customer_name,
            NEW.total_price,
            NEW.connection_fee,
            NEW.worker_payout,
            'PAID',
            NOW()
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_auto_record_worker_earnings ON public.bookings;
CREATE TRIGGER trigger_auto_record_worker_earnings
    AFTER UPDATE OF status ON public.bookings
    FOR EACH ROW
    EXECUTE FUNCTION record_worker_earnings_on_completion();

-- 4.8 REVIEWS
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    worker_id UUID REFERENCES public.workers(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    rating NUMERIC(2, 1) NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL DEFAULT '',
    service_name TEXT NOT NULL,
    chips TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_worker ON public.reviews(worker_id);
CREATE INDEX IF NOT EXISTS idx_reviews_booking ON public.reviews(booking_id);

-- 4.9 KYC RECORDS
CREATE TABLE IF NOT EXISTS public.kyc_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    worker_id UUID REFERENCES public.workers(id) ON DELETE CASCADE,
    worker_name TEXT NOT NULL,
    profession TEXT NOT NULL,
    cooperative TEXT NOT NULL,
    documents TEXT NOT NULL,
    status verification_status NOT NULL DEFAULT 'PENDING',
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ,
    reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_kyc_status ON public.kyc_records(status);
CREATE INDEX IF NOT EXISTS idx_kyc_worker ON public.kyc_records(worker_id);

-- 5. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.worker_earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kyc_records ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.get_auth_user_role()
RETURNS user_role AS $$
    SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_admin_or_cooperative()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role IN ('admin', 'cooperative')
    );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Profiles Policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id OR public.is_admin_or_cooperative());

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins have full access to profiles" ON public.profiles;
CREATE POLICY "Admins have full access to profiles" ON public.profiles FOR ALL USING (public.is_admin_or_cooperative());

-- Services Policies
DROP POLICY IF EXISTS "Anyone can view active services catalog" ON public.services;
CREATE POLICY "Anyone can view active services catalog" ON public.services FOR SELECT TO PUBLIC USING (TRUE);

DROP POLICY IF EXISTS "Admins can manage services catalog" ON public.services;
CREATE POLICY "Admins can manage services catalog" ON public.services FOR ALL USING (public.is_admin_or_cooperative());

-- Workers Policies
DROP POLICY IF EXISTS "Anyone can view verified workers directory" ON public.workers;
CREATE POLICY "Anyone can view verified workers directory" ON public.workers FOR SELECT TO PUBLIC USING (TRUE);

DROP POLICY IF EXISTS "Workers can update own worker record" ON public.workers;
CREATE POLICY "Workers can update own worker record" ON public.workers FOR UPDATE USING (profile_id = auth.uid() OR public.is_admin_or_cooperative());

DROP POLICY IF EXISTS "Admins can manage workers" ON public.workers;
CREATE POLICY "Admins can manage workers" ON public.workers FOR ALL USING (public.is_admin_or_cooperative());

-- Bookings Policies
DROP POLICY IF EXISTS "Customers can view their own bookings" ON public.bookings;
CREATE POLICY "Customers can view their own bookings" ON public.bookings FOR SELECT USING (
    customer_id = auth.uid()
    OR worker_id IN (SELECT id FROM public.workers WHERE profile_id = auth.uid())
    OR (status IN ('REQUESTED', 'MATCHED') AND public.get_auth_user_role() = 'worker')
    OR public.is_admin_or_cooperative()
);

DROP POLICY IF EXISTS "Customers can create bookings" ON public.bookings;
CREATE POLICY "Customers can create bookings" ON public.bookings FOR INSERT WITH CHECK (
    customer_id = auth.uid() OR customer_id IS NULL OR public.is_admin_or_cooperative()
);

DROP POLICY IF EXISTS "Permitted parties can update bookings" ON public.bookings;
CREATE POLICY "Permitted parties can update bookings" ON public.bookings FOR UPDATE USING (
    customer_id = auth.uid()
    OR worker_id IN (SELECT id FROM public.workers WHERE profile_id = auth.uid())
    OR public.is_admin_or_cooperative()
);

-- Status History Policies
DROP POLICY IF EXISTS "Participants and admins can view status history" ON public.booking_status_history;
CREATE POLICY "Participants and admins can view status history" ON public.booking_status_history FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.bookings b
        WHERE b.id = booking_status_history.booking_id
        AND (
            b.customer_id = auth.uid()
            OR b.worker_id IN (SELECT id FROM public.workers WHERE profile_id = auth.uid())
            OR public.is_admin_or_cooperative()
        )
    )
);

DROP POLICY IF EXISTS "Authenticated users can insert status history" ON public.booking_status_history;
CREATE POLICY "Authenticated users can insert status history" ON public.booking_status_history FOR INSERT WITH CHECK (TRUE);

-- Payments Policies
DROP POLICY IF EXISTS "Customers can view own payments" ON public.payments;
CREATE POLICY "Customers can view own payments" ON public.payments FOR SELECT USING (
    customer_id = auth.uid()
    OR booking_id IN (SELECT id FROM public.bookings WHERE customer_id = auth.uid())
    OR public.is_admin_or_cooperative()
);

DROP POLICY IF EXISTS "Workers can view payments for their bookings" ON public.payments;
CREATE POLICY "Workers can view payments for their bookings" ON public.payments FOR SELECT USING (
    worker_id IN (SELECT id FROM public.workers WHERE profile_id = auth.uid())
    OR booking_id IN (SELECT b.id FROM public.bookings b JOIN public.workers w ON b.worker_id = w.id WHERE w.profile_id = auth.uid())
    OR public.is_admin_or_cooperative()
);

DROP POLICY IF EXISTS "Authenticated users can record payments" ON public.payments;
CREATE POLICY "Authenticated users can record payments" ON public.payments FOR INSERT WITH CHECK (
    customer_id = auth.uid() OR customer_id IS NULL OR auth.uid() IS NOT NULL OR public.is_admin_or_cooperative()
);

DROP POLICY IF EXISTS "Admins have full access to payments" ON public.payments;
CREATE POLICY "Admins have full access to payments" ON public.payments FOR ALL USING (public.is_admin_or_cooperative());

-- Worker Earnings Policies
DROP POLICY IF EXISTS "Workers can view own earnings ledger" ON public.worker_earnings;
CREATE POLICY "Workers can view own earnings ledger" ON public.worker_earnings FOR SELECT USING (
    worker_id IN (SELECT id FROM public.workers WHERE profile_id = auth.uid()) OR public.is_admin_or_cooperative()
);

DROP POLICY IF EXISTS "Workers can record completed job earnings" ON public.worker_earnings;
CREATE POLICY "Workers can record completed job earnings" ON public.worker_earnings FOR INSERT WITH CHECK (
    worker_id IN (SELECT id FROM public.workers WHERE profile_id = auth.uid()) OR public.is_admin_or_cooperative() OR worker_id IS NOT NULL
);

DROP POLICY IF EXISTS "Admins can manage worker earnings ledger" ON public.worker_earnings;
CREATE POLICY "Admins can manage worker earnings ledger" ON public.worker_earnings FOR ALL USING (public.is_admin_or_cooperative());

-- Reviews Policies
DROP POLICY IF EXISTS "Anyone can view approved reviews" ON public.reviews;
CREATE POLICY "Anyone can view approved reviews" ON public.reviews FOR SELECT TO PUBLIC USING (TRUE);

DROP POLICY IF EXISTS "Customers can create reviews for their bookings" ON public.reviews;
CREATE POLICY "Customers can create reviews for their bookings" ON public.reviews FOR INSERT WITH CHECK (
    customer_id = auth.uid() OR customer_id IS NULL OR public.is_admin_or_cooperative()
);

-- KYC Policies
DROP POLICY IF EXISTS "Workers can view own KYC documents" ON public.kyc_records;
CREATE POLICY "Workers can view own KYC documents" ON public.kyc_records FOR SELECT USING (
    worker_id IN (SELECT id FROM public.workers WHERE profile_id = auth.uid()) OR public.is_admin_or_cooperative()
);

DROP POLICY IF EXISTS "Workers can submit KYC documents" ON public.kyc_records;
CREATE POLICY "Workers can submit KYC documents" ON public.kyc_records FOR INSERT WITH CHECK (
    worker_id IN (SELECT id FROM public.workers WHERE profile_id = auth.uid()) OR public.is_admin_or_cooperative()
);

DROP POLICY IF EXISTS "Admins can verify/manage KYC records" ON public.kyc_records;
CREATE POLICY "Admins can verify/manage KYC records" ON public.kyc_records FOR ALL USING (public.is_admin_or_cooperative());

-- 6. REALTIME REPLICATION
ALTER TABLE public.bookings REPLICA IDENTITY FULL;
ALTER TABLE public.booking_status_history REPLICA IDENTITY FULL;
ALTER TABLE public.workers REPLICA IDENTITY FULL;
ALTER TABLE public.kyc_records REPLICA IDENTITY FULL;
ALTER TABLE public.payments REPLICA IDENTITY FULL;

DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings; EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.booking_status_history; EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.workers; EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.kyc_records; EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.payments; EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 7. STORAGE BUCKETS SETUP
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    ('kyc-documents', 'kyc-documents', FALSE, 52428800, ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp']),
    ('avatars', 'avatars', TRUE, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
    ('service-photos', 'service-photos', TRUE, 20971520, ARRAY['image/jpeg', 'image/png', 'image/webp']),
    ('worker-certificates', 'worker-certificates', TRUE, 26214400, ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp']),
    ('service-images', 'service-images', TRUE, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;
