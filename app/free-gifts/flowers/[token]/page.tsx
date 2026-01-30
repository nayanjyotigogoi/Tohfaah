"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Navigation } from "@/components/navigation";

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
  "flower-1": {
    name: "Tulip",
    image: "/Flowers/flower-1.jfif",
    video: "/Flowers/flower-1.mp4",
  },
  "flower-2": {
    name: "Pink Bouquet",
    image: "/Flowers/flower-2.jfif",
    video: "/Flowers/flower-2.mp4",
  },
  "flower-3": {
    name: "Rose",
    image: "/Flowers/flower-3.jfif",
    video: "/Flowers/flower-3.mp4",
  },
  "flower-4": {
    name: "Bottle",
    image: "/Flowers/flower-4.jfif",
    video: "/Flowers/flower-4.mp4",
  },
  "flower-5": {
    name: "Sun Flower",
    image: "/Flowers/flower-5.jfif",
    video: "/Flowers/flower-5.mp4",
  },
  "flower-6": {
    name: "Daisy",
    image: "/Flowers/flower-6.jfif",
    video: "/Flowers/flower-6.mp4",
  },
  "flower-7": {
    name: "Hot Wheels",
    image: "/Flowers/flower-7.jfif",
    video: "/Flowers/flower-7.mp4",
  },
};

export default function PublicFlowersPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();

  const [gift, setGift] = useState<GiftData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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
     STATES
  ========================= */
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
        <p className="text-muted-foreground">
          Flower not found 🌸
        </p>
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
              For{" "}
              <span className="italic text-primary">
                {gift.recipient_name}
              </span>
            </h1>
            <p className="text-muted-foreground">
              From {gift.sender_name}
            </p>
          </div>

          {/* VIDEO PREVIEW */}
          <div className="relative aspect-square max-w-sm mx-auto rounded-2xl bg-gradient-to-br from-rose-100 to-pink-100 overflow-hidden">
            <video
              src={flower.video}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />

            {gift.gift_data.message && (
              <div className="absolute bottom-4 left-4 right-4 bg-white/80 backdrop-blur p-3 rounded-xl text-center text-sm italic">
                {gift.gift_data.message}
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="text-center space-y-3">
            <button
              onClick={() => router.push("/free-gifts/flowers")}
              className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-primary text-primary-foreground text-lg hover:bg-primary/90 transition shadow-md"
            >
              Create Your Own Bouquet
            </button>
            <p className="text-xs text-muted-foreground">
              It only takes a minute 🌸
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}
