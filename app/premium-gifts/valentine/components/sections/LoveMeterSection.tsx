"use client"

import { useState, useEffect } from "react"
import { useInView } from "@/hooks/use-in-view"

interface LoveMeterSectionProps {
  loveLevel: number
}

export default function LoveMeterSection({ loveLevel }: LoveMeterSectionProps) {
  const [animatedLevel, setAnimatedLevel] = useState(0)
  const isVisible = useInView("love-meter-section")

  useEffect(() => {
    if (!isVisible) return

    let start: number | null = null
    const duration = 1000

    const animate = (timestamp: number) => {
      if (!start) start = timestamp
      const progress = timestamp - start
      const percentage = Math.min(progress / duration, 1)
      const value = Math.round(loveLevel * percentage)

      setAnimatedLevel(value)

      if (percentage < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [isVisible, loveLevel])

  const rotation = -90 + (animatedLevel / 100) * 180

  return (
    <section
      id="love-meter-section"
      className="min-h-screen flex items-center justify-center bg-[hsl(0,0%,96%)] px-4"
    >
      <div className="text-center space-y-8">
        <h2 className="font-display text-4xl md:text-5xl text-foreground">
          How Much Do I Love You?
        </h2>

        <div className="relative w-72 h-40 md:w-96 md:h-52 mx-auto">
          <svg viewBox="0 0 200 110" className="w-full h-full">
            {[0, 1, 2, 3, 4, 5, 6].map((i) => {
              const startAngle = -180 + i * 25.7
              const endAngle = startAngle + 24
              const sr = (startAngle * Math.PI) / 180
              const er = (endAngle * Math.PI) / 180
              const x1 = 100 + 80 * Math.cos(sr)
              const y1 = 100 + 80 * Math.sin(sr)
              const x2 = 100 + 80 * Math.cos(er)
              const y2 = 100 + 80 * Math.sin(er)
              const x3 = 100 + 50 * Math.cos(er)
              const y3 = 100 + 50 * Math.sin(er)
              const x4 = 100 + 50 * Math.cos(sr)
              const y4 = 100 + 50 * Math.sin(sr)

              const p = [255, 182, 193]
              const r = [200, 30, 50]
              const t = i / 6
              const c = `rgb(${Math.round(
                p[0] + (r[0] - p[0]) * t
              )},${Math.round(
                p[1] + (r[1] - p[1]) * t
              )},${Math.round(
                p[2] + (r[2] - p[2]) * t
              )})`

              return (
                <path
                  key={i}
                  d={`M ${x1} ${y1} A 80 80 0 0 1 ${x2} ${y2} L ${x3} ${y3} A 50 50 0 0 0 ${x4} ${y4} Z`}
                  fill={c}
                  stroke="white"
                  strokeWidth="2"
                />
              )
            })}
          </svg>

          <div
            className="absolute bottom-0 left-1/2 w-1 h-20 md:h-24 bg-primary origin-bottom rounded-full"
            style={{
              transform: `translateX(-50%) rotate(${rotation}deg)`,
              transition: "transform 0.6s ease-out",
              boxShadow: "0 0 10px rgba(0,0,0,0.2)",
            }}
          >
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary" />
          </div>

          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-6 h-6 rounded-full bg-card border-4 border-primary" />

          <p className="absolute top-1/2 left-1/2 -translate-x-1/2 font-display text-2xl md:text-3xl text-primary italic">
            love
          </p>
        </div>

        <p className="font-display text-6xl md:text-8xl text-primary">
          {animatedLevel}%
        </p>
      </div>
    </section>
  )
}
