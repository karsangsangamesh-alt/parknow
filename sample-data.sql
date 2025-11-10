-- Sample Data for ParkNow Parking Marketplace
-- Run this in your Supabase SQL Editor

-- Insert sample amenities first
INSERT INTO amenities (name, description, icon) VALUES
('Covered', 'Protected from weather', '🅿️'),
('Security', '24/7 security or cameras', '🛡️'),
('24/7 Access', 'Round-the-clock entry', '🔐'),
('Camera', 'Security cameras monitoring', '📹'),
('EV Charging', 'Electric vehicle charging', '🔌'),
('Accessible', 'ADA compliant access', '♿'),
('Gated', 'Secure gated community', '🚧'),
('Valet', 'Valet parking service', '👨‍💼'),
('Indoor', 'Indoor parking facility', '🏢'),
('Outdoor', 'Outdoor parking lot', '☀️')
ON CONFLICT (name) DO NOTHING;

-- Insert sample listings
INSERT INTO listings (
  id, title, description, latitude, longitude, price_per_hour, 
  price_per_day, vehicle_type, size_category, is_available,
  host_id, created_at, updated_at, location_description
) VALUES
-- Downtown Manhattan
('550e8400-e29b-41d4-a716-446655440001', 'Times Square Covered Parking', 'Secure covered parking space in the heart of Times Square. 24/7 access with security cameras and valet service available.', 40.7580, -73.9855, 12.00, 75.00, 'car', 'regular', true, gen_random_uuid(), NOW(), NOW(), 'Times Square Area'),
('550e8400-e29b-41d4-a716-446655440002', 'Financial District Garage', 'Underground parking garage with valet service. Premium location in the Financial District.', 40.7074, -74.0113, 15.00, 90.00, 'car', 'large', true, gen_random_uuid(), NOW(), NOW(), 'Financial District'),
('550e8400-e29b-41d4-a716-446655440003', 'Wall Street Spot', 'Compact parking spot perfect for business district. Secure and convenient.', 40.7074, -74.0113, 10.00, 60.00, 'car', 'compact', true, gen_random_uuid(), NOW(), NOW(), 'Wall Street'),

-- Midtown Manhattan
('550e8400-e29b-41d4-a716-446655440004', 'Central Park South Parking', 'Secure parking near Central Park. Easy access to all major attractions.', 40.7661, -73.9757, 8.00, 50.00, 'car', 'regular', false, gen_random_uuid(), NOW(), NOW(), 'Central Park South'),
('550e8400-e29b-41d4-a716-446655440005', 'Broadway Theater District', 'Convenient parking for theater-goers. Short walk to all major shows.', 40.7590, -73.9845, 6.00, 40.00, 'car', 'compact', true, gen_random_uuid(), NOW(), NOW(), 'Theater District'),

-- Upper West Side
('550e8400-e29b-41d4-a716-446655440006', 'Lincoln Center Parking', 'Residential parking spot near Lincoln Center. Safe neighborhood with 24/7 access.', 40.7726, -73.9826, 5.00, 30.00, 'car', 'regular', true, gen_random_uuid(), NOW(), NOW(), 'Upper West Side'),
('550e8400-e29b-41d4-a716-446655440007', 'Columbus Circle Spot', 'Covered parking at Columbus Circle. Perfect for shopping and Central Park visits.', 40.7681, -73.9819, 7.00, 45.00, 'car', 'regular', true, gen_random_uuid(), NOW(), NOW(), 'Columbus Circle'),

-- Brooklyn
('550e8400-e29b-41d4-a716-446655440008', 'DUMBO Waterfront Parking', 'Secure parking near Brooklyn Bridge Park. Great views and easy access to Manhattan.', 40.7033, -73.9903, 4.00, 25.00, 'car', 'large', true, gen_random_uuid(), NOW(), NOW(), 'DUMBO'),
('550e8400-e29b-41d4-a716-446655440009', 'Williamsburg Nightlife Parking', 'Parking spot in trendy Williamsburg. Perfect for bar hopping and restaurants.', 40.7081, -73.9571, 3.00, 20.00, 'car', 'compact', true, gen_random_uuid(), NOW(), NOW(), 'Williamsburg'),

-- Queens
('550e8400-e29b-41d4-a716-446655440010', 'LGA Airport Parking', 'Convenient parking near LaGuardia Airport. Shuttle service available.', 40.7769, -73.8740, 2.00, 15.00, 'car', 'any', true, gen_random_uuid(), NOW(), NOW(), 'LaGuardia Airport'),

-- Additional Manhattan spots
('550e8400-e29b-41d4-a716-446655440011', 'Soho Shopping District', 'Urban parking spot in trendy SoHo. Walking distance to shops and restaurants.', 40.7233, -74.0020, 9.00, 55.00, 'car', 'regular', false, gen_random_uuid(), NOW(), NOW(), 'SoHo'),
('550e8400-e29b-41d4-a716-446655440012', 'Chelsea Market Area', 'Parking near Chelsea Market. Great for foodies and art lovers.', 40.7420, -74.0048, 6.00, 35.00, 'car', 'compact', true, gen_random_uuid(), NOW(), NOW(), 'Chelsea'),
('550e8400-e29b-41d4-a716-446655440013', 'Greenwich Village Spot', 'Residential parking in historic Greenwich Village. Charming neighborhood.', 40.7335, -74.0027, 5.00, 30.00, 'car', 'regular', true, gen_random_uuid(), NOW(), NOW(), 'Greenwich Village'),
('550e8400-e29b-41d4-a716-446655440014', 'East Village Nightlife', 'Parking perfect for East Village bar scene. Safe and secure.', 40.7265, -73.9815, 4.00, 25.00, 'car', 'compact', true, gen_random_uuid(), NOW(), NOW(), 'East Village'),
('550e8400-e29b-41d4-a716-446655440015', 'Lower East Side Parking', 'Convenient spot in Lower East Side. Close to great restaurants and bars.', 40.7180, -73.9857, 4.00, 25.00, 'car', 'compact', true, gen_random_uuid(), NOW(), NOW(), 'Lower East Side'),
('550e8400-e29b-41d4-a716-446655440016', 'Battery Park City', 'Premium parking with Hudson River views. Business district location.', 40.7116, -74.0165, 11.00, 65.00, 'car', 'regular', true, gen_random_uuid(), NOW(), NOW(), 'Battery Park City'),
('550e8400-e29b-41d4-a716-446655440017', 'Tribeca Arts District', 'Parking in artistic Tribeca. Near galleries and trendy restaurants.', 40.7195, -74.0086, 8.00, 50.00, 'car', 'regular', true, gen_random_uuid(), NOW(), NOW(), 'Tribeca'),
('550e8400-e29b-41d4-a716-446655440018', 'Chinatown Cultural Spot', 'Parking in historic Chinatown. Walk to all major attractions.', 40.7158, -73.9970, 3.00, 20.00, 'car', 'compact', true, gen_random_uuid(), NOW(), NOW(), 'Chinatown');

-- Update availability_status based on is_available
UPDATE listings SET 
  availability_status = CASE 
    WHEN is_available = false THEN 'busy'
    WHEN price_per_hour > 10 THEN 'limited'  -- Premium spots
    ELSE 'available'
  END;

-- Success message
SELECT 'Sample data created successfully! Created ' || (SELECT COUNT(*) FROM listings) || ' parking listings.' as status;
