"use client";

import { ReactNode } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { motion } from "framer-motion";

interface LegalLayoutProps {
  title: string;
  children: ReactNode;
}

export default function LegalLayout({ title, children }: LegalLayoutProps) {
  return (
    <>
      {/* Navbar */}
      <Navigation />

      {/* Page body */}
      <main className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-36">
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 text-center text-4xl font-bold text-foreground"
          >
            {title}
          </motion.h1>

          {/* Soft divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.1 }}
            className="mx-auto mb-12 h-1 w-24 rounded-full bg-gradient-to-r from-pink-400 to-purple-400"
          />

          {/* Content */}
          <div className="mx-auto max-w-5xl">
            {children}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}
