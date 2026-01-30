"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Share2, Sparkles } from "lucide-react";
import Link from "next/link";
import confetti from "canvas-confetti";

interface ChocolateGift {
  recipient_name: string;
  sender_name: string;
  gift_data: {
    messages: string[];
  };
}

const chocolateColors = [
  "from-amber-800 to-amber-950",
  "from-rose-800 to-rose-950",
  "from-yellow-800 to-amber-950",
  "from-orange-800 to-red-950",
  "from-amber-700 to-amber-900",
  "from-rose-700 to-rose-900",
];

export default function ChocolateSharedPage() {
  const { token } = useParams<{ token: string }>();
  const containerRef = useRef<HTMLDivElement>(null);

  const [gift, setGift] = useState<ChocolateGift | null>(null);
  const [openedChocolates, setOpenedChocolates] = useState<number[]>([]);
  const [activeChocolate, setActiveChocolate] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [confettiFired, setConfettiFired] = useState(false);

  /* =======================
     FETCH SHARED GIFT
  ======================= */
  useEffect(() => {
    if (!token) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/free-gifts/${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.gift_type !== "chocolates") return;
        setGift(data);
      })
      .catch(() => {
        alert("Gift not found");
      })
      .finally(() => setLoading(false));
  }, [token]);

  /* =======================
     CONFETTI ON COMPLETE
  ======================= */
  useEffect(() => {
    if (!gift) return;

    if (
      openedChocolates.length === gift.gift_data.messages.length &&
      !confettiFired
    ) {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#f59e0b", "#fbbf24", "#fde68a", "#fb7185"],
      });
      setConfettiFired(true);
    }
  }, [openedChocolates, gift, confettiFired]);

  /* =======================
     UNWRAP
  ======================= */
  const handleUnwrap = (index: number) => {
    if (openedChocolates.includes(index)) return;

    setOpenedChocolates((prev) => [...prev, index]);
    setActiveChocolate(index);

    setTimeout(() => setActiveChocolate(null), 2600);
  };

  const handleShare = () => {
    navigator.share?.({
      title: "Sweet Chocolates",
      text: "Someone sent you sweet chocolates 🍫💝",
      url: window.location.href,
    });
  };

  /* =======================
     LOADING / ERROR
  ======================= */
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        Loading...
      </main>
    );
  }

  if (!gift) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        Gift not found
      </main>
    );
  }

  /* =======================
     EXPERIENCE (UNCHANGED UI)
  ======================= */
  return (
    <main
      ref={containerRef}
      className="relative min-h-screen bg-gradient-to-br from-amber-900 via-amber-950 to-rose-950 overflow-hidden"
    >
      <Navigation />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <p className="text-amber-300 text-lg mb-2">
            For {gift.recipient_name}
          </p>
          <h1 className="text-3xl md:text-4xl font-light text-amber-50 mb-2">
            A Box of{" "}
            <span className="italic text-amber-300">Sweet Surprises</span>
          </h1>
          <p className="text-amber-200/70">
            Open each chocolate one by one
          </p>
        </motion.div>

        {/* Chocolate Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative bg-gradient-to-br from-amber-800 to-amber-950 rounded-3xl p-6 md:p-8 shadow-2xl border-4 border-amber-700"
        >
          <div className="grid grid-cols-3 gap-5">
            {gift.gift_data.messages.map((msg, index) => (
              <div key={index} className="relative">
                <button
                  onClick={() => handleUnwrap(index)}
                  className={`w-24 h-16 rounded-lg bg-gradient-to-br ${
                    chocolateColors[index]
                  } shadow-xl relative overflow-hidden ${
                    openedChocolates.includes(index) ? "opacity-60" : ""
                  }`}
                />

                <AnimatePresence>
                  {activeChocolate === index && (
                    <motion.div
                      initial={{ opacity: 0, y: 16, scale: 0.95 }}
                      animate={{ opacity: 1, y: -10, scale: 1 }}
                      exit={{ opacity: 0, y: -30, scale: 0.9 }}
                      className="absolute z-50 left-1/2 -translate-x-1/2 top-0 bg-amber-50 text-amber-900 px-4 py-2 rounded-xl shadow-xl text-sm font-medium text-center max-w-[160px]"
                    >
                      {msg}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>

        <p className="text-amber-300/70 mt-6">
          {openedChocolates.length} of{" "}
          {gift.gift_data.messages.length} opened
        </p>

        {/* FINAL ACTIONS */}
        {openedChocolates.length === gift.gift_data.messages.length && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 text-center space-y-4"
          >
            <p className="text-amber-100 text-xl">
              With love,{" "}
              <span className="text-amber-300 italic">
                {gift.sender_name}
              </span>
            </p>

            <div className="flex gap-4 justify-center">
              <Button onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>

              <Link href="/free-gifts/chocolates">
                <Button
                  variant="outline"
                  className="border-amber-600 text-amber-300 hover:bg-amber-900 bg-transparent"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Create your own
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
