'use client'

import React, { useState, useCallback, useEffect } from 'react'
import SearchInterface from '../../components/search/search-interface'
import { MapComponent } from '../../components/search/map-component'
import { ListingCard } from '../../components/search/listing-card'

interface SearchParams {
  location: string
  latitude: number | null
  longitude: number | null
  radius: number
  startTime: string
  endTime: string
  priceRange: [number, number]
  vehicleType: string
  amenities: string[]
}

interface Listing {
  id: string
  title: string
  description: string
  latitude: number
  longitude: number
  price_per_hour: number
  price_per_day?: number
  rating?: number
  review_count?: number
  amenities: string[]
  images: string[]
  vehicle_type: string
  size_category: 'compact' | 'regular' | 'large' | 'any'
  is_available: boolean
  host: {
    name: string
    avatar_url?: string
    rating?: number
  }
  location_description: string
  distance_km?: number
  availability_status: 'available' | 'limited' | 'busy'
}

export default function EnhancedSearchPage() {
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null)
  const [listings, setListings] = useState<Listing[]>([])
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')
  const [savedListings, setSavedListings] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  // Default center (New York City)
  const mapCenter = { lat: 40.7589, lng: -73.9851 }

  // Fade-in animation
  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleSearch = useCallback(async (params: SearchParams) => {
    setIsLoading(true)
    setError(null)
    setSearchParams(params)
    
    try {
      // Build query parameters
      const queryParams = new URLSearchParams()
      
      if (params.latitude && params.longitude) {
        queryParams.append('lat', params.latitude.toString())
        queryParams.append('lng', params.longitude.toString())
      }
      
      queryParams.append('radius', params.radius.toString())
      queryParams.append('minPrice', params.priceRange[0].toString())
      queryParams.append('maxPrice', params.priceRange[1].toString())
      queryParams.append('vehicleType', params.vehicleType)
      
      if (params.amenities.length > 0) {
        queryParams.append('amenities', params.amenities.join(','))
      }

      // Call the search API
      const response = await fetch(`/api/search?${queryParams}`)
      
      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }
      
      setListings(data.data || [])
      
    } catch (err) {
      console.error('Search error:', err)
      setError(err instanceof Error ? err.message : 'Search failed')
      setListings([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleLocationDetected = useCallback((location: { lat: number; lng: number; address: string }) => {
    console.log('Location detected:', location)
  }, [])

  const handleSaveListing = useCallback((listing: Listing) => {
    setSavedListings(prev => {
      const newSet = new Set(prev)
      if (newSet.has(listing.id)) {
        newSet.delete(listing.id)
      } else {
        newSet.add(listing.id)
      }
      return newSet
    })
  }, [])

  const handleBookListing = useCallback((listing: Listing) => {
    // TODO: Implement booking flow
    console.log('Book listing:', listing)
  }, [])

  const handleViewDetails = useCallback((listing: Listing) => {
    // TODO: Navigate to listing details page
    console.log('View details:', listing)
  }, [])

  const handleMarkerClick = useCallback((listing: Listing) => {
    console.log('Marker clicked:', listing)
  }, [])

  return (
    <div className={`min-h-screen transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {/* Enhanced Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-8">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">ParkNow</h1>
              </div>
              <nav className="hidden md:flex space-x-6">
                <a href="/" className="nav-link">Home</a>
                <a href="/search" className="nav-link nav-link-active">Find Parking</a>
                <a href="/dashboard" className="nav-link">My Bookings</a>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="text-sm text-gray-600 hidden sm:block">Profile</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Enhanced Search Interface */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Find Your Perfect Parking Spot</h2>
              <p className="text-gray-600">Search, compare, and book parking spaces in seconds</p>
            </div>
            <SearchInterface 
              onSearch={handleSearch}
              onLocationDetected={handleLocationDetected}
            />
          </div>
        </div>

        {/* Enhanced View Toggle & Results */}
        {searchParams && (
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {listings.length} parking spaces near {searchParams.location || 'your location'}
                </h2>
              </div>
              {isLoading && (
                <div className="flex items-center space-x-2 text-blue-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
                  <span className="text-sm font-medium">Searching...</span>
                </div>
              )}
              {error && (
                <div className="flex items-center space-x-2 text-red-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium">{error}</span>
                </div>
              )}
            </div>
            
            {/* Enhanced View Mode Toggle */}
            <div className="flex items-center space-x-1 bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'list' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  <span>List</span>
                </div>
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'map' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  <span>Map</span>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Enhanced Content */}
        {searchParams ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px]">
            {/* Enhanced List View */}
            <div className={`${viewMode === 'list' ? 'block' : 'hidden'} lg:block overflow-y-auto scrollbar-thin`}>
              <div className="space-y-4 pr-2">
                {listings.map((listing, index) => (
                  <div 
                    key={listing.id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <ListingCard
                      listing={listing}
                      onViewDetails={handleViewDetails}
                      onSave={handleSaveListing}
                      onBook={handleBookListing}
                      isSaved={savedListings.has(listing.id)}
                    />
                  </div>
                ))}
                
                {listings.length === 0 && !isLoading && (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0012 15c-2.34 0-4.47-.5-6.3-1.37L3.34 15.27a1 1 0 01-.17-1.414l2.5-2.5a1 1 0 011.414 0l2.5 2.5a1 1 0 01.17 1.414L8.17 15.27A7.962 7.962 0 0012 15z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No parking spaces found</h3>
                    <p className="text-gray-500 mb-4">Try adjusting your search criteria or expanding the search radius.</p>
                    <button
                      onClick={() => handleSearch({
                        location: '',
                        latitude: null,
                        longitude: null,
                        radius: 10,
                        startTime: '',
                        endTime: '',
                        priceRange: [0, 100],
                        vehicleType: 'any',
                        amenities: []
                      })}
                      className="btn-primary"
                    >
                      Reset Search
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Map View */}
            <div className={`${viewMode === 'map' ? 'block' : 'hidden'} lg:block bg-gray-100 rounded-xl overflow-hidden`}>
              <div className="h-full relative">
                <MapComponent
                  listings={listings}
                  center={mapCenter}
                  onMarkerClick={handleMarkerClick}
                  className="w-full h-full"
                />
                {listings.length > 0 && (
                  <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3">
                    <div className="text-sm text-gray-600">
                      {listings.length} parking spaces shown
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Enhanced Welcome State */
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Find Parking Near You</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-lg">
              Enter your destination above to start searching for available parking spaces in your area. 
              Our smart search will show you the best options with real-time availability.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold text-lg">1</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Search</h3>
                <p className="text-sm text-gray-600">Enter your destination to find nearby parking</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold text-lg">2</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Compare</h3>
                <p className="text-sm text-gray-600">View options on map or list with filters</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold text-lg">3</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Book</h3>
                <p className="text-sm text-gray-600">Reserve your spot with secure payment</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-400">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <span className="text-white font-semibold">ParkNow</span>
            </div>
            <p className="text-sm">The modern way to find parking spaces.</p>
            <p className="text-xs mt-2">&copy; 2025 ParkNow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
