/**
 * Python Backend API Service
 * Connects Next.js frontend to Flask backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050'

// ============ TYPES ============

export interface BackendStatus {
  cameraConnected: boolean
  demoMode: boolean
}

export interface PostureData {
  distance: number
  status: string
  timestamp: number
}

// ============ API METHODS ============

/**
 * Start the camera on the backend
 */
export async function startCamera(): Promise<{ status: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/camera/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      throw new Error(`Failed to start camera: ${response.statusText}`)
    }
    
    const data = await response.json()
    console.log('✅ Camera started:', data)
    return data
  } catch (error) {
    console.error('❌ Error starting camera:', error)
    throw error
  }
}

/**
 * Stop the camera on the backend
 */
export async function stopCamera(): Promise<{ status: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/camera/stop`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      throw new Error(`Failed to stop camera: ${response.statusText}`)
    }
    
    const data = await response.json()
    console.log('✅ Camera stopped:', data)
    return data
  } catch (error) {
    console.error('❌ Error stopping camera:', error)
    throw error
  }
}

/**
 * Toggle demo mode on the backend
 */
export async function toggleDemoMode(demoMode: boolean): Promise<{ demoMode: boolean }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/demo/toggle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ demoMode }),
    })
    
    if (!response.ok) {
      throw new Error(`Failed to toggle demo mode: ${response.statusText}`)
    }
    
    const data = await response.json()
    console.log('✅ Demo mode toggled:', data)
    return data
  } catch (error) {
    console.error('❌ Error toggling demo mode:', error)
    throw error
  }
}

/**
 * Get current backend status
 */
export async function getBackendStatus(): Promise<BackendStatus> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      throw new Error(`Failed to get status: ${response.statusText}`)
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('❌ Error getting backend status:', error)
    throw error
  }
}

/**
 * Check if backend is reachable
 */
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(5050), // 5 second timeout
    })
    
    return response.ok
  } catch (error) {
    console.error('❌ Backend health check failed:', error)
    return false
  }
}