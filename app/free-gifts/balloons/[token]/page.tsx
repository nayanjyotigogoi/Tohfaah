"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Heart, Share2, PartyPopper } from "lucide-react";

interface Balloon {
  id: number;
  x: number;
  y: number;
  message: string;
  popped: boolean;
  delay: number;
  color: {
    bg: string;
    shadow: string;
  };
}

const balloonColors = [
  { bg: "from-rose-400 to-rose-500", shadow: "shadow-rose-500/50" },
  { bg: "from-pink-400 to-pink-500", shadow: "shadow-pink-500/50" },
  { bg: "from-red-400 to-red-500", shadow: "shadow-red-500/50" },
  { bg: "from-fuchsia-400 to-fuchsia-500", shadow: "shadow-fuchsia-500/50" },
  { bg: "from-purple-400 to-purple-500", shadow: "shadow-purple-500/50" },
  { bg: "from-amber-400 to-amber-500", shadow: "shadow-amber-500/50" },
];

export default function PublicBalloonsPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [recipient, setRecipient] = useState("");
  const [sender, setSender] = useState("");
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [activeMessage, setActiveMessage] = useState<string | null>(null);

  /* 🔊 POP SOUND */
  const popSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    popSound.current = new Audio("/sounds/balloon-pop.mp3");
    popSound.current.volume = 0.6;
  }, []);

  /* ================= FETCH ================= */
  useEffect(() => {
    if (!token) return;

    const fetchGift = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/free-gifts/${token}`,
          { cache: "no-store" }
        );

        if (!res.ok) throw new Error();

        const data = await res.json();

        if (data.gift_type !== "balloons") throw new Error();

        setRecipient(data.recipient_name);
        setSender(data.sender_name);

        const generated: Balloon[] = data.gift_data.messages.map(
          (msg: string, i: number) => ({
            id: i,
            message: msg,
            popped: false,
            delay: i * 0.15,
            x: 10 + Math.random() * 80,
            y: 15 + Math.random() * 70,
            color: balloonColors[i % balloonColors.length],
          })
        );

        setBalloons(generated);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchGift();
  }, [token]);

  /* ================= POP ================= */
  const popBalloon = (id: number) => {
    setBalloons((prev) =>
      prev.map((b) => (b.id === id ? { ...b, popped: true } : b))
    );

    const balloon = balloons.find((b) => b.id === id);
    if (balloon) {
      popSound.current?.play().catch(() => {});
      setActiveMessage(balloon.message);
      setTimeout(() => setActiveMessage(null), 2200);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading balloons…</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">
          This balloon gift does not exist 🎈
        </p>
      </main>
    );
  }

  const allPopped = balloons.every((b) => b.popped);

  /* ================= UI ================= */
  return (
    <main className="relative min-h-screen bg-gradient-to-b from-sky-400 via-sky-300 to-pink-200 overflow-hidden">
      <Navigation />

      {/* HEADER */}
      <div className="pt-28 text-center relative z-10">
        <p className="text-sky-900 text-lg">For {recipient}</p>
        <h1 className="text-3xl md:text-4xl font-light">
          Pop the <span className="italic text-rose-600">balloons</span>
        </h1>
      </div>

      {/* BALLOONS */}
      <div className="absolute inset-0">
        {balloons.map(
          (balloon) =>
            !balloon.popped && (
              <motion.button
                key={balloon.id}
                className="absolute"
                style={{ left: `${balloon.x}%`, top: `${balloon.y}%` }}
                initial={{ scale: 0, y: 120 }}
                animate={{
                  scale: 1,
                  y: [0, -18, 0],
                  x: [0, 6, -6, 0],
                }}
                transition={{
                  scale: { delay: balloon.delay },
                  y: { duration: 3.5, repeat: Infinity },
                  x: { duration: 4, repeat: Infinity },
                }}
                onClick={() => popBalloon(balloon.id)}
              >
                {/* 🎈 ORIGINAL BALLOON (UNCHANGED) */}
                <div className="relative">
                  <div
                    className={`w-20 h-24 rounded-full bg-gradient-to-b ${balloon.color.bg} ${balloon.color.shadow}`}
                    style={{
                      borderRadius: "50% 50% 50% 50% / 40% 40% 60% 60%",
                    }}
                  >
                    <div className="absolute top-4 left-4 w-4 h-6 bg-white/40 rounded-full rotate-[-30deg]" />
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[10px] border-transparent border-t-current text-rose-600" />
                  </div>
                  <svg
                    className="absolute -bottom-16 left-1/2 -translate-x-1/2"
                    width="20"
                    height="60"
                  >
                    <path
                      d="M10 0 Q5 20 10 30 Q15 40 10 60"
                      stroke="#888"
                      strokeWidth="1.5"
                      fill="none"
                    />
                  </svg>
                </div>
              </motion.button>
            )
        )}
      </div>

      {/* MESSAGE POP */}
      <AnimatePresence>
        {activeMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white px-6 py-3 rounded-full shadow-xl z-50"
          >
            <span className="font-medium">{activeMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FINAL */}
      {allPopped && (
        <div className="fixed bottom-6 w-full text-center z-20 space-y-3">
          <p className="italic text-lg">With love, {sender} 💖</p>

          <Button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: "Balloon Surprise",
                  text: "Someone sent you balloons 🎈",
                  url: window.location.href,
                });
              }
            }}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>

          <Button
            variant="outline"
            onClick={() => router.push("/free-gifts")}
          >
            Create Your Own
          </Button>
        </div>
      )}
    </main>
  );
}
