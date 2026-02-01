"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Lock,
  Sparkles,
  MapPin,
  MessageSquare,
  ImageIcon,
  Ticket,
  Play,
  X,
} from "lucide-react";

const premiumFeatures = [
  { icon: MessageSquare, label: "Love Letters" },
  { icon: ImageIcon, label: "Photo Galleries" },
  { icon: MapPin, label: "Map Connections" },
  { icon: Ticket, label: "Date Proposals" },
];

export function PremiumSection() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  // 🔹 ADD ONLY: replace later with real auth (useSession / Clerk / Supabase)
  const isLoggedIn = false;

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-950 via-red-950 to-pink-950" />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-rose-300 text-lg mb-4 tracking-wide flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Premium Experience
            </p>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-6 leading-tight">
              Create a{" "}
              <span className="italic text-rose-300">complete</span>
              <br />
              love story
            </h2>

            <p className="text-rose-100/80 text-xl mb-8 leading-relaxed">
              Build an immersive journey with butterflies, heart reveals,
              memories, photo experiences, and heartfelt proposals.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-10">
              {premiumFeatures.map((feature, index) => (
                <motion.div
                  key={feature.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="flex items-center gap-3 text-rose-100"
                >
                  <feature.icon className="w-5 h-5 text-rose-300" />
                  <span>{feature.label}</span>
                </motion.div>
              ))}
            </div>

            <Link href="/coming-soon">
              <Button
                size="lg"
                className="text-lg px-8 py-6 bg-white hover:bg-rose-50 text-rose-950 shadow-xl"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Start Creating
              </Button>
            </Link>
          </motion.div>

          {/* Right Preview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex justify-center"
          >
            <div
              className="
                relative w-full
                max-w-sm
                sm:max-w-md
                lg:max-w-lg
                aspect-[3/4]
                lg:aspect-[18/14]
                rounded-3xl
                overflow-hidden
              "
            >
              {/* Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-rose-200 to-pink-300" />

              {/* Locked Preview Animation */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                  className="w-20 h-20 rounded-full bg-white/30 backdrop-blur flex items-center justify-center mb-4"
                >
                  <Lock className="w-10 h-10 text-white" />
                </motion.div>

                <p className="text-white text-center text-xl font-medium mb-1">
                  Preview Locked
                </p>
                <p className="text-white/80 text-center text-sm mb-4">
                  Create your own to see the magic unfold
                </p>

                {/* 🔹 ADD ONLY: Unlock Button */}
                <Link href={isLoggedIn ? "/premium-gift" : "/login"}>
                  <Button className="bg-white text-rose-700 hover:bg-rose-50 shadow-lg">
                    Unlock Now
                  </Button>
                </Link>
              </div>

              {/* Floating Play Button */}
              <button
                onClick={() => setIsVideoOpen(true)}
                className="
                  absolute top-4 right-4
                  w-12 h-12
                  rounded-full
                  bg-white/90
                  flex items-center justify-center
                  shadow-lg
                  hover:scale-105
                  transition
                "
              >
                <Play className="w-5 h-5 text-rose-700 ml-0.5" />
              </button>

              {/* Decorative blobs */}
              <motion.div
                className="absolute -top-6 -right-6 w-20 h-20 bg-rose-400/30 rounded-full blur-xl"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <motion.div
                className="absolute -bottom-6 -left-6 w-24 h-24 bg-pink-400/30 rounded-full blur-xl"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 5, repeat: Infinity, delay: 1 }}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {isVideoOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsVideoOpen(false)}
          >
            <motion.div
              className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsVideoOpen(false)}
                className="absolute top-4 right-4 z-10 text-white/80 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>

              <video
                src="/videos/tohfaah-preview.mp4"
                controls
                autoPlay
                className="w-full h-full object-cover"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
 