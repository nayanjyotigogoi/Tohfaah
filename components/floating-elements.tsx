"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface FloatingElement {
  id: number;
  type: "heart" | "balloon" | "petal" | "ribbon" | "envelope";
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

const Heart = ({ size, color }: { size: number; color: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    className="opacity-60"
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const Balloon = ({ size, color }: { size: number; color: string }) => (
  <svg
    width={size}
    height={size * 1.4}
    viewBox="0 0 24 34"
    className="opacity-50"
  >
    <ellipse cx="12" cy="10" rx="10" ry="12" fill={color} />
    <path
      d="M12 22 L12 32"
      stroke={color}
      strokeWidth="1"
      fill="none"
      strokeDasharray="2,2"
    />
    <path d="M10 22 Q12 24 14 22" fill={color} />
  </svg>
);

const Petal = ({ size, color }: { size: number; color: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    className="opacity-40"
  >
    <path d="M12 2C8 6 6 12 12 22C18 12 16 6 12 2Z" />
  </svg>
);

const Ribbon = ({ size, color }: { size: number; color: string }) => (
  <svg
    width={size * 1.5}
    height={size}
    viewBox="0 0 36 24"
    fill="none"
    className="opacity-50"
  >
    <path
      d="M2 12 Q10 4 18 12 Q26 20 34 12"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

const Envelope = ({ size, color }: { size: number; color: string }) => (
  <svg
    width={size}
    height={size * 0.7}
    viewBox="0 0 24 17"
    fill={color}
    className="opacity-40"
  >
    <rect x="1" y="1" width="22" height="15" rx="2" fill={color} />
    <path d="M1 1 L12 9 L23 1" stroke="white" strokeWidth="1.5" fill="none" />
  </svg>
);

const colors = {
  heart: ["#e11d48", "#f43f5e", "#fb7185", "#fda4af"],
  balloon: ["#e11d48", "#f472b6", "#fda4af", "#fecdd3"],
  petal: ["#fda4af", "#fecdd3", "#fff1f2", "#fb7185"],
  ribbon: ["#e11d48", "#f43f5e", "#fda4af", "#f472b6"],
  envelope: ["#fecdd3", "#fff1f2", "#fda4af", "#fce7f3"],
};

export function FloatingElements({
  density = "medium",
}: {
  density?: "low" | "medium" | "high";
}) {
  const [elements, setElements] = useState<FloatingElement[]>([]);
  const [mounted, setMounted] = useState(false);

  const counts = {
    low: 8,
    medium: 15,
    high: 25,
  };

  useEffect(() => {
    setMounted(true);
    const types: FloatingElement["type"][] = [
      "heart",
      "balloon",
      "petal",
      "ribbon",
      "envelope",
    ];
    const newElements: FloatingElement[] = [];

    for (let i = 0; i < counts[density]; i++) {
      newElements.push({
        id: i,
        type: types[Math.floor(Math.random() * types.length)],
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 16 + Math.random() * 24,
        delay: Math.random() * 5,
        duration: 15 + Math.random() * 20,
      });
    }
    setElements(newElements);
  }, [density]);

  if (!mounted) return null;

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {elements.map((el) => {
        const colorSet = colors[el.type];
        const color = colorSet[Math.floor(Math.random() * colorSet.length)];

        return (
          <motion.div
            key={el.id}
            className="absolute"
            initial={{
              x: `${el.x}vw`,
              y: `${el.y}vh`,
              rotate: 0,
              scale: 0.8,
            }}
            animate={{
              x: [`${el.x}vw`, `${el.x + (Math.random() - 0.5) * 20}vw`],
              y: [`${el.y}vh`, `${(el.y + 30) % 100}vh`],
              rotate: [0, 360],
              scale: [0.8, 1, 0.8],
            }}
            transition={{
              duration: el.duration,
              delay: el.delay,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          >
            {el.type === "heart" && <Heart size={el.size} color={color} />}
            {el.type === "balloon" && <Balloon size={el.size} color={color} />}
            {el.type === "petal" && <Petal size={el.size} color={color} />}
            {el.type === "ribbon" && <Ribbon size={el.size} color={color} />}
            {el.type === "envelope" && <Envelope size={el.size} color={color} />}
          </motion.div>
        );
      })}
    </div>
  );
}
