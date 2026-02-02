"use client";

import { motion } from "framer-motion";
import {
  CheckCircle,
  ShieldAlert,
  Image,
  Gift,
  UserCog,
  AlertTriangle,
  Ban,
  Scale,
} from "lucide-react";
import LegalLayout from "@/components/LegalLayout";

const sections = [
  {
    icon: CheckCircle,
    title: "Acceptance of Terms",
    content:
      "By accessing or using Tohfaah, you agree to follow these terms and use the platform responsibly.",
  },
  {
    icon: ShieldAlert,
    title: "Platform Usage",
    content:
      "Please do not upload illegal, abusive, or harmful content, or attempt to misuse or disrupt the platform.",
  },
  {
    icon: Image,
    title: "User-Generated Content",
    content:
      "You retain ownership of the content you create. By sharing it, you allow us to display and distribute it as part of the service.",
  },
  {
    icon: Gift,
    title: "Free & Premium Gifts",
    content:
      "Some experiences are free, others premium. Availability, pricing, and content may change at any time.",
  },
  {
    icon: UserCog,
    title: "Admin Rights",
    content:
      "To keep Tohfaah safe and joyful, administrators may modify gifts, moderate content, or restrict access when necessary.",
  },
  {
    icon: AlertTriangle,
    title: "Disclaimer",
    content:
      "Tohfaah is provided “as is”. We don’t guarantee uninterrupted service or permanent availability of content.",
  },
  {
    icon: Ban,
    title: "Limitation of Liability",
    content:
      "We are not responsible for data loss, misuse of shared links, or indirect or emotional damages.",
  },
  {
    icon: Scale,
    title: "Governing Law",
    content:
      "These terms are governed by the laws of India, ensuring fair and lawful use of the platform.",
  },
];

export default function TermsOfServicePage() {
  return (
    <LegalLayout title="Terms of Service">
      {/* Intro */}
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center text-muted-foreground text-lg"
      >
        These terms help keep Tohfaah safe, respectful, and joyful for everyone
        who shares a gift here 💝
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
          Kindness, respect, and love make every gift more meaningful ✨
        </p>
      </motion.div>
    </LegalLayout>
  );
}
