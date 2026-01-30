"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Heart, Lock, Sparkles, MapPin, Check, X } from "lucide-react";
import ButterflyGiftReveal from "@/components/ButterflyGiftReveal";
import HeartsBedReveal from "@/components/HeartsBedReveal";

type ViewStep =
  | "unlock"
  | "entry"
  | "butterflies"
  | "gift-open"
  | "hearts"
  | "message"
  | "letters"
  | "conversation"
  | "map"
  | "proposal"
  | "celebration";

// Mock gift data
const mockGift = {
  recipientName: "Sarah",
  senderName: "Alex",
  secretQuestion: "Where did we first meet?",
  secretAnswer: "coffee shop",
  mainMessage: `Every moment with you feels like magic.

From the first time I saw your smile,
I knew something special had begun.

You make my world brighter,
my heart fuller,
my life more meaningful.

This is just my way of saying...
I love you, endlessly.`,
  loveLetters: [
    "Remember that night under the stars? I still think about it every day.",
    "Your laugh is my favorite sound in the entire world.",
    "Thank you for being my person.",
  ],
  conversationMessages: [
    "Hey, are you free tonight?",
    "Always free for you :)",
    "I have something special planned",
    "Oh? What is it?",
    "You'll have to wait and see...",
    "I can't wait!",
  ],
  mapLocations: { from: "New York", to: "Los Angeles" },
  proposalQuestion: "Will you go on a special date with me this Saturday?",
};

export default function GiftViewerPage() {
  const [currentStep, setCurrentStep] = useState<ViewStep>("unlock");
  const [answer, setAnswer] = useState("");
  const [showError, setShowError] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [letterIndex, setLetterIndex] = useState(0);
  const [chatIndex, setChatIndex] = useState(0);

  const messageLines = mockGift.mainMessage.split("\n").filter(Boolean);

  const checkAnswer = () => {
    if (answer.toLowerCase().trim() === mockGift.secretAnswer.toLowerCase()) {
      setCurrentStep("entry");
    } else {
      setShowError(true);
      setTimeout(() => setShowError(false), 2000);
    }
  };

  const goToNext = (nextStep: ViewStep) => {
    setCurrentStep(nextStep);
  };

  // Auto-advance message reveal
  useEffect(() => {
    if (currentStep === "message" && messageIndex < messageLines.length) {
      const timer = setTimeout(() => {
        setMessageIndex((prev) => prev + 1);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [currentStep, messageIndex, messageLines.length]);

  // Auto-advance conversation
  useEffect(() => {
    if (
      currentStep === "conversation" &&
      chatIndex < mockGift.conversationMessages.length
    ) {
      const timer = setTimeout(() => {
        setChatIndex((prev) => prev + 1);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [currentStep, chatIndex]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-950 via-red-950 to-pink-950 overflow-hidden">
      <AnimatePresence mode="wait">
        {/* Unlock Step */}
        {currentStep === "unlock" && (
          <motion.div
            key="unlock"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center p-4"
          >
            <div className="max-w-md w-full text-center space-y-8">
              <motion.div
                className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mx-auto"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Lock className="w-10 h-10 text-rose-300" />
              </motion.div>

              <div>
                <h1 className="text-3xl md:text-4xl font-light text-white mb-2">
                  A gift awaits you, <span className="italic text-rose-300">{mockGift.recipientName}</span>
                </h1>
                <p className="text-rose-200/70">
                  From {mockGift.senderName}, with love
                </p>
              </div>

              <div className="p-6 bg-white/5 backdrop-blur-sm rounded-2xl">
                <p className="text-rose-100 mb-4">{mockGift.secretQuestion}</p>
                <Input
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Your answer..."
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 text-center text-lg"
                  onKeyDown={(e) => e.key === "Enter" && checkAnswer()}
                />
                {showError && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-rose-300 text-sm mt-2"
                  >
                    That&apos;s not quite right. Try again.
                  </motion.p>
                )}
              </div>

              <Button
                onClick={checkAnswer}
                disabled={!answer}
                className="w-full py-6 text-lg bg-white hover:bg-rose-50 text-rose-950"
              >
                Unlock My Gift
              </Button>
            </div>
          </motion.div>
        )}

        {/* Entry Screen */}
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
                <span className="italic text-rose-300">{mockGift.senderName}</span>
                <br />
                has sent you...
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
              >
                <Button
                  onClick={() => goToNext("butterflies")}
                  className="mt-12 px-8 py-6 text-lg bg-white/10 hover:bg-white/20 text-white border border-white/20"
                >
                  Continue
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {/* Butterflies Animation - Cinematic Gift Delivery */}
        {currentStep === "butterflies" && (
          <ButterflyGiftReveal onComplete={() => goToNext("gift-open")} />
        )}

        {/* Gift Opening */}
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
              onAnimationComplete={() => goToNext("hearts")}
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

        {/* Hearts Bed Reveal - Cinematic Emotional Moment */}
        {currentStep === "hearts" && (
          <HeartsBedReveal onComplete={() => goToNext("message")} />
        )}

        {/* Message Reveal */}
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
                Dear {mockGift.recipientName},
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
                    onClick={() => {
                      setLetterIndex(0);
                      goToNext("letters");
                    }}
                    className="mt-12 px-8 py-6 text-lg bg-white/10 hover:bg-white/20 text-white border border-white/20"
                  >
                    Continue
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* Love Letters */}
        {currentStep === "letters" && (
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
                {mockGift.loveLetters.map((letter, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30, rotate: -3 + i * 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.4 }}
                    className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/10"
                    style={{ transform: `rotate(${-2 + i * 2}deg)` }}
                  >
                    <p className="text-white text-lg italic">&ldquo;{letter}&rdquo;</p>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: mockGift.loveLetters.length * 0.4 + 1 }}
                className="text-center mt-8"
              >
                <Button
                  onClick={() => {
                    setChatIndex(0);
                    goToNext("conversation");
                  }}
                  className="px-8 py-6 text-lg bg-white/10 hover:bg-white/20 text-white border border-white/20"
                >
                  Continue
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Conversation */}
        {currentStep === "conversation" && (
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
                {mockGift.conversationMessages.slice(0, chatIndex).map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}
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

              {chatIndex >= mockGift.conversationMessages.length && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="text-center mt-8"
                >
                  <Button
                    onClick={() => goToNext("map")}
                    className="px-8 py-6 text-lg bg-white/10 hover:bg-white/20 text-white border border-white/20"
                  >
                    Continue
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* Map Connection */}
        {currentStep === "map" && (
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
                  <p className="text-white">{mockGift.mapLocations.from}</p>
                </motion.div>

                {/* Animated path */}
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
                  <p className="text-white">{mockGift.mapLocations.to}</p>
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
                  onClick={() => goToNext("proposal")}
                  className="mt-8 px-8 py-6 text-lg bg-white/10 hover:bg-white/20 text-white border border-white/20"
                >
                  Continue
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Proposal */}
        {currentStep === "proposal" && (
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
              {/* Ticket Style Card */}
              <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
                {/* Ticket Header */}
                <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-6 text-center">
                  <p className="text-white/80 text-sm">A special invitation</p>
                  <p className="text-white text-2xl font-light mt-1">
                    From {mockGift.senderName}
                  </p>
                </div>

                {/* Ticket Body */}
                <div className="p-8 text-center">
                  <Heart className="w-12 h-12 text-rose-500 fill-rose-500 mx-auto mb-6" />
                  <p className="text-gray-800 text-xl leading-relaxed mb-8">
                    {mockGift.proposalQuestion}
                  </p>

                  <div className="flex gap-4">
                    <Button
                      onClick={() => goToNext("celebration")}
                      className="flex-1 py-6 text-lg bg-rose-500 hover:bg-rose-600 text-white"
                    >
                      <Check className="w-5 h-5 mr-2" />
                      Yes!
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 py-6 text-lg border-gray-300 text-gray-600 bg-transparent"
                      onClick={() => alert("Maybe next time... but the door is always open!")}
                    >
                      <X className="w-5 h-5 mr-2" />
                      Maybe Later
                    </Button>
                  </div>
                </div>

                {/* Ticket Tear Line */}
                <div className="border-t-2 border-dashed border-gray-200 relative">
                  <div className="absolute -left-3 -top-3 w-6 h-6 rounded-full bg-rose-950" />
                  <div className="absolute -right-3 -top-3 w-6 h-6 rounded-full bg-rose-950" />
                </div>

                {/* Ticket Footer */}
                <div className="p-4 text-center bg-gray-50">
                  <p className="text-gray-400 text-sm">Made with love on Tohfaah</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Celebration */}
        {currentStep === "celebration" && (
          <motion.div
            key="celebration"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
          >
            {/* Confetti */}
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  backgroundColor: ["#e11d48", "#f472b6", "#fda4af", "#fecdd3", "#fff"][
                    i % 5
                  ],
                }}
                initial={{
                  x: "50vw",
                  y: "50vh",
                  scale: 0,
                }}
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
                It&apos;s a <span className="italic text-rose-300">Yes!</span>
              </h2>
              <p className="text-rose-200 text-xl">
                {mockGift.senderName} has been notified. 
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
