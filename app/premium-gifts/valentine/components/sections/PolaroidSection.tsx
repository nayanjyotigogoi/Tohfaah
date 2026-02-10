"use client"

import { Heart } from "lucide-react"
import { useInView } from "@/hooks/use-in-view"
import { useMemo } from "react"

interface PolaroidSectionProps {
  photo1: string | null
  photo2: string | null
}

export default function PolaroidSection({ photo1, photo2 }: PolaroidSectionProps) {
  const isVisible = useInView("polaroid-section", 0.3)

  const floatingHearts = useMemo(() => {
    return Array.from({ length: 10 }).map((_, i) => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${16 + Math.random() * 18}px`,
      delay: `${Math.random() * 4}s`,
      duration: `${6 + Math.random() * 4}s`,
    }))
  }, [])

  return (
    <section
      id="polaroid-section"
      className="relative flex items-center justify-center bg-[hsl(350,70%,50%)] px-6 py-7 overflow-hidden"
    >
      {/* Floating hearts */}
      <div className="absolute inset-0 pointer-events-none">
        {floatingHearts.map((h, i) => (
          <Heart
            key={`float-${i}`}
            className="absolute text-red-400/20 animate-float"
            style={{
              left: h.left,
              top: h.top,
              width: h.size,
              animationDelay: h.delay,
              animationDuration: h.duration,
            }}
            fill="currentColor"
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-5xl text-center space-y-11">

        {/* Heart icon */}
        <div
          className={`transition-all duration-700 ${
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
          }`}
        >
          <Heart
            className="mx-auto text-red-600"
            size={70}
            fill="currentColor"
          />
        </div>

        {/* Polaroids */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">

          <div
            className={`relative bg-card p-3 pb-12 shadow-2xl transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-y-0 rotate-[-6deg]"
                : "opacity-0 -translate-y-10 rotate-0"
            }`}
          >
            {photo1 ? (
              <img
                src={photo1}
                alt="Memory 1"
                className="w-52 h-58 md:w-56 md:h-72 object-cover"
              />
            ) : (
              <div className="w-52 h-68 md:w-56 md:h-72 bg-muted flex items-center justify-center">
                <span className="text-muted-foreground text-sm">
                  No photo
                </span>
              </div>
            )}

            <p className="absolute bottom-4 left-0 right-0 text-center font-display text-sm text-muted-foreground italic">
              You & Me
            </p>
          </div>

          <div
            className={`relative bg-card p-3 pb-12 shadow-2xl transition-all duration-700 delay-150 ${
              isVisible
                ? "opacity-100 translate-y-0 rotate-[5deg]"
                : "opacity-0 -translate-y-10 rotate-0"
            }`}
          >
            {photo2 ? (
              <img
                src={photo2}
                alt="Memory 2"
                className="w-52 h-68 md:w-56 md:h-72 object-cover"
              />
            ) : (
              <div className="w-52 h-68 md:w-56 md:h-72 bg-muted flex items-center justify-center">
                <span className="text-muted-foreground text-sm">
                  No photo
                </span>
              </div>
            )}

            <p className="absolute bottom-4 left-0 right-0 text-center font-display text-sm text-muted-foreground italic">
              Forever
            </p>
          </div>
        </div>

        {/* Caption */}
        <p
          className={`font-display text-2xl md:text-3xl text-card italic transition-all duration-700 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          Every moment with you is a treasure
        </p>
      </div>

      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px); opacity: 0.6; }
          50% { transform: translateY(-15px); opacity: 1; }
          100% { transform: translateY(0px); opacity: 0.6; }
        }
        .animate-float {
          animation-name: float;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
      `}</style>
    </section>
  )
}
