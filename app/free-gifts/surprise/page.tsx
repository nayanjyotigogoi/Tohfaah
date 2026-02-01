"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navigation } from "@/components/navigation";
import { FloatingElements } from "@/components/floating-elements";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  Clock,
  Heart,
  Link as LinkIcon,
  Copy,
  Check,
  RotateCcw,
} from "lucide-react";

type Stage = "create" | "preview" | "share";

interface Memory {
  sender: string;
  receiver: string;
  title: string;
  message: string;
  date: string;
  time?: string | null;
}

export default function SurprisePage() {
  const [stage, setStage] = useState<Stage>("create");
  const [now, setNow] = useState(new Date());
  const [copied, setCopied] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const [memory, setMemory] = useState<Memory>({
    sender: "",
    receiver: "",
    title: "",
    message: "",
    date: "",
    time: "",
  });

  /* ================= RESET ================= */

  const resetAll = () => {
    setStage("create");
    setToken(null);
    setCopied(false);
    setMemory({
      sender: "",
      receiver: "",
      title: "",
      message: "",
      date: "",
      time: "",
    });
  };

  /* ================= CREATE → BACKEND ================= */

  const createMoment = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/free-gifts`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gift_type: "moment",
          recipient_name: memory.receiver,
          sender_name: memory.sender,
          gift_data: {
            title: memory.title,
            message: memory.message,
            date: memory.date,
            time: memory.time || null,
          },
        }),
      }
    );

    if (!res.ok) {
      alert("Failed to create moment");
      return;
    }

    const data = await res.json();
    setToken(data.token);
    setStage("preview");
  };

  /* ================= COUNTDOWN ================= */

  const targetDate = useMemo(() => {
    if (!memory.date) return null;
    if (!memory.time) return new Date(`${memory.date}T23:59:59`);
    return new Date(`${memory.date}T${memory.time}:00`);
  }, [memory.date, memory.time]);

  useEffect(() => {
    if (!targetDate) return;
    const i = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(i);
  }, [targetDate]);

  const diff = targetDate
    ? Math.max(targetDate.getTime() - now.getTime(), 0)
    : 0;

  const time = {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };

  const shareUrl = token
    ? `${process.env.NEXT_PUBLIC_APP_URL}/free-gifts/surprise/${token}`
    : "";

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-background">
      <FloatingElements density="low" />
      <Navigation />

      <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">

            {/* ================= CREATE ================= */}
            {stage === "create" && (
              <motion.div
                key="create"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <h1 className="text-3xl md:text-4xl font-light mb-2">
                    Create a <span className="italic text-primary">Moment</span>
                  </h1>
                  <p className="text-muted-foreground">
                    A day worth waiting for.
                  </p>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-xl space-y-5">
                  <Input
                    placeholder="Your name"
                    value={memory.sender}
                    onChange={(e) =>
                      setMemory({ ...memory, sender: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Who is this for?"
                    value={memory.receiver}
                    onChange={(e) =>
                      setMemory({ ...memory, receiver: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Why this day matters"
                    value={memory.title}
                    onChange={(e) =>
                      setMemory({ ...memory, title: e.target.value })
                    }
                  />
                  <Textarea
                    placeholder="Write the message they'll read..."
                    rows={4}
                    value={memory.message}
                    onChange={(e) =>
                      setMemory({ ...memory, message: e.target.value })
                    }
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="date"
                        className="pl-10"
                        value={memory.date}
                        onChange={(e) =>
                          setMemory({ ...memory, date: e.target.value })
                        }
                      />
                    </div>

                    <div className="relative opacity-50">
                      <Clock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="time"
                        className="pl-10"
                        value={memory.time || ""}
                        onChange={(e) =>
                          setMemory({
                            ...memory,
                            time: e.target.value || null,
                          })
                        }
                      />
                    </div>
                  </div>

                  <Button
                    className="w-full py-6 text-lg"
                    disabled={
                      !memory.sender ||
                      !memory.receiver ||
                      !memory.title ||
                      !memory.message ||
                      !memory.date
                    }
                    onClick={createMoment}
                  >
                    Preview Moment
                  </Button>
                </div>
              </motion.div>
            )}

            {/* ================= PREVIEW ================= */}
            {stage === "preview" && (
              <motion.div
                key="preview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="bg-white rounded-[32px] p-10 shadow-2xl text-center">
                  <div className="grid grid-cols-4 gap-4 mb-8">
                    {Object.entries(time).map(([k, v]) => (
                      <div key={k} className="bg-[#faf7f4] rounded-2xl py-5">
                        <motion.div
                          key={v}
                          initial={{ rotateX: 90, opacity: 0 }}
                          animate={{ rotateX: 0, opacity: 1 }}
                          transition={{ duration: 0.35 }}
                          className="text-4xl font-light font-mono tabular-nums"
                        >
                          {String(v).padStart(2, "0")}
                        </motion.div>
                        <div className="text-[10px] tracking-widest mt-3 text-muted-foreground">
                          {k.toUpperCase()}
                        </div>
                      </div>
                    ))}
                  </div>

                  <Heart className="w-10 h-10 text-primary fill-primary mx-auto mb-4" />
                  <h3 className="text-xl font-light mb-3">{memory.title}</h3>
                  <p className="text-muted-foreground mb-6">
                    {memory.message}
                  </p>
                  <p className="text-sm text-primary">— {memory.sender}</p>
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" onClick={resetAll} className="flex-1">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Start Over
                  </Button>

                  <Button onClick={() => setStage("share")} className="flex-1">
                    <LinkIcon className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </motion.div>
            )}

            {/* ================= SHARE ================= */}
            {stage === "share" && (
              <motion.div
                key="share"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6 text-center"
              >
                <Heart className="w-14 h-14 mx-auto text-primary fill-primary" />

                <p className="font-mono break-all text-sm bg-secondary p-3 rounded-lg">
                  <a
                    href={shareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    {shareUrl}
                  </a>
                </p>

                <button
                  onClick={copyLink}
                  className="flex items-center justify-center gap-2 text-sm text-primary mx-auto"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" /> Copy link
                    </>
                  )}
                </button>

                <Button variant="outline" onClick={resetAll}>
                  Create Another Moment
                </Button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
