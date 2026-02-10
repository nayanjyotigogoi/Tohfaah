"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Instagram } from "lucide-react";

const footerLinks = {
  experience: [
    { id: "free-gifts", label: "Free Gifts", href: "/free-gifts" },
    {
      id: "premium-experiences",
      label: "Premium Experiences",
      href: "/premium-gifts",
    },
    { id: "shop", label: "Shop", href: "/coming-soon" },
  ],
  company: [
    { id: "about", label: "About Us", href: "/about" },
    { id: "contact", label: "Contact", href: "/contact" },
  ],
  legal: [
    {
      id: "privacy",
      label: "Privacy Policy",
      href: "/legal/privacy-policy",
    },
    {
      id: "terms",
      label: "Terms of Service",
      href: "/legal/terms-of-service",
    },
  ],
};

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-background to-secondary/30 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Heart className="h-6 w-6 text-primary fill-primary" />
              <span className="text-xl font-semibold text-foreground">
                Tohfaah
              </span>
            </Link>
            <p className="text-muted-foreground leading-relaxed">
              Where feelings become experiences, and gifts become memories.
            </p>
          </div>

          {/* Experience */}
          <div>
            <h4 className="text-foreground font-medium mb-4">Experience</h4>
            <ul className="space-y-3">
              {footerLinks.experience.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-foreground font-medium mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-foreground font-medium mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    rel="nofollow noopener"
                    aria-label={link.label}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-muted-foreground text-sm flex flex-col sm:flex-row gap-2 items-center">
            <span>
              &copy; {new Date().getFullYear()} Tohfaah. Made with{" "}
              <motion.span
                className="inline-block text-primary"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Heart className="w-4 h-4 inline fill-current" />
              </motion.span>
            </span>

            <span className="hidden sm:inline">•</span>

            <span>
              Built by{" "}
              <a
                href="https://www.anvayasolution.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:underline"
              >
                Anvaya Solution
              </a>
            </span>
          </div>

          {/* Quote + Social */}
          <div className="flex items-center gap-4">
            <p className="text-muted-foreground text-sm italic text-center">
              &ldquo;Every gift tells a story. Make yours unforgettable.&rdquo;
            </p>

            {/* Instagram */}
            <motion.a
              href="https://www.instagram.com/tohfaah.online/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Tohfaah on Instagram"
              whileHover={{ scale: 1.15 }}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Instagram className="w-5 h-5" />
            </motion.a>
          </div>
        </div>
      </div>
    </footer>
  );
}
