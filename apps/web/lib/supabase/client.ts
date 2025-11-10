import { createClient } from '@supabase/supabase-js'
import { Database } from '../../types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Re-export Database type for use in other files
export type { Database } from '../../types/database'

// Database types for TypeScript
export type Tables<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = 
  Database['public']['Enums'][T]

// Type helpers
export type Profile = Tables<'profiles'>
export type Listing = Tables<'listings'>
export type Booking = Tables<'bookings'>
export type HostProfile = Tables<'host_profiles'>
export type VehicleType = Tables<'vehicle_types'>

// Auth types
export type User = {
  id: string
  email?: string
  user_metadata?: {
    full_name?: string
    avatar_url?: string
  }
  app_metadata?: {
    role?: string
  }
}

// Auth state type
export type AuthState = {
  user: User | null
  profile: Profile | null
  loading: boolean
  error: string | null
}
