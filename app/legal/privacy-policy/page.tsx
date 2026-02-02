"use client";

import { motion } from "framer-motion";
import { Shield, Heart, Lock, Image, Cookie, RefreshCw } from "lucide-react";
import LegalLayout from "@/components/LegalLayout";

const sections = [
  {
    icon: Shield,
    title: "Information We Collect",
    content:
      "We may collect personal details such as names or nicknames, gift content, technical data (IP address, browser type), and usage information.",
  },
  {
    icon: Heart,
    title: "How We Use Your Information",
    content:
      "Your information helps us deliver gifts, generate shareable links, improve the experience, and keep the platform safe from misuse.",
  },
  {
    icon: Lock,
    title: "Gift Content & Sharing",
    content:
      "Gifts may be shared via public or private links. Anyone with the link can view the gift. Please share responsibly — love should feel safe.",
  },
  {
    icon: Image,
    title: "Media Storage",
    content:
      "Uploaded images, videos, and GIFs are stored securely and used only to make your gifts beautiful and functional.",
  },
  {
    icon: Cookie,
    title: "Cookies & Tracking",
    content:
      "We use cookies to maintain sessions and understand usage. You can disable cookies, but some features may not work properly.",
  },
  {
    icon: RefreshCw,
    title: "Policy Updates",
    content:
      "This Privacy Policy may be updated occasionally. Any changes will always be reflected on this page.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout title="Privacy Policy">
      {/* Intro */}
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center text-muted-foreground text-lg"
      >
        Your trust means everything to us. This policy explains how we protect
        your data while helping you create meaningful gifts 💝
      </motion.p>

      {/* Pinterest-style grid */}
      <div className="grid gap-6 sm:grid-cols-2">
        {sections.map((section, index) => {
          const Icon = section.icon;
          return (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-3xl bg-white/70 backdrop-blur-xl border border-pink-100 shadow-sm hover:shadow-md transition-shadow p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100 text-pink-600">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">
                  {section.title}
                </h2>
              </div>

              <p className="text-muted-foreground leading-relaxed">
                {section.content}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Closing note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-12 text-center"
      >
        <p className="text-sm text-muted-foreground italic">
          Made with care, respect, and a lot of love — just like our gifts ✨
        </p>
      </motion.div>
    </LegalLayout>
  );
}
