'use client'

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { Session } from '@supabase/supabase-js'
import { supabase, Profile, AuthState, User, Database } from './client'

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ data: any; error: any }>
  signOut: () => Promise<{ error: any }>
  resetPassword: (email: string) => Promise<{ data: any; error: any }>
  updateProfile: (updates: Omit<Partial<Profile>, 'id' | 'created_at'>) => Promise<{ data: Profile | null; error: any }>
  getCurrentProfile: () => Promise<Profile | null>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Get user profile data
  const getCurrentProfile = useCallback(async (): Promise<Profile | null> => {
    if (!user) return null

    try {
      // Use maybeSingle() to avoid throwing on no results
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()

      if (error) {
        console.error('Error fetching profile:', error)
        setError(error.message)
        return null
      }

      // Update local state if profile exists
      if (data) {
        setProfile(data)
      }

      return data
    } catch (err) {
      console.error('Error in getCurrentProfile:', err)
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      return null
    }
  }, [user])

  // Update user profile
  const updateProfile = async (updates: Omit<Partial<Profile>, 'id' | 'created_at'>) => {
    if (!user) return { data: null, error: new Error('No user logged in') }

    try {
      // Optimized: Use maybeSingle() instead of single() to handle potential no-match scenarios gracefully
      // Add updated_at timestamp for audit trail
      const updatePayload = {
        ...updates,
        updated_at: new Date().toISOString()
      }

      // Supabase type inference issue with dynamic update payloads - the payload is type-safe at runtime
      const result = await supabase
        .from('profiles')
        // @ts-expect-error - TypeScript infers 'never' for the update parameter due to complex type inference
        .update(updatePayload)
        .eq('id', user.id)
        .select()
        .maybeSingle()

      const { data, error } = result

      if (error) {
        setError(error.message)
        return { data: null, error }
      }

      // Handle case where profile doesn't exist
      if (!data) {
        const noProfileError = new Error('Profile not found')
        setError(noProfileError.message)
        return { data: null, error: noProfileError }
      }

      setProfile(data)
      return { data, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      return { data: null, error: new Error(errorMessage) }
    }
  }

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        setError(error.message)
        return { data: null, error }
      }

      return { data, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      return { data: null, error: new Error(errorMessage) }
    } finally {
      setLoading(false)
    }
  }

  // Sign up with email and password
  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      })

      if (error) {
        setError(error.message)
        return { data: null, error }
      }

      return { data, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      return { data: null, error: new Error(errorMessage) }
    } finally {
      setLoading(false)
    }
  }

  // Sign out
  const signOut = async () => {
    try {
      setLoading(true)
      setError(null)

      const { error } = await supabase.auth.signOut()

      if (error) {
        setError(error.message)
        return { error }
      }

      setUser(null)
      setProfile(null)
      return { error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      return { error: new Error(errorMessage) }
    } finally {
      setLoading(false)
    }
  }

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (error) {
        setError(error.message)
        return { data: null, error }
      }

      return { data, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      return { data: null, error: new Error(errorMessage) }
    } finally {
      setLoading(false)
    }
  }

  // Handle auth state changes
  useEffect(() => {
    let mounted = true

    // Get initial session
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!mounted) return

      if (session?.user) {
        setUser(session.user as User)
        const profile = await getCurrentProfile()
        if (mounted) {
          setProfile(profile)
          setLoading(false)
        }
      } else {
        setUser(null)
        setProfile(null)
        setLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return

        setUser(session?.user as User ?? null)
        if (session?.user) {
          const profile = await getCurrentProfile()
          if (mounted) {
            setProfile(profile)
          }
        } else {
          setProfile(null)
        }
      }
    )

    // Cleanup subscription on unmount
    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [getCurrentProfile, user])

  const value: AuthContextType = {
    user,
    profile,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    getCurrentProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Hook to check if user has a specific role
export function useRole() {
  const { profile } = useAuth()
  
  return {
    isHost: profile?.role === 'host' || profile?.role === 'both',
    isRenter: profile?.role === 'renter' || profile?.role === 'both',
    isVerified: profile?.is_verified || false,
    role: profile?.role || null
  }
}
