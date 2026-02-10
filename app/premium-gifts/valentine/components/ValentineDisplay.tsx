"use client"

import { useEffect, useRef, useState } from "react"
import { RotateCcw, Heart } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import type { ValentineConfig } from "@/lib/valentine-types"

import {
  DateCalendar,
  LoveMeterSection,
  WordSearchSection,
  PolaroidSection,
  BalloonSection,
  CarSection,
  HeartToHeartSection,
  CouponsSection,
  TruckHeartsSection,
  AskOutSection,
  ForeverSection,
  FinalMessage,
} from "./sections"

interface ValentineDisplayProps {
  config: ValentineConfig
}

export function ValentineDisplay({ config }: ValentineDisplayProps) {
  const router = useRouter()

  const [index, setIndex] = useState(0)
  const [nextIndex, setNextIndex] = useState<number | null>(null)
  const [showChapter, setShowChapter] = useState(true)
  const [showNavigator, setShowNavigator] = useState(false)
  const touchStartY = useRef<number | null>(null)
  const isTransitioning = useRef(false)

  const chapters = [
    "The Journey Begins",
    "Our Beautiful Memories",
    "A Perfect Match",
    "A Little Secret",
    "From My Heart To Yours",
    "Our Next Special Date",
    "Little Promises",
    "A Celebration Of Us",
    "Love In Motion",
    "One Important Question",
    "Forever Starts Here",
    "Until Always",
  ]

  const sections = [
    <CarSection
      carDesign={config.visuals.carDesign}
      senderName={config.identity.senderName}
      recipientName={config.identity.recipientName}
    />,
    <PolaroidSection
      photo1={config.visuals.photo1}
      photo2={config.visuals.photo2}
    />,
    <LoveMeterSection loveLevel={config.visuals.loveLevel} />,
    <WordSearchSection
      secretWord={config.puzzle.secretWord}
      hint={config.puzzle.hint}
    />,
    <HeartToHeartSection
      message={config.message.heartToHeartMessage}
      senderName={config.identity.senderName}
      recipientName={config.identity.recipientName}
    />,
    <DateCalendar selectedDate={config.identity.selectedDate} />,
    <CouponsSection coupons={config.message.coupons} />,
    <BalloonSection />,
    <TruckHeartsSection recipientName={config.identity.recipientName} />,
    <AskOutSection
      dateQuestion={config.interaction.dateQuestion}
      dateActivity={config.interaction.dateActivity}
      senderName={config.identity.senderName}
      recipientName={config.identity.recipientName}
      noMessages={config.interaction.noMessages}
      activityLabels={config.interaction.activityLabels}
    />,
    <ForeverSection
      foreverMessage={config.closing.foreverMessage}
      senderName={config.identity.senderName}
      recipientName={config.identity.recipientName}
    />,
    <FinalMessage
      senderName={config.identity.senderName}
      recipientName={config.identity.recipientName}
    />,
  ]

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowChapter(false)
    }, 1200)
    return () => clearTimeout(timer)
  }, [])

  const goTo = (next: number) => {
    if (next < 0 || next >= sections.length) return
    if (isTransitioning.current) return

    isTransitioning.current = true
    setNextIndex(next)
    setShowChapter(true)

    setTimeout(() => {
      setIndex(next)
    }, 600)

    setTimeout(() => {
      setShowChapter(false)
      isTransitioning.current = false
    }, 1400)
  }

  /* Wheel */
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 0) goTo(index + 1)
      if (e.deltaY < 0) goTo(index - 1)
    }
    window.addEventListener("wheel", handleWheel)
    return () => window.removeEventListener("wheel", handleWheel)
  }, [index])

  /* Keyboard */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") goTo(index + 1)
      if (e.key === "ArrowUp") goTo(index - 1)
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [index])

  /* Touch */
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartY.current === null) return
      const delta = touchStartY.current - e.changedTouches[0].clientY
      if (delta > 50) goTo(index + 1)
      if (delta < -50) goTo(index - 1)
      touchStartY.current = null
    }

    window.addEventListener("touchstart", handleTouchStart)
    window.addEventListener("touchend", handleTouchEnd)

    return () => {
      window.removeEventListener("touchstart", handleTouchStart)
      window.removeEventListener("touchend", handleTouchEnd)
    }
  }, [index])

  const displayChapterIndex = nextIndex ?? index

  return (
    <div className="relative min-h-screen bg-white overflow-hidden">

      {/* Create Button */}
      <button
        onClick={() => router.push("/premium-gifts/valentine/create")}
        className="fixed top-6 right-6 z-50 px-5 py-2.5 rounded-full 
                   bg-gradient-to-r from-pink-500 to-rose-500 
                   text-white text-sm shadow-xl 
                   hover:scale-105 transition-all duration-300 
                   flex items-center gap-2"
      >
        <RotateCcw className="w-4 h-4" />
        Create Yours 💘
      </button>

      {/* Playful Navigator Toggle */}
      <button
        onClick={() => setShowNavigator(!showNavigator)}
        className="fixed bottom-6 left-6 z-50 bg-pink-500 text-white 
                   w-12 h-12 rounded-full shadow-xl flex items-center 
                   justify-center hover:scale-110 transition"
      >
        <Heart className="w-5 h-5" />
      </button>

      {/* Floating Chapter Menu */}
      <AnimatePresence>
        {showNavigator && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 left-6 bg-white rounded-2xl shadow-2xl p-4 z-50 w-64"
          >
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {chapters.map((title, i) => (
                <button
                  key={i}
                  onClick={() => {
                    goTo(i)
                    setShowNavigator(false)
                  }}
                  className={`w-full text-left text-sm px-3 py-2 rounded-lg transition ${
                    i === index
                      ? "bg-pink-100 text-pink-600"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {i + 1}. {title}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chapter Splash */}
      <AnimatePresence>
        {showChapter && (
          <motion.div
            key={displayChapterIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-white flex items-center justify-center z-40"
          >
            <div className="text-center">
              <p className="text-xs tracking-[0.4em] uppercase text-gray-400 mb-3">
                Chapter {displayChapterIndex + 1}
              </p>
              <h2 className="text-2xl font-light text-gray-700">
                {chapters[displayChapterIndex]}
              </h2>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section */}
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.6 }}
        >
          {sections[index]}
        </motion.div>
      </AnimatePresence>

      {/* Clickable Progress Dots */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-50">
        {sections.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              i === index
                ? "bg-pink-500 scale-125"
                : "bg-gray-300 hover:bg-pink-300"
            }`}
          />
        ))}
      </div>

    </div>
  )
}
