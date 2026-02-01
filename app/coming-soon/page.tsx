"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

export default function CreateComingSoonPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 text-center bg-gradient-to-b from-background to-muted/40">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-xl space-y-6"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="flex justify-center"
        >
          <Heart className="h-14 w-14 text-primary fill-primary" />
        </motion.div>

        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
          Create Experience
        </h1>

        <p className="text-lg text-muted-foreground">
          Something magical is being crafted behind the scenes ✨  
          Your personalized memory experience builder is coming soon.
        </p>

        <div className="pt-4">
          <Link href="/">
            <Button size="lg" className="text-lg px-8">
              Back to Home
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
