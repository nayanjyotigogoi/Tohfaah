"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Share2,
  Heart,
  Sparkles,
  PartyPopper,
  Copy,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const [stage, setStage] = useState<Stage>("create");
  const [recipientName, setRecipientName] = useState("");
  const [senderName, setSenderName] = useState("");
  const [messages, setMessages] = useState<string[]>(Array(6).fill(""));
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [activeMessage, setActiveMessage] = useState<string | null>(null);
  const [shareToken, setShareToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = shareToken
    ? `${process.env.NEXT_PUBLIC_APP_URL}/free-gifts/balloons/${shareToken}`
    : "";

  /* ================= RESET ================= */
  const resetAll = () => {
    setStage("create");
    setRecipientName("");
    setSenderName("");
    setMessages(Array(6).fill(""));
    setBalloons([]);
    setActiveMessage(null);
    setShareToken(null);
    setCopied(false);
  };

  /* ================= CREATE ================= */
  const startExperience = async () => {
    if (!recipientName || !senderName) return;
    setLoading(true);

    try {
      const authToken =
        typeof window !== "undefined"
          ? localStorage.getItem("auth_token")
          : null;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/free-gifts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(authToken
              ? { Authorization: `Bearer ${authToken}` }
              : {}),
          },
          body: JSON.stringify({
            gift_type: "balloons",
            recipient_name: recipientName,
            sender_name: senderName,
            gift_data: { messages: messages.filter(Boolean) },
          }),
        }
      );

      if (!res.ok) throw new Error();

      const data = await res.json();
      setShareToken(data.token);

      const generated = messages
        .filter(Boolean)
        .map((msg, i) => ({
          id: i,
          message: msg,
          popped: false,
          delay: i * 0.15,
          x: 10 + Math.random() * 80,
          y: 15 + Math.random() * 70,
          color: balloonColors[i % balloonColors.length],
        }));

      setBalloons(generated);
      setStage("experience");
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

  /* ================= COPY ================= */
  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

  /* ================= EXPERIENCE + SHARE ================= */
  return (
    <main className="relative min-h-screen bg-gradient-to-b from-sky-400 via-sky-300 to-pink-200 overflow-hidden">
      <Navigation />

      <div className="pt-28 text-center relative z-10">
        <p className="text-sky-900 text-lg">For {recipientName}</p>
        <h2 className="text-3xl font-light">
          Pop the <span className="italic text-rose-600">balloons</span>
        </h2>
      </div>

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
                <div
                  className={`w-20 h-24 rounded-full bg-gradient-to-b ${balloon.color.bg} ${balloon.color.shadow}`}
                  style={{
                    borderRadius: "50% 50% 50% 50% / 40% 40% 60% 60%",
                  }}
                />
              </motion.button>
            )
        )}
      </div>

      <AnimatePresence>
        {activeMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white px-6 py-3 rounded-full shadow-xl z-50"
          >
            {activeMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {balloons.every((b) => b.popped) && stage === "experience" && (
        <div className="fixed bottom-6 w-full px-4 z-20">
          <div className="max-w-md mx-auto space-y-3">
            <p className="italic text-lg text-center">
              With love, {senderName} 💖
            </p>

            <div className="flex gap-3">
              <Button variant="outline" onClick={resetAll} className="flex-1">
                Start Over
              </Button>

              <Button onClick={() => setStage("share")} className="flex-1">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      )}

      {stage === "share" && (
        <div className="fixed bottom-6 w-full px-4 z-30">
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-6 space-y-5 text-center">
            <Heart className="w-10 h-10 mx-auto text-primary fill-primary" />

            <div className="flex items-center gap-3">
              <div className="flex-1 p-4 bg-secondary rounded-xl font-mono text-sm break-all">
                {shareUrl}
              </div>

              <button
                onClick={handleCopy}
                className="p-3 rounded-full border border-border hover:bg-muted transition"
                aria-label="Copy link"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>

            {copied && (
              <p className="text-xs text-muted-foreground">
                Link copied — paste it anywhere 🎈
              </p>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
