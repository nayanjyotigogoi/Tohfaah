"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Heart, Share2 } from "lucide-react";

export default function PublicLetterPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [recipient, setRecipient] = useState("");
  const [sender, setSender] = useState("");
  const [content, setContent] = useState("");
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

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
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchGift();
  }, [token]);

  useEffect(() => {
    if (isTyping && displayedText.length < content.length) {
      const t = setTimeout(() => {
        setDisplayedText(content.slice(0, displayedText.length + 1));
      }, 50);
      return () => clearTimeout(t);
    } else if (displayedText.length >= content.length) {
      setIsTyping(false);
    }
  }, [isTyping, displayedText, content]);

  if (loading) return <p className="text-center mt-20">Loading letter…</p>;
  if (error) return <p className="text-center mt-20">This letter does not exist 💔</p>;

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-100 to-red-100">
      <Navigation />

      <div className="pt-28 px-4 max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-2xl p-8 md:p-12 font-serif">
          <div className="text-center mb-8">
            <Heart className="w-8 h-8 mx-auto text-rose-400 fill-current" />
            <p className="text-rose-400 text-sm">A letter for {recipient}</p>
          </div>

          <div className="text-xl leading-loose whitespace-pre-wrap">
            {displayedText}
            {isTyping && (
              <motion.span
                className="inline-block w-0.5 h-6 bg-rose-500 ml-1"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
            )}
          </div>

          {!isTyping && (
            <div className="mt-10 text-right">
              <p className="italic text-rose-500">With love,</p>
              <p className="text-2xl">{sender}</p>
            </div>
          )}

          {!isTyping && (
            <div className="mt-10 flex justify-center gap-4">
              <Button
                onClick={() => {
                  navigator.share?.({
                    title: "Love Letter",
                    text: "Someone sent you a love letter 💌",
                    url: window.location.href,
                  });
                }}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" onClick={() => router.push("/free-gifts")}>
                Create One
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
