/**
 * Real-Time Posture Polling Hook
 * Fetches posture data from Python backend and updates store
 */

'use client'

import { useEffect } from 'react'
import { usePostureStore } from '@/stores/posture-store'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050'

interface BackendPostureData {
  status: string
  distance: number
  calibrated: boolean
  timestamp: number
  frame_count?: number
  person_detected?: boolean
}

export function usePosturePolling(isConnected: boolean, demoMode: boolean) {
  const updatePosture = usePostureStore((state) => state.updatePosture)
  const setCalibrated = usePostureStore((state) => state.setCalibrated)
  
  useEffect(() => {
    // Only poll when camera is connected and NOT in demo mode
    if (!isConnected || demoMode) {
      return
    }
    
    console.log('🔄 Starting posture polling...')
    
    // Poll every 500ms (2 times per second)
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/posture/current`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch posture data')
        }
        
        const data: BackendPostureData = await response.json()
        
        // If no person detected, don't update posture (keep previous state)
        if (data.person_detected === false) {
          console.log('⏸️ No person detected - pausing updates')
          return
        }
        
        // Convert Python status to our score system
        const score = convertStatusToScore(data.status, data.distance)
        const status = convertStatusToEnum(data.status)
        
        // Update calibration state
        if (data.calibrated) {
          setCalibrated(true)
        }
        
        // Update posture in store
        updatePosture({
          timestamp: Date.now(),
          landmarks: [], // We don't have landmarks in browser
          score: {
            overall: score,
            status: status,
            alignment: score,
            distance: data.distance,
          },
          alerts: getAlerts(data.status),
        })
        
        // Log for debugging
        console.log('📊 Posture update:', {
          status: data.status,
          score,
          distance: data.distance.toFixed(2),
        })
        
      } catch (error) {
        console.error('❌ Failed to fetch posture data:', error)
      }
    }, 500) // Poll every 500ms
    
    return () => {
      console.log('🛑 Stopping posture polling')
      clearInterval(interval)
    }
  }, [isConnected, demoMode, updatePosture, setCalibrated])
}

/**
 * Convert Python status string to score (0-100)
 */
function convertStatusToScore(status: string, distance: number): number {
  const statusUpper = status.toUpperCase()
  
  if (statusUpper.includes('CALIBRATE')) {
    return 0
  }
  
  if (statusUpper.includes('GOOD POSTURE')) {
    // Good posture: 80-100 based on how close to baseline
    // Smaller distance = better score
    return Math.max(80, Math.min(100, 100 - distance * 2))
  }
  
  if (statusUpper.includes('SLOUCHING')) {
    // Slouching: 0-50 based on how bad
    // Larger distance = worse score
    return Math.max(0, Math.min(50, 50 - distance))
  }
  
  // Default to middle
  return 50
}

/**
 * Convert Python status to our status enum
 */
function convertStatusToEnum(status: string): 'good' | 'warning' | 'bad' | 'unknown' {
  const statusUpper = status.toUpperCase()
  
  if (statusUpper.includes('GOOD POSTURE')) {
    return 'good'
  }
  
  if (statusUpper.includes('SLOUCHING')) {
    return 'bad'
  }
  
  if (statusUpper.includes('CALIBRATE')) {
    return 'unknown'
  }
  
  return 'warning'
}

/**
 * Get alerts based on status
 */
function getAlerts(status: string): string[] {
  const statusUpper = status.toUpperCase()
  const alerts: string[] = []
  
  if (statusUpper.includes('SLOUCHING')) {
    alerts.push('Poor posture detected')
    alerts.push('Sit up straight')
  }
  
  if (statusUpper.includes('CALIBRATE')) {
    alerts.push('Calibration needed')
  }
  
  return alerts
}