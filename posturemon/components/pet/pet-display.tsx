/**
 * Pet Display Component
 * The animated pixel-art pet that reacts to posture
 * Now uses video animations based on posture status
 */

'use client'

import { usePostureStore } from '@/stores/posture-store'
import { useEffect, useState, useRef } from 'react'
import { cn } from '@/lib/utils'

export function PetDisplay() {
  // Direct store access
  const pet = usePostureStore((state) => state.pet)
  const cameraConnected = usePostureStore((state) => state.cameraConnected)

  // Fetch posture status from backend
  const [postureStatus, setPostureStatus] = useState<'good_posture' | 'bad_posture' | 'afk'>('afk')

  useEffect(() => {
    if (!cameraConnected) {
      setPostureStatus('afk')
      return
    }

    const interval = setInterval(async () => {
      try {
        const response = await fetch('http://localhost:5050/api/posture/current')
        const data = await response.json()

        // Map backend status to our three states
        const status = data.status?.toUpperCase() || ''
        if (status.includes('GOOD') || status.includes('PERFECT')) {
          setPostureStatus('good_posture')
        } else if (status.includes('SLOUCH') || status.includes('BAD')) {
          setPostureStatus('bad_posture')
        } else if (status.includes('NO PERSON') || status.includes('CALIBRATE')) {
          setPostureStatus('afk')
        }
      } catch (error) {
        console.error('Failed to fetch posture status:', error)
        setPostureStatus('afk')
      }
    }, 1000) // Poll every second

    return () => clearInterval(interval)
  }, [cameraConnected])

  return (
    <div className="relative flex flex-col items-center justify-center rounded-lg bg-muted p-8 min-h-[300px]">
      {/* Video Pet Animation */}
      <div className="relative">
        <PetVideoAnimation status={postureStatus} level={pet.level} />
      </div>

      {/* Pet Info */}
      <div className="mt-6 text-center space-y-2">
        <div className="font-mono text-2xl font-bold">
          {getStatusEmoji(postureStatus)} {getStatusText(postureStatus)}
        </div>
        <div className="text-sm text-muted-foreground">
          {getStatusMessage(postureStatus)}
        </div>

        {/* Stats Bar */}
        <div className="flex gap-4 mt-4 justify-center">
          <StatBar label="❤️" value={pet.happiness} color="rose" />
          <StatBar label="⚡" value={pet.energy} color="yellow" />
        </div>
      </div>
    </div>
  )
}

// ============ VIDEO ANIMATION COMPONENT ============

interface PetVideoAnimationProps {
  status: 'good_posture' | 'bad_posture' | 'afk'
  level: number
}

function PetVideoAnimation({ status, level }: PetVideoAnimationProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoSrc, setVideoSrc] = useState('')

  // Map status to video file
  useEffect(() => {
    const videoMap = {
      good_posture: '/images/good_posture.mov',
      bad_posture: '/images/bad_posture.mov',
      afk: '/images/away_from_camera.mov',
    }

    setVideoSrc(videoMap[status])
  }, [status])

  // Auto-play and loop when video source changes
  useEffect(() => {
    if (videoRef.current && videoSrc) {
      videoRef.current.load()
      videoRef.current.play().catch(() => {
        // Ignore autoplay errors
      })
    }
  }, [videoSrc])

  return (
    <div className="relative w-64 h-64 flex items-center justify-center">
      {videoSrc && (
        <video
          ref={videoRef}
          src={videoSrc}
          className="w-full h-full object-contain rounded-lg"
          autoPlay
          loop
          muted
          playsInline
        />
      )}

      {/* Level Badge */}
      <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow-lg">
        {level}
      </div>
    </div>
  )
}

// ============ LEGACY PET SPRITE (Kept for reference, not used) ============

interface PetSpriteProps {
  mood: string
  evolution: string
  level: number
}

function PetSprite({ mood, evolution, level }: PetSpriteProps) {
  // Get color based on mood
  const colorClass = getMoodColor(mood)
  
  // Size based on evolution
  const size = getEvolutionSize(evolution)
  
  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Body */}
      <div
        className={cn(
          'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl transition-all duration-300',
          colorClass
        )}
        style={{
          width: `${size * 0.625}px`,
          height: `${size * 0.625}px`,
        }}
      />
      
      {/* Eyes */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-4">
        <Eye mood={mood} />
        <Eye mood={mood} />
      </div>
      
      {/* Mouth */}
      <Mouth mood={mood} />
      
      {/* Evolution Features */}
      {evolution !== 'egg' && <Accessories evolution={evolution} />}
      
      {/* Level Badge */}
      <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow-lg">
        {level}
      </div>
      
      {/* Sparkles for legendary */}
      {evolution === 'legendary' && <Sparkles />}
    </div>
  )
}

// ============ SUB-COMPONENTS ============

function Eye({ mood }: { mood: string }) {
  const isAsleep = mood === 'sleeping'
  const isWorried = mood === 'worried'
  
  if (isAsleep) {
    return <div className="h-1 w-3 rounded-full bg-foreground" />
  }
  
  return (
    <div className={cn(
      'rounded-full bg-foreground transition-all',
      isWorried ? 'h-4 w-4' : 'h-3 w-3'
    )} />
  )
}

function Mouth({ mood }: { mood: string }) {
  const mouthStyle = {
    cheerful: 'h-3 w-10 rounded-full', // Big smile
    happy: 'h-2 w-8 rounded-full',     // Smile
    neutral: 'h-2 w-6',                 // Neutral line
    worried: 'h-2 w-6 rounded-t-full',  // Worried frown
    sad: 'h-3 w-8 rounded-b-full',      // Sad frown
    sleeping: 'h-2 w-4 rounded-full opacity-50',
  }
  
  return (
    <div
      className={cn(
        'absolute left-1/2 -translate-x-1/2 bg-foreground transition-all',
        mouthStyle[mood as keyof typeof mouthStyle] || mouthStyle.neutral
      )}
      style={{ top: '60%' }}
    />
  )
}

function Accessories({ evolution }: { evolution: string }) {
  switch (evolution) {
    case 'baby':
      return (
        <>
          {/* Little legs */}
          <div className="absolute bottom-0 left-4 h-4 w-3 bg-secondary rounded-b-lg" />
          <div className="absolute bottom-0 right-4 h-4 w-3 bg-secondary rounded-b-lg" />
        </>
      )
    
    case 'juvenile':
      return (
        <>
          {/* Arms */}
          <div className="absolute top-1/2 -left-2 h-3 w-6 bg-secondary rounded-l-lg" />
          <div className="absolute top-1/2 -right-2 h-3 w-6 bg-secondary rounded-r-lg" />
          {/* Legs */}
          <div className="absolute bottom-0 left-4 h-6 w-3 bg-secondary rounded-b-lg" />
          <div className="absolute bottom-0 right-4 h-6 w-3 bg-secondary rounded-b-lg" />
        </>
      )
    
    case 'adult':
    case 'master':
      return (
        <>
          {/* Crown or halo */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-2xl">
            {evolution === 'master' ? '👑' : '⭐'}
          </div>
          {/* Arms */}
          <div className="absolute top-1/2 -left-3 h-4 w-8 bg-accent rounded-l-lg" />
          <div className="absolute top-1/2 -right-3 h-4 w-8 bg-accent rounded-r-lg" />
        </>
      )
    
    case 'legendary':
      return (
        <>
          {/* Glowing aura */}
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse blur-xl" />
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-3xl">
            ✨👑✨
          </div>
        </>
      )
    
    default:
      return null
  }
}

function Sparkles() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-0 left-0 text-xl animate-bounce">✨</div>
      <div className="absolute top-0 right-0 text-xl animate-bounce delay-100">✨</div>
      <div className="absolute bottom-0 left-0 text-xl animate-bounce delay-200">✨</div>
      <div className="absolute bottom-0 right-0 text-xl animate-bounce delay-300">✨</div>
    </div>
  )
}

// ============ STAT BAR ============

interface StatBarProps {
  label: string
  value: number // 0-100
  color: 'rose' | 'yellow' | 'green' | 'blue'
}

function StatBar({ label, value, color }: StatBarProps) {
  const colorClasses = {
    rose: 'bg-rose-500',
    yellow: 'bg-yellow-500',
    green: 'bg-green-500',
    blue: 'bg-blue-500',
  }
  
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm">{label}</span>
      <div className="w-20 h-2 bg-muted-foreground/20 rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-500', colorClasses[color])}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground w-8">{value}</span>
    </div>
  )
}

// ============ HELPER FUNCTIONS ============

function getMoodColor(mood: string): string {
  const colors = {
    cheerful: 'bg-green-500',
    happy: 'bg-secondary',
    neutral: 'bg-muted-foreground',
    worried: 'bg-accent',
    sad: 'bg-destructive',
    sleeping: 'bg-muted-foreground/50',
  }
  return colors[mood as keyof typeof colors] || colors.neutral
}

function getEvolutionSize(evolution: string): number {
  const sizes = {
    egg: 80,
    baby: 100,
    juvenile: 120,
    adult: 140,
    master: 160,
    legendary: 180,
  }
  return sizes[evolution as keyof typeof sizes] || 120
}

function getMoodEmoji(mood: string): string {
  const emojis = {
    cheerful: '😊',
    happy: '🙂',
    neutral: '😐',
    worried: '😟',
    sad: '😢',
    sleeping: '😴',
  }
  return emojis[mood as keyof typeof emojis] || '😐'
}

function getMoodText(mood: string): string {
  const texts = {
    cheerful: 'Feeling Great!',
    happy: 'Happy',
    neutral: 'Okay',
    worried: 'Worried',
    sad: 'Needs Help',
    sleeping: 'Sleeping',
  }
  return texts[mood as keyof typeof texts] || 'Unknown'
}

function getMoodMessage(mood: string): string {
  const messages = {
    cheerful: 'Excellent posture! Keep it up!',
    happy: 'Good posture! Doing well!',
    neutral: 'Posture is okay',
    worried: 'Check your posture',
    sad: 'Time for a micro-break quest!',
    sleeping: 'Camera disconnected',
  }
  return messages[mood as keyof typeof messages] || ''
}

// ============ STATUS HELPER FUNCTIONS ============

function getStatusEmoji(status: 'good_posture' | 'bad_posture' | 'afk'): string {
  const emojis = {
    good_posture: '😊',
    bad_posture: '😟',
    afk: '😴',
  }
  return emojis[status]
}

function getStatusText(status: 'good_posture' | 'bad_posture' | 'afk'): string {
  const texts = {
    good_posture: 'Perfect Posture!',
    bad_posture: 'Needs Adjustment',
    afk: 'Away',
  }
  return texts[status]
}

function getStatusMessage(status: 'good_posture' | 'bad_posture' | 'afk'): string {
  const messages = {
    good_posture: 'Excellent! Keep it up!',
    bad_posture: 'Check your posture',
    afk: 'No person detected',
  }
  return messages[status]
}