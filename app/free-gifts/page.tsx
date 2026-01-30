"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { FloatingElements } from "@/components/floating-elements";
import {
  Heart,
  Camera,
  Flower2,
  Gift,
  MessageCircleHeart,
  Hand,
  Sparkles,
  Candy,
  PartyPopper,
} from "lucide-react";

const freeGifts = [
  {
    icon: Camera,
    title: "Photograph Polaroid",
    description: "Upload a photo, add a message, and watch it reveal like a polaroid memory",
    color: "from-rose-100 to-pink-100",
    href: "/free-gifts/polaroid",
    preview: "Shake to reveal",
  },
  {
    icon: Heart,
    title: "Kisses",
    description: "Leave kiss marks across the screen for your special someone",
    color: "from-red-100 to-rose-100",
    href: "/free-gifts/kisses",
    preview: "Tap to kiss",
  },
  {
    icon: Hand,
    title: "Virtual Hug",
    description: "Send a warm, digital embrace that squeezes the screen",
    color: "from-pink-100 to-rose-50",
    href: "/free-gifts/hug",
    preview: "Feel the warmth",
  },
  {
    icon: Candy,
    title: "Chocolates",
    description: "Unwrap sweet chocolate surprises with delightful animations",
    color: "from-amber-100 to-orange-50",
    href: "/free-gifts/chocolates",
    preview: "Click to unwrap",
  },
  {
    icon: Flower2,
    title: "Flowers",
    description: "Send a beautiful bouquet with floating petals",
    color: "from-rose-100 to-pink-50",
    href: "/free-gifts/flowers",
    preview: "Watch petals fall",
  },
  {
    icon: MessageCircleHeart,
    title: "Love Letter",
    description: "Write a heartfelt letter that types out like a confession",
    color: "from-pink-100 to-red-50",
    href: "/free-gifts/letter",
    preview: "Words unfold",
  },
  {
    icon: Gift,
    title: "Mini Surprise",
    description: "A simple box to open with a sweet message inside",
    color: "from-rose-50 to-pink-100",
    href: "/free-gifts/surprise",
    preview: "Open the box",
  },
  {
    icon: PartyPopper,
    title: "Balloon Pop",
    description: "Pop colorful balloons to reveal hidden messages",
    color: "from-pink-50 to-rose-100",
    href: "/free-gifts/balloons",
    preview: "Pop to reveal",
  },
];

export default function FreeGiftsPage() {
  return (
    <main className="relative min-h-screen bg-background">
      <FloatingElements density="low" />
      <Navigation />

      {/* Hero */}
      <section className="pt-32 pb-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/50 to-background" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-primary text-lg mb-4 tracking-wide flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5" />
              Completely Free
            </p>
            <h1 className="text-4xl md:text-6xl font-light text-foreground mb-6">
              Free <span className="italic text-primary">Experiences</span>
            </h1>
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto leading-relaxed">
              Small moments of love that cost nothing but mean everything. 
              Choose an experience and share your feelings.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Grid of Free Gifts */}
      <section className="py-12 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {freeGifts.map((gift, index) => (
              <motion.div
                key={gift.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Link href={gift.href}>
                  <motion.div
                    className={`relative p-6 rounded-2xl bg-gradient-to-br ${gift.color} border border-border/50 group cursor-pointer overflow-hidden h-full`}
                    whileHover={{ scale: 1.02, y: -4 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative z-10">
                      <motion.div
                        className="w-12 h-12 rounded-xl bg-background/80 backdrop-blur flex items-center justify-center mb-4 shadow-sm"
                        whileHover={{ rotate: 12 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <gift.icon className="w-6 h-6 text-primary" />
                      </motion.div>

                      <h3 className="text-xl font-medium text-foreground mb-2">
                        {gift.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        {gift.description}
                      </p>
                      <p className="text-primary text-sm font-medium flex items-center gap-1">
                        {gift.preview}
                        <motion.span
                          animate={{ x: [0, 3, 0] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          &rarr;
                        </motion.span>
                      </p>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Upsell Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-16 p-8 md:p-12 rounded-3xl bg-gradient-to-br from-rose-950 to-pink-950 text-center"
          >
            <h3 className="text-2xl md:text-3xl font-light text-white mb-4">
              Want something <span className="italic text-rose-300">more</span>?
            </h3>
            <p className="text-rose-100/80 text-lg mb-6 max-w-2xl mx-auto">
              Create a complete love story with butterflies, photo galleries, 
              map connections, and unforgettable proposals.
            </p>
            <Link
              href="/create"
              className="inline-flex items-center gap-2 px-8 py-3 bg-white text-rose-950 rounded-full font-medium hover:bg-rose-50 transition-colors"
            >
              <Sparkles className="w-5 h-5" />
              Create Premium Experience
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
