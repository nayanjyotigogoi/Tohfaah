"use client";

import { motion } from "framer-motion";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { FloatingElements } from "@/components/floating-elements";
import { Heart, Sparkles, Users, Globe } from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "Love First",
    description:
      "Every feature, every animation, every interaction is designed with love at its core. We believe in making digital experiences feel warm and human.",
  },
  {
    icon: Sparkles,
    title: "Magic in Details",
    description:
      "The small moments matter most. We obsess over the perfect animation timing, the right color of pink, the perfect pause before a reveal.",
  },
  {
    icon: Users,
    title: "Connection",
    description:
      "Technology should bring people closer, not further apart. Tohfaah bridges distances with emotional experiences that transcend screens.",
  },
  {
    icon: Globe,
    title: "Universal Language",
    description:
      "Love needs no translation. Our experiences speak to the heart directly, crossing cultures and languages.",
  },
];

const stats = [
  { value: "10K+", label: "Experiences Created" },
  { value: "5+", label: "Countries Reached" },
  { value: "99.9%", label: "Said Yes to Proposals" },
  { value: "20K+", label: "Hearts Touched" },
];

export default function AboutPage() {
  return (
    <main className="relative min-h-screen bg-background">
      <FloatingElements density="low" />
      <Navigation />

      {/* Hero */}
      <section className="pt-32 pb-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/50 to-background" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Heart className="w-10 h-10 text-primary fill-primary" />
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-light text-foreground mb-6">
              About <span className="italic text-primary">Tohfaah</span>
            </h1>
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto leading-relaxed">
              We believe gifts should be experiences, not just objects. 
              Tohfaah was born from the simple idea that love deserves 
              to be expressed in extraordinary ways.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="prose prose-lg max-w-none"
          >
            <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-3xl p-8 md:p-12">
              <h2 className="text-3xl font-light text-foreground mb-6">
                Our <span className="italic text-primary">Story</span>
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Tohfaah started with a long-distance relationship and a simple question: 
                  How do you make someone feel loved when you can&apos;t be there in person?
                </p>
                <p>
                  Traditional gifts felt empty. Text messages felt inadequate. 
                  Video calls, while precious, couldn&apos;t capture the magic of surprise, 
                  the joy of unwrapping, the emotion of discovery.
                </p>
                <p>
                  So we built something different. A place where feelings become 
                  experiences. Where distance dissolves in a cascade of butterflies. 
                  Where &ldquo;I love you&rdquo; unfolds like a story, one beautiful moment at a time.
                </p>
                <p className="text-foreground font-medium">
                  Today, Tohfaah helps thousands of people across the world share their 
                  hearts in ways that weren&apos;t possible before. And we&apos;re just getting started.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gradient-to-b from-background via-secondary/30 to-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-light text-foreground">
              What We <span className="italic text-primary">Believe</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card border border-border rounded-2xl p-8"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-rose-950 to-pink-950 rounded-3xl p-8 md:p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <p className="text-4xl md:text-5xl font-light text-white mb-2">
                    {stat.value}
                  </p>
                  <p className="text-rose-200 text-sm">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-light text-foreground mb-6">
              Ready to create <span className="italic text-primary">magic</span>?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Join thousands of people sharing love in extraordinary ways.
            </p>
            <a
              href="/coming-soon"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full text-lg font-medium hover:bg-primary/90 transition-colors"
            >
              <Sparkles className="w-5 h-5" />
              Start Creating
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
