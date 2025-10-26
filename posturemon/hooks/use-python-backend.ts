/**
 * Python Backend Hook
 * Manages connection to Flask backend for camera control
 */

'use client'

import { useEffect, useState, useCallback } from 'react'
import { usePostureStore } from '@/stores/posture-store'
import * as api from '@/services/backend-api'

interface BackendState {
  isConnected: boolean
  isHealthy: boolean
  error: string | null
  lastCheck: number
}

export function usePythonBackend() {
  const [backendState, setBackendState] = useState<BackendState>({
    isConnected: false,
    isHealthy: false,
    error: null,
    lastCheck: 0,
  })
  
  const cameraConnected = usePostureStore((state) => state.cameraConnected)
  const demoMode = usePostureStore((state) => state.demoMode)
  const connectCamera = usePostureStore((state) => state.connectCamera)
  const disconnectCamera = usePostureStore((state) => state.disconnectCamera)
  const toggleDemoMode = usePostureStore((state) => state.toggleDemoMode)
  
  // Check backend health on mount
  useEffect(() => {
    checkHealth()
    
    // Check health every 30 seconds
    const interval = setInterval(checkHealth, 30000)
    
    return () => clearInterval(interval)
  }, [])
  
  /**
   * Check if backend is healthy
   */
  const checkHealth = useCallback(async () => {
    try {
      const isHealthy = await api.checkBackendHealth()
      setBackendState((prev) => ({
        ...prev,
        isHealthy,
        error: isHealthy ? null : 'Backend not responding',
        lastCheck: Date.now(),
      }))
      
      if (isHealthy) {
        console.log('✅ Backend is healthy')
      } else {
        console.warn('⚠️ Backend is not responding')
      }
    } catch (error) {
      console.error('❌ Health check failed:', error)
      setBackendState((prev) => ({
        ...prev,
        isHealthy: false,
        error: 'Failed to reach backend',
        lastCheck: Date.now(),
      }))
    }
  }, [])
  
  /**
   * Start camera on backend
   */
  const startCamera = useCallback(async () => {
    try {
      setBackendState((prev) => ({ ...prev, error: null }))
      
      const result = await api.startCamera()
      connectCamera() // Update frontend state
      
      setBackendState((prev) => ({
        ...prev,
        isConnected: true,
      }))
      
      console.log('✅ Camera started successfully')
      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to start camera'
      setBackendState((prev) => ({
        ...prev,
        error: errorMessage,
      }))
      console.error('❌ Failed to start camera:', error)
      throw error
    }
  }, [connectCamera])
  
  /**
   * Stop camera on backend
   */
  const stopCamera = useCallback(async () => {
    try {
      setBackendState((prev) => ({ ...prev, error: null }))
      
      const result = await api.stopCamera()
      disconnectCamera() // Update frontend state
      
      setBackendState((prev) => ({
        ...prev,
        isConnected: false,
      }))
      
      console.log('✅ Camera stopped successfully')
      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to stop camera'
      setBackendState((prev) => ({
        ...prev,
        error: errorMessage,
      }))
      console.error('❌ Failed to stop camera:', error)
      throw error
    }
  }, [disconnectCamera])
  
  /**
   * Toggle demo mode
   */
  const handleToggleDemoMode = useCallback(async () => {
    try {
      setBackendState((prev) => ({ ...prev, error: null }))
      
      const newDemoMode = !demoMode
      await api.toggleDemoMode(newDemoMode)
      toggleDemoMode() // Update frontend state
      
      console.log(`✅ Demo mode ${newDemoMode ? 'enabled' : 'disabled'}`)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to toggle demo mode'
      setBackendState((prev) => ({
        ...prev,
        error: errorMessage,
      }))
      console.error('❌ Failed to toggle demo mode:', error)
      throw error
    }
  }, [demoMode, toggleDemoMode])
  
  /**
   * Sync state with backend
   */
  const syncWithBackend = useCallback(async () => {
    try {
      const status = await api.getBackendStatus()
      
      // Update frontend state to match backend
      if (status.cameraConnected && !cameraConnected) {
        connectCamera()
      } else if (!status.cameraConnected && cameraConnected) {
        disconnectCamera()
      }
      
      setBackendState((prev) => ({
        ...prev,
        isConnected: status.cameraConnected,
      }))
      
      console.log('✅ Synced with backend:', status)
    } catch (error) {
      console.error('❌ Failed to sync with backend:', error)
    }
  }, [cameraConnected, connectCamera, disconnectCamera])
  
  return {
    // State
    ...backendState,
    cameraConnected,
    demoMode,
    
    // Actions
    startCamera,
    stopCamera,
    toggleDemoMode: handleToggleDemoMode,
    checkHealth,
    syncWithBackend,
  }
}