"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface HeartsBedRevealProps {
  onComplete: () => void;
}

// Large, soft, organic heart shape
function OrganicHeart({
  index,
  totalHearts,
  phase,
}: {
  index: number;
  totalHearts: number;
  phase: "waiting" | "falling" | "settling" | "breathing" | "ready";
}) {
  // Each heart has unique properties
  const heartProps = useMemo(() => {
    const baseSize = 80 + Math.random() * 120; // Large hearts: 80-200px
    const hue = 350 + Math.random() * 20; // Red to rose hues
    const saturation = 70 + Math.random() * 20;
    const lightness = 45 + Math.random() * 15;

    // Calculate grid-like but organic positioning
    const cols = 5;
    const rows = Math.ceil(totalHearts / cols);
    const col = index % cols;
    const row = Math.floor(index / cols);

    // Add organic offset to grid position
    const baseX = (col / (cols - 1)) * 80 + 10; // 10-90% range
    const baseY = (row / (rows - 1)) * 60 + 30; // 30-90% range

    const offsetX = (Math.random() - 0.5) * 15;
    const offsetY = (Math.random() - 0.5) * 10;

    return {
      size: baseSize,
      color: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
      shadowColor: `hsl(${hue}, ${saturation}%, ${lightness - 15}%)`,
      x: baseX + offsetX,
      y: baseY + offsetY,
      rotation: (Math.random() - 0.5) * 30,
      delay: index * 0.15 + Math.random() * 0.1,
      fallDuration: 2.5 + Math.random() * 1.5,
      bounceHeight: 5 + Math.random() * 10,
      breathDelay: Math.random() * 2,
    };
  }, [index, totalHearts]);

  // Determine animation state based on phase
  const getAnimationState = () => {
    switch (phase) {
      case "waiting":
        return {
          y: "-120vh",
          x: `${heartProps.x}vw`,
          opacity: 0,
          scale: 0.8,
          rotate: heartProps.rotation - 20,
        };
      case "falling":
        return {
          y: `${heartProps.y}vh`,
          x: `${heartProps.x}vw`,
          opacity: 1,
          scale: 1,
          rotate: heartProps.rotation,
        };
      case "settling":
      case "breathing":
      case "ready":
        return {
          y: `${heartProps.y}vh`,
          x: `${heartProps.x}vw`,
          opacity: 1,
          scale: 1,
          rotate: heartProps.rotation,
        };
      default:
        return {};
    }
  };

  return (
    <motion.div
      className="absolute"
      style={{
        width: heartProps.size,
        height: heartProps.size,
        zIndex: Math.floor(heartProps.y), // Depth layering
        filter: `drop-shadow(0 ${heartProps.size * 0.1}px ${heartProps.size * 0.2}px ${heartProps.shadowColor}40)`,
      }}
      initial={getAnimationState()}
      animate={getAnimationState()}
      transition={{
        duration: heartProps.fallDuration,
        delay: phase === "falling" ? heartProps.delay : 0,
        ease:
          phase === "falling"
            ? [0.25, 0.1, 0.25, 1.0] // Organic fall with slight bounce
            : "easeOut",
      }}
    >
      {/* Breathing animation when settled */}
      <motion.div
        animate={
          phase === "breathing" || phase === "ready"
            ? {
                scale: [1, 1.03, 1],
                y: [0, -heartProps.bounceHeight * 0.3, 0],
              }
            : {}
        }
        transition={{
          duration: 4,
          delay: heartProps.breathDelay,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          style={{ overflow: "visible" }}
        >
          {/* Soft glow layer */}
          <defs>
            <filter id={`glow-${index}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient
              id={`heartGradient-${index}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor={heartProps.color} stopOpacity="1" />
              <stop
                offset="50%"
                stopColor={heartProps.shadowColor}
                stopOpacity="1"
              />
              <stop offset="100%" stopColor={heartProps.color} stopOpacity="0.9" />
            </linearGradient>
            <radialGradient
              id={`heartHighlight-${index}`}
              cx="30%"
              cy="30%"
              r="50%"
            >
              <stop offset="0%" stopColor="white" stopOpacity="0.3" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Main heart shape - organic, soft curves */}
          <path
            d="M50 88 
               C20 65, 5 45, 5 30 
               C5 15, 15 5, 30 5 
               C40 5, 48 12, 50 20 
               C52 12, 60 5, 70 5 
               C85 5, 95 15, 95 30 
               C95 45, 80 65, 50 88Z"
            fill={`url(#heartGradient-${index})`}
            filter={`url(#glow-${index})`}
          />

          {/* Inner highlight for depth */}
          <path
            d="M50 88 
               C20 65, 5 45, 5 30 
               C5 15, 15 5, 30 5 
               C40 5, 48 12, 50 20 
               C52 12, 60 5, 70 5 
               C85 5, 95 15, 95 30 
               C95 45, 80 65, 50 88Z"
            fill={`url(#heartHighlight-${index})`}
          />
        </svg>
      </motion.div>
    </motion.div>
  );
}

// Ambient particles that float up from the hearts
function AmbientParticles({ active }: { active: boolean }) {
  if (!active) return null;

  return (
    <>
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            background: `radial-gradient(circle, rgba(251,113,133,0.8) 0%, transparent 70%)`,
            left: `${10 + Math.random() * 80}%`,
            bottom: "20%",
          }}
          animate={{
            y: [0, -200 - Math.random() * 200],
            x: [(Math.random() - 0.5) * 50, (Math.random() - 0.5) * 100],
            opacity: [0, 0.8, 0],
            scale: [0, 1, 0.5],
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            delay: i * 0.3,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
    </>
  );
}

// Emotional text that appears in the heart bed
function EmotionalText({ phase }: { phase: string }) {
  return (
    <AnimatePresence>
      {(phase === "breathing" || phase === "ready") && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <motion.p
            className="text-3xl md:text-5xl font-light text-white text-center drop-shadow-2xl"
            style={{ textShadow: "0 4px 30px rgba(0,0,0,0.5)" }}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.5, delay: 1 }}
          >
            With all my heart...
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function HeartsBedReveal({ onComplete }: HeartsBedRevealProps) {
  const [phase, setPhase] = useState<
    "intro" | "waiting" | "falling" | "settling" | "breathing" | "ready"
  >("intro");
  const [showButton, setShowButton] = useState(false);

  // Number of hearts - enough to fill but not overwhelm
  const heartCount = 18;

  // Phase progression - emotional timing
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    // Intro pause
    timers.push(setTimeout(() => setPhase("waiting"), 1500));
    // Begin the fall
    timers.push(setTimeout(() => setPhase("falling"), 2000));
    // Hearts settle
    timers.push(setTimeout(() => setPhase("settling"), 6000));
    // Begin breathing
    timers.push(setTimeout(() => setPhase("breathing"), 7000));
    // Ready for interaction
    timers.push(setTimeout(() => setPhase("ready"), 8500));
    // Show button
    timers.push(setTimeout(() => setShowButton(true), 10000));

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <motion.div
      key="hearts"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
    >
      {/* Deep background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-rose-950/50 via-transparent to-rose-950/30" />

      {/* Intro text */}
      <AnimatePresence>
        {phase === "intro" && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1.5 } }}
          >
            <motion.p
              className="text-2xl md:text-3xl text-rose-200/90 font-light text-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              Feel this...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vignette overlay for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(0,0,0,0.4)_100%)] pointer-events-none z-30" />

      {/* The bed of hearts */}
      {phase !== "intro" &&
        [...Array(heartCount)].map((_, i) => (
          <OrganicHeart
            key={i}
            index={i}
            totalHearts={heartCount}
            phase={phase as "waiting" | "falling" | "settling" | "breathing" | "ready"}
          />
        ))}

      {/* Ambient floating particles */}
      <AmbientParticles active={phase === "breathing" || phase === "ready"} />

      {/* Emotional text */}
      <EmotionalText phase={phase} />

      {/* Continue button */}
      <AnimatePresence>
        {showButton && (
          <motion.div
            className="absolute bottom-16 left-1/2 -translate-x-1/2 z-50"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Button
              onClick={onComplete}
              className="px-10 py-7 text-lg bg-white/95 hover:bg-white text-rose-950 shadow-2xl backdrop-blur-sm"
            >
              See Your Message
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
