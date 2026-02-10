"use client"

import React from "react"
import { useState, useCallback, useMemo } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Particle {
  id: number
  x: number
  size: number
  delay: number
  drift: number
  type: "heart" | "sparkle"
}

interface BalloonConfig {
  cx: number
  cy: number
  rx: number
  ry: number
  fill: string
  highlight: string
  delay: number
  floatOffset: number
  stringLength: number
}

const BALLOONS: BalloonConfig[] = [
  { cx: 50, cy: 22, rx: 38, ry: 50, fill: "#f9a8d4", highlight: "#fce4ec", delay: 0, floatOffset: 0, stringLength: 60 },
  { cx: 22, cy: 42, rx: 25, ry: 36, fill: "#f472b6", highlight: "#fbb4ce", delay: 0.3, floatOffset: 8, stringLength: 50 },
  { cx: 78, cy: 38, rx: 22, ry: 28, fill: "#f472b6", highlight: "#fbb4ce", delay: 0.5, floatOffset: 4, stringLength: 55 },
  { cx: 38, cy: 58, rx: 16, ry: 20, fill: "#f9a8d4", highlight: "#fce4ec", delay: 0.7, floatOffset: 12, stringLength: 40 },
  { cx: 65, cy: 56, rx: 18, ry: 22, fill: "#f9a8d4", highlight: "#fce4ec", delay: 0.4, floatOffset: 6, stringLength: 45 },
  { cx: 10, cy: 60, rx: 24, ry: 28, fill: "#f472b6", highlight: "#fbb4ce", delay: 0.9, floatOffset: 10, stringLength: 35 },
  { cx: 88, cy: 58, rx: 24, ry: 28, fill: "#f9a8d4", highlight: "#fce4ec", delay: 0.6, floatOffset: 14, stringLength: 38 },
]

/* ========================= */
/* Cloud Component           */
/* ========================= */
function Cloud({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div className={className} style={style}>
      <svg viewBox="0 0 200 80" className="w-full h-full">
        <ellipse cx="70" cy="50" rx="60" ry="25" fill="white" opacity="0.35" />
        <ellipse cx="110" cy="40" rx="50" ry="30" fill="white" opacity="0.3" />
        <ellipse cx="140" cy="55" rx="40" ry="20" fill="white" opacity="0.25" />
        <ellipse cx="50" cy="45" rx="35" ry="18" fill="white" opacity="0.2" />
      </svg>
    </div>
  )
}

/* ========================= */
/* Star Component            */
/* ========================= */
function Star({ x, y, size, delay }: { x: number; y: number; size: number; delay: number }) {
  return (
    <div
      className="absolute animate-sparkle"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${2 + delay}s`,
      }}
    >
      <svg viewBox="0 0 24 24" width={size} height={size}>
        <path
          d="M12 2L13.5 9.5L21 11L13.5 12.5L12 20L10.5 12.5L3 11L10.5 9.5Z"
          fill="#f9a8d4"
          opacity="0.5"
        />
      </svg>
    </div>
  )
}

/* ========================= */
/* Balloon Component         */
/* ========================= */
function Balloon({ balloon, released }: { balloon: BalloonConfig; released: boolean }) {
  return (
    <div
      className={`absolute ${released ? "animate-balloon-release" : "animate-balloon-idle"}`}
      style={{
        left: `${balloon.cx}%`,
        top: `${balloon.cy}%`,
        transform: "translate(-50%, 0)",
        animationDelay: `${balloon.delay}s`,
        animationDuration: released ? `${2.5 + balloon.delay}s` : "4s",
      }}
    >
      <svg viewBox="0 0 100 180" style={{ width: `${balloon.rx * 2.5}px` }}>
        <ellipse cx="50" cy="50" rx={balloon.rx} ry={balloon.ry} fill={balloon.fill} />
        <ellipse
          cx={50 - balloon.rx * 0.3}
          cy={50 - balloon.ry * 0.3}
          rx={balloon.rx * 0.25}
          ry={balloon.ry * 0.35}
          fill={balloon.highlight}
          opacity="0.6"
        />
        <polygon
          points={`${50 - 4},${50 + balloon.ry} 50,${50 + balloon.ry + 8} ${50 + 4},${50 + balloon.ry}`}
          fill={balloon.fill}
          opacity="0.8"
        />
        <path
          d={`M50 ${50 + balloon.ry + 8} Q${45 + Math.sin(balloon.delay * 3) * 8} ${50 + balloon.ry + 30} 50 ${50 + balloon.ry + balloon.stringLength}`}
          stroke="#c4b5a8"
          strokeWidth="1"
          fill="none"
          opacity="0.6"
        />
      </svg>
    </div>
  )
}

/* ========================= */
/* Main Section              */
/* ========================= */

export default function BalloonSection() {
  const [released, setReleased] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [particles, setParticles] = useState<Particle[]>([])
  const [clickCount, setClickCount] = useState(0)

  const stars = useMemo(
    () =>
      Array.from({ length: 8 }).map(() => ({
        x: 5 + Math.random() * 90,
        y: 5 + Math.random() * 60,
        size: 10 + Math.random() * 14,
        delay: Math.random() * 3,
      })),
    []
  )

  const handleRelease = useCallback(() => {
    if (released) return

    setReleased(true)
    setCompleted(false)
    setClickCount((c) => c + 1)

    const newParticles: Particle[] = Array.from({ length: 24 }).map((_, i) => ({
      id: Date.now() + i,
      x: 15 + Math.random() * 70,
      size: 14 + Math.random() * 22,
      delay: Math.random() * 1.2,
      drift: -30 + Math.random() * 60,
      type: Math.random() > 0.3 ? "heart" : "sparkle",
    }))

    setParticles(newParticles)

    setTimeout(() => {
      setReleased(false)
      setParticles([])
      setCompleted(true)
    }, 5000)
  }, [released])

  return (
    <section
       className="relative h-screen w-full overflow-hidden flex items-start justify-center px-4 pt-16 md:pt-20"
      style={{
        background:
          "linear-gradient(180deg, hsl(200, 70%, 92%) 0%, hsl(200, 60%, 85%) 60%, hsl(200, 50%, 80%) 100%)",
      }}
    >
      {/* ambient glow */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${released ? "opacity-100" : "opacity-0"}`}
        style={{
          background: "radial-gradient(ellipse at 50% 60%, hsla(340, 70%, 80%, 0.25) 0%, transparent 70%)",
        }}
      />

      {/* clouds */}
      <Cloud
        className="absolute top-8 -left-8 w-48 h-20 animate-cloud-drift"
        style={{ animationDuration: "22s" }}
      />
      <Cloud
        className="absolute top-24 right-0 w-64 h-24 animate-cloud-drift-reverse"
        style={{ animationDuration: "28s" }}
      />
      <Cloud
        className="absolute top-48 left-1/4 w-40 h-16 animate-cloud-drift"
        style={{ animationDuration: "18s", animationDelay: "5s" }}
      />
      <Cloud
        className="absolute bottom-32 right-1/4 w-52 h-20 animate-cloud-drift-reverse"
        style={{ animationDuration: "24s", animationDelay: "3s" }}
      />
      <Cloud
        className="absolute bottom-16 -left-4 w-36 h-14 animate-cloud-drift"
        style={{ animationDuration: "30s", animationDelay: "8s" }}
      />

      {/* decorative sparkles */}
      {stars.map((s, i) => (
        <Star key={i} {...s} />
      ))}

      {/* rising heart particles */}
      {particles.map((p) =>
        p.type === "heart" ? (
          <Heart
            key={p.id}
            className="absolute animate-heart-rise"
            style={{
              left: `${p.x}%`,
              bottom: "30%",
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDelay: `${p.delay}s`,
              color: p.size > 25 ? "#f472b6" : "#f9a8d4",
            }}
            fill="currentColor"
          />
        ) : (
          <div
            key={p.id}
            className="absolute animate-heart-rise"
            style={{
              left: `${p.x}%`,
              bottom: "30%",
              animationDelay: `${p.delay}s`,
            }}
          >
            <svg viewBox="0 0 24 24" width={p.size * 0.8} height={p.size * 0.8}>
              <path
                d="M12 2L13.5 9.5L21 11L13.5 12.5L12 20L10.5 12.5L3 11L10.5 9.5Z"
                fill="#f9a8d4"
                opacity="0.7"
              />
            </svg>
          </div>
        )
      )}

      {/* main content */}
      <div className="relative z-10 flex flex-col items-center gap-6 md:gap-8 text-center w-full max-w-4xl">

        {/* original heading preserved */}
        <div className="text-center space-y-4 animate-fade-in-up">
          <p className="text-sm md:text-base tracking-[0.3em] uppercase text-foreground/50">
            A moment of magic
          </p>
          <h2 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tight text-foreground">
            Let Love Fly
          </h2>
          <p className="text-base md:text-lg text-foreground/60 max-w-md mx-auto leading-relaxed">
            Click to release a bouquet of balloons into the sky and watch your love soar beyond the clouds.
          </p>
        </div>

        {/* balloon cluster unchanged */}
        <div className="relative w-[300px] h-[320px] md:w-[380px] md:h-[100px]">
          {BALLOONS.map((b, i) => (
            <Balloon key={i} balloon={b} released={released} />
          ))}
        </div>

        {/* button */}
        <div>
          <Button
            onClick={handleRelease}
            size="lg"
            disabled={released}
            className="gap-3 text-base md:text-lg px-10 py-6 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-60 disabled:hover:scale-100"
          >
            <Heart className="w-5 h-5" fill={released ? "currentColor" : "none"} />
            {released ? "Love is Soaring..." : "Release Love"}
          </Button>

          {completed && (
            <p className="mt-6 text-lg text-foreground/70 animate-fade-in-up">
               Your love is now floating among the clouds.
            </p>
          )}

          {clickCount > 0 && !released && (
            <p className="text-center text-sm text-foreground/40 mt-3 animate-fade-in-up">
              {"Released " + clickCount + (clickCount === 1 ? " time" : " times")}
            </p>
          )}
        </div>
      </div>
      {/* bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: "linear-gradient(to top, hsl(200, 50%, 80%), transparent)",
        }}
      />
    </section>
  )
}
