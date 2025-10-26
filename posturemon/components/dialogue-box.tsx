"use client"

import { Card } from "@/components/ui/card"

interface DialogueBoxProps {
  text: string
  speaker?: string
  onNext?: () => void
}

export function DialogueBox({ text, speaker, onNext }: DialogueBoxProps) {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-3xl px-4 z-50 animate-in slide-in-from-bottom-4 duration-300">
      <Card className="bg-background border-4 border-foreground/20 rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-8 relative">
          {speaker && (
            <div className="mb-3">
              <span className="font-bold text-lg font-mono text-primary">{speaker}</span>
            </div>
          )}
          <p className="text-lg md:text-xl leading-relaxed font-medium text-foreground text-balance">{text}</p>

          {/* Click indicator */}
          <div className="absolute bottom-4 right-6 animate-bounce">
            <div className="w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-foreground/60" />
          </div>
        </div>
      </Card>

      {/* Invisible clickable overlay */}
      {onNext && (
        <button onClick={onNext} className="absolute inset-0 w-full h-full cursor-pointer" aria-label="Continue" />
      )}
    </div>
  )
}
