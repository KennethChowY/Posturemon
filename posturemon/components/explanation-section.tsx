"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { DialogueBox } from "@/components/dialogue-box"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Sparkles, Heart } from "lucide-react"
import Image from "next/image"

interface ExplanationSectionProps {
  onContinue: () => void
}

export function ExplanationSection({ onContinue }: ExplanationSectionProps) {
  const [currentDialogue, setCurrentDialogue] = useState(0)
  const [trainerName, setTrainerName] = useState("")
  const [isAskingName, setIsAskingName] = useState(false)
  const [nameConfirmed, setNameConfirmed] = useState(false)
  const professorAudioRef = useRef<HTMLAudioElement | null>(null)

  // Play professor soundtrack when component mounts
  useEffect(() => {
    professorAudioRef.current = new Audio('/sounds/professor_soundtrack.mp3')
    professorAudioRef.current.loop = true
    professorAudioRef.current.volume = 0.3
    professorAudioRef.current.play().catch(err => console.log('Audio play failed:', err))

    // Cleanup when component unmounts
    return () => {
      if (professorAudioRef.current) {
        professorAudioRef.current.pause()
        professorAudioRef.current = null
      }
    }
  }, [])

  const getDialogues = () => [
    {
      speaker: "Prof. Posture",
      text: "Welcome to the world of Posturemon! I'm Professor Posture, and I've dedicated my life to studying these amazing creatures.",
    },
    {
      speaker: "Prof. Posture",
      text: "Before we begin, I'd like to know your name. What should I call you, young trainer?",
      askName: true,
    },
    {
      speaker: "Prof. Posture",
      text: `Nice to meet you, ${trainerName || "Trainer"}! Now, let me tell you about Posturemon.`,
    },
    {
      speaker: "Prof. Posture",
      text: "Posturemon are magical companions that thrive when you maintain good posture while working at your computer.",
    },
    {
      speaker: "Prof. Posture",
      text: "Your webcam will track your sitting position in real-time. Don't worry—all processing happens in your browser. It's completely private!",
    },
    {
      speaker: "Prof. Posture",
      text: "When you sit up straight, your Posturemon will be happy and energetic! But if you slouch, they'll become worried and sad.",
    },
    {
      speaker: "Prof. Posture",
      text: "Complete micro-break quests to restore their mood and earn XP. Build streaks, unlock evolutions, and watch your Posturemon grow!",
    },
    {
      speaker: "Prof. Posture",
      text: `Now, ${trainerName || "Trainer"}, it's time for you to meet your very first Posturemon! Are you ready?`,
    },
    {
      speaker: "Prof. Posture",
      text: "Let's head to the Gacha Machine and discover which Posturemon will be your companion!",
    },
  ]

  const DIALOGUES = getDialogues()

  const playButtonSound = () => {
    const audio = new Audio('/sounds/button_sound.mp3')
    audio.volume = 0.5
    audio.play().catch(err => console.log('Audio play failed:', err))
  }

  const handleNext = () => {
    playButtonSound()

    if (DIALOGUES[currentDialogue].askName && !nameConfirmed) {
      setIsAskingName(true)
      return
    }

    if (currentDialogue < DIALOGUES.length - 1) {
      setCurrentDialogue(currentDialogue + 1)
      setIsAskingName(false)
    } else {
      if (trainerName) {
        localStorage.setItem("trainerName", trainerName)
      }
      // Stop professor music before continuing
      if (professorAudioRef.current) {
        professorAudioRef.current.pause()
      }
      onContinue()
    }
  }

  const handleNameConfirm = async () => {
    if (trainerName.trim()) {
      playButtonSound()

      // Send name to backend
      try {
        const response = await fetch('http://localhost:5050/api/user/set', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userName: trainerName }),
        })

        if (response.ok) {
          console.log('User name set successfully in backend')
        }
      } catch (error) {
        console.error('Failed to set user name in backend:', error)
      }

      setNameConfirmed(true)
      setIsAskingName(false)
      setCurrentDialogue(currentDialogue + 1)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4 py-12">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/10 to-secondary/10 animate-gradient-shift" />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-secondary/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex items-end justify-center gap-12 mb-32">
        {/* Progress indicator */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-2 px-4 py-2 bg-card/90 backdrop-blur-sm border-2 border-primary/50 rounded-full">
            <Sparkles className="w-4 h-4 text-accent animate-pulse" />
            <span className="text-sm font-bold font-mono text-foreground">
              DIALOGUE {currentDialogue + 1}/{DIALOGUES.length}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center animate-float">
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full animate-pulse-glow" />

            <Card className="relative p-6 bg-card/90 backdrop-blur-xl border-4 border-primary/40 shadow-2xl game-border">
              <div className="w-40 h-40 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center shadow-inner border-2 border-primary/30 overflow-hidden">
                <Image
                  src="/images/professor-posture.png"
                  alt="Professor Posture"
                  width={160}
                  height={160}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* HP/Status bar */}
              <div className="mt-3 space-y-1">
                <div className="flex items-center gap-2">
                  <Heart className="w-3 h-3 text-red-500" />
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full w-full bg-gradient-to-r from-green-500 to-emerald-500" />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="mt-4 px-4 py-2 bg-card/90 backdrop-blur-sm border-2 border-primary/50 rounded-full shadow-lg">
            <p className="font-black text-sm font-mono text-foreground">PROF. POSTURE</p>
          </div>
        </div>
      </div>

      {isAskingName ? (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-3xl px-4 z-20">
          <Card className="bg-card/95 backdrop-blur-xl border-4 border-primary/40 shadow-2xl p-8 game-border animate-slide-up">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center border-2 border-primary/30 overflow-hidden">
                  <Image
                    src="/images/professor-posture.png"
                    alt="Professor Posture"
                    width={48}
                    height={48}
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="font-black text-lg font-mono text-foreground">PROF. POSTURE</p>
              </div>

              <p className="text-lg leading-relaxed text-foreground">
                Before we begin, I'd like to know your name. What should I call you, young trainer?
              </p>

              <div className="flex gap-3">
                <Input
                  type="text"
                  placeholder="Enter your trainer name..."
                  value={trainerName}
                  onChange={(e) => setTrainerName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleNameConfirm()
                    }
                  }}
                  className="text-lg py-6 border-2 border-primary/50 font-mono bg-input/50 backdrop-blur-sm focus:border-primary"
                  autoFocus
                />
                <Button
                  onClick={handleNameConfirm}
                  size="lg"
                  className="px-8 font-black bg-gradient-to-r from-primary to-secondary hover:scale-105 transition-transform"
                  disabled={!trainerName.trim()}
                >
                  CONFIRM
                </Button>
              </div>
            </div>
          </Card>
        </div>
      ) : (
        <DialogueBox
          speaker={DIALOGUES[currentDialogue].speaker}
          text={DIALOGUES[currentDialogue].text}
          onNext={handleNext}
        />
      )}
    </div>
  )
}
