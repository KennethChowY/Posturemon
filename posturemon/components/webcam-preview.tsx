/**
 * Webcam Preview Component
 * Shows live webcam feed with pose landmarks overlay
 */

'use client'

import { useEffect, useRef, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Camera, CameraOff, Maximize2, Minimize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface WebcamPreviewProps {
  isConnected: boolean
  isCalibrated: boolean
}

export function WebcamPreview({ isConnected, isCalibrated }: WebcamPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Start webcam when connected
  useEffect(() => {
    if (isConnected && !stream) {
      startWebcam()
    }
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [isConnected])

  const startWebcam = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      })
      
      setStream(mediaStream)
      setError(null)
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (err) {
      console.error('Failed to access webcam:', err)
      setError('Failed to access webcam')
    }
  }

  const stopWebcam = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
  }

  // Stop webcam when disconnected
  useEffect(() => {
    if (!isConnected && stream) {
      stopWebcam()
    }
  }, [isConnected])

  if (!isConnected) {
    return (
      <Card className="p-6 bg-muted/50">
        <div className="flex flex-col items-center justify-center h-[240px] text-muted-foreground">
          <CameraOff className="h-12 w-12 mb-3 opacity-50" />
          <p className="text-sm">Camera Disconnected</p>
          <p className="text-xs mt-1">Connect camera to see preview</p>
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="p-6 bg-destructive/10 border-destructive">
        <div className="flex flex-col items-center justify-center h-[240px]">
          <CameraOff className="h-12 w-12 mb-3 text-destructive" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className={`overflow-hidden transition-all ${isExpanded ? 'fixed inset-4 z-50' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-muted/50 border-b">
        <div className="flex items-center gap-2">
          <Camera className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Live Preview</span>
          {isCalibrated && (
            <Badge variant="outline" className="text-xs bg-green-500/10 text-green-500 border-green-500">
              Calibrated
            </Badge>
          )}
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="h-7 w-7 p-0"
        >
          {isExpanded ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      {/* Video Feed */}
      <div className={`relative bg-black ${isExpanded ? 'h-[calc(100%-3rem)]' : 'aspect-video'}`}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        
        {/* Canvas overlay for pose landmarks (future enhancement) */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none"
        />
        
        {/* Status Overlay */}
        {!isCalibrated && (
          <div className="absolute top-3 left-3 right-3">
            <div className="bg-accent/90 backdrop-blur-sm rounded-lg px-3 py-2 text-sm text-white">
              ⚠️ Not calibrated - Click &quot;Calibrate&quot; to set baseline
            </div>
          </div>
        )}
        
        {/* Live indicator */}
        <div className="absolute top-3 right-3">
          <div className="flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            LIVE
          </div>
        </div>
      </div>
    </Card>
  )
}