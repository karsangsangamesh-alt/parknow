'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '../lib/supabase/auth-context'
import EntryModal from '../components/landing/entry-modal'

export default function EnhancedLandingPage() {
  const { user } = useAuth()
  const [showEntryModal, setShowEntryModal] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  // Auto-show modal after a delay for new visitors
  useEffect(() => {
    if (!user) {
      const timer = setTimeout(() => {
        setShowEntryModal(true)
      }, 3000) // Show after 3 seconds
      return () => clearTimeout(timer)
    }
  }, [user])

  // Simple fade-in animation
  useEffect(() => {
    setIsVisible(true)
  }, [])

  const stats = [
    { number: '10K+', label: 'Parking Spaces' },
    { number: '50K+', label: 'Happy Users' },
    { number: '100+', label: 'Cities' },
    { number: '24/7', label: 'Support' }
  ]

  const features = [
    {
      icon: '🔍',
      title: 'Easy Search',
      description: 'Find parking spaces near your destination with real-time availability'
    },
    {
      icon: '💳',
      title: 'Instant Booking',
      description: 'Reserve your spot in seconds with secure payment processing'
    },
    {
      icon: '🛡️',
      title: 'Verified Hosts',
      description: 'All parking spaces are verified and reviewed by real users'
    },
    {
      icon: '📱',
      title: 'Mobile First',
      description: 'Book on the go with our responsive web app and PWA'
    }
  ]

  return (
    <div className={`min-h-screen transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">ParkNow</h1>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <a href="/dashboard" className="text-gray-700 hover:text-blue-600">
                  Dashboard
                </a>
              ) : (
                <a href="/auth" className="text-gray-700 hover:text-blue-600">
                  Sign In
                </a>
              )}
              <button
                onClick={() => setShowEntryModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Find Parking
              <span className="text-blue-600"> Made Simple</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Book verified parking spaces in seconds. Save time, save money, and never circle the block again.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => setShowEntryModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold"
              >
                Find Parking Now
              </button>
              <button
                onClick={() => setShowEntryModal(true)}
                className="border border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold"
              >
                List Your Space
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose ParkNow?
            </h2>
            <p className="text-xl text-gray-600">
              The modern way to find and book parking spaces
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Three simple steps to your perfect parking spot
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Search</h3>
              <p className="text-gray-600">Enter your destination and browse available parking spaces</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Book</h3>
              <p className="text-gray-600">Select your spot and complete the booking with secure payment</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Park</h3>
              <p className="text-gray-600">Navigate to your spot and enjoy hassle-free parking</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Find Your Perfect Parking Spot?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of users who trust ParkNow for their parking needs
          </p>
          <button
            onClick={() => setShowEntryModal(true)}
            className="bg-white hover:bg-gray-100 text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold"
          >
            Get Started Today
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">ParkNow</h3>
              <p className="text-gray-400">The modern way to find parking spaces.</p>
            </div>
            
            <div>
              <h4 className="text-white text-sm font-semibold mb-4">PRODUCT</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">How it works</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Mobile app</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white text-sm font-semibold mb-4">SUPPORT</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/help" className="hover:text-white">Help center</a></li>
                <li><a href="/contact" className="hover:text-white">Contact us</a></li>
                <li><a href="/faq" className="hover:text-white">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white text-sm font-semibold mb-4">LEGAL</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/terms" className="hover:text-white">Terms of service</a></li>
                <li><a href="/privacy" className="hover:text-white">Privacy policy</a></li>
                <li><a href="/cookies" className="hover:text-white">Cookie policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 ParkNow. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Entry Modal */}
      <EntryModal 
        isOpen={showEntryModal} 
        onClose={() => setShowEntryModal(false)} 
      />
    </div>
  )
}
