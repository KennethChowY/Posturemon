"use client"

import { useState } from "react"
import { HeroSection } from "@/components/hero-section"
import { ExplanationSection } from "@/components/explanation-section"
import { GachaSection } from "@/components/gacha-section"

export default function LandingPage() {
  const [currentStep, setCurrentStep] = useState<"hero" | "explanation" | "gacha">("hero")

  return (
    <main className="min-h-screen">
      {currentStep === "hero" && <HeroSection onStart={() => setCurrentStep("explanation")} />}
      {currentStep === "explanation" && <ExplanationSection onContinue={() => setCurrentStep("gacha")} />}
      {currentStep === "gacha" && <GachaSection />}
    </main>
  )
}
