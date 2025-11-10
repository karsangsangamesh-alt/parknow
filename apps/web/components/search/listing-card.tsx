import React from 'react'
import { Listing } from '../../../app/search/page'

interface ListingCardProps {
  listing: Listing
  onViewDetails: (listing: Listing) => void
  onSave: (listing: Listing) => void
  onBook: (listing: Listing) => void
  isSaved: boolean
}

export function ListingCard({ listing, onViewDetails, onSave, onBook, isSaved }: ListingCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
            {listing.title}
          </h3>
          <button
            onClick={() => onSave(listing)}
            className={`p-2 rounded-full ${
              isSaved 
                ? 'text-red-500 bg-red-50 hover:bg-red-100' 
                : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
            }`}
          >
            <svg className="w-5 h-5" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {listing.description}
        </p>

        <div className="flex items-center space-x-4 mb-3 text-sm text-gray-500">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{listing.location_description}</span>
          </div>
          {listing.distance_km && (
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span>{listing.distance_km.toFixed(1)} km away</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {listing.amenities.slice(0, 3).map((amenity) => (
            <span
              key={amenity}
              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700"
            >
              {amenity.replace('_', ' ')}
            </span>
          ))}
          {listing.amenities.length > 3 && (
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-50 text-gray-500">
              +{listing.amenities.length - 3} more
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-bold text-gray-900">
              ${listing.price_per_hour}
            </span>
            <span className="text-sm text-gray-500">/hour</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              listing.availability_status === 'available' 
                ? 'bg-green-50 text-green-700' 
                : listing.availability_status === 'limited'
                ? 'bg-yellow-50 text-yellow-700'
                : 'bg-red-50 text-red-700'
            }`}>
              <div className={`w-2 h-2 rounded-full mr-1 ${
                listing.availability_status === 'available' 
                  ? 'bg-green-400' 
                  : listing.availability_status === 'limited'
                  ? 'bg-yellow-400'
                  : 'bg-red-400'
              }`} />
              {listing.availability_status}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            {listing.host.avatar_url ? (
              <img 
                src={listing.host.avatar_url} 
                alt={listing.host.name}
                className="w-6 h-6 rounded-full"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-xs font-medium text-gray-600">
                  {listing.host.name.charAt(0)}
                </span>
              </div>
            )}
            <span className="text-sm text-gray-600">{listing.host.name}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onViewDetails(listing)}
              className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View Details
            </button>
            <button
              onClick={() => onBook(listing)}
              className="px-4 py-1 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
