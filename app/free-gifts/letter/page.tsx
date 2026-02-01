"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Share2,
  Sparkles,
  Copy,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";
import { Playfair_Display, Dancing_Script } from "next/font/google";

const playfair = Playfair_Display({ subsets: ["latin"] });
const dancing = Dancing_Script({ subsets: ["latin"] });

type Stage = "create" | "experience" | "share";

/* ---------------- PAPER CONFIG ---------------- */
const PAPER_STYLES = [
  { id: "classic", src: "/letters/paper-1.jpg", aspect: "3/4", maxHeight: 520, padding: { x: 12, y: 14 } },
  { id: "scallop", src: "/letters/paper-2.jpg", aspect: "3/4", maxHeight: 520, padding: { x: 14, y: 16 } },
  { id: "vintage", src: "/letters/paper-3.jpg", aspect: "3/4", maxHeight: 560, padding: { x: 13, y: 18 } },
  { id: "rose", src: "/letters/paper-4.jpg", aspect: "3/4", maxHeight: 540, padding: { x: 12, y: 16 } },
  { id: "cream", src: "/letters/paper-5.jpg", aspect: "3/4", maxHeight: 500, padding: { x: 11, y: 15 } },
  { id: "parchment", src: "/letters/paper-6.jpg", aspect: "3/4", maxHeight: 560, padding: { x: 15, y: 18 } },
  { id: "love", src: "/letters/paper-7.jpg", aspect: "3/4", maxHeight: 520, padding: { x: 12, y: 17 } },
  { id: "minimal", src: "/letters/paper-8.jpg", aspect: "3/4", maxHeight: 500, padding: { x: 10, y: 12 } },
  { id: "elegant", src: "/letters/paper-9.jpg", aspect: "3/4", maxHeight: 560, padding: { x: 14, y: 18 } },
  { id: "valentine", src: "/letters/paper-10.jpg", aspect: "3/4", maxHeight: 520, padding: { x: 13, y: 16 } },
];

const MAX_CHARS = 260;

export default function LoveLetterPage() {
  const [stage, setStage] = useState<Stage>("create");

  const [recipientName, setRecipientName] = useState("");
  const [senderName, setSenderName] = useState("");
  const [content, setContent] = useState("");
  const [paperId, setPaperId] = useState("classic");

  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showEnvelope, setShowEnvelope] = useState(true);
  const [envelopeOpened, setEnvelopeOpened] = useState(false);

  const [shareToken, setShareToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const bodyRef = useRef<HTMLDivElement>(null);

  const paper = useMemo(
    () => PAPER_STYLES.find((p) => p.id === paperId)!,
    [paperId]
  );

  const now = useMemo(() => new Date(), []);
  const dateStr = now.toLocaleDateString();
  const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const BODY_HEIGHT = paper.maxHeight * 0.45;

  /* ---------------- CREATE LETTER (🔥 FIX) ---------------- */
  const createLetter = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/free-gifts`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gift_type: "letter",
          recipient_name: recipientName,
          sender_name: senderName,
          gift_data: {
            content,
            paper: paperId,
          },
        }),
      }
    );

    if (!res.ok) {
      alert("Failed to create letter");
      return;
    }

    const data = await res.json();
    setShareToken(data.token); // ✅ THIS WAS MISSING
    setStage("experience");
  };

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

  /* ---------------- COPY ---------------- */
  const handleCopy = async () => {
    if (!shareToken) return;
    const url = `${process.env.NEXT_PUBLIC_APP_URL}/free-gifts/letter/${shareToken}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /* ---------------- RESET ---------------- */
  const handleReset = () => {
    setStage("create");
    setRecipientName("");
    setSenderName("");
    setContent("");
    setDisplayedText("");
    setIsTyping(false);
    setShowEnvelope(true);
    setEnvelopeOpened(false);
    setShareToken(null);
    setCopied(false);
  };

  /* ================= EXPERIENCE ================= */
  if (stage === "experience") {
    return (
      <main className="bg-[#f3ebe2]">
        <Navigation />

        <div className="flex flex-col items-center px-4 py-36 gap-8">
          <AnimatePresence>
            {showEnvelope && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, y: -40 }}
              >
                <motion.button
                  onClick={() => {
                    setEnvelopeOpened(true);
                    setTimeout(() => {
                      setShowEnvelope(false);
                      setIsTyping(true);
                    }, 1200);
                  }}
                >
                  <div className="relative w-64 h-44">
                    <img src="/letters/envelope-front.png" className="absolute inset-0" />
                    <motion.img
                      src="/letters/envelope-front.png"
                      className="absolute inset-0 origin-top"
                      animate={envelopeOpened ? { rotateX: -180 } : {}}
                      transition={{ duration: 1 }}
                    />
                    <img src="/letters/envelope-front.png" className="absolute inset-0" />
                  </div>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {!showEnvelope && (
            <>
              <div
                className={`relative aspect-[${paper.aspect}]`}
                style={{
                  maxHeight: paper.maxHeight,
                  width: "100%",
                  maxWidth: 520,
                  backgroundImage: `url(${paper.src})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "contain",
                  backgroundPosition: "center",
                }}
              >
                <div
                  className="absolute inset-0 text-[#7b1e1e] flex flex-col"
                  style={{ padding: `${paper.padding.y}% ${paper.padding.x}%` }}
                >
                  <p className={`mb-3 text-lg ${playfair.className}`} style={{ paddingLeft: "58px" }}>
                    Dear {recipientName},
                  </p>

                  <div
                    ref={bodyRef}
                    style={{ maxHeight: BODY_HEIGHT, paddingLeft: "58px", paddingRight: "58px" }}
                    className={`overflow-hidden whitespace-pre-wrap leading-loose text-xl ${dancing.className}`}
                  >
                    {displayedText}
                  </div>

                  {!isTyping && (
                    <div className="mt-3 text-right text-sm" style={{ paddingRight: "68px" }}>
                      <p>~ {senderName}</p>
                      <p>{dateStr}, {timeStr}</p>
                    </div>
                  )}
                </div>
              </div>

              {!isTyping && (
                <div className="flex gap-4">
                  <Button variant="outline" onClick={handleReset}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Start Again
                  </Button>
                  <Button onClick={() => setStage("share")}>
                    <Share2 className="w-5 h-5 mr-2" />
                    Share
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    );
  }

  /* ================= SHARE ================= */
  if (stage === "share") {
    return (
      <main className="bg-[#f3ebe2]">
        <Navigation />

        <div className="pt-28 pb-20 px-4 max-w-xl mx-auto space-y-6 text-center">
          <h2 className="text-2xl font-light">
            Letter <span className="italic text-primary">Ready</span>
          </h2>

          <div className="flex items-center gap-3">
            <div className="flex-1 p-4 bg-secondary rounded-xl font-mono text-sm break-all">
              {`${process.env.NEXT_PUBLIC_APP_URL}/free-gifts/letter/${shareToken}`}
            </div>
            <button
              onClick={handleCopy}
              className="p-3 rounded-full border border-border hover:bg-muted transition"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>

          {copied && (
            <p className="text-xs text-muted-foreground">
              Link copied — paste it anywhere 💌
            </p>
          )}

          <Button variant="outline" onClick={handleReset}>
            Create Another
          </Button>
        </div>
      </main>
    );
  }

  /* ================= CREATE ================= */
  return (
    <main className="min-h-screen bg-[#f3ebe2]">
      <Navigation />

      <div className="pt-28 pb-20 px-4 max-w-xl mx-auto">
        <Link href="/free-gifts" className="inline-flex items-center mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Link>

        <Input placeholder="Recipient name" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} />
        <Input placeholder="Your name" value={senderName} onChange={(e) => setSenderName(e.target.value)} className="mt-4" />
        <Textarea placeholder="Write your letter..." value={content} maxLength={MAX_CHARS} onChange={(e) => setContent(e.target.value)} rows={6} className={`mt-4 ${dancing.className}`} />

        <p className="text-sm text-right mt-1">{content.length}/{MAX_CHARS}</p>

        <div className="grid grid-cols-5 gap-3 mt-6">
          {PAPER_STYLES.map((p) => (
            <button key={p.id} onClick={() => setPaperId(p.id)} className={`border rounded overflow-hidden ${paperId === p.id ? "ring-2 ring-rose-400" : ""}`}>
              <img src={p.src} className="aspect-[3/4] object-cover" />
            </button>
          ))}
        </div>

        <Button onClick={createLetter} className="w-full mt-6" disabled={!recipientName || !senderName || !content}>
          <Sparkles className="w-4 h-4 mr-2" />
          Seal the Letter
        </Button>
      </div>
    </main>
  );
}
