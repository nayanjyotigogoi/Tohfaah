"use client"

import { useState } from "react"
import { Heart } from "lucide-react"

interface AskOutSectionProps {
  dateQuestion: string
  dateActivity: string
  senderName: string
  recipientName: string
  selectedDate?: string
  noMessages?: string[]
}

export default function AskOutSection({
  dateQuestion,
  dateActivity,
  senderName,
  recipientName,
  selectedDate,
  noMessages: configNoMessages,
}: AskOutSectionProps) {

  const [noAttempts, setNoAttempts] = useState(0)
  const [saidYes, setSaidYes] = useState(false)
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 })
  const [confetti, setConfetti] = useState<
    { id: number; x: number; color: string; delay: number }[]
  >([])

  const noMessages =
    configNoMessages && configNoMessages.length > 0
      ? configNoMessages
      : ["No", "Are you sure?", "Really sure?", "Think again!"]

  const yesSize = Math.min(1 + noAttempts * 0.15, 2.5)

  const handleNoHover = () => {
    if (saidYes) return
    setNoPosition({
      x: Math.random() * 300 - 150,
      y: Math.random() * 200 - 100,
    })
  }

  const handleNoClick = () => {
    if (saidYes) return
    setNoAttempts((p) => p + 1)
    handleNoHover()
  }

  const handleYes = () => {
    setSaidYes(true)
    setConfetti(
      Array.from({ length: 40 }).map((_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 100,
        color: [
          "#dc2626",
          "#ec4899",
          "#f97316",
          "#fbbf24",
          "#a855f7",
          "#fb7185",
        ][Math.floor(Math.random() * 6)],
        delay: Math.random() * 1000,
      }))
    )
  }

  /* ======================= YES STATE ======================= */

  if (saidYes) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-pink-100 px-4 relative overflow-hidden">

        {/* ORIGINAL CONFETTI */}
        {confetti.map((c) => (
          <div
            key={c.id}
            className="absolute top-0 w-3 h-3 rounded-sm animate-confetti-fall"
            style={{
              left: `${c.x}%`,
              backgroundColor: c.color,
              animationDelay: `${c.delay}ms`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}

        {/* ORIGINAL FLOATING HEARTS */}
        {Array.from({ length: 20 }).map((_, i) => (
          <Heart
            key={`celeb-${i}`}
            className="absolute text-primary/30 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${20 + Math.random() * 30}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
            fill="currentColor"
          />
        ))}

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-16">

          {/* ORIGINAL CELEBRATION BLOCK (UNCHANGED) */}
          <div className="text-center space-y-8 animate-celebration-burst">
            <div className="animate-heart-burst">
              <Heart className="w-28 h-28 mx-auto text-primary" fill="currentColor" />
            </div>

            <h2 className="font-display text-5xl md:text-7xl text-primary">
              YES!
            </h2>

            <div className="space-y-3">
              <p className="font-display text-2xl md:text-3xl text-foreground">
                {recipientName || "You"} said YES!
              </p>

              <p className="text-muted-foreground text-lg max-w-md mx-auto">
                Get ready for {dateActivity || "an amazing time"} with{" "}
                {senderName || "someone special"}!
              </p>
            </div>
          </div>

          {/* TICKET WITH RETRO PIXEL FONT */}
          <div
            className="bg-pink-200 text-pink-900 p-8 w-[360px] shadow-xl"
            style={{ fontFamily: '"Press Start 2P", monospace' }}
          >
            <p className="text-lg tracking-widest">
              TICKET TO {selectedDate || "DATE"}
            </p>

            <div className="mt-4 text-xs">
              ==================================
            </div>

            <div className="mt-4 text-base">
              Here is my ticket to our date! Can't wait to spend time together and make unforgettable memories. Get ready for a day filled with fun, laughter, and maybe even a little romance. See you soon! 💖:
            </div>

            <div className="mt-4 text-base leading-relaxed min-h-[60px]">
              {dateQuestion || "A beautiful date together."}
            </div>

            <div className="mt-4 text-xs">
              ==================================
            </div>

            <div className="mt-4 text-xs text-center">
              HAVE A WONDERFUL DATE
            </div>

            <div className="mt-4 h-12 bg-black relative overflow-hidden">
              {Array.from({ length: 50 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute top-0 bottom-0 bg-white"
                  style={{
                    left: `${i * 2}%`,
                    width: `${Math.random() > 0.5 ? 2 : 1}px`,
                  }}
                />
              ))}
            </div>

            <div className="mt-3 text-[10px] tracking-widest text-center">
              TOHFAAH
            </div>
          </div>

        </div>
      </section>
    )
  }

  /* DEFAULT STATE UNCHANGED */
  return (
    <section className="min-h-screen flex items-center justify-center bg-pink-50 px-4 py-16 relative overflow-hidden">
      <div className="relative z-10 text-center space-y-10 max-w-lg mx-auto">

        <h2 className="font-display text-4xl md:text-5xl text-foreground">
          {dateQuestion || "Will you go on a date with me?"}
        </h2>

        {noAttempts > 0 && (
          <p className="text-primary font-display text-lg italic">
            {noMessages[Math.min(noAttempts - 1, noMessages.length - 1)]}
          </p>
        )}

        <div className="relative h-40 flex items-center justify-center">

          <button
            onClick={handleYes}
            className="bg-primary text-primary-foreground font-display rounded-full shadow-xl transition-all"
            style={{
              transform: `scale(${yesSize})`,
              padding: "12px 32px",
              fontSize: `${Math.min(18 + noAttempts * 2, 32)}px`,
            }}
          >
            Yes!
          </button>

          <button
            onClick={handleNoClick}
            onMouseEnter={handleNoHover}
            className="absolute bg-muted text-muted-foreground font-display rounded-full transition-all"
            style={{
              transform: `translate(${noPosition.x}px, ${noPosition.y}px)`,
            }}
          >
            No
          </button>

        </div>
      </div>
    </section>
  )
}
