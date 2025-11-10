import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Database } from '../../../types/database'

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// GET - Fetch all listings for a host
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const hostId = searchParams.get('hostId')
    const status = searchParams.get('status') // active, inactive, pending

    let query = supabase
      .from('listings')
      .select('*')
      .order('created_at', { ascending: false })

    // Filter by host
    if (hostId) {
      query = query.eq('host_id', hostId)
    }

    // Filter by status
    if (status === 'active') {
      query = query.eq('is_active', true).eq('is_available', true)
    } else if (status === 'inactive') {
      query = query.eq('is_active', false)
    } else if (status === 'pending') {
      query = query.eq('verification_status', 'pending')
    }

    const { data, error } = await query

    if (error) {
      console.error('Fetch listings error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch listings' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data, total: data?.length || 0 })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create a new listing
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['host_id', 'title', 'address', 'price_per_hour']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Create listing
    const { data, error } = await supabase
      .from('listings')
      .insert({
        host_id: body.host_id,
        title: body.title,
        description: body.description || null,
        address: body.address,
        latitude: body.latitude || null,
        longitude: body.longitude || null,
        price_per_hour: body.price_per_hour,
        price_per_day: body.price_per_day || null,
        price_per_week: body.price_per_week || null,
        price_per_month: body.price_per_month || null,
        max_vehicle_height: body.max_vehicle_height || null,
        max_vehicle_width: body.max_vehicle_width || null,
        max_vehicle_length: body.max_vehicle_length || null,
        allowed_vehicle_types: body.allowed_vehicle_types || null,
        amenities: body.amenities || null,
        photos: body.photos || null,
        is_active: body.is_active !== undefined ? body.is_active : true,
        is_available: body.is_available !== undefined ? body.is_available : true,
        verification_status: 'pending',
        auto_approve_bookings: body.auto_approve_bookings !== undefined ? body.auto_approve_bookings : false
      })
      .select()
      .single()

    if (error) {
      console.error('Create listing error:', error)
      return NextResponse.json(
        { error: 'Failed to create listing' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
