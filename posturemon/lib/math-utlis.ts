/**
 * Math Utilities
 * Helper functions for calculations
 */

// ============ GEOMETRIC CALCULATIONS ============

/**
 * Calculate Euclidean distance between two points
 */
export function distance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
}

/**
 * Calculate 3D distance
 */
export function distance3D(
  x1: number,
  y1: number,
  z1: number,
  x2: number,
  y2: number,
  z2: number
): number {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2))
}

/**
 * Calculate angle between three points in degrees
 */
export function angle(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number
): number {
  const rad = Math.atan2(y3 - y2, x3 - x2) - Math.atan2(y1 - y2, x1 - x2)
  return (rad * 180) / Math.PI
}

/**
 * Calculate midpoint between two points
 */
export function midpoint(x1: number, y1: number, x2: number, y2: number): { x: number; y: number } {
  return {
    x: (x1 + x2) / 2,
    y: (y1 + y2) / 2,
  }
}

/**
 * Calculate slope of line between two points
 */
export function slope(x1: number, y1: number, x2: number, y2: number): number {
  if (x2 - x1 === 0) return Infinity
  return (y2 - y1) / (x2 - x1)
}

// ============ NORMALIZATION ============

/**
 * Normalize value to 0-1 range
 */
export function normalize(value: number, min: number, max: number): number {
  if (max === min) return 0
  return (value - min) / (max - min)
}

/**
 * Clamp value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/**
 * Map value from one range to another
 */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
}

// ============ STATISTICS ============

/**
 * Calculate average of array
 */
export function average(values: number[]): number {
  if (values.length === 0) return 0
  return values.reduce((sum, val) => sum + val, 0) / values.length
}

/**
 * Calculate median of array
 */
export function median(values: number[]): number {
  if (values.length === 0) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid]
}

/**
 * Calculate standard deviation
 */
export function standardDeviation(values: number[]): number {
  if (values.length === 0) return 0
  const avg = average(values)
  const squareDiffs = values.map((value) => Math.pow(value - avg, 2))
  const avgSquareDiff = average(squareDiffs)
  return Math.sqrt(avgSquareDiff)
}

/**
 * Calculate variance
 */
export function variance(values: number[]): number {
  if (values.length === 0) return 0
  const avg = average(values)
  const squareDiffs = values.map((value) => Math.pow(value - avg, 2))
  return average(squareDiffs)
}

/**
 * Find minimum value in array
 */
export function min(values: number[]): number {
  return Math.min(...values)
}

/**
 * Find maximum value in array
 */
export function max(values: number[]): number {
  return Math.max(...values)
}

// ============ SMOOTHING ============

/**
 * Exponential moving average
 */
export function ema(currentValue: number, previousEma: number, alpha: number): number {
  return alpha * currentValue + (1 - alpha) * previousEma
}

/**
 * Simple moving average over window
 */
export function sma(values: number[], windowSize: number): number {
  if (values.length === 0) return 0
  const window = values.slice(-windowSize)
  return average(window)
}

// ============ INTERPOLATION ============

/**
 * Linear interpolation
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t
}

/**
 * Smooth step interpolation
 */
export function smoothstep(start: number, end: number, t: number): number {
  const x = clamp((t - start) / (end - start), 0, 1)
  return x * x * (3 - 2 * x)
}

// ============ ROUNDING ============

/**
 * Round to specific decimal places
 */
export function roundTo(value: number, decimals: number): number {
  const multiplier = Math.pow(10, decimals)
  return Math.round(value * multiplier) / multiplier
}

/**
 * Round to nearest multiple
 */
export function roundToNearest(value: number, multiple: number): number {
  return Math.round(value / multiple) * multiple
}

// ============ COMPARISON ============

/**
 * Check if values are approximately equal
 */
export function approximately(a: number, b: number, epsilon: number = 0.001): boolean {
  return Math.abs(a - b) < epsilon
}

/**
 * Check if value is within range
 */
export function inRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max
}

// ============ WEIGHTED CALCULATIONS ============

/**
 * Calculate weighted average
 */
export function weightedAverage(values: number[], weights: number[]): number {
  if (values.length !== weights.length || values.length === 0) return 0
  
  const weightedSum = values.reduce((sum, val, i) => sum + val * weights[i], 0)
  const weightSum = weights.reduce((sum, weight) => sum + weight, 0)
  
  return weightedSum / weightSum
}

/**
 * Calculate weighted score with normalization
 */
export function weightedScore(
  scores: Record<string, number>,
  weights: Record<string, number>
): number {
  const keys = Object.keys(scores)
  const values = keys.map((key) => scores[key])
  const weightValues = keys.map((key) => weights[key] || 0)
  
  return weightedAverage(values, weightValues)
}

// ============ PERCENTAGE ============

/**
 * Calculate percentage
 */
export function percentage(value: number, total: number): number {
  if (total === 0) return 0
  return (value / total) * 100
}

/**
 * Calculate percentage change
 */
export function percentageChange(oldValue: number, newValue: number): number {
  if (oldValue === 0) return 0
  return ((newValue - oldValue) / oldValue) * 100
}

// ============ RANDOM ============

/**
 * Generate random number in range
 */
export function randomRange(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

/**
 * Generate random integer in range
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(randomRange(min, max + 1))
}