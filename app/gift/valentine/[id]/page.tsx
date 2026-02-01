"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Heart, Lock, Sparkles, MapPin, Check, X } from "lucide-react";
import ButterflyGiftReveal from "@/components/ButterflyGiftReveal";
import HeartsBedReveal from "@/components/HeartsBedReveal";

const API_BASE = process.env.NEXT_PUBLIC_API_URL!;

/* =========================================================
   TYPES
========================================================= */
type ViewStep =
  | "unlock"
  | "entry"
  | "butterflies"
  | "gift-open"
  | "hearts"
  | "message"
  | "letters"
  | "photos"
  | "conversation"
  | "map"
  | "proposal"
  | "celebration";

interface GiftResponse {
  locked: boolean;
  recipient_name: string;
  sender_name: string;
  secret_question: string | null;
  message_body: string | null;
  love_letter: { content: string[] } | null;
  memories?: string[];
  photos: string[];
  map: {
    sender_location: string;
    recipient_location: string;
  } | null;
  proposal: {
    question: string;
    response: string | null;
  } | null;
}

/* =========================================================
   PAGE
========================================================= */
export default function ValentineGiftPage() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();

  const isPreview = searchParams.get("preview") === "1";
  const token = searchParams.get("token");

  const [gift, setGift] = useState<GiftResponse | null>(null);
  const [currentStep, setCurrentStep] = useState<ViewStep>("unlock");

  const [answer, setAnswer] = useState("");
  const [showError, setShowError] = useState(false);

  const [messageIndex, setMessageIndex] = useState(0);
  const [chatIndex, setChatIndex] = useState(0);

  const [unlockToken, setUnlockToken] = useState<string | null>(null);

  /* =========================================================
     FETCH GIFT
  ========================================================= */
  async function fetchGift(passedUnlockToken?: string) {
    let url: string;

    if (isPreview) {
      url = `${API_BASE}/api/premium-gifts/${id}/preview`;
    } else {
      if (!token) {
        console.error("Missing public share token");
        return;
      }

      const u = new URL(
        `${API_BASE}/api/premium-gifts/view/${token}`
      );

      const activeUnlockToken = passedUnlockToken ?? unlockToken;
      if (activeUnlockToken) {
        u.searchParams.set("unlock_token", activeUnlockToken);
      }

      url = u.toString();
    }

const res = await fetch(url, {
  method: "GET",
  headers: {
    Accept: "application/json",
  },
  credentials: isPreview ? "include" : "omit",
});


if (!res.ok) {
  const text = await res.text();
  console.error("Failed to fetch gift", {
    status: res.status,
    url,
    body: text,
  });
  return;
}

    const data = await res.json();

    const normalizedGift: GiftResponse = {
      ...data,
      photos: data.photos ?? [],
      memories: data.memories ?? [],
    };

    setGift(normalizedGift);

    if (isPreview) {
      setCurrentStep("entry");
    } else if (!normalizedGift.locked) {
      setCurrentStep("entry");
    } else {
      setCurrentStep("unlock");
    }
  }

  useEffect(() => {
    fetchGift();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isPreview, token]);

  /* =========================================================
     UNLOCK
  ========================================================= */
  async function checkAnswer() {
    if (isPreview) {
      setCurrentStep("entry");
      return;
    }

    if (!token) return;

    const res = await fetch(
      `${API_BASE}/api/premium-gifts/${token}/verify-secret`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer }),
      }
    );

    if (!res.ok) {
      setShowError(true);
      setTimeout(() => setShowError(false), 2000);
      return;
    }

    const data = await res.json();
    setUnlockToken(data.unlock_token);
    await fetchGift(data.unlock_token);
  }

  /* =========================================================
     AUTO REVEALS
  ========================================================= */
  const messageLines =
    gift?.message_body?.split("\n").filter(Boolean) ?? [];

  useEffect(() => {
    if (currentStep === "message" && messageIndex < messageLines.length) {
      const t = setTimeout(() => setMessageIndex((i) => i + 1), 1500);
      return () => clearTimeout(t);
    }
  }, [currentStep, messageIndex, messageLines.length]);

  useEffect(() => {
    if (
      currentStep === "conversation" &&
      gift?.memories &&
      chatIndex < gift.memories.length
    ) {
      const t = setTimeout(() => setChatIndex((i) => i + 1), 1200);
      return () => clearTimeout(t);
    }
  }, [currentStep, chatIndex, gift?.memories]);

  if (!gift) return null;

  /* =========================================================
     UI (UNCHANGED)
  ========================================================= */
  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-950 via-red-950 to-pink-950 overflow-hidden">
      <AnimatePresence mode="wait">
        {/* 🔒 UNLOCK */}
        {currentStep === "unlock" && gift.locked && !isPreview && (
          <motion.div
            key="unlock"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center p-4"
          >
            <div className="max-w-md w-full text-center space-y-8">
              <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mx-auto">
                <Lock className="w-10 h-10 text-rose-300" />
              </div>

              <h1 className="text-3xl text-white">
                A gift awaits you,{" "}
                <span className="italic text-rose-300">
                  {gift.recipient_name}
                </span>
              </h1>

              <div className="p-6 bg-white/5 rounded-2xl">
                <p className="text-rose-100 mb-4">
                  {gift.secret_question}
                </p>
                <Input
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Your answer..."
                  className="text-center"
                  onKeyDown={(e) => e.key === "Enter" && checkAnswer()}
                />
                {showError && (
                  <p className="text-rose-300 text-sm mt-2">
                    That&apos;s not quite right.
                  </p>
                )}
              </div>

              <Button
                onClick={checkAnswer}
                disabled={!answer}
                className="w-full py-6"
              >
                Unlock My Gift
              </Button>
            </div>
          </motion.div>
        )}

        {/* ================= ENTRY ================= */}
        {currentStep === "entry" && (
          <motion.div
            key="entry"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center p-4"
          >
            <motion.div
              className="text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <motion.p
                className="text-2xl md:text-4xl font-light text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                See what{" "}
                <span className="italic text-rose-300">
                  {gift.sender_name}
                </span>
                <br />
                has sent you...
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
              >
                <Button
                  onClick={() => setCurrentStep("butterflies")}
                  className="mt-12 px-8 py-6 text-lg bg-white/10 hover:bg-white/20 text-white border border-white/20"
                >
                  Continue
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {/* ================= BUTTERFLIES ================= */}
        {currentStep === "butterflies" && (
          <ButterflyGiftReveal
            onComplete={() => setCurrentStep("gift-open")}
          />
        )}

        {/* ================= GIFT OPEN ================= */}
        {currentStep === "gift-open" && (
          <motion.div
            key="gift-open"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center p-4"
          >
            <motion.div
              className="text-center"
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.2, 0] }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              onAnimationComplete={() => setCurrentStep("hearts")}
            >
              <div className="w-40 h-40 bg-gradient-to-br from-rose-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl mx-auto">
                <motion.div
                  animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <Sparkles className="w-16 h-16 text-white" />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* ================= HEARTS ================= */}
        {currentStep === "hearts" && (
          <HeartsBedReveal
            onComplete={() => setCurrentStep("message")}
          />
        )}

        {/* ================= MESSAGE ================= */}
        {currentStep === "message" && (
          <motion.div
            key="message"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center p-4"
          >
            <div className="max-w-xl w-full text-center space-y-6">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-rose-300 text-lg mb-8"
              >
                Dear {gift.recipient_name},
              </motion.p>

              <div className="space-y-4">
                {messageLines.slice(0, messageIndex).map((line, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-white text-xl md:text-2xl font-light leading-relaxed"
                  >
                    {line}
                  </motion.p>
                ))}
              </div>

              {messageIndex >= messageLines.length && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  <Button
                    onClick={() => setCurrentStep("letters")}
                    className="mt-12 px-8 py-6 text-lg bg-white/10 hover:bg-white/20 text-white border border-white/20"
                  >
                    Continue
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* ================= LETTERS ================= */}
        {currentStep === "letters" && gift.love_letter && (
          <motion.div
            key="letters"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center p-4"
          >
            <div className="max-w-2xl w-full">
              <h3 className="text-center text-rose-300 text-lg mb-8">
                Little moments I cherish...
              </h3>

              <div className="grid gap-6">
                {gift.love_letter.content.map((letter, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30, rotate: -3 + i * 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.4 }}
                    className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/10"
                    style={{ transform: `rotate(${-2 + i * 2}deg)` }}
                  >
                    <p className="text-white text-lg italic">
                      &ldquo;{letter}&rdquo;
                    </p>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  delay: gift.love_letter.content.length * 0.4 + 1,
                }}
                className="text-center mt-8"
              >
                <Button
                  onClick={() => setCurrentStep("photos")}
                  className="px-8 py-6 text-lg bg-white/10 hover:bg-white/20 text-white border border-white/20"
                >
                  Continue
                </Button>

              </motion.div>
            </div>
          </motion.div>
        )}

        {/* ================= CONVERSATION ================= */}
        {currentStep === "conversation" && gift.memories && (
          <motion.div
            key="conversation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center p-4"
          >
            <div className="max-w-md w-full">
              <h3 className="text-center text-rose-300 text-lg mb-8">
                A conversation I&apos;ll never forget...
              </h3>

              <div className="space-y-3">
                {gift.memories.slice(0, chatIndex).map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex ${
                      i % 2 === 0 ? "justify-start" : "justify-end"
                    }`}
                  >
                    <div
                      className={`px-4 py-2 rounded-2xl max-w-[80%] ${
                        i % 2 === 0
                          ? "bg-white/10 text-white rounded-bl-none"
                          : "bg-rose-500 text-white rounded-br-none"
                      }`}
                    >
                      {msg}
                    </div>
                  </motion.div>
                ))}
              </div>

              {chatIndex >= gift.memories.length && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="text-center mt-8"
                >
                  <Button
                    onClick={() => setCurrentStep("map")}
                    className="px-8 py-6 text-lg bg-white/10 hover:bg-white/20 text-white border border-white/20"
                  >
                    Continue
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* ================= PHOTOS ================= */}
      {currentStep === "photos" && gift.photos.length > 0 && (
        <motion.div
          key="photos"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="min-h-screen flex items-center justify-center p-4"
        >
          <div className="max-w-4xl w-full">
            <h3 className="text-center text-rose-300 text-lg mb-8">
              Moments we&apos;ve captured together...
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {gift.photos.map((url, i) => (
                <motion.img
                  key={i}
                  src={url}
                  alt={`Memory ${i + 1}`}
                  className="rounded-xl object-cover w-full h-48 border border-white/10"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                />
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: gift.photos.length * 0.1 + 0.5 }}
              className="text-center mt-10"
              >
                <Button
                  onClick={() => {
                    setChatIndex(0);
                    setCurrentStep("conversation");
                  }}
                  className="px-8 py-6 text-lg bg-white/10 hover:bg-white/20 text-white border border-white/20"
                >
                  Continue
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}


        {/* ================= MAP ================= */}
        {currentStep === "map" && gift.map && (
          <motion.div
            key="map"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center p-4"
          >
            <div className="text-center">
              <h3 className="text-rose-300 text-lg mb-8">
                No matter the distance...
              </h3>

              <div className="flex items-center justify-center gap-8 md:gap-16">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-3">
                    <MapPin className="w-8 h-8 text-rose-300" />
                  </div>
                  <p className="text-white">
                    {gift.map.sender_location}
                  </p>
                </motion.div>

                <div className="relative w-32 md:w-48">
                  <motion.div
                    className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/20"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.6, duration: 1 }}
                    style={{ transformOrigin: "left" }}
                  />
                  <motion.div
                    className="absolute top-1/2 -translate-y-1/2"
                    initial={{ left: "0%" }}
                    animate={{ left: "100%" }}
                    transition={{
                      delay: 1,
                      duration: 2,
                      ease: "easeInOut",
                    }}
                  >
                    <Heart className="w-6 h-6 text-rose-500 fill-rose-500 -translate-x-1/2" />
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-3">
                    <MapPin className="w-8 h-8 text-rose-300" />
                  </div>
                  <p className="text-white">
                    {gift.map.recipient_location}
                  </p>
                </motion.div>
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3 }}
                className="text-white text-xl mt-8"
              >
                My heart is always with you.
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 4 }}
              >
                <Button
                  onClick={() => setCurrentStep("proposal")}
                  className="mt-8 px-8 py-6 text-lg bg-white/10 hover:bg-white/20 text-white border border-white/20"
                >
                  Continue
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* ================= PROPOSAL ================= */}
        {currentStep === "proposal" && gift.proposal && (
          <motion.div
            key="proposal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center p-4"
          >
            <motion.div
              className="max-w-md w-full"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
                <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-6 text-center">
                  <p className="text-white/80 text-sm">
                    A special invitation
                  </p>
                  <p className="text-white text-2xl font-light mt-1">
                    From {gift.sender_name}
                  </p>
                </div>

                <div className="p-8 text-center">
                  <Heart className="w-12 h-12 text-rose-500 fill-rose-500 mx-auto mb-6" />
                  <p className="text-gray-800 text-xl leading-relaxed mb-8">
                    {gift.proposal.question}
                  </p>

                  <div className="flex gap-4">
                    <Button
                      onClick={() => setCurrentStep("celebration")}
                      className="flex-1 py-6 text-lg bg-rose-500 hover:bg-rose-600 text-white"
                    >
                      <Check className="w-5 h-5 mr-2" />
                      Yes!
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 py-6 text-lg border-gray-300 text-gray-600 bg-transparent"
                      onClick={() =>
                        alert(
                          "Maybe next time... but the door is always open!"
                        )
                      }
                    >
                      <X className="w-5 h-5 mr-2" />
                      Maybe Later
                    </Button>
                  </div>
                </div>

                <div className="border-t-2 border-dashed border-gray-200 relative">
                  <div className="absolute -left-3 -top-3 w-6 h-6 rounded-full bg-rose-950" />
                  <div className="absolute -right-3 -top-3 w-6 h-6 rounded-full bg-rose-950" />
                </div>

                <div className="p-4 text-center bg-gray-50">
                  <p className="text-gray-400 text-sm">
                    Made with love on Tohfaah
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* ================= CELEBRATION ================= */}
        {currentStep === "celebration" && (
          <motion.div
            key="celebration"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
          >
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  backgroundColor: [
                    "#e11d48",
                    "#f472b6",
                    "#fda4af",
                    "#fecdd3",
                    "#fff",
                  ][i % 5],
                }}
                initial={{ x: "50vw", y: "50vh", scale: 0 }}
                animate={{
                  x: `${Math.random() * 100}vw`,
                  y: `${Math.random() * 100}vh`,
                  scale: [0, 1, 1],
                  rotate: [0, 360, 720],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.02,
                  ease: "easeOut",
                }}
              />
            ))}

            <motion.div
              className="relative z-10 text-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Heart className="w-24 h-24 text-rose-500 fill-rose-500 mx-auto mb-6" />
              </motion.div>
              <h2 className="text-4xl md:text-5xl font-light text-white mb-4">
                It&apos;s a{" "}
                <span className="italic text-rose-300">Yes!</span>
              </h2>
              <p className="text-rose-200 text-xl">
                {gift.sender_name} has been notified.
              </p>
              <p className="text-rose-200/70 mt-4">
                Thank you for experiencing this moment together.
              </p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="mt-12"
              >
                <a
                  href="/"
                  className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                >
                  <Sparkles className="w-5 h-5" />
                  Create your own experience on Tohfaah
                </a>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
