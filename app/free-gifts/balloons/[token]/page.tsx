"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Heart, Share2, Copy, Check } from "lucide-react";

function firePartyPopper(x: number, y: number) {
  const origin = { x: x / 100, y: y / 100 };
  const colors = ["#ec4899", "#f43f5e", "#a855f7", "#f59e0b", "#22d3ee"];
  confetti({
    particleCount: 80,
    spread: 90,
    origin,
    colors,
  });
  setTimeout(() => {
    confetti({
      particleCount: 40,
      angle: 90,
      spread: 360,
      origin,
      colors,
      scalar: 1.2,
    });
  }, 80);
}

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
  const [activeMessage, setActiveMessage] = useState<{
    message: string;
    x: number;
    y: number;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const shareUrl =
    typeof window !== "undefined" ? window.location.href : "";

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
    const balloon = balloons.find((b) => b.id === id);
    if (balloon) {
      popSound.current?.play().catch(() => {});
      firePartyPopper(balloon.x, balloon.y);
      setActiveMessage({
        message: balloon.message,
        x: balloon.x,
        y: balloon.y,
      });
      setTimeout(() => setActiveMessage(null), 2600);
    }
    setBalloons((prev) =>
      prev.map((b) => (b.id === id ? { ...b, popped: true } : b))
    );
  };

  /* ================= SHARE ================= */
  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "Balloon surprise 🎈",
        text: "Someone sent you a balloon pop surprise!",
        url: shareUrl,
      });
    } else {
      await handleCopy();
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
        {balloons.map((balloon) => (
          <AnimatePresence key={balloon.id}>
            {!balloon.popped && (
              <motion.button
                className="absolute"
                style={{ left: `${balloon.x}%`, top: `${balloon.y}%` }}
                initial={{ scale: 0, y: 120 }}
                animate={{
                  scale: 1,
                  y: [0, -18, 0],
                  x: [0, 6, -6, 0],
                }}
                exit={{
                  scale: [1, 1.6, 2.2],
                  opacity: [1, 0.6, 0],
                  filter: ["blur(0px)", "blur(2px)", "blur(6px)"],
                  transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
                }}
                transition={{
                  scale: { delay: balloon.delay },
                  y: { duration: 3.5, repeat: Infinity },
                  x: { duration: 4, repeat: Infinity },
                }}
                onClick={() => popBalloon(balloon.id)}
              >
                <div
                  className={`w-20 h-24 rounded-full bg-gradient-to-b shadow-lg ${balloon.color.bg} ${balloon.color.shadow}`}
                  style={{
                    borderRadius: "50% 50% 50% 50% / 40% 40% 60% 60%",
                  }}
                />
              </motion.button>
            )}
          </AnimatePresence>
        ))}
      </div>

      {/* MESSAGE POP - at balloon position */}
      <AnimatePresence>
        {activeMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.3, y: 20 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              transition: {
                type: "spring",
                stiffness: 400,
                damping: 25,
              },
            }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            className="absolute z-50 -translate-x-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-sm px-5 py-3 rounded-2xl shadow-xl border border-white/50 min-w-[120px] max-w-[90vw] text-center"
            style={{
              left: `${activeMessage.x}%`,
              top: `${activeMessage.y}%`,
            }}
          >
            <span className="text-sm font-medium block">{activeMessage.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= AFTER EXPERIENCE (MATCHES REMINDER) ================= */}
      {allPopped && (
        <div className="relative z-20 pt-24 pb-20 px-4">
          <div className="max-w-2xl mx-auto space-y-10">

            {/* SIGN OFF */}
            <p className="text-center italic text-lg">
              With love, {sender} 💖
            </p>

            {/* SHARE + COPY */}
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition"
                >
                  <Share2 className="w-4 h-4" />
                  Share this Balloon
                </button>

                <button
                  onClick={handleCopy}
                  className="p-3 rounded-full border border-border hover:bg-muted transition"
                  aria-label="Copy link"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              {copied && (
                <p className="text-xs text-muted-foreground">
                  Link copied — share it anywhere 🎈
                </p>
              )}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mt-14 rounded-2xl bg-gradient-to-br from-rose-100 via-pink-100 to-background border p-8 text-center space-y-4"
            >
              <h3 className="text-xl md:text-2xl font-light">
                Want to create balloons like this?
              </h3>
              <p className="text-muted-foreground">
                Add messages, pop balloons, and spread joy 🎈
              </p>
              <button
                onClick={() => router.push("/free-gifts/balloons")}
                className="px-8 py-4 rounded-full bg-primary text-primary-foreground text-lg shadow-md"
              >
                Create Your Own Balloons
              </button>
              <p className="text-xs text-muted-foreground">
                No signup required 💗
              </p>
            </motion.div>

          </div>
        </div>
      )}
    </main>
  );
}
