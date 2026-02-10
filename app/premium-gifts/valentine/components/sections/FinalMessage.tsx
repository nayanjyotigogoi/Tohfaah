"use client"

import { Heart } from "lucide-react"

interface FinalMessageProps {
  senderName: string
  recipientName: string
}

export default function FinalMessage({ senderName, recipientName }: FinalMessageProps) {
  return (
    <section className="min-h-screen flex items-center justify-center bg-[hsl(350,80%,45%)] px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <Heart
            key={`final-heart-${i}`}
            className="absolute text-card/20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${15 + Math.random() * 40}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
            }}
            fill="currentColor"
          />
        ))}
      </div>
      <div className="text-center space-y-8 relative z-10">
        <Heart
          className="w-24 h-24 mx-auto text-card animate-pulse-heart"
          fill="currentColor"
        />
        <div className="space-y-4">
          <p className="text-card/80 uppercase tracking-[0.3em] text-sm">
            Happy Valentine{"'"}s Day
          </p>
          <h1 className="font-display text-5xl md:text-7xl text-card italic">
            {recipientName || "My Love"}
          </h1>
        </div>
        <p className="font-display text-2xl text-card/90 max-w-md mx-auto">
          Every moment with you is a treasure I hold dear to my heart.
        </p>
        <p className="font-display text-xl text-card/80 italic">
          With all my love, {senderName || "Yours Forever"}
        </p>
      </div>
    </section>
  )
}
