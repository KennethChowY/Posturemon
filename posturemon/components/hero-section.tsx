"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Sparkles, Zap, Star, Trophy } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface HeroSectionProps {
  onStart: () => void
}

export function HeroSection({ onStart }: HeroSectionProps) {
  const router = useRouter()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [stars, setStars] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([])

  useEffect(() => {
    // Generate random stars for background
    const newStars = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
    }))
    setStars(newStars)
  }, [])

  const handleReturningUser = async () => {
    const savedName = localStorage.getItem("trainerName")

    if (savedName) {
      // Send name to backend
      try {
        await fetch('http://localhost:5050/api/user/set', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userName: savedName }),
        })

        // Navigate directly to app
        router.push("/app")
      } catch (error) {
        console.error('Failed to set returning user:', error)
        alert("Error loading your profile. Please try the new adventure.")
      }
    } else {
      alert("No saved trainer found. Please start a new adventure!")
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    })
  }

  const playButtonSound = () => {
    const audio = new Audio('/sounds/button_sound.mp3')
    audio.volume = 0.5
    audio.play().catch(err => console.log('Audio play failed:', err))
  }

  const handleStartClick = () => {
    playButtonSound()
    onStart()
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/10 to-secondary/10 animate-gradient-shift" />

      {/* Large logo watermark in the background */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
        <Image
          src="/images/posturemon-logo.png"
          alt="Background Logo"
          width={1200}
          height={300}
          className="w-full max-w-5xl"
          priority
        />
      </div>

      {/* Animated stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute w-1 h-1 bg-primary rounded-full animate-star-twinkle"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}

      {/* Grid overlay for gaming aesthetic */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Scanline effect */}
      <div className="scanline absolute inset-0 pointer-events-none" />

      {/* Main content - Split layout */}
      <div className="w-full max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-screen py-20">

          {/* Left side - Posturemon character */}
          <div className="flex flex-col items-center justify-center space-y-6 animate-slide-up">
            <div className="relative group">
              {/* Glow effect behind posturemon */}
              <div className="absolute inset-0 bg-gradient-to-r from-accent via-primary to-secondary blur-3xl opacity-50 group-hover:opacity-75 transition-opacity duration-500 scale-110" />

              {/* Posturemon image with floating animation */}
              <div className="relative animate-bounce-slow">
                <Image
                  src="/images/dragon-posturemon.webp"
                  alt="Dragon Posturemon"
                  width={500}
                  height={500}
                  className="w-full max-w-md drop-shadow-2xl pixelated"
                  priority
                />
              </div>

              {/* Pixel sparkles around character */}
              <div className="absolute -top-8 -left-8 animate-pulse-glow">
                <Sparkles className="w-12 h-12 text-accent" />
              </div>
              <div className="absolute -bottom-8 -right-8 animate-pulse-glow delay-500">
                <Star className="w-10 h-10 text-primary" />
              </div>
            </div>

            {/* Character name tag */}
            <div className="bg-card/90 backdrop-blur-xl px-6 py-3 rounded-2xl border-4 border-accent/50 shadow-2xl">
              <p className="text-2xl font-black text-accent font-mono tracking-wider">DRAKO</p>
              <p className="text-sm text-muted-foreground font-mono text-center">STARTER POSTUREMON</p>
            </div>
          </div>

          {/* Right side - Content and buttons */}
          <div className="flex flex-col items-center lg:items-start space-y-8 text-center lg:text-left animate-slide-up delay-200">

            {/* Small logo for mobile */}
            <div className="lg:hidden">
              <Image
                src="/images/posturemon-logo.png"
                alt="PostureMon Logo"
                width={400}
                height={100}
                className="w-full max-w-sm drop-shadow-2xl"
                priority
              />
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent/20 border-3 border-accent rounded-full shadow-lg">
              <Star className="w-5 h-5 text-accent animate-spin" />
              <span className="text-base font-black text-accent font-mono tracking-wide">NEW ADVENTURE AWAITS</span>
              <Star className="w-5 h-5 text-accent animate-spin" />
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight text-foreground drop-shadow-lg">
                CATCH<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent animate-gradient-shift">
                  GOOD POSTURE!
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground max-w-xl leading-relaxed">
                Train your posture, raise pixel pets, and become a <span className="font-bold text-accent">Posture Master!</span>
              </p>
            </div>

            {/* Features list */}
            <div className="space-y-3 text-left">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                <span className="text-lg font-mono text-muted-foreground">Real-time posture tracking</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-100" />
                <span className="text-lg font-mono text-muted-foreground">Collect & raise Posturemon</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-secondary rounded-full animate-pulse delay-200" />
                <span className="text-lg font-mono text-muted-foreground">Build healthy habits daily</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="pt-6 flex flex-col sm:flex-row gap-5 w-full lg:w-auto">
              <Button
                size="lg"
                onClick={handleStartClick}
                className="group relative text-2xl px-14 py-9 rounded-2xl font-black shadow-2xl hover:scale-110 transition-all duration-300 bg-gradient-to-r from-primary via-secondary to-accent overflow-hidden border-4 border-primary/40"
              >
                {/* Button glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <span className="relative flex items-center justify-center gap-3">
                  <Sparkles className="w-7 h-7 animate-spin" />
                  START ADVENTURE
                  <Zap className="w-7 h-7" />
                </span>
              </Button>

              {/* <Button
                size="lg"
                variant="outline"
                onClick={handleReturningUser}
                className="text-xl px-10 py-9 rounded-2xl font-bold shadow-lg hover:scale-105 transition-all duration-300 border-4 border-primary/50 hover:border-primary hover:bg-primary/20 backdrop-blur-sm"
              >
                <Trophy className="mr-3 w-6 h-6" />
                RETURNING TRAINER
              </Button> */}
            </div>

            {/* Level indicator */}
            {/* <div className="pt-4">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-card/70 backdrop-blur-sm rounded-full border-2 border-primary/30">
                <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                <span className="font-mono text-sm font-bold text-primary">LEVEL 1 - TUTORIAL</span>
                <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}
