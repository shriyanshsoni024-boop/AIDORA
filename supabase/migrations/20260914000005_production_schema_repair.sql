-- ==============================================================================
-- AIDORA Cooperative Platform — Production Schema Repair Migration
-- File: 20260914000005_production_schema_repair.sql
-- Database: PostgreSQL (Supabase)
-- Version: 1.1.0
-- Non-destructive, Idempotent, Production-Safe Migration
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUM CHECK & REPAIR
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

-- 3. CREATE PAYMENTS TABLE
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

-- Indexes for payments
CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON public.payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_customer_id ON public.payments(customer_id);
CREATE INDEX IF NOT EXISTS idx_payments_worker_id ON public.payments(worker_id);
CREATE INDEX IF NOT EXISTS idx_payments_razorpay_id ON public.payments(razorpay_payment_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(payment_status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON public.payments(created_at DESC);

-- Trigger for payments updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_payments_updated_at ON public.payments;
CREATE TRIGGER update_payments_updated_at
    BEFORE UPDATE ON public.payments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 4. ROW LEVEL SECURITY FOR PAYMENTS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Customers can view own payments" ON public.payments;
    CREATE POLICY "Customers can view own payments" ON public.payments 
    FOR SELECT USING (
        customer_id = auth.uid()
        OR booking_id IN (SELECT id FROM public.bookings WHERE customer_id = auth.uid())
        OR public.is_admin_or_cooperative()
    );
EXCEPTION WHEN undefined_function THEN
    CREATE POLICY "Customers can view own payments" ON public.payments 
    FOR SELECT USING (customer_id = auth.uid() OR auth.uid() IS NOT NULL);
END $$;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Workers can view payments for their bookings" ON public.payments;
    CREATE POLICY "Workers can view payments for their bookings" ON public.payments 
    FOR SELECT USING (
        worker_id IN (SELECT id FROM public.workers WHERE profile_id = auth.uid())
        OR booking_id IN (SELECT b.id FROM public.bookings b JOIN public.workers w ON b.worker_id = w.id WHERE w.profile_id = auth.uid())
        OR public.is_admin_or_cooperative()
    );
EXCEPTION WHEN undefined_function THEN
    CREATE POLICY "Workers can view payments for their bookings" ON public.payments 
    FOR SELECT USING (auth.uid() IS NOT NULL);
END $$;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Authenticated users can record payments" ON public.payments;
    CREATE POLICY "Authenticated users can record payments" ON public.payments 
    FOR INSERT WITH CHECK (
        customer_id = auth.uid() OR customer_id IS NULL OR auth.uid() IS NOT NULL OR public.is_admin_or_cooperative()
    );
EXCEPTION WHEN undefined_function THEN
    CREATE POLICY "Authenticated users can record payments" ON public.payments 
    FOR INSERT WITH CHECK (TRUE);
END $$;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Admins have full access to payments" ON public.payments;
    CREATE POLICY "Admins have full access to payments" ON public.payments 
    FOR ALL USING (public.is_admin_or_cooperative());
EXCEPTION WHEN undefined_function THEN
    null;
END $$;

-- 5. REALTIME REPLICATION FOR PAYMENTS
ALTER TABLE public.payments REPLICA IDENTITY FULL;

DO $$ BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.payments;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- 6. AUTOMATED EARNINGS LEDGER ON BOOKING COMPLETION TRIGGER
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

-- 7. STORAGE BUCKETS SETUP & AUDIT
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
