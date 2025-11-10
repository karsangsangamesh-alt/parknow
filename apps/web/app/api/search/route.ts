import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Database } from '../../../types/database'

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface SearchParams {
  location?: string
  latitude?: number
  longitude?: number
  radius?: number
  startTime?: string
  endTime?: string
  priceRange?: [number, number]
  vehicleType?: string
  amenities?: string[]
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Extract search parameters
    const params: SearchParams = {
      location: searchParams.get('location') || undefined,
      latitude: searchParams.get('lat') ? parseFloat(searchParams.get('lat')!) : undefined,
      longitude: searchParams.get('lng') ? parseFloat(searchParams.get('lng')!) : undefined,
      radius: searchParams.get('radius') ? parseInt(searchParams.get('radius')!) : 5,
      startTime: searchParams.get('startTime') || undefined,
      endTime: searchParams.get('endTime') || undefined,
      vehicleType: searchParams.get('vehicleType') || 'any',
      priceRange: [
        parseFloat(searchParams.get('minPrice') || '0'),
        parseFloat(searchParams.get('maxPrice') || '100')
      ],
      amenities: searchParams.get('amenities')?.split(',') || []
    }

    // Build the query - using actual schema fields
    let query = supabase
      .from('listings')
      .select(`
        *,
        profiles!listings_host_id_fkey (
          full_name,
          avatar_url
        )
      `)
      .eq('is_available', true)

    // Add spatial filtering if coordinates are provided
    if (params.latitude && params.longitude && params.radius) {
      // Use simple bounding box filter for now
      const latDelta = params.radius / 111.32
      const lngDelta = params.radius / (111.32 * Math.cos(params.latitude * Math.PI / 180))
      
      query = query
        .gte('latitude', params.latitude - latDelta)
        .lte('latitude', params.latitude + latDelta)
        .gte('longitude', params.longitude - lngDelta)
        .lte('longitude', params.longitude + lngDelta)
    }

    // Apply price filters
    if (params.priceRange) {
      query = query
        .gte('price_per_hour', params.priceRange[0])
        .lte('price_per_hour', params.priceRange[1])
    }

    // Execute the query
    const { data: listings, error, count } = await query

    if (error) {
      console.error('Search error:', error)
      return NextResponse.json(
        { error: 'Failed to search listings' },
        { status: 500 }
      )
    }

    // Define the type for the listing with joined profile data
    type ListingWithProfile = Database['public']['Tables']['listings']['Row'] & {
      profiles: {
        full_name: string | null;
        avatar_url: string | null;
      } | null;
    };

    // Transform the data to match the frontend interface
    const transformedListings = (listings as ListingWithProfile[] || []).map(listing => {
      const listingData = listing as any; // Temporary any to access dynamic properties
      
      return {
        id: listingData.id,
        title: listingData.title || 'Untitled Listing',
        description: listingData.description || '',
        latitude: listingData.latitude || 0,
        longitude: listingData.longitude || 0,
        price_per_hour: listingData.price_per_hour || 0,
        price_per_day: listingData.price_per_day || 0,
        rating: 4.5, // Default rating
        review_count: 0, // Default review count
        amenities: Array.isArray(listingData.amenities) ? listingData.amenities : [],
        images: Array.isArray(listingData.photos) ? listingData.photos : [],
        vehicle_type: 'car', // Default vehicle type
        size_category: 'regular', // Default size category
        is_available: Boolean(listingData.is_available),
        host: {
          name: listing.profiles?.full_name || 'Anonymous Host',
          avatar_url: listing.profiles?.avatar_url || null,
          rating: 4.5 // Default rating
        },
        location_description: listingData.address || '',
        distance_km: params.latitude && params.longitude && listingData.latitude && listingData.longitude
          ? calculateDistance(
              params.latitude, 
              params.longitude, 
              listingData.latitude, 
              listingData.longitude
            )
          : undefined,
        availability_status: listingData.is_available ? 'available' : 'busy' as const
      };
    });

    return NextResponse.json({
      data: transformedListings,
      total: transformedListings.length,
      params
    })

  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper function to calculate distance between two points
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}
