"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Share2, Flower2, Copy } from "lucide-react";

type Step = "create" | "preview" | "share";

const flowers = [
  { id: "flower-1", name: "Tulip", image: "/Flowers/flower-1.jfif", video: "/Flowers/flower-1.mp4" },
  { id: "flower-2", name: "Pink Bouquet", image: "/Flowers/flower-2.jfif", video: "/Flowers/flower-2.mp4" },
  { id: "flower-3", name: "Rose", image: "/Flowers/flower-3.jfif", video: "/Flowers/flower-3.mp4" },
  { id: "flower-4", name: "Bottle", image: "/Flowers/flower-4.jfif", video: "/Flowers/flower-4.mp4" },
  { id: "flower-5", name: "Sun Flower", image: "/Flowers/flower-5.jfif", video: "/Flowers/flower-5.mp4" },
  { id: "flower-6", name: "Daisy", image: "/Flowers/flower-6.jfif", video: "/Flowers/flower-6.mp4" },
  { id: "flower-7", name: "Hot wheels", image: "/Flowers/flower-7.jfif", video: "/Flowers/flower-7.mp4" },
];

export default function FlowersGiftPage() {
  const [step, setStep] = useState<Step>("create");
  const [recipientName, setRecipientName] = useState("");
  const [senderName, setSenderName] = useState("");
  const [message, setMessage] = useState("");
  const [selectedFlower, setSelectedFlower] = useState(flowers[0]);
  const [shareToken, setShareToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

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
            gift_type: "flowers",
            recipient_name: recipientName,
            sender_name: senderName,
            gift_data: {
              flower_id: selectedFlower.id,
              message,
            },
          }),
        }
      );

      if (!res.ok) throw new Error();

      const data = await res.json();
      setShareToken(data.token);
      setStep("preview");
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep("create");
    setRecipientName("");
    setSenderName("");
    setMessage("");
    setSelectedFlower(flowers[0]);
    setShareToken(null);
    setCopied(false);
  };

  /* =======================
     COPY LINK (ADDED)
  ======================= */
  const handleCopy = async () => {
    if (!shareToken) return;

    const url = `${process.env.NEXT_PUBLIC_APP_URL}/free-gifts/flowers/${shareToken}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-background">
      <Navigation />

      <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">

            {/* CREATE */}
            {step === "create" && (
              <motion.div
                key="create"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <div className="inline-flex w-16 h-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                    <Flower2 className="w-8 h-8 text-primary" />
                  </div>
                  <h1 className="text-3xl md:text-4xl font-light">
                    Send <span className="italic text-primary">Flowers</span>
                  </h1>
                  <p className="text-muted-foreground">
                    Choose one flower. We’ll turn it into a bouquet 🌸
                  </p>
                </div>

                <Input
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Who is this for?"
                  className="text-lg"
                />

                <Input
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="Your name"
                  className="text-lg"
                />

                {/* Flower Picker (UNCHANGED) */}
                <div className="flex gap-4 overflow-x-auto pb-4 px-1">
                  {flowers.map((flower) => (
                    <motion.button
                      key={flower.id}
                      onClick={() => setSelectedFlower(flower)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`min-w-[140px] rounded-xl border-2 p-3 ${
                        selectedFlower.id === flower.id
                          ? "border-primary bg-primary/5"
                          : "border-border"
                      }`}
                    >
                      <Image src={flower.image} alt={flower.name} width={120} height={120} />
                      <p className="mt-2 text-sm font-medium">{flower.name}</p>
                    </motion.button>
                  ))}
                </div>

                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Add a note (optional)"
                  rows={2}
                />

                <Button
                  onClick={handleCreate}
                  disabled={!recipientName || !senderName || loading}
                  className="w-full text-lg py-6"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Create Bouquet
                </Button>
              </motion.div>
            )}

            {/* PREVIEW */}
            {step === "preview" && (
              <motion.div
                key="preview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <h2 className="text-2xl font-light">
                    For <span className="italic text-primary">{recipientName}</span>
                  </h2>
                </div>

                <div className="relative aspect-square max-w-sm mx-auto rounded-2xl overflow-hidden">
                  <video
                    src={selectedFlower.video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />

                  {message && (
                    <div className="absolute bottom-4 left-4 right-4 bg-white/80 backdrop-blur p-3 rounded-xl text-center text-sm italic">
                      {message}
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" onClick={handleReset} className="flex-1">
                    Start Over
                  </Button>
                  <Button onClick={() => setStep("share")} className="flex-1">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </motion.div>
            )}

            {/* SHARE */}
            {step === "share" && (
              <motion.div
                key="share"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6 text-center"
              >
                <h2 className="text-2xl font-light">
                  Bouquet <span className="italic text-primary">Ready!</span>
                </h2>

                {/* LINK + COPY (ADDED) */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 p-4 bg-secondary rounded-xl font-mono text-sm break-all">
                    {`${process.env.NEXT_PUBLIC_APP_URL}/free-gifts/flowers/${shareToken}`}
                  </div>

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

                <Button onClick={handleReset} variant="outline">
                  Create Another
                </Button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
