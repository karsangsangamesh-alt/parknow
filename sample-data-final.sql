-- Sample Data for ParkNow Parking Marketplace (Fixed Version)
-- Run this AFTER running supabase-schema.sql
-- This creates profiles first, then listings

-- Step 1: Create sample profiles first
INSERT INTO profiles (id, email, full_name, role, phone, is_verified, created_at, updated_at)
VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'sarah.johnson@parknow.com', 'Sarah Johnson', 'host', '+1-555-0101', true, NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440002', 'mike.chen@parknow.com', 'Mike Chen', 'host', '+1-555-0102', true, NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', 'emily.rodriguez@parknow.com', 'Emily Rodriguez', 'host', '+1-555-0103', true, NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440004', 'david.kim@parknow.com', 'David Kim', 'host', '+1-555-0104', true, NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440005', 'jessica.brown@parknow.com', 'Jessica Brown', 'host', '+1-555-0105', true, NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440006', 'alex.wilson@parknow.com', 'Alex Wilson', 'host', '+1-555-0106', true, NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440007', 'rachel.garcia@parknow.com', 'Rachel Garcia', 'host', '+1-555-0107', true, NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440008', 'tom.anderson@parknow.com', 'Tom Anderson', 'host', '+1-555-0108', true, NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440009', 'lisa.martinez@parknow.com', 'Lisa Martinez', 'host', '+1-555-0109', true, NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440010', 'john.davis@parknow.com', 'John Davis', 'host', '+1-555-0110', true, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  phone = EXCLUDED.phone,
  is_verified = EXCLUDED.is_verified;

-- Step 2: Create sample host_profiles
INSERT INTO host_profiles (user_id, business_name, business_type, payout_email, created_at, updated_at)
VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Sarah ParkNow', 'individual', 'sarah.johnson@parknow.com', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440002', 'Mike Chen Parking', 'individual', 'mike.chen@parknow.com', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', 'Emily Parking Solutions', 'individual', 'emily.rodriguez@parknow.com', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440004', 'David''s Parking', 'individual', 'david.kim@parknow.com', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440005', 'Jessica''s Spots', 'individual', 'jessica.brown@parknow.com', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440006', 'Alex Parking Co', 'business', 'alex.wilson@parknow.com', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440007', 'Rachel''s Rentals', 'individual', 'rachel.garcia@parknow.com', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440008', 'Tom Anderson Parking', 'individual', 'tom.anderson@parknow.com', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440009', 'Lisa''s Parking', 'individual', 'lisa.martinez@parknow.com', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440010', 'John''s Spaces', 'individual', 'john.davis@parknow.com', NOW(), NOW())
ON CONFLICT (user_id) DO UPDATE SET
  business_name = EXCLUDED.business_name,
  business_type = EXCLUDED.business_type,
  payout_email = EXCLUDED.payout_email;

-- Step 3: Create sample listings (now with valid host_id references)
INSERT INTO listings (
  id, host_id, title, description, address, 
  latitude, longitude, price_per_hour, price_per_day, 
  max_vehicle_height, max_vehicle_width, max_vehicle_length,
  allowed_vehicle_types, amenities, photos,
  is_active, is_available, auto_approve_bookings,
  created_at, updated_at
) VALUES
-- Times Square Area
('111e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Times Square Covered Parking', 'Secure covered parking space in the heart of Times Square. 24/7 access with security cameras and valet service available.', '1234 Broadway, New York, NY', 40.7580, -73.9855, 12.00, 75.00, 2.1, 2.0, 4.8, '["car", "suv"]', '["covered", "security", "24_7_access", "camera", "valet"]', '["/api/placeholder/400/300", "/api/placeholder/400/301"]', true, true, true, NOW(), NOW()),

('111e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'Financial District Garage', 'Underground parking garage with valet service. Premium location in the Financial District.', '85 Broad St, New York, NY', 40.7074, -74.0113, 15.00, 90.00, 2.2, 2.2, 5.0, '["car", "suv", "van"]', '["covered", "security", "24_7_access", "camera", "valet", "indoor"]', '["/api/placeholder/400/302"]', true, true, true, NOW(), NOW()),

('111e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'Wall Street Spot', 'Compact parking spot perfect for business district. Secure and convenient.', '25 Wall St, New York, NY', 40.7074, -74.0113, 10.00, 60.00, 1.8, 1.8, 4.2, '["car", "motorcycle"]', '["covered", "security", "camera"]', '["/api/placeholder/400/303"]', true, true, false, NOW(), NOW()),

-- Central Park Area
('111e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', 'Central Park South Parking', 'Secure parking near Central Park. Easy access to all major attractions.', '200 Central Park S, New York, NY', 40.7661, -73.9757, 8.00, 50.00, 2.0, 2.0, 4.5, '["car", "suv"]', '["covered", "security", "24_7_access"]', '["/api/placeholder/400/304"]', true, false, false, NOW(), NOW()),

('111e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440005', 'Broadway Theater District', 'Convenient parking for theater-goers. Short walk to all major shows.', '1560 Broadway, New York, NY', 40.7590, -73.9845, 6.00, 40.00, 1.9, 1.9, 4.3, '["car", "motorcycle"]', '["security", "camera", "24_7_access"]', '["/api/placeholder/400/305"]', true, true, false, NOW(), NOW()),

-- Upper West Side
('111e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440006', 'Lincoln Center Parking', 'Residential parking spot near Lincoln Center. Safe neighborhood with 24/7 access.', '10 W 66th St, New York, NY', 40.7726, -73.9826, 5.00, 30.00, 2.0, 2.0, 4.5, '["car", "suv"]', '["gated", "security", "24_7_access", "outdoor"]', '["/api/placeholder/400/306"]', true, true, true, NOW(), NOW()),

('111e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440007', 'Columbus Circle Spot', 'Covered parking at Columbus Circle. Perfect for shopping and Central Park visits.', '10 Columbus Cir, New York, NY', 40.7681, -73.9819, 7.00, 45.00, 2.1, 2.1, 4.6, '["car", "suv"]', '["covered", "security", "camera", "24_7_access"]', '["/api/placeholder/400/307"]', true, true, true, NOW(), NOW()),

-- Brooklyn
('111e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440008', 'DUMBO Waterfront Parking', 'Secure parking near Brooklyn Bridge Park. Great views and easy access to Manhattan.', '334 Furman St, Brooklyn, NY', 40.7033, -73.9903, 4.00, 25.00, 2.2, 2.2, 5.0, '["car", "suv", "van"]', '["gated", "security", "24_7_access", "outdoor"]', '["/api/placeholder/400/308"]', true, true, true, NOW(), NOW()),

('111e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440009', 'Williamsburg Nightlife Parking', 'Parking spot in trendy Williamsburg. Perfect for bar hopping and restaurants.', '123 Grand St, Brooklyn, NY', 40.7081, -73.9571, 3.00, 20.00, 1.8, 1.8, 4.2, '["car", "motorcycle"]', '["security", "camera", "outdoor"]', '["/api/placeholder/400/309"]', true, true, true, NOW(), NOW()),

-- Queens
('111e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440010', 'LGA Airport Parking', 'Convenient parking near LaGuardia Airport. Shuttle service available.', '1 Marine Air Terminal Rd, Queens, NY', 40.7769, -73.8740, 2.00, 15.00, 2.5, 2.3, 5.5, '["car", "suv", "van", "truck"]', '["accessible", "security", "24_7_access", "indoor", "shuttle"]', '["/api/placeholder/400/310"]', true, true, true, NOW(), NOW()),

-- More Manhattan spots
('111e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440011', 'Soho Shopping District', 'Urban parking spot in trendy SoHo. Walking distance to shops and restaurants.', '121 Greene St, New York, NY', 40.7233, -74.0020, 9.00, 55.00, 2.0, 2.0, 4.5, '["car", "suv"]', '["covered", "security", "camera"]', '["/api/placeholder/400/311"]', true, false, false, NOW(), NOW()),

('111e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440012', 'Chelsea Market Area', 'Parking near Chelsea Market. Great for foodies and art lovers.', '75 9th Ave, New York, NY', 40.7420, -74.0048, 6.00, 35.00, 1.9, 1.9, 4.3, '["car", "motorcycle"]', '["security", "24_7_access", "outdoor"]', '["/api/placeholder/400/312"]', true, true, false, NOW(), NOW()),

('111e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440013', 'Greenwich Village Spot', 'Residential parking in historic Greenwich Village. Charming neighborhood.', '180 W 4th St, New York, NY', 40.7335, -74.0027, 5.00, 30.00, 2.0, 2.0, 4.5, '["car", "suv"]', '["gated", "security", "24_7_access", "outdoor"]', '["/api/placeholder/400/313"]', true, true, true, NOW(), NOW()),

('111e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440014', 'East Village Nightlife', 'Parking perfect for East Village bar scene. Safe and secure.', '85 St Marks Pl, New York, NY', 40.7265, -73.9815, 4.00, 25.00, 1.8, 1.8, 4.2, '["car", "motorcycle"]', '["security", "camera", "outdoor"]', '["/api/placeholder/400/314"]', true, true, true, NOW(), NOW()),

('111e8400-e29b-41d4-a716-446655440015', '550e8400-e29b-41d4-a716-446655440015', 'Lower East Side Parking', 'Convenient spot in Lower East Side. Close to great restaurants and bars.', '145 Allen St, New York, NY', 40.7180, -73.9857, 4.00, 25.00, 1.8, 1.8, 4.2, '["car", "motorcycle"]', '["security", "24_7_access", "outdoor"]', '["/api/placeholder/400/315"]', true, true, true, NOW(), NOW()),

('111e8400-e29b-41d4-a716-446655440016', '550e8400-e29b-41d4-a716-446655440016', 'Battery Park City', 'Premium parking with Hudson River views. Business district location.', '200 Liberty St, New York, NY', 40.7116, -74.0165, 11.00, 65.00, 2.1, 2.1, 4.6, '["car", "suv"]', '["covered", "security", "camera", "valet", "indoor"]', '["/api/placeholder/400/316"]', true, true, true, NOW(), NOW()),

('111e8400-e29b-41d4-a716-446655440017', '550e8400-e29b-41d4-a716-446655440017', 'Tribeca Arts District', 'Parking in artistic Tribeca. Near galleries and trendy restaurants.', '85 Franklin St, New York, NY', 40.7195, -74.0086, 8.00, 50.00, 2.0, 2.0, 4.5, '["car", "suv"]', '["covered", "security", "24_7_access", "camera"]', '["/api/placeholder/400/317"]', true, true, true, NOW(), NOW()),

('111e8400-e29b-41d4-a716-446655440018', '550e8400-e29b-41d4-a716-446655440018', 'Chinatown Cultural Spot', 'Parking in historic Chinatown. Walk to all major attractions.', '19 Doyers St, New York, NY', 40.7158, -73.9970, 3.00, 20.00, 1.8, 1.8, 4.2, '["car", "motorcycle"]', '["security", "camera", "outdoor"]', '["/api/placeholder/400/318"]', true, true, true, NOW(), NOW()),

-- Staten Island and Bronx
('111e8400-e29b-41d4-a716-446655440019', '550e8400-e29b-41d4-a716-446655440019', 'Staten Island Ferry Parking', 'Secure parking near ferry terminal. Great for Manhattan commuters.', '1 Ferry Terminal Rd, Staten Island, NY', 40.7012, -74.0132, 1.00, 10.00, 2.2, 2.2, 5.0, '["car", "suv", "van"]', '["gated", "security", "24_7_access", "outdoor"]', '["/api/placeholder/400/319"]', true, true, true, NOW(), NOW()),

('111e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440020', 'Yankee Stadium Area Parking', 'Parking spot near Yankee Stadium. Perfect for game days and events.', '1 E 161st St, Bronx, NY', 40.8296, -73.9262, 2.00, 15.00, 2.5, 2.3, 5.5, '["car", "suv", "van", "truck"]', '["gated", "security", "24_7_access", "outdoor"]', '["/api/placeholder/400/320"]', true, true, true, NOW(), NOW());

-- Update availability_status based on is_available and price
UPDATE listings SET 
  availability_status = CASE 
    WHEN is_available = false THEN 'busy'
    WHEN price_per_hour > 10 THEN 'limited'  -- Premium spots
    ELSE 'available'
  END;

-- Success message
SELECT 'Sample data created successfully! Created ' || (SELECT COUNT(*) FROM profiles) || ' profiles and ' || (SELECT COUNT(*) FROM listings) || ' parking listings.' as status;
