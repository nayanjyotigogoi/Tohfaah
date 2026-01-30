"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface ButterflyGiftRevealProps {
  onComplete: () => void;
}

// Individual butterfly with realistic wing animation
function CinematicButterfly({
  id,
  delay,
  startPosition,
  color,
  size,
  phase,
}: {
  id: number;
  delay: number;
  startPosition: { x: number; y: number };
  color: string;
  size: number;
  phase: "gathering" | "circling" | "forming" | "settled";
}) {
  // Generate a unique bezier path for this butterfly
  const generateFlightPath = useCallback(() => {
    // Each butterfly takes a unique curved path toward center
    const midX = 50 + (Math.random() - 0.5) * 30;
    const midY = 50 + (Math.random() - 0.5) * 30;
    return { midX, midY };
  }, []);

  const { midX, midY } = generateFlightPath();

  // Wing flutter animation - slow, graceful, not cartoonish
  const wingVariants = {
    flutter: {
      rotateY: [0, 70, 0, -70, 0],
      transition: {
        duration: 0.8 + Math.random() * 0.4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
    rest: {
      rotateY: [0, 15, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  // Calculate final position based on phase
  const getFinalPosition = () => {
    if (phase === "gathering") {
      return { x: midX, y: midY };
    }
    if (phase === "circling" || phase === "forming") {
      // Circle around center
      const angle = (id / 12) * Math.PI * 2 + Date.now() * 0.0001;
      const radius = phase === "forming" ? 8 : 15;
      return {
        x: 50 + Math.cos(angle) * radius,
        y: 50 + Math.sin(angle) * radius,
      };
    }
    // Settled - butterflies rest on edges of the gift
    const angle = (id / 12) * Math.PI * 2;
    const radius = 12;
    return {
      x: 50 + Math.cos(angle) * radius,
      y: 50 + Math.sin(angle) * radius,
    };
  };

  const finalPos = getFinalPosition();

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ perspective: "500px" }}
      initial={{
        left: `${startPosition.x}%`,
        top: `${startPosition.y}%`,
        opacity: 0,
        scale: 0,
      }}
      animate={{
        left: `${finalPos.x}%`,
        top: `${finalPos.y}%`,
        opacity: phase === "settled" ? 0.9 : 1,
        scale: phase === "settled" ? 0.7 : 1,
      }}
      transition={{
        duration: phase === "gathering" ? 4 : 2,
        delay: phase === "gathering" ? delay : 0,
        ease: [0.25, 0.1, 0.25, 1], // Custom cubic bezier for organic feel
      }}
    >
      <motion.div
        variants={wingVariants}
        animate={phase === "settled" ? "rest" : "flutter"}
        style={{ transformStyle: "preserve-3d" }}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 60 60"
          className="drop-shadow-lg"
        >
          {/* Left wing */}
          <motion.path
            d="M30 30 Q10 15 5 30 Q10 50 30 40 Z"
            fill={color}
            opacity="0.9"
            style={{ transformOrigin: "30px 30px" }}
            animate={{
              d: [
                "M30 30 Q10 15 5 30 Q10 50 30 40 Z",
                "M30 30 Q15 20 10 30 Q15 45 30 38 Z",
                "M30 30 Q10 15 5 30 Q10 50 30 40 Z",
              ],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          {/* Right wing */}
          <motion.path
            d="M30 30 Q50 15 55 30 Q50 50 30 40 Z"
            fill={color}
            opacity="0.9"
            style={{ transformOrigin: "30px 30px" }}
            animate={{
              d: [
                "M30 30 Q50 15 55 30 Q50 50 30 40 Z",
                "M30 30 Q45 20 50 30 Q45 45 30 38 Z",
                "M30 30 Q50 15 55 30 Q50 50 30 40 Z",
              ],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.05,
            }}
          />
          {/* Body */}
          <ellipse cx="30" cy="35" rx="3" ry="10" fill="#1a1a2e" opacity="0.8" />
          {/* Antennae */}
          <path
            d="M28 26 Q26 20 24 18 M32 26 Q34 20 36 18"
            stroke="#1a1a2e"
            strokeWidth="1"
            fill="none"
            opacity="0.6"
          />
        </svg>
      </motion.div>
    </motion.div>
  );
}

// Dust particles that trail behind butterflies
function MagicDust({ phase }: { phase: string }) {
  if (phase !== "gathering" && phase !== "circling") return null;

  return (
    <>
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-rose-300/60"
          initial={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: 0,
            scale: 0,
          }}
          animate={{
            left: `${45 + Math.random() * 10}%`,
            top: `${45 + Math.random() * 10}%`,
            opacity: [0, 0.8, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 3,
            delay: i * 0.15,
            ease: "easeOut",
          }}
        />
      ))}
    </>
  );
}

// The gift box that forms from butterfly essence
function FormingGiftBox({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
          initial={{ opacity: 0, scale: 0, rotateY: -180 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{
            duration: 2,
            ease: [0.25, 0.1, 0.25, 1],
          }}
        >
          {/* Soft glow behind the box */}
          <motion.div
            className="absolute inset-0 -m-8 rounded-full bg-rose-400/30 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* The gift box - elegant, not cartoonish */}
          <motion.div
            className="relative w-48 h-48 md:w-56 md:h-56"
            animate={{
              y: [0, -8, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {/* Box shadow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-4 bg-black/20 rounded-full blur-lg" />

            {/* Main box body */}
            <div className="absolute inset-4 bg-gradient-to-br from-rose-400 via-rose-500 to-pink-600 rounded-2xl shadow-2xl overflow-hidden">
              {/* Subtle texture overlay */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,_white_1px,_transparent_1px)] bg-[length:8px_8px]" />

              {/* Inner glow */}
              <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/20" />
            </div>

            {/* Ribbon vertical */}
            <div className="absolute left-1/2 -translate-x-1/2 top-4 bottom-4 w-6 bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500 shadow-lg" />

            {/* Ribbon horizontal */}
            <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 h-6 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 shadow-lg" />

            {/* Ribbon bow */}
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
              animate={{
                rotate: [0, 2, -2, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <svg width="80" height="60" viewBox="0 0 80 60">
                {/* Left loop */}
                <ellipse
                  cx="25"
                  cy="25"
                  rx="20"
                  ry="15"
                  fill="url(#bowGradient)"
                  transform="rotate(-30 25 25)"
                />
                {/* Right loop */}
                <ellipse
                  cx="55"
                  cy="25"
                  rx="20"
                  ry="15"
                  fill="url(#bowGradient)"
                  transform="rotate(30 55 25)"
                />
                {/* Center knot */}
                <circle cx="40" cy="30" r="10" fill="#d97706" />
                {/* Tails */}
                <path
                  d="M35 38 Q30 50 25 55 M45 38 Q50 50 55 55"
                  stroke="#d97706"
                  strokeWidth="6"
                  fill="none"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient
                    id="bowGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#d97706" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>

            {/* Centered heart icon */}
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 mt-8"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <Heart className="w-10 h-10 text-white/80 fill-white/80 drop-shadow-lg" />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function ButterflyGiftReveal({
  onComplete,
}: ButterflyGiftRevealProps) {
  const [phase, setPhase] = useState<
    "intro" | "gathering" | "circling" | "forming" | "settled" | "ready"
  >("intro");
  const [showButton, setShowButton] = useState(false);

  // Butterfly configuration - each with unique properties
  const butterflies = [
    { color: "#f472b6", size: 50 }, // Pink
    { color: "#fb7185", size: 55 }, // Rose
    { color: "#fda4af", size: 45 }, // Light rose
    { color: "#f9a8d4", size: 52 }, // Soft pink
    { color: "#f472b6", size: 48 },
    { color: "#fb7185", size: 53 },
    { color: "#fda4af", size: 47 },
    { color: "#f9a8d4", size: 50 },
    { color: "#f472b6", size: 46 },
    { color: "#fb7185", size: 51 },
    { color: "#fda4af", size: 49 },
    { color: "#f9a8d4", size: 54 },
  ].map((b, i) => ({
    ...b,
    id: i,
    startPosition: {
      x: i < 4 ? -10 : i < 8 ? 110 : i % 2 === 0 ? -10 : 110,
      y: 20 + (i % 4) * 20,
    },
    delay: i * 0.3,
  }));

  // Phase progression - cinematic timing
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    // Start with intro text
    timers.push(
      setTimeout(() => setPhase("gathering"), 2000) // Butterflies begin entering
    );
    timers.push(
      setTimeout(() => setPhase("circling"), 7000) // They circle and dance
    );
    timers.push(
      setTimeout(() => setPhase("forming"), 10000) // They converge
    );
    timers.push(
      setTimeout(() => setPhase("settled"), 12000) // Gift materializes
    );
    timers.push(
      setTimeout(() => setPhase("ready"), 14000) // Gift fully formed
    );
    timers.push(
      setTimeout(() => setShowButton(true), 15500) // Show continue button
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <motion.div
      key="butterflies"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
    >
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(244,114,182,0.15)_0%,_transparent_70%)]" />

      {/* Intro text */}
      <AnimatePresence>
        {phase === "intro" && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1 } }}
          >
            <motion.p
              className="text-2xl md:text-3xl text-rose-200/90 font-light text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Something beautiful is arriving...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Magic dust particles */}
      <MagicDust phase={phase} />

      {/* Butterflies */}
      {phase !== "intro" &&
        butterflies.map((butterfly) => (
          <CinematicButterfly
            key={butterfly.id}
            id={butterfly.id}
            delay={butterfly.delay}
            startPosition={butterfly.startPosition}
            color={butterfly.color}
            size={butterfly.size}
            phase={
              phase as "gathering" | "circling" | "forming" | "settled"
            }
          />
        ))}

      {/* Forming gift box */}
      <FormingGiftBox visible={phase === "settled" || phase === "ready"} />

      {/* Continue button */}
      <AnimatePresence>
        {showButton && (
          <motion.div
            className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <Button
              onClick={onComplete}
              className="px-10 py-7 text-lg bg-white hover:bg-rose-50 text-rose-950 shadow-2xl"
            >
              Open Your Gift
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
