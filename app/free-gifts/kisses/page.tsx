"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, Share2, RotateCcw } from "lucide-react";

interface Kiss {
  x: number;
  y: number;
  rotation: number;
  scale: number;
}

type Step = "create" | "preview" | "share";

const KISS_IMAGE = "/kiss-vector.png";
const MAX_KISSES = 20;

export default function KissesGiftPage() {
  const [step, setStep] = useState<Step>("create");

  const [recipientName, setRecipientName] = useState("");
  const [senderName, setSenderName] = useState("");

  const [kisses, setKisses] = useState<Kiss[]>([]);
  const [shareToken, setShareToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /* =======================
     ADD KISS (CANVAS)
  ======================= */
  const handleAddKiss = (e: React.MouseEvent<HTMLDivElement>) => {
    if (kisses.length >= MAX_KISSES) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newKiss: Kiss = {
      x,
      y,
      rotation: Math.random() * 30 - 15,
      scale: 0.85 + Math.random() * 0.35,
    };

    setKisses((prev) => [...prev, newKiss]);
  };

  /* =======================
     CREATE (BACKEND)
  ======================= */
  const handleCreate = async () => {
    if (!recipientName || !senderName || kisses.length === 0) return;

    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/free-gifts`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            gift_type: "kisses",
            recipient_name: recipientName,
            sender_name: senderName,
            gift_data: {
              kisses,
            },
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to create kiss gift");

      const data = await res.json();
      setShareToken(data.token);
      setStep("preview");
    } catch (e) {
      console.error(e);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => setStep("share");

  const handleReset = () => {
    setStep("create");
    setRecipientName("");
    setSenderName("");
    setKisses([]);
    setShareToken(null);
  };

  const clearKisses = () => setKisses([]);

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-background">
      <Navigation />

      <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">

            {/* ================= CREATE ================= */}
            {step === "create" && (
              <motion.div
                key="create"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* Header */}
                <div className="text-center">
                  <motion.div
                    className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Heart className="w-8 h-8 text-primary fill-primary" />
                  </motion.div>
                  <h1 className="text-3xl md:text-4xl font-light mb-2">
                    Send <span className="italic text-primary">Kisses</span>
                  </h1>
                  <p className="text-muted-foreground">
                    Tap anywhere to leave kiss marks
                  </p>
                </div>

                {/* Names */}
                <div className="space-y-4">
                  <Input
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Their name..."
                    className="text-lg"
                  />
                  <Input
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="Your name..."
                    className="text-lg"
                  />
                </div>

                {/* Canvas */}
                <div>
                  <div
                    onClick={handleAddKiss}
                    className="relative aspect-video rounded-2xl bg-gradient-to-br from-rose-100 to-pink-100 border cursor-pointer overflow-hidden"
                  >
                    {kisses.map((kiss, i) => (
                      <motion.div
                        key={i}
                        className="absolute"
                        style={{
                          left: `${kiss.x}%`,
                          top: `${kiss.y}%`,
                          transform: "translate(-50%, -50%)",
                        }}
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={{ scale: 1, opacity: 0.9 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Image
                          src={KISS_IMAGE}
                          alt="Kiss"
                          width={72}
                          height={52}
                          style={{
                            transform: `rotate(${kiss.rotation}deg) scale(${kiss.scale})`,
                            mixBlendMode: "multiply",
                            pointerEvents: "none",
                          }}
                        />
                      </motion.div>
                    ))}

                    {kisses.length === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center text-primary/60 text-lg">
                        Tap anywhere to leave a kiss
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                    <span>
                      {kisses.length} / {MAX_KISSES} kisses
                    </span>
                    {kisses.length > 0 && (
                      <button
                        onClick={clearKisses}
                        className="flex items-center gap-1 text-primary"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Clear all
                      </button>
                    )}
                  </div>
                </div>

                <Button
                  onClick={handleCreate}
                  disabled={!recipientName || !senderName || kisses.length === 0 || loading}
                  className="w-full py-6 text-lg"
                >
                  Create Kiss Card
                </Button>
              </motion.div>
            )}

            {/* ================= PREVIEW ================= */}
            {step === "preview" && (
              <motion.div
                key="preview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <h2 className="text-2xl md:text-3xl font-light mb-2">
                    For{" "}
                    <span className="italic text-primary">
                      {recipientName}
                    </span>
                  </h2>
                  <p className="text-muted-foreground">
                    From {senderName} · {kisses.length} kisses
                  </p>
                </div>

                <div className="relative aspect-video rounded-2xl bg-gradient-to-br from-rose-100 to-pink-100 border overflow-hidden">
                  {kisses.map((kiss, i) => (
                    <motion.div
                      key={i}
                      className="absolute"
                      style={{
                        left: `${kiss.x}%`,
                        top: `${kiss.y}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.9 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Image
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
                    <div className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full">
                      xoxo, with love
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" onClick={handleReset} className="flex-1">
                    Start Over
                  </Button>
                  <Button onClick={handleShare} className="flex-1">
                    <Share2 className="w-5 h-5 mr-2" />
                    Share
                  </Button>
                </div>
              </motion.div>
            )}

            {/* ================= SHARE ================= */}
            {step === "share" && (
              <motion.div
                key="share"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8 text-center"
              >
                <Heart className="w-16 h-16 mx-auto text-primary fill-primary" />
                <h2 className="text-2xl font-light">
                  Kisses <span className="italic text-primary">Sent!</span>
                </h2>

                <p className="font-mono break-all text-sm bg-secondary p-3 rounded-lg">
                  {`${process.env.NEXT_PUBLIC_APP_URL}/free-gifts/kisses/${shareToken}`}
                </p>

                <Button variant="outline" onClick={handleReset}>
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
