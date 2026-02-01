"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { FloatingElements } from "@/components/floating-elements";
import { Heart, Share2, Copy } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

type GiftData = {
  gift_type: "hug";
  recipient_name: string;
  sender_name?: string;
  gift_data: {
    hug_style: number;
  };
};

export default function HugClient() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();

  const [gift, setGift] = useState<GiftData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl =
    typeof window !== "undefined" ? window.location.href : "";

  /* =======================
     FETCH HUG
  ======================= */
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
        setGift(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchGift();
  }, [token]);

  /* =======================
     SHARE + COPY
  ======================= */
  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "Virtual Hug 🤍",
        text: "I sent you a virtual hug 🤍",
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

  /* =======================
     STATES
  ======================= */
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading hug…</p>
      </main>
    );
  }

  if (
    error ||
    !gift ||
    gift.gift_type !== "hug" ||
    typeof gift.gift_data?.hug_style !== "number"
  ) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">
          This hug does not exist 💔
        </p>
      </main>
    );
  }

  const hugStyle = gift.gift_data.hug_style;

  /* =======================
     PAGE
  ======================= */
  return (
    <main className="relative min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-background">
      <FloatingElements density="low" />
      <Navigation />

      <div className="pt-28 pb-20 px-4">
        <div className="max-w-xl mx-auto space-y-10 text-center">
          {/* HEADER */}
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-light text-foreground">
              A hug for{" "}
              <span className="italic text-primary">
                {gift.recipient_name}
              </span>
            </h1>

            <p className="text-muted-foreground">
              From {gift.sender_name}, with love
            </p>
          </div>

          {/* HUG VISUAL */}
          <div className="flex justify-center">
            <div className="relative w-64 h-64 rounded-full bg-gradient-to-br from-rose-200 to-pink-200 border-4 border-white shadow-xl overflow-hidden">
              <Image
                src={`/hug-${hugStyle}.gif`}
                alt="Virtual Hug"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* AFFIRMATION */}
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Heart className="w-4 h-4 text-primary fill-primary" />
            <span>You are loved</span>
          </div>

          {/* SHARE + COPY */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition"
              >
                <Share2 className="w-4 h-4" />
                Share this hug
              </button>

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
                Link copied — paste it anywhere 🤍
              </p>
            )}
          </div>

          {/* CTA — CREATE YOUR OWN */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-10 rounded-2xl bg-gradient-to-br from-rose-100 via-pink-100 to-background border border-border p-8 space-y-4"
          >
            <h3 className="text-xl md:text-2xl font-light text-foreground">
              Want to send a hug to someone you care about?
            </h3>

            <p className="text-muted-foreground max-w-md mx-auto">
              Pick a hug style and send warmth instantly 🤍
            </p>

            <motion.button
              onClick={() => router.push("/free-gifts/hug")}
              whileHover={{ scale: 1.03 }}
              className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-primary text-primary-foreground text-lg hover:bg-primary/90 transition shadow-md"
            >
              Create a Hug
            </motion.button>

            <p className="text-xs text-muted-foreground">
              No signup required 🤍
            </p>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
