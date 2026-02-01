"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { FloatingElements } from "@/components/floating-elements";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Share2,
  Copy,
  Check,
} from "lucide-react";

/* ================= TYPES ================= */

interface GiftResponse {
  recipient_name: string;
  sender_name: string;
  gift_data: {
    title: string;
    message: string;
    date: string;
    time?: string | null;
  };
}

export default function SurprisePublicPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();

  const [data, setData] = useState<GiftResponse | null>(null);
  const [now, setNow] = useState(new Date());
  const [copied, setCopied] = useState(false);

  const shareUrl =
    typeof window !== "undefined" ? window.location.href : "";

  /* ================= FETCH ================= */

  useEffect(() => {
    if (!token) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/free-gifts/${token}`)
      .then((r) => r.json())
      .then(setData);
  }, [token]);

  /* ================= COUNTDOWN ================= */

  const targetDate = useMemo(() => {
    if (!data) return null;
    if (!data.gift_data.time) {
      return new Date(`${data.gift_data.date}T23:59:59`);
    }
    return new Date(
      `${data.gift_data.date}T${data.gift_data.time}:00`
    );
  }, [data]);

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
        title: "A moment for you 💖",
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

  if (!data) return null;

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-background">
      <FloatingElements density="low" />
      <Navigation />

      <div className="pt-28 pb-20 px-4">
        <div className="max-w-2xl mx-auto space-y-10">

          {/* HEADER */}
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-light mb-2">
              For{" "}
              <span className="italic text-primary">
                {data.recipient_name}
              </span>
            </h2>
            <p className="text-muted-foreground">
              A moment that’s counting down
            </p>
          </div>

          {/* CARD */}
          <div className="relative bg-white rounded-[32px] p-10 shadow-2xl text-center overflow-hidden">

            {/* COUNTDOWN */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              {Object.entries(time).map(([k, v]) => (
                <FlipBlock key={k} value={v} label={k} />
              ))}
            </div>

            <Heart className="w-10 h-10 text-primary fill-primary mx-auto mb-4" />

            <h3 className="text-xl font-light mb-3">
              {data.gift_data.title}
            </h3>

            <p className="text-muted-foreground mb-6">
              {data.gift_data.message}
            </p>

            <p className="text-sm text-primary">
              — {data.sender_name}
            </p>

            {/* ✨ MICRO PREMIUM DIAGONAL WATERMARK */}
            {/* <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div
                className="absolute top-6 right-[3%] w-[181.5%]"
                style={{ transform: "rotate(-28deg)" }}
              >
                <div
                  className="mx-auto max-w-xl px-6 py-[6px]"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(255,255,255,0.05), rgba(255,255,255,0.015), rgba(255,255,255,0.05))",
                    backdropFilter: "blur(1px)",
                  }}
                >
                  <span
                    className="block text-center text-black/90 font-light tracking-[0.1em] text-[10px] md:text-xs select-none"
                    style={{
                      textShadow: "0 1px 2px rgba(0,0,0,0.2)",
                    }}
                  >
                    via tohfaah
                  </span>
                </div>
              </div>
            </div> */}
          </div>

          {/* SHARE + COPY */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition"
              >
                <Share2 className="w-4 h-4" />
                Share this Reminder
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
                Link copied — share it anywhere 💖
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
              Want to create a Reminder like this?
            </h3>
            <p className="text-muted-foreground">
              Pick a date, write a message, and let the countdown begin ✨
            </p>
            <button
              onClick={() => router.push("/free-gifts/surprise")}
              className="px-8 py-4 rounded-full bg-primary text-primary-foreground text-lg shadow-md"
            >
              Create Your Own Reminder
            </button>
            <p className="text-xs text-muted-foreground">
              No signup required 💗
            </p>
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
    <div className="bg-[#faf7f4] rounded-2xl py-5 text-center overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={formatted}
          initial={{ rotateX: 90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={{ rotateX: -90, opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="text-4xl font-light font-mono tabular-nums leading-none"
          style={{ transformOrigin: "center" }}
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
