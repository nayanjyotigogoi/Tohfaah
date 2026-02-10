"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Instagram, MessageSquare } from "lucide-react";

export default function FeedbackProvider() {
  const [showModal, setShowModal] = useState(false);
  const [showButton, setShowButton] = useState(true);
  const orbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowModal(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!orbRef.current) return;
    const rect = orbRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    orbRef.current.style.transform = `translate(${x * 0.08}px, ${
      y * 0.08
    }px)`;
  };

  const resetPosition = () => {
    if (orbRef.current) {
      orbRef.current.style.transform = "translate(0px, 0px)";
    }
  };

  return (
    <>
      {/* Floating Giveaway Orb */}
      <AnimatePresence>
        {showButton && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-5 right-5 sm:bottom-8 sm:right-8 z-50"
          >
            <div className="relative flex items-center gap-3">
              <button
                onClick={() => setShowButton(false)}
                className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-md 
                shadow-md border border-white/40 flex items-center 
                justify-center text-gray-500 hover:bg-white transition"
              >
                ✕
              </button>

              <motion.div
                ref={orbRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={resetPosition}
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow: [
                    "0 0 0px rgba(244,63,94,0.3)",
                    "0 0 25px rgba(244,63,94,0.6)",
                    "0 0 0px rgba(244,63,94,0.3)",
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative h-14 w-14 rounded-full bg-white/40 
                backdrop-blur-2xl border border-white/50 shadow-xl 
                flex items-center justify-center cursor-pointer"
                onClick={() => setShowModal(true)}
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-400/40 to-rose-400/40 blur-md" />
                <div className="relative text-rose-500 text-lg">🎁</div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-md px-4"
          >
            <motion.div
              initial={{ y: 120, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl p-6 sm:p-8"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>

              {/* Giveaway Section */}
              <p className="text-center text-xs uppercase tracking-widest text-rose-500 mb-2">
                Limited Time Giveaway
              </p>

              <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-3">
                🎁 Win a FREE Premium Gift!
              </h2>

              <p className="text-center text-rose-600 font-medium mb-4">
                Use our Free Gifts. Tag us. Get rewarded.
              </p>

              <div className="bg-gradient-to-br from-pink-50 to-rose-50 border border-rose-200 rounded-2xl p-5 mb-6 text-center shadow-sm">
                <p className="text-gray-700 text-sm leading-relaxed">
                  💌 Create a free gift  
                  <br />
                  📷 Share it on Instagram  
                  <br />
                  🏷️ Tag{" "}
                  <span className="font-semibold">@tohfaah.online</span>  
                  <br />
                  🎉 Win a FREE Premium Coupon
                </p>
              </div>

              <div className="space-y-3">
                <a
                  href="https://www.instagram.com/tohfaah.online/"
                  target="_blank"
                  onClick={() => setShowModal(false)}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl 
                  bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 
                  text-white font-semibold shadow-lg active:scale-95 transition"
                >
                  <Instagram size={18} />
                  Tag Us & Win
                </a>

                <Link
                  href="/free-gifts"
                  onClick={() => setShowModal(false)}
                  className="block w-full text-center py-3 rounded-xl 
                  border border-rose-300 text-rose-600 font-medium 
                  active:scale-95 transition"
                >
                  💝 Create Free Gift
                </Link>
              </div>

              {/* Small Feedback Section */}
              <div className="mt-8 pt-5 border-t border-gray-200">
                <p className="text-xs text-center text-gray-500 mb-3">
                  Help us improve Tohfaah 💬
                </p>

                <div className="flex gap-3">
                  <a
                    href="mailto:support@tohfaah.online"
                    className="flex-1 flex items-center justify-center gap-2 
                    text-xs py-2 rounded-lg border border-gray-300 
                    text-gray-600 hover:bg-gray-50 transition"
                  >
                    <Mail size={14} />
                    Email
                  </a>

                  <Link
                    href="/contact"
                    className="flex-1 flex items-center justify-center gap-2 
                    text-xs py-2 rounded-lg border border-gray-300 
                    text-gray-600 hover:bg-gray-50 transition"
                  >
                    <MessageSquare size={14} />
                    Contact
                  </Link>
                </div>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="mt-6 w-full text-center text-xs text-gray-400"
              >
                Maybe later
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
