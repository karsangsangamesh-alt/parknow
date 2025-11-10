export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          avatar_url: string | null
          role: 'host' | 'renter' | 'both'
          phone: string | null
          is_verified: boolean
          verification_status: 'pending' | 'approved' | 'rejected'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          role?: 'host' | 'renter' | 'both'
          phone?: string | null
          is_verified?: boolean
          verification_status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          role?: 'host' | 'renter' | 'both'
          phone?: string | null
          is_verified?: boolean
          verification_status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
          updated_at?: string
        }
      }
      host_profiles: {
        Row: {
          id: string
          user_id: string
          business_name: string | null
          business_type: 'individual' | 'business' | 'enterprise' | null
          tax_id: string | null
          bank_account_info: Record<string, any> | null
          payout_email: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          business_name?: string | null
          business_type?: 'individual' | 'business' | 'enterprise' | null
          tax_id?: string | null
          bank_account_info?: Record<string, any> | null
          payout_email?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          business_name?: string | null
          business_type?: 'individual' | 'business' | 'enterprise' | null
          tax_id?: string | null
          bank_account_info?: Record<string, any> | null
          payout_email?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      vehicle_types: {
        Row: {
          id: string
          name: string
          description: string | null
          max_height: number | null
          max_width: number | null
          max_length: number | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          max_height?: number | null
          max_width?: number | null
          max_length?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          max_height?: number | null
          max_width?: number | null
          max_length?: number | null
          created_at?: string
        }
      }
      listings: {
        Row: {
          id: string
          host_id: string
          title: string
          description: string | null
          address: string
          latitude: number | null
          longitude: number | null
          price_per_hour: number
          price_per_day: number | null
          price_per_week: number | null
          price_per_month: number | null
          max_vehicle_height: number | null
          max_vehicle_width: number | null
          max_vehicle_length: number | null
          allowed_vehicle_types: any | null
          amenities: any | null
          photos: any | null
          is_active: boolean
          is_available: boolean
          verification_status: 'pending' | 'approved' | 'rejected'
          auto_approve_bookings: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          host_id: string
          title: string
          description?: string | null
          address: string
          latitude?: number | null
          longitude?: number | null
          price_per_hour: number
          price_per_day?: number | null
          price_per_week?: number | null
          price_per_month?: number | null
          max_vehicle_height?: number | null
          max_vehicle_width?: number | null
          max_vehicle_length?: number | null
          allowed_vehicle_types?: any | null
          amenities?: any | null
          photos?: any | null
          is_active?: boolean
          is_available?: boolean
          verification_status?: 'pending' | 'approved' | 'rejected'
          auto_approve_bookings?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          host_id?: string
          title?: string
          description?: string | null
          address?: string
          latitude?: number | null
          longitude?: number | null
          price_per_hour?: number
          price_per_day?: number | null
          price_per_week?: number | null
          price_per_month?: number | null
          max_vehicle_height?: number | null
          max_vehicle_width?: number | null
          max_vehicle_length?: number | null
          allowed_vehicle_types?: any | null
          amenities?: any | null
          photos?: any | null
          is_active?: boolean
          is_available?: boolean
          verification_status?: 'pending' | 'approved' | 'rejected'
          auto_approve_bookings?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          listing_id: string
          renter_id: string
          host_id: string
          start_time: string
          end_time: string
          total_hours: number | null
          base_amount: number | null
          service_fee: number | null
          taxes: number | null
          total_amount: number | null
          currency: string
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'refunded'
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
          payment_intent_id: string | null
          payment_method: string | null
          special_instructions: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          listing_id: string
          renter_id: string
          host_id: string
          start_time: string
          end_time: string
          total_hours?: number | null
          base_amount?: number | null
          service_fee?: number | null
          taxes?: number | null
          total_amount?: number | null
          currency?: string
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'refunded'
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          payment_intent_id?: string | null
          payment_method?: string | null
          special_instructions?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          listing_id?: string
          renter_id?: string
          host_id?: string
          start_time?: string
          end_time?: string
          total_hours?: number | null
          base_amount?: number | null
          service_fee?: number | null
          taxes?: number | null
          total_amount?: number | null
          currency?: string
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'refunded'
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          payment_intent_id?: string | null
          payment_method?: string | null
          special_instructions?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          booking_id: string
          reviewer_id: string
          reviewee_id: string
          rating: number | null
          comment: string | null
          is_visible: boolean
          created_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          reviewer_id: string
          reviewee_id: string
          rating?: number | null
          comment?: string | null
          is_visible?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          booking_id?: string
          reviewer_id?: string
          reviewee_id?: string
          rating?: number | null
          comment?: string | null
          is_visible?: boolean
          created_at?: string
        }
      }
      earnings: {
        Row: {
          id: string
          host_id: string
          booking_id: string
          gross_amount: number | null
          platform_fee: number | null
          net_amount: number | null
          payout_status: 'pending' | 'paid' | 'failed'
          payout_date: string | null
          payout_method: string | null
          created_at: string
        }
        Insert: {
          id?: string
          host_id: string
          booking_id: string
          gross_amount?: number | null
          platform_fee?: number | null
          net_amount?: number | null
          payout_status?: 'pending' | 'paid' | 'failed'
          payout_date?: string | null
          payout_method?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          host_id?: string
          booking_id?: string
          gross_amount?: number | null
          platform_fee?: number | null
          net_amount?: number | null
          payout_status?: 'pending' | 'paid' | 'failed'
          payout_date?: string | null
          payout_method?: string | null
          created_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          booking_id: string
          amount: number | null
          currency: string
          payment_provider: 'razorpay' | 'stripe'
          provider_transaction_id: string | null
          provider_payment_intent_id: string | null
          status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded'
          metadata: Record<string, any> | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          amount?: number | null
          currency?: string
          payment_provider: 'razorpay' | 'stripe'
          provider_transaction_id?: string | null
          provider_payment_intent_id?: string | null
          status?: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded'
          metadata?: Record<string, any> | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          booking_id?: string
          amount?: number | null
          currency?: string
          payment_provider?: 'razorpay' | 'stripe'
          provider_transaction_id?: string | null
          provider_payment_intent_id?: string | null
          status?: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded'
          metadata?: Record<string, any> | null
          created_at?: string
          updated_at?: string
        }
      }
      support_tickets: {
        Row: {
          id: string
          user_id: string
          subject: string
          description: string
          category: 'booking' | 'payment' | 'listing' | 'account' | 'technical' | 'other'
          priority: 'low' | 'medium' | 'high' | 'urgent'
          status: 'open' | 'in_progress' | 'resolved' | 'closed'
          assigned_to: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          subject: string
          description: string
          category?: 'booking' | 'payment' | 'listing' | 'account' | 'technical' | 'other'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          status?: 'open' | 'in_progress' | 'resolved' | 'closed'
          assigned_to?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          subject?: string
          description?: string
          category?: 'booking' | 'payment' | 'listing' | 'account' | 'technical' | 'other'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          status?: 'open' | 'in_progress' | 'resolved' | 'closed'
          assigned_to?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      notification_preferences: {
        Row: {
          id: string
          user_id: string
          email_bookings: boolean
          email_payments: boolean
          email_reviews: boolean
          email_marketing: boolean
          push_bookings: boolean
          push_payments: boolean
          push_reviews: boolean
          push_marketing: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          email_bookings?: boolean
          email_payments?: boolean
          email_reviews?: boolean
          email_marketing?: boolean
          push_bookings?: boolean
          push_payments?: boolean
          push_reviews?: boolean
          push_marketing?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          email_bookings?: boolean
          email_payments?: boolean
          email_reviews?: boolean
          email_marketing?: boolean
          push_bookings?: boolean
          push_payments?: boolean
          push_reviews?: boolean
          push_marketing?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      saved_listings: {
        Row: {
          id: string
          user_id: string
          listing_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          listing_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          listing_id?: string
          created_at?: string
        }
      }
      availability_calendar: {
        Row: {
          id: string
          listing_id: string
          date: string
          is_available: boolean
          blocked_reason: string | null
          created_at: string
        }
        Insert: {
          id?: string
          listing_id: string
          date: string
          is_available?: boolean
          blocked_reason?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          listing_id?: string
          date?: string
          is_available?: boolean
          blocked_reason?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_booking_conflicts: {
        Args: {
          p_listing_id: string
          p_start_time: string
          p_end_time: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
