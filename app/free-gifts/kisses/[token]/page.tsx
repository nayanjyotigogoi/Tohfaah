"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Heart, Share2 } from "lucide-react";

type Kiss = {
  x: number;
  y: number;
  rotation: number;
  scale: number;
};

type GiftData = {
  gift_type: string;
  recipient_name: string;
  sender_name: string;
  gift_data: {
    kisses: Kiss[];
  };
};

const KISS_IMAGE = "/kiss-vector.png";

export default function PublicKissesPage() {
  const { token } = useParams<{ token: string }>();

  const [gift, setGift] = useState<GiftData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl =
    typeof window !== "undefined" ? window.location.href : "";

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

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "Kisses for you 💋",
        text: "Someone sent you kisses!",
        url: shareUrl,
      });
    } else {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
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

  if (error || !gift) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">
          These kisses don’t exist 💔
        </p>
      </main>
    );
  }

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
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.9, scale: 1 }}
                transition={{ delay: i * 0.04 }}
              >
                <img
                  src={KISS_IMAGE}
                  alt="Kiss"
                  width={72}
                  height={52}
                  style={{
                    transform: `rotate(${kiss.rotation}deg) scale(${kiss.scale})`,
                    mixBlendMode: "multiply",
                    opacity: 0.9,
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

          {/* SHARE */}
          <div className="text-center space-y-3">
            <Button
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full"
            >
              <Share2 className="w-4 h-4" />
              Share these kisses
            </Button>

            {copied && (
              <p className="text-xs text-muted-foreground">
                Link copied — paste it anywhere 💖
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
