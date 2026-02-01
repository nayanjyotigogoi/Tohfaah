"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Share2, Copy, Check } from "lucide-react";
import { Playfair_Display, Dancing_Script } from "next/font/google";

const playfair = Playfair_Display({ subsets: ["latin"] });
const dancing = Dancing_Script({ subsets: ["latin"] });

/* ---------------- PAPER CONFIG ---------------- */
const PAPER_STYLES = [
  { id: "classic", aspect: "3/4", maxHeight: 520, padding: { x: 12, y: 14 } },
  { id: "scallop", aspect: "3/4", maxHeight: 520, padding: { x: 14, y: 16 } },
  { id: "vintage", aspect: "3/4", maxHeight: 560, padding: { x: 13, y: 18 } },
  { id: "rose", aspect: "3/4", maxHeight: 540, padding: { x: 12, y: 16 } },
  { id: "cream", aspect: "3/4", maxHeight: 500, padding: { x: 11, y: 15 } },
  { id: "parchment", aspect: "3/5", maxHeight: 560, padding: { x: 15, y: 18 } },
  { id: "love", aspect: "3/4", maxHeight: 520, padding: { x: 12, y: 17 } },
  { id: "minimal", aspect: "3/4", maxHeight: 500, padding: { x: 10, y: 12 } },
  { id: "elegant", aspect: "3/4", maxHeight: 560, padding: { x: 14, y: 18 } },
  { id: "valentine", aspect: "3/4", maxHeight: 520, padding: { x: 13, y: 16 } },
];

export default function PublicLetterPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [recipient, setRecipient] = useState("");
  const [sender, setSender] = useState("");
  const [content, setContent] = useState("");
  const [paperId, setPaperId] = useState("classic");

  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [envelopeOpen, setEnvelopeOpen] = useState(false);

  const [copied, setCopied] = useState(false);

  const bodyRef = useRef<HTMLDivElement>(null);

  const paper = useMemo(
    () => PAPER_STYLES.find((p) => p.id === paperId) ?? PAPER_STYLES[0],
    [paperId]
  );

  const now = useMemo(() => new Date(), []);
  const dateStr = now.toLocaleDateString();
  const timeStr = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const BODY_HEIGHT = paper.maxHeight * 0.45;
  const shareUrl =
    typeof window !== "undefined" ? window.location.href : "";

  /* ---------------- FETCH LETTER ---------------- */
  useEffect(() => {
    const fetchGift = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/free-gifts/${token}`,
          { cache: "no-store" }
        );
        if (!res.ok) throw new Error();

        const data = await res.json();
        if (data.gift_type !== "letter") throw new Error();

        setRecipient(data.recipient_name);
        setSender(data.sender_name);
        setContent(data.gift_data.content);
        setPaperId(data.gift_data.paper || "classic");
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchGift();
  }, [token]);

  /* ---------------- TYPE EFFECT ---------------- */
  useEffect(() => {
    if (!isTyping) return;

    if (displayedText.length >= content.length) {
      setIsTyping(false);
      return;
    }

    const next = content.slice(0, displayedText.length + 1);
    setDisplayedText(next);

    requestAnimationFrame(() => {
      if (!bodyRef.current) return;
      if (bodyRef.current.scrollHeight > BODY_HEIGHT) {
        setDisplayedText(displayedText);
        setIsTyping(false);
      }
    });
  }, [isTyping, displayedText, content, BODY_HEIGHT]);

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "A Love Letter 💌",
        text: "Someone sent you a love letter",
        url: shareUrl,
      });
    } else {
      await handleCopy();
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading)
    return <p className="text-center mt-20">Loading letter…</p>;

  if (error)
    return <p className="text-center mt-20">This letter does not exist 💔</p>;

  return (
    <main className="bg-[#f3ebe2]">
      <Navigation />

      <div className="flex flex-col items-center px-4 py-36 gap-8">
        {/* ---------------- ENVELOPE ---------------- */}
        <AnimatePresence>
          {!envelopeOpen && (
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ delay: 1.8, duration: 0.4 }}
              onAnimationComplete={() => {
                setEnvelopeOpen(true);
                setIsTyping(true);
              }}
              className="relative w-64 h-44"
            >
              <img src="/letters/envelope-back.png" className="absolute inset-0" />
              <motion.img
                src="/letters/envelope-flap.png"
                className="absolute inset-0 origin-top"
                initial={{ rotateX: 0 }}
                animate={{ rotateX: -180 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
              />
              <img src="/letters/envelope-front.png" className="absolute inset-0" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ---------------- LETTER ---------------- */}
        {envelopeOpen && (
          <>
            <div
              className={`relative aspect-[${paper.aspect}]`}
              style={{
                maxHeight: paper.maxHeight,
                width: "100%",
                maxWidth: 520,
                backgroundImage: `url(/letters/paper-${paperId === "classic" ? "1" : paperId}.jpg)`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "contain",
                backgroundPosition: "center",
              }}
            >
              <div
                className="absolute inset-0 text-[#7b1e1e] flex flex-col"
                style={{
                  padding: `${paper.padding.y}% ${paper.padding.x}%`,
                }}
              >
                <p
                  className={`mb-3 text-lg ${playfair.className}`}
                  style={{ paddingLeft: "58px" }}
                >
                  Dear {recipient},
                </p>

                <div
                  ref={bodyRef}
                  style={{
                    maxHeight: BODY_HEIGHT,
                    paddingLeft: "58px",
                    paddingRight: "58px",
                  }}
                  className={`overflow-hidden whitespace-pre-wrap leading-loose text-xl ${dancing.className}`}
                >
                  {displayedText}
                </div>

                {!isTyping && (
                  <div
                    className="mt-3 text-right text-sm"
                    style={{ paddingRight: "68px" }}
                  >
                    <p>~ {sender}</p>
                    <p>{dateStr}, {timeStr}</p>
                  </div>
                )}
              </div>
            </div>

            {/* ---------------- SHARE + COPY ---------------- */}
            {!isTyping && (
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleShare}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition"
                  >
                    <Share2 className="w-4 h-4" />
                    Share Letter
                  </button>

                  <button
                    onClick={handleCopy}
                    className="p-3 rounded-full border border-border hover:bg-muted transition"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {copied && (
                  <p className="text-xs text-muted-foreground">
                    Link copied — share the love 💌
                  </p>
                )}
              </div>
            )}

            {/* ---------------- CTA ---------------- */}
            {!isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="mt-8 rounded-2xl bg-gradient-to-br from-rose-100 via-pink-100 to-background border p-8 text-center space-y-4 max-w-xl"
              >
                <h3 className="text-xl md:text-2xl font-light">
                  Want to send a letter like this?
                </h3>
                <p className="text-muted-foreground">
                  Write something meaningful and surprise someone 💌
                </p>
                <button
                  onClick={() => router.push("/free-gifts/letter")}
                  className="px-8 py-4 rounded-full bg-primary text-primary-foreground text-lg shadow-md"
                >
                  Create Your Own Letter
                </button>
                <p className="text-xs text-muted-foreground">
                  No signup required 💗
                </p>
              </motion.div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
