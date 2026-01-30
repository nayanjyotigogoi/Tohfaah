"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Share2, Heart, Sparkles, PartyPopper } from "lucide-react";
import Link from "next/link";

type Stage = "create" | "experience" | "share";

interface Balloon {
  id: number;
  x: number;
  y: number;
  color: typeof balloonColors[0];
  message: string;
  popped: boolean;
  delay: number;
}

const balloonColors = [
  { bg: "from-rose-400 to-rose-500", shadow: "shadow-rose-500/50" },
  { bg: "from-pink-400 to-pink-500", shadow: "shadow-pink-500/50" },
  { bg: "from-red-400 to-red-500", shadow: "shadow-red-500/50" },
  { bg: "from-fuchsia-400 to-fuchsia-500", shadow: "shadow-fuchsia-500/50" },
  { bg: "from-purple-400 to-purple-500", shadow: "shadow-purple-500/50" },
  { bg: "from-amber-400 to-amber-500", shadow: "shadow-amber-500/50" },
];

export default function BalloonsPage() {
  const [stage, setStage] = useState<Stage>("create");

  const [recipientName, setRecipientName] = useState("");
  const [senderName, setSenderName] = useState("");
  const [messages, setMessages] = useState<string[]>(
    Array(6).fill("")
  );

  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [activeMessage, setActiveMessage] = useState<string | null>(null);
  const [shareToken, setShareToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /* ================= CREATE ================= */
  const startExperience = async () => {
    if (!recipientName || !senderName) return;

    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/free-gifts`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            gift_type: "balloons",
            recipient_name: recipientName,
            sender_name: senderName,
            gift_data: {
              messages: messages.filter(Boolean),
            },
          }),
        }
      );

      if (!res.ok) throw new Error();

      const data = await res.json();
      setShareToken(data.token);

      const generated: Balloon[] = messages
        .filter(Boolean)
        .map((msg, i) => ({
          id: i,
          message: msg,
          popped: false,
          delay: i * 0.15,
          x: 10 + Math.random() * 80,
          y: 15 + Math.random() * 70, // ✅ FULL SCREEN RANGE
          color: balloonColors[i % balloonColors.length],
        }));

      setBalloons(generated);
      setStage("experience");
    } catch {
      alert("Failed to create balloons");
    } finally {
      setLoading(false);
    }
  };

  /* ================= POP ================= */
  const popBalloon = (id: number) => {
    setBalloons((prev) =>
      prev.map((b) => (b.id === id ? { ...b, popped: true } : b))
    );

    const balloon = balloons.find((b) => b.id === id);
    if (balloon) {
      setActiveMessage(balloon.message);
      setTimeout(() => setActiveMessage(null), 2200);
    }
  };

  /* ================= CREATE UI ================= */
  if (stage === "create") {
    return (
      <main className="relative min-h-screen bg-gradient-to-br from-sky-50 via-pink-50 to-purple-50">
        <Navigation />
        <div className="pt-28 pb-20 px-4 max-w-xl mx-auto space-y-6">
          <Link href="/free-gifts" className="text-muted-foreground text-sm">
            <ArrowLeft className="inline w-4 h-4 mr-1" /> Back
          </Link>

          <div className="text-center">
            <PartyPopper className="w-14 h-14 mx-auto text-primary mb-3" />
            <h1 className="text-3xl font-light">
              Balloon <span className="italic text-primary">Pop</span>
            </h1>
          </div>

          <Input
            placeholder="Receiver name"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
          />
          <Input
            placeholder="Your name"
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-2">
            {messages.map((msg, i) => (
              <Input
                key={i}
                placeholder={`Message ${i + 1}`}
                value={msg}
                onChange={(e) => {
                  const copy = [...messages];
                  copy[i] = e.target.value;
                  setMessages(copy);
                }}
              />
            ))}
          </div>

          <Button
            onClick={startExperience}
            disabled={!recipientName || !senderName || loading}
            className="w-full py-6"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Release the Balloons
          </Button>
        </div>
      </main>
    );
  }

  /* ================= EXPERIENCE ================= */
  return (
    <main className="relative min-h-screen bg-gradient-to-b from-sky-400 via-sky-300 to-pink-200 overflow-hidden">
      <Navigation />

      {/* Header */}
      <div className="pt-28 text-center relative z-10">
        <p className="text-sky-900 text-lg">For {recipientName}</p>
        <h2 className="text-3xl font-light">
          Pop the <span className="italic text-rose-600">balloons</span>
        </h2>
      </div>

      {/* BALLOONS — FULL SCREEN */}
      <div className="absolute inset-0">
        {balloons.map(
          (balloon) =>
            !balloon.popped && (
              <motion.button
                key={balloon.id}
                className="absolute"
                style={{
                  left: `${balloon.x}%`,
                  top: `${balloon.y}%`,
                }}
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
                {/* ORIGINAL BALLOON — UNCHANGED */}
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

      {/* MESSAGE POP — CLEAR, NON-BLOCKING */}
      <AnimatePresence>
        {activeMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white px-6 py-3 rounded-full shadow-xl z-50"
          >
            <span className="font-medium text-foreground">
              {activeMessage}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FINISH */}
      {balloons.every((b) => b.popped) && (
        <div className="fixed bottom-6 w-full text-center z-20">
          <p className="italic text-lg">With love, {senderName} 💖</p>
          <Button
            className="mt-3"
            onClick={() => setStage("share")}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      )}

      {/* SHARE */}
      {stage === "share" && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl text-center">
            <Heart className="w-10 h-10 mx-auto text-primary mb-2" />
            <p className="font-mono text-sm break-all">
              {`${process.env.NEXT_PUBLIC_APP_URL}/free-gifts/balloons/${shareToken}`}
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
