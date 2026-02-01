"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { motion } from "framer-motion";
import { Share2, Copy } from "lucide-react";

/* =========================
   TYPES
========================= */
type GiftData = {
  gift_type: "flowers";
  recipient_name: string;
  sender_name: string;
  gift_data: {
    flower_id: string;
    message?: string;
  };
};

/* =========================
   FLOWER MAP (SYSTEM FILES)
========================= */
const FLOWERS: Record<
  string,
  { name: string; image: string; video: string }
> = {
  "flower-1": { name: "Tulip", image: "/Flowers/flower-1.jfif", video: "/Flowers/flower-1.mp4" },
  "flower-2": { name: "Pink Bouquet", image: "/Flowers/flower-2.jfif", video: "/Flowers/flower-2.mp4" },
  "flower-3": { name: "Rose", image: "/Flowers/flower-3.jfif", video: "/Flowers/flower-3.mp4" },
  "flower-4": { name: "Bottle", image: "/Flowers/flower-4.jfif", video: "/Flowers/flower-4.mp4" },
  "flower-5": { name: "Sun Flower", image: "/Flowers/flower-5.jfif", video: "/Flowers/flower-5.mp4" },
  "flower-6": { name: "Daisy", image: "/Flowers/flower-6.jfif", video: "/Flowers/flower-6.mp4" },
  "flower-7": { name: "Hot Wheels", image: "/Flowers/flower-7.jfif", video: "/Flowers/flower-7.mp4" },
};

export default function PublicFlowersPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();

  const [gift, setGift] = useState<GiftData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl =
    typeof window !== "undefined" ? window.location.href : "";

  /* =========================
     FETCH FLOWER GIFT
  ========================= */
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

  /* =========================
     SHARE / COPY
  ========================= */
  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "Flowers for you 🌸",
        text: "Someone sent you flowers!",
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
        <p className="text-muted-foreground">Loading bouquet…</p>
      </main>
    );
  }

  if (error || !gift) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">
          This bouquet does not exist 💔
        </p>
      </main>
    );
  }

  const flower = FLOWERS[gift.gift_data.flower_id];
  if (!flower) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Flower not found 🌸</p>
      </main>
    );
  }

  /* =========================
     RENDER
  ========================= */
  return (
    <main className="relative min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-background">
      <Navigation />

      <div className="pt-28 pb-20 px-4">
        <div className="max-w-2xl mx-auto space-y-10">

          {/* HEADER */}
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-light mb-2">
              For <span className="italic text-primary">{gift.recipient_name}</span>
            </h1>
            <p className="text-muted-foreground">
              From {gift.sender_name}
            </p>
          </div>

          {/* VIDEO PREVIEW */}
          <div className="relative aspect-square max-w-sm mx-auto rounded-2xl overflow-hidden">
            <video
              src={flower.video}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />

            {/* MESSAGE */}
            {gift.gift_data.message && (
              <div className="absolute bottom-4 left-4 right-4 bg-white/80 backdrop-blur p-3 rounded-xl text-center text-sm italic">
                {gift.gift_data.message}
              </div>
            )}

           
{/* ✨ MICRO PREMIUM DIAGONAL EDGE WATERMARK */}
<div className="pointer-events-none absolute inset-0 overflow-hidden">
  <div
    className="absolute top-6 right-[3%] w-[170%]"
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
</div>



         
          </div>

          {/* SHARE + COPY */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition"
              >
                <Share2 className="w-4 h-4" />
                Share these flowers
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
                Link copied — paste it anywhere 🌸
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
              Want to send flowers to someone you love?
            </h3>
            <p className="text-muted-foreground">
              Choose a flower, add a note, and make their day bloom 🌸
            </p>
            <button
              onClick={() => router.push("/free-gifts/flowers")}
              className="px-8 py-4 rounded-full bg-primary text-primary-foreground text-lg shadow-md"
            >
              Create a Flower Bouquet
            </button>
            <p className="text-xs text-muted-foreground">
              No signup required 🌷
            </p>
          </motion.div>

        </div>
      </div>
    </main>
  );
}
