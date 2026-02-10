"use client"

import { Heart } from "lucide-react"
import { useInView } from "@/hooks/use-in-view"

interface ForeverSectionProps {
  foreverMessage: string
  senderName: string
  recipientName: string
}

export default function ForeverSection({
  foreverMessage,
  senderName,
  recipientName,
}: ForeverSectionProps) {
  const isVisible = useInView("forever-section", 0.3)

  return (
    <section
      id="forever-section"
      className="min-h-screen flex items-center justify-center bg-pink-200 px-4 py-20 relative overflow-hidden"
    >
      {/* Soft radial glow background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.4),transparent_60%)] pointer-events-none" />

      {/* Floating subtle hearts background */}
      {[...Array(8)].map((_, i) => (
        <Heart
          key={`bg-heart-${i}`}
          className="absolute text-primary/10 animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${20 + Math.random() * 40}px`,
            animationDuration: `${6 + Math.random() * 4}s`,
          }}
          fill="currentColor"
        />
      ))}

      <div className="relative z-10 text-center space-y-12 max-w-2xl">

        {/* Linked Hearts */}
        <div
          className="flex items-center justify-center gap-4"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "scale(1)" : "scale(0.9)",
            transition: "all 1s ease-out",
          }}
        >
          {/* Left Heart */}
          <div className="relative">
            <Heart
              className="w-24 h-24 text-primary drop-shadow-lg"
              strokeWidth={1.5}
            />
            <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-7 border-2 border-primary rounded-sm" />
          </div>

          {/* Chain */}
          <svg
            width="120"
            height="24"
            className="animate-chain-swing"
            style={{
              opacity: isVisible ? 1 : 0,
              transition: "opacity 1s ease-out 0.4s",
            }}
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <ellipse
                key={`chain-${i}`}
                cx={15 + i * 22}
                cy="12"
                rx="10"
                ry="7"
                fill="none"
                stroke="hsl(350,80%,45%)"
                strokeWidth="2"
              />
            ))}
          </svg>

          {/* Right Heart */}
          <div className="relative">
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-7 border-2 border-primary rounded-sm" />
            <Heart
              className="w-24 h-24 text-primary drop-shadow-lg"
              strokeWidth={1.5}
            />
          </div>
        </div>

        {/* Main Message */}
        <div
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(30px)",
            transition: "all 1s ease-out 0.6s",
          }}
        >
          <h2 className="font-display text-5xl md:text-7xl text-primary italic leading-tight mb-6">
            {foreverMessage || "Nothing is forever"}
          </h2>

          <p className="text-xl text-foreground/70 font-display italic leading-relaxed">
            ...yet my heart will forever belong to{" "}
            <span className="text-primary font-semibold">
              {recipientName || "you"}
            </span>.
          </p>

        </div>

        {/* Footer */}
        <div
          className="pt-10"
          style={{
            opacity: isVisible ? 1 : 0,
            transition: "opacity 1s ease-out 1.1s",
          }}
        >
          <div className="w-20 h-[2px] bg-primary/40 mx-auto mb-6" />

          <p className="text-foreground/40 uppercase tracking-[0.4em] text-xs">
            Always & Forever
          </p>

          <p className="font-display text-xl text-foreground/60 mt-3 italic">
            With all my heart,
          </p>

          <p className="font-display text-2xl text-primary mt-1 italic">
            {senderName || "Yours Forever"}
          </p>
        </div>


      </div>
    </section>
  )
}
