"use client"

import { useState } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CarSectionProps {
  carDesign: string
  senderName: string
  recipientName: string
}

export default function CarSection({ carDesign, senderName, recipientName }: CarSectionProps)
 {
  const [started, setStarted] = useState(false)
  const [showTrail, setShowTrail] = useState(false)
  const [arrived, setArrived] = useState(false)

  const colors =
    {
      pink: { body: "fill-pink-300", accent: "fill-pink-100" },
      red: { body: "fill-red-500", accent: "fill-red-300" },
      classic: { body: "fill-amber-200", accent: "fill-amber-100" },
    }[carDesign] || { body: "fill-pink-300", accent: "fill-pink-100" }

  const handleStart = () => {
    if (started) return

    setStarted(true)
    setShowTrail(false)
    setArrived(false)

    setTimeout(() => setShowTrail(true), 600)

    // Trigger arrival slightly before animation ends
    setTimeout(() => {
      setArrived(true)
    }, 7000)

    // Reset everything
    setTimeout(() => {
      setStarted(false)
      setShowTrail(false)
      setArrived(false)
    }, 10000)
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-[hsl(30,30%,95%)] px-4 relative overflow-hidden">

      {/* CINEMATIC OVERLAY */}
      {arrived && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-20 fade-in">
          <div className="text-center space-y-6 scale-in">
            <Heart className="w-20 h-20 text-red-500 fill-red-500 mx-auto pulse-heart" />
            <h3 className="text-3xl font-display text-white tracking-wide">
              Destination Reached
            </h3>
            <p className="text-white/80">
              Love Delivered Successfully 💌
            </p>
          </div>
        </div>
      )}

      <div className="text-center space-y-8 w-full relative z-10">
        <h2 className="font-display text-4xl md:text-5xl text-foreground">
          Special Delivery
        </h2>

        <p className="text-muted-foreground text-lg">
          From {senderName || "Someone Special"} with love
        </p>

        <div className="relative h-48 w-full max-w-4xl mx-auto overflow-hidden">

          {/* ROAD */}
          <div className="absolute bottom-0 w-full h-6 bg-foreground/20 rounded overflow-hidden">
            <div className={`absolute top-1/2 left-0 right-0 h-0.5 flex gap-6 px-4 ${started ? "road-move" : ""}`}>
              {Array.from({ length: 30 }).map((_, i) => (
                <div key={i} className="w-10 h-full bg-amber-400" />
              ))}
            </div>
          </div>

          {/* CAR */}
          <div className={`absolute bottom-6 ${started ? "car-drive" : ""}`}>
            <div className="relative">

              {/* DELIVERY HEART */}
             <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center">

                {/* Strap */}
              <div className="w-[2px] h-1 bg-gray-500/80" />

                {/* Heart */}
                <div className="relative">
                  <Heart className="w-20 h-15 text-red-500 fill-red-500 drop-shadow-lg" />
                  <span
  className="absolute inset-0 flex items-center justify-center text-white font-semibold px-3 text-center"
  style={{
    fontSize:
      (recipientName?.length || 0) > 20
        ? "7px"
        : (recipientName?.length || 0) > 14
        ? "8.5px"
        : "10px",
    lineHeight: "1.15",
    maxWidth: "85%",
    wordBreak: "break-word",
    textShadow: "0 1px 2px rgba(0,0,0,0.25)",
  }}
>
  <span className="block text-[7px] opacity-80 mb-[1px]">
    To
  </span>
  <span className="block">
    {recipientName || "You"}
  </span>
</span>

                </div>

              </div>



              <svg viewBox="0 0 120 60" className="w-48 h-24">
                <rect x="5" y="15" width="110" height="35" rx="8" className={colors.body} />
                <rect x="5" y="10" width="110" height="10" rx="5" className={colors.accent} />
                <rect x="15" y="20" width="20" height="15" rx="2" fill="#87CEEB" />
                <rect x="40" y="20" width="20" height="15" rx="2" fill="#87CEEB" />
                <rect x="65" y="20" width="20" height="15" rx="2" fill="#87CEEB" />
                <rect x="90" y="20" width="20" height="15" rx="2" fill="#87CEEB" />

                <circle cx="30" cy="50" r="10" fill="#333" />
                <circle cx="90" cy="50" r="10" fill="#333" />
              </svg>

              {/* TRAIL */}
              {showTrail && (
                <div className="absolute -left-10 top-2">
                  {[0, 1, 2].map((i) => (
                    <Heart
                      key={i}
                      className="absolute text-pink-400 opacity-70"
                      style={{
                        left: `${-i * 18}px`,
                        top: `${-8 + i * 4}px`,
                        width: `${18 - i * 4}px`,
                        animation: `trailFloat 1.2s ease-in-out ${i * 0.2}s infinite`,
                      }}
                      fill="currentColor"
                    />
                  ))}
                </div>
              )}

            </div>
          </div>

        </div>

        <Button
          onClick={handleStart}
          size="lg"
          className="gap-2 text-lg px-8"
          disabled={started}
        >
          Send Love
        </Button>
      </div>

      <style jsx>{`
        .car-drive {
          animation: drive 15s cubic-bezier(.4,.0,.2,1) forwards;
        }

        .road-move {
          animation: road 1s linear infinite;
        }

        .fade-in {
          animation: fadeIn 0.6s ease forwards;
        }

        .scale-in {
          animation: scaleIn 0.6s ease forwards;
        }

        .pulse-heart {
          animation: pulse 1.2s ease-in-out infinite;
        }

        @keyframes drive {
          0% { transform: translateX(-200px); }
          80% { transform: translateX(90vw); }
          100% { transform: translateX(100vw); }
        }

        @keyframes road {
          from { transform: translateX(0); }
          to { transform: translateX(-60px); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scaleIn {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        @keyframes pulse {
          0%,100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        @keyframes trailFloat {
          0%,100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
    </section>
  )
}
