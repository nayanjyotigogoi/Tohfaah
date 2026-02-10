"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { FloatingElements } from "@/components/floating-elements";
import {
  Heart,
  Cake,
  Sparkles,
  BookOpen,
  CalendarDays,
  Gem,
  Gift,
} from "lucide-react";

const premiumGifts = [
  {
    icon: Heart,
    title: "Valentine Experience",
    description:
      "A cinematic romantic journey with animations, puzzles and unforgettable reveals.",
    color: "from-rose-100 to-pink-100",
    href: "/premium-gifts/valentine/create",
    price: "₹299",
    originalPrice: "₹599",
    // badge: "Popular",
  },
  {
    icon: Cake,
    title: "Birthday Surprise",
    description:
      "A magical birthday celebration filled with balloons, wishes and memories.",
    color: "from-purple-100 to-pink-100",
    href: "/coming-soon",
    price: "₹199",
  },
  {
    icon: CalendarDays,
    title: "Anniversary Story",
    description:
      "Relive your journey together through milestones, photos and love letters.",
    color: "from-amber-100 to-orange-50",
    href: "/coming-soon",
    price: "₹149",
  },
  {
    icon: BookOpen,
    title: "Love Storyline",
    description:
      "Tell your love story like a movie — chapters, scenes and emotional reveals.",
    color: "from-indigo-100 to-purple-100",
    href: "/coming-soon",
    price: "₹299",
    // badge: "New",
  },
  {
    icon: Gem,
    title: "Proposal Experience",
    description:
      "Build suspense and end with the ultimate question in a beautiful reveal.",
    color: "from-rose-100 to-red-100",
    href: "/coming-soon",
    price: "₹199",
  },
  {
    icon: Gift,
    title: "Custom Love Journey",
    description:
      "Design your own premium experience with complete creative control.",
    color: "from-pink-100 to-rose-50",
    href: "/coming-soon",
    price: "₹699",
  },
];

export default function PremiumGiftsPage() {
  return (
    <main className="relative min-h-screen bg-background">
      <FloatingElements density="low" />
      <Navigation />

      {/* Hero */}
      <section className="pt-32 pb-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/50 to-background" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-primary text-lg mb-4 flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5" />
              Premium Experiences
            </p>

            <h1 className="text-4xl md:text-6xl font-light text-foreground mb-6">
              Elevated <span className="italic text-primary">Experiences</span>
            </h1>

            <p className="text-muted-foreground text-xl max-w-2xl mx-auto leading-relaxed">
              Deeper stories, richer animations and unforgettable moments —
              crafted for your most special occasions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-12 pb-32">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {premiumGifts.map((gift, index) => (
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
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Price Badge */}
                    <div className="absolute top-4 right-4 bg-background/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-primary shadow-sm">
                      {gift.originalPrice && (
                        <span className="line-through text-muted-foreground mr-1">
                          {gift.originalPrice}
                        </span>
                      )}
                      {gift.price}
                    </div>
                    <div className="relative z-10">
                      <motion.div
                        className="w-12 h-12 rounded-xl bg-background/80 backdrop-blur flex items-center justify-center mb-4 shadow-sm"
                        whileHover={{ rotate: 12 }}
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
                        Start Experience →
                      </p>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
