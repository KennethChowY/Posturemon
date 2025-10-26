/**
 * Home Screen - Main Hub
 * Shows pet, camera controls, stats, and quest button
 * WITH CALIBRATION BUTTON
 */

'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PetDisplay } from '@/components/pet/pet-display'
import { WebcamPreview } from '@/components/webcam-preview'
import { usePostureStore } from '@/stores/posture-store'
import { usePythonBackend } from '@/hooks/use-python-backend'
import { usePosturePolling } from '@/hooks/use-posture-polling'
import { Camera, CameraOff, Zap, Award, Target, AlertCircle, CheckCircle, Crosshair } from 'lucide-react'
import { useState } from 'react'

interface HomeScreenProps {
  onStartQuest: () => void
}

export function HomeScreen({ onStartQuest }: HomeScreenProps) {
  const [calibrating, setCalibrating] = useState(false)
  
  // Get state from store
  const player = usePostureStore((state) => state.player)
  const currentPosture = usePostureStore((state) => state.currentPosture)
  const isCalibrated = usePostureStore((state) => state.isCalibrated)
  const setCalibrated = usePostureStore((state) => state.setCalibrated)
  
  // Python backend integration
  const {
    isHealthy,
    cameraConnected,
    demoMode,
    error,
    startCamera,
    stopCamera,
    toggleDemoMode: handleToggleDemoMode,
  } = usePythonBackend()
  
  // Real-time posture polling from Python backend
  usePosturePolling(cameraConnected, demoMode)
  
  // Calculate score
  const score = currentPosture?.score.overall ?? 0
  const status = currentPosture?.score.status ?? 'unknown'
  
  // Handle camera button click
  const handleCameraToggle = async () => {
    try {
      if (cameraConnected) {
        await stopCamera()
      } else {
        await startCamera()
      }
    } catch (error) {
      console.error('Failed to toggle camera:', error)
    }
  }
  
  // Handle calibration button click
  const handleCalibrate = async () => {
    try {
      setCalibrating(true)
      
      // If already calibrated, reset first
      if (isCalibrated) {
        console.log('🔄 Resetting calibration...')
        setCalibrated(false)
        // Wait a moment for state to update
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      
      const response = await fetch('http://localhost:5050/api/camera/calibrate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error('Failed to calibrate')
      }
      
      const data = await response.json()
      console.log('✅ Calibration requested:', data)
      
      // Update frontend state after a short delay to allow backend to process
      setTimeout(() => {
        setCalibrated(true)
        setCalibrating(false)
        console.log('✅ Calibration complete!')
      }, 500)
      
    } catch (error) {
      console.error('❌ Calibration failed:', error)
      setCalibrating(false)
    }
  }
  
  return (
    <div className="space-y-6">
      {/* Backend Status Banner */}
      {!isHealthy && (
        <Card className="p-4 bg-destructive/10 border-destructive">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <div className="flex-1">
              <p className="text-sm font-medium text-destructive">
                Backend Not Connected
              </p>
              <p className="text-xs text-muted-foreground">
                Make sure Python backend is running on http://localhost:5050
              </p>
            </div>
          </div>
        </Card>
      )}
      
      {/* Connection Success Banner */}
      {isHealthy && cameraConnected && (
        <Card className="p-4 bg-secondary/10 border-secondary">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-secondary" />
            <div className="flex-1">
              <p className="text-sm font-medium">
                Camera Connected
              </p>
              <p className="text-xs text-muted-foreground">
                Real-time posture detection active
              </p>
            </div>
          </div>
        </Card>
      )}
      
      {/* Calibration Needed Banner */}
      {cameraConnected && !isCalibrated && !demoMode && (
        <Card className="p-4 bg-accent/10 border-accent">
          <div className="flex items-center gap-3">
            <Crosshair className="h-5 w-5 text-accent" />
            <div className="flex-1">
              <p className="text-sm font-medium">
                Calibration Needed
              </p>
              <p className="text-xs text-muted-foreground">
                Sit with good posture and click &quot;Calibrate&quot; to set your baseline
              </p>
            </div>
            <Button 
              onClick={handleCalibrate}
              disabled={calibrating}
              size="sm"
              variant="default"
            >
              {calibrating ? 'Calibrating...' : 'Calibrate Now'}
            </Button>
          </div>
        </Card>
      )}
      
      {/* Calibrated Success Banner */}
      {isCalibrated && !demoMode && (
        <Card className="p-4 bg-green-500/10 border-green-500">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <div className="flex-1">
              <p className="text-sm font-medium text-green-500">
                Calibrated Successfully!
              </p>
              <p className="text-xs text-muted-foreground">
                Your baseline posture is set. Maintain good posture to keep your pet happy!
              </p>
            </div>
          </div>
        </Card>
      )}
      
      {/* Error Banner */}
      {error && (
        <Card className="p-4 bg-destructive/10 border-destructive">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        </Card>
      )}
      
      {/* Main Content Grid - Pet + Webcam Preview */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Pet (spans 2 columns on large screens) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Pet Card */}
          <Card className="p-6">
            {/* Header with Level, XP, and Mode */}
            <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-4">
                {/* Level */}
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-accent" />
                  <span className="font-mono text-sm">Level {player.level}</span>
                </div>
                
                {/* XP */}
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <span className="font-mono text-sm">{player.xp} XP</span>
                </div>
              </div>
              
              {/* Mode Badge */}
              <div className="flex items-center gap-2">
                <Badge variant={demoMode ? "secondary" : "default"}>
                  {demoMode ? "Demo Mode" : cameraConnected ? "Live Camera" : "Disconnected"}
                </Badge>
                {isHealthy && (
                  <Badge variant="outline" className="text-xs">
                    Backend ✓
                  </Badge>
                )}
                {isCalibrated && !demoMode && (
                  <Badge variant="outline" className="text-xs bg-green-500/10 text-green-500 border-green-500">
                    Calibrated ✓
                  </Badge>
                )}
              </div>
            </div>
            
            {/* Pet Display */}
            <PetDisplay />
            
            {/* Camera Controls */}
            <div className="mt-6 flex gap-3 flex-wrap">
              {cameraConnected ? (
                <>
                  <Button 
                    onClick={handleCameraToggle}
                    variant="outline" 
                    className="flex-1 min-w-[140px]"
                    disabled={!isHealthy}
                  >
                    <CameraOff className="mr-2 h-4 w-4" />
                    Disconnect
                  </Button>
                  
                  {!demoMode && (
                    <Button 
                      onClick={handleCalibrate}
                      variant={isCalibrated ? "secondary" : "default"}
                      disabled={calibrating}
                      className="flex-1 min-w-[140px]"
                    >
                      <Crosshair className="mr-2 h-4 w-4" />
                      {calibrating ? 'Calibrating...' : isCalibrated ? 'Re-calibrate' : 'Calibrate'}
                    </Button>
                  )}
                </>
              ) : (
                <Button 
                  onClick={handleCameraToggle}
                  className="flex-1"
                  disabled={!isHealthy || demoMode}
                >
                  <Camera className="mr-2 h-4 w-4" />
                  {isHealthy ? 'Connect Camera' : 'Backend Offline'}
                </Button>
              )}
              
              {/* <Button 
                onClick={handleToggleDemoMode}
                variant="secondary"
                disabled={!isHealthy}
              >
                {demoMode ? "Exit Demo" : "Demo Mode"}
              </Button> */}
            </div>
            
            {/* Help Text */}
            {!isHealthy && (
              <p className="mt-3 text-xs text-center text-muted-foreground">
                Start the Python backend: <code className="bg-muted px-1 py-0.5 rounded">python main.py</code>
              </p>
            )}
            
            {/* Calibration Instructions */}
            {cameraConnected && !isCalibrated && !demoMode && (
              <p className="mt-3 text-xs text-center text-muted-foreground">
                📍 Sit up straight with good posture, then click &quot;Calibrate&quot; to set your baseline
              </p>
            )}
          </Card>
          
          {/* Current Status Card */}
          <PostureStatusCard score={score} status={status} />
        </div>
        
        {/* Right Column: Webcam Preview */}
        <div className="lg:col-span-1">
          {/* FORCED TO ALWAYS SHOW FOR TESTING */}
          <div className="border-4 border-yellow-500 p-2">
            <p className="text-xs mb-2">DEBUG: Webcam should appear below</p>
            <WebcamPreview 
              isConnected={true}  // FORCED TRUE
              isCalibrated={isCalibrated}
            />
          </div>
        </div>
      </div>
      
      {/* Quest Card */}
      <Card className="p-6">
        <h3 className="mb-4 font-mono text-lg font-semibold">
          Micro-Break Quest
        </h3>
        <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
          When your posture needs attention, complete a 60-second guided 
          breathing and shoulder reset to restore your pet&apos;s mood and 
          earn streak points.
        </p>
        <Button onClick={onStartQuest} className="w-full" size="lg">
          Start Quest
        </Button>
      </Card>
      
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard 
          value={player.streak} 
          label="Day Streak"
          icon="🔥"
          color="text-primary"
        />
        <StatCard 
          value={player.questsCompleted} 
          label="Quests Done"
          icon="⚔️"
          color="text-secondary"
        />
        <StatCard 
          value={score} 
          label="Posture Score"
          icon="📊"
          color="text-accent"
        />
      </div>
    </div>
  )
}

// ============ POSTURE STATUS CARD ============

interface PostureStatusCardProps {
  score: number
  status: string
}

function PostureStatusCard({ score, status }: PostureStatusCardProps) {
  const getStatusInfo = () => {
    switch (status) {
      case 'good':
        return {
          icon: '✓',
          iconColor: 'text-secondary',
          bgColor: 'bg-secondary/10',
          text: 'Excellent Posture',
          message: 'Keep up the great work!',
        }
      case 'warning':
        return {
          icon: '!',
          iconColor: 'text-accent',
          bgColor: 'bg-accent/10',
          text: 'Needs Adjustment',
          message: 'Check your sitting position',
        }
      case 'bad':
        return {
          icon: '✗',
          iconColor: 'text-destructive',
          bgColor: 'bg-destructive/10',
          text: 'Poor Posture',
          message: 'Time for a micro-break!',
        }
      default:
        return {
          icon: '?',
          iconColor: 'text-muted-foreground',
          bgColor: 'bg-muted',
          text: 'Unknown',
          message: 'Connect camera to start',
        }
    }
  }
  
  const statusInfo = getStatusInfo()
  
  return (
    <Card className="p-6">
      <h3 className="mb-4 font-mono text-lg font-semibold">
        Current Status
      </h3>
      
      <div className="flex items-center justify-between">
        {/* Status Info */}
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-full ${statusInfo.bgColor}`}>
            <span className={`text-xl font-bold ${statusInfo.iconColor}`}>
              {statusInfo.icon}
            </span>
          </div>
          
          <div>
            <div className="font-medium">{statusInfo.text}</div>
            <div className="text-sm text-muted-foreground">
              Score: {score}/100
            </div>
          </div>
        </div>
        
        {/* Status Badge */}
        <Badge
          variant={
            status === 'good' 
              ? 'default' 
              : status === 'warning' 
              ? 'secondary' 
              : 'destructive'
          }
        >
          {status.toUpperCase()}
        </Badge>
      </div>
      
      {/* Progress Bar */}
      <div className="mt-4">
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${score}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          {statusInfo.message}
        </p>
      </div>
    </Card>
  )
}

// ============ STAT CARD ============

interface StatCardProps {
  value: number
  label: string
  icon: string
  color: string
}

function StatCard({ value, label, icon, color }: StatCardProps) {
  return (
    <Card className="p-4 text-center hover:shadow-lg transition-shadow">
      <div className="mb-2 text-2xl">{icon}</div>
      <div className={`mb-2 text-3xl font-bold ${color}`}>
        {value}
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </Card>
  )
}