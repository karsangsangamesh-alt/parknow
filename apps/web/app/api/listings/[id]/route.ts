import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Database } from '../../../../types/database'

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// GET - Fetch a single listing
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabase
      .from('listings')
      .select(`
        *,
        profiles:profiles!listings_host_id_fkey (
          full_name,
          avatar_url,
          phone
        )
      `)
      .eq('id', params.id)
      .single()

    if (error) {
      console.error('Fetch listing error:', error)
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Update a listing
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    // Build update object (only include provided fields)
    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    // Add fields if provided
    if (body.title !== undefined) updateData.title = body.title
    if (body.description !== undefined) updateData.description = body.description
    if (body.address !== undefined) updateData.address = body.address
    if (body.latitude !== undefined) updateData.latitude = body.latitude
    if (body.longitude !== undefined) updateData.longitude = body.longitude
    if (body.price_per_hour !== undefined) updateData.price_per_hour = body.price_per_hour
    if (body.price_per_day !== undefined) updateData.price_per_day = body.price_per_day
    if (body.price_per_week !== undefined) updateData.price_per_week = body.price_per_week
    if (body.price_per_month !== undefined) updateData.price_per_month = body.price_per_month
    if (body.max_vehicle_height !== undefined) updateData.max_vehicle_height = body.max_vehicle_height
    if (body.max_vehicle_width !== undefined) updateData.max_vehicle_width = body.max_vehicle_width
    if (body.max_vehicle_length !== undefined) updateData.max_vehicle_length = body.max_vehicle_length
    if (body.allowed_vehicle_types !== undefined) updateData.allowed_vehicle_types = body.allowed_vehicle_types
    if (body.amenities !== undefined) updateData.amenities = body.amenities
    if (body.photos !== undefined) updateData.photos = body.photos
    if (body.is_active !== undefined) updateData.is_active = body.is_active
    if (body.is_available !== undefined) updateData.is_available = body.is_available
    if (body.auto_approve_bookings !== undefined) updateData.auto_approve_bookings = body.auto_approve_bookings

    const { data, error } = await supabase
      .from('listings')
      .update(updateData as any)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('Update listing error:', error)
      return NextResponse.json(
        { error: 'Failed to update listing' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Soft delete a listing
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Soft delete by setting is_active to false
    const { data, error } = await supabase
      .from('listings')
      .update({
        is_active: false,
        is_available: false,
        updated_at: new Date().toISOString()
      } as any)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('Delete listing error:', error)
      return NextResponse.json(
        { error: 'Failed to delete listing' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      message: 'Listing deleted successfully',
      data 
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
