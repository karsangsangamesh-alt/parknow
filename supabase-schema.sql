-- ======================================================
-- ✅ ParkNow Full Database Schema (PostGIS + RLS Safe)
-- ======================================================

-- 1️⃣ Enable Extensions
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2️⃣ Tables

-- Profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT CHECK (role IN ('host', 'renter', 'both')) DEFAULT 'renter',
  phone TEXT,
  is_verified BOOLEAN DEFAULT false,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Host profiles
CREATE TABLE IF NOT EXISTS public.host_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) UNIQUE,
  business_name TEXT,
  business_type TEXT CHECK (business_type IN ('individual', 'business', 'enterprise')),
  tax_id TEXT,
  bank_account_info JSONB,
  payout_email TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Vehicle types
CREATE TABLE IF NOT EXISTS public.vehicle_types (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  max_height DECIMAL(5,2),
  max_width DECIMAL(5,2),
  max_length DECIMAL(5,2),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Listings
CREATE TABLE IF NOT EXISTS public.listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  host_id UUID REFERENCES public.profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  location GEOGRAPHY(POINT, 4326),
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  price_per_hour DECIMAL(10,2) NOT NULL,
  price_per_day DECIMAL(10,2),
  price_per_week DECIMAL(10,2),
  price_per_month DECIMAL(10,2),
  max_vehicle_height DECIMAL(5,2),
  max_vehicle_width DECIMAL(5,2),
  max_vehicle_length DECIMAL(5,2),
  allowed_vehicle_types JSONB,
  amenities JSONB,
  photos JSONB,
  is_active BOOLEAN DEFAULT true,
  is_available BOOLEAN DEFAULT true,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
  auto_approve_bookings BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Availability calendar
CREATE TABLE IF NOT EXISTS public.availability_calendar (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  is_available BOOLEAN DEFAULT true,
  blocked_reason TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(listing_id, date)
);

-- Bookings
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID REFERENCES public.listings(id),
  renter_id UUID REFERENCES public.profiles(id),
  host_id UUID REFERENCES public.profiles(id),
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  total_hours DECIMAL(5,2),
  base_amount DECIMAL(10,2),
  service_fee DECIMAL(10,2),
  taxes DECIMAL(10,2),
  total_amount DECIMAL(10,2),
  currency TEXT DEFAULT 'INR',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'refunded')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_intent_id TEXT,
  payment_method TEXT,
  special_instructions TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Reviews
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES public.bookings(id),
  reviewer_id UUID REFERENCES public.profiles(id),
  reviewee_id UUID REFERENCES public.profiles(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Earnings
CREATE TABLE IF NOT EXISTS public.earnings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  host_id UUID REFERENCES public.profiles(id),
  booking_id UUID REFERENCES public.bookings(id),
  gross_amount DECIMAL(10,2),
  platform_fee DECIMAL(10,2),
  net_amount DECIMAL(10,2),
  payout_status TEXT DEFAULT 'pending' CHECK (payout_status IN ('pending', 'paid', 'failed')),
  payout_date TIMESTAMP,
  payout_method TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Transactions
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES public.bookings(id),
  amount DECIMAL(10,2),
  currency TEXT DEFAULT 'INR',
  payment_provider TEXT CHECK (payment_provider IN ('razorpay', 'stripe')),
  provider_transaction_id TEXT,
  provider_payment_intent_id TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded')),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Support tickets
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id),
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT CHECK (category IN ('booking', 'payment', 'listing', 'account', 'technical', 'other')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  assigned_to UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Notification preferences
CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) UNIQUE,
  email_bookings BOOLEAN DEFAULT true,
  email_payments BOOLEAN DEFAULT true,
  email_reviews BOOLEAN DEFAULT true,
  email_marketing BOOLEAN DEFAULT false,
  push_bookings BOOLEAN DEFAULT true,
  push_payments BOOLEAN DEFAULT true,
  push_reviews BOOLEAN DEFAULT true,
  push_marketing BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Saved listings
CREATE TABLE IF NOT EXISTS public.saved_listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id),
  listing_id UUID REFERENCES public.listings(id),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, listing_id)
);

-- 3️⃣ Indexes
CREATE INDEX IF NOT EXISTS idx_listings_location ON public.listings USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_listings_active ON public.listings(is_active, is_available) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status, start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON public.bookings(start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_listings_host ON public.listings(host_id);
CREATE INDEX IF NOT EXISTS idx_earnings_host ON public.earnings(host_id, payout_status);

-- 4️⃣ updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- attach triggers
DO $$
BEGIN
  PERFORM 1;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_profiles_updated_at') THEN
    CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_host_profiles_updated_at') THEN
    CREATE TRIGGER update_host_profiles_updated_at BEFORE UPDATE ON public.host_profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_listings_updated_at') THEN
    CREATE TRIGGER update_listings_updated_at BEFORE UPDATE ON public.listings
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_bookings_updated_at') THEN
    CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- 5️⃣ Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.host_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability_calendar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_listings ENABLE ROW LEVEL SECURITY;

-- 6️⃣ Policies (no commas, no syntax issues)

-- Profiles
CREATE POLICY profiles_select_public ON public.profiles FOR SELECT USING (true);
CREATE POLICY profiles_update_own ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY profiles_insert_own ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Host profiles
CREATE POLICY host_profiles_select_public ON public.host_profiles FOR SELECT USING (true);
CREATE POLICY host_profiles_update_own ON public.host_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY host_profiles_insert_own ON public.host_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Listings
CREATE POLICY listings_select_active ON public.listings FOR SELECT USING (is_active = true);
CREATE POLICY listings_manage_own ON public.listings FOR ALL USING (auth.uid() = host_id) WITH CHECK (auth.uid() = host_id);
CREATE POLICY listings_insert_own ON public.listings FOR INSERT WITH CHECK (auth.uid() = host_id);

-- Availability
CREATE POLICY availability_select_public ON public.availability_calendar FOR SELECT USING (true);
CREATE POLICY availability_manage_by_host ON public.availability_calendar FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.listings l
    WHERE l.id = availability_calendar.listing_id AND l.host_id = auth.uid()
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.listings l
    WHERE l.id = availability_calendar.listing_id AND l.host_id = auth.uid()
  )
);

-- Bookings
CREATE POLICY bookings_select_own ON public.bookings FOR SELECT USING (auth.uid() = renter_id OR auth.uid() = host_id);
CREATE POLICY bookings_insert_own ON public.bookings FOR INSERT WITH CHECK (auth.uid() = renter_id);
CREATE POLICY bookings_update_own ON public.bookings FOR UPDATE USING (auth.uid() = renter_id OR auth.uid() = host_id);

-- Reviews
CREATE POLICY reviews_select_visible ON public.reviews FOR SELECT USING (is_visible = true);
CREATE POLICY reviews_insert_own ON public.reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);
CREATE POLICY reviews_update_own ON public.reviews FOR UPDATE USING (auth.uid() = reviewer_id);

-- Earnings
CREATE POLICY earnings_select_host ON public.earnings FOR SELECT USING (auth.uid() = host_id);

-- Transactions
CREATE POLICY transactions_select_related ON public.transactions FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.bookings b
    WHERE b.id = transactions.booking_id
    AND (b.renter_id = auth.uid() OR b.host_id = auth.uid())
  )
);

-- Support tickets
CREATE POLICY support_select_own ON public.support_tickets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY support_insert_own ON public.support_tickets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY support_update_own ON public.support_tickets FOR UPDATE USING (auth.uid() = user_id);

-- Notification preferences
CREATE POLICY notification_manage_own ON public.notification_preferences FOR ALL USING (auth.uid() = user_id);

-- Saved listings
CREATE POLICY saved_manage_own ON public.saved_listings FOR ALL USING (auth.uid() = user_id);

-- 7️⃣ Safe vehicle type seed (no ON CONFLICT)
INSERT INTO public.vehicle_types (name, description, max_height, max_width, max_length)
SELECT v.name, v.description, v.max_height, v.max_width, v.max_length
FROM (VALUES
  ('Car', 'Standard passenger car', 2.0, 2.0, 4.5),
  ('SUV', 'Sports Utility Vehicle', 2.1, 2.1, 4.8),
  ('Van', 'Minivan or cargo van', 2.2, 2.2, 5.0),
  ('Motorcycle', 'Motorcycle or scooter', 1.5, 1.0, 2.5),
  ('Truck', 'Small pickup truck', 2.5, 2.3, 5.5),
  ('Bicycle', 'Bicycle or e-bike', 1.2, 0.8, 1.8)
) AS v(name, description, max_height, max_width, max_length)
WHERE NOT EXISTS (
  SELECT 1 FROM public.vehicle_types t WHERE t.name = v.name
);

-- 8️⃣ Booking conflict check function
CREATE OR REPLACE FUNCTION public.check_booking_conflicts(p_listing_id UUID, p_start_time TIMESTAMP, p_end_time TIMESTAMP)
RETURNS BOOLEAN AS $$
DECLARE
  conflict_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO conflict_count
  FROM public.bookings
  WHERE listing_id = p_listing_id
    AND status NOT IN ('cancelled', 'refunded')
    AND (
      (start_time <= p_start_time AND end_time > p_start_time) OR
      (start_time < p_end_time AND end_time >= p_end_time) OR
      (start_time >= p_start_time AND end_time <= p_end_time)
    );

  RETURN conflict_count > 0;
END;
$$ LANGUAGE plpgsql;

-- ✅ End of schema
