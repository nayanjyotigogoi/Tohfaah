import React from "react";
import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

/* Fonts */
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

/* ✅ GLOBAL SEO + META */
export const metadata: Metadata = {
  metadataBase: new URL("https://tohfaah.com"),

  title: {
    default: "Tohfaah — Send a Feeling, Not Just a Gift",
    template: "%s | Tohfaah",
  },

  description:
    "Create and share emotional memory experiences. Tohfaah lets gifts unfold like interactive love stories.",

  applicationName: "Tohfaah",
  generator: "Tohfaah",
  keywords: [
    "digital gifts",
    "emotional gifts",
    "love gifts",
    "memory gifts",
    "romantic experiences",
    "online gifting",
    "tohfaah",
  ],

  authors: [{ name: "Tohfaah" }],
  creator: "Tohfaah",
  publisher: "Tohfaah",

  robots: {
    index: true,
    follow: true,
  },

  /* 🌍 Open Graph (WhatsApp, Facebook, LinkedIn) */
  openGraph: {
    type: "website",
    url: "https://tohfaah.com",
    title: "Tohfaah — Send a Feeling, Not Just a Gift",
    description:
      "Create and share emotional memory experiences. Gifts that unfold like love stories.",
    siteName: "Tohfaah",
    images: [
      {
        url: "/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "Tohfaah — Emotional Digital Gifts",
      },
    ],
  },

  /* 🐦 Twitter */
  twitter: {
    card: "summary_large_image",
    title: "Tohfaah — Send a Feeling, Not Just a Gift",
    description:
      "Create emotional digital gifts that unfold like interactive love stories.",
    images: ["/android-chrome-512x512.png"],
  },

  /* 📱 Icons & Favicons */
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-light-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "android-chrome",
        url: "/android-chrome-192x192.png",
      },
      {
        rel: "android-chrome",
        url: "/android-chrome-512x512.png",
      },
    ],
  },

  /* 🧭 PWA / Mobile */
  manifest: "/site.webmanifest",
  themeColor: "#ec4899", // Tailwind pink-500
};

/* ✅ ROOT LAYOUT */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${cormorant.variable} ${inter.variable} font-sans antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
