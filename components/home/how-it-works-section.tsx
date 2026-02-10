"use client";

import { motion } from "framer-motion";
import { PenLine, Wand2, Share2 } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: PenLine,
    title: "Pour your heart",
    description:
      "Fill out a simple form with your special memories, inside jokes and future dreams. We'll weave them into a magical experience that's uniquely yours.",
  },
  {
    number: "02",
    icon: Wand2,
    title: "Watch it come alive",
    description:
      "Our magic transforms your inputs into a beautiful, personalized experience filled with animations, puzzles and unforgettable reveals.",
  },
  {
    number: "03",
    icon: Share2,
    title: "Share the magic",
    description:
      "Send your experience to your loved one. Watch their joy as they explore the memories and surprises you created together.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <p className="text-primary text-lg mb-4 tracking-wide">Simple & magical</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-foreground">
            How it <span className="italic text-primary">works</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="relative"
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-1/2 w-full h-px bg-gradient-to-r from-primary/30 to-transparent" />
              )}

              <div className="relative text-center">
                {/* Number Badge */}
                <motion.div
                  className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-secondary to-muted mb-8 relative"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <span className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                    {step.number}
                  </span>
                  <step.icon className="w-12 h-12 text-primary" />
                </motion.div>

                <h3 className="text-2xl md:text-3xl font-medium text-foreground mb-4">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed max-w-sm mx-auto">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
