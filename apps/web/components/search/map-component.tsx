'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'

interface Listing {
  id: string
  title: string
  latitude: number
  longitude: number
  price_per_hour: number
  rating?: number
  amenities: string[]
  image_url?: string
  is_available: boolean
}

interface MapComponentProps {
  listings: Listing[]
  center: { lat: number; lng: number }
  onMarkerClick?: (listing: Listing) => void
  onMapClick?: (location: { lat: number; lng: number }) => void
  className?: string
  zoom?: number
}

declare global {
  interface Window {
    google: any
    initMap: () => void
  }
}

export function MapComponent({ 
  listings, 
  center, 
  onMarkerClick, 
  onMapClick, 
  className = '', 
  zoom = 13 
}: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const infoWindowRef = useRef<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Load Google Maps API
  useEffect(() => {
    if (window.google) {
      setIsLoaded(true)
      return
    }

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`
    script.async = true
    script.defer = true
    script.onload = () => {
      setIsLoaded(true)
    }
    document.head.appendChild(script)

    return () => {
      // Cleanup script if component unmounts
      const existingScript = document.querySelector(`script[src*="maps.googleapis.com"]`)
      if (existingScript) {
        document.head.removeChild(existingScript)
      }
    }
  }, [])

  // Initialize map
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return

    try {
      const map = new window.google.maps.Map(mapRef.current, {
        center: center,
        zoom: zoom,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          }
        ],
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
      })

      mapInstance.current = map

      // Create info window for markers
      infoWindowRef.current = new window.google.maps.InfoWindow()

      // Add click listener
      if (onMapClick) {
        map.addListener('click', (e: any) => {
          onMapClick({ lat: e.latLng.lat(), lng: e.latLng.lng() })
        })
      }

      setIsLoading(false)
    } catch (error) {
      console.error('Error initializing map:', error)
      setIsLoading(false)
    }
  }, [isLoaded, center, zoom, onMapClick])

  // Update markers when listings change
  useEffect(() => {
    if (!mapInstance.current || !window.google) return

    // Clear existing markers
    markersRef.current.forEach(marker => {
      marker.setMap(null)
    })
    markersRef.current = []

    // Add new markers
    listings.forEach((listing) => {
      try {
        const marker = new window.google.maps.Marker({
          position: { lat: listing.latitude, lng: listing.longitude },
          map: mapInstance.current,
          title: listing.title,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            fillColor: listing.is_available ? '#10B981' : '#EF4444',
            fillOpacity: 0.8,
            strokeColor: '#ffffff',
            strokeWeight: 2,
            scale: 8,
          },
        })

        // Create info window content
        const infoContent = `
          <div class="p-2 min-w-[200px]">
            <h3 class="font-semibold text-gray-900 mb-1">${listing.title}</h3>
            <p class="text-sm text-gray-600 mb-2">$${listing.price_per_hour}/hour</p>
            ${listing.rating ? `<p class="text-sm text-yellow-600">⭐ ${listing.rating}</p>` : ''}
            <div class="mt-2">
              <span class="inline-block px-2 py-1 text-xs rounded-full ${
                listing.is_available 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }">
                ${listing.is_available ? 'Available' : 'Unavailable'}
              </span>
            </div>
          </div>
        `

        // Add click listener to marker
        marker.addListener('click', () => {
          if (infoWindowRef.current) {
            infoWindowRef.current.setContent(infoContent)
            infoWindowRef.current.open(mapInstance.current, marker)
          }
          onMarkerClick?.(listing)
        })

        markersRef.current.push(marker)
      } catch (error) {
        console.error('Error creating marker for listing:', listing.id, error)
      }
    })

    // Adjust map bounds to fit all markers
    if (listings.length > 0) {
      const bounds = new window.google.maps.LatLngBounds()
      listings.forEach(listing => {
        bounds.extend({ lat: listing.latitude, lng: listing.longitude })
      })
      mapInstance.current.fitBounds(bounds)
    }
  }, [listings, onMarkerClick])

  if (!isLoaded) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing map...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <div ref={mapRef} className="w-full h-full rounded-lg" />
      
      {/* Map Controls Overlay */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md p-2">
        <div className="flex flex-col space-y-2">
          <button
            onClick={() => {
              if (navigator.geolocation && mapInstance.current) {
                navigator.geolocation.getCurrentPosition((position) => {
                  const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                  }
                  mapInstance.current.setCenter(pos)
                  mapInstance.current.setZoom(15)
                })
              }
            }}
            className="p-2 hover:bg-gray-100 rounded-md"
            title="Go to my location"
          >
            <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          
          <button
            onClick={() => {
              if (mapInstance.current) {
                const currentZoom = mapInstance.current.getZoom()
                mapInstance.current.setZoom(Math.min(currentZoom + 1, 20))
              }
            }}
            className="p-2 hover:bg-gray-100 rounded-md"
            title="Zoom in"
          >
            <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
          
          <button
            onClick={() => {
              if (mapInstance.current) {
                const currentZoom = mapInstance.current.getZoom()
                mapInstance.current.setZoom(Math.max(currentZoom - 1, 1))
              }
            }}
            className="p-2 hover:bg-gray-100 rounded-md"
            title="Zoom out"
          >
            <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default MapComponent
