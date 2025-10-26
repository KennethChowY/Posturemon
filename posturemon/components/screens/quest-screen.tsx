/**
 * Quest Screen - Guided Micro-Break
 * 60-second breathing and shoulder reset exercise
 */

'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { usePostureStore } from '@/stores/posture-store'
import { Sparkles } from 'lucide-react'
import { GAME_CONFIG } from '@/lib/constants'

interface QuestScreenProps {
  onComplete: () => void
}

type QuestPhase = 'breathing' | 'shoulders' | 'complete'
type BreathPhase = 'in' | 'hold' | 'out'

export function QuestScreen({ onComplete }: QuestScreenProps) {
  const completeQuest = usePostureStore((state) => state.completeQuest)
  
  const [phase, setPhase] = useState<QuestPhase>('breathing')
  const [progress, setProgress] = useState(0)
  const [breathCount, setBreathCount] = useState(0)
  const [breathPhase, setBreathPhase] = useState<BreathPhase>('in')
  
  // Phase durations in milliseconds
  const BREATHING_DURATION = 30000 // 30 seconds
  const SHOULDERS_DURATION = 30000 // 30 seconds
  
  // Main quest timer
  useEffect(() => {
    if (phase === 'complete') return
    
    const duration = phase === 'breathing' ? BREATHING_DURATION : SHOULDERS_DURATION
    const startTime = Date.now()
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const newProgress = Math.min((elapsed / duration) * 100, 100)
      setProgress(newProgress)
      
      if (newProgress >= 100) {
        if (phase === 'breathing') {
          setPhase('shoulders')
          setProgress(0)
        } else {
          setPhase('complete')
          // Award XP and complete quest
          completeQuest(GAME_CONFIG.QUEST_BASE_XP)
        }
      }
    }, 100)
    
    return () => clearInterval(interval)
  }, [phase, completeQuest])
  
  // Breathing animation cycle
  useEffect(() => {
    if (phase !== 'breathing') return
    
    // 4 seconds per cycle (4s in, 4s hold, 4s out)
    const breathCycle = setInterval(() => {
      setBreathPhase((prev) => {
        if (prev === 'in') return 'hold'
        if (prev === 'hold') return 'out'
        setBreathCount((c) => c + 1)
        return 'in'
      })
    }, 4000)
    
    return () => clearInterval(breathCycle)
  }, [phase])
  
  // Quest complete screen
  if (phase === 'complete') {
    return (
      <Card className="p-8 text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-secondary animate-bounce-subtle">
            <Sparkles className="h-12 w-12 text-secondary-foreground" />
          </div>
        </div>
        
        <h2 className="mb-2 font-mono text-2xl font-bold text-secondary">
          Quest Complete!
        </h2>
        
        <p className="mb-2 text-lg font-semibold">
          +{GAME_CONFIG.QUEST_BASE_XP} XP
        </p>
        
        <p className="mb-6 text-muted-foreground">
          You earned experience and boosted your streak!
        </p>
        
        <Button onClick={onComplete} size="lg" className="w-full">
          Return Home
        </Button>
      </Card>
    )
  }
  
  return (
    <div className="space-y-6">
      {/* Quest Progress Card */}
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-mono text-xl font-bold">
            {phase === 'breathing' ? 'Box Breathing' : 'Shoulder Reset'}
          </h2>
          <span className="font-mono text-sm text-muted-foreground">
            {Math.floor(progress)}%
          </span>
        </div>
        
        <Progress value={progress} className="mb-6 h-2" />
        
        {/* Breathing Phase */}
        {phase === 'breathing' && (
          <BreathingExercise 
            breathPhase={breathPhase} 
            breathCount={breathCount}
          />
        )}
        
        {/* Shoulders Phase */}
        {phase === 'shoulders' && <ShoulderExercise />}
      </Card>
      
      {/* Tip Card */}
      <Card className="bg-muted p-4">
        <p className="text-center text-sm text-muted-foreground">
          💡 Tip: Regular micro-breaks help prevent strain and improve focus
        </p>
      </Card>
    </div>
  )
}

// ============ BREATHING EXERCISE ============

interface BreathingExerciseProps {
  breathPhase: BreathPhase
  breathCount: number
}

function BreathingExercise({ breathPhase, breathCount }: BreathingExerciseProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      {/* Animated Circle */}
      <div
        className="mb-8 flex h-32 w-32 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform duration-[4000ms] ease-in-out"
        style={{
          transform: 
            breathPhase === 'in' ? 'scale(1.5)' : 
            breathPhase === 'hold' ? 'scale(1.5)' : 
            'scale(1)',
        }}
      >
        <span className="font-mono text-lg font-bold text-center px-4">
          {breathPhase === 'in' && 'Breathe In'}
          {breathPhase === 'hold' && 'Hold'}
          {breathPhase === 'out' && 'Breathe Out'}
        </span>
      </div>
      
      {/* Instructions */}
      <p className="text-center text-muted-foreground mb-4">
        Follow the circle. Breathe in for 4 seconds, hold for 4, breathe out for 4.
      </p>
      
      {/* Breath Counter */}
      <div className="font-mono text-sm text-muted-foreground">
        Breaths: {breathCount}
      </div>
    </div>
  )
}

// ============ SHOULDER EXERCISE ============

function ShoulderExercise() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      {/* Icon */}
      <div className="mb-8 space-y-4 text-center">
        <div className="text-6xl">🤸</div>
        <h3 className="font-mono text-xl font-semibold">
          Shoulder Rolls & Stretches
        </h3>
      </div>
      
      {/* Instructions */}
      <div className="space-y-3 text-center">
        <Step number={1} text="Roll your shoulders backward 5 times" />
        <Step number={2} text="Roll your shoulders forward 5 times" />
        <Step number={3} text="Stretch your neck side to side" />
        <Step number={4} text="Take a deep breath and relax" />
      </div>
    </div>
  )
}

// ============ STEP COMPONENT ============

function Step({ number, text }: { number: number; text: string }) {
  return (
    <div className="flex items-center gap-3 text-sm text-muted-foreground">
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
        {number}
      </div>
      <span>{text}</span>
    </div>
  )
}