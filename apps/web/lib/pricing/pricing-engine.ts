/**
 * Pricing Engine for ParkNow
 * Handles all pricing calculations including base rates, discounts, fees, and dynamic pricing
 */

export interface PricingInput {
  baseHourlyRate: number
  baseDailyRate?: number
  baseWeeklyRate?: number
  baseMonthlyRate?: number
  startDate: Date
  endDate: Date
  isWeekend?: boolean
  isPeakHour?: boolean
  demandMultiplier?: number
  discountCode?: string
}

export interface PricingBreakdown {
  baseAmount: number
  discountAmount: number
  serviceFee: number
  taxes: number
  totalAmount: number
  duration: {
    hours: number
    days: number
  }
  appliedDiscounts: string[]
}

export interface PricingRules {
  serviceFeePercentage: number // e.g., 0.15 for 15%
  taxPercentage: number // e.g., 0.18 for 18% GST
  weekendMultiplier: number // e.g., 1.2 for 20% increase
  peakHourMultiplier: number // e.g., 1.3 for 30% increase
  dailyDiscountPercentage: number // e.g., 0.1 for 10% off
  weeklyDiscountPercentage: number // e.g., 0.15 for 15% off
  monthlyDiscountPercentage: number // e.g., 0.25 for 25% off
}

// Default pricing rules
const DEFAULT_PRICING_RULES: PricingRules = {
  serviceFeePercentage: 0.15, // 15% service fee
  taxPercentage: 0.18, // 18% GST (India)
  weekendMultiplier: 1.2, // 20% weekend premium
  peakHourMultiplier: 1.3, // 30% peak hour premium
  dailyDiscountPercentage: 0.1, // 10% discount for daily bookings
  weeklyDiscountPercentage: 0.15, // 15% discount for weekly bookings
  monthlyDiscountPercentage: 0.25, // 25% discount for monthly bookings
}

/**
 * Calculate the duration between two dates
 */
export function calculateDuration(startDate: Date, endDate: Date) {
  const diffMs = endDate.getTime() - startDate.getTime()
  const hours = Math.ceil(diffMs / (1000 * 60 * 60))
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  
  return { hours, days }
}

/**
 * Determine if a date is a weekend
 */
export function isWeekend(date: Date): boolean {
  const day = date.getDay()
  return day === 0 || day === 6 // Sunday or Saturday
}

/**
 * Determine if a time is during peak hours (7 AM - 10 AM, 5 PM - 8 PM)
 */
export function isPeakHour(date: Date): boolean {
  const hour = date.getHours()
  return (hour >= 7 && hour < 10) || (hour >= 17 && hour < 20)
}

/**
 * Calculate base amount based on duration
 */
function calculateBaseAmount(
  hourlyRate: number,
  dailyRate: number | undefined,
  weeklyRate: number | undefined,
  monthlyRate: number | undefined,
  hours: number,
  days: number
): number {
  // Use monthly rate if booking is 30+ days
  if (days >= 30 && monthlyRate) {
    const months = Math.ceil(days / 30)
    return monthlyRate * months
  }
  
  // Use weekly rate if booking is 7+ days
  if (days >= 7 && weeklyRate) {
    const weeks = Math.ceil(days / 7)
    return weeklyRate * weeks
  }
  
  // Use daily rate if booking is 24+ hours
  if (hours >= 24 && dailyRate) {
    return dailyRate * days
  }
  
  // Default to hourly rate
  return hourlyRate * hours
}

/**
 * Apply length-of-stay discounts
 */
function applyLengthDiscounts(
  baseAmount: number,
  days: number,
  rules: PricingRules
): { amount: number; discounts: string[] } {
  const discounts: string[] = []
  let discountedAmount = baseAmount
  
  if (days >= 30) {
    const discount = baseAmount * rules.monthlyDiscountPercentage
    discountedAmount -= discount
    discounts.push(`Monthly discount (${rules.monthlyDiscountPercentage * 100}%)`)
  } else if (days >= 7) {
    const discount = baseAmount * rules.weeklyDiscountPercentage
    discountedAmount -= discount
    discounts.push(`Weekly discount (${rules.weeklyDiscountPercentage * 100}%)`)
  } else if (days >= 1) {
    const discount = baseAmount * rules.dailyDiscountPercentage
    discountedAmount -= discount
    discounts.push(`Daily discount (${rules.dailyDiscountPercentage * 100}%)`)
  }
  
  return { amount: discountedAmount, discounts }
}

/**
 * Apply dynamic pricing multipliers
 */
function applyDynamicPricing(
  amount: number,
  isWeekendBooking: boolean,
  isPeakHourBooking: boolean,
  demandMultiplier: number = 1.0,
  rules: PricingRules
): number {
  let finalAmount = amount
  
  // Apply weekend premium
  if (isWeekendBooking) {
    finalAmount *= rules.weekendMultiplier
  }
  
  // Apply peak hour premium
  if (isPeakHourBooking) {
    finalAmount *= rules.peakHourMultiplier
  }
  
  // Apply demand-based pricing
  finalAmount *= demandMultiplier
  
  return finalAmount
}

/**
 * Main pricing calculation function
 */
export function calculatePricing(
  input: PricingInput,
  rules: PricingRules = DEFAULT_PRICING_RULES
): PricingBreakdown {
  // Calculate duration
  const duration = calculateDuration(input.startDate, input.endDate)
  
  // Calculate base amount
  let baseAmount = calculateBaseAmount(
    input.baseHourlyRate,
    input.baseDailyRate,
    input.baseWeeklyRate,
    input.baseMonthlyRate,
    duration.hours,
    duration.days
  )
  
  // Apply length-of-stay discounts
  const { amount: discountedAmount, discounts } = applyLengthDiscounts(
    baseAmount,
    duration.days,
    rules
  )
  
  const discountAmount = baseAmount - discountedAmount
  
  // Apply dynamic pricing
  const finalBaseAmount = applyDynamicPricing(
    discountedAmount,
    input.isWeekend || isWeekend(input.startDate),
    input.isPeakHour || isPeakHour(input.startDate),
    input.demandMultiplier,
    rules
  )
  
  // Calculate service fee
  const serviceFee = finalBaseAmount * rules.serviceFeePercentage
  
  // Calculate taxes
  const subtotal = finalBaseAmount + serviceFee
  const taxes = subtotal * rules.taxPercentage
  
  // Calculate total
  const totalAmount = subtotal + taxes
  
  return {
    baseAmount: Math.round(finalBaseAmount * 100) / 100,
    discountAmount: Math.round(discountAmount * 100) / 100,
    serviceFee: Math.round(serviceFee * 100) / 100,
    taxes: Math.round(taxes * 100) / 100,
    totalAmount: Math.round(totalAmount * 100) / 100,
    duration,
    appliedDiscounts: discounts
  }
}

/**
 * Calculate instant quote for display
 */
export function getInstantQuote(
  hourlyRate: number,
  startDate: Date,
  endDate: Date
): string {
  const pricing = calculatePricing({
    baseHourlyRate: hourlyRate,
    startDate,
    endDate
  })
  
  return `$${pricing.totalAmount.toFixed(2)}`
}

/**
 * Format pricing breakdown for display
 */
export function formatPricingBreakdown(breakdown: PricingBreakdown): string {
  const lines = [
    `Base amount: $${breakdown.baseAmount.toFixed(2)}`,
  ]
  
  if (breakdown.discountAmount > 0) {
    lines.push(`Discount: -$${breakdown.discountAmount.toFixed(2)}`)
    breakdown.appliedDiscounts.forEach(discount => {
      lines.push(`  • ${discount}`)
    })
  }
  
  lines.push(
    `Service fee: $${breakdown.serviceFee.toFixed(2)}`,
    `Taxes: $${breakdown.taxes.toFixed(2)}`,
    `Total: $${breakdown.totalAmount.toFixed(2)}`
  )
  
  return lines.join('\n')
}

/**
 * Validate pricing input
 */
export function validatePricingInput(input: PricingInput): { valid: boolean; error?: string } {
  if (input.baseHourlyRate <= 0) {
    return { valid: false, error: 'Hourly rate must be greater than 0' }
  }
  
  if (input.endDate <= input.startDate) {
    return { valid: false, error: 'End date must be after start date' }
  }
  
  const duration = calculateDuration(input.startDate, input.endDate)
  if (duration.hours < 1) {
    return { valid: false, error: 'Minimum booking duration is 1 hour' }
  }
  
  return { valid: true }
}
