'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '../../../lib/supabase/auth-context'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase/client'

export function VerifyPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleEmailVerification = async () => {
      try {
        // Check for URL parameters that indicate email confirmation
        const urlParams = new URLSearchParams(window.location.search)
        const accessToken = urlParams.get('access_token')
        const refreshToken = urlParams.get('refresh_token')
        const type = urlParams.get('type')
        
        if (type === 'signup' || type === 'email_confirmation') {
          if (accessToken && refreshToken) {
            // Set the session with the tokens from URL
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            })

            if (error) {
              throw error
            }

            if (data.user) {
              setStatus('success')
              setMessage('Email verified successfully! You are now signed in.')
              
              // Redirect to dashboard after 2 seconds
              setTimeout(() => {
                router.push('/dashboard')
              }, 2000)
            }
          } else {
            // For regular email confirmation (without tokens in URL)
            // The user will be automatically signed in by the auth state change
            setStatus('success')
            setMessage('Email verified successfully!')
            
            if (user) {
              setTimeout(() => {
                router.push('/dashboard')
              }, 2000)
            }
          }
        } else {
          // Check if user is already authenticated (email already verified)
          if (user) {
            setStatus('success')
            setMessage('Your email is already verified!')
            setTimeout(() => {
              router.push('/dashboard')
            }, 2000)
          } else {
            setStatus('error')
            setMessage('Invalid verification link. Please try signing up again.')
            setTimeout(() => {
              router.push('/auth')
            }, 3000)
          }
        }
      } catch (error) {
        console.error('Email verification error:', error)
        setStatus('error')
        setMessage('Email verification failed. Please try again.')
        setTimeout(() => {
          router.push('/auth')
        }, 3000)
      }
    }

    handleEmailVerification()
  }, [user, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            {status === 'loading' && (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            )}
            {status === 'success' && (
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
            {status === 'error' && (
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {status === 'loading' && 'Verifying Email...'}
            {status === 'success' && 'Email Verified!'}
            {status === 'error' && 'Verification Failed'}
          </h1>
          
          <p className="text-gray-600 mb-4">
            {message}
          </p>
          
          {status === 'loading' && (
            <p className="text-sm text-gray-500">
              Please wait while we verify your email address...
            </p>
          )}
          
          {status === 'success' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Redirecting you to the dashboard...
              </p>
              <button
                onClick={() => router.push('/dashboard')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
              >
                Go to Dashboard
              </button>
            </div>
          )}
          
          {status === 'error' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                You will be redirected to the sign-in page...
              </p>
              <button
                onClick={() => router.push('/auth')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
              >
                Go to Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default VerifyPage
