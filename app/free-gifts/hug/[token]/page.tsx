"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { FloatingElements } from "@/components/floating-elements";
import { Heart, Share2 } from "lucide-react";
import Image from "next/image";

type GiftData = {
  gift_type: string;
  recipient_name: string;
  sender_name?: string;
  gift_data: {
    hug_style: number;
  };
};

export default function PublicHugPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();

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

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "Virtual Hug",
        text: "I sent you a virtual hug 🤍",
        url: shareUrl,
      });
    } else {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  /* =======================
     LOADING / ERROR
  ======================= */
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading hug…</p>
      </main>
    );
  }

  if (error || !gift) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">
          This hug does not exist 💔
        </p>
      </main>
    );
  }

  const hugStyle = gift.gift_data?.hug_style ?? 1;

  /* =======================
     PAGE
  ======================= */
  return (
    <main className="relative min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-background">
      <FloatingElements density="low" />
      <Navigation />

      <div className="pt-28 pb-20 px-4">
        <div className="max-w-xl mx-auto space-y-8 text-center">
          <h1 className="text-2xl md:text-3xl font-light text-foreground">
            A hug for{" "}
            <span className="italic text-primary">
              {gift.recipient_name}
            </span>
          </h1>

          <p className="text-muted-foreground">
            From {gift.sender_name}, with love
          </p>

          {/* HUG */}
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

          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Heart className="w-4 h-4 text-primary fill-primary" />
            <span>You are loved</span>
          </div>

          {/* SHARE */}
          <div className="space-y-3">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition"
            >
              <Share2 className="w-4 h-4" />
              Share this hug
            </button>

            {copied && (
              <p className="text-xs text-muted-foreground">
                Link copied — paste it anywhere 🤍
              </p>
            )}
          </div>

          {/* CTA */}
          <div className="pt-6">
            <button
              onClick={() => router.push("/free-gifts/hug")}
              className="text-primary font-medium hover:text-primary/80 transition"
            >
              Send another hug →
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
