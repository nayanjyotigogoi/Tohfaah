"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function FeedbackProvider() {
  const [showModal, setShowModal] = useState(false);
  const [showButton, setShowButton] = useState(true);
  const orbRef = useRef<HTMLDivElement>(null);

  // Auto show modal every refresh
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowModal(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Magnetic effect (desktop subtle)
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
      {/* Floating Glass Orb */}
      <AnimatePresence>
        {showButton && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-5 right-5 sm:bottom-8 sm:right-8 z-50"
          >
            <div className="relative flex items-center gap-3">

              {/* Temporary Remove Button */}
              <button
                onClick={() => setShowButton(false)}
                className="h-8 w-8 rounded-full 
                bg-white/80 backdrop-blur-md 
                shadow-md border border-white/40 
                flex items-center justify-center 
                text-gray-500 hover:bg-white 
                transition active:scale-95"
              >
                ✕
              </button>

              {/* Glass Orb */}
              <motion.div
                ref={orbRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={resetPosition}
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow: [
                    "0 0 0px rgba(236,72,153,0.3)",
                    "0 0 25px rgba(236,72,153,0.5)",
                    "0 0 0px rgba(236,72,153,0.3)",
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative h-14 w-14 rounded-full 
                bg-white/40 backdrop-blur-2xl 
                border border-white/50 
                shadow-xl 
                flex items-center justify-center 
                cursor-pointer"
                onClick={() => setShowModal(true)}
              >
                {/* Inner soft gradient */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-400/40 to-rose-400/40 blur-md" />

                {/* Icon */}
                <div className="relative text-lg text-rose-500">
                  💬
                </div>
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
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-md px-4"
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

              <h2 className="text-xl sm:text-2xl font-semibold text-center text-gray-800 mb-3">
                Help Us Improve ✨
              </h2>

              <p className="text-gray-600 text-sm text-center mb-6 leading-relaxed">
                How did you discover Tohfaah?
                <br />
                What could we make better for you?
              </p>

              <div className="space-y-3">
                <a
                  href="mailto:support@tohfaah.online"
                  onClick={() => setShowModal(false)}
                  className="block w-full text-center py-3 rounded-xl 
                  bg-gradient-to-r from-pink-500 to-rose-500 
                  text-white font-medium active:scale-95 transition"
                >
                  📩 Email Us
                </a>

                <Link
                  href="/contact"
                  onClick={() => setShowModal(false)}
                  className="block w-full text-center py-3 rounded-xl 
                  border border-rose-300 text-rose-500 
                  active:scale-95 transition"
                >
                  📄 Contact Page
                </Link>

                <a
                  href="https://www.instagram.com/tohfaah.online/"
                  target="_blank"
                  onClick={() => setShowModal(false)}
                  className="block w-full text-center py-3 rounded-xl 
                  bg-gradient-to-r from-purple-500 to-pink-500 
                  text-white font-medium active:scale-95 transition"
                >
                  📷 DM on Instagram
                </a>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="mt-6 w-full text-center text-sm text-gray-500"
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
