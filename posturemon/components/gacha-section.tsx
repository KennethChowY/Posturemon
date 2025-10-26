"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Sparkles, Zap, Star, Trophy } from "lucide-react"
import Image from "next/image"

export function GachaSection() {
  const router = useRouter()
  const [isSpinning, setIsSpinning] = useState(false)
  const [showVideo, setShowVideo] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const themeAudioRef = useRef<HTMLAudioElement | null>(null)
  const [spinKey, setSpinKey] = useState(0)
  const [trainerName, setTrainerName] = useState("")

  // Load trainer name from localStorage
  useEffect(() => {
    const savedName = localStorage.getItem("trainerName")
    if (savedName) {
      setTrainerName(savedName)
    }
  }, [])

  // Play theme music when component mounts
  useEffect(() => {
    themeAudioRef.current = new Audio('/sounds/theme%20music.mp3')
    themeAudioRef.current.loop = true
    themeAudioRef.current.volume = 0.3
    themeAudioRef.current.play().catch(err => console.log('Audio play failed:', err))

    // Cleanup when component unmounts
    return () => {
      if (themeAudioRef.current) {
        themeAudioRef.current.pause()
        themeAudioRef.current = null
      }
    }
  }, [])

const playButtonSound = () => {
  const audio = new Audio('/sounds/button_sound.mp3')
  audio.volume = 0.5
  audio.play().catch(err => console.log('Audio play failed:', err))
}

const handleSpin = () => {
  playButtonSound()
  setIsSpinning(true)
  setRevealed(false)
  setShowVideo(true)
  setSpinKey(k => k + 1)

  // Safety: force-end after ~7s in case onEnded doesn't fire
  setTimeout(() => {
    endSpin()
  }, 7000) // a hair over the 7s video
}

const endSpin = () => {
  // Reveal immediately so we don't flash the dragon again
  setRevealed(true)
  setShowVideo(false)
  setIsSpinning(false)
}

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4 py-12">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/20 to-secondary/20 animate-gradient-shift" />

      {/* Floating stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <Star
            key={i}
            className="absolute text-accent/30 animate-star-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${12 + Math.random() * 12}px`,
              height: `${12 + Math.random() * 12}px`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-3xl w-full space-y-8 text-center relative z-10">
        <div className="space-y-4 animate-slide-up">
          {/* <div className="inline-flex items-center gap-2 px-6 py-3 bg-accent/20 border-2 border-accent rounded-full backdrop-blur-sm">
            <Trophy className="w-5 h-5 text-accent animate-pulse" />
            <span className="text-sm font-black text-accent font-mono tracking-wider">LEVEL 2 - GACHA MACHINE</span>
            <Trophy className="w-5 h-5 text-accent animate-pulse" />
          </div> */}

          <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent animate-gradient-shift drop-shadow-2xl">
            GACHA TIME!
          </h1>

          <p className="text-xl md:text-2xl text-foreground text-balance leading-relaxed font-bold">
            Spin the Posturemon machine to discover your first companion!
          </p>
        </div>

        <Card className="p-12 bg-card/90 backdrop-blur-xl border-4 border-primary/40 shadow-2xl game-border animate-slide-up delay-100">
          <div className="space-y-8">
            {/* Machine Display */}
            <div className="relative">
              {/* Outer glow ring */}
              {(isSpinning || revealed) && (
                <div className="absolute inset-0 -m-8">
                  <div className="w-full h-full rounded-full bg-gradient-to-r from-primary via-secondary to-accent opacity-30 blur-3xl animate-pulse-glow" />
                </div>
              )}

              <div
                className={`relative w-72 h-72 mx-auto rounded-3xl bg-gradient-to-br from-primary/20 to-secondary/20 border-4 border-border flex items-center justify-center overflow-hidden transition-all duration-500 shadow-2xl ${
                  isSpinning ? "animate-shake scale-105" : ""
                } ${revealed ? "scale-110 animate-glow" : ""}`}
              >
                {/* Inner display */}
                <div className="absolute inset-4 rounded-2xl bg-background/20 backdrop-blur-sm border-2 border-foreground/10" />

                {/* Content */}
                <div className="relative z-10 w-full h-full flex items-center justify-center">
{showVideo ? (
  <video
    key={spinKey}                    // NEW: remount each spin
    ref={videoRef}
    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Pixel_Dragon_Gacha_Summon_Animation-VCVGNBQyKfGU0VwgYqvEOgJ1DB4SnG.mp4"
    className="w-full h-full object-cover"
    muted
    playsInline
    autoPlay                         // let it start automatically
    preload="auto"
    onLoadedMetadata={() => {
      // ensure we always start at 0 and actually play
      if (videoRef.current) {
        videoRef.current.currentTime = 0
        const p = videoRef.current.play()
        if (p && typeof p.catch === "function") p.catch(() => {/* ignore autoplay block since muted */})
      }
    }}
    onEnded={endSpin}                // when video ends -> reveal
  />
) : revealed ? (
                    <Image
                      src="/images/cat.jpg"
                      alt="Your Posturemon"
                      width={288}
                      height={288}
                      className="w-full h-full object-contain animate-bounce-subtle p-4"
                    />
                  ) : (
                    <Image
                      src="/images/dragon-posturemon.webp"
                      alt="Gacha Machine"
                      width={288}
                      height={288}
                      className="w-full h-full object-contain p-4"
                    />
                  )}
                </div>
              </div>

              {/* Sparkle effects */}
              {revealed && (
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(8)].map((_, i) => (
                    <Sparkles
                      key={i}
                      className="absolute text-accent animate-bounce"
                      style={{
                        top: `${20 + Math.random() * 60}%`,
                        left: `${20 + Math.random() * 60}%`,
                        width: `${20 + Math.random() * 16}px`,
                        height: `${20 + Math.random() * 16}px`,
                        animationDelay: `${i * 0.1}s`,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Result display with gaming UI */}
            {revealed && (
              <div className="space-y-6 animate-pixel-fade">
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-accent/30 to-secondary/30 border-2 border-accent rounded-full backdrop-blur-sm">
                  <Star className="w-5 h-5 text-accent animate-spin" />
                  <p className="text-sm font-black text-foreground text-accent font-mono tracking-wider">NEW POSTUREMON ACQUIRED!</p>
                  <Star className="w-5 h-5 text-accent animate-spin" />
                </div>

                <h2 className="text-5xl font-black text-foreground bg-clip-text bg-gradient-to-r from-primary to-secondary font-mono">
                  Slouchy
                </h2>

                <div className="space-y-2">
                  <p className="text-xl text-muted-foreground">
                    <span className="font-black text-foreground">Type: Cat</span>
                  </p>

                  {/* Stats display */}
                  <div className="max-w-xs mx-auto space-y-2 pt-4">
                    {[
                      { label: "HP", value: 85, color: "bg-green-500" },
                      { label: "ENERGY", value: 90, color: "bg-accent" },
                      { label: "HAPPINESS", value: 100, color: "bg-pink-500" },
                    ].map((stat) => (
                      <div key={stat.label} className="space-y-1">
                        <div className="flex justify-between text-xs font-mono font-bold">
                          <span>{stat.label}</span>
                          <span>{stat.value}/100</span>
                        </div>
                        <div className="h-3 bg-muted rounded-full overflow-hidden border border-border">
                          <div
                            className={`h-full ${stat.color} transition-all duration-1000 ease-out`}
                            style={{ width: `${stat.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    size="lg"
                    onClick={async () => {
                      // Ensure user name is sent to backend before navigating
                      if (trainerName) {
                        try {
                          await fetch('http://localhost:5050/api/user/set', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ userName: trainerName }),
                          })
                        } catch (error) {
                          console.error('Failed to set user name:', error)
                        }
                      }
                      router.push("/app")
                    }}
                    className="group text-xl px-12 py-8 rounded-2xl font-black shadow-2xl hover:scale-110 transition-all duration-300 bg-gradient-to-r from-primary to-secondary overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative flex items-center gap-3">
                      <Zap className="w-6 h-6 animate-pulse" />
                      START TRAINING
                      <Trophy className="w-6 h-6" />
                    </span>
                  </Button>
                </div>
              </div>
            )}

            {/* Spin button with enhanced styling */}
            {!revealed && (
              <Button
                size="lg"
                onClick={handleSpin}
                disabled={isSpinning}
                className="group text-2xl px-14 py-9 rounded-2xl font-black shadow-2xl hover:scale-110 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-primary via-secondary to-accent overflow-hidden"
              >
                {isSpinning ? (
                  <span className="flex items-center gap-3">
                    <div className="animate-spin text-2xl">⚡</div>
                    SPINNING...
                  </span>
                ) : (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative flex items-center gap-3">
                      <Sparkles className="w-7 h-7 animate-pulse" />
                      SPIN THE GACHA!
                      <Sparkles className="w-7 h-7 animate-pulse" />
                    </span>
                  </>
                )}
              </Button>
            )}
          </div>
        </Card>

        {!revealed && (
          <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed font-mono animate-slide-up delay-200">
            <Zap className="inline w-4 h-4 text-accent" /> Each Posturemon has unique animations and evolutions. Take
            good care of yours by maintaining great posture! <Zap className="inline w-4 h-4 text-accent" />
          </p>
        )}
      </div>
    </div>
  )
}
