"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Share2, Heart, Sparkles, Gift } from "lucide-react";
import Link from "next/link";

type Stage = "create" | "experience";

interface SurpriseData {
  message: string;
  recipientName: string;
  senderName: string;
}

export default function SurprisePage() {
  const [stage, setStage] = useState<Stage>("create");
  const [surpriseData, setSurpriseData] = useState<SurpriseData>({
    message: "",
    recipientName: "",
    senderName: "",
  });
  const [boxOpened, setBoxOpened] = useState(false);
  const [lidLifted, setLidLifted] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [confetti, setConfetti] = useState<{ x: number; y: number; color: string; rotation: number }[]>([]);

  const startExperience = () => {
    if (surpriseData.recipientName && surpriseData.senderName && surpriseData.message) {
      setStage("experience");
    }
  };

  const openBox = () => {
    if (!boxOpened) {
      setBoxOpened(true);
      setLidLifted(true);

      // Generate confetti
      const newConfetti = [...Array(50)].map(() => ({
        x: Math.random() * 400 - 200,
        y: -(Math.random() * 300 + 100),
        color: ["#e11d48", "#f472b6", "#fbbf24", "#a855f7", "#22c55e"][Math.floor(Math.random() * 5)],
        rotation: Math.random() * 720 - 360,
      }));
      setConfetti(newConfetti);

      setTimeout(() => setShowMessage(true), 800);
    }
  };

  const shareGift = () => {
    if (navigator.share) {
      navigator.share({
        title: "A Surprise from " + surpriseData.senderName,
        text: `${surpriseData.senderName} sent you a surprise on Tohfaah!`,
        url: window.location.href,
      });
    }
  };

  // Create Stage
  if (stage === "create") {
    return (
      <main className="relative min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50">
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
            <div className="w-20 h-20 rounded-full bg-pink-100 flex items-center justify-center mx-auto mb-6">
              <Gift className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-light text-foreground mb-3">
              Mini <span className="italic text-primary">Surprise</span>
            </h1>
            <p className="text-muted-foreground">
              A simple gift box with a sweet message inside
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-2xl p-6 shadow-lg border border-border space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Who is this surprise for?
              </label>
              <Input
                value={surpriseData.recipientName}
                onChange={(e) =>
                  setSurpriseData({ ...surpriseData, recipientName: e.target.value })
                }
                placeholder="Their name..."
                className="text-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Your name
              </label>
              <Input
                value={surpriseData.senderName}
                onChange={(e) =>
                  setSurpriseData({ ...surpriseData, senderName: e.target.value })
                }
                placeholder="Your name..."
                className="text-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Your surprise message
              </label>
              <Textarea
                value={surpriseData.message}
                onChange={(e) =>
                  setSurpriseData({ ...surpriseData, message: e.target.value })
                }
                placeholder="What surprise message would you like to share?"
                rows={4}
                className="text-lg"
              />
            </div>

            <Button
              onClick={startExperience}
              disabled={!surpriseData.recipientName || !surpriseData.senderName || !surpriseData.message}
              className="w-full py-6 text-lg bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Wrap the Gift
            </Button>
          </motion.div>
        </div>
      </main>
    );
  }

  // Experience Stage
  return (
    <main className="relative min-h-screen bg-gradient-to-br from-rose-900 via-pink-900 to-purple-900 overflow-hidden">
      {/* Background sparkles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <p className="text-rose-300 text-lg mb-2">For {surpriseData.recipientName}</p>
          <h1 className="text-3xl md:text-4xl font-light text-rose-50">
            You have a <span className="italic text-rose-300">surprise!</span>
          </h1>
        </motion.div>

        {/* Gift Box */}
        <div className="relative">
          {/* Confetti */}
          <AnimatePresence>
            {confetti.map((c, i) => (
              <motion.div
                key={i}
                className="absolute left-1/2 top-1/2 w-3 h-3 rounded-sm"
                style={{ backgroundColor: c.color }}
                initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
                animate={{
                  x: c.x,
                  y: c.y + 400,
                  rotate: c.rotation,
                  opacity: 0,
                }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            ))}
          </AnimatePresence>

          <motion.button
            onClick={openBox}
            className="relative cursor-pointer"
            whileHover={!boxOpened ? { scale: 1.05 } : {}}
            whileTap={!boxOpened ? { scale: 0.98 } : {}}
          >
            {/* Box lid */}
            <motion.div
              className="absolute -top-4 left-1/2 -translate-x-1/2 w-52 h-12 bg-gradient-to-b from-rose-400 to-rose-500 rounded-t-lg z-20 shadow-lg"
              animate={lidLifted ? { y: -80, rotateX: -30 } : {}}
              transition={{ duration: 0.5, ease: "easeOut" }}
              style={{ transformOrigin: "top center" }}
            >
              {/* Ribbon on lid */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-full bg-rose-600" />
              </div>
              {/* Bow */}
              <motion.div
                className="absolute -top-6 left-1/2 -translate-x-1/2"
                animate={lidLifted ? { scale: 1.2 } : {}}
              >
                <div className="relative">
                  <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-6 h-4 bg-rose-600 rounded-full" />
                  <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-6 h-4 bg-rose-600 rounded-full" />
                  <div className="w-4 h-4 bg-rose-700 rounded-full relative z-10" />
                </div>
              </motion.div>
            </motion.div>

            {/* Box body */}
            <div className="relative w-48 h-40 bg-gradient-to-b from-rose-500 to-rose-600 rounded-b-lg shadow-2xl">
              {/* Ribbon on body */}
              <div className="absolute left-1/2 -translate-x-1/2 w-8 h-full bg-rose-700" />

              {/* Inner glow when opened */}
              <AnimatePresence>
                {boxOpened && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-4 bg-gradient-to-t from-yellow-200 via-yellow-100 to-white rounded-lg"
                  />
                )}
              </AnimatePresence>
            </div>

            {!boxOpened && (
              <p className="text-rose-300 mt-6 text-sm">Click to open</p>
            )}
          </motion.button>
        </div>

        {/* Message */}
        <AnimatePresence>
          {showMessage && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="mt-12 text-center max-w-md"
            >
              <motion.div
                className="bg-white rounded-2xl p-8 shadow-2xl relative"
                initial={{ rotate: -2 }}
                animate={{ rotate: 2 }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
              >
                <Heart className="w-10 h-10 text-rose-500 mx-auto mb-4 fill-current" />
                <p className="text-xl text-foreground leading-relaxed font-serif">
                  {surpriseData.message}
                </p>
                <div className="mt-6 pt-4 border-t border-rose-100">
                  <p className="text-rose-500 text-sm">With love,</p>
                  <p className="text-lg font-medium text-foreground">{surpriseData.senderName}</p>
                </div>
              </motion.div>

              <div className="mt-8 flex justify-center gap-4">
                <Button
                  onClick={shareGift}
                  className="bg-rose-500 hover:bg-rose-600 text-white"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Link href="/free-gifts">
                  <Button variant="outline" className="border-rose-400 text-rose-300 hover:bg-rose-900 bg-transparent">
                    Create Another
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
