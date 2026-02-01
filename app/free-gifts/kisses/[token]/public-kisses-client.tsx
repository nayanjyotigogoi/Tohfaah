"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Share2, Copy } from "lucide-react";
import { useRouter } from "next/navigation";

type Kiss = {
  x: number;
  y: number;
  rotation: number;
  scale: number;
};

type GiftResponse = {
  gift_type: "kisses";
  recipient_name: string;
  sender_name: string;
  gift_data: {
    kisses: Kiss[];
  };
};

const KISS_IMAGE = "/kiss-vector.png";

export default function PublicKissesClient({ token }: { token: string }) {
  const [gift, setGift] = useState<GiftResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);

  const router = useRouter();

  const shareUrl =
    typeof window !== "undefined" ? window.location.href : "";

  /* =======================
     FETCH KISSES
  ======================= */
  useEffect(() => {
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
     SHARE & COPY
  ======================= */
  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "Kisses for you 💋",
        text: "Someone sent you kisses!",
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
        <p className="text-muted-foreground">Loading kisses…</p>
      </main>
    );
  }

  if (
    error ||
    !gift ||
    gift.gift_type !== "kisses" ||
    !Array.isArray(gift.gift_data?.kisses)
  ) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">
          These kisses don’t exist 💔
        </p>
      </main>
    );
  }

  /* =======================
     PAGE
  ======================= */
  return (
    <main className="relative min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-background">
      <Navigation />

      <div className="pt-28 pb-20 px-4">
        <div className="max-w-2xl mx-auto space-y-10">
          {/* HEADER */}
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-light mb-2">
              For{" "}
              <span className="italic text-primary">
                {gift.recipient_name}
              </span>
            </h1>
            <p className="text-muted-foreground">
              Kisses from {gift.sender_name}
            </p>
          </div>

          {/* KISSES CANVAS */}
          <div className="relative aspect-video rounded-2xl bg-gradient-to-br from-rose-100 to-pink-100 border overflow-hidden">
            {gift.gift_data.kisses.map((kiss, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: `${kiss.x}%`,
                  top: `${kiss.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <img
                  src={KISS_IMAGE}
                  alt="Kiss"
                  width={72}
                  height={52}
                  style={{
                    transform: `rotate(${kiss.rotation}deg) scale(${kiss.scale})`,
                    mixBlendMode: "multiply",
                  }}
                />
              </motion.div>
            ))}

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full text-sm">
                xoxo 💋
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
                Share these kisses
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

          {/* CTA — CREATE YOUR OWN */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-14 rounded-2xl bg-gradient-to-br from-rose-100 via-pink-100 to-background border border-border p-8 text-center space-y-4"
          >
            <h3 className="text-xl md:text-2xl font-light text-foreground">
              Want to send kisses to someone you love?
            </h3>

            <p className="text-muted-foreground max-w-md mx-auto">
              Tap, sprinkle kisses, and share the love in seconds 💋
            </p>

            <button
              onClick={() => router.push("/free-gifts/kisses")}
              className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-primary text-primary-foreground text-lg hover:bg-primary/90 transition shadow-md"
            >
              Create a Kiss Card
            </button>

            <p className="text-xs text-muted-foreground">
              No signup required 💖
            </p>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
