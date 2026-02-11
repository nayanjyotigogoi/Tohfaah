"use client";

import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import { Heart, Camera, Flower2, Gift, MessageCircleHeart, Hand, CalendarHeart } from "lucide-react";


const freeGifts = [
  {
    icon: Camera,
    title: "Photograph Polaroid",
    description: "Share a moment with a gentle shake and reveal",
    color: "from-rose-100 to-pink-100",
    href: "/free-gifts/polaroid",
  },
  {
    icon: Heart,
    title: "Kisses",
    description: "Leave kiss marks across the screen",
    color: "from-red-100 to-rose-100",
    href: "/free-gifts/kisses",
  },
  {
    icon: Hand,
    title: "Virtual Hug",
    description: "Feel the warmth of a digital embrace",
    color: "from-pink-100 to-rose-50",
    href: "/free-gifts/hug",
  },
  {
    icon: Gift,
    title: "Chocolates",
    description: "Unwrap sweet surprises one by one",
    color: "from-amber-100 to-orange-50",
    href: "/free-gifts/chocolates",
  },
  {
    icon: Flower2,
    title: "Flowers",
    description: "Send a bouquet with floating petals",
    color: "from-rose-100 to-pink-50",
    href: "/free-gifts/flowers",
  },
  {
  icon: CalendarHeart,
  title: "Create Reminder",
  description: "A shared moment that counts to a special day",
  color: "from-pink-100 to-rose-50",
  href: "/free-gifts/surprise",
}

];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {

  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0, 0, 0.2, 1],
    },
  },
};

export function FreeGiftsSection() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/30 to-background" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-primary text-lg mb-4 tracking-wide">Start with something beautiful</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-foreground mb-6">
            Free <span className="italic text-primary">Experiences</span>
          </h2>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
            Small gestures that carry big emotions. Perfect for saying what words cannot.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {freeGifts.map((gift) => (
            <motion.div key={gift.title} variants={itemVariants}>
              <Link href={gift.href}>
                <motion.div
                  className={`relative p-8 rounded-2xl bg-gradient-to-br ${gift.color} border border-border/50 group cursor-pointer overflow-hidden`}
                  whileHover={{ scale: 1.02, y: -4 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10">
                    <motion.div
                      className="w-14 h-14 rounded-xl bg-background/80 backdrop-blur flex items-center justify-center mb-6 shadow-sm"
                      whileHover={{ rotate: 12 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <gift.icon className="w-7 h-7 text-primary" />
                    </motion.div>
                    
                    <h3 className="text-2xl font-medium text-foreground mb-2">
                      {gift.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {gift.description}
                    </p>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-center mt-12"
        >
          <Link
            href="/free-gifts"
            className="inline-flex items-center text-primary hover:text-primary/80 text-lg font-medium transition-colors"
          >
            Explore all free experiences
            <motion.span
              className="ml-2"
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              &rarr;
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
