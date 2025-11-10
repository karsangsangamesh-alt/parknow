'use client'

import React, { useState } from 'react'
import { useAuth } from '../../lib/supabase/auth-context'

interface EntryModalProps {
  isOpen: boolean
  onClose: () => void
}

export function EnhancedEntryModal({ isOpen, onClose }: EntryModalProps) {
  const { user } = useAuth()

  const handleRoleSelection = (role: 'host' | 'renter' | 'guest') => {
    if (!user) {
      // Redirect to auth page
      window.location.href = '/auth'
      return
    }

    // Handle role-based navigation
    switch (role) {
      case 'host':
        window.location.href = '/host/onboard'
        break
      case 'renter':
        window.location.href = '/search'
        break
      case 'guest':
        window.location.href = '/search'
        break
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl transform animate-slide-up">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to ParkNow</h2>
          <p className="text-gray-600">How would you like to get started?</p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => handleRoleSelection('renter')}
            className="w-full p-5 text-left border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 hover:shadow-md transition-all duration-300 group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 group-hover:bg-blue-200 rounded-xl flex items-center justify-center transition-colors">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-lg">Find Parking</h3>
                <p className="text-sm text-gray-600 mt-1">Search and book parking spaces near you</p>
                <div className="flex items-center mt-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  <span className="text-xs text-green-600 font-medium">Instant booking available</span>
                </div>
              </div>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          <button
            onClick={() => handleRoleSelection('host')}
            className="w-full p-5 text-left border-2 border-gray-200 rounded-xl hover:border-green-300 hover:bg-green-50 hover:shadow-md transition-all duration-300 group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 group-hover:bg-green-200 rounded-xl flex items-center justify-center transition-colors">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-lg">List Your Space</h3>
                <p className="text-sm text-gray-600 mt-1">Rent out your parking space and earn money</p>
                <div className="flex items-center mt-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                  <span className="text-xs text-yellow-600 font-medium">Start earning today</span>
                </div>
              </div>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-green-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          <button
            onClick={() => handleRoleSelection('guest')}
            className="w-full p-5 text-left border-2 border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 hover:shadow-md transition-all duration-300 group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 group-hover:bg-purple-200 rounded-xl flex items-center justify-center transition-colors">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-lg">Browse as Guest</h3>
                <p className="text-sm text-gray-600 mt-1">Explore available parking without signing up</p>
                <div className="flex items-center mt-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                  <span className="text-xs text-blue-600 font-medium">No commitment required</span>
                </div>
              </div>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors px-4 py-2 hover:bg-gray-50 rounded-lg"
          >
            Maybe later
          </button>
        </div>
        
        {user ? (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="text-center">
              <p className="text-sm text-gray-600">Signed in as</p>
              <p className="text-sm font-medium text-gray-900">{user.email}</p>
            </div>
          </div>
        ) : (
          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-600">New to ParkNow?</p>
            <button
              onClick={() => {
                onClose()
                setTimeout(() => {
                  window.location.href = '/auth'
                }, 300)
              }}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
            >
              Create an account
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default EnhancedEntryModal
