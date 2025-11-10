'use client'

import React, { useState } from 'react'

interface AvailabilityCalendarProps {
  listingId: string
  onDateSelect?: (startDate: Date, endDate: Date) => void
  blockedDates?: Date[]
  bookedDates?: Date[]
  minBookingHours?: number
  maxBookingDays?: number
}

export function AvailabilityCalendar({
  listingId,
  onDateSelect,
  blockedDates = [],
  bookedDates = [],
  minBookingHours = 1,
  maxBookingDays = 30
}: AvailabilityCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null)
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null)
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null)

  // Get days in month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    return { daysInMonth, startingDayOfWeek, year, month }
  }

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth)

  // Check if date is blocked or booked
  const isDateBlocked = (date: Date) => {
    return blockedDates.some(blocked => 
      blocked.toDateString() === date.toDateString()
    )
  }

  const isDateBooked = (date: Date) => {
    return bookedDates.some(booked => 
      booked.toDateString() === date.toDateString()
    )
  }

  const isDatePast = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  const isDateInRange = (date: Date) => {
    if (!selectedStartDate || !hoveredDate) return false
    const start = selectedStartDate.getTime()
    const end = hoveredDate.getTime()
    const current = date.getTime()
    return current > Math.min(start, end) && current < Math.max(start, end)
  }

  const isDateSelected = (date: Date) => {
    if (selectedStartDate && date.toDateString() === selectedStartDate.toDateString()) return true
    if (selectedEndDate && date.toDateString() === selectedEndDate.toDateString()) return true
    return false
  }

  // Handle date click
  const handleDateClick = (day: number) => {
    const clickedDate = new Date(year, month, day)
    
    if (isDatePast(clickedDate) || isDateBlocked(clickedDate) || isDateBooked(clickedDate)) {
      return
    }

    if (!selectedStartDate) {
      setSelectedStartDate(clickedDate)
      setSelectedEndDate(null)
    } else if (!selectedEndDate) {
      if (clickedDate > selectedStartDate) {
        setSelectedEndDate(clickedDate)
        onDateSelect?.(selectedStartDate, clickedDate)
      } else {
        setSelectedStartDate(clickedDate)
        setSelectedEndDate(null)
      }
    } else {
      setSelectedStartDate(clickedDate)
      setSelectedEndDate(null)
    }
  }

  // Navigate months
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1))
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  // Generate calendar days
  const calendarDays = []
  
  // Add empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="h-12" />)
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day)
    const isPast = isDatePast(date)
    const isBlocked = isDateBlocked(date)
    const isBooked = isDateBooked(date)
    const isSelected = isDateSelected(date)
    const inRange = isDateInRange(date)
    const isDisabled = isPast || isBlocked || isBooked

    calendarDays.push(
      <button
        key={day}
        onClick={() => handleDateClick(day)}
        onMouseEnter={() => selectedStartDate && !selectedEndDate && setHoveredDate(date)}
        onMouseLeave={() => setHoveredDate(null)}
        disabled={isDisabled}
        className={`
          h-12 rounded-lg text-sm font-medium transition-all
          ${isDisabled 
            ? 'text-gray-300 cursor-not-allowed line-through' 
            : 'hover:bg-blue-50 cursor-pointer'
          }
          ${isSelected 
            ? 'bg-blue-600 text-white hover:bg-blue-700' 
            : ''
          }
          ${inRange 
            ? 'bg-blue-100 text-blue-900' 
            : ''
          }
          ${isBooked && !isSelected 
            ? 'bg-red-50 text-red-600' 
            : ''
          }
          ${isBlocked && !isSelected 
            ? 'bg-gray-100 text-gray-400' 
            : ''
          }
        `}
      >
        {day}
      </button>
    )
  }

  return (
    <div className="bg-white rounded-lg p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={goToPreviousMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Previous month"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <h3 className="text-lg font-semibold text-gray-900">
          {monthNames[month]} {year}
        </h3>
        
        <button
          onClick={goToNextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Next month"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 h-8 flex items-center justify-center">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {calendarDays}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-6 border-t space-y-2">
        <div className="flex items-center text-sm">
          <div className="w-4 h-4 bg-blue-600 rounded mr-2"></div>
          <span className="text-gray-600">Selected</span>
        </div>
        <div className="flex items-center text-sm">
          <div className="w-4 h-4 bg-blue-100 rounded mr-2"></div>
          <span className="text-gray-600">In range</span>
        </div>
        <div className="flex items-center text-sm">
          <div className="w-4 h-4 bg-red-50 border border-red-200 rounded mr-2"></div>
          <span className="text-gray-600">Booked</span>
        </div>
        <div className="flex items-center text-sm">
          <div className="w-4 h-4 bg-gray-100 rounded mr-2"></div>
          <span className="text-gray-600">Blocked</span>
        </div>
      </div>

      {/* Selected Dates Display */}
      {selectedStartDate && (
        <div className="mt-6 pt-6 border-t">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Check-in:</span>
              <span className="font-medium text-gray-900">
                {selectedStartDate.toLocaleDateString()}
              </span>
            </div>
            {selectedEndDate && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Check-out:</span>
                <span className="font-medium text-gray-900">
                  {selectedEndDate.toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Clear Selection Button */}
      {(selectedStartDate || selectedEndDate) && (
        <button
          onClick={() => {
            setSelectedStartDate(null)
            setSelectedEndDate(null)
          }}
          className="mt-4 w-full py-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Clear Selection
        </button>
      )}
    </div>
  )
}
