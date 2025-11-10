'use client'

import React, { useState, useCallback, useRef } from 'react'

interface SearchInterfaceProps {
  onSearch: (searchParams: SearchParams) => void
  onLocationDetected?: (location: { lat: number; lng: number; address: string }) => void
  className?: string
}

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

export function EnhancedSearchInterface({ onSearch, onLocationDetected, className = '' }: SearchInterfaceProps) {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    location: '',
    latitude: null,
    longitude: null,
    radius: 5, // km
    startTime: '',
    endTime: '',
    priceRange: [0, 100],
    vehicleType: 'any',
    amenities: []
  })
  
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Geolocation and address detection
  const detectCurrentLocation = useCallback(async () => {
    setIsLoadingLocation(true)
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords
          
          // Use reverse geocoding to get address
          try {
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            )
            const data = await response.json()
            const address = data.display_name || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
            
            setSearchParams(prev => ({
              ...prev,
              latitude,
              longitude,
              location: address
            }))
            
            onLocationDetected?.({ lat: latitude, lng: longitude, address })
          } catch (error) {
            console.error('Reverse geocoding error:', error)
            setSearchParams(prev => ({
              ...prev,
              latitude,
              longitude,
              location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
            }))
            
            onLocationDetected?.({ lat: latitude, lng: longitude, address: 'Current Location' })
          }
        }, (error) => {
          console.error('Geolocation error:', error)
          alert('Unable to get your location. Please enable location services and try again.')
        })
      } else {
        alert('Geolocation is not supported by this browser.')
      }
    } catch (error) {
      console.error('Location detection error:', error)
      alert('Failed to detect location. Please try again.')
    } finally {
      setIsLoadingLocation(false)
    }
  }, [onLocationDetected])

  // Handle search
  const handleSearch = () => {
    if (!searchParams.location) {
      alert('Please enter a location')
      return
    }
    
    onSearch(searchParams)
  }

  // Handle location input change
  const handleLocationChange = (value: string) => {
    setSearchParams(prev => ({
      ...prev,
      location: value
    }))
  }

  // Handle filter changes
  const handleFilterChange = (key: keyof SearchParams, value: any) => {
    setSearchParams(prev => ({
      ...prev,
      [key]: value
    }))
  }

  // Handle amenities toggle
  const handleAmenityToggle = (amenity: string) => {
    setSearchParams(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }))
  }

  const commonAmenities = [
    'covered',
    'security',
    '24_7_access',
    'camera',
    'valet',
    'accessible',
    'shuttle',
    'gated',
    'indoor',
    'outdoor'
  ]

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${className}`}>
      {/* Enhanced Main Search Bar */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Enhanced Location Input */}
        <div className="flex-1">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Where are you going?
          </label>
          <div className="relative">
            <input
              ref={searchInputRef}
              type="text"
              value={searchParams.location}
              onChange={(e) => handleLocationChange(e.target.value)}
              placeholder="Enter address, landmark, or city"
              className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
            <button
              onClick={detectCurrentLocation}
              disabled={isLoadingLocation}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all disabled:opacity-50"
              title="Use current location"
            >
              {isLoadingLocation ? (
                <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full" />
              ) : (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Enhanced Date/Time Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:max-w-xs">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Start Time
            </label>
            <input
              type="datetime-local"
              value={searchParams.startTime}
              onChange={(e) => handleFilterChange('startTime', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              End Time
            </label>
            <input
              type="datetime-local"
              value={searchParams.endTime}
              onChange={(e) => handleFilterChange('endTime', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Enhanced Search Button */}
        <div className="flex flex-col justify-end lg:min-w-[120px]">
          <button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span>Search</span>
          </button>
        </div>
      </div>

      {/* Enhanced Advanced Filters */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
        >
          <svg 
            className={`h-4 w-4 mr-2 transform transition-transform ${showFilters ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          {showFilters ? 'Hide' : 'Show'} Advanced Filters
          {searchParams.amenities.length > 0 && (
            <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
              {searchParams.amenities.length} selected
            </span>
          )}
        </button>

        {/* Enhanced Advanced Filters Panel */}
        {showFilters && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Enhanced Radius Filter */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Search Radius: {searchParams.radius} km
              </label>
              <div className="relative">
                <input
                  type="range"
                  min="1"
                  max="50"
                  step="1"
                  value={searchParams.radius}
                  onChange={(e) => handleFilterChange('radius', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1 km</span>
                  <span>50 km</span>
                </div>
              </div>
            </div>

            {/* Enhanced Price Range */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Max Price per Hour: ${searchParams.priceRange[1]}
              </label>
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={searchParams.priceRange[1]}
                  onChange={(e) => handleFilterChange('priceRange', [0, parseInt(e.target.value)])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>$0</span>
                  <span>$100+</span>
                </div>
              </div>
            </div>

            {/* Enhanced Vehicle Type */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Vehicle Type
              </label>
              <select
                value={searchParams.vehicleType}
                onChange={(e) => handleFilterChange('vehicleType', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
              >
                <option value="any">Any Vehicle</option>
                <option value="car">Car</option>
                <option value="suv">SUV</option>
                <option value="motorcycle">Motorcycle</option>
                <option value="truck">Truck</option>
                <option value="van">Van</option>
              </select>
            </div>

            {/* Enhanced Amenities */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Amenities
              </label>
              <div className="space-y-2 max-h-40 overflow-y-auto scrollbar-thin">
                {commonAmenities.map((amenity) => (
                  <label key={amenity} className="flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={searchParams.amenities.includes(amenity)}
                      onChange={() => handleAmenityToggle(amenity)}
                      className="mr-3 w-4 h-4 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-all"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors capitalize">
                      {amenity.replace('_', ' ')}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default EnhancedSearchInterface
