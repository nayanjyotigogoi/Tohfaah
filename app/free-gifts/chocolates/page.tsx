"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Share2, Sparkles, Copy } from "lucide-react";
import Link from "next/link";

type Stage = "create" | "experience" | "share";

const DEFAULT_MESSAGES = [
  "I love you",
  "You're sweet",
  "Be mine",
  "XOXO",
  "Forever",
  "My heart",
];

const chocolateColors = [
  "from-amber-800 to-amber-950",
  "from-rose-800 to-rose-950",
  "from-yellow-800 to-amber-950",
  "from-orange-800 to-red-950",
  "from-amber-700 to-amber-900",
  "from-rose-700 to-rose-900",
];

export default function ChocolatesPage() {
  const [stage, setStage] = useState<Stage>("create");

  const [recipientName, setRecipientName] = useState("");
  const [senderName, setSenderName] = useState("");
  const [messages, setMessages] = useState<string[]>(DEFAULT_MESSAGES);

  const [openedChocolates, setOpenedChocolates] = useState<number[]>([]);
  const [activeChocolate, setActiveChocolate] = useState<number | null>(null);

  const [shareToken, setShareToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  /* =======================
     CREATE (BACKEND)
  ======================= */
  const handleCreate = async () => {
    if (!recipientName || !senderName) return;

    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/free-gifts`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            gift_type: "chocolates",
            recipient_name: recipientName,
            sender_name: senderName,
            gift_data: {
              messages,
            },
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to create chocolate gift");

      const data = await res.json();
      setShareToken(data.token);
      setStage("experience");
    } catch (e) {
      console.error(e);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* =======================
     UNWRAP
  ======================= */
  const handleUnwrap = (index: number) => {
    if (openedChocolates.includes(index)) return;

    setOpenedChocolates((prev) => [...prev, index]);
    setActiveChocolate(index);

    setTimeout(() => setActiveChocolate(null), 2600);
  };

  const copyLink = () => {
    if (!shareToken) return;
    const url = `${process.env.NEXT_PUBLIC_APP_URL}/free-gifts/chocolates/${shareToken}`;
    navigator.clipboard.writeText(url);
  };

  /* =======================
     CREATE STAGE
  ======================= */
  if (stage === "create") {
    return (
      <main className="relative min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
        <Navigation />

        <div className="pt-28 pb-20 px-4 max-w-xl mx-auto">
          <Link
            href="/free-gifts"
            className="inline-flex items-center text-muted-foreground hover:text-primary mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Free Gifts
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🍫</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-light mb-3">
              Sweet <span className="italic text-amber-700">Chocolates</span>
            </h1>
            <p className="text-muted-foreground">
              Each chocolate hides a message — you can customize them all
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-2xl p-6 shadow-lg border space-y-6"
          >
            <Input
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="Their name..."
            />

            <Input
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="Your name..."
            />

            <div className="grid grid-cols-2 gap-3">
              {messages.map((msg, i) => (
                <Input
                  key={i}
                  value={msg}
                  onChange={(e) => {
                    const updated = [...messages];
                    updated[i] = e.target.value;
                    setMessages(updated);
                  }}
                  placeholder={`Message ${i + 1}`}
                  className="text-sm"
                />
              ))}
            </div>

            <Button
              onClick={handleCreate}
              disabled={!recipientName || !senderName || loading}
              className="w-full py-6 text-lg bg-amber-700 hover:bg-amber-800 text-white"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Create Chocolate Box
            </Button>
          </motion.div>
        </div>
      </main>
    );
  }

  /* =======================
     EXPERIENCE STAGE
  ======================= */
  if (stage === "experience") {
    return (
      <main
        ref={containerRef}
        className="relative min-h-screen bg-gradient-to-br from-amber-900 via-amber-950 to-rose-950 overflow-hidden"
      >
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <p className="text-amber-300 text-lg mb-2">
              For {recipientName}
            </p>
            <h1 className="text-3xl md:text-4xl font-light text-amber-50 mb-2">
              A Box of <span className="italic text-amber-300">Sweet Surprises</span>
            </h1>
            <p className="text-amber-200/70">
              Open each chocolate one by one
            </p>
          </motion.div>

          <div className="relative bg-gradient-to-br from-amber-800 to-amber-950 rounded-3xl p-6 md:p-8 shadow-2xl border-4 border-amber-700">
            <div className="grid grid-cols-3 gap-5">
              {messages.map((msg, index) => (
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
          </div>

          <p className="text-amber-300/70 mt-6">
            {openedChocolates.length} of {messages.length} opened
          </p>

          {openedChocolates.length === messages.length && (
            <div className="mt-8 text-center">
              <p className="text-amber-100 text-xl mb-4">
                With love,{" "}
                <span className="text-amber-300 italic">{senderName}</span>
              </p>

              <Button onClick={() => setStage("share")}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          )}
        </div>
      </main>
    );
  }

  /* =======================
     SHARE STAGE
  ======================= */
  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center space-y-6">
        <div className="text-5xl">🍫</div>
        <h2 className="text-2xl font-light">
          Chocolates <span className="italic text-amber-700">Sent!</span>
        </h2>

        <p className="font-mono break-all text-sm bg-secondary p-3 rounded-lg">
          {`${process.env.NEXT_PUBLIC_APP_URL}/free-gifts/chocolates/${shareToken}`}
        </p>

        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={copyLink}>
            <Copy className="w-4 h-4 mr-2" />
            Copy Link
          </Button>
          <Link href="/free-gifts">
            <Button variant="outline">Create Another</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
