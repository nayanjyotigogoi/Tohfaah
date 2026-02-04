"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, Share2, Copy } from "lucide-react";
import Image from "next/image";

type Step = "create" | "preview" | "share";

const HUG_STYLES = Array.from({ length: 10 }).map((_, i) => ({
  id: i + 1,
  src: `/hug-${i + 1}.gif`,
}));

export default function HugGiftPage() {
  const [step, setStep] = useState<Step>("create");

  const [recipientName, setRecipientName] = useState("");
  const [senderName, setSenderName] = useState("");
  const [hugStyle, setHugStyle] = useState<number>(1);

  const [isHugging, setIsHugging] = useState(false);
  const [hugCount, setHugCount] = useState(0);

  const [shareToken, setShareToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  /* =======================
     CREATE (BACKEND)
  ======================= */
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
            gift_type: "hug",
            recipient_name: recipientName,
            sender_name: senderName,
            gift_data: {
              hug_style: hugStyle,
            },
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to create hug");

      const data = await res.json();

      /* 🔥 Warm OG preview */
      fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/og/hug/${data.token}`
      ).catch(() => {});

      /* Continue UI flow */
      setShareToken(data.token);
      setStep("preview");

    } catch (e) {
      console.error(e);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* =======================
     HUG INTERACTION
  ======================= */
  const handleHug = () => {
    if (isHugging) return;
    setIsHugging(true);
    setHugCount((c) => c + 1);
    setTimeout(() => setIsHugging(false), 2000);
  };

  const handleShare = () => setStep("share");

  const handleReset = () => {
    setStep("create");
    setRecipientName("");
    setSenderName("");
    setHugStyle(1);
    setHugCount(0);
    setShareToken(null);
    setCopied(false);
  };

  /* =======================
     COPY LINK
  ======================= */
  const handleCopy = async () => {
    if (!shareToken) return;

    const url = `${process.env.NEXT_PUBLIC_APP_URL}/free-gifts/hug/${shareToken}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-background overflow-hidden">
      <Navigation />

      {/* SQUEEZE EFFECT (UNCHANGED) */}
      <AnimatePresence>
        {isHugging && (
          <>
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "-20%" }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="fixed inset-y-0 left-0 w-1/2 bg-gradient-to-r from-rose-200/80 to-transparent z-40 pointer-events-none"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: "20%" }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="fixed inset-y-0 right-0 w-1/2 bg-gradient-to-l from-rose-200/80 to-transparent z-40 pointer-events-none"
            />
          </>
        )}
      </AnimatePresence>

      <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 relative z-10">
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
                <div className="text-center">
                  <motion.div
                    className="relative w-16 h-16 rounded-full bg-primary/10 mb-4 overflow-hidden mx-auto"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Image
                      src={`/hug-${hugStyle}.gif`}
                      alt="Virtual Hug"
                      fill
                      className="object-cover"
                    />
                  </motion.div>

                  <h1 className="text-3xl md:text-4xl font-light text-foreground mb-2">
                    Virtual <span className="italic text-primary">Hug</span>
                  </h1>
                  <p className="text-muted-foreground">
                    Send a warm embrace that squeezes the screen
                  </p>
                </div>

                <div className="space-y-4">
                  <Input
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Who are you hugging?"
                    className="text-lg"
                  />
                  <Input
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="Your name"
                    className="text-lg"
                  />
                </div>

                <div className="flex justify-center gap-2 flex-wrap">
                  {HUG_STYLES.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setHugStyle(style.id)}
                      className={`relative w-10 h-10 rounded-full overflow-hidden border ${
                        hugStyle === style.id
                          ? "border-primary ring-2 ring-primary/40"
                          : "border-border"
                      }`}
                    >
                      <Image
                        src={style.src}
                        alt={`Hug style ${style.id}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>

                <div className="p-8 bg-gradient-to-br from-rose-100 to-pink-100 rounded-2xl text-center">
                  <motion.div
                    className="relative w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Image
                      src={`/hug-${hugStyle}.gif`}
                      alt="Hug preview"
                      fill
                      className="object-cover"
                    />
                  </motion.div>
                  <p className="text-lg text-foreground">
                    A virtual hug from {senderName || "someone"} to{" "}
                    {recipientName || "someone special"}
                  </p>
                </div>

                <Button
                  onClick={handleCreate}
                  disabled={!recipientName || !senderName || loading}
                  className="w-full text-lg py-6 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Create Hug
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
                  <h2 className="text-2xl md:text-3xl font-light text-foreground mb-2">
                    A hug for{" "}
                    <span className="italic text-primary">{recipientName}</span>
                  </h2>
                  <p className="text-muted-foreground">
                    From {senderName}, with love
                  </p>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                  <motion.div
                    className="relative aspect-square max-w-sm w-full"
                    animate={isHugging ? { scale: [1, 0.95, 1] } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    <button
                      onClick={handleHug}
                      disabled={isHugging}
                      className="w-full h-full rounded-full bg-gradient-to-br from-rose-200 to-pink-200 border-4 border-white shadow-xl overflow-hidden"
                    >
                      <motion.div
                        className="relative w-full h-full"
                        animate={isHugging ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                        transition={{ duration: 0.6 }}
                      >
                        <Image
                          src={`/hug-${hugStyle}.gif`}
                          alt="Send a hug"
                          fill
                          className="object-cover"
                        />
                      </motion.div>
                    </button>
                  </motion.div>

                  <div className="w-full md:max-w-[170px] backdrop-blur-md bg-white/40 border border-white/30 rounded-xl px-6 py-4 shadow-lg text-center md:text-left">
                    <p className="text-lg font-medium text-foreground">
                      {isHugging ? "Hugging you tight 🤍" : "Tap the hug"}
                    </p>
                    {hugCount > 0 && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {hugCount} hug{hugCount > 1 ? "s" : ""} received
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="flex-1 text-lg py-6 bg-transparent"
                  >
                    Start Over
                  </Button>
                  <Button
                    onClick={handleShare}
                    className="flex-1 text-lg py-6 bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
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
                <h2 className="text-2xl md:text-3xl font-light text-foreground">
                  Hug <span className="italic text-primary">Ready!</span>
                </h2>

                <div className="flex items-center gap-3">
                  <p className="flex-1 font-mono break-all text-sm bg-secondary p-3 rounded-lg">
                    {`${process.env.NEXT_PUBLIC_APP_URL}/free-gifts/hug/${shareToken}`}
                  </p>

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
                    Link copied — paste it anywhere 🤍
                  </p>
                )}

                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="text-lg px-8 py-6 bg-transparent"
                >
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
