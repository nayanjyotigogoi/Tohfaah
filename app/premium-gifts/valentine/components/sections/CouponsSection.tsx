"use client"

import { useInView } from "@/hooks/use-in-view"
import React from "react"

interface CouponsSectionProps {
  coupons: { title: string; subtitle: string }[]
}

export default function CouponsSection({ coupons }: CouponsSectionProps) {
  const isVisible = useInView("coupons-section", 0.2)

  return (
    <section
      id="coupons-section"
      className="min-h-screen flex flex-col items-center justify-center px-6 py-20"
      style={{ backgroundColor: "#C8102E" }}
    >
      {/* NEW HEADING + TEXT */}
      <div className="text-center mb-12 max-w-2xl">
        <h2
          className="text-4xl sm:text-5xl font-serif italic mb-4"
          style={{ color: "#F5DEB3" }}
        >
          A Little Collection of Love
        </h2>
        <p
          className="text-sm sm:text-base"
          style={{ color: "#FAE0E4" }}
        >
          Each stamp carries a promise — redeemable anytime, sealed with affection,
          and delivered straight from the heart.
        </p>
      </div>

      {/* ORIGINAL GRID (UNCHANGED) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 w-full max-w-4xl">

        {coupons.map((coupon, i) => {
          const variant = i % 4

          return (
            <div
              key={i}
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible
                  ? "translateY(0)"
                  : "translateY(40px)",
                transition: `all 0.8s ease ${i * 120}ms`,
              }}
            >
              <Stamp>
                {variant === 0 && (
                  <StampInner pattern="sunburst">
                    <div className="flex-1 flex items-center justify-center">
                      <HeartIcon className="w-20 h-20" />
                    </div>

                    <ArrowDivider />

                    <p className="italic text-lg text-[#C8102E] font-serif">
                      {coupon.title}
                    </p>
                    <p className="text-xs text-[#C8102E]/80 mt-1">
                      {coupon.subtitle}
                    </p>
                  </StampInner>
                )}

                {variant === 1 && (
                  <StampInner pattern="plain" bgColor="#D65D8C">
                    <div className="flex gap-1 mb-2">
                      <SmallHeart />
                      <SmallHeart />
                      <SmallHeart />
                    </div>

                    <div className="flex flex-col items-center gap-1 flex-1 justify-center">
                      {[0, 1, 2].map((row) => (
                        <div key={row} className="flex items-center gap-2">
                          <span className="font-bold text-xl text-[#F5C6D0] font-serif">
                            X
                          </span>
                          <HeartIcon className="w-5 h-5" fill="#C8102E" />
                          <span className="font-bold text-xl text-[#F5C6D0] font-serif">
                            XO
                          </span>
                        </div>
                      ))}
                    </div>

                    <ArrowDivider color="#F5C6D0" />

                    <p className="italic text-sm text-[#FAE0E4] text-center">
                      {coupon.title}
                    </p>
                    <p className="text-xs text-[#FAE0E4]/80 text-center">
                      {coupon.subtitle}
                    </p>
                  </StampInner>
                )}

                {variant === 2 && (
  <StampInner pattern="sunburst">
    <div className="flex-1 flex items-center justify-center">
      <div className="relative">

        {/* Heart with subtle depth */}
        <HeartIcon
          className="w-24 h-24 drop-shadow-[0_4px_6px_rgba(0,0,0,0.25)]"
        />

        {/* Ribbon Banner */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-8 w-[130%] flex items-center justify-center">
          
          {/* Ribbon tails */}
          <div className="absolute left-0 w-4 h-6 bg-[#D4A843] -skew-x-12" />
          <div className="absolute right-0 w-4 h-6 bg-[#D4A843] skew-x-12" />

          {/* Main ribbon */}
          <div className="bg-[#F5DEB3] border border-[#E3C295] px-4 py-1 shadow-md">
            <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-[#C8102E]">
              {coupon.title.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </div>

    {/* Subtitle with better spacing */}
    <p className="text-xs text-[#C8102E]/80 mt-3 tracking-wide text-center">
      {coupon.subtitle}
    </p>
  </StampInner>
)}


                {variant === 3 && (
                  <StampInner pattern="sunburst" bgColor="#F5A0B8">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] mb-2 text-[#C8102E]">
                      Special Delivery
                    </p>

                    <div className="flex-1 flex items-center justify-center">
                      <HeartIcon className="w-20 h-20" />
                    </div>

                    <ArrowDivider />

                    <p className="text-sm font-medium text-[#C8102E]">
                      {coupon.title}
                    </p>
                    <p className="text-xs text-[#C8102E]/80">
                      {coupon.subtitle}
                    </p>
                  </StampInner>
                )}
              </Stamp>
            </div>
          )
        })}
      </div>
    </section>
  )
}

/* ------------------ Stamp Components ------------------ */

function Stamp({ children }: { children: React.ReactNode }) {
  const dotColor = "#C8102E"
  const borderColor = "#F5DEB3"

  return (
    <div className="relative p-4" style={{ backgroundColor: borderColor }}>
      {/* perforation */}
      {["top", "bottom"].map((pos) => (
        <div
          key={pos}
          className={`absolute ${pos}-0 left-4 right-4 flex justify-between`}
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${
                pos === "top" ? "-translate-y-1/2" : "translate-y-1/2"
              }`}
              style={{ backgroundColor: dotColor }}
            />
          ))}
        </div>
      ))}

      {children}
    </div>
  )
}

function StampInner({
  children,
  pattern = "plain",
  bgColor = "#F5A0C0",
}: {
  children: React.ReactNode
  pattern?: "sunburst" | "plain"
  bgColor?: string
}) {
  return (
    <div
      className="relative overflow-hidden flex flex-col items-center justify-center p-5"
      style={{ backgroundColor: bgColor, aspectRatio: "3 / 4" }}
    >
      {pattern === "sunburst" && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              className="absolute origin-center"
              style={{
                width: "200%",
                height: "3px",
                backgroundColor: "#E896B0",
                transform: `rotate(${i * 7.5}deg)`,
                opacity: 0.6,
              }}
            />
          ))}
        </div>
      )}
      <div className="relative z-10 flex flex-col items-center justify-center h-full w-full">
        {children}
      </div>
    </div>
  )
}

function ArrowDivider({ color = "#C8102E" }: { color?: string }) {
  return (
    <svg width="50" height="10" viewBox="0 0 50 10" fill={color} opacity={0.6}>
      <polygon points="0,5 6,1 6,4 22,4 22,6 6,6 6,9" />
      <polygon points="25,1 29,5 25,9 21,5" />
      <polygon points="50,5 44,1 44,4 28,4 28,6 44,6 44,9" />
    </svg>
  )
}

function HeartIcon({ className = "w-8 h-8", fill = "#C8102E" }) {
  return (
    <svg viewBox="0 0 24 24" fill={fill} className={className}>
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  )
}

function SmallHeart() {
  return <HeartIcon className="w-3 h-3" />
}
