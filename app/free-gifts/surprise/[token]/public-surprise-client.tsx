"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navigation } from "@/components/navigation";
import { FloatingElements } from "@/components/floating-elements";
import { Share2, Copy, Check, Heart } from "lucide-react";
import { useRouter } from "next/navigation";

type GiftResponse = {
  recipient_name: string;
  sender_name: string;
  gift_data: {
    title: string;
    message: string;
    date: string;
    time?: string | null;
  };
};

export default function PublicSurpriseClient({
  token,
}: {
  token: string;
}) {
  const router = useRouter();

  const [gift, setGift] = useState<GiftResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [now, setNow] = useState(new Date());
  const [copied, setCopied] = useState(false);

  const shareUrl =
    typeof window !== "undefined" ? window.location.href : "";

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchGift = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/free-gifts/${token}`,
          { cache: "no-store" }
        );

        if (!res.ok) throw new Error();

        const data = await res.json();

        if (!data?.gift_data?.title) throw new Error();

        setGift(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchGift();
  }, [token]);

  /* ================= COUNTDOWN ================= */
  const targetDate = useMemo(() => {
    if (!gift) return null;
    if (!gift.gift_data.time) {
      return new Date(`${gift.gift_data.date}T23:59:59`);
    }
    return new Date(
      `${gift.gift_data.date}T${gift.gift_data.time}:00`
    );
  }, [gift]);

  useEffect(() => {
    if (!targetDate) return;
    const i = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(i);
  }, [targetDate]);

  const diff = targetDate
    ? Math.max(targetDate.getTime() - now.getTime(), 0)
    : 0;

  const time = {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };

  /* ================= SHARE ================= */
  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "A surprise for you 💖",
        text: "Someone created a special moment for you.",
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

  /* ================= STATES ================= */
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading surprise…</p>
      </main>
    );
  }

  if (error || !gift) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">
          This surprise doesn’t exist 💔
        </p>
      </main>
    );
  }

  /* ================= PAGE ================= */
  return (
    <main className="relative min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-background">
      <FloatingElements density="low" />
      <Navigation />

      <div className="pt-28 pb-20 px-4">
        <div className="max-w-2xl mx-auto space-y-10">
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-light mb-2">
              For{" "}
              <span className="italic text-primary">
                {gift.recipient_name}
              </span>
            </h1>
            <p className="text-muted-foreground">
              A moment that’s counting down
            </p>
          </div>

          <div className="bg-white rounded-[32px] p-10 shadow-2xl text-center">
            <div className="grid grid-cols-4 gap-4 mb-8">
              {Object.entries(time).map(([k, v]) => (
                <FlipBlock key={k} value={v} label={k} />
              ))}
            </div>

            <Heart className="w-10 h-10 text-primary fill-primary mx-auto mb-4" />

            <h3 className="text-xl font-light mb-3">
              {gift.gift_data.title}
            </h3>

            <p className="text-muted-foreground mb-6">
              {gift.gift_data.message}
            </p>

            <p className="text-sm text-primary">
              — {gift.sender_name}
            </p>
          </div>

          {/* ================= SHARE ================= */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition"
              >
                <Share2 className="w-4 h-4" />
                Share Surprise
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
                Link copied — share the surprise 💖
              </p>
            )}
          </div>


          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-14 rounded-2xl bg-gradient-to-br from-rose-100 via-pink-100 to-background border p-8 text-center"
          >
            <h3 className="text-xl md:text-2xl font-light">
              Want to create a Surprise?
            </h3>
            <p className="text-muted-foreground">
              Pick a date, write a message, and let the countdown begin ✨
            </p>
            <button
              onClick={() => router.push("/free-gifts/surprise")}
              className="mt-4 px-8 py-4 rounded-full bg-primary text-primary-foreground"
            >
              Create Your Own Surprise
            </button>
          </motion.div>
        </div>
      </div>
    </main>
  );
}

/* ================= FLIP BLOCK ================= */

function FlipBlock({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  const formatted = String(value).padStart(2, "0");

  return (
    <div className="bg-[#faf7f4] rounded-2xl py-5 text-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={formatted}
          initial={{ rotateX: 90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={{ rotateX: -90, opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="text-4xl font-mono"
        >
          {formatted}
        </motion.div>
      </AnimatePresence>
      <div className="text-[10px] tracking-widest mt-3 text-muted-foreground">
        {label.toUpperCase()}
      </div>
    </div>
  );
}
