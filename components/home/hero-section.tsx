"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, Sparkles } from "lucide-react";
import { useState } from "react";

export function HeroSection() {
  const [burst, setBurst] = useState(false);

  const triggerBurst = () => {
    setBurst(true);
    setTimeout(() => setBurst(false), 500);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-pink-50 to-red-50" />

      {/* Grain */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Decorative Hearts */}
      <motion.div
        className="absolute top-24 left-12 text-primary/15"
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      >
        <Heart className="w-16 h-16 fill-current" />
      </motion.div>

      <motion.div
        className="absolute bottom-44 right-20 text-primary/10"
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      >
        <Heart className="w-20 h-20 fill-current" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <p className="text-lg md:text-xl text-muted-foreground mb-6">
            A memory experience builder
          </p>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light text-foreground mb-8 leading-tight">
            Send a{" "}
            <span className="text-primary font-medium italic">feeling</span>,
            <br />
            not just a gift.
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-14">
            Create interactive love stories that unfold like memories.
            <br className="hidden sm:block" />
            Every gift becomes a journey.
          </p>

          {/* CTA */}
      
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative">
            {/* Secondary */}
            <Link href="/free-gifts">
              <Button
                size="lg"
                className="
                  h-14 px-10
                  rounded-full
                  text-lg
                  border border-primary/30
                  bg-transparent
                  text-foreground
                  hover:bg-primary/5
                  hover:border-primary/50
                  transition-all
                "
                variant="outline"
              >
                Create Free Gift
              </Button>
            </Link>

            {/* Primary */}
            <Link href="/create" onClick={triggerBurst}>
              <motion.div
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="relative"
              >
                <Button
                  size="lg"
                  className="
                    h-14 px-10
                    rounded-full
                    text-lg
                    bg-gradient-to-r from-primary to-rose-500
                    text-white
                    shadow-lg shadow-rose-400/30
                    hover:shadow-xl
                    transition-all
                  "
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Create Custom Experience
                </Button>

                {/* Heart burst */}
                <AnimatePresence>
                  {burst &&
                    [...Array(6)].map((_, i) => (
                      <motion.span
                        key={i}
                        className="absolute left-1/2 top-1/2 text-primary"
                        initial={{ opacity: 1, scale: 0 }}
                        animate={{
                          opacity: 0,
                          scale: 1,
                          x: Math.cos((i * Math.PI) / 3) * 36,
                          y: Math.sin((i * Math.PI) / 3) * 36,
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.45, ease: "easeOut" }}
                      >
                        <Heart className="w-4 h-4 fill-current" />
                      </motion.span>
                    ))}
                </AnimatePresence>
              </motion.div>
            </Link>
          </div>

        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2.4, repeat: Infinity }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2.4, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
}
