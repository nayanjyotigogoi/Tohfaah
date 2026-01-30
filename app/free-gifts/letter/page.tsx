"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Share2, Heart, Sparkles, Send } from "lucide-react";
import Link from "next/link";

type Stage = "create" | "experience";

export default function LoveLetterPage() {
  const [stage, setStage] = useState<Stage>("create");

  const [recipientName, setRecipientName] = useState("");
  const [senderName, setSenderName] = useState("");
  const [content, setContent] = useState("");

  const [shareToken, setShareToken] = useState<string | null>(null);

  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showEnvelope, setShowEnvelope] = useState(true);
  const [envelopeOpened, setEnvelopeOpened] = useState(false);

  /* ================= CREATE (DB) ================= */
  const startExperience = async () => {
    if (!recipientName || !senderName || !content) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/free-gifts`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            gift_type: "letter",
            recipient_name: recipientName,
            sender_name: senderName,
            gift_data: { content },
          }),
        }
      );

      if (!res.ok) throw new Error();

      const data = await res.json();
      setShareToken(data.token);
      setStage("experience");
    } catch {
      alert("Failed to create letter. Please try again.");
    }
  };

  /* ================= ENVELOPE ================= */
  const openEnvelope = () => {
    setEnvelopeOpened(true);
    setTimeout(() => {
      setShowEnvelope(false);
      setIsTyping(true);
    }, 1500);
  };

  /* ================= TYPE EFFECT ================= */
  useEffect(() => {
    if (isTyping && displayedText.length < content.length) {
      const t = setTimeout(() => {
        setDisplayedText(content.slice(0, displayedText.length + 1));
      }, 50);
      return () => clearTimeout(t);
    }
    if (displayedText.length >= content.length) {
      setIsTyping(false);
    }
  }, [isTyping, displayedText, content]);

  const shareGift = () => {
    if (!shareToken) return;
    const url = `${process.env.NEXT_PUBLIC_APP_URL}/free-gifts/letter/${shareToken}`;

    if (navigator.share) {
      navigator.share({
        title: "A Love Letter",
        text: `${senderName} wrote you a love letter 💌`,
        url,
      });
    }
  };

  /* ================= CREATE STAGE ================= */
  if (stage === "create") {
    return (
      <main className="relative min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-red-50">
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
            <div className="w-20 h-20 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-6">
              <Send className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-light mb-3">
              Love <span className="italic text-primary">Letter</span>
            </h1>
            <p className="text-muted-foreground">
              Write a heartfelt letter that types out word by word
            </p>
          </motion.div>

          <div className="bg-card rounded-2xl p-6 shadow-lg border space-y-6">
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
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              className="text-lg font-serif"
              placeholder="Dear love..."
            />

            <Button
              onClick={startExperience}
              disabled={!recipientName || !senderName || !content}
              className="w-full py-6 text-lg"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Seal the Letter
            </Button>
          </div>
        </div>
      </main>
    );
  }

  /* ================= EXPERIENCE STAGE ================= */
  return (
    <main className="relative min-h-screen bg-gradient-to-br from-rose-100 via-pink-100 to-red-100 overflow-hidden">
      {/* Floating hearts */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-rose-300"
            initial={{
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 50,
              rotate: Math.random() * 360,
              scale: 0.5 + Math.random() * 0.5,
            }}
            animate={{ y: -100, rotate: Math.random() * 360 }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear",
            }}
          >
            <Heart className="w-6 h-6 fill-current" />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        {/* ENVELOPE */}
        <AnimatePresence>
          {showEnvelope && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, y: -50 }}
              className="text-center"
            >
              <p className="text-rose-600 text-lg mb-6">
                A letter for {recipientName}
              </p>

              <motion.button
                onClick={openEnvelope}
                className="relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Envelope body */}
                <div className="w-64 h-44 bg-gradient-to-b from-rose-200 to-rose-300 rounded-lg shadow-xl relative overflow-hidden">
                  {/* Flap */}
                  <motion.div
                    className="absolute top-0 left-0 right-0 h-24 origin-top"
                    animate={envelopeOpened ? { rotateX: 180 } : {}}
                    transition={{ duration: 0.8 }}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <div
                      className="absolute inset-0 bg-gradient-to-b from-rose-400 to-rose-300"
                      style={{ clipPath: "polygon(0 0, 50% 100%, 100% 0)" }}
                    />
                  </motion.div>

                  {/* Seal */}
                  <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-rose-500 rounded-full flex items-center justify-center shadow-lg z-10"
                    animate={envelopeOpened ? { scale: 0, opacity: 0 } : {}}
                  >
                    <Heart className="w-6 h-6 text-white fill-current" />
                  </motion.div>

                  <div className="absolute bottom-0 left-4 right-4 h-32 bg-white rounded-t-sm" />
                </div>

                <p className="text-rose-500 mt-4 text-sm">Click to open</p>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* LETTER */}
        <AnimatePresence>
          {!showEnvelope && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl w-full"
            >
              <div
                className="bg-white rounded-lg shadow-2xl p-8 md:p-12"
                style={{
                  backgroundImage: `
                    repeating-linear-gradient(
                      transparent,
                      transparent 31px,
                      #f0f0f0 31px,
                      #f0f0f0 32px
                    )
                  `,
                  backgroundPosition: "0 60px",
                }}
              >
                <div className="font-serif text-xl leading-loose whitespace-pre-wrap min-h-[200px]">
                  {displayedText}
                  {isTyping && (
                    <motion.span
                      className="inline-block w-0.5 h-6 bg-rose-500 ml-1"
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    />
                  )}
                </div>

                {!isTyping && (
                  <div className="mt-8 pt-4 border-t border-rose-200 text-right">
                    <p className="text-rose-500 italic">With love,</p>
                    <p className="text-2xl font-serif mt-2">{senderName}</p>
                  </div>
                )}
              </div>

              {!isTyping && (
                <div className="mt-8 flex justify-center gap-4">
                  <Button
                    onClick={shareGift}
                    className="bg-rose-500 hover:bg-rose-600 text-white"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Letter
                  </Button>
                  <Link href="/free-gifts">
                    <Button variant="outline">Create Another</Button>
                  </Link>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
