"use client"

import { useState, useMemo } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TruckHeartsSectionProps {
  recipientName: string
}

export default function TruckHeartsSection({ recipientName }: TruckHeartsSectionProps) {
  const [phase, setPhase] = useState<"idle" | "arriving" | "dumping" | "done">("idle")

  const personX = 75

  const showerHearts = useMemo(() => {
    return Array.from({ length: 70 }).map((_, i) => ({
      id: i,
      startX: personX - 10 + Math.random() * 20,
      size: 14 + Math.random() * 16,
      delay: i * 55,
      duration: 1800 + Math.random() * 600,
    }))
  }, [phase === "dumping"])

  const handleStart = () => {
    setPhase("arriving")
    setTimeout(() => setPhase("dumping"), 1600)
    setTimeout(() => setPhase("done"), 5500)
    setTimeout(() => setPhase("idle"), 9500)
  }

  return (
    <section className="w-full min-h-[100svh] bg-card relative overflow-hidden flex flex-col justify-center px-4">

      {/* MAIN SCENE */}
      <div className={`transition-opacity duration-500 ${phase === "done" ? "opacity-0" : "opacity-100"}`}>

        <div className="text-center space-y-2 w-full max-w-3xl mx-auto relative z-10">

          <h2 className="font-display text-4xl md:text-5xl tracking-wide">
            Truckload of Love
          </h2>

          <p className="text-muted-foreground text-lg">
            For <span className="text-primary font-semibold">{recipientName || "you"}</span>,
            falling endlessly 💖
          </p>

          <div className="relative h-[18rem] w-full">

            <div className="absolute bottom-0 w-full h-5 bg-foreground/20 rounded-full" />

            <div
              className={`absolute bottom-5 transition-all duration-[1600ms] ease-out ${
                phase === "arriving"
                  ? "translate-x-0"
                  : phase === "idle"
                  ? "-translate-x-[130%]"
                  : "translate-x-0"
              }`}
              style={{ left: "5%" }}
            >
              <div className="relative">
                <div
                  className={`transition-transform duration-700 ${
                    phase === "dumping" ? "rotate-[18deg]" : ""
                  }`}
                  style={{ transformOrigin: "right bottom" }}
                >
                  <svg viewBox="0 0 120 60" className="w-32 h-16">
                    <rect x="0" y="0" width="120" height="60" rx="6" fill="#ef4444" />
                  </svg>
                </div>

                <div className="absolute -left-20 bottom-0">
                  <svg viewBox="0 0 80 60" className="w-20 h-16">
                    <rect x="0" y="8" width="80" height="50" rx="10" fill="#dc2626" />
                    <rect x="10" y="18" width="35" height="25" rx="6" fill="#93c5fd" />
                  </svg>
                </div>

                <div className="absolute -bottom-4 left-6 w-8 h-8 bg-foreground rounded-full shadow-lg" />
                <div className="absolute -bottom-4 right-6 w-8 h-8 bg-foreground rounded-full shadow-lg" />
              </div>
            </div>

            <div className="absolute bottom-5 right-[15%]">
              <svg viewBox="0 0 60 100" className="w-14 h-24">
                <circle cx="30" cy="15" r="12" fill="#333" />
                <line x1="30" y1="27" x2="30" y2="60" stroke="#333" strokeWidth="4" />
                <line x1="30" y1="35" x2="10" y2="50" stroke="#333" strokeWidth="4" />
                <line x1="30" y1="35" x2="50" y2="50" stroke="#333" strokeWidth="4" />
                <line x1="30" y1="60" x2="15" y2="90" stroke="#333" strokeWidth="4" />
                <line x1="30" y1="60" x2="45" y2="90" stroke="#333" strokeWidth="4" />
              </svg>
            </div>

            {phase === "dumping" &&
              showerHearts.map((h) => (
                <Heart
                  key={h.id}
                  className="absolute text-red-500 drop-shadow-lg"
                  style={{
                    left: `${h.startX}%`,
                    top: "20%",
                    width: `${h.size}px`,
                    height: `${h.size}px`,
                    opacity: 0,
                    animation: `heart-fall ${h.duration}ms ease-in ${h.delay}ms forwards`,
                  }}
                  fill="currentColor"
                />
              ))}
          </div>

          <Button
            onClick={handleStart}
            size="lg"
            className="gap-2 text-lg px-8 shadow-md"
            disabled={phase !== "idle"}
          >
            <Heart className="w-5 h-5" />
            Send Truckload
          </Button>
        </div>
      </div>

      {/* FULL SCREEN SUCCESS */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center text-center transition-all duration-700 ${
          phase === "done"
            ? "opacity-100"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Background gradient takeover */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-rose-500 to-red-500 animate-fade-in" />

        {/* Floating subtle hearts */}
        {Array.from({ length: 25 }).map((_, i) => (
          <Heart
            key={i}
            className="absolute text-white/20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${20 + Math.random() * 30}px`,
              height: `${20 + Math.random() * 30}px`,
              animationDelay: `${i * 200}ms`,
            }}
            fill="currentColor"
          />
        ))}

        {/* Success Text */}
        <div className="relative z-10 text-white px-6">
          <Heart className="w-14 h-14 mx-auto mb-6 animate-pulse" />
          <h3 className="font-display text-4xl md:text-6xl mb-4">
            Love Delivered
          </h3>
          <p className="text-lg md:text-xl opacity-90">
            A truckload of love has reached {recipientName || "you"} 💖
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes heart-fall {
          0% { transform: translateY(0px); opacity: 0; }
          20% { opacity: 1; }
          100% { transform: translateY(220px); opacity: 0; }
        }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
}
