"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, useReducedMotion, easeOut } from "framer-motion"
import { Heart } from "lucide-react"

interface DateCalendarProps {
  selectedDate: number
}

const HEART_DELAY = 500

export default function DateCalendar({ selectedDate }: DateCalendarProps) {
  const [showHeart, setShowHeart] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  // You must define month & year
  const selectedMonth = new Date().getMonth()
  const selectedYear = new Date().getFullYear()

  /* --------------------------------- */
  /* Heart Delay */
  /* --------------------------------- */
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHeart(true)
    }, HEART_DELAY)

    return () => clearTimeout(timer)
  }, [])

  /* --------------------------------- */
  /* Date List */
  /* --------------------------------- */
  const dateList = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => selectedDate - 2 + i)
  }, [selectedDate])

  /* --------------------------------- */
  /* Motion Variants */
  /* --------------------------------- */
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.8,
      },
    },
  }

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: easeOut,
      },
    },
  }

  const titleVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 20,
    },
    visible: (delay: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: easeOut,
        delay,
      },
    }),
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-[hsl(0,0%,98%)] px-4">
      <div className="text-center space-y-10">

        {/* Subtitle */}
        <motion.p
          className="uppercase tracking-[0.3em] text-muted-foreground text-sm"
          initial="hidden"
          animate="visible"
          variants={itemVariants}
        >
          {"It's your reminder to"}
        </motion.p>

        {/* Top Title */}
        <motion.h1
          className="font-display text-6xl md:text-8xl text-primary italic"
          custom={0.3}
          initial="hidden"
          animate="visible"
          variants={titleVariants}
        >
          be my
        </motion.h1>

        {/* Bottom Title */}
        <motion.h1
          className="font-display text-6xl md:text-8xl text-primary italic"
          custom={1.2}
          initial="hidden"
          animate="visible"
          variants={titleVariants}
        >
          valentine on
        </motion.h1>

        {/* Dates Row */}
        <motion.div
          className="flex items-center justify-center gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {dateList.map((date, index) => {
            const isSelected = date === selectedDate

            const fullDate = new Date(selectedYear, selectedMonth, date)

            const dayName = fullDate
              .toLocaleDateString("en-US", { weekday: "short" })
              .toUpperCase()

            const year = fullDate.getFullYear()

            return (
              <motion.div
                key={`date-${index}-${date}`}
                variants={itemVariants}
                className={`relative w-16 h-20 md:w-20 md:h-24 rounded-xl border-2 flex flex-col items-center justify-center font-display ${
                  isSelected
                    ? "border-transparent"
                    : "border-border/50 text-muted-foreground"
                }`}
              >
                {isSelected && showHeart && (
                  <Heart
                    className="absolute w-16 h-16 md:w-20 md:h-20 text-primary animate-pulse-heart"
                    strokeWidth={1.5}
                  />
                )}

                {/* Day */}
                <span className="text-[10px] md:text-xs tracking-widest">
                  {dayName}
                </span>

                {/* Date */}
                <span className="text-xl md:text-2xl leading-none">
                  {date}
                </span>

                {/* Year */}
                <span className="text-[10px] md:text-xs opacity-70">
                  {year}
                </span>
              </motion.div>
            )
          })}
        </motion.div>

      </div>
    </section>
  )
}
