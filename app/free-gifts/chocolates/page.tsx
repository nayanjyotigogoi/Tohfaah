"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Share2, Sparkles, Copy, Check } from "lucide-react";
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
  const [copied, setCopied] = useState(false);

  /* ================= CREATE (BACKEND) ================= */
  const handleCreate = async () => {
    if (!recipientName || !senderName) return;
    setLoading(true);

    try {
      const authToken =
        typeof window !== "undefined"
          ? localStorage.getItem("auth_token")
          : null;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/free-gifts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(authToken
              ? { Authorization: `Bearer ${authToken}` }
              : {}),
          },
          body: JSON.stringify({
            gift_type: "chocolates",
            recipient_name: recipientName,
            sender_name: senderName,
            gift_data: { messages },
          }),
        }
      );

      if (!res.ok) throw new Error();

      const data = await res.json();
      setShareToken(data.token);
      setStage("experience");
    } finally {
      setLoading(false);
    }
  };

  /* ================= RESET ================= */
  const resetAll = () => {
    setStage("create");
    setRecipientName("");
    setSenderName("");
    setMessages(DEFAULT_MESSAGES);
    setOpenedChocolates([]);
    setActiveChocolate(null);
    setShareToken(null);
    setCopied(false);
  };

  /* ================= UNWRAP ================= */
  const handleUnwrap = (index: number) => {
    if (openedChocolates.includes(index)) return;

    setOpenedChocolates((prev) => [...prev, index]);
    setActiveChocolate(index);
    setTimeout(() => setActiveChocolate(null), 2600);
  };

  const shareUrl = shareToken
    ? `${process.env.NEXT_PUBLIC_APP_URL}/free-gifts/chocolates/${shareToken}`
    : "";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /* ================= CREATE ================= */
  if (stage === "create") {
    return (
      <main className="relative min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
        <Navigation />

        <div className="pt-28 pb-20 px-4 max-w-xl mx-auto">
          <Link
            href="/free-gifts"
            className="inline-flex items-center text-muted-foreground mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Free Gifts
          </Link>

          <div className="text-center mb-10">
            <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🍫</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-light mb-3">
              Sweet <span className="italic text-amber-700">Chocolates</span>
            </h1>
            <p className="text-muted-foreground">
              Each chocolate hides a message
            </p>
          </div>

          <div className="bg-card rounded-2xl p-6 shadow-lg border space-y-6">
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
          </div>
        </div>
      </main>
    );
  }

  /* ================= EXPERIENCE ================= */
  if (stage === "experience") {
    return (
      <main className="relative min-h-screen bg-gradient-to-br from-amber-900 via-amber-950 to-rose-950 overflow-hidden">
        <Navigation />

        <div className="pt-28 pb-20 px-4 flex flex-col items-center">
          <div className="text-center mb-8">
            <p className="text-amber-300 text-lg mb-2">
              For {recipientName}
            </p>
            <h1 className="text-3xl md:text-4xl font-light text-amber-50">
              A Box of{" "}
              <span className="italic text-amber-300">
                Sweet Surprises
              </span>
            </h1>
          </div>

          <div className="bg-gradient-to-br from-amber-800 to-amber-950 rounded-3xl p-6 border-4 border-amber-700">
            <div className="grid grid-cols-3 gap-5">
              {messages.map((msg, index) => (
                <div key={index} className="relative">
                  <button
                    onClick={() => handleUnwrap(index)}
                    className={`w-24 h-16 rounded-lg bg-gradient-to-br ${
                      chocolateColors[index]
                    } shadow-xl ${
                      openedChocolates.includes(index) ? "opacity-60" : ""
                    }`}
                  />

                  <AnimatePresence>
                    {activeChocolate === index && (
                      <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: -10 }}
                        exit={{ opacity: 0, y: -30 }}
                        className="absolute z-50 left-1/2 -translate-x-1/2 top-0 bg-amber-50 text-amber-900 px-4 py-2 rounded-xl shadow-xl text-sm"
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
            <div className="mt-8 w-full max-w-sm space-y-3 text-center">
              <p className="text-amber-100 text-xl">
                With love,{" "}
                <span className="text-amber-300 italic">
                  {senderName}
                </span>
              </p>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={resetAll}
                  className="flex-1"
                >
                  Start Over
                </Button>

                <Button
                  onClick={() => setStage("share")}
                  className="flex-1"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    );
  }

  /* ================= SHARE ================= */
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="text-5xl">🍫</div>

        <h2 className="text-2xl font-light">
          Chocolates <span className="italic text-amber-700">Ready!</span>
        </h2>

        <div className="flex items-center gap-3">
          <div className="flex-1 p-4 bg-secondary rounded-xl font-mono text-sm break-all">
            {shareUrl}
          </div>

          <button
            onClick={handleCopy}
            className="p-3 rounded-full border hover:bg-muted"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>

        {copied && (
          <p className="text-xs text-muted-foreground">
            Link copied — share the sweetness 🍫
          </p>
        )}
      </div>
    </main>
  );
}
