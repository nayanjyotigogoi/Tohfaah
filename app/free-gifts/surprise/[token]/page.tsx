"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { FloatingElements } from "@/components/floating-elements";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Share2,
  Copy,
  Check,
} from "lucide-react";

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
  const [data, setData] = useState<GiftResponse | null>(null);
  const [now, setNow] = useState(new Date());
  const [copied, setCopied] = useState(false);

  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/free-gifts/surprise/${token}`;

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
    return new Date(`${data.gift_data.date}T${data.gift_data.time}:00`);
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

  const copyLink = async () => {
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
        <div className="max-w-2xl mx-auto space-y-8">

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
          <div className="bg-white rounded-[32px] p-10 shadow-2xl text-center">
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
          </div>

          {/* SHARE BAR */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <ShareButton
              href={`https://wa.me/?text=${encodeURIComponent(shareUrl)}`}
              label="WhatsApp"
            />
            <ShareButton
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                shareUrl
              )}`}
              label="X"
            />
            <ShareButton
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                shareUrl
              )}`}
              label="Facebook"
            />

            <Button variant="outline" onClick={copyLink}>
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Button
              asChild
              className="px-10 py-6 text-lg bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <a href="/free-gifts/surprise">
                Create Your Own Moment
              </a>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}

/* ================= FLIP DIGIT ================= */

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

/* ================= SHARE BUTTON ================= */

function ShareButton({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="px-4 py-2 text-sm rounded-full border bg-white hover:bg-secondary transition"
    >
      {label}
    </a>
  );
}
