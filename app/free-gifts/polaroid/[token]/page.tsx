"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Navigation } from "@/components/navigation";
import { FloatingElements } from "@/components/floating-elements";
import { Heart, RotateCcw, Share2, Copy } from "lucide-react";

type GiftData = {
  gift_type: string;
  recipient_name: string;
  sender_name?: string;
  gift_data: {
    message: string;
    image_url: string;
  };
};

export default function PublicPolaroidPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();

  const [gift, setGift] = useState<GiftData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl =
    typeof window !== "undefined" ? window.location.href : "";

  // ✅ FINAL IMAGE SOURCE (NO GUESSING)
  const imageSrc = gift?.gift_data.image_url ?? "";

  /* =======================
     FETCH POLAROID
  ======================= */
  useEffect(() => {
    if (!token) return;

    const fetchGift = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/free-gifts/${token}`
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
     INTERACTIONS
  ======================= */
  const handleFlip = () => setIsFlipped((v) => !v);

  const handleShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 600);
  };

  /* =======================
     SHARE & COPY
  ======================= */
  const handleShare = async () => {
    const sender = gift?.sender_name ?? "Someone special";

    if (navigator.share) {
      await navigator.share({
        title: "Polaroid Memory",
        text: `A polaroid memory from ${sender} 💖`,
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
        <p className="text-muted-foreground">Loading polaroid…</p>
      </main>
    );
  }

  if (error || !gift) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">
          This polaroid does not exist 💔
        </p>
      </main>
    );
  }

  /* =======================
     PAGE
  ======================= */
  return (
    <main className="relative min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-background">
      <FloatingElements density="low" />
      <Navigation />

      <div className="pt-28 pb-20 px-4">
        <div className="max-w-2xl mx-auto space-y-10">
          {/* HEADER */}
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-light text-foreground mb-2">
              For{" "}
              <span className="italic text-primary">
                {gift.recipient_name}
              </span>
            </h1>
            <p className="text-muted-foreground">
              A polaroid memory made just for you
            </p>
          </div>

          {/* POLAROID */}
          <div className="flex justify-center perspective-1000">
            <motion.div
              className={`relative cursor-pointer ${
                isShaking ? "animate-shake" : ""
              }`}
              animate={{
                rotateY: isFlipped ? 180 : 0,
                rotate: isShaking ? [0, -3, 3, -3, 3, 0] : 0,
              }}
              transition={{
                rotateY: { duration: 0.6, ease: "easeInOut" },
                rotate: { duration: 0.4 },
              }}
              onClick={handleFlip}
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* FRONT */}
              <div
                className="relative bg-white p-4 pb-16 shadow-xl rounded-sm"
                style={{ backfaceVisibility: "hidden" }}
              >
                {/* ✅ FIXED: portrait container */}
                <div className="w-64 md:w-80 aspect-[3/4] overflow-hidden">
                  {imageSrc && (
                    <img
                      src={imageSrc}
                      alt="Polaroid memory"
                      className="w-full h-full object-cover"
                    />
                  )}

                </div>

                <p className="absolute bottom-4 left-0 right-0 text-center text-gray-500 text-sm">
                  Tap to flip
                </p>
              </div>

              {/* BACK */}
              <div
                className="absolute inset-0 bg-white p-6 shadow-xl rounded-sm flex flex-col items-center justify-center"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                {/* ✅ FIXED: portrait container */}
                <div className="w-64 md:w-80 aspect-[3/4] flex flex-col items-center justify-center text-center">
                  <Heart className="w-8 h-8 text-primary fill-primary mb-4" />
                  <p className="text-foreground text-lg leading-relaxed whitespace-pre-wrap">
                    {gift.gift_data?.message ?? "You are loved."}
                  </p>

                  {gift.sender_name && (
                    <p className="mt-6 text-muted-foreground text-sm italic">
                      — {gift.sender_name}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* SHAKE */}
          <div className="text-center">
            <button
              onClick={handleShake}
              className="text-primary hover:text-primary/80 text-sm flex items-center gap-2 mx-auto"
            >
              <RotateCcw className="w-4 h-4" />
              Shake the polaroid
            </button>
          </div>

          {/* SHARE */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition"
              >
                <Share2 className="w-4 h-4" />
                Share this memory
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
                Link copied — paste it anywhere 💖
              </p>
            )}
          </div>

          {/* CTA */}
          <div className="mt-14 rounded-2xl bg-gradient-to-br from-rose-100 via-pink-100 to-background border border-border p-8 text-center space-y-4">
            <h3 className="text-xl md:text-2xl font-light text-foreground">
              Want to create one for someone you love?
            </h3>

            <p className="text-muted-foreground max-w-md mx-auto">
              Turn a photo and a few words into a memory they’ll never forget.
            </p>

            <button
              onClick={() => router.push("/free-gifts/polaroid")}
              className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-primary text-primary-foreground text-lg hover:bg-primary/90 transition shadow-md"
            >
              Create a Polaroid Memory
            </button>

            <p className="text-xs text-muted-foreground">
              It only takes a minute 💖
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
